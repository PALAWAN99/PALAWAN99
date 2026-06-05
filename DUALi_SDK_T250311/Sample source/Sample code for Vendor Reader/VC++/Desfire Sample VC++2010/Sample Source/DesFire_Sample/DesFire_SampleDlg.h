
// DesFire_SampleDlg.h :
//

#pragma once
#include "afxwin.h"
//#include "Function.h"

#define MAX_BUFF_SIZE				2048
#define MAX_KEY_LENGTH				40
#define MAX_DATA_LENGTH				10000
#define AID_LENGTH					3

//CARD INFO
#define AppID "000005"
#define FILENUM 0
#define KEY_3DES "00000000000000000000000000000000"
#define KEY_3KEY3DES "000000000000000000000000000000000000000000000000"
#define KEY_AES "00000000000000000000000000000000"


// CDesFire_SampleDlg 
class CDesFire_SampleDlg : public CDialog
{
public:
	CDesFire_SampleDlg(CWnd* pParent = NULL);	

	enum { IDD = IDD_DESFIRE_SAMPLE_DIALOG };

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV 

protected:
	HICON m_hIcon;

	virtual BOOL OnInitDialog();
	afx_msg void OnSysCommand(UINT nID, LPARAM lParam);
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	DECLARE_MESSAGE_MAP()
public:
	afx_msg void OnBnClickedButtonConnect();
	afx_msg void OnBnClickedOk();
	CComboBox m_comDevice;
	afx_msg void OnBnClickedButtonConnect2();
	int m_nPort;
	BOOL m_bDevice;
	afx_msg void OnBnClickedButtonRead();
	afx_msg void OnBnClickedButtonWrite();
	CComboBox m_comKeyType;
	int m_nKeyType;
	void HEX2STRING(BYTE *hex, CString& str, int hexLen);
	void HEX2ASCII(BYTE c, BYTE *asc);
	CEdit m_ctrlData;
	void STRING2HEX(CString str, BYTE *hex);
	BYTE ASCII2HEX(CString str);
	afx_msg void OnBnClickedButtonBatchWrite();
	afx_msg void OnBnClickedButtonBatchRead();
	CButton m_chkEnc;
	BOOL m_b3key;//defire transparent for Flag
	BOOL m_bBatch3key;//defire Batch for Flag
	afx_msg void OnBnClickedButtonReflash();
	void InitDevice();
	CListBox m_ctrlLOG;
	int FromDetectToAuth();
	int SetConfBatch();

	BYTE RBUF[MAX_BUFF_SIZE];
	BYTE SBUF[MAX_BUFF_SIZE];
	BYTE KEY[MAX_KEY_LENGTH];
	BYTE DATA[MAX_BUFF_SIZE];
	int nRLen, nSLen;
	int nKey;
};
