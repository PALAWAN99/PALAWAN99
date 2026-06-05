// MyEditBox.cpp : implementation file
//

#include "stdafx.h"
#include "PCSC_Mifare_Sample.h"
#include "MyEditBox.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif

/////////////////////////////////////////////////////////////////////////////
// CMyEditBox

CMyEditBox::CMyEditBox()
{
	m_bKeyDown = FALSE;

	LOGFONT lf;
	::ZeroMemory (&lf, sizeof(lf));
	lf.lfHeight = 80;
	::lstrcpy (lf.lfFaceName, _T("MS Sans Serif"));
	m_Font.CreatePointFontIndirect(&lf);
}

CMyEditBox::~CMyEditBox()
{
}


BEGIN_MESSAGE_MAP(CMyEditBox, CEdit)
	//{{AFX_MSG_MAP(CMyEditBox)
	ON_WM_KILLFOCUS()
	ON_WM_CREATE()
	//}}AFX_MSG_MAP
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CMyEditBox message handlers

void CMyEditBox::SetText(bool bFlag)
{
	CString msg;
	CListCtrl*	pList = (CListCtrl*)GetParent();

	if(bFlag)
	{
		GetWindowText(msg);
		pList->SetItemText(m_nRow, m_nCol, msg);
	}
	pList->SetFocus();
	MoveWindow(0,0,0,0);
}

void CMyEditBox::OnKillFocus(CWnd* pNewWnd) 
{
	CEdit::OnKillFocus(pNewWnd);
	if(!m_bKeyDown)
		SetText(TRUE);
	m_bKeyDown = FALSE;
}

BOOL CMyEditBox::PreTranslateMessage(MSG* pMsg) 
{
	if(pMsg->message == WM_KEYDOWN)
	{		
		if(pMsg->wParam == VK_RETURN)
		{
			m_bKeyDown = TRUE;
			SetText(TRUE);
		}
		else if(pMsg->wParam == VK_ESCAPE)
		{
			m_bKeyDown = TRUE;
			SetText(FALSE);
		}
	}
	return CEdit::PreTranslateMessage(pMsg);
}

int CMyEditBox::OnCreate(LPCREATESTRUCT lpCreateStruct) 
{
	if (CEdit::OnCreate(lpCreateStruct) == -1)
		return -1;
	SetFont(&m_Font);
	return 0;
}
