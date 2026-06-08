"""
Card reader module for Thai National ID cards.
Supports two modes:
  1. DUALi Vendor Protocol — direct USB communication (pyusb) with DE-620 in
     proprietary mode (PID 0x0631 / 0x0630). This is the PRIMARY mode.
  2. PC/SC — via pyscard, if the reader is flashed to CCID mode (PID 0x0801).
Falls back to mock mode if neither is available.
"""

from __future__ import annotations

import base64
import logging
import os
from typing import Any, Optional

from apdu_commands import (
    SELECT_THAI_CARD,
    COMMANDS,
    PHOTO_COMMANDS,
)
from models import CitizenInfo, ReaderInfo

logger = logging.getLogger(__name__)

MOCK_MODE = os.environ.get("MOCK_CARD_READER", "false").lower() == "true"

try:
    from vendor_protocol import (
        DUALiReader,
        VendorProtocolError,
        get_reader as get_vendor_reader,
        close_reader as close_vendor_reader,
        PYUSB_AVAILABLE,
    )
    VENDOR_AVAILABLE = True
except ImportError:
    VENDOR_AVAILABLE = False
    PYUSB_AVAILABLE = False

try:
    from smartcard.CardMonitoring import CardMonitor, CardObserver
    from smartcard.CardType import AnyCardType
    from smartcard.CardRequest import CardRequest
    from smartcard.System import readers as pcsc_readers_fn
    from smartcard.util import toHexString
    PYSCARD_AVAILABLE = True
except ImportError:
    PYSCARD_AVAILABLE = False
    CardMonitor = None
    CardObserver = object


TIS620_ENCODING = "tis-620"

TRANSIENT_VENDOR_ERROR_MARKERS = (
    "not found on usb",
    "no such device",
    "reader not connected",
    "usb write error",
    "usb read timeout",
    "device has been disconnected",
)


def _get_mock_data() -> CitizenInfo:
    """Return mock data for development/testing without hardware."""
    return CitizenInfo(
        cid="1234567890123",
        th_prefix="นาย",
        th_firstname="ทดสอบ",
        th_middlename="",
        th_lastname="ระบบ",
        en_prefix="Mr.",
        en_firstname="Thod",
        en_middlename="",
        en_lastname="Sop",
        date_of_birth="2533-01-15",
        gender="male",
        card_issuer="สำนักงานเขตบางรัก กรุงเทพมหานคร",
        issue_date="2566-05-20",
        expire_date="2574-01-14",
        address="123/45 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500",
        photo_base64=None,
    )


def _detect_vendor_reader() -> Optional[DUALiReader]:
    """Try to open the DE-620 via vendor protocol. Returns reader or None."""
    if not VENDOR_AVAILABLE:
        return None
    try:
        reader = get_vendor_reader()
        if not reader.is_connected:
            reader.open()
        return reader
    except Exception as exc:
        logger.debug("Vendor protocol not available: %s", exc)
        close_vendor_reader()
        return None


def list_readers() -> list[ReaderInfo]:
    """List all connected smart card readers, preferring vendor protocol."""
    if MOCK_MODE:
        return [ReaderInfo(name="DUALi DE-620 (Mock Mode)", has_card=True)]

    result: list[ReaderInfo] = []

    if VENDOR_AVAILABLE:
        try:
            probe = DUALiReader()
            probe.open()
            card_present = probe.ic_card_status()
            result.append(
                ReaderInfo(name="DUALi DE-620 (USB Vendor Protocol)", has_card=card_present)
            )
            probe.close()
        except Exception:
            pass

    if PYSCARD_AVAILABLE:
        try:
            for reader in pcsc_readers_fn():
                card_present = False
                try:
                    conn = reader.createConnection()
                    conn.connect()
                    card_present = True
                    conn.disconnect()
                except Exception:
                    pass
                result.append(ReaderInfo(name=str(reader), has_card=card_present))
        except Exception:
            pass

    return result


