// MyComboBox.cpp : implementation file
//

#include "stdafx.h"
#include "PCSC_Mifare_Sample.h"
#include "MyComboBox.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif

/////////////////////////////////////////////////////////////////////////////
// CMyComboBox

CMyComboBox::CMyComboBox()
{
	m_bKeyDown = FALSE;
}

CMyComboBox::~CMyComboBox()
{
}


BEGIN_MESSAGE_MAP(CMyComboBox, CComboBox)
	//{{AFX_MSG_MAP(CMyComboBox)
	ON_WM_KILLFOCUS()
	//}}AFX_MSG_MAP
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CMyComboBox message handlers

void CMyComboBox::SetText(BOOL flag)
{
	CString msg;
	CListCtrl*	pList = (CListCtrl*)GetParent();

	if(flag)
	{
		GetWindowText(msg);
		pList->SetItemText(m_nRow,m_nCol, msg);
	}
	pList->SetFocus();
	ShowWindow(SW_HIDE);//MoveWindow(0, 0, 0, 0);	
}

BOOL CMyComboBox::PreTranslateMessage(MSG* pMsg) 
{
	return CComboBox::PreTranslateMessage(pMsg);
}

void CMyComboBox::OnKillFocus(CWnd* pNewWnd) 
{
	CComboBox::OnKillFocus(pNewWnd);
	if(!m_bKeyDown)
		SetText(TRUE);
	m_bKeyDown = FALSE;
}
