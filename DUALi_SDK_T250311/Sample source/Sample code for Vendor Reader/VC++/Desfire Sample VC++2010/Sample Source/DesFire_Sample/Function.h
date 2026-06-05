// Function.h: interface for the CFunction class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_FUNCTION_H__8F1238C3_331A_11D5_8E58_0050DA8989F5__INCLUDED_)
#define AFX_FUNCTION_H__8F1238C3_331A_11D5_8E58_0050DA8989F5__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000
#include <vector>

struct ERRINFO
{
	CString errID;
	int errCnt;
};

using namespace std;

/*const BYTE KeyA2[8] = {0x57, 0xa1, 0x62, 0x32, 0xe4, 0xf9, 0xdd, 0x6e};
const BYTE KeyB2[8] = {0x53, 0x46, 0x3f, 0x0b, 0x1c, 0xd1, 0xb1, 0x78};
const BYTE KeyC2[8] = {0x48, 0x69, 0xc5, 0x94, 0x0c, 0xc0, 0x09, 0x12};*/

#define CRC_A					0
#define CRC_B					1
#define CRC_F					2
#define LRC						3

#define ENCRYPT		1
#define DECRYPT		0

class CFunction : public CObject  
{
public:
	int ExeSQL(CDatabase *DB, CString strQuery,CString *strError);
	int GetDBCnt(CDatabase *DB, CString strQuery, CString *strError);
	BOOL OpenDB(CDatabase *DB, CString strODBC, int nTimeout, CString *strError);
	void GetTimeBCD(BYTE* pTime);
	CString Get_Yoil(int y, int m, int d);
	CString MakeMin2Hour(int min);
	int BCD2HEX(BYTE BCDnum);
	CString GetNextDay(int year, int month, int day);
	int GetMonthDayCount(int year, int month);
	void DirCreate(CString str);
	BOOL IsFileExisted(CString strFile);
	void ChangeBitInByte(UCHAR* B, UCHAR pos, UCHAR flag);
	BYTE GetBitInByte(BYTE B, BYTE pos);
	void STRING2HEX(CString str, BYTE *hex);
	int STRING2ASCII(CString str, LPBYTE asc);
	void strHEX2strBCD(BYTE *hexbuf, BYTE *bcdbuf, BYTE len);
	void HEX2STRING(BYTE *hex, CString& str, int hexLen);
	BYTE HEX2BCD(BYTE decimal);
	void HEX2ASCII(BYTE c, BYTE *asc);
	BYTE ASCII2HEX(CString str);

	void UpdateCRC(BYTE ch, BYTE* lpwCrc_c);
	void CalculateCRC(int CRCType, BYTE *Data, UINT Length,BYTE *TransmitFirst, BYTE *TransmitSecond);

	CFunction();
	virtual ~CFunction();
};

#endif // !defined(AFX_FUNCTION_H__8F1238C3_331A_11D5_8E58_0050DA8989F5__INCLUDED_)