def _send_apdu_pcsc(connection: Any, apdu: list[int]) -> bytes:
    """Send an APDU via PC/SC and return the response data."""
    data, sw1, sw2 = connection.transmit(apdu)
    if sw1 == 0x61:
        get_resp = [0x00, 0xC0, 0x00, 0x00, sw2]
        data, sw1, sw2 = connection.transmit(get_resp)
    if sw1 != 0x90 or sw2 != 0x00:
        raise Exception(f"APDU failed: SW1={hex(sw1)} SW2={hex(sw2)}")
    return bytes(data)


def _send_apdu_vendor(reader: DUALiReader, apdu: list[int]) -> bytes:
    """Send an APDU via vendor protocol with recovery on reader errors."""
    import time as _t

    for attempt in range(4):
        try:
            data, sw1, sw2 = reader.send_apdu_parsed(apdu)
            if sw1 == 0x6D or sw1 == 0x6E or sw1 == 0x6F:
                raise VendorProtocolError(f"Card state error SW={sw1:02x}{sw2:02x}")
            if sw1 != 0x90 or sw2 != 0x00:
                raise Exception(f"APDU failed: SW1={hex(sw1)} SW2={hex(sw2)}")
            return data
        except VendorProtocolError as e:
            if attempt >= 3:
                raise
            logger.warning("APDU attempt %d failed (%s), recovering...", attempt + 1, e)
            try:
                reader.ic_power_off()
                _t.sleep(0.15)
                reader._flush_input()
                reader.ic_power_on()
                _t.sleep(0.3)
                reader.send_apdu_parsed(list(SELECT_THAI_CARD))
                _t.sleep(0.05)
            except Exception as inner:
                logger.warning("Power cycle failed (%s), reconnecting USB", inner)
                reader.close()
                _t.sleep(1.0)
                try:
                    reader.open()
                except Exception:
                    _t.sleep(1.5)
                    reader.open()
                _t.sleep(0.2)
                reader.ic_power_on()
                _t.sleep(0.3)
                reader.send_apdu_parsed(list(SELECT_THAI_CARD))
                _t.sleep(0.05)
    raise Exception("APDU failed after all retries")


def _decode_tis620(data: bytes) -> str:
    """Decode TIS-620 encoded bytes to UTF-8 string, stripping padding."""
    try:
        text = data.decode(TIS620_ENCODING)
    except UnicodeDecodeError:
        text = data.decode("utf-8", errors="replace")
    return text.replace("#", " ").strip()


def _parse_thai_name(raw: str) -> tuple[str, str, str, str]:
    """Parse Thai full name into prefix, firstname, middlename, lastname."""
    parts = [p.strip() for p in raw.split("#") if p.strip()]
    if len(parts) >= 4:
        return parts[0], parts[1], parts[2], parts[3]
    elif len(parts) == 3:
        return parts[0], parts[1], "", parts[2]
    elif len(parts) == 2:
        return "", parts[0], "", parts[1]
    return "", raw.strip(), "", ""


def _parse_english_name(raw: str) -> tuple[str, str, str, str]:
    """Parse English full name into prefix, firstname, middlename, lastname."""
    parts = [p.strip() for p in raw.split("#") if p.strip()]
    if len(parts) >= 4:
        return parts[0], parts[1], parts[2], parts[3]
    elif len(parts) == 3:
        return parts[0], parts[1], "", parts[2]
    elif len(parts) == 2:
        return "", parts[0], "", parts[1]
    return "", raw.strip(), "", ""


def _format_date(raw: str) -> str:
    """Format raw date string YYYYMMDD to YYYY-MM-DD."""
    raw = raw.strip()
    if len(raw) == 8:
        return f"{raw[0:4]}-{raw[4:6]}-{raw[6:8]}"
    return raw


