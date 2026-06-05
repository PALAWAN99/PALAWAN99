"""
DUALi DE-620 Vendor Protocol implementation over USB.
Based on RW_Protocol_spec (v2.50) from the DUALi SDK.

USB frame format (no STX/LRC — those are only for RS-232):
  Send:  LEN-H | LEN-L | CMD | Data[n]
  Recv:  LEN-H | LEN-L | Resp | Data[n]

Where LEN = 1 (CMD/Resp byte) + len(Data).
"""

from __future__ import annotations

import logging
import struct
import time
from typing import Optional

try:
    import usb.core
    import usb.util
    PYUSB_AVAILABLE = True
except ImportError:
    PYUSB_AVAILABLE = False

logger = logging.getLogger(__name__)

DUALI_VID = 0x1DB2
SUPPORTED_PIDS = {0x0630, 0x0631}

CMD_RF_ON = 0x10
CMD_RF_OFF = 0x11
CMD_RESET = 0x12
CMD_BUZZER = 0x13
CMD_MODE_CHANGE = 0x15
CMD_GET_VERSION = 0x16

CMD_RF_REQA = 0x21
CMD_RF_WUPA = 0x22
CMD_RF_ANTICOLL = 0x23
CMD_RF_SELECT = 0x24
CMD_RF_HALT = 0x25
CMD_RF_ANTISEL_LEVEL = 0x3D
CMD_IC_POWER_ON = 0xC0
CMD_IC_PPS = 0xC1
CMD_IC_CASE2 = 0xC2
CMD_IC_CASE3 = 0xC3
CMD_IC_CASE4 = 0xC4
CMD_IC_POWER_OFF = 0xC5
CMD_IC_SPEED = 0xC6
CMD_IC_APDU = 0xC9
CMD_IC_STATUS = 0xCA
CMD_IC_BYPASS = 0xCB

RESP_OK = 0x00

RESPONSE_CODES = {
    0x00: "OK",
    0x01: "DE_ERROR",
    0x02: "NO_TAG_ERROR",
    0x03: "CRC_ERROR",
    0x04: "EMPTY (NO IC CARD)",
    0x05: "AUTHENTICATION_ERROR / NO_POWER",
    0x06: "PARITY_ERROR",
    0x07: "CODE_ERROR",
    0x0E: "TRANSFER_ERROR",
    0x14: "POLLING_ERROR",
    0x15: "FRAMING_ERROR",
    0x17: "UNKNOWN_COMMAND_ERROR",
    0x19: "INITIALIZATION_ERROR",
    0x1A: "INTERFACE_ERROR",
    0x1B: "ACCESS_TIMEOUT_ERROR",
    0x1C: "NO_BITWISE_ANTICOLLISION_ERROR",
    0x34: "PROTOCOL_ERROR",
    0x3C: "WRONG_PARAMETER_VALUE",
    0x3D: "INVALID_PARAMETER_ERROR",
    0x3F: "UNSUPPORTED_COMMAND",
    0x40: "INTERFACE_NOT_ENABLED",
}

EP_OUT = 0x02
EP_IN = 0x82
USB_TIMEOUT_MS = 5000
READ_SIZE = 4096

CONTACT_SLOT = 0x00


class VendorProtocolError(Exception):
    """Raised on vendor protocol communication errors."""

    def __init__(self, message: str, resp_code: int = -1):
        self.resp_code = resp_code
        super().__init__(message)


