#ifndef _DUALCARDDLL_H_
#define _DUALCARDDLL_H_

#define API_DLL __declspec(dllexport)

#define DEBUGMODE	0		//0: not display debug msg, 1: display debug msg

#include "Winscard.h"
///////////////////////////////////////////////////////////
//Define
///////////////////////////////////////////////////////////
//return value
#define DE_OK									0
#define DE_ERROR								1
#define DE_NO_TAG_ERROR    						2 //(0x02)
#define DE_CRC_ERROR       						3 //(0x03)
#define DE_EMPTY								4 //(0x04)(NO IC CARD ERROR)	
#define DE_AUTHENTICATION_ERROR     			5 //(0x05)
#define DE_NO_POWER								5 //(0x05)
#define DE_PARITY_ERROR    						6 //(0x06)
#define DE_CODE_ERROR      						7 //(0x07)
#define DE_SERIAL_NUMBER ERROR      			8 //(0x08)
#define DE_KEY_ERROR       						9 //(0x09)
#define DE_NOT_AUTHENTICATION ERROR    			10 //(0x0A)
#define DE_BIT_COUNT_ERROR   					11 //(0x0B)	
#define DE_BYTE_COUNT_ERROR 					12 //(0x0C)		
#define DE_TRANSFER_ERROR      					14 //(0x0E)	
#define DE_WRITE_ERROR       					15 //(0x0F)	
#define DE_INCREMENT_ERROR         				16 //(0x10)	
#define DE_DECREMENT_ERROR         				17 //(0x11)	
#define DE_READ_ERROR         					18 //(0x12)	
#define DE_OVERFLOW_ERROR     					19 //(0x13)	
#define DE_POLLING_ERROR         				20 //(0x14)	
#define DE_FRAMING_ERROR         				21 //(0x15)	
#define DE_ACCESS_ERROR        					22 //(0x16)	
#define DE_UNKNOWN_COMMAND_ERROR				23 //(0x17)	
#define DE_ANTICOLLISION_ERROR         			24 //(0x18)	
#define DE_INITIALIZATION_ERROR					25 //(0x19)	
#define DE_INTERFACE_ERROR   		 			26 //(0x1A)	
#define DE_ACCESS_TIMEOUT_ERROR					27 //(0x1B)	
#define DE_NO_BITWISE_ANTICOLLISION_ERROR		28 //(0x1C)
#define DE_FILE_ERROR							29 //(0x1D)
#define DE_INVAILD_BLOCK_ERROR					32 //(0x20)
#define DE_ACK_COUNT_ERROR						33 //(0x21)
#define DE_NACK_DESELECT_ERROR					34 //(0x22)
#define DE_NACK_COUNT_ERROR						35 //(0x23)
#define DE_SAME_FRAME_COUNT_ERROR				36 //(0x24)
#define DE_RCV_BUFFER_TOO_SMALL_ERROR			49 //(0x31)
#define DE_RCV_BUFFER_OVERFLOW_ERROR			50 //(0x32)
#define DE_RF_ERROR								51 //(0x33)
#define DE_PROTOCOL_ERROR						52 //(0x34)
#define DE_USER_BUFFER_FULL_ERROR				53 //(0x35)
#define DE_BUADRATE_NOT_SUPPORTED				54 //(0x36)
#define DE_INVAILD_FORMAT_ERROR					55 //(0x37)
#define DE_LRC_ERROR							56 //(0x38)
#define DE_FRAMERR								57 //(0x39)
#define DE_WRONG_PARAMETER_VALUE				60 //(0x3C)
#define DE_INVAILD_PARAMETER_ERROR				61 //(0x3D)
#define DE_UNSUPPORTED_PARAMETER				62 //(0x3E)
#define DE_UNSUPPORTED_COMMAND					63 //(0x3F)
#define DE_INTERFACE_NOT_ENABLED				64 //(0x40)
#define DE_ACK_SUPPOSED							65 //(0x41)
#define DE_NACK_RECEVIED						66 //(0x42)
#define DE_BLOCKNR_NOT_EQUAL					67 //(0x43)
#define DE_TARGET_SET_TOX						68 //(0x44)
#define DE_TARGET_RESET_TOX						69 //(0x45)
#define DE_TARGET_DESELECTED					70 //(0x46)
#define DE_TARGET_RELEASED						71 //(0x47)
#define DE_ID_ALREADY_IN_USE            		72 //(0x48)
#define DE_INSTANCE_ALREADY_IN_USE				73 //(0x49)
#define DE_ID_NOT_IN_USE						74 //(0x4A)
#define DE_NO_ID_AVAILABLE              		75 //(0x4B)
#define DE_OTHER_ERROR							76 //(0x4C)
#define DE_INVALID_READER_STATE					77 //(0x4D)
#define DE_MI_JOINER_TEMP_ERROR					78 //(0x4C)
#define DE_NOTYET_IMPLEMENTED					100//(0x64)
#define DE_FIFO_ERROR							109//(0x6D)
#define DE_WRONG_SELECT_COUNT					114//(0x72)
#define DE_WRONG_VALUE							123//(0x7B)
#define DE_VALERR								124//(0x7C)
#define DE_RE_INIT								126//(0x7E)
#define DE_NO_INIT								127//(0x7F)
#define APP_INVALID_PORT						1000
#define APP_STX_ERROR							1001
#define APP_INVALID_LENGTH_ERROR				1002
#define APP_TIMEOUT_ERROR						1003
#define APP_CRC_ERROR							1004
#define APP_LRC_ERROR							1005
#define APP_RW_ERROR							1006
#define APP_ETX_ERROR							1007
#define APP_USB_WRITE_ERROR						1008
#define APP_USB_READ_ERROR						1009
#define APP_INVALID_SENDDATA_LEN				1010
#define APP_INVALID_SENDBUF_SIZE				1011
#define APP_TOO_SMALL_RECVBUF					1012
#define APP_SENDBUF_OVERFLOW					1013
#define APP_MODEM_ERROR_START					1024
#define APP_FELICA_ERROR						1014
#define APP_NFC_ERROR							1015
#define APP_NOT_ENCMODE							1016
#define APP_ENC_ERROR							1017