def _read_card_data(send_apdu) -> CitizenInfo:
    """
    Read all citizen data from a Thai National ID card.
    `send_apdu` is a callable that accepts list[int] and returns bytes.
    """
    send_apdu(SELECT_THAI_CARD)

    cid_raw = send_apdu(COMMANDS["cid"])
    cid = cid_raw.decode("ascii").strip()

    th_name_raw = send_apdu(COMMANDS["th_fullname"])
    th_name_decoded = th_name_raw.decode(TIS620_ENCODING, errors="replace")
    th_prefix, th_first, th_middle, th_last = _parse_thai_name(th_name_decoded)

    en_name_raw = send_apdu(COMMANDS["en_fullname"])
    en_name_decoded = en_name_raw.decode("ascii", errors="replace")
    en_prefix, en_first, en_middle, en_last = _parse_english_name(en_name_decoded)

    dob_raw = send_apdu(COMMANDS["date_of_birth"])
    dob = _format_date(dob_raw.decode("ascii").strip())

    gender_raw = send_apdu(COMMANDS["gender"])
    gender = "male" if gender_raw[0] == 0x31 else "female"

    issuer_raw = send_apdu(COMMANDS["card_issuer"])
    issuer = _decode_tis620(issuer_raw)

    issue_date_raw = send_apdu(COMMANDS["issue_date"])
    issue_date = _format_date(issue_date_raw.decode("ascii").strip())

    expire_date_raw = send_apdu(COMMANDS["expire_date"])
    expire_date = _format_date(expire_date_raw.decode("ascii").strip())

    address_raw = send_apdu(COMMANDS["address"])
    address = _decode_tis620(address_raw)

    photo_data = b""
    for cmd in PHOTO_COMMANDS:
        try:
            chunk = send_apdu(cmd)
            photo_data += chunk
        except Exception as exc:
            logger.warning("Photo chunk failed: %s", exc)
            break

    photo_base64 = base64.b64encode(photo_data).decode("ascii") if photo_data else None

    return CitizenInfo(
        cid=cid,
        th_prefix=th_prefix,
        th_firstname=th_first,
        th_middlename=th_middle,
        th_lastname=th_last,
        en_prefix=en_prefix,
        en_firstname=en_first,
        en_middlename=en_middle,
        en_lastname=en_last,
        date_of_birth=dob,
        gender=gender,
        card_issuer=issuer,
        issue_date=issue_date,
        expire_date=expire_date,
        address=address,
        photo_base64=photo_base64,
    )


def _read_card_data_vendor(
    reader: DUALiReader, skip_photo: bool = False
) -> CitizenInfo:
    """Read citizen data via vendor protocol. Optionally skip photo for speed."""
    import time as _t

    INTER_CMD_DELAY = 0.03

    send = lambda apdu: _send_apdu_vendor(reader, apdu)

    send(SELECT_THAI_CARD)
    _t.sleep(INTER_CMD_DELAY)

    cid_raw = send(COMMANDS["cid"])
    cid = cid_raw.decode("ascii").strip()
    _t.sleep(INTER_CMD_DELAY)

    th_name_raw = send(COMMANDS["th_fullname"])
    th_name_decoded = th_name_raw.decode(TIS620_ENCODING, errors="replace")
    th_prefix, th_first, th_middle, th_last = _parse_thai_name(th_name_decoded)
    _t.sleep(INTER_CMD_DELAY)

    en_name_raw = send(COMMANDS["en_fullname"])
    en_name_decoded = en_name_raw.decode("ascii", errors="replace")
    en_prefix, en_first, en_middle, en_last = _parse_english_name(en_name_decoded)
    _t.sleep(INTER_CMD_DELAY)

    dob_raw = send(COMMANDS["date_of_birth"])
    dob = _format_date(dob_raw.decode("ascii").strip())
    _t.sleep(INTER_CMD_DELAY)

    gender_raw = send(COMMANDS["gender"])
    gender = "male" if gender_raw[0] == 0x31 else "female"
    _t.sleep(INTER_CMD_DELAY)

    issuer_raw = send(COMMANDS["card_issuer"])
    issuer = _decode_tis620(issuer_raw)
    _t.sleep(INTER_CMD_DELAY)

    issue_date_raw = send(COMMANDS["issue_date"])
    issue_date = _format_date(issue_date_raw.decode("ascii").strip())
    _t.sleep(INTER_CMD_DELAY)

    expire_date_raw = send(COMMANDS["expire_date"])
    expire_date = _format_date(expire_date_raw.decode("ascii").strip())
    _t.sleep(INTER_CMD_DELAY)

    address_raw = send(COMMANDS["address"])
    address = _decode_tis620(address_raw)
    _t.sleep(INTER_CMD_DELAY)

    photo_base64 = None
    if not skip_photo:
        photo_data = b""
        for cmd in PHOTO_COMMANDS:
            try:
                chunk = send(cmd)
                photo_data += chunk
                _t.sleep(INTER_CMD_DELAY)
            except Exception as exc:
                logger.warning("Photo chunk failed: %s", exc)
                break
        photo_base64 = base64.b64encode(photo_data).decode("ascii") if photo_data else None

    return CitizenInfo(
        cid=cid,
        th_prefix=th_prefix,
        th_firstname=th_first,
        th_middlename=th_middle,
        th_lastname=th_last,
        en_prefix=en_prefix,
        en_firstname=en_first,
        en_middlename=en_middle,
        en_lastname=en_last,
        date_of_birth=dob,
        gender=gender,
        card_issuer=issuer,
        issue_date=issue_date,
        expire_date=expire_date,
        address=address,
        photo_base64=photo_base64,
    )


