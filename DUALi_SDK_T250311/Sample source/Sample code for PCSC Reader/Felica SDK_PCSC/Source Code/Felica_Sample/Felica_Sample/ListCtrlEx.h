#if !defined(AFX_LISTCTRLEX_H__B2787072_28E6_48E9_857F_86EAF3A9F6FB__INCLUDED_)
#define AFX_LISTCTRLEX_H__B2787072_28E6_48E9_857F_86EAF3A9F6FB__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000
// ListCtrlEx.h : header file
//

/////////////////////////////////////////////////////////////////////////////
// CListCtrlEx window
#define	ID_COMBO_LIST	6000
#define	ID_EDIT_LIST	6001

#define	WM_CLICK_LIST	WM_USER+1

// CListCtrlEx

class CListCtrlEx : public CListCtrl
{
// Construction
public:
	CListCtrlEx();

// Operations
public:
	int AddItem(char* strItem, int nItem, int nSubItem, UINT nState = -1, int nImageIndex = -1, long nParam = -1);
	int AddArgItem(int nItem, int nSubItem, char* pBuff,...);

// Overrides
	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CListCtrlEx)
	//}}AFX_VIRTUAL

// Implementation
public:
	virtual ~CListCtrlEx();
	void EnableComboBox(bool bEnable, int nPos);
	void EnableEditBox(bool bEnable, int nPos);

	void SetEnableClickMsg(bool bEnable);


protected:
	int		m_nEnableEdit;
	bool	m_bEnableEdit;
	int		m_nEnableCombo;
	bool	m_bEnableCombo;
	bool	m_bClickMsg;

	// Generated message map functions
protected:
	//{{AFX_MSG(CListCtrlEx)
	afx_msg void OnClick(NMHDR* pNMHDR, LRESULT* pResult);
	//}}AFX_MSG

	DECLARE_MESSAGE_MAP()
};

/////////////////////////////////////////////////////////////////////////////

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_LISTCTRLEX_H__B2787072_28E6_48E9_857F_86EAF3A9F6FB__INCLUDED_)