//HID ERROR
#define HID_WRITE_ERROR							1100
#define HID_READ_ERROR							1101
#define HID_TIMEOUT_ERROR						1102
#define HID_STX_ERROR							1103
#define HID_PACKET_ERROR						1104

//network Error
#define APP_NET_ERROR							2000
//PCSC Error
#define APP_PCSC_ERROR							2001
#define APP_PCSC_SW_ERROR						2002
#define APP_PCSC_LEN_ERROR						2003

//Finger position
#define	PLACE_FINGER	0xFF
#define LIFT_FINGER		0xFE
#define PLACE_OK		0
#define UP_MOVE			1
#define DOWN_MOVE		2
#define LEFT_MOVE		4
#define RIGHT_MOVE		8
#define DOWN_LEFT_MOVE	9
#define DOWN_RIGHT_MOVE	10
#define UP_LEFT_MOVE	11
#define UP_RIGHT_MOVE	12

//NFC
#define NFC_TARGET_MODE		0
#define NFC_INITIATOR_MODE  1

#define NFC_INITIATOR_MODE_ACTIVE	'A'
#define NFC_INITIATOR_MODE_PASSIVE  'P'

#define NFC_INITIATOR_SPEED_106		0
#define NFC_INITIATOR_SPEED_212		1
#define NFC_INITIATOR_SPEED_424		2

#define NFC_STOPCODE_INITIATOR_DSL_REQ		0
#define NFC_STOPCODE_INITIATOR_RLS_REQ		1
#define NFC_STOPCODE_TARGET					2

//Public Card
#define PUBLIC_SOCIALID		0
#define PUBLIC_ISSCNT		1
#define PUBLIC_HANNAME		2
#define PUBLIC_ENGNAME		3
#define PUBLIC_DEPT			4

//ReceiptType
#define  RC_TYPE_Approval				0x00
#define  RC_TYPE_Approval_OnlyDigital	0x01
#define  RC_TYPE_Approval_Reissuing		0x02
#define  RC_TYPE_Cancellation			0x10
#define  RC_TYPE_Inquiry				0x20
#define  RC_TYPE_ETC					0xFF

//PaymentType
#define  PM_TYPE_Cash				0x10
#define  PM_TYPE_Card				0x20
#define  PM_TYPE_Card_Credit		0x21
#define  PM_TYPE_Card_Debit			0x22
#define  PM_TYPE_Mobile				0x30
#define  PM_TYPE_Mobile_Credit		0x31
#define  PM_TYPE_Mobile_Debit		0x32
#define  PM_TYPE_Voucher			0x40
#define  PM_TYPE_ETC				0x90

