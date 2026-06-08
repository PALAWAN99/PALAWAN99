"""
FastAPI backend for Thai National ID Card Reader.
Provides REST API and WebSocket for DE-620 smart card reader communication.
"""

from __future__ import annotations

from pathlib import Path

from dotenv import load_dotenv

# Monorepo: single `.env` at repository root
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

import asyncio
import csv
import io
import json
import logging
import os
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Optional

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from card_reader import (
    list_readers,
    read_card,
    read_photo_only,
    create_card_monitor,
    PYSCARD_AVAILABLE,
    MOCK_MODE,
    VENDOR_AVAILABLE,
)
from models import CardReadResponse, ReadersResponse, CardEventMessage, DiagnosticInfo
from usb_detect import detect_de620, PYUSB_AVAILABLE
from route_log import schedule_route_log


connected_websockets: set[WebSocket] = set()
card_event_sse_queues: set[asyncio.Queue[str]] = set()


class RouteLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        if path.startswith("/api/logs"):
            return await call_next(request)

        start = time.perf_counter()
        response = await call_next(request)
        duration_ms = int((time.perf_counter() - start) * 1000)
        client_host = request.client.host if request.client else None

        schedule_route_log(
            method=request.method,
            path=path,
            status_code=response.status_code,
            duration_ms=duration_ms,
            client_host=client_host,
            user_agent=request.headers.get("user-agent"),
        )
        return response
card_monitor = None


async def broadcast_event(event: str, reader: str):
    """Broadcast card event to all connected WebSocket clients."""
    message = CardEventMessage(
        event=event,
        reader=reader,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    payload = message.model_dump_json()
    disconnected = set()
    for ws in connected_websockets:
        try:
            await ws.send_text(payload)
        except Exception:
            disconnected.add(ws)
    connected_websockets.difference_update(disconnected)
    for queue in list(card_event_sse_queues):
        try:
            queue.put_nowait(payload)
        except asyncio.QueueFull:
            pass


def _card_event_callback(event: str, reader: str):
    """Sync callback from CardMonitor, schedules async broadcast."""
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(broadcast_event(event, reader))
    except RuntimeError:
        pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    global card_monitor
    try:
        card_monitor = create_card_monitor(_card_event_callback)
    except Exception:
        card_monitor = None
    yield
    if card_monitor:
        card_monitor.deleteObservers()
    if VENDOR_AVAILABLE:
        try:
            from vendor_protocol import close_reader
            close_reader()
        except Exception:
            pass


app = FastAPI(
    title="Thai ID Card Reader API",
    description="REST API for reading Thai National ID cards via DE-620 smart card reader",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(RouteLogMiddleware)
def _cors_origins() -> list[str]:
    raw = os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,https://lib.kku.ac.th",
    )
    return [o.strip() for o in raw.split(",") if o.strip()]


app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/readers", response_model=ReadersResponse)
async def get_readers():
    """List all connected smart card readers."""
    try:
        reader_list = list_readers()
        return ReadersResponse(readers=reader_list)
    except Exception as e:
        return ReadersResponse(readers=[])


@app.post("/api/readers/reset")
async def reset_reader_connection():
    """
    Release the singleton USB vendor reader handle so the next request
    opens a fresh connection. Use before a full UI reload when recovering
    from device errors.
    """
    try:
        from vendor_protocol import close_reader

        close_reader()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.get("/api/read-card", response_model=CardReadResponse)
async def api_read_card(
    reader: Optional[str] = None, skip_photo: bool = False
):
    """Read data from the inserted Thai ID card. Use skip_photo=true for text only."""
    try:
        data = read_card(reader_name=reader, skip_photo=skip_photo)
        return CardReadResponse(success=True, data=data)
    except Exception as e:
        return CardReadResponse(success=False, error=str(e))


@app.get("/api/read-card-stream")
async def api_read_card_stream(reader: Optional[str] = None):
    """Read card data with SSE progress events, emitting each field as it's read."""
    from card_reader import read_card_with_progress

    async def event_generator():
        import queue
        import threading

        progress_queue: queue.Queue = queue.Queue()
        result_holder: list = [None, None]

        def _cb(step, total, msg, *, field=None, value=None):
            progress_queue.put((step, total, msg, field, value))

        def read_worker():
            try:
                data = read_card_with_progress(
                    progress_callback=_cb,
                    reader_name=reader,
                    skip_photo=False,
                )
                if not data.photo_base64:
                    try:
                        photo = read_photo_only(reader_name=reader)
                        if photo:
                            data = data.model_copy(update={"photo_base64": photo})
                    except Exception as photo_exc:
                        logging.warning("Photo read after stream failed: %s", photo_exc)
                result_holder[0] = data
            except Exception as e:
                result_holder[1] = str(e)
            finally:
                progress_queue.put(None)

        thread = threading.Thread(target=read_worker, daemon=True)
        thread.start()

        while True:
            await asyncio.sleep(0.02)
            try:
                item = progress_queue.get_nowait()
            except queue.Empty:
                continue
            if item is None:
                break
            step, total, msg, field, value = item
            pct = int((step / total) * 100)
            evt: dict = {"progress": pct, "step": step, "total": total, "message": msg}
            if field and value is not None:
                evt["field"] = field
                evt["value"] = value
            yield f"data: {json.dumps(evt, ensure_ascii=False)}\n\n"

        thread.join(timeout=5)
        if result_holder[1]:
            yield f"data: {json.dumps({'error': result_holder[1]})}\n\n"
        elif result_holder[0]:
            yield f"data: {json.dumps({'done': True, 'data': result_holder[0].model_dump()}, ensure_ascii=False)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/api/read-card/photo")
