// PCSCDlg.h : header file
//

#if !defined(AFX_PCSCDLG_H__35F637BD_9127_43E1_AA8D_67EDD64A8A9D__INCLUDED_)
#define AFX_PCSCDLG_H__35F637BD_9127_43E1_AA8D_67EDD64A8A9D__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

/////////////////////////////////////////////////////////////////////////////
// CPCSCDlg dialog
#include "Winscard.h"

#define SCARD_E_NO_READERS_AVAILABLE  ((DWORD)0x8010002E)
#define IOCTL_IC_POWER_ON		0x901
#define IOCTL_IC_COMMAND		0x903
#define IOCTL_IC_POWER_OFF		0x902
#define IOCTL_SET_PARAM			0x904
#define IOCTL_GET_PARAM			0x905
#define IOCTL_BYPASS_COMMAND	0x906
#define IOCTL_BUZZER			0x907
#define IOCTL_READ_FLASH   		0x908
#define IOCTL_WRITE_FLASH   	0x909
#define IOCTL_GET_CARDINFO   	0x910
#define IOCTL_GET_DRIVERVER		0x911

class CPCSCDlg : public CDialog
{
// Construction
public:
	int m_nCommandIDX;
	CString GetSCARDErrorMsg(LONG ret);
	bool TransData(CString data,BYTE *pbRecv,DWORD *dwRecv,DWORD ioctlcode,bool usemsgbox = true);
	SET_CONFIG m_pConfig;
	void GetStatus();
	void MakeCombo();
	BYTE ASCII2HEX(CString str);
	void STRING2HEX(LPCTSTR str, BYTE *hex);
	void GetSCardListReaders();
	SCARDCONTEXT    m_hContext;
	SCARDHANDLE     m_hCardHandle;
	CPCSCDlg(CWnd* pParent = NULL);	// standard constructor

// Dialog Data
	//{{AFX_DATA(CPCSCDlg)
	enum { IDD = IDD_PCSC_DIALOG };
	CComboBox	m_ctrlSAMID;
	CComboBox	m_ctrlControlCodeSAMStatus;
	CEdit	m_ctrlCTRLAPDU;
	CEdit	m_ctrlDataLen;
	CComboBox	m_ctrlIOSendPCI;
	CComboBox	m_ctrlDispositionC;
	CComboBox	m_ctrlDispositionT;
	CEdit	m_ctrlActiveProto;
	CComboBox	m_ctrlProtocol;
	CComboBox	m_ctrlShareMode;
	CComboBox	m_ctrlScopeContext;
	CComboBox	m_ctrlComList;
	CEdit	m_ctrlAPDU;
	CComboBox	m_ctrlReaderList;
	CListBox	m_ctrlList;
	//}}AFX_DATA

	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CPCSCDlg)
	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV support
	//}}AFX_VIRTUAL

// Implementation
protected:
	HICON m_hIcon;

	// Generated message map functions
	//{{AFX_MSG(CPCSCDlg)
	virtual BOOL OnInitDialog();
	afx_msg void OnSysCommand(UINT nID, LPARAM lParam);
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	afx_msg void OnConnectBtn();
	afx_msg void OnDisconnectBtn();
	afx_msg void OnBtnEstablishcontext();
	afx_msg void OnRealsecontextBtn();
	afx_msg void OnBegintrans();
	afx_msg void OnEndtrans();
	afx_msg void OnListclear();
	afx_msg void OnTransBtn();
	afx_msg void OnSelchangeComboCom();
	afx_msg void OnMakeText();
	afx_msg void OnSelchangeComboProtocol();
	afx_msg void OnCtrlBtn();	
	afx_msg void OnSelchangeComboCom2();
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};

//{{AFX_INSERT_LOCATION}}
// Microsoft Visual C++ will insert additional declarations immediately before the previous line.

#endif // !defined(AFX_PCSCDLG_H__35F637BD_9127_43E1_AA8D_67EDD64A8A9D__INCLUDED_)