//DiscountType
#define  DC_TYPE_None					0x00
#define  DC_TYPE_Membership_Point		0x01
#define  DC_TYPE_Membership_Discount	0x02
#define  DC_TYPE_Coupon					0x04
#define  DC_TYPE_Stamp					0x08
#define  DC_TYPE_ETC					0x80

//TypeOfGoods
#define  TG_NORMAL					0x00
#define  TG_OIL						0x10
#define  TG_DISCOUNT				0x20
#define  TG_DISCOUNT_EVENT			0x21 
#define  TG_DISCOUNT_COUPON			0x22
#define  TG_DISCOUNT_MEMBERSHIP		0x23
#define  TG_TAX						0x90

//TypeOfSignature
#define  TS_PNG					0x01
#define  TS_GIF					0x02
#define  TS_JPG					0x03

//PAY Error
#define DE_SETPARA								200//(0xC8)

#define DE_LOCALADDERR							1200
#define DE_LOCALPURERR							1201

//BLOCK LOG CONT
#define DE_LOCALLOGCNT							2
#define DE_LOCALLOGDATA							(DE_LOCALLOGCNT+1)
#define DE_LOCALBLOCKCNT						(DE_LOCALLOGDATA*2)+4

//ENC MODE for coummincation
#define ENCMODE_NOTUSE	0
#define ENCMODE_USE		1

//PCSC
#define PCSC_DETECTFLAG_OFF	0
#define PCSC_DETECTFLAG_ON	1
//DesFire Key type
#define DESFIRE_KEYTYPE_DES					0
#define DESFIRE_KEYTYPE_3KEYTDES			1
#define DESFIRE_KEYTYPE_AES					2
#define DESFIRE_KEYTYPE_AES_FOR_FIRSTAUTH	3

//port define
#define PORT_USB			100
#define PORT_PCSC			10000
#define PORT_HID			11000
#define PORT_NETWORK		20000

//////////////////////////////////////////////////////////
//Function
///////////////////////////////////////////////////////////
//common
extern "C" API_DLL void WINAPI GetDLLVersion(char* version);
extern "C" API_DLL int WINAPI GetErrMsg(int errcode,char* retmsg);
extern "C" API_DLL int WINAPI DE_InitPort(int nPort,int nBaud);
extern "C" API_DLL void WINAPI DE_ClosePort(int nPort);
extern "C" API_DLL int WINAPI DE_SetENCMode(int nPort,int ENCFlag);
extern "C" API_DLL int WINAPI DE_ChangeENCKey(int nPort,BYTE* NewKey);
extern "C" API_DLL int WINAPI DE_Polling(int nPort, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes, int timeout = 3000);//default timeout(only use for serial communication):3s
extern "C" API_DLL int WINAPI DE_Polling_HID(int nPort, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes, int timeout = 3000);//default timeout(only use for serial communication):3s
extern "C" API_DLL int WINAPI DE_Polling_SetHIDMode(int nPort, BYTE mode);
extern "C" API_DLL int WINAPI DE_SerialPolling(int nPort, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes, int timeout = 3000);//default timeout(only use for serial communication):3s
extern "C" API_DLL int WINAPI DE_ByPassCommand(int nPort, int datalen, BYTE Cmd, LPBYTE data, LPINT outlen, LPBYTE lpRes, int timeout = 3000);//default timeout:300ms