async def api_read_photo(reader: Optional[str] = None):
    """Read only the photo from the card, returns base64 JPEG."""
    try:
        photo = read_photo_only(reader_name=reader)
        if photo:
            return {"success": True, "photo_base64": photo}
        return {"success": False, "error": "No photo data found"}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.get("/api/rfid/read")
async def api_rfid_read():
    """Read RFID card UID via contactless interface."""
    from card_reader import read_rfid_pcsc, PYSCARD_AVAILABLE
    from vendor_protocol import get_reader, VendorProtocolError

    # 1. Try PC/SC first (standard CCID/default driver compatible)
    if PYSCARD_AVAILABLE:
        try:
            pcsc_result = read_rfid_pcsc()
            if pcsc_result:
                return pcsc_result
        except Exception as e:
            logging.debug("RFID PC/SC read error: %s", e)

    # 2. Fall back to Vendor Protocol (direct USB/pyusb)
    reader = get_reader()
    for attempt in range(2):
        try:
            if not reader.is_connected:
                reader.open()
            result = reader.read_rfid_uid()
            return result
        except VendorProtocolError as e:
            if attempt == 0 and ("No such device" in str(e) or "not connected" in str(e).lower()):
                reader.close()
                continue
            err_msg = str(e)
            if "NO_TAG_ERROR" in err_msg or "POLLING_ERROR" in err_msg:
                return {"success": False, "error": "ไม่พบบัตร RFID — กรุณาวางบัตรบนเครื่องอ่าน"}
            if "No such device" in err_msg:
                return {"success": False, "error": "เครื่องอ่านหลุดการเชื่อมต่อ — กรุณาเสียบใหม่"}
            return {"success": False, "error": str(e)}
        except Exception as e:
            if attempt == 0 and "No such device" in str(e):
                reader.close()
                continue
            
            # If pyusb has no backend driver (libusb) but PC/SC is available, it means the hardware
            # is connected via CCID/PC/SC driver, so "No backend available" is expected.
            # In this case, return "no card found" to the user instead of driver error.
            if "No backend available" in str(e):
                if PYSCARD_AVAILABLE:
                    return {"success": False, "error": "ไม่พบบัตร RFID — กรุณาวางบัตรบนเครื่องอ่าน"}
                return {"success": False, "error": "กรุณาติดตั้งไดรเวอร์ USB หรือสลับไปใช้โหมด PC/SC"}
                
            return {"success": False, "error": f"RFID read error: {e}"}
            
    return {"success": False, "error": "ไม่สามารถเชื่อมต่อเครื่องอ่านได้"}


@app.get("/api/export/json")
async def export_json(reader: Optional[str] = None):
    """Export card data as downloadable JSON file."""
    try:
        data = read_card(reader_name=reader)
        export_data = data.model_dump()
        export_data.pop("photo_base64", None)
        content = json.dumps(export_data, ensure_ascii=False, indent=2)
        filename = f"thai_id_{data.cid}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        return StreamingResponse(
            io.BytesIO(content.encode("utf-8")),
            media_type="application/json",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.get("/api/export/csv")
async def export_csv(reader: Optional[str] = None):
    """Export card data as downloadable CSV file."""
    try:
        data = read_card(reader_name=reader)
        export_data = data.model_dump()
        export_data.pop("photo_base64", None)

        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=export_data.keys())
        writer.writeheader()
        writer.writerow(export_data)
        content = output.getvalue()

        filename = f"thai_id_{data.cid}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        return StreamingResponse(
            io.BytesIO(content.encode("utf-8-sig")),
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except Exception as e:
        return {"success": False, "error": str(e)}


