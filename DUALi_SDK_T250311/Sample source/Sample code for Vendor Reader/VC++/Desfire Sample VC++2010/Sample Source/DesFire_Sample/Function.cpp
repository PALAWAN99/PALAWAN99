// Function.cpp: implementation of the CFunction class.
//
//////////////////////////////////////////////////////////////////////

#include "stdafx.h"
#include "Function.h"

#ifdef _DEBUG
#undef THIS_FILE
static char THIS_FILE[]=__FILE__;
#define new DEBUG_NEW
#endif

//////////////////////////////////////////////////////////////////////
// Construction/Destruction
//////////////////////////////////////////////////////////////////////

CFunction::CFunction()
{
}

CFunction::~CFunction()
{
}

void CFunction::CalculateCRC(int CRCType, BYTE *Data, UINT Length,BYTE *TransmitFirst, BYTE *TransmitSecond)
{
	BYTE chBlock;
	BYTE wCrc[2];
	switch(CRCType) 
	{
		case CRC_A:
			wCrc[0] = wCrc[1] = 0x63;
			break;
		case CRC_B:
			wCrc[0] = wCrc[1] = 0xFF;
			break;
		//case CRC_F:

		default:
			return;
	}
	do{
		chBlock = *Data++;
        UpdateCRC(chBlock, wCrc);
	}while (--Length);
	if (CRCType == CRC_B){
			wCrc[0] = ~wCrc[0];
            wCrc[1] = ~wCrc[1];
    }
	*TransmitFirst = wCrc[1];
	*TransmitSecond = wCrc[0];

}

void CFunction::UpdateCRC(BYTE ch, BYTE* lpwCrc_c)
{
    UINT lpwCrc,i;

    lpwCrc = lpwCrc_c[0];
    lpwCrc <<= 8;
    lpwCrc += lpwCrc_c[1];
    ch = (ch ^ lpwCrc_c[1]);
    ch = (ch^(ch<<4));
    i = ch;
    lpwCrc = (lpwCrc >> 8)^(i << 8)^(i << 3)^(i >> 4);
    lpwCrc_c[1] = lpwCrc & 0x00FF;
    lpwCrc_c[0] = (lpwCrc>>8) & 0x00FF;
}

BYTE CFunction::ASCII2HEX(CString str)
{
	BYTE temp;
	BYTE a[3];


	memcpy(a, str, 2);

	
	if((a[0]>='0') && (a[0] <= '9')) 		temp = (a[0]-'0');
	else if((a[0]>='a') && (a[0] <= 'f')) 	temp = (a[0]-'W');	//Capital
	else 									temp = (a[0]-'7');	//small
	temp <<= 4;
	if((a[1]>='0') && (a[1] <= '9')) 		temp |= (a[1]-'0');
	else if((a[1]>='a') && (a[1] <= 'f')) 	temp |= (a[1]-'W');	//Capital
	else									temp |= (a[1]-'7');	//small

	return(temp);
}

void CFunction::HEX2ASCII(BYTE c, BYTE *asc)
{
	BYTE tmp;

	tmp = c & 0x0f;
	if(tmp<0x0a)	asc[1] = (tmp+0x30);
	else	asc[1] = (tmp+0x37);
	tmp = (c>>4)&0x0f;
	if(tmp<0x0a)	asc[0] = (tmp+0x30);
	else	asc[0] = (tmp+0x37);
}

BYTE CFunction::HEX2BCD(BYTE decimal)
{
	return((decimal/10)*16 + (decimal%10));
}


void CFunction::HEX2STRING(BYTE *hex, CString& str, int hexLen)
{
	BYTE buf[MAX_DATA_LENGTH*2];
	int i;
	
	if(MAX_DATA_LENGTH < hexLen)
	{
		str = "Wrong Data(Length Error)";
		return ;

	}
	memset(buf, 0x00, MAX_DATA_LENGTH*2);
	for (i = 0; i < hexLen; i++){
		HEX2ASCII(hex[i], buf+(i*2));
	}

	str.Format("%s", buf);
}

void CFunction::strHEX2strBCD(BYTE *hexbuf, BYTE *bcdbuf, BYTE len)
{
	BYTE b;
	for(b = 0; b < len; b++)
		bcdbuf[b] = HEX2BCD(hexbuf[b]);
}

void CFunction::STRING2HEX(CString str, BYTE *hex)
{
/*	int		i, n;
	n = str.GetLength();
	for(i = 0; i < n; i++)
	{
		if(
	}*/
	int i;
	
	for(i = 0; i < str.GetLength()/2; i++){
		hex[i] = ASCII2HEX(str.Mid(i*2, 2));	
	}
}

int CFunction::STRING2ASCII(CString str, LPBYTE asc)
{
	int i;
	for(i = 0 ; i < str.GetLength() ; i++)
		asc[i] = str.GetBuffer()[i];

	return str.GetLength();
}

BYTE CFunction::GetBitInByte(BYTE B, BYTE pos) /*76543210순서로....*/
{
	UCHAR tmp[8] = {0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80};

    if((B & tmp[pos]) == 0){
        return 0;
    }
    else{
        return 1;
    }
}

void CFunction::ChangeBitInByte(UCHAR *B, UCHAR pos, UCHAR flag)
{
	unsigned char tmp[8] = {0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80};

    if((B[0] & tmp[pos]) == 0){
        if(flag == 1)
            B[0] = B[0] + tmp[pos]; 
    }
    else{
        if(flag == 0)
            B[0] = B[0] - tmp[pos];       
    }
}

BOOL CFunction::IsFileExisted(CString strFile)
{
	CFileFind ff;

	if(ff.FindFile(strFile))
		return TRUE;
	else 
		return FALSE;
}

