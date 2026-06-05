// MifareTestDlg.cpp : implementation file
//

#include "stdafx.h"
#include "PCSC_Mifare_Sample.h"
#include "MifareTestDlg.h"
#include "PCSC_Mifare_SampleDlg.h"


// CMifareTestDlg Dialog

IMPLEMENT_DYNAMIC(CMifareTestDlg, CDialog)

CMifareTestDlg::CMifareTestDlg(CComboBox* m_ctrlReaderList, CEdit* m_ctrlActiveProto, CListCtrlEx* m_ctrlDataList, CWnd* pParent /*=NULL*/)
	: CDialog(CMifareTestDlg::IDD, pParent)
{
	ctrlDataList = m_ctrlDataList;
	p_ctrlReaderList = m_ctrlReaderList;
	p_ctrlActiveProto = m_ctrlActiveProto;
}

CMifareTestDlg::~CMifareTestDlg()
{
}

void CMifareTestDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_RADIO_AKEY, m_radio_AKey);
	DDX_Control(pDX, IDC_RADIO_BKEY, m_radio_BKey);
	DDX_Control(pDX, IDC_EDIT_INDEX, m_ctlKeyNumber);
	DDX_Control(pDX, IDC_EDIT_KEY, m_ctrlKeyData);
	DDX_Text(pDX, IDC_EDIT_KEY, m_strKey);
	DDV_MaxChars(pDX, m_strKey, 12);
	DDX_Control(pDX, IDC_EDIT_BLOCK1, m_ctlBlockNumber);
	DDX_Control(pDX, IDC_EDIT_BLOCK2, m_ctlBlockNumber2);
	DDX_Control(pDX, IDC_EDIT_DATA, m_strData);
	DDX_Text(pDX, IDC_EDIT_DATA, m_strEditData);
	DDV_MaxChars(pDX, m_strEditData, 32);
	DDX_Control(pDX, IDC_EDIT_DATA_LENGTH, m_ctrlLength);
	DDX_Control(pDX, IDC_EDIT_STATUS, m_strProgress);
}


BEGIN_MESSAGE_MAP(CMifareTestDlg, CDialog)
	ON_BN_CLICKED(IDC_BTN_LOADKEY, &CMifareTestDlg::OnBnClickedBtnLoadkey)
	ON_EN_CHANGE(IDC_EDIT_DATA, OnEnChangeEditData)
	ON_EN_CHANGE(IDC_EDIT_KEY, OnEnChangeEditKey)
	ON_BN_CLICKED(IDC_BTN_READ, &CMifareTestDlg::OnBnClickedBtnRead)
	ON_BN_CLICKED(IDC_BTN_WRITE, &CMifareTestDlg::OnBnClickedBtnWrite)
	ON_BN_CLICKED(IDC_BTN_INCREMENT, &CMifareTestDlg::OnBnClickedBtnIncrement)
	ON_BN_CLICKED(IDC_BTN_DECREMENT, &CMifareTestDlg::OnBnClickedBtnDecrement)
END_MESSAGE_MAP()


// CMifareTestDlg Message Handler
BOOL CMifareTestDlg::OnInitDialog()
{
	CDialog::OnInitDialog();

	m_radio_AKey.SetCheck(TRUE);	//Default Key is used as type A
	m_radio_BKey.SetCheck(FALSE);

	mode = 0x00;	// Key type, 0x00 = A type  0x04 = B type
	keyno = 0x00;	// Locations, 0x00 ~ 0x0F

	m_strProgress.SetWindowText("Status");
	m_bConnect = FALSE;

	return TRUE;  // return TRUE unless you set the focus to a control

}