//Device control command
extern "C" API_DLL int WINAPI DE_RFOn(int nPort);
extern "C" API_DLL int WINAPI DE_RFOff(int nPort);
extern "C" API_DLL int WINAPI DE_RFReset(int nPort);
extern "C" API_DLL int WINAPI DE_BuzzerOff(int nPort);
extern "C" API_DLL int WINAPI DE_BuzzerOn(int nPort);
extern "C" API_DLL int WINAPI DE_ChangeDevice(int nPort, LPBYTE mode, int Inqflag);
extern "C" API_DLL int WINAPI DE_GetVersion(int nPort, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_ChangeTRXSpeed(int nPort, BYTE Trxspd);
extern "C" API_DLL int WINAPI DE_RWFlash(int nPort, BYTE flag, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes,BYTE offset,BYTE toread);
extern "C" API_DLL int WINAPI DE_ContactWTX(int nPort, BYTE Slot, BYTE Wtx);
extern "C" API_DLL int WINAPI DE_ContactAntiTearing(int nPort, BYTE AtiH, BYTE AtiM, BYTE AtiL);
extern "C" API_DLL int WINAPI DE_RFAntiTearing(int nPort, BYTE AtiH, BYTE AtiM, BYTE AtiL);
extern "C" API_DLL int WINAPI DE_GetReaderUID(int nPort, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_SetReaderUIDMode(int nPort, BOOL isvariable);

//Type B
extern "C" API_DLL int WINAPI DEB_Transparent(int nPort, BYTE datalen, LPBYTE data, BYTE TOUT, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEB_TransparentCRC(int nPort, BYTE datalen, LPBYTE data, LPBYTE crc, BYTE TOUT, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEB_BFRAMING(int nPort, BYTE Fvalue);
//Type A
extern "C" API_DLL int WINAPI DEA_Reset(int nPort, LPBYTE lpdelay);
extern "C" API_DLL int WINAPI DEA_Idle_Req(int nPort, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Wakeup_Req(int nPort, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Anticoll(int nPort, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Select(int nPort, LPBYTE uid, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Auth(int nPort, BYTE mode, BYTE keyno, BYTE blockno);
extern "C" API_DLL int WINAPI DEA_Halt(int nPort);
extern "C" API_DLL int WINAPI DEA_Read(int nPort, BYTE blockno, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Write(int nPort, BYTE blockno, int datalen, LPBYTE data);
extern "C" API_DLL int WINAPI DEA_Increment(int nPort, BYTE blockno, LPBYTE value);
extern "C" API_DLL int WINAPI DEA_Decrement(int nPort, BYTE blockno, LPBYTE value);
extern "C" API_DLL int WINAPI DEA_Inc_Transfer(int nPort, BYTE blockno, LPBYTE value, BYTE trblockno);
extern "C" API_DLL int WINAPI DEA_Dec_Transfer(int nPort, BYTE blockno, LPBYTE value, BYTE trblockno);
extern "C" API_DLL int WINAPI DEA_Restore(int nPort, BYTE blockno);
extern "C" API_DLL int WINAPI DEA_Transfer(int nPort, BYTE blockno);
extern "C" API_DLL int WINAPI DEA_Loadkey(int nPort, BYTE mode, BYTE keyno, LPBYTE keydata);
extern "C" API_DLL int WINAPI DEA_Authkey(int nPort, BYTE mode, LPBYTE keydata, BYTE blockno);
extern "C" API_DLL int WINAPI DEA_Req_Auth(int nPort, BYTE requestmode, BYTE authmode, BYTE keyno, BYTE blockno, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Req_Authkey(int nPort, BYTE requestmode, BYTE authmode, BYTE blockno, LPBYTE keydata, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Inc_Transfer2(int nPort, BYTE blockno, LPBYTE value, BYTE trblockno);
extern "C" API_DLL int WINAPI DEA_Dec_Transfer2(int nPort, BYTE blockno, LPBYTE value, BYTE trblockno);
extern "C" API_DLL int WINAPI DEA_Req_AuthRead(int nPort, BYTE requestmode, BYTE authmode, BYTE keyno, BYTE blockno, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Req_AuthkeyRead(int nPort, BYTE requestmode, BYTE authmode, BYTE blockno, LPBYTE keydata, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Req_AuthWrite(int nPort, BYTE requestmode, BYTE authmode, BYTE keyno, BYTE blockno, LPBYTE data, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Req_AuthkeyWrite(int nPort, BYTE requestmode, BYTE authmode, BYTE blockno, LPBYTE keydata, LPBYTE data, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Req_Select(int nPort, BYTE requestmode, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_UltraM_Write(int nPort, BYTE address, LPBYTE data);
extern "C" API_DLL int WINAPI DEA_AntiSelLevel(int nPort, LPINT outlen, LPBYTE lpRes); //0x3D
extern "C" API_DLL int WINAPI DEA_AnticollLevel(int nPort, BYTE cmd, BYTE bitcnt,BYTE uidlen, LPBYTE uid, LPINT outlen, LPBYTE lpRes); //0x3E
extern "C" API_DLL int WINAPI DEA_SelectLevel(int nPort, BYTE cmd, LPBYTE Uid, LPINT outlen, LPBYTE lpRes); //0x3F
extern "C" API_DLL int WINAPI DEA_DeviceInfo(int nPort, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Transparent(int nPort, BYTE datalen, LPBYTE data, BYTE TOUT, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Transparent2(int nPort, BYTE datalen, LPBYTE data, BYTE TOUT, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Transparent3(int nPort, BYTE datalen, LPBYTE data, BYTE Tx_Mode, BYTE Rx_Mode, BYTE TOUT,BYTE Tx_Bit, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_TransparentCRC(int nPort, BYTE datalen, LPBYTE data, LPBYTE crc, BYTE TOUT, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_BitMode(int nPort, BYTE datalen, BYTE TxByteNo, BYTE TxBitNo, LPBYTE data, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_BitModeAnti(int nPort, BYTE datalen, BYTE TxByteNo, BYTE TxBitNo, LPBYTE data, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_BitMode2(int nPort, BYTE datalen, BYTE TxByteNo, BYTE TxBitNo, LPBYTE data, LPINT outlen, LPBYTE lpRes);

//MiFare Ultralight C
extern "C" API_DLL int WINAPI DEA_Write_ULC(int nPort, BYTE blockno, int datalen, LPBYTE data);
extern "C" API_DLL int WINAPI DEA_Authkey_ULC(int nPort, LPBYTE AuthKey);

//TYPE A/B Common Function
extern "C" API_DLL int WINAPI DE_APDU(int nPort, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FindCard(int nPort, BYTE baud, BYTE cid, BYTE nad, BYTE option, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEAB_RwWrite(int nPort, BYTE Data);
extern "C" API_DLL int WINAPI DEAB_RwRead(int nPort, LPBYTE lpRes);

//Contact card command
extern "C" API_DLL int WINAPI DE_IC_PowerOn(int nPort, BYTE slotno, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_IC_PPS(int nPort, BYTE slotno, int ppslen, LPBYTE ppsdata, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_IC_Case1(int nPort, BYTE slotno, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_IC_Case2(int nPort, BYTE slotno, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_IC_Case3(int nPort, BYTE slotno, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_IC_Case4(int nPort, BYTE slotno, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_IC_PowerOff(int nPort, BYTE slotno);
extern "C" API_DLL int WINAPI DE_T1Bypass(int nPort, int apdulen, BYTE slotno, BYTE nad, BYTE pcb, BYTE lenth, LPBYTE apdu, BYTE Irc, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_IC_Speed(int nPort, BYTE slotno, BYTE fidi);
extern "C" API_DLL int WINAPI DE_CARD_APDU(int nPort, BYTE slotno, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_CARD_PARITY_ERROR_TEST(int nPort, BYTE Option1, BYTE Option2, LPINT outlen, LPBYTE lpRes);

//15693
extern "C" API_DLL int WINAPI DED_Inventory(int nPort, BYTE Flag, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DED_Select(int nPort, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DED_Read(int nPort, BYTE blockno, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DED_Write(int nPort, BYTE blockno, LPBYTE data, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DED_Transparent(int nPort, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DED_Eof(int nPort, LPINT outlen, LPBYTE lpRes);
//ETC
extern "C" API_DLL void WINAPI DE_GetDLLVersion(LPINT outlen, LPBYTE lpRes);
//extern "C" API_DLL int WINAPI DE_READ_PublicService(int nPort, LPBYTE	q_key, LPINT outlen, LPBYTE lpRes);

//Finger(jfinger)
extern "C" API_DLL int WINAPI DE_FingerGetImageStart(int nPort,BYTE* Imagepos);
extern "C" API_DLL int WINAPI DE_FingerGetImageData(int nPort,BYTE imageflag,char* imagepath);
extern "C" API_DLL int WINAPI DE_FingerEnroll(int nPort,int* quality,int* processtime,BYTE* templatedata,int* templatelen);
extern "C" API_DLL int WINAPI DE_FingerVerify(int nPort,int* quality,int* processtime);
extern "C" API_DLL int WINAPI DE_FingerCalibrate(int nPort);
extern "C" API_DLL int WINAPI DE_FingerDownloadTemplate(int nPort,BYTE index,BYTE* templatedata,int templatelen);
extern "C" API_DLL int WINAPI DE_CheckFingerPresent(int nPort);

//NFC
extern "C" API_DLL int WINAPI DE_NFC_CTRLGetData(int nPort, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_NFC_SendData(int nPort,BYTE mode, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_NFC_Init_INITIATOR(int nPort, BYTE mode, BYTE speed, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_NFC_Init_TARGET(int nPort, BYTE timeout, BYTE mode,LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_NFC_Stop(int nPort, BYTE code);
extern "C" API_DLL int WINAPI DE_NFC_GetTargetData(int nPort, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_NFC_SetTargetData(int nPort, int datalen, LPBYTE data);
extern "C" API_DLL int WINAPI DE_NFC_GetTargetState(int nPort, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_NFC_TAG_CMD(int nPort, BYTE TagType,BYTE TagCMD, int optdatalen, LPBYTE optdata, LPINT outlen, LPBYTE lpRes);


//picture
extern "C" API_DLL int WINAPI DE_Still_Image_Capture(int nPort, LPINT outlen, LPBYTE lpRes);

//Type C for RC-S250
extern "C" API_DLL int WINAPI DEC_ControllernRWAuth(int nPort, BYTE slotno, BOOL bUseEncCmd, LPBYTE key, LPBYTE CBC);
extern "C" API_DLL int WINAPI DEC_FeliCaPolling(int nPort, BOOL bUseEncCmd, LPBYTE syscode, BYTE timeslot, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEC_MutualAuth(int nPort,BOOL nuseTdes,LPBYTE pGroupKey,LPBYTE pUserKey,LPBYTE AreaCode,LPBYTE ServiceCode);
extern "C" API_DLL int WINAPI DEC_MutualAuth_RWSAM(int nPort,BOOL nuseTdes,LPBYTE Systemcode,LPBYTE GSKcode,LPBYTE GSKversion,LPBYTE USKcode,LPBYTE USKversion);
extern "C" API_DLL int WINAPI DEC_ReadCardwithENC(int nPort,LPBYTE pGroupKey,LPBYTE pUserKey,LPBYTE AreaCode,LPBYTE ServiceCode,BYTE BolockCnt,BYTE byteferblock,LPBYTE BlockList,BOOL nuseTdes, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEC_WriteCardwithENC(int nPort,LPBYTE pData,LPBYTE pGroupKey,LPBYTE pUserKey,LPBYTE AreaCode,LPBYTE ServiceCode,BYTE BolockCnt,BYTE byteferblock,LPBYTE BlockList,BOOL nuseTdes);
extern "C" API_DLL int WINAPI DEC_ReadCardwithENC_NoMA(int nPort,LPBYTE AreaCode,LPBYTE ServiceCode,BYTE BolockCnt,BYTE byteferblock,LPBYTE BlockList,BOOL nuseTdes, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEC_WriteCardwithENC_NoMA(int nPort,LPBYTE pData,LPBYTE AreaCode,LPBYTE ServiceCode,BYTE BolockCnt,BYTE byteferblock,LPBYTE BlockList,BOOL nuseTdes);

extern "C" API_DLL int WINAPI DEC_RequestService(int nPort,BOOL nuseTdes, BYTE nAreaORService, LPBYTE pCodeList, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEC_Transparent(int nPort, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes, BYTE tout = 0xB0);//default timeout:300ms
extern "C" API_DLL int WINAPI DEC_Polling_NoENC(int nPort, LPBYTE systemcode, BYTE requestsyscode, BYTE timeslot, LPINT outlen, LPBYTE lpRes, BYTE tout = 0xB0);//default timeout:300ms
extern "C" API_DLL int WINAPI DEC_Read_NoENC(int nPort, LPBYTE IDm, LPBYTE servicecode, BYTE block, LPINT outlen, LPBYTE lpRes, BYTE tout = 0xB0);//default timeout:300ms
extern "C" API_DLL int WINAPI DEC_Write_NoENC(int nPort, LPBYTE IDm, LPBYTE servicecode, BYTE block, LPBYTE blockdata, LPINT outlen, LPBYTE lpRes, BYTE tout = 0xB0);//default timeout:300ms

//NFC
extern "C" API_DLL int WINAPI LLC_MAC_Activation(int nPort,int sendlen, BYTE* sendbuf, unsigned short* outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI LLC_MAC_DeActivetion(int nPort, BYTE type);
extern "C" API_DLL int WINAPI LLC_Connect_Request(int nPort,BYTE type, int inlen, BYTE* inbuf, int* outlen, BYTE* outbuf);
extern "C" API_DLL int WINAPI LLC_Connect_Response(int nPort, BYTE sel, BYTE dir, BYTE Reason);
extern "C" API_DLL int WINAPI LLC_Disconnect_Request(int nPort, BYTE dir);
extern "C" API_DLL int WINAPI LLC_Send_Recieve_Ready(int nPort, BYTE dir, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI LLC_Send_Symmetry(int nPort);
extern "C" API_DLL int WINAPI LLC_Send_Information(int nPort, BYTE dir, int nData, LPBYTE pData);
extern "C" API_DLL int WINAPI LLC_Send_Text(int nPort, BYTE type, int nData, LPBYTE pData, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI LLC_Receive_Text(int nPort, BYTE pType, LPINT outlen, LPBYTE lpRes);

extern "C" API_DLL int WINAPI LLC_SendData_PCSC(SCARDHANDLE hCardHandle, const struct _SCARD_IO_REQUEST* IOrequest,int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes,int timeout);
extern "C" API_DLL int WINAPI LLC_SendData(int nPort,int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes,int timeout);

//PCSC
extern "C" API_DLL int WINAPI DE_GetPSCSReaderList();
extern "C" API_DLL BOOL WINAPI DE_GetPCSCReaderName(int nIdx, LPBYTE pReader);
extern "C" API_DLL int WINAPI DE_SCardConnect(int nPort);
extern "C" API_DLL int WINAPI DE_SCardDisConnect(int nPort);
extern "C" API_DLL int WINAPI DE_SCardTransmit(int nPort, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_AutoDetectOnOff(int nPort,BYTE detectflag);
extern "C" API_DLL int WINAPI DE_GetLastPCSCErrMsg(char* retmsg);
extern "C" API_DLL int WINAPI DE_Get620PSCSReaderIDX();

//Get usb device list
extern "C" API_DLL int WINAPI DE_GetUSBDeviceList(int useserial = 1);
extern "C" API_DLL int WINAPI DE_GetUSBDeviceName(int nIDX, char* devname);

//Mifare Plus Activation
extern "C" API_DLL int WINAPI DE_MifarePlus_Activation(int nPort, LPBYTE Master_Key, LPBYTE Conf_Key, LPBYTE L2sw_Key, LPBYTE L3sw_Key, LPBYTE SAK, LPBYTE UID, LPINT UID_Length);

//DesFire
extern "C" API_DLL int WINAPI DE_DESFireAuthentication(int nPort,int KeyNo, LPBYTE KeyData, int KeyLen, LPBYTE Sessionkey, LPINT SessionkeyLen);
extern "C" API_DLL int WINAPI DE_DESFireAuthentication_AES(int nPort,int KeyNo, LPBYTE KeyData, int KeyLen, LPBYTE Sessionkey, LPINT SessionkeyLen);
extern "C" API_DLL int WINAPI DE_DESFireAuthentication_UseKeyType(int nPort,int KeyType, int KeyNo, LPBYTE KeyData, int KeyLen, LPBYTE Sessionkey, LPINT SessionkeyLen);
extern "C" API_DLL int WINAPI DE_DESFireTransparent(int nPort,BYTE Flag, int CmdDataLen, int DataLen, LPBYTE pData, LPINT outlen, LPBYTE lpRes); 
//DesFire Batch function
extern "C" API_DLL int WINAPI DE_DESFire_SetConfig_Batch(int nPort, LPBYTE AID, LPBYTE Key, int KeyLen, int KeyNo);
extern "C" API_DLL int WINAPI DE_DESFire_SetConfig_Batch_AES(int nPort, LPBYTE AID, LPBYTE Key, int KeyLen, int KeyNo);
extern "C" API_DLL int WINAPI DE_DESFire_ReadFile_Batch(int nPort, BYTE Flag, BYTE FileNo, int Offset, int Filesize, LPINT outlen, LPBYTE lpRes, LPBYTE CardStatus);
extern "C" API_DLL int WINAPI DE_DESFire_WriteFile_Batch(int nPort, BYTE Flag, BYTE FileNo, int Offset, int Filesize, LPBYTE pData, LPBYTE CardStatus);
extern "C" API_DLL int WINAPI DE_DESFire_Debit_Batch(int nPort, BYTE Flag, BYTE FileNo, int Value, LPBYTE CardStatus);
extern "C" API_DLL int WINAPI DE_DESFire_Credit_Batch(int nPort, BYTE Flag, BYTE FileNo, int Value, LPBYTE CardStatus);
extern "C" API_DLL int WINAPI DE_DESFire_ReadValue_Batch(int nPort, BYTE Flag, BYTE FileNo, LPINT Value, LPBYTE CardStatus);

//NetWork
extern "C" API_DLL int WINAPI DE_Set_NetPara(int nPort, LPBYTE pIP, int nNetPort, int nTimeout);

//FeliCa Batch function for RC-S500
extern "C" API_DLL int WINAPI DE_FeliCa_RWSAMMutualAuthInDES(int nPort, int SamSlotNum, BYTE ENCMode, LPBYTE DefaultKey, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_RWSAMMutualAuthInAES(int nPort, int SamSlotNum, BYTE ENCMode, LPBYTE DefaultKey, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_CardMutualAuthInDES_GSKUSK(int nPort, int NoA, LPBYTE LoAC, int NoS, LPBYTE LoSC, LPBYTE GSK, LPBYTE USK, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_MutualAuthRWSAMInDES_GSKUSKVersion(int nPort, LPBYTE SC, LPBYTE GSKC, LPBYTE GSKV, LPBYTE USKC, LPBYTE USKV, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_MutualAuthRWSAMInDES_ACSC(int nPort, LPBYTE SC, LPBYTE SKV, int NoA, LPBYTE LoACKV, int NoS, LPBYTE LoSCKV, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_CardMutualAuthInAES_GK(int nPort, int NoS, LPBYTE LoSC, LPBYTE GK, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_MutualAuthRWSAMInAES_SC(int nPort, LPBYTE SC, int NoS, LPBYTE LoSCKV, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_MutualAuthRWSAMInAES_GKC(int nPort, LPBYTE SC, LPBYTE GKC, LPBYTE GKV, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_GenerateGroupKey(int nPort, int NoS, LPBYTE GSK, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_Polling(int nPort, LPBYTE SC, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_ReadBlock(int nPort, int NoB, LPBYTE BL, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_WriteBlock(int nPort, int NoB, LPBYTE BL, LPBYTE BD);
extern "C" API_DLL int WINAPI DE_FeliCa_ReadBlockWithoutEnc(int nPort, int NoS, LPBYTE LoSC, int NoB, LPBYTE LoBN, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_WriteBlockWithoutEnc(int nPort, int NoS, LPBYTE LoSC, int NoB, LPBYTE LoBN, LPBYTE BD);
extern "C" API_DLL int WINAPI DE_FeliCa_RequestService(int nPort,BYTE PDT, BYTE NoAS, LPBYTE LoSC, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_RequestServiceV2(int nPort, BYTE PDT, int NoN, LPBYTE LoNC, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_PollingWithoutRWSAM(int nPort, LPBYTE SystemCode, BYTE timeSlot, BYTE RequestCode, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_ReadWithoutRWSAMWithoutEnc(int nPort, int NoS, LPBYTE LoSC, int NoB, LPBYTE LoBN, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DE_FeliCa_WriteWithoutRWSAMWithoutEnc(int nPort, int NoS, LPBYTE LoSC, int NoB, LPBYTE LoBN, LPBYTE BD);
extern "C" API_DLL int WINAPI DE_FeliCa_APDU(int nPort, int SamSlotNum, int datalen, LPBYTE data, LPINT outlen, LPBYTE lpRes, int retrycnt=1);

//MiFareSAM batch
extern "C" API_DLL int WINAPI DEA_MutualAuthentication_MIFARESAM(int nPort, BYTE nSlot, BYTE* UID, BYTE MifareKeyType, BYTE blockNo, BYTE blockTrailer, BYTE keyNo, BYTE keyVer, BYTE isDiversification, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_ReadData_MIFARESAM(int nPort, BYTE blockNo, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_WriteData_MIFARESAM(int nPort, BYTE blockNo, BYTE* pData, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Increment_MIFARESAM(int nPort, BYTE blockNo, BYTE* value, LPINT outlen, LPBYTE lpRes);
extern "C" API_DLL int WINAPI DEA_Decrement_MIFARESAM(int nPort, BYTE blockNo, BYTE* value, LPINT outlen, LPBYTE lpRes);
#endif // _DUALCARDDLL_H_