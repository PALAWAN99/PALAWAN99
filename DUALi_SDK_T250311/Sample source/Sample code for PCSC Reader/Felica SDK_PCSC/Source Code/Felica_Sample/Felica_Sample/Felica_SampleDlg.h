
// Felica_SampleDlg.h 
//

#pragma once
#include "afxwin.h"
#include "afxcmn.h"
#include "ListCtrlEx.h"
#include "Common.h"
#include "Winscard.h"


//MAX BUFFER SIZE
#define MAX_BUFF_SIZE				2048       


//PORT STATUS CLOSE, OPEN
#define CLOSE	0
#define OPEN	1


#define IOSENDPCI_T0 0
#define IOSENDPCI_T1 1

# define VERSION
//1.1 ADD POLLING OFF AND SOME DESCRIPT MODIFY

class CFelica_SampleDlg : public CDialog
{

public:
	CFelica_SampleDlg(CWnd* pParent = NULL);	


	enum { IDD = IDD_FELICA_SAMPLE_DIALOG };

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	




protected:
	HICON m_hIcon;


	virtual BOOL OnInitDialog();
	afx_msg void OnSysCommand(UINT nID, LPARAM lParam);
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();

	DECLARE_MESSAGE_MAP()
public:
	CCommon com;
	afx_msg void OnBnClickedConnect();
	CComboBox m_ctrlPort;
	int deviceCnt;

	BOOL OpenPort();
	int PortStatus;
	CButton m_ctrlConnect;
	CButton m_ctrlDisConnect;
	afx_msg void OnBnClickedConnect2();
	int pcscAutoDetect;
	BOOL ClosePort();
	afx_msg void OnBnClickedConnect3();
	CString m_strSamPos;
	BOOL m_bUseRWSAM;
	CString m_strKey;
	afx_msg void OnBnClickedAuthRwsam();
	int m_radio_RWASM_keytype;
	void SendList(BOOL bSend, CString data);
	void SendList(int bSend, int nLen, BYTE *pData);
	CListCtrlEx m_ctrlDataList;
	void SetInitListCtrl();
	afx_msg void OnBnClickedClear();

	afx_msg void OnBnClickedRadio2();
	afx_msg void OnBnClickedRadio1();
	afx_msg void OnBnClickedPolling();
	CString m_strSystemCode;
	CString m_strTimeSlot;
	CString m_strRequestCode;
	void EstablishContext();
	void GetSCardListReaders();
	CString GetSCARDErrorMsg(LONG ret);
	int m_FlagScardStatus;

	SCARDCONTEXT    m_hContext;
	SCARDHANDLE     m_hCardHandle;
	BOOL TransData(CString data,BYTE *pbRecv,DWORD *dwRecv,DWORD ioctlcode,BOOL usemsgbox = TRUE);
	afx_msg void OnBnClickedMakeBlocklist();
	afx_msg void OnBnClickedCheck1();
	afx_msg void OnBnClickedMutualAuth();
	afx_msg void OnBnClickedRead();
	afx_msg void OnBnClickedWrite();
	afx_msg void OnBnClickedFelicaTrans();
	CString m_strBL;
	CString m_strData;
	CString m_strTransData;
};
