
// PCSC_Mifare_SampleDlg.h : header file
//

#pragma once
#include "afxcmn.h"
#include "PCSCTestDlg.h"
#include "MifareTestDlg.h"
#include "afxwin.h"
#include "ListCtrlEx.h"
#include "Winscard.h"
#include "ListCtrlEx.h"

#define	MAX_LINE	1024

/* update history
- 2019.01.09 Ally
  - update GetSCardListReaders function for detecting all reader of Duali.
*/
// CPCSC_Mifare_SampleDlg dialog
class CPCSC_Mifare_SampleDlg : public CDialog
{
// Construction
public:
	CPCSC_Mifare_SampleDlg(CWnd* pParent = NULL);	// Standard constructor.
	

// Dialog Data
	enum { IDD = IDD_PCSC_MIFARE_SAMPLE_DLG };

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV 지원입니다.


// Implementation
protected:
	HICON m_hIcon;

	// Generated message map functions
	virtual BOOL OnInitDialog();
	afx_msg void OnSysCommand(UINT nID, LPARAM lParam);
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	DECLARE_MESSAGE_MAP()

public:
	void InitView();
	void ShowTABWindow();
	void SetInitListCtrl();
	void SendList(BOOL bSend, CString data);
	void GetSCardListReaders();
	void MakeCombo();
	void GetStatus();
	bool TransData(CString data,BYTE *pbRecv,DWORD *dwRecv,DWORD ioctlcode,bool usemsgbox);
	void SendList(int bSend, int nLen, BYTE *pData,BYTE cmd=0x00);

	CRect m_Rect1;
	CRect m_Rect2;
	int m_nCurMenu;
	BOOL m_CNSuccess;

	CTabCtrl m_ctrlTab;
	
	SCARDCONTEXT    m_hContext;
	SCARDHANDLE     m_hCardHandle;
	const struct _SCARD_IO_REQUEST * m_pIOrequest;
	
	CPCSCTestDlg*	m_pPCSCTestDlg;	
	CMifareTestDlg*	m_pMifareTestDlg;	
	CPCSC_Mifare_SampleApp* p_PMSApp;

	CComboBox m_ctrlReaderList;
	CListCtrlEx m_ctrlDataList;
	CEdit m_ctrlActiveProto;
	CComboBox m_ctrlShareMode;
	CComboBox m_ctrlProtocol;
	
	afx_msg void OnTcnSelchangeTab1(NMHDR *pNMHDR, LRESULT *pResult);
	afx_msg void OnDestroy();
	afx_msg void OnBnClickedBtnEstablishcontext();
	afx_msg void OnBnClickedRealsecontextBtn();
	afx_msg void OnBnClickedConnectBtn();
	afx_msg void OnBnClickedDisconnectBtn();
	afx_msg void OnSelchangeComboProtocol();
	afx_msg void OnBnClickedBtnClear();
	afx_msg void OnBnClickedBtnText();
	afx_msg void OnNMCustomdrawListData(NMHDR *pNMHDR, LRESULT *pResult);
};
