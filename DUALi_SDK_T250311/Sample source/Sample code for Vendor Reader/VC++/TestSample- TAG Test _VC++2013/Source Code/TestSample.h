// TestSample.h : main header file for the TESTSAMPLE application
//

#if !defined(AFX_TESTSAMPLE_H__8585D365_3335_4D00_808F_24EF07EB83D6__INCLUDED_)
#define AFX_TESTSAMPLE_H__8585D365_3335_4D00_808F_24EF07EB83D6__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#ifndef __AFXWIN_H__
	#error include 'stdafx.h' before including this file for PCH
#endif

#include "resource.h"		// main symbols
#include "DualCardDllHeader.h"
/////////////////////////////////////////////////////////////////////////////
// CTestSampleApp:
// See TestSample.cpp for the implementation of this class
//

class CTestSampleApp : public CWinApp
{
public:
	CTestSampleApp();

// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CTestSampleApp)
	public:
	virtual BOOL InitInstance();
	//}}AFX_VIRTUAL

// Implementation

	//{{AFX_MSG(CTestSampleApp)
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};


/////////////////////////////////////////////////////////////////////////////

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_TESTSAMPLE_H__8585D365_3335_4D00_808F_24EF07EB83D6__INCLUDED_)
