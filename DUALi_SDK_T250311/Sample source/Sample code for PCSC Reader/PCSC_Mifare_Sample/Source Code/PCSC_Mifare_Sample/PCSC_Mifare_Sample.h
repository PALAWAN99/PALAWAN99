
// PCSC_Mifare_Sample.h : main header file for the PCSC application

#pragma once

#ifndef __AFXWIN_H__
	#error "#error include 'stdafx.h' before including this file for PCH"
#endif

#include "resource.h"		// main symbols

#include "Define.h"

#include "Winscard.h"

// CPCSC_Mifare_SampleApp:
// See PCSC_Mifare_Sample.cpp for the implementation of this class
//

class CPCSC_Mifare_SampleApp : public CWinApp
{
// Construction
public:
	CPCSC_Mifare_SampleApp();

// overriding.
	public:
		virtual BOOL InitInstance();
		BYTE ASCII2HEX(CString str);
		void STRING2HEX(LPCTSTR str, BYTE *hex);
		CString GetSCARDErrorMsg(LONG ret);
		void HEX2STRING(BYTE *hex, CString& str, int hexLen);
		void HEX2ASCII(BYTE c, BYTE *asc);
		SCARDCONTEXT    m_hContext;


// Implementation.

	DECLARE_MESSAGE_MAP()
};

extern CPCSC_Mifare_SampleApp theApp;