def _list_pcsc_readers() -> list[str]:
    if not PYSCARD_AVAILABLE:
        return []
    try:
        from smartcard.System import readers

        return [str(r) for r in readers()]
    except Exception:
        return []


@app.get("/api/diagnostic", response_model=DiagnosticInfo)
async def get_diagnostic():
    """Diagnose DE-620 reader connection, USB mode, and PC/SC availability."""
    try:
        usb_info, pcsc_readers_list = await asyncio.wait_for(
            asyncio.gather(
                asyncio.to_thread(detect_de620),
                asyncio.to_thread(_list_pcsc_readers),
            ),
            timeout=5.0,
        )
    except asyncio.TimeoutError:
        return DiagnosticInfo(
            usb_detected=False,
            pcsc_readers=[],
            pcsc_available=PYSCARD_AVAILABLE,
            pyusb_available=PYUSB_AVAILABLE,
            vendor_protocol_available=VENDOR_AVAILABLE,
            mock_mode=MOCK_MODE,
            message=(
                "การตรวจสอบเครื่องอ่านใช้เวลานานเกินไป (timeout 5s). "
                "ลองถอดเสียบ USB ใหม่ แล้วรีสตาร์ท Python server ที่พอร์ต 8000"
            ),
        )

    if usb_info:
        return DiagnosticInfo(
            usb_detected=True,
            usb_vid=f"0x{usb_info.vid:04x}",
            usb_pid=f"0x{usb_info.pid:04x}",
            usb_product=usb_info.product,
            usb_serial=usb_info.serial,
            usb_mode=usb_info.mode.value,
            usb_interface_class=f"0x{usb_info.interface_class:02x}",
            pcsc_readers=pcsc_readers_list,
            pcsc_available=PYSCARD_AVAILABLE,
            pyusb_available=PYUSB_AVAILABLE,
            vendor_protocol_available=VENDOR_AVAILABLE,
            mock_mode=MOCK_MODE,
            message=usb_info.message,
        )

    return DiagnosticInfo(
        usb_detected=False,
        pcsc_readers=pcsc_readers_list,
        pcsc_available=PYSCARD_AVAILABLE,
        pyusb_available=PYUSB_AVAILABLE,
        vendor_protocol_available=VENDOR_AVAILABLE,
        mock_mode=MOCK_MODE,
        message=(
            "No DUALi reader found on USB. "
            "Please connect the DE-620 and try again."
        ),
    )


@app.get("/api/test-apdu")
async def test_apdu():
    """Quick diagnostic: SELECT card and read CID to verify reader works."""
    from vendor_protocol import (
        get_reader as _get_reader, close_reader as _close_reader,
    )
    from apdu_commands import SELECT_THAI_CARD, COMMANDS
    import time as _time

    results = []
    try:
        _close_reader()
        _time.sleep(0.5)
        reader = _get_reader()
        reader.open()
        results.append(f"Reader: connected={reader.is_connected}")

        try:
            reader.ic_power_off()
        except Exception:
            pass
        _time.sleep(0.3)
        reader._flush_input()

        atr = reader.ic_power_on()
        results.append(f"ATR: {atr.hex()}")
        _time.sleep(0.3)

        data, sw1, sw2 = reader.send_apdu_robust(
            SELECT_THAI_CARD, select_apdu=SELECT_THAI_CARD
        )
        results.append(f"SELECT: SW={sw1:02x}{sw2:02x}")

        data, sw1, sw2 = reader.send_apdu_robust(
            COMMANDS["cid"], select_apdu=SELECT_THAI_CARD
        )
        if sw1 == 0x90:
            cid = data.decode("ascii").strip()
            results.append(f"CID: {cid}")
        else:
            results.append(f"CID: SW={sw1:02x}{sw2:02x}")

        reader.ic_power_off()
    except Exception as e:
        results.append(f"ERROR: {e}")

    return {"results": results}


@app.get("/api/card-events-stream")
async def api_card_events_stream():
    """SSE fallback for card insert/remove when WebSocket is blocked by a reverse proxy."""
    queue: asyncio.Queue[str] = asyncio.Queue(maxsize=64)
    card_event_sse_queues.add(queue)

    async def event_generator():
        try:
            yield ": ok\n\n"
            while True:
                payload = await queue.get()
                yield f"data: {payload}\n\n"
        finally:
            card_event_sse_queues.discard(queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.websocket("/ws/card-events")
async def websocket_card_events(websocket: WebSocket):
    """WebSocket endpoint for real-time card insert/remove events."""
    await websocket.accept()
    connected_websockets.add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connected_websockets.discard(websocket)
    except Exception:
        connected_websockets.discard(websocket)
