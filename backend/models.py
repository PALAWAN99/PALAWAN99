from __future__ import annotations

from typing import Optional

from pydantic import BaseModel


class ReaderInfo(BaseModel):
    name: str
    has_card: bool


class ReadersResponse(BaseModel):
    readers: list[ReaderInfo]


class CitizenInfo(BaseModel):
    cid: str
    th_prefix: str
    th_firstname: str
    th_middlename: str
    th_lastname: str
    en_prefix: str
    en_firstname: str
    en_middlename: str
    en_lastname: str
    date_of_birth: str
    gender: str
    card_issuer: str
    issue_date: str
    expire_date: str
    address: str
    photo_base64: Optional[str] = None


class CardReadResponse(BaseModel):
    success: bool
    data: Optional[CitizenInfo] = None
    error: Optional[str] = None


class CardEventMessage(BaseModel):
    event: str
    reader: str
    timestamp: str


class DiagnosticInfo(BaseModel):
    usb_detected: bool
    usb_vid: Optional[str] = None
    usb_pid: Optional[str] = None
    usb_product: Optional[str] = None
    usb_serial: Optional[str] = None
    usb_mode: Optional[str] = None
    usb_interface_class: Optional[str] = None
    pcsc_readers: list[str] = []
    pcsc_available: bool = False
    pyusb_available: bool = False
    vendor_protocol_available: bool = False
    mock_mode: bool = False
    message: str = ""
