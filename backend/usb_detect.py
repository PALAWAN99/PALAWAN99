"""
USB device detection for DUALi DE-620 smart card reader.
Detects the reader on USB and reports its operating mode.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Optional

try:
    import usb.core
    import usb.util
    PYUSB_AVAILABLE = True
except ImportError:
    PYUSB_AVAILABLE = False

DUALI_VID = 0x1DB2

KNOWN_PIDS = {
    0x0630: "vendor",
    0x0631: "duali_pcsc",
    0x0801: "ccid",
}

CCID_INTERFACE_CLASS = 0x0B
VENDOR_INTERFACE_CLASS = 0xFF


class ReaderMode(str, Enum):
    NOT_FOUND = "not_found"
    VENDOR = "vendor"
    DUALI_PCSC = "duali_pcsc"
    CCID = "ccid"
    UNKNOWN = "unknown"


@dataclass
class USBDeviceInfo:
    vid: int
    pid: int
    product: str
    serial: str
    mode: ReaderMode
    interface_class: int
    has_ccid_descriptor: bool
    message: str


def detect_de620() -> Optional[USBDeviceInfo]:
    """Detect a DUALi DE-620 reader on USB and determine its operating mode."""
    if not PYUSB_AVAILABLE:
        return None

    dev = usb.core.find(idVendor=DUALI_VID)
    if dev is None:
        return None

    pid = dev.idProduct
    product = ""
    serial = ""
    try:
        product = dev.product or ""
    except Exception:
        pass
    try:
        serial = dev.serial_number or ""
    except Exception:
        pass

    interface_class = 0
    has_ccid_descriptor = False
    try:
        cfg = dev.get_active_configuration()
        if cfg is None:
            dev.set_configuration()
            cfg = dev.get_active_configuration()
        intf = cfg[(0, 0)]
        interface_class = intf.bInterfaceClass
        extra = intf.extra_descriptors
        if extra is not None and len(extra) >= 54:
            has_ccid_descriptor = (extra[1] == 0x21)
    except Exception:
        pass

    mode = ReaderMode.UNKNOWN
    message = ""

    if pid in KNOWN_PIDS:
        mode_name = KNOWN_PIDS[pid]
        mode = ReaderMode(mode_name)
    elif interface_class == CCID_INTERFACE_CLASS:
        mode = ReaderMode.CCID
    elif interface_class == VENDOR_INTERFACE_CLASS:
        mode = ReaderMode.DUALI_PCSC

    if mode == ReaderMode.CCID:
        message = (
            "Reader is in standard CCID mode. "
            "It should be recognized by macOS SmartCard Services."
        )
    elif mode in (ReaderMode.DUALI_PCSC, ReaderMode.VENDOR):
        message = (
            f"Reader is in DUALi {'PC/SC' if mode == ReaderMode.DUALI_PCSC else 'Vendor'} "
            f"mode (PID 0x{pid:04x}). "
            "Vendor Protocol driver is active — direct USB communication enabled."
        )
    else:
        message = f"Unknown DUALi device (PID 0x{pid:04x})."

    return USBDeviceInfo(
        vid=DUALI_VID,
        pid=pid,
        product=product,
        serial=serial,
        mode=mode,
        interface_class=interface_class,
        has_ccid_descriptor=has_ccid_descriptor,
        message=message,
    )
