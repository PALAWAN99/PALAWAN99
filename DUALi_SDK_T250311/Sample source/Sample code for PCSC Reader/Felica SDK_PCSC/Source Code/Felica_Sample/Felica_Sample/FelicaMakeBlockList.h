#pragma once


// CFelicaMakeBlockList 대화 상자입니다.

class CFelicaMakeBlockList : public CDialog
{
	DECLARE_DYNAMIC(CFelicaMakeBlockList)

public:
	CFelicaMakeBlockList(CWnd* pParent = NULL);   // 표준 생성자입니다.
	virtual ~CFelicaMakeBlockList();

// 대화 상자 데이터입니다.
	enum { IDD = IDD_DLG_FELICA2_FSETPARA };

protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV 지원입니다.

	DECLARE_MESSAGE_MAP()
public:
	afx_msg void OnBnClickedGen();
	virtual BOOL OnInitDialog();
	virtual BOOL PreTranslateMessage(MSG* pMsg);
	
	CString m_strServiceCode[16];
	CString m_strblocklist[16];
	CEdit m_ctrlService[16];
	CEdit m_ctrlBlock[16];

	int GetBlockList(CString data);
	BYTE m_pBlockList[256];
	// 생성된 block list
	CString m_strBL;

	BOOL m_bEncWithRWSAM;
};
