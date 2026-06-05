#include "StdAfx.h"
#include "Common.h"

CCommon::CCommon(void)
{
}

CCommon::~CCommon(void)
{
}

//MAKE ASCII To HEX(source CString)
BYTE CCommon::ASCII2HEX(CString str)
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



//MAKE HEX To ASCII(source CString, destination Byte)
void CCommon::HEX2ASCII(BYTE c, BYTE *asc)
{
	BYTE tmp;

	tmp = c & 0x0f;
	if(tmp<0x0a)	asc[1] = (tmp+0x30);
	else	asc[1] = (tmp+0x37);
	tmp = (c>>4)&0x0f;
	if(tmp<0x0a)	asc[0] = (tmp+0x30);
	else	asc[0] = (tmp+0x37);
}

//MAKE HEX To STRING(source Byte, Destination CStringq, data Length)
void CCommon::HEX2STRING(BYTE *hex, CString& str, int hexLen)
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

//MAKE STRING To HEX(source CString, Destination Byte)
void CCommon::STRING2HEX(CString str, BYTE *hex)
{
	int i;
	
	for(i = 0; i < str.GetLength()/2; i++){
		hex[i] = ASCII2HEX(str.Mid(i*2, 2));	
	}
}