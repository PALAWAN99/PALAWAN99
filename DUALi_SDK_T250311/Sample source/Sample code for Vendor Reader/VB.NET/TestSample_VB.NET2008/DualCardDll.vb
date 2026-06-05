Option Strict Off
Option Explicit On
Module DualCardDll
	'Common
	Public Declare Function GetErrMsg Lib "DualCardDll.dll" (ByVal errcode As Integer, ByRef retmsg As Byte) As Integer
	Public Declare Function DE_InitPort Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal nBaud As Integer) As Integer
	Public Declare Sub DE_ClosePort Lib "DualCardDll.dll" (ByVal nPort As Integer)
	Public Declare Function DE_Polling Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal datalen As Integer, ByRef data As Byte, ByRef outlen As Integer, ByRef lpRes As Byte, ByVal timeout As Integer) As Integer
	Public Declare Function DE_SerialPolling Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal datalen As Integer, ByRef data As Byte, ByRef outlen As Integer, ByRef lpRes As Byte, ByVal timeout As Integer) As Integer
	Public Declare Function DE_ByPassCommand Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal datalen As Integer, ByVal Cmd As Byte, ByRef data As Byte, ByRef outlen As Integer, ByRef lpRes As Byte, ByVal timeout As Integer) As Integer        '''default timeout:300ms
	
	'Device control command
	Public Declare Function DE_RFOn Lib "DualCardDll.dll" (ByVal nPort As Integer) As Integer
	Public Declare Function DE_RFOff Lib "DualCardDll.dll" (ByVal nPort As Integer) As Integer
	Public Declare Function DE_RFReset Lib "DualCardDll.dll" (ByVal nPort As Integer) As Integer
	Public Declare Function DE_BuzzerOff Lib "DualCardDll.dll" (ByVal nPort As Integer) As Integer
	Public Declare Function DE_BuzzerOn Lib "DualCardDll.dll" (ByVal nPort As Integer) As Integer
	Public Declare Function DE_ChangeDevice Lib "DualCardDll.dll" (ByVal nPort As Integer, ByRef mode As Byte, ByVal Inqflag As Integer) As Integer
	Public Declare Function DE_GetVersion Lib "DualCardDll.dll" (ByVal nPort As Integer, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DE_ChangeTRXSpeed Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal Trxspd As Byte) As Integer
	Public Declare Function DE_RWFlash Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal flag As Byte, ByVal datalen As Integer, ByRef data As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	
	'Type C
	Public Declare Function DEC_Transparent Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal datalen As Integer, ByRef data As Byte, ByRef outlen As Integer, ByRef lpRes As Byte, ByVal timeout As Integer) As Integer
	
	'Type B
	Public Declare Function DEB_Transparent Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal datalen As Integer, ByRef data As Byte, ByRef outlen As Integer, ByRef lpRes As Byte, ByVal timeout As Integer) As Integer
	Public Declare Function DEB_TransparentCRC Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal datalen As Integer, ByRef data As Byte, ByRef crc As Byte, ByVal TOUT As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEB_BFRAMING Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal Fvalue As Byte) As Integer
	
	'Type A
	Public Declare Function DEA_Reset Lib "DualCardDll.dll" (ByVal nPort As Integer, ByRef lpdelay As Byte) As Integer
	Public Declare Function DEA_Idle_Req Lib "DualCardDll.dll" (ByVal nPort As Integer, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_Wakeup_Req Lib "DualCardDll.dll" (ByVal nPort As Integer, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_Anticoll Lib "DualCardDll.dll" (ByVal nPort As Integer, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_Select Lib "DualCardDll.dll" (ByVal nPort As Integer, ByRef uid As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_Auth Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal mode As Byte, ByVal keyno As Byte, ByVal blockno As Byte) As Integer
	Public Declare Function DEA_Halt Lib "DualCardDll.dll" (ByVal nPort As Integer) As Integer
	Public Declare Function DEA_Read Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal blockno As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_Write Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal blockno As Byte, ByVal datalen As Integer, ByRef data As Byte) As Integer
	Public Declare Function DEA_Increment Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal blockno As Byte, ByRef value As Byte) As Integer
	Public Declare Function DEA_Decrement Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal blockno As Byte, ByRef value As Byte) As Integer
	Public Declare Function DEA_Inc_Transfer Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal blockno As Byte, ByRef value As Byte, ByVal trblockno As Byte) As Integer
	Public Declare Function DEA_Dec_Transfer Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal blockno As Byte, ByRef value As Byte, ByVal trblockno As Byte) As Integer
	Public Declare Function DEA_Restore Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal blockno As Byte) As Integer
	Public Declare Function DEA_Transfer Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal blockno As Byte) As Integer
	Public Declare Function DEA_Loadkey Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal mode As Byte, ByVal keyno As Byte, ByRef KeyData As Byte) As Integer
	Public Declare Function DEA_Authkey Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal mode As Byte, ByRef KeyData As Byte, ByVal blockno As Byte) As Integer
	Public Declare Function DEA_Req_Auth Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal requestmode As Byte, ByVal authmode As Byte, ByVal keyno As Byte, ByVal blockno As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_Req_Authkey Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal requestmode As Byte, ByVal authmode As Byte, ByVal blockno As Byte, ByRef KeyData As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_Inc_Transfer2 Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal blockno As Byte, ByRef value As Byte, ByVal trblockno As Byte) As Integer
	Public Declare Function DEA_Dec_Transfer2 Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal blockno As Byte, ByRef value As Byte, ByVal trblockno As Byte) As Integer
	Public Declare Function DEA_Req_AuthRead Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal requestmode As Byte, ByVal authmode As Byte, ByVal keyno As Byte, ByVal blockno As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_Req_AuthkeyRead Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal requestmode As Byte, ByVal authmode As Byte, ByVal blockno As Byte, ByRef KeyData As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_Req_AuthWrite Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal requestmode As Byte, ByVal authmode As Byte, ByVal keyno As Byte, ByVal blockno As Byte, ByRef data As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_Req_AuthkeyWrite Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal requestmode As Byte, ByVal authmode As Byte, ByVal blockno As Byte, ByRef KeyData As Byte, ByRef data As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_Req_Select Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal requestmode As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_UltraM_Write Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal address As Byte, ByRef data As Byte) As Integer
    Public Declare Function DEA_AntiSelLevel Lib "DualCardDll.dll" (ByVal nPort As Integer, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
    Public Declare Function DEA_SelectLevel Lib "DualCardDll.dll" (ByVal nPort As Integer, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_AnticollLevel Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal cmd As Byte, ByVal bitcnt As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_Transparent Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal datalen As Byte, ByRef data As Byte, ByVal TOUT As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DEA_TransparentCRC Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal datalen As Byte, ByRef data As Byte, ByRef crc As Byte, ByVal TOUT As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	
	'TYPE A/B Common Function
	Public Declare Function DE_APDU Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal datalen As Integer, ByRef data As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DE_FindCard Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal baud As Byte, ByVal cid As Byte, ByVal nad As Byte, ByVal opt As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	
	'15693
	Public Declare Function DE_PWWrite Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal data As Byte) As Integer
	Public Declare Function DE_PWRead Lib "DualCardDll.dll" (ByVal nPort As Integer, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	
	'Contact card command
	Public Declare Function DE_IC_PowerOn Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal slotno As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DE_IC_PPS Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal slotno As Byte, ByVal ppslen As Integer, ByRef ppsdata As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DE_IC_Case1 Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal slotno As Byte, ByVal datalen As Integer, ByRef data As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DE_IC_Case2 Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal slotno As Byte, ByVal datalen As Integer, ByRef data As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DE_IC_Case3 Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal slotno As Byte, ByVal datalen As Integer, ByRef data As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DE_IC_Case4 Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal slotno As Byte, ByVal datalen As Integer, ByRef data As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DE_IC_PowerOff Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal slotno As Byte) As Integer
    Public Declare Function DE_T1Bypass Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal apdulen As Integer, ByVal slotno As Byte, ByVal nad As Byte, ByVal pcb As Byte, ByVal lenth As Byte, ByRef apdu As Byte, ByVal Irc As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	Public Declare Function DE_IC_Speed Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal slotno As Byte, ByVal fidi As Byte) As Integer
	Public Declare Function DE_CARD_APDU Lib "DualCardDll.dll" (ByVal nPort As Integer, ByVal slotno As Byte, ByVal datalen As Integer, ByRef data As Byte, ByRef outlen As Integer, ByRef lpRes As Byte) As Integer
	
	'ETC
	Public Declare Sub DE_GetDLLVersion Lib "DualCardDll.dll" (ByRef outlen As Integer, ByRef lpRes As Byte)

    'Get usb device list
    Public Declare Function DE_GetUSBDeviceList Lib "DualCardDll.dll" (ByVal useserial As Integer) As Integer
    Public Declare Function DE_GetUSBDeviceName Lib "DualCardDll.dll" (ByVal nIDX As Integer, ByRef devname As Byte) As Integer

	'Win32 API functions
	Public Declare Sub Sleep Lib "kernel32" (ByVal dwMilliseconds As Integer)
	'UPGRADE_ISSUE: 매개 변수를 'As Any'로 선언할 수 없습니다. 자세한 내용은 다음을 참조하십시오. 'ms-help://MS.VSCC.v90/dv_commoner/local/redirect.htm?keyword="FAE78A8D-8978-4FD4-8208-5B7324A8F795"'
	'UPGRADE_ISSUE: 매개 변수를 'As Any'로 선언할 수 없습니다. 자세한 내용은 다음을 참조하십시오. 'ms-help://MS.VSCC.v90/dv_commoner/local/redirect.htm?keyword="FAE78A8D-8978-4FD4-8208-5B7324A8F795"'
    'Public Declare Sub CopyMemory Lib "kernel32"  Alias "RtlMoveMemory"(ByRef Destination As Any, ByRef Source As Any, ByVal Length As Integer)
End Module