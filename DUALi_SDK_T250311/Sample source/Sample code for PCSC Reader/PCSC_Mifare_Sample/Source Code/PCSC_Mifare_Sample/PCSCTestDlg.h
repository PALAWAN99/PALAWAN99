#pragma once
#include "afxwin.h"
#include "ListCtrlEx.h"
#include "PCSC_Mifare_Sample.h"

#if !defined(AFX_PCSCDLG_H__35F637BD_9127_43E1_AA8D_67EDD64A8A9D__INCLUDED_)
#define AFX_PCSCDLG_H__35F637BD_9127_43E1_AA8D_67EDD64A8A9D__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000

/////////////////////////////////////////////////////////////////////////////
// CPCSCDlg dialog
#include "Winscard.h"

//#define SCARD_E_NO_READERS_AVAILABLE  ((DWORD)0x8010002E)
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

// CPCSCTestDlg Dialog.

class CPCSCTestDlg : public CDialog
{
	DECLARE_DYNAMIC(CPCSCTestDlg)

public:
	CPCSCTestDlg(CComboBox* m_ctrlReaderList, CEdit* m_ctrlActiveProto, CListCtrlEx* m_ctrlDataList, CWnd* pParent=NULL); //Standard constructor.
	virtual ~CPCSCTestDlg();

// Dialog data
	enum { IDD = IDD_PCSCTEST_DLG };

protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV support

	DECLARE_MESSAGE_MAP()
private: 
	CListCtrlEx*	ctrlDataList;
	CEdit*			p_ctrlActiveProto;
	CComboBox*		p_ctrlReaderList;
public:
	void MakeCombo();
	virtual BOOL OnInitDialog();
	CComboBox m_ctrlComList;
	CComboBox m_ctrlIOSendPCI;
	CComboBox m_ctrlControlCodeSAMStatus;
	CComboBox m_ctrlSAMID;

	int m_nCommandIDX;

	CString GetSCARDErrorMsg(LONG ret);

	SCARDHANDLE     m_hCardHandle;

	CPCSC_Mifare_SampleApp* p_PMSApp;

	CEdit m_ctrlDataLen;
	CEdit m_ctrlAPDU;
	CEdit m_ctrlCTRLAPDU;
	afx_msg void OnBnClickedTransBtn();
	afx_msg void OnBnClickedCtrlBtn();
	afx_msg void OnSelchangeComboCom();
	afx_msg void OnSelchangeComboCom2();
};
#endif // !defined(AFX_PCSCDLG_H__35F637BD_9127_43E1_AA8D_67EDD64A8A9D__INCLUDED_)
