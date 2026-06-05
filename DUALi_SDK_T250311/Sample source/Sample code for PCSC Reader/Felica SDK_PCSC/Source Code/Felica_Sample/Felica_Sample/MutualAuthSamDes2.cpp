// MutualAuthSamDes2.cpp :
//

#include "stdafx.h"
#include "Felica_Sample.h"
#include "MutualAuthSamDes2.h"




IMPLEMENT_DYNAMIC(CMutualAuthSamDes2, CDialog)

CMutualAuthSamDes2::CMutualAuthSamDes2(CWnd* pParent /*=NULL*/)
	: CDialog(CMutualAuthSamDes2::IDD, pParent)
	, m_strSystemCode(_T(""))	
	, m_strACL(_T(""))	
	, m_strSCL(_T(""))	
{

}

CMutualAuthSamDes2::~CMutualAuthSamDes2()
{
}

void CMutualAuthSamDes2::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Text(pDX, IDC_EDIT1, m_strSystemCode);
	DDV_MaxChars(pDX, m_strSystemCode, 8);
	DDX_Text(pDX, IDC_EDIT_ACODE, m_strACL);
	DDX_Text(pDX, IDC_EDIT16, m_strSCL);	
}


BEGIN_MESSAGE_MAP(CMutualAuthSamDes2, CDialog)
	ON_BN_CLICKED(IDC_BUTTON1, &CMutualAuthSamDes2::OnBnClickedButton1)
	ON_BN_CLICKED(IDC_BUTTON3, &CMutualAuthSamDes2::OnBnClickedButton3)
END_MESSAGE_MAP()

void CMutualAuthSamDes2::OnBnClickedButton1()
{
	UpdateData();
	if(m_strSystemCode.GetLength()!=8)
	{
		AfxMessageBox("Please Check System Code & Key version");
		return;
	}
	
	if(m_strACL.GetLength()%4 != 0)
	{
		AfxMessageBox("Please Check Area Code & Key version List");
		return;
	}
	
	if(m_strSCL.GetLength()%4 != 0)
	{
		AfxMessageBox("Please Check System & Key version Code List");
		return;
	}

	OnOK();
}

void CMutualAuthSamDes2::OnBnClickedButton3()
{
	OnCancel();
}

BOOL CMutualAuthSamDes2::OnInitDialog()
{
	CDialog::OnInitDialog();

	GetDlgItem(IDC_EDIT_ACODE)->SetWindowTextA("81110200");	
	GetDlgItem(IDC_EDIT16)->SetWindowTextA("081202008C120200");	
	GetDlgItem(IDC_EDIT1)->SetWindowTextA("00180200");

	return TRUE;  // return TRUE unless you set the focus to a control

}

BOOL CMutualAuthSamDes2::PreTranslateMessage(MSG* pMsg)
{
	if (pMsg->message == WM_KEYDOWN)
	{
		if(pMsg->wParam == VK_RETURN || pMsg->wParam == VK_ESCAPE)
			return TRUE;
	}
	return CDialog::PreTranslateMessage(pMsg);
}