//'Load Key' Button Click
void CMifareTestDlg::OnBnClickedBtnLoadkey()
{
	CPCSC_Mifare_SampleDlg* p_PMSDlg = (CPCSC_Mifare_SampleDlg*)AfxGetMainWnd();
	CString strkeyno, strkeydata, strkeytype;
	BYTE Forprint[11];
	BYTE keydata[6];

	memset(keydata, 0x00, sizeof(keydata));
	memset(Forprint, 0x00, sizeof(Forprint));

	dwRecv = sizeof(pbRecv);

	//Get the name of the reader
	p_ctrlReaderList->GetWindowText(szReader);

	if(szReader == "")
	{
		AfxMessageBox("There is no selected PC/SC Reader");
		return;
	}
	
	// Check the connection
	if(!p_PMSDlg->m_CNSuccess)
	{
		AfxMessageBox("There is no connected");
		return;
	}
	m_bConnect = TRUE;
	
	GetDlgItem(IDC_EDIT_INDEX)->GetWindowText(strkeyno);
	GetDlgItem(IDC_EDIT_KEY)->GetWindowText(strkeydata);

	// Locations: 0x00 ~0x0F
	if(strkeyno == "" || atoi(strkeyno) >= 16 || atoi(strkeyno) < 0)
	{
		AfxMessageBox("There is no Key Index !!");
		m_ctlKeyNumber.SetFocus();
		return;
	}

	// Key is 6 byte
	if(strkeydata == "" || (strkeydata.GetLength() / 2 ) != 6 )
	{
		AfxMessageBox("Please Check KEY(length Error:KEY length should be 6 bytes)");
		m_ctrlKeyData.SetFocus();
		return;
	}

	Forprint[0] = 0xFD;
	Forprint[1] = 0x2F;
	if(m_radio_AKey.GetCheck())
	{
		mode = 0x00;
		Forprint[2] = 0x00;
		
	}
	else if(m_radio_BKey.GetCheck())
	{
		mode = 0x04;
		Forprint[2] = 0x04;
	}

	keyno = atoi(strkeyno);
	Forprint[3] = keyno;
	Forprint[4] = 0x06;
	
	memset(pbRecv,0x00,1024);

	p_PMSApp->STRING2HEX(strkeydata, keydata);
	memcpy(Forprint+5, keydata, 6);

	p_PMSDlg->SendList(TRUE,11,Forprint); // Send APDU command output

	p_PMSApp->HEX2STRING(Forprint,msg,11);

	// APDU command transmit
	if(p_PMSDlg->TransData(msg,pbRecv,&dwRecv,0,false))	
	{
		p_PMSDlg->SendList(FALSE,dwRecv,pbRecv);	//The data returned in the output list
	}
}

// 'Read' Button Click
void CMifareTestDlg::OnBnClickedBtnRead()
{
	CPCSC_Mifare_SampleDlg* p_PMSDlg = (CPCSC_Mifare_SampleDlg*)AfxGetMainWnd();
	BYTE Forprint[6];

	p_ctrlReaderList->GetWindowText(szReader);

	//Get the name of the reader
	if(szReader == "")
	{
		AfxMessageBox("There is no selected PC/SC Reader");
		return;
	}

	// Check the connection
	if(!p_PMSDlg->m_CNSuccess)
	{
		AfxMessageBox("There is no connected");
		return;
	}
	m_bConnect = TRUE;

	GetDlgItem(IDC_EDIT_BLOCK1)->GetWindowText(m_strBlock1);

	if(m_strBlock1 == "")
	{
		AfxMessageBox("There is no Block Number !!");
		m_ctlBlockNumber.SetFocus();
		return;
	}

	memset(Forprint, 0x00, sizeof(Forprint));

	Forprint[0] = 0xfd;
	Forprint[1] = 0x35;
	Forprint[2] = mode;
	Forprint[3] = keyno;
	Forprint[4] = 0x01;

	block1 = atoi(m_strBlock1);
	Forprint[5] = block1;
	
	p_PMSDlg->SendList(TRUE,6,Forprint);	//Send APDU command output

	p_PMSApp->HEX2STRING(Forprint,msg,6);
	
	memset(pbRecv,0x00,1024);
	dwRecv = sizeof(pbRecv);

	// APDU command transmit
	if(p_PMSDlg->TransData(msg,pbRecv,&dwRecv,0,false))	
	{
		p_PMSDlg->SendList(FALSE,dwRecv,pbRecv);	//The data returned in the output list
	}
}

