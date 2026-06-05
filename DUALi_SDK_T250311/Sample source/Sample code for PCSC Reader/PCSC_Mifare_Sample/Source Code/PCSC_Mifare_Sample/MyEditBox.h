#if !defined(AFX_MYEDITBOX_H__1CB8E3ED_F84A_46DC_BB2F_362A81F530CF__INCLUDED_)
#define AFX_MYEDITBOX_H__1CB8E3ED_F84A_46DC_BB2F_362A81F530CF__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000
// MyEditBox.h : header file
//

/////////////////////////////////////////////////////////////////////////////
// CMyEditBox window

class CMyEditBox : public CEdit
{
// Construction
public:
	CMyEditBox();

// Attributes
public:

// Operations
public:
	CFont m_Font;
	BOOL m_bKeyDown;
	int m_nCol, m_nRow;

	void SetText(bool bFlag);

// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CMyEditBox)
	public:
	virtual BOOL PreTranslateMessage(MSG* pMsg);
	//}}AFX_VIRTUAL

// Implementation
public:
	virtual ~CMyEditBox();

	// Generated message map functions
protected:
	//{{AFX_MSG(CMyEditBox)
	afx_msg void OnKillFocus(CWnd* pNewWnd);
	afx_msg int OnCreate(LPCREATESTRUCT lpCreateStruct);
	//}}AFX_MSG

	DECLARE_MESSAGE_MAP()
};

/////////////////////////////////////////////////////////////////////////////

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_MYEDITBOX_H__1CB8E3ED_F84A_46DC_BB2F_362A81F530CF__INCLUDED_)
