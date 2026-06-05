// TestSampleDlg.h : header file
//

#include "afxwin.h"
#if !defined(AFX_TESTSAMPLEDLG_H__D4203B13_6A12_4BC7_9360_21B493F0E439__INCLUDED_)
#define AFX_TESTSAMPLEDLG_H__D4203B13_6A12_4BC7_9360_21B493F0E439__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

#define MAX_DATA_LENGTH 10000
/////////////////////////////////////////////////////////////////////////////
// CTestSampleDlg dialog

class CTestSampleDlg : public CDialog
{
// Construction
public:
	BYTE ASCII2HEX(CString str);
	void STRING2HEX(CString str, BYTE *hex);
	void HEX2ASCII(BYTE c, BYTE *asc);
	void HEX2STRING(BYTE *hex, CString& str, int hexLen);
	int m_nPort;
	BOOL m_bConnect;
	CString m_strUID;//serial data of mifare card
	BYTE m_pIdentifier[4];

	CTestSampleDlg(CWnd* pParent = NULL);	// standard constructor

// Dialog Data
	//{{AFX_DATA(CTestSampleDlg)
	enum { IDD = IDD_TESTSAMPLE_DIALOG };
	CComboBox	m_ctrlKeyType;
	CListBox	m_ctrlList;
	CComboBox	m_ctrlPort;
	CString	m_strKey;
	CString	m_strblock;
	CString	m_strData;
	//}}AFX_DATA

	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CTestSampleDlg)
	public:
	virtual BOOL DestroyWindow();
	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV support
	//}}AFX_VIRTUAL

// Implementation
protected:
	HICON m_hIcon;

	// Generated message map functions
	//{{AFX_MSG(CTestSampleDlg)
	virtual BOOL OnInitDialog();
	afx_msg void OnSysCommand(UINT nID, LPARAM lParam);
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	afx_msg void OnButton2();
	afx_msg void OnButton3();
	afx_msg void OnSelchangeCombo1();
	afx_msg void OnBtnReqa();
	afx_msg void OnBtnAnticol();
	afx_msg void OnBtnSelect();
	afx_msg void OnBtnAuthkey();
	afx_msg void OnBtnRead();
	afx_msg void OnBtnWrite();
	afx_msg void OnBtnListclear();
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
public:
	afx_msg void OnBnClickedBtnReqb();
	afx_msg void OnBnClickedBtnAttrib();
	afx_msg void OnBnClickedBtnSel();
	CComboBox m_ctrlBaud;
	afx_msg void OnBnClickedBtnFindcard();
	afx_msg void OnBnClickedBtnTagtest();
	afx_msg void OnBnClickedButton4();
};

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_TESTSAMPLEDLG_H__D4203B13_6A12_4BC7_9360_21B493F0E439__INCLUDED_)