// 'Write' Button Click
void CMifareTestDlg::OnBnClickedBtnWrite()
{
	CPCSC_Mifare_SampleDlg* p_PMSDlg = (CPCSC_Mifare_SampleDlg*)AfxGetMainWnd();
	BYTE Forprint[22];
	BYTE writedata[16];

	//Get the name of the reader
	p_ctrlReaderList->GetWindowText(szReader);

	if(szReader == "")
	{
		AfxMessageBox("There is no selected PC/SC Reader");
		return;
	}

	// Check the connection
	if(!p_PMSDlg->m_CNSuccess)
	{
		AfxMessageBox("There is no connected");
		return;
	}
	m_bConnect = TRUE;

	GetDlgItem(IDC_EDIT_BLOCK1)->GetWindowText(m_strBlock1);
	GetDlgItem(IDC_EDIT_DATA)->GetWindowText(m_strWriteData);

	if(m_strBlock1 == "")
	{
		AfxMessageBox("There is no Block Number !!");
		m_ctlBlockNumber.SetFocus();
		return;
	}

	//Write Data length should be 16 bytes
	if(m_strWriteData == "" || (m_strWriteData.GetLength() / 2 ) != 16)
	{
		AfxMessageBox("Please Check DATA(length Error:Data length should be 16 bytes)");
		m_strData.SetFocus();
		return;
	}

	memset(Forprint, 0x00, sizeof(Forprint));

	Forprint[0] = 0xfd;
	Forprint[1] = 0x37;
	Forprint[2] = mode;
	Forprint[3] = keyno;
	Forprint[4] = 0x11;

	block1 = atoi(m_strBlock1);
	Forprint[5] = block1;

	p_PMSApp->STRING2HEX(m_strWriteData, writedata);
	memcpy(Forprint+6, writedata, 16);

	p_PMSDlg->SendList(TRUE,22,Forprint);	//// Send APDU command output

	p_PMSApp->HEX2STRING(Forprint,msg,22);

	memset(pbRecv,0x00,1024);
	dwRecv = sizeof(pbRecv);
	
	// APDU command transmit
	if(p_PMSDlg->TransData(msg,pbRecv,&dwRecv,0,false))	
	{
		p_PMSDlg->SendList(FALSE,dwRecv,pbRecv);	//The data returned in the output list
	}
}

// 'Increment' Button Click
void CMifareTestDlg::OnBnClickedBtnIncrement()
{
	CPCSC_Mifare_SampleDlg* p_PMSDlg = (CPCSC_Mifare_SampleDlg*)AfxGetMainWnd();
	BYTE Forprint[11];
	BYTE indata[4];

	//Get the name of the reader
	p_ctrlReaderList->GetWindowText(szReader);

	if(szReader == "")
	{
		AfxMessageBox("There is no selected PC/SC Reader");
		return;
	}

	// Check the connection
	if(!p_PMSDlg->m_CNSuccess)
	{
		AfxMessageBox("There is no connected");
		return;
	}
	m_bConnect = TRUE;
	GetDlgItem(IDC_EDIT_BLOCK1)->GetWindowText(m_strBlock1);
	GetDlgItem(IDC_EDIT_BLOCK2)->GetWindowText(m_strBlock2);
	GetDlgItem(IDC_EDIT_DATA)->GetWindowText(m_strWriteData);

	if(m_strBlock1 == "")
	{
		AfxMessageBox("There is no Block Number !!");
		m_ctlBlockNumber.SetFocus();
		return;
	}
	if(m_strBlock2 == "")
	{
		AfxMessageBox("There is no Transfer Block No. !!");
		m_ctlBlockNumber2.SetFocus();
		return;
	}

	// Data length should be 4 bytes
	if(m_strWriteData == "" || (m_strWriteData.GetLength() / 2 ) != 4)
	{
		AfxMessageBox("Please Check Data(length Error:Data length should be 4 bytes)");
		m_strData.SetFocus();
		return;
	}

	memset(Forprint, 0x00, sizeof(Forprint));

	Forprint[0] = 0xfd;
	Forprint[1] = 0x33;
	Forprint[2] = mode;
	Forprint[3] = keyno;
	Forprint[4] = 0x06;

	block1 = atoi(m_strBlock1);
	Forprint[5] = block1;

	p_PMSApp->STRING2HEX(m_strWriteData, indata);
	memcpy(Forprint+6, indata, 4);

	Transblock = atoi(m_strBlock2);
	Forprint[10] = Transblock;

	p_PMSDlg->SendList(TRUE,11,Forprint);	//Send APDU command output

	p_PMSApp->HEX2STRING(Forprint,msg,11);

	memset(pbRecv,0x00,1024);
	dwRecv = sizeof(pbRecv);
	
	// APDU command transmit
	if(p_PMSDlg->TransData(msg,pbRecv,&dwRecv,0,false))	
	{
		p_PMSDlg->SendList(FALSE,dwRecv,pbRecv);	//The data returned in the output list
	}
}