class DUALiReader:
    """Direct USB communication with DUALi DE-620 using the vendor protocol."""

    def __init__(self):
        self._dev: Optional[usb.core.Device] = None
        self._claimed = False

    @property
    def is_connected(self) -> bool:
        if self._dev is None:
            return False
        try:
            self._dev.product
            return True
        except Exception:
            self._dev = None
            self._claimed = False
            return False

    def open(self) -> str:
        """Find and open the DE-620 reader. Returns the firmware version string."""
        if not PYUSB_AVAILABLE:
            raise VendorProtocolError("pyusb is not installed")

        if self._dev is not None:
            self.close()

        dev = usb.core.find(idVendor=DUALI_VID)
        if dev is None:
            raise VendorProtocolError("DUALi DE-620 not found on USB")

        if dev.idProduct not in SUPPORTED_PIDS:
            raise VendorProtocolError(
                f"Unsupported DUALi PID: 0x{dev.idProduct:04x}"
            )

        self._dev = dev

        try:
            if dev.is_kernel_driver_active(0):
                dev.detach_kernel_driver(0)
        except (usb.core.USBError, NotImplementedError):
            pass

        try:
            dev.set_configuration()
        except usb.core.USBError:
            pass

        try:
            usb.util.claim_interface(dev, 0)
            self._claimed = True
        except usb.core.USBError:
            pass

        self._flush_input()

        version = self.get_version()
        logger.info("DUALi reader opened: %s", version)
        return version

    def close(self):
        """Release the USB device."""
        if self._dev is not None:
            try:
                if self._claimed:
                    usb.util.release_interface(self._dev, 0)
                    self._claimed = False
            except Exception:
                pass
            try:
                usb.util.dispose_resources(self._dev)
            except Exception:
                pass
            self._dev = None

    def _flush_input(self):
        """Discard any stale data in the IN endpoint."""
        if self._dev is None:
            return
        for _ in range(5):
            try:
                self._dev.read(EP_IN, READ_SIZE, timeout=50)
            except usb.core.USBError:
                break

    def _send_command(self, cmd: int, data: bytes = b"") -> bytes:
        """
        Send a vendor protocol command and return the response data.
        Raises VendorProtocolError on failure.
        """
        if self._dev is None:
            raise VendorProtocolError("Reader not connected")

        payload_len = 1 + len(data)
        packet = struct.pack(">HB", payload_len, cmd) + data

        logger.debug("USB TX: %s", packet.hex())
        try:
            self._dev.write(EP_OUT, packet, timeout=USB_TIMEOUT_MS)
        except usb.core.USBError as e:
            raise VendorProtocolError(f"USB write error: {e}") from e

        try:
            raw = self._dev.read(EP_IN, READ_SIZE, timeout=USB_TIMEOUT_MS)
            raw = bytes(raw)
        except usb.core.USBError as e:
            raise VendorProtocolError(f"USB read timeout: {e}") from e

        logger.debug("USB RX: %s", raw.hex())

        if len(raw) < 3:
            raise VendorProtocolError(
                f"Response too short ({len(raw)} bytes): {raw.hex()}"
            )

        resp_len = (raw[0] << 8) | raw[1]
        resp_code = raw[2]
        resp_data = raw[3:2 + resp_len] if resp_len > 1 else b""

        if resp_code != RESP_OK:
            code_name = RESPONSE_CODES.get(resp_code, f"0x{resp_code:02x}")
            raise VendorProtocolError(
                f"Reader error: {code_name} ({resp_code})",
                resp_code=resp_code,
            )

        return resp_data

    def get_version(self) -> str:
        """Get the reader firmware version string."""
        data = self._send_command(CMD_GET_VERSION)
        try:
            return data.rstrip(b"\x00").decode("ascii", errors="replace")
        except Exception:
            return data.hex()

    def reset(self):
        """Send reset command to the reader."""
        try:
            self._send_command(CMD_RESET)
            time.sleep(0.3)
        except VendorProtocolError:
            pass
        self._flush_input()

    def ic_power_on(self, slot: int = CONTACT_SLOT, retries: int = 3) -> bytes:
        """
        Power on the contact card slot and return the ATR.
        Automatically power-off first to clear stale state, then retry.
        """
        try:
            self._send_command(CMD_IC_POWER_OFF, bytes([slot]))
            time.sleep(0.1)
        except VendorProtocolError:
            pass
        self._flush_input()

        last_error: Optional[VendorProtocolError] = None
        for attempt in range(retries):
            try:
                atr = self._send_command(CMD_IC_POWER_ON, bytes([slot]))
                logger.info(
                    "IC Power ON slot %d (attempt %d), ATR: %s",
                    slot, attempt + 1, atr.hex(),
                )
                return atr
            except VendorProtocolError as e:
                last_error = e
                logger.warning(
                    "IC Power ON attempt %d failed: %s", attempt + 1, e
                )
                if e.resp_code == 0x04:
                    raise
                time.sleep(0.2)
                self._flush_input()

        raise last_error or VendorProtocolError("IC Power ON failed")

    def ic_power_off(self, slot: int = CONTACT_SLOT):
        """Power off the contact card slot."""
        self._send_command(CMD_IC_POWER_OFF, bytes([slot]))
        logger.info("IC Power OFF slot %d", slot)

    def ic_card_status(self, slot: int = CONTACT_SLOT) -> bool:
        """Check if a card is present in the contact slot."""
        try:
            self._send_command(CMD_IC_STATUS, bytes([slot]))
            return True
        except VendorProtocolError:
            return False

    def ic_transmit_apdu(self, apdu: bytes, slot: int = CONTACT_SLOT) -> bytes:
        """
        Send an APDU to the contact card and return the full response.
        Uses CMD 0xC9 (generic APDU) which handles T=0 case detection.
        """
        cmd_data = bytes([slot]) + apdu
        return self._send_command(CMD_IC_APDU, cmd_data)

    def ic_transmit_case3(self, apdu: bytes, slot: int = CONTACT_SLOT) -> bytes:
        """
        Explicitly send a Case 3 APDU (CLA INS P1 P2 Lc Data).
        For T=0, sends data TO the card. Returns SW1+SW2.
        """
        cmd_data = bytes([slot]) + apdu
        return self._send_command(CMD_IC_CASE3, cmd_data)

    def ic_transmit_case4(self, apdu: bytes, slot: int = CONTACT_SLOT) -> bytes:
        """
        Explicitly send a Case 4 APDU (CLA INS P1 P2 Lc Data Le).
        For T=0, sends data and expects response. Returns Data+SW.
        """
        cmd_data = bytes([slot]) + apdu
        return self._send_command(CMD_IC_CASE4, cmd_data)

    def send_apdu_parsed(
        self, apdu: list[int], slot: int = CONTACT_SLOT
    ) -> tuple[bytes, int, int]:
        """
        Send an APDU and parse the response into (data, sw1, sw2).

        Uses CMD_IC_APDU (0xC9) for Case 3/4 APDUs (len > 5).
        Uses CMD_IC_CASE2 (0xC2) for Case 2 APDUs and GET RESPONSE.
        Handles 61 xx (GET RESPONSE) and 6C xx (correct Le) automatically.
        """
        raw_apdu = bytes(apdu)
        is_case2 = len(raw_apdu) <= 5
        cmd = CMD_IC_CASE2 if is_case2 else CMD_IC_APDU
        logger.debug("APDU (%s): %s", "C2" if is_case2 else "C9", raw_apdu.hex())

        cmd_data = bytes([slot]) + raw_apdu
        resp = self._send_command(cmd, cmd_data)

        if len(resp) < 2:
            raise VendorProtocolError(
                f"APDU response too short: {resp.hex()}"
            )

        sw1 = resp[-2]
        sw2 = resp[-1]
        data = resp[:-2]

        while sw1 == 0x61:
            le = sw2
            get_resp = bytes([0x00, 0xC0, 0x00, 0x00, le])
            logger.debug("GET RESPONSE (C2): Le=%02x", le)
            resp2 = self._send_command(CMD_IC_CASE2, bytes([slot]) + get_resp)
            if len(resp2) < 2:
                break
            sw1 = resp2[-2]
            sw2 = resp2[-1]
            data += resp2[:-2]

        if sw1 == 0x6C:
            correct_le = sw2
            retry_apdu = raw_apdu[:4] + bytes([correct_le])
            logger.debug("RETRY Le=%02x (C2): %s", correct_le, retry_apdu.hex())
            resp3 = self._send_command(CMD_IC_CASE2, bytes([slot]) + retry_apdu)
            if len(resp3) >= 2:
                sw1 = resp3[-2]
                sw2 = resp3[-1]
                data = resp3[:-2]

        return data, sw1, sw2

    def send_apdu_robust(
        self,
        apdu: list[int],
        select_apdu: list[int] | None = None,
        slot: int = CONTACT_SLOT,
        retries: int = 3,
    ) -> tuple[bytes, int, int]:
        """
        Send an APDU with tiered automatic retry on reader errors.
        Also retries on SW codes that indicate corrupted card state (6D00, 6E00, 6F00).
        Level 1: tiny delay + flush + retry (fast)
        Level 2: power cycle + re-SELECT (medium)
        Level 3: full USB reconnect + power cycle + re-SELECT (slow)
        """
        RETRIABLE_SW1 = {0x6D, 0x6E, 0x6F}

        for attempt in range(1 + retries):
            try:
                data, sw1, sw2 = self.send_apdu_parsed(apdu, slot)
                if sw1 in RETRIABLE_SW1 and attempt < retries:
                    logger.warning(
                        "APDU attempt %d/%d bad SW=%02x%02x, retrying",
                        attempt + 1, retries, sw1, sw2,
                    )
                    raise VendorProtocolError(
                        f"Card state error SW={sw1:02x}{sw2:02x}"
                    )
                return data, sw1, sw2
            except VendorProtocolError as e:
                if attempt >= retries:
                    raise
                logger.warning(
                    "APDU attempt %d/%d failed (%s)",
                    attempt + 1, retries, e,
                )
                self._do_recovery(attempt, slot, select_apdu)
        raise VendorProtocolError("send_apdu_robust: all retries exhausted")

    def _do_recovery(
        self,
        attempt: int,
        slot: int,
        select_apdu: list[int] | None,
    ) -> None:
        """Execute tiered recovery based on attempt number."""
        try:
            self._power_cycle_and_select(slot, select_apdu)
        except (VendorProtocolError, Exception) as inner:
            logger.warning("Power cycle failed (%s), reconnecting USB", inner)
            self._usb_reconnect_and_select(slot, select_apdu)

    def _power_cycle_and_select(
        self, slot: int, select_apdu: list[int] | None
    ) -> None:
        """Power cycle the card and re-SELECT."""
        self._flush_input()
        try:
            self.ic_power_off(slot)
        except Exception:
            pass
        time.sleep(0.15)
        self._flush_input()
        self.ic_power_on(slot)
        time.sleep(0.3)
        if select_apdu:
            self.send_apdu_parsed(select_apdu, slot)
            time.sleep(0.05)

    def _usb_reconnect_and_select(
        self, slot: int, select_apdu: list[int] | None
    ) -> None:
        """Full USB reconnect, power cycle, and re-SELECT."""
        self.close()
        time.sleep(1.0)
        try:
            self.open()
        except VendorProtocolError:
            time.sleep(1.5)
            self.open()
        time.sleep(0.2)
        try:
            self.ic_power_off(slot)
        except Exception:
            pass
        time.sleep(0.15)
        self._flush_input()
        self.ic_power_on(slot)
        time.sleep(0.3)
        if select_apdu:
            try:
                self.send_apdu_parsed(select_apdu, slot)
            except VendorProtocolError:
                time.sleep(0.2)
                self._flush_input()
                self.send_apdu_parsed(select_apdu, slot)
            time.sleep(0.05)

    # ─── Contactless / RFID Methods ───────────────────────────────────────

    def rf_on(self):
        """Turn on the RF field for contactless communication."""
        self._send_command(CMD_RF_ON)
        logger.info("RF field ON")

    def rf_off(self):
        """Turn off the RF field."""
        try:
            self._send_command(CMD_RF_OFF)
            logger.info("RF field OFF")
        except VendorProtocolError:
            pass

    def rf_reqa(self) -> bytes:
        """
        Send REQA (0x26) to poll for ISO 14443 Type A cards.
        Returns ATQA (2 bytes) on success.
        """
        return self._send_command(CMD_RF_REQA)

    def rf_antisel_level(self) -> bytes:
        """
        Combined Anticollision + Select at all cascade levels.
        Returns the full UID (4, 7, or 10 bytes).
        The first byte in the response is a length/status indicator; UID follows.
        """
        resp = self._send_command(CMD_RF_ANTISEL_LEVEL)
        if len(resp) > 1:
            return resp[1:]
        return resp

    def rf_halt(self):
        """Halt the currently selected card."""
        try:
            self._send_command(CMD_RF_HALT)
        except VendorProtocolError:
            pass

    def read_rfid_uid(self) -> dict:
        """
        High-level: detect an RFID card and read its UID.
        Returns dict with uid_hex, uid_decimal, uid_bytes, uid_length, card_type.
        """
        try:
            self.rf_on()
            time.sleep(0.05)

            self.rf_reqa()

            uid_bytes = self.rf_antisel_level()

            self.rf_halt()
            self.rf_off()

            uid_hex = uid_bytes.hex().upper()
            uid_int = int.from_bytes(uid_bytes, byteorder="big")

            return {
                "success": True,
                "uid_hex": uid_hex,
                "uid_decimal": str(uid_int),
                "uid_bytes": list(uid_bytes),
                "uid_length": len(uid_bytes),
                "card_type": "ISO 14443-A",
            }
        except VendorProtocolError as e:
            self.rf_off()
            raise VendorProtocolError(f"RFID read failed: {e}") from e

    # ─── Buzzer ────────────────────────────────────────────────────────────

    def buzzer_on(self):
        """Short beep."""
        try:
            self._send_command(CMD_BUZZER, bytes([0x00]))
        except VendorProtocolError:
            pass

    def buzzer_off(self):
        """Turn off buzzer."""
        try:
            self._send_command(CMD_BUZZER, bytes([0x01]))
        except VendorProtocolError:
            pass


_reader_instance: Optional[DUALiReader] = None


def get_reader() -> DUALiReader:
    """Get or create the singleton DUALi reader instance."""
    global _reader_instance
    if _reader_instance is None:
        _reader_instance = DUALiReader()
    return _reader_instance


def close_reader():
    """Close the singleton reader."""
    global _reader_instance
    if _reader_instance is not None:
        _reader_instance.close()
        _reader_instance = None