def _init_vendor_reader() -> DUALiReader:
    """Initialize vendor reader with a fresh local instance."""
    import time as _time

    close_vendor_reader()

    last_error: Optional[Exception] = None
    for attempt in range(2):
        reader = DUALiReader()
        try:
            reader.open()
            reader.ic_power_on()
            _time.sleep(0.3)
            return reader
        except Exception as exc:
            last_error = exc
            try:
                reader.close()
            except Exception:
                pass
            if attempt == 0:
                _time.sleep(0.25)
                continue
            raise

    raise last_error or Exception("Unable to initialize DUALi vendor reader")


def _is_retryable_vendor_error(error: Exception | str) -> bool:
    message = str(error).lower()
    return any(marker in message for marker in TRANSIENT_VENDOR_ERROR_MARKERS)


def _retry_vendor_read(operation, attempts: int = 2):
    import time as _time

    last_error: Optional[Exception] = None
    for attempt in range(attempts):
        try:
            return operation()
        except Exception as exc:
            last_error = exc
            if attempt >= attempts - 1 or not _is_retryable_vendor_error(exc):
                raise
            logger.warning(
                "Transient vendor read failure (attempt %d/%d): %s. Retrying...",
                attempt + 1,
                attempts,
                exc,
            )
            try:
                close_vendor_reader()
            except Exception:
                pass
            _time.sleep(0.35)

    raise last_error or Exception("Vendor read retry failed")


def read_card_vendor(skip_photo: bool = False) -> CitizenInfo:
    """Read Thai ID card via DUALi vendor protocol (USB direct)."""
    reader = _init_vendor_reader()
    try:
        return _read_card_data_vendor(reader, skip_photo=skip_photo)
    finally:
        try:
            reader.ic_power_off()
        except Exception:
            pass
        try:
            reader.close()
        except Exception:
            pass


def read_card_pcsc(reader_name: Optional[str] = None) -> CitizenInfo:
    """Read Thai ID card via PC/SC (pyscard)."""
    if not PYSCARD_AVAILABLE:
        raise Exception("pyscard is not available")

    available = pcsc_readers_fn()
    if not available:
        raise Exception("No PC/SC smart card readers found")

    target = None
    if reader_name:
        for r in available:
            if reader_name in str(r):
                target = r
                break
        if not target:
            raise Exception(f"Reader '{reader_name}' not found")
    else:
        target = available[0]

    connection = target.createConnection()
    connection.connect()
    try:
        return _read_card_data(lambda apdu: _send_apdu_pcsc(connection, apdu))
    finally:
        connection.disconnect()


