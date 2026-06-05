// MutualAuthSamAes1.cpp : 

#include "stdafx.h"
#include "Felica_Sample.h"
#include "MutualAuthSamAes1.h"


// CMutualAuthSamAes1 

IMPLEMENT_DYNAMIC(CMutualAuthSamAes1, CDialog)

CMutualAuthSamAes1::CMutualAuthSamAes1(CWnd* pParent /*=NULL*/)
	: CDialog(CMutualAuthSamAes1::IDD, pParent)
	, m_strSC(_T("0018"))
	, m_strLoSC(_T(""))
{

}

CMutualAuthSamAes1::~CMutualAuthSamAes1()
{
}

void CMutualAuthSamAes1::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Text(pDX, IDC_EDIT1, m_strSC);
	DDV_MaxChars(pDX, m_strSC, 4);
	DDX_Text(pDX, IDC_EDIT2, m_strLoSC);
}


BEGIN_MESSAGE_MAP(CMutualAuthSamAes1, CDialog)
	ON_BN_CLICKED(IDC_BUTTON1, &CMutualAuthSamAes1::OnBnClickedButton1)
	ON_BN_CLICKED(IDC_BUTTON3, &CMutualAuthSamAes1::OnBnClickedButton3)
	ON_EN_CHANGE(IDC_EDIT2, &CMutualAuthSamAes1::OnEnChangeEdit2)
END_MESSAGE_MAP()




void CMutualAuthSamAes1::OnBnClickedButton1()
{
	UpdateData();

	if(m_strSC.GetLength()!=4)
	{
		AfxMessageBox("Please Check System Code");
		return;
	}
	if(m_strLoSC.GetLength()%8 != 0)
	{
		AfxMessageBox("Please Service Code & Key Version");
		return;
	}
	

	OnOK();
}

void CMutualAuthSamAes1::OnBnClickedButton3()
{
	OnCancel();
}

void CMutualAuthSamAes1::OnEnChangeEdit2()
{
	CString data,msg;
	GetDlgItem(IDC_EDIT2)->GetWindowTextA(data);

	int n = data.GetLength();

	if(n == 0)
	{
		msg.Format("%d Bytes (0/2)", n/2);
	}
	else if(n%2 == 0)
	{
		msg.Format("%d Bytes (2/2)", (n+1)/2);
	}
	else
	{
		msg.Format("%d Bytes (1/2)", (n+1)/2);
	}

	GetDlgItem(IDC_EDIT5)->SetWindowTextA(msg);
}

BOOL CMutualAuthSamAes1::OnInitDialog()
{
	CDialog::OnInitDialog();

	//GetDlgItem(IDC_EDIT1)->SetWindowTextA("");
	GetDlgItem(IDC_EDIT2)->SetWindowTextA("8811020108120201");

	return TRUE;  // return TRUE unless you set the focus to a control

}

BOOL CMutualAuthSamAes1::PreTranslateMessage(MSG* pMsg)
{
	if (pMsg->message == WM_KEYDOWN)
	{
		if(pMsg->wParam == VK_RETURN || pMsg->wParam == VK_ESCAPE)
			return TRUE;
	}
	return CDialog::PreTranslateMessage(pMsg);
}
