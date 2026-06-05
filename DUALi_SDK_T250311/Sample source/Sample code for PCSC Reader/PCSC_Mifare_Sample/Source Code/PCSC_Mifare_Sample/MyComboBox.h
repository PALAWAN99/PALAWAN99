#if !defined(AFX_MYCOMBOBOX_H__1847779D_6E82_44A2_8C59_A4B4DF4B833C__INCLUDED_)
#define AFX_MYCOMBOBOX_H__1847779D_6E82_44A2_8C59_A4B4DF4B833C__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000
// MyComboBox.h : header file
//

/////////////////////////////////////////////////////////////////////////////
// CMyComboBox window

class CMyComboBox : public CComboBox
{
// Construction
public:
	CMyComboBox();

// Attributes
public:

// Operations
public:
	int m_nCol,m_nRow;
	BOOL	m_bKeyDown;
	CFont	m_Font;

	void SetText(BOOL flag);

// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CMyComboBox)
	public:
	virtual BOOL PreTranslateMessage(MSG* pMsg);
	//}}AFX_VIRTUAL

// Implementation
public:
	virtual ~CMyComboBox();

	// Generated message map functions
protected:
	//{{AFX_MSG(CMyComboBox)
	afx_msg void OnKillFocus(CWnd* pNewWnd);
	//}}AFX_MSG

	DECLARE_MESSAGE_MAP()
};

/////////////////////////////////////////////////////////////////////////////

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_MYCOMBOBOX_H__1847779D_6E82_44A2_8C59_A4B4DF4B833C__INCLUDED_)