void CFunction::DirCreate(CString str)
{
	CFileFind ff;

	if(ff.FindFile(str)){
		return;
	}
	else{
		CreateDirectory((LPCSTR) str, NULL); 
		return;
	}
}

int CFunction::GetMonthDayCount(int year, int month)
{
	int iDayCount;
	COleDateTime tm;

	tm.SetDate(year, month, 1);

	switch(month)
	{
	case 4:
		iDayCount = 30;
		break;
	case 6:
		iDayCount = 30;
		break;
	case 9:
		iDayCount = 30;
		break;
	case 11:
		iDayCount = 30;
		break;
	case 2:
		if(tm.SetDate(year, month, 29) == 0){
			iDayCount = 29;
		}
		else{
			iDayCount = 28;
		}				
		break;
	default:
		iDayCount = 31;		
		break;
	}
	return iDayCount;
}

CString CFunction::GetNextDay(int year, int month, int day)
{

	COleDateTime tm, tommorrow;
//	CString str;
	
	tm.SetDate(year, month, day);
	
	COleDateTimeSpan oneDay(1, 0, 0, 0);
	tommorrow = tm + oneDay;
	

	return tommorrow.Format("%Y\\%m\\%d");
	
}

int CFunction::BCD2HEX(BYTE BCDnum)
{
	return((BCDnum/16)*10 + (BCDnum%16));
}


CString CFunction::MakeMin2Hour(int min)
{
	int iHour, iMin;
	char cHour[3];
	char cMin[3];
	CString strResult, strHour, strMin, strTmp;

	iMin = min % 60;
	iHour = (min - iMin) / 60;

	_itoa(iMin, cMin, 10);
	_itoa(iHour, cHour, 10);
	strTmp = cHour;
	if(iHour < 10){
		strHour = "0" + strTmp;
	}else{
		strHour = strTmp;
	}

	strTmp = cMin;
	if(iMin < 10){
		strMin = "0" + strTmp;
	}
	else{
		strMin = strTmp;
	}

	strResult = strHour.Mid(0, 2) + ":" + strMin.Mid(0, 2);
	if (strResult == "00:00"){
		strResult = "";
	}
	return strResult;
}

CString CFunction::Get_Yoil(int y, int m, int d)
{
	COleDateTime tm;
	CString str;

	tm.SetDate(y, m, d);
	int i = tm.GetDayOfWeek();
	switch(i){
	case 1:
		str = "일";
		break;
	case 2:
		str = "월";
		break;
	case 3:
		str = "화";
		break;
	case 4:
		str = "수";
		break;
	case 5:
		str = "목";
		break;
	case 6:
		str = "금";
		break;
	case 7:
		str = "토";
		break;
	default:
		str = "휴";
		break;
	}

	return str;
}


void CFunction::GetTimeBCD(BYTE *pTime)
{
	COleDateTime tm;

	tm = COleDateTime::GetCurrentTime();

	pTime[0] = HEX2BCD(tm.GetYear()/100);
	pTime[1] = HEX2BCD(tm.GetYear()%100);
	pTime[2] = HEX2BCD(tm.GetMonth());
	pTime[3] = HEX2BCD(tm.GetDay());
	pTime[4] = HEX2BCD(tm.GetDayOfWeek() - 1);
	pTime[5] = HEX2BCD(tm.GetHour());
	pTime[6] = HEX2BCD(tm.GetMinute());
	pTime[7] = HEX2BCD(tm.GetSecond());
}

BOOL CFunction::OpenDB(CDatabase *DB, CString strODBC, int nTimeout, CString *strError)
{
	CString strLog;
	int nRcv;
	TRY
	{
		//DB가 열려있는지 확인.
		if(!DB->IsOpen())
			nRcv = DB->Open(NULL, FALSE, FALSE, strODBC, FALSE);
		else
			return TRUE;
	}
	CATCH(CDBException, e)
	{
		AfxMessageBox(e->m_strError);
		DB->Close();
		return FALSE;
	}
	END_CATCH
	if(nRcv == 0)
	{
		AfxMessageBox("DB Open Error");
		DB->Close();
		return FALSE;
	}
	DB->SetQueryTimeout(nTimeout);
	return TRUE;
}

int CFunction::GetDBCnt(CDatabase *DB, CString strQuery, CString *strError)
{
	int i = 0, nCnt = 0;
	CDBVariant covFieldValue;
	CRecordset MyRec(DB);
	CString tmp;

	TRY
		MyRec.Open(CRecordset::snapshot, strQuery);
	CATCH(CDBException, e)
	{
		*strError = e->m_strError;
		MyRec.Close();
		tmp = "State:S0002";
		if(memcmp(e->m_strStateNativeOrigin,tmp,11) == 0)//table이 없을 경우
			return -2;
		tmp = "State:07001";
		if(memcmp(e->m_strStateNativeOrigin,tmp,11) == 0)//field가 없을 경우
			return -3;
		return -1;
	}
	END_CATCH

	MyRec.GetFieldValue(i, covFieldValue, SQL_C_SLONG);
	if(covFieldValue.m_dwType != DBVT_NULL)
		nCnt = covFieldValue.m_lVal;
	MyRec.Close();
	if(nCnt == 0)
		*strError = "No Data!!";
	return nCnt;
}

int CFunction::ExeSQL(CDatabase *DB, CString strQuery, CString *strError)
{
	CString tmp;
	TRY
		DB->ExecuteSQL(strQuery);
	CATCH(CDBException, e)
	{
		*strError = e->m_strError;	
		tmp = "State:23000";
		if(memcmp(e->m_strStateNativeOrigin,tmp,11) == 0)//중복 데이터
			return -1;

		return FALSE;
	}
	END_CATCH

	return TRUE;
}
