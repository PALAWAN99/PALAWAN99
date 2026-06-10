#!/usr/bin/env python3
"""
Chrome Native Messaging host for KKU Smart Access card reader.
Reuses backend/card_reader.py (DUALi DE-620, PC/SC, vendor protocol).
"""
from __future__ import annotations

import json
import os
import struct
import sys
import threading
import traceback
from datetime import datetime, timezone
from pathlib import Path


def _native_log_path() -> Path:
    appdata = os.environ.get("APPDATA") or os.environ.get("HOME") or "/tmp"
    return Path(appdata) / "KKU-Card-Bridge" / "native-host.log"


def _log(msg: str) -> None:
    try:
        path = _native_log_path()
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a", encoding="utf-8") as fh:
            fh.write(f"{datetime.now(timezone.utc).isoformat()} {msg}\n")
    except Exception:
        pass


def _repo_root() -> Path:
    env = os.environ.get("KKU_SMART_ACCESS_ROOT")
    if env:
        return Path(env)
    here = Path(__file__).resolve().parent
    portable = here.parent.parent
    if (portable / "backend" / "requirements.txt").is_file():
        return portable
    return here.parents[2]


# Chrome does not pass env; set package root before backend imports.
if "KKU_SMART_ACCESS_ROOT" not in os.environ:
    os.environ["KKU_SMART_ACCESS_ROOT"] = str(_repo_root())

REPO_ROOT = _repo_root()
BACKEND = REPO_ROOT / "backend"

_backend_lock = threading.Lock()
_backend_loaded = False
_backend_error: str | None = None
card_monitor = None
monitor_lock = threading.Lock()


def _load_backend() -> None:
    global _backend_error, _backend_loaded
    with _backend_lock:
        if _backend_loaded or _backend_error is not None:
            return
        try:
            if str(BACKEND) not in sys.path:
                sys.path.insert(0, str(BACKEND))
            from dotenv import load_dotenv

            load_dotenv(REPO_ROOT / ".env")
            import card_reader  # noqa: F401
            _backend_loaded = True
            _log(f"backend loaded from {BACKEND}")
        except Exception as exc:
            _backend_error = str(exc)
            _log(f"backend import failed: {exc}\n{traceback.format_exc()}")


def _backend_unavailable() -> dict | None:
    _load_backend()
    if _backend_error:
        return {
            "error": (
                f"Card reader backend failed to load: {_backend_error}. "
                "On Windows run Install-Windows.bat (Python venv + pyscard)."
            )
        }
    return None


def _read_message() -> dict | None:
    raw_len = sys.stdin.buffer.read(4)
    if not raw_len:
        return None
    length = struct.unpack("=I", raw_len)[0]
    data = sys.stdin.buffer.read(length)
    return json.loads(data.decode("utf-8"))


