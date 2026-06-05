#pragma once
#define MAX_DATA_LENGTH				10000
class CCommon
{
public:
	CCommon(void);
	~CCommon(void);
	void HEX2STRING(BYTE *hex, CString& str, int hexLen);
	void HEX2ASCII(BYTE c, BYTE *asc);	
	void STRING2HEX(CString str, BYTE *hex);
	BYTE ASCII2HEX(CString str);
};
