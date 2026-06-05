#pragma once
#include "afxwin.h"
#include "ListCtrlEx.h"
#include "PCSC_Mifare_Sample.h"
#include "Winscard.h"

// CMifareTestDlg Dialog

class CMifareTestDlg : public CDialog
{
	DECLARE_DYNAMIC(CMifareTestDlg)

public:
	CMifareTestDlg(CComboBox* m_ctrlReaderList, CEdit* m_ctrlActiveProto, CListCtrlEx* m_ctrlDataList, CWnd* pParent = NULL);   // Standard constructor.
	virtual ~CMifareTestDlg();

// Dialog Data
	enum { IDD = IDD_MIFARETEST_DLG };

protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV Support

	DECLARE_MESSAGE_MAP()

private:
	CButton			m_radio_AKey;
	CButton			m_radio_BKey;

	CListCtrlEx*	ctrlDataList;
	CEdit*			p_ctrlActiveProto;
	CComboBox*		p_ctrlReaderList;

public:
	CEdit m_ctlKeyNumber;
	CEdit m_ctrlKeyData;
	CEdit m_ctlBlockNumber;
	CEdit m_ctlBlockNumber2;
	CEdit m_strData;
	CEdit m_ctrlLength;
	CEdit m_strProgress;

	CString m_strKey; 
	CString m_strEditData;
	CString szReader;
	
	CString m_strBlock1,m_strBlock2;
	CString m_strWriteData;

	BOOL m_bConnect;
	CString msg,tmp,recvdata,csn;
	int len,len2;
	BYTE	pbRecv[1024];
	DWORD	dwRecv;

	BYTE mode, keyno;
	BYTE block1, Transblock;

	//pcsc
	const struct _SCARD_IO_REQUEST * m_pIOrequest;
	SCARDHANDLE     m_hCardHandle;

	CPCSC_Mifare_SampleApp* p_PMSApp;

	virtual BOOL OnInitDialog();

	afx_msg void OnEnChangeEditData();
	afx_msg void OnEnChangeEditKey();
	afx_msg void OnBnClickedBtnLoadkey();
	afx_msg void OnBnClickedBtnRead();
	afx_msg void OnBnClickedBtnWrite();
	afx_msg void OnBnClickedBtnIncrement();
	afx_msg void OnBnClickedBtnDecrement();
};