// 'Decrement' Button Click
void CMifareTestDlg::OnBnClickedBtnDecrement()
{
	CPCSC_Mifare_SampleDlg* p_PMSDlg = (CPCSC_Mifare_SampleDlg*)AfxGetMainWnd();
	BYTE Forprint[11];
	BYTE dedata[4];

	//Get the name of the reader
	p_ctrlReaderList->GetWindowText(szReader);

	if(szReader == "")
	{
		AfxMessageBox("There is no selected PC/SC Reader");
		return;
	}

	// Check the connection
	if(!p_PMSDlg->m_CNSuccess)
	{
		AfxMessageBox("There is no connected");
		return;
	}
	m_bConnect = TRUE;
	GetDlgItem(IDC_EDIT_BLOCK1)->GetWindowText(m_strBlock1);
	GetDlgItem(IDC_EDIT_BLOCK2)->GetWindowText(m_strBlock2);
	GetDlgItem(IDC_EDIT_DATA)->GetWindowText(m_strWriteData);

	if(m_strBlock1 == "")
	{
		AfxMessageBox("There is no Block Number !!");
		m_ctlBlockNumber.SetFocus();
		return;
	}
	if(m_strBlock2 == "")
	{
		AfxMessageBox("There is no Transfer Block No. !!");
		m_ctlBlockNumber2.SetFocus();
		return;
	}
	if(m_strWriteData == "" || (m_strWriteData.GetLength() / 2 ) != 4)
	{
		AfxMessageBox("Please Check Data(length Error:Data length should be 4 bytes)");
		m_strData.SetFocus();
		return;
	}

	memset(Forprint, 0x00, sizeof(Forprint));

	Forprint[0] = 0xfd;
	Forprint[1] = 0x34;
	Forprint[2] = mode;
	Forprint[3] = keyno;
	Forprint[4] = 0x06;

	block1 = atoi(m_strBlock1);
	Forprint[5] = block1;

	p_PMSApp->STRING2HEX(m_strWriteData, dedata);
	memcpy(Forprint+6, dedata, 4);

	Transblock = atoi(m_strBlock2);
	Forprint[10] = Transblock;

	p_PMSDlg->SendList(TRUE,11,Forprint);	//Send APDU command output

	p_PMSApp->HEX2STRING(Forprint,msg,11);

	memset(pbRecv,0x00,1024);
	dwRecv = sizeof(pbRecv);
	
	// APDU command transmit
	if(p_PMSDlg->TransData(msg,pbRecv,&dwRecv,0,false))	
	{
		p_PMSDlg->SendList(FALSE,dwRecv,pbRecv);	//The data returned in the output list
	}
}

// Change the value output when there is a change in the length of the data
void CMifareTestDlg::OnEnChangeEditData()
{
	int n;
	CString strStatus; 
	n = m_strData.GetWindowTextLength();
	
	if(n == 0)
	{
		strStatus.Format("%d Bytes (0/2)", n/2);
	}
	else if(n%2 == 0)
	{
		strStatus.Format("%d Bytes (2/2)", (n+1)/2);
	}
	else
	{
		strStatus.Format("%d Bytes (1/2)", (n+1)/2);
	}

	m_ctrlLength.SetWindowText(strStatus);
}

// Change the value output when there is a change in the length of the key data
void CMifareTestDlg::OnEnChangeEditKey()
{
	int n;
	CString strStatus,strKey; 
	GetDlgItem(IDC_EDIT_KEY)->GetWindowText(strKey);
	n = strKey.GetLength();
	
	if(n == 0)
	{
		strStatus.Format("%d Bytes (0/2)", n/2);
	}
	else if(n%2 == 0)
	{
		strStatus.Format("%d Bytes (2/2)", (n+1)/2);
	}
	else
	{
		strStatus.Format("%d Bytes (1/2)", (n+1)/2);
	}

	GetDlgItem(IDC_EDIT_KEY_LENGTH)->SetWindowText(strStatus);
}