def read_card(
    reader_name: Optional[str] = None, skip_photo: bool = False
) -> CitizenInfo:
    """
    Read all citizen data from a Thai National ID card.
    Tries vendor protocol first, then PC/SC, then mock mode.
    """
    if MOCK_MODE:
        return _get_mock_data()

    vendor_error: Optional[str] = None
    if VENDOR_AVAILABLE:
        try:
            return _retry_vendor_read(
                lambda: read_card_vendor(skip_photo=skip_photo)
            )
        except Exception as exc:
            vendor_error = str(exc)
            logger.warning("Vendor protocol read failed: %s", exc)

    if PYSCARD_AVAILABLE:
        try:
            return read_card_pcsc(reader_name)
        except Exception as exc:
            logger.warning("PC/SC read failed: %s", exc)

    if vendor_error:
        if "EMPTY" in vendor_error or "NO IC CARD" in vendor_error:
            raise Exception("กรุณาเสียบบัตรประชาชนในเครื่องอ่าน (ช่อง contact card)")
        if "NO_POWER" in vendor_error:
            raise Exception("ไม่สามารถเปิดใช้งานบัตรได้ กรุณาเสียบบัตรใหม่")
        raise Exception(f"เครื่องอ่านแจ้ง: {vendor_error}")

    raise Exception(
        "ไม่สามารถอ่านบัตรได้ — ไม่พบเครื่องอ่าน DE-620 ผ่าน USB หรือ PC/SC"
    )


