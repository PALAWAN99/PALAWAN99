#pragma once


// CMutualAuthSamDes2 

class CMutualAuthSamDes2 : public CDialog
{
	DECLARE_DYNAMIC(CMutualAuthSamDes2)

public:
	CMutualAuthSamDes2(CWnd* pParent = NULL);   
	virtual ~CMutualAuthSamDes2();


	enum { IDD = IDD_DLG_FELICA2_AUTHSETTING4 };

protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // 

	DECLARE_MESSAGE_MAP()
public:
	CString m_strSystemCode;
	CString m_strSystemKeyVersion;
	CString m_strACL;
	CString m_strKVL;
	CString m_strSCL;
	CString m_strKVL2;
	afx_msg void OnBnClickedButton1();
	afx_msg void OnBnClickedButton3();
	afx_msg void OnEnChangeEdit14();
	afx_msg void OnEnChangeEdit5();
	afx_msg void OnEnChangeEdit16();
	afx_msg void OnEnChangeEdit13();
	virtual BOOL OnInitDialog();
	virtual BOOL PreTranslateMessage(MSG* pMsg);
};
