#pragma once
// CMutualAuthSamAes1 

class CMutualAuthSamAes1 : public CDialog
{
	DECLARE_DYNAMIC(CMutualAuthSamAes1)
public:
	CMutualAuthSamAes1(CWnd* pParent = NULL);   
	virtual ~CMutualAuthSamAes1();

	enum { IDD = IDD_DLG_FELICA2_AUTHSETTING5 };
protected:
	virtual void DoDataExchange(CDataExchange* pDX);    

	DECLARE_MESSAGE_MAP()
public:
	afx_msg void OnBnClickedButton1();
	afx_msg void OnBnClickedButton3();
	CString m_strSC;
	afx_msg void OnEnChangeEdit2();
	CString m_strLoSC;
	virtual BOOL OnInitDialog();
	virtual BOOL PreTranslateMessage(MSG* pMsg);
};