def read_card_with_progress(
    progress_callback,
    reader_name: Optional[str] = None,
    skip_photo: bool = False,
) -> CitizenInfo:
    """
    Read card data with progress updates via callback.
    callback(step: int, total: int, message: str)
    """
    import time as _time

    TOTAL_STEPS = 10 if skip_photo else 30
    INTER_CMD_DELAY = 0.03

    if MOCK_MODE:
        for i in range(TOTAL_STEPS):
            progress_callback(i + 1, TOTAL_STEPS, "Mock mode...")
            _time.sleep(0.1)
        return _get_mock_data()

    def _emit(step, msg, field=None, value=None):
        progress_callback(step, TOTAL_STEPS, msg, field=field, value=value)

    def _read_via_vendor() -> CitizenInfo:
        _emit(0, "กำลังเชื่อมต่อเครื่องอ่าน...")
        reader = _init_vendor_reader()

        def _cleanup():
            try:
                reader.ic_power_off()
            except Exception:
                pass
            try:
                reader.close()
            except Exception:
                pass

        send = lambda apdu: _send_apdu_vendor(reader, apdu)

        try:
            step = 0

            _emit(step := step + 1, "เลือกแอปพลิเคชันบัตร...")
            send(SELECT_THAI_CARD)
            _time.sleep(INTER_CMD_DELAY)

            _emit(step := step + 1, "อ่านเลขบัตรประชาชน")
            cid_raw = send(COMMANDS["cid"])
            cid = cid_raw.decode("ascii").strip()
            _emit(step, "อ่านเลขบัตรประชาชน", field="cid", value=cid)
            _time.sleep(INTER_CMD_DELAY)

            _emit(step := step + 1, "อ่านชื่อ-นามสกุล (ไทย)")
            th_name_raw = send(COMMANDS["th_fullname"])
            th_name_decoded = th_name_raw.decode(TIS620_ENCODING, errors="replace")
            th_prefix, th_first, th_middle, th_last = _parse_thai_name(th_name_decoded)
            _emit(
                step,
                "อ่านชื่อ-นามสกุล (ไทย)",
                field="th_name",
                value={
                    "th_prefix": th_prefix,
                    "th_firstname": th_first,
                    "th_middlename": th_middle,
                    "th_lastname": th_last,
                },
            )
            _time.sleep(INTER_CMD_DELAY)

            _emit(step := step + 1, "อ่านชื่อ-นามสกุล (EN)")
            en_name_raw = send(COMMANDS["en_fullname"])
            en_name_decoded = en_name_raw.decode("ascii", errors="replace")
            en_prefix, en_first, en_middle, en_last = _parse_english_name(en_name_decoded)
            _time.sleep(INTER_CMD_DELAY)

            _emit(step := step + 1, "อ่านวันเกิด")
            dob_raw = send(COMMANDS["date_of_birth"])
            dob = _format_date(dob_raw.decode("ascii").strip())
            _emit(step, "อ่านวันเกิด", field="date_of_birth", value=dob)
            _time.sleep(INTER_CMD_DELAY)

            _emit(step := step + 1, "อ่านเพศ")
            gender_raw = send(COMMANDS["gender"])
            gender = "male" if gender_raw[0] == 0x31 else "female"
            _emit(step, "อ่านเพศ", field="gender", value=gender)
            _time.sleep(INTER_CMD_DELAY)

            _emit(step := step + 1, "อ่านผู้ออกบัตร")
            issuer_raw = send(COMMANDS["card_issuer"])
            issuer = _decode_tis620(issuer_raw)
            _emit(step, "อ่านผู้ออกบัตร", field="card_issuer", value=issuer)
            _time.sleep(INTER_CMD_DELAY)

            _emit(step := step + 1, "อ่านวันออกบัตร")
            issue_date_raw = send(COMMANDS["issue_date"])
            issue_date = _format_date(issue_date_raw.decode("ascii").strip())
            _emit(step, "อ่านวันออกบัตร", field="issue_date", value=issue_date)
            _time.sleep(INTER_CMD_DELAY)

            _emit(step := step + 1, "อ่านวันหมดอายุ")
            expire_date_raw = send(COMMANDS["expire_date"])
            expire_date = _format_date(expire_date_raw.decode("ascii").strip())
            _emit(step, "อ่านวันหมดอายุ", field="expire_date", value=expire_date)
            _time.sleep(INTER_CMD_DELAY)

            _emit(step := step + 1, "อ่านที่อยู่")
            address_raw = send(COMMANDS["address"])
            address = _decode_tis620(address_raw)
            _emit(step, "อ่านที่อยู่", field="address", value=address)
            _time.sleep(INTER_CMD_DELAY)

            photo_base64 = None
            if not skip_photo:
                photo_data = b""
                for i, cmd in enumerate(PHOTO_COMMANDS):
                    progress_callback(step := step + 1, TOTAL_STEPS, f"อ่านรูปถ่าย ({i + 1}/20)")
                    try:
                        chunk = send(cmd)
                        photo_data += chunk
                        _time.sleep(INTER_CMD_DELAY)
                    except Exception as exc:
                        logger.warning("Photo chunk %d failed: %s", i + 1, exc)
                        break
                photo_base64 = base64.b64encode(photo_data).decode("ascii") if photo_data else None

            return CitizenInfo(
                cid=cid,
                th_prefix=th_prefix,
                th_firstname=th_first,
                th_middlename=th_middle,
                th_lastname=th_last,
                en_prefix=en_prefix,
                en_firstname=en_first,
                en_middlename=en_middle,
                en_lastname=en_last,
                date_of_birth=dob,
                gender=gender,
                card_issuer=issuer,
                issue_date=issue_date,
                expire_date=expire_date,
                address=address,
                photo_base64=photo_base64,
            )
        finally:
            _cleanup()

    vendor_error: Optional[str] = None
    if VENDOR_AVAILABLE:
        try:
            return _retry_vendor_read(_read_via_vendor)
        except Exception as exc:
            vendor_error = str(exc)
            logger.warning("Vendor protocol stream read failed: %s", exc)

    if PYSCARD_AVAILABLE:
        try:
            _emit(0, "สลับไปอ่านผ่าน PC/SC...")
            data = read_card_pcsc(reader_name=reader_name)
            _emit(TOTAL_STEPS, "อ่านข้อมูลบัตรสำเร็จ")
            return data
        except Exception as exc:
            logger.warning("PC/SC stream read failed: %s", exc)

    if vendor_error:
        if "EMPTY" in vendor_error or "NO IC CARD" in vendor_error:
            raise Exception("กรุณาเสียบบัตรประชาชนในเครื่องอ่าน (ช่อง contact card)")
        if "NO_POWER" in vendor_error:
            raise Exception("ไม่สามารถเปิดใช้งานบัตรได้ กรุณาเสียบบัตรใหม่")
        raise Exception(f"เครื่องอ่านแจ้ง: {vendor_error}")

    raise Exception(
        "ไม่สามารถอ่านบัตรได้ — ไม่พบเครื่องอ่าน DE-620 ผ่าน USB หรือ PC/SC"
    )