def _send_message(payload: dict) -> None:
    encoded = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    sys.stdout.buffer.write(struct.pack("=I", len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()


def _get_backend():
    from card_reader import (  # noqa: E402
        MOCK_MODE,
        PYSCARD_AVAILABLE,
        PYUSB_AVAILABLE,
        VENDOR_AVAILABLE,
        create_card_monitor,
        list_readers,
        read_card,
        read_photo_only,
    )
    from usb_detect import detect_de620  # noqa: E402

    try:
        from smartcard.System import readers as pcsc_readers_fn  # noqa: E402
    except Exception:
        pcsc_readers_fn = None

    return {
        "MOCK_MODE": MOCK_MODE,
        "PYSCARD_AVAILABLE": PYSCARD_AVAILABLE,
        "PYUSB_AVAILABLE": PYUSB_AVAILABLE,
        "VENDOR_AVAILABLE": VENDOR_AVAILABLE,
        "create_card_monitor": create_card_monitor,
        "list_readers": list_readers,
        "read_card": read_card,
        "read_photo_only": read_photo_only,
        "detect_de620": detect_de620,
        "pcsc_readers_fn": pcsc_readers_fn,
    }


def _list_pcsc_readers(pcsc_readers_fn) -> list[str]:
    if not pcsc_readers_fn:
        return []
    try:
        return [str(r) for r in pcsc_readers_fn()]
    except Exception:
        return []


def _diagnostic(b) -> dict:
    try:
        usb_info = b["detect_de620"]()
        pcsc_list = _list_pcsc_readers(b["pcsc_readers_fn"])
    except Exception as exc:
        return {
            "usb_detected": False,
            "pcsc_readers": [],
            "pcsc_available": b["PYSCARD_AVAILABLE"],
            "pyusb_available": b["PYUSB_AVAILABLE"],
            "vendor_protocol_available": b["VENDOR_AVAILABLE"],
            "mock_mode": b["MOCK_MODE"],
            "message": f"Diagnostic error: {exc}",
        }

    if usb_info:
        return {
            "usb_detected": True,
            "usb_vid": f"0x{usb_info.vid:04x}",
            "usb_pid": f"0x{usb_info.pid:04x}",
            "usb_product": usb_info.product,
            "usb_serial": usb_info.serial,
            "usb_mode": usb_info.mode.value,
            "usb_interface_class": f"0x{usb_info.interface_class:02x}",
            "pcsc_readers": pcsc_list,
            "pcsc_available": b["PYSCARD_AVAILABLE"],
            "pyusb_available": b["PYUSB_AVAILABLE"],
            "vendor_protocol_available": b["VENDOR_AVAILABLE"],
            "mock_mode": b["MOCK_MODE"],
            "message": usb_info.message,
        }

    return {
        "usb_detected": False,
        "pcsc_readers": pcsc_list,
        "pcsc_available": b["PYSCARD_AVAILABLE"],
        "pyusb_available": b["PYUSB_AVAILABLE"],
        "vendor_protocol_available": b["VENDOR_AVAILABLE"],
        "mock_mode": b["MOCK_MODE"],
        "message": "No DUALi reader found on USB. Connect DE-620 and retry.",
    }


def _card_event_callback(event: str, reader: str) -> None:
    _send_message(
        {
            "type": "cardEvent",
            "event": event,
            "reader": reader,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    )


def _start_monitor(b) -> None:
    global card_monitor
    with monitor_lock:
        if card_monitor is not None:
            return
        card_monitor = b["create_card_monitor"](_card_event_callback)


def _stop_monitor(b) -> None:
    global card_monitor
    with monitor_lock:
        if card_monitor is not None:
            try:
                card_monitor.deleteObservers()
            except Exception:
                pass
            card_monitor = None
    if b["VENDOR_AVAILABLE"]:
        try:
            from vendor_protocol import close_reader

            close_reader()
        except Exception:
            pass


def _read_rfid_uid(b) -> dict:
    # 1. Try PC/SC first (standard CCID/default driver compatible)
    if b["PYSCARD_AVAILABLE"]:
        try:
            from card_reader import read_rfid_pcsc
            pcsc_result = read_rfid_pcsc()
            if pcsc_result:
                return pcsc_result
        except Exception as e:
            _log(f"RFID PC/SC read error: {e}")

    # 2. Fall back to Vendor Protocol (direct USB/pyusb)
    from vendor_protocol import VendorProtocolError, get_reader
    try:
        reader = get_reader()
    except Exception as e:
        if "No backend available" in str(e):
            if b["PYSCARD_AVAILABLE"]:
                return {"success": False, "error": "ไม่พบบัตร RFID — กรุณาวางบัตรบนเครื่องอ่าน"}
            return {"success": False, "error": "กรุณาติดตั้งไดรเวอร์ USB หรือสลับไปใช้โหมด PC/SC"}
        return {"success": False, "error": f"RFID read error: {e}"}

    for attempt in range(2):
        try:
            if not reader.is_connected:
                reader.open()
            return reader.read_rfid_uid()
        except VendorProtocolError as exc:
            if attempt == 0 and (
                "No such device" in str(exc) or "not connected" in str(exc).lower()
            ):
                reader.close()
                continue
            err_msg = str(exc)
            if "NO_TAG_ERROR" in err_msg or "POLLING_ERROR" in err_msg:
                return {
                    "success": False,
                    "error": "ไม่พบบัตร RFID — กรุณาวางบัตรบนเครื่องอ่าน",
                }
            if "No such device" in err_msg:
                return {
                    "success": False,
                    "error": "เครื่องอ่านหลุดการเชื่อมต่อ — กรุณาเสียบใหม่",
                }
            return {"success": False, "error": err_msg}
        except Exception as exc:
            if attempt == 0 and "No such device" in str(exc):
                reader.close()
                continue
            if "No backend available" in str(exc):
                if b["PYSCARD_AVAILABLE"]:
                    return {"success": False, "error": "ไม่พบบัตร RFID — กรุณาวางบัตรบนเครื่องอ่าน"}
                return {"success": False, "error": "กรุณาติดตั้งไดรเวอร์ USB หรือสลับไปใช้โหมด PC/SC"}
            return {"success": False, "error": f"RFID read error: {exc}"}
    return {"success": False, "error": "ไม่สามารถเชื่อมต่อเครื่องอ่านได้"}


def _handle_request(msg: dict) -> dict:
    method = msg.get("method", "")
    params = msg.get("params") or {}

    if method == "ping":
        return {
            "ok": True,
            "version": "1.0.1",
            "repo_root": str(REPO_ROOT),
            "python": sys.executable,
        }

    unavailable = _backend_unavailable()
    if unavailable:
        return unavailable

    b = _get_backend()

    if method == "getReaders":
        readers = b["list_readers"]()
        return {"readers": [r.model_dump() for r in readers]}

    if method == "readCard":
        reader = params.get("reader")
        skip_photo = bool(params.get("skipPhoto"))
        try:
            data = b["read_card"](reader_name=reader, skip_photo=skip_photo)
            payload = data.model_dump() if hasattr(data, "model_dump") else data
            return {"success": True, "data": payload, "error": None}
        except Exception as exc:
            return {"success": False, "data": None, "error": str(exc)}

    if method == "readPhoto":
        reader = params.get("reader")
        try:
            photo = b["read_photo_only"](reader_name=reader)
            return {"success": True, "photo_base64": photo}
        except Exception as exc:
            return {"success": False, "error": str(exc)}

    if method == "diagnostic":
        return _diagnostic(b)

    if method == "resetReader":
        try:
            from vendor_protocol import close_reader

            close_reader()
            return {"success": True}
        except Exception as exc:
            return {"success": False, "error": str(exc)}

    if method == "readRfid":
        return _read_rfid_uid(b)

    if method == "startMonitor":
        _start_monitor(b)
        return {"ok": True}

    if method == "stopMonitor":
        _stop_monitor(b)
        return {"ok": True}

    return {"error": f"Unknown method: {method}"}


def main() -> None:
    _log(f"host start python={sys.executable} root={REPO_ROOT}")
    try:
        while True:
            incoming = _read_message()
            if incoming is None:
                break
            req_id = incoming.get("id")
            try:
                result = _handle_request(incoming)
                _send_message({"id": req_id, "result": result})
            except Exception as exc:
                _log(f"request error: {exc}\n{traceback.format_exc()}")
                _send_message({"id": req_id, "error": str(exc)})
    finally:
        try:
            unavailable = _backend_unavailable()
            if not unavailable:
                _stop_monitor(_get_backend())
        except Exception:
            pass
        _log("host exit")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        _log(f"fatal: {exc}\n{traceback.format_exc()}")
        raise
