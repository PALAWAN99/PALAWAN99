// PCSC.h : main header file for the PCSC application
//

#if !defined(AFX_PCSC_H__BA71D34E_02BC_4166_8410_DA5E39BB51EE__INCLUDED_)
#define AFX_PCSC_H__BA71D34E_02BC_4166_8410_DA5E39BB51EE__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#ifndef __AFXWIN_H__
	#error include 'stdafx.h' before including this file for PCH
#endif

#include "resource.h"		// main symbols

/////////////////////////////////////////////////////////////////////////////
// CPCSCApp:
// See PCSC.cpp for the implementation of this class
//
struct SET_CONFIG
{
	BYTE	speed;				//Max Card Communication Speed:0~3(106K,212K,24k,848K)
	BYTE	field_strength;		//Field Strength Resister:0~3F
	BYTE	B_modulation;		//B-TYPE Modulation Resister:0~3F
	BYTE	A_recv_gain;		//A-TYPE Receive Gain:1~3
	BYTE	B_recv_gain;		//B-TYPE Receive Gain:1~3	
	BYTE	A_recv_threshold;	//A-TYPE Receive Threshold:0~255
	BYTE	B_recv_threshold;	//B-TYPE Receive Threshold:0~255
	BYTE	wait;				//Max Card Wait Parameter Set:10~14(300ms,600ms,1.2s,2.4s,4.8s)
};

class CPCSCApp : public CWinApp
{
public:
	CPCSCApp();

// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CPCSCApp)
	public:
	virtual BOOL InitInstance();
	//}}AFX_VIRTUAL

// Implementation

	//{{AFX_MSG(CPCSCApp)
		// NOTE - the ClassWizard will add and remove member functions here.
		//    DO NOT EDIT what you see in these blocks of generated code !
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};


/////////////////////////////////////////////////////////////////////////////

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_PCSC_H__BA71D34E_02BC_4166_8410_DA5E39BB51EE__INCLUDED_)