def read_photo_only(reader_name: Optional[str] = None) -> Optional[str]:
    """Read only the photo from the card, returns base64 encoded JPEG."""
    if MOCK_MODE:
        return None

    def _read_photo(send_apdu) -> Optional[str]:
        send_apdu(SELECT_THAI_CARD)
        photo_data = b""
        for cmd in PHOTO_COMMANDS:
            try:
                chunk = send_apdu(cmd)
                photo_data += chunk
            except Exception:
                break
        return base64.b64encode(photo_data).decode("ascii") if photo_data else None

    if VENDOR_AVAILABLE:
        try:
            reader = _init_vendor_reader()
            try:
                return _read_photo(lambda apdu: _send_apdu_vendor(reader, apdu))
            finally:
                try:
                    reader.ic_power_off()
                except Exception:
                    pass
                try:
                    reader.close()
                except Exception:
                    pass
        except Exception as exc:
            logger.warning("Vendor photo read failed: %s", exc)

    if PYSCARD_AVAILABLE:
        available = pcsc_readers_fn()
        if available:
            target = available[0]
            if reader_name:
                for r in available:
                    if reader_name in str(r):
                        target = r
                        break
            connection = target.createConnection()
            connection.connect()
            try:
                return _read_photo(lambda apdu: _send_apdu_pcsc(connection, apdu))
            finally:
                connection.disconnect()

def read_rfid_pcsc() -> Optional[dict]:
    """Read RFID card UID via PC/SC (pyscard) as fallback/primary."""
    if not PYSCARD_AVAILABLE or MOCK_MODE:
        return None

    available = pcsc_readers_fn()
    if not available:
        return None

    # Try to connect to any reader that responds to the GET UID command
    # Preference given to readers with "contactless" or "cl" in their names
    sorted_readers = sorted(
        available,
        key=lambda r: any(kw in str(r).lower() for kw in ["contactless", "cl", "rfid", "pn532", "acr122"]),
        reverse=True
    )

    for r in sorted_readers:
        # Skip reader names that explicitly indicate contact interface if contactless is available
        reader_name = str(r).lower()
        if "contact reader" in reader_name or "contact 0" in reader_name:
            # Only use contact reader if no other contactless readers are present
            if len(sorted_readers) > 1 and any("contactless" in str(sr).lower() for sr in sorted_readers):
                continue

        try:
            connection = r.createConnection()
            connection.connect()
            # GET DATA command: FF CA 00 00 00 (Gets UID of Mifare/ISO 14443-A cards)
            cmd = [0xFF, 0xCA, 0x00, 0x00, 0x00]
            data, sw1, sw2 = connection.transmit(cmd)
            connection.disconnect()

            if sw1 == 0x90 and sw2 == 0x00:
                uid_bytes = bytes(data)
                uid_hex = uid_bytes.hex().upper()
                uid_int = int.from_bytes(uid_bytes, byteorder="big")
                return {
                    "success": True,
                    "uid_hex": uid_hex,
                    "uid_decimal": str(uid_int),
                    "uid_bytes": list(uid_bytes),
                    "uid_length": len(uid_bytes),
                    "card_type": "ISO 14443-A (PC/SC)",
                }
        except Exception as e:
            logger.debug("Failed to read RFID via PC/SC reader %s: %s", r, e)

    return None


class ThaiCardObserver:
    """Observer for card insertion/removal events (PC/SC only)."""

    def __init__(self, callback):
        self._callback = callback

    def update(self, observable, actions):
        added_cards, removed_cards = actions
        for card in added_cards:
            reader_name = str(card.reader)
            self._callback("card_inserted", reader_name)
        for card in removed_cards:
            reader_name = str(card.reader)
            self._callback("card_removed", reader_name)


def create_card_monitor(callback):
    """Create a card monitor that calls callback on card events."""
    if not PYSCARD_AVAILABLE or MOCK_MODE:
        return None
    try:
        monitor = CardMonitor()
        observer = ThaiCardObserver(callback)
        monitor.addObserver(observer)
        return monitor
    except Exception:
        return None
