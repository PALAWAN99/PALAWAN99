// TestSampleDlg.cpp : implementation file
//

#include "stdafx.h"
#include "TestSample.h"
#include "TestSampleDlg.h"
#include ".\testsampledlg.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif

/////////////////////////////////////////////////////////////////////////////
// CAboutDlg dialog used for App About

class CAboutDlg : public CDialog
{
public:
	CAboutDlg();

// Dialog Data
	//{{AFX_DATA(CAboutDlg)
	enum { IDD = IDD_ABOUTBOX };
	//}}AFX_DATA

	// ClassWizard generated virtual function overrides
	//{{AFX_VIRTUAL(CAboutDlg)
	protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV support
	//}}AFX_VIRTUAL

// Implementation
protected:
	//{{AFX_MSG(CAboutDlg)
	//}}AFX_MSG
	DECLARE_MESSAGE_MAP()
};

CAboutDlg::CAboutDlg() : CDialog(CAboutDlg::IDD)
{
	//{{AFX_DATA_INIT(CAboutDlg)
	//}}AFX_DATA_INIT
}

void CAboutDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	//{{AFX_DATA_MAP(CAboutDlg)
	//}}AFX_DATA_MAP
}

BEGIN_MESSAGE_MAP(CAboutDlg, CDialog)
	//{{AFX_MSG_MAP(CAboutDlg)
		// No message handlers
	//}}AFX_MSG_MAP
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CTestSampleDlg dialog

CTestSampleDlg::CTestSampleDlg(CWnd* pParent /*=NULL*/)
	: CDialog(CTestSampleDlg::IDD, pParent)
{
	//{{AFX_DATA_INIT(CTestSampleDlg)
	m_strKey = _T("FFFFFFFFFFFF");
	m_strblock = _T("1");
	m_strData = _T("");
	//}}AFX_DATA_INIT
	m_nPort = 0;
	m_bConnect = FALSE;
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
}

void CTestSampleDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	//{{AFX_DATA_MAP(CTestSampleDlg)
	DDX_Control(pDX, IDC_COMBO2, m_ctrlKeyType);
	DDX_Control(pDX, IDC_LIST2, m_ctrlList);
	DDX_Control(pDX, IDC_COMBO1, m_ctrlPort);
	DDX_Text(pDX, IDC_EDIT_KEY, m_strKey);
	DDV_MaxChars(pDX, m_strKey, 12);
	DDX_Text(pDX, IDC_EDIT_BLOCK, m_strblock);
	DDX_Text(pDX, IDC_EDIT_DATA, m_strData);
	DDV_MaxChars(pDX, m_strData, 32);
	//}}AFX_DATA_MAP
	DDX_Control(pDX, IDC_COMBO3, m_ctrlBaud);
}

BEGIN_MESSAGE_MAP(CTestSampleDlg, CDialog)
	//{{AFX_MSG_MAP(CTestSampleDlg)
	ON_WM_SYSCOMMAND()
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	ON_BN_CLICKED(IDC_BUTTON2, OnButton2)
	ON_BN_CLICKED(IDC_BUTTON3, OnButton3)
	ON_CBN_SELCHANGE(IDC_COMBO1, OnSelchangeCombo1)
	ON_BN_CLICKED(IDC_BTN_REQA, OnBtnReqa)
	ON_BN_CLICKED(IDC_BTN_ANTICOL, OnBtnAnticol)
	ON_BN_CLICKED(IDC_BTN_SELECT, OnBtnSelect)
	ON_BN_CLICKED(IDC_BTN_AUTHKEY, OnBtnAuthkey)
	ON_BN_CLICKED(IDC_BTN_READ, OnBtnRead)
	ON_BN_CLICKED(IDC_BTN_WRITE, OnBtnWrite)
	ON_BN_CLICKED(IDC_BTN_LISTCLEAR, OnBtnListclear)
	//}}AFX_MSG_MAP
	ON_BN_CLICKED(IDC_BTN_REQB, OnBnClickedBtnReqb)
	ON_BN_CLICKED(IDC_BTN_ATTRIB, OnBnClickedBtnAttrib)
	ON_BN_CLICKED(IDC_BTN_SEL, OnBnClickedBtnSel)
	ON_BN_CLICKED(IDC_BTN_FINDCARD, &CTestSampleDlg::OnBnClickedBtnFindcard)
	ON_BN_CLICKED(IDC_BTN_TAGTEST, &CTestSampleDlg::OnBnClickedBtnTagtest)
	ON_BN_CLICKED(IDC_BUTTON4, &CTestSampleDlg::OnBnClickedButton4)
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CTestSampleDlg message handlers

BOOL CTestSampleDlg::OnInitDialog()
{
	CDialog::OnInitDialog();

	// Add "About..." menu item to system menu.

	// IDM_ABOUTBOX must be in the system command range.
	ASSERT((IDM_ABOUTBOX & 0xFFF0) == IDM_ABOUTBOX);
	ASSERT(IDM_ABOUTBOX < 0xF000);

	CMenu* pSysMenu = GetSystemMenu(FALSE);
	if (pSysMenu != NULL)
	{
		CString strAboutMenu;
		strAboutMenu.LoadString(IDS_ABOUTBOX);
		if (!strAboutMenu.IsEmpty())
		{
			pSysMenu->AppendMenu(MF_SEPARATOR);
			pSysMenu->AppendMenu(MF_STRING, IDM_ABOUTBOX, strAboutMenu);
		}
	}

	SetIcon(m_hIcon, TRUE);			// Set big icon
	SetIcon(m_hIcon, FALSE);		// Set small icon
	
	// TODO: Add extra initialization here
	char devname[100];
	int cnt = DE_GetUSBDeviceList();
	for (int i = 0; i < cnt; i++)
	{
		memset(devname, 0x00, sizeof(devname));
		DE_GetUSBDeviceName(i, devname);
		m_ctrlPort.AddString(devname);
	}	
	m_ctrlPort.SetCurSel(0);
	m_ctrlBaud.SetCurSel(1);
	m_ctrlKeyType.SetCurSel(0);

	m_nPort = 0;
	return TRUE;  // return TRUE  unless you set the focus to a control
}

void CTestSampleDlg::OnSysCommand(UINT nID, LPARAM lParam)
{
	if ((nID & 0xFFF0) == IDM_ABOUTBOX)
	{
		CAboutDlg dlgAbout;
		dlgAbout.DoModal();
	}
	else
	{
		CDialog::OnSysCommand(nID, lParam);
	}
}

// If you add a minimize button to your dialog, you will need the code below
//  to draw the icon.  For MFC applications using the document/view model,
//  this is automatically done for you by the framework.

void CTestSampleDlg::OnPaint() 
{
	if (IsIconic())
	{
		CPaintDC dc(this); // device context for painting

		SendMessage(WM_ICONERASEBKGND, (WPARAM) dc.GetSafeHdc(), 0);

		// Center icon in client rectangle
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		// Draw the icon
		dc.DrawIcon(x, y, m_hIcon);
	}
	else
	{
		CDialog::OnPaint();
	}
}

HCURSOR CTestSampleDlg::OnQueryDragIcon()
{
	return (HCURSOR) m_hIcon;
}

//connect & disconnect device
void CTestSampleDlg::OnButton2() 
{
	if(!m_bConnect)
	{
		CString strport, strbaud;
		int baud;
		m_ctrlPort.GetWindowTextA(strport);
		if (strport.Mid(0, 3) == "COM")
		{
			m_nPort = atoi(strport.Mid(3));
			m_ctrlBaud.GetWindowTextA(strbaud);
			baud = atoi(strbaud);
		}
		else
		{
			int idx = m_ctrlPort.GetCurSel();
			m_nPort = 100 + idx;
			baud = 0;
		}
		
		if (DE_InitPort(m_nPort, baud) == m_nPort)
		{
			m_bConnect = TRUE;
			DE_BuzzerOn(m_nPort);
			Sleep(100);
			DE_BuzzerOff(m_nPort);			
			GetDlgItem(IDC_BUTTON2)->SetWindowText("Disconnect device");
		}
		else
		{
			AfxMessageBox("Failed to connect device");
		}
	}
	else
	{
		m_nPort = 0;
		m_bConnect = FALSE;
		DE_ClosePort(m_nPort);
		DE_BuzzerOn(m_nPort);
		Sleep(100);
		DE_BuzzerOff(m_nPort);
		DE_BuzzerOn(m_nPort);
		Sleep(100);
		DE_BuzzerOff(m_nPort);
		GetDlgItem(IDC_BUTTON2)->SetWindowText("Connect device");
	}
}

BOOL CTestSampleDlg::DestroyWindow() 
{
	// TODO: Add your specialized code here and/or call the base class
	if(m_bConnect)
		DE_ClosePort(m_nPort);
	return CDialog::DestroyWindow();
}

void CTestSampleDlg::OnButton3() 
{
	if(!m_bConnect)
	{
		AfxMessageBox("Device is not connected");
		return ;
	}

	int outlen;
	BYTE lpRes[256];
	CString strtmp;

	memset(lpRes,0x00,256);
	DE_GetVersion(m_nPort, &outlen, lpRes);
	strtmp.Format("%s",lpRes+1);
	GetDlgItem(IDC_STATIC_VER)->SetWindowText(strtmp);
}

void CTestSampleDlg::OnSelchangeCombo1() 
{
	if(m_bConnect)
	{
		m_bConnect = FALSE;
		DE_ClosePort(m_nPort);
		DE_BuzzerOn(m_nPort);
		Sleep(100);
		DE_BuzzerOff(m_nPort);
		DE_BuzzerOn(m_nPort);
		Sleep(100);
		DE_BuzzerOff(m_nPort);
		GetDlgItem(IDC_BUTTON2)->SetWindowText("Connect device");
	}	
}

void CTestSampleDlg::HEX2STRING(BYTE *hex, CString& str, int hexLen)
{
	BYTE buf[MAX_DATA_LENGTH*2];
	int i;
	
	if(MAX_DATA_LENGTH < hexLen)
	{
		str = "Wrong Data(Length Error)";
		return ;

	}
	memset(buf, 0x00, MAX_DATA_LENGTH*2);
	for (i = 0; i < hexLen; i++){
		HEX2ASCII(hex[i], buf+(i*2));
	}

	str.Format("%s", buf);
}

void CTestSampleDlg::HEX2ASCII(BYTE c, BYTE *asc)
{
	BYTE tmp;

	tmp = c & 0x0f;
	if(tmp<0x0a)	asc[1] = (tmp+0x30);
	else	asc[1] = (tmp+0x37);
	tmp = (c>>4)&0x0f;
	if(tmp<0x0a)	asc[0] = (tmp+0x30);
	else	asc[0] = (tmp+0x37);
}

void CTestSampleDlg::STRING2HEX(CString str, BYTE *hex)
{
	int i;
	
	for(i = 0; i < str.GetLength()/2; i++){
		hex[i] = ASCII2HEX(str.Mid(i*2, 2));	
	}
}

BYTE CTestSampleDlg::ASCII2HEX(CString str)
{
	BYTE temp;
	BYTE a[3];


	memcpy(a, str, 2);

	
	if((a[0]>='0') && (a[0] <= '9')) 		temp = (a[0]-'0');
	else if((a[0]>='a') && (a[0] <= 'f')) 	temp = (a[0]-'W');	//Capital
	else 									temp = (a[0]-'7');	//small
	temp <<= 4;
	if((a[1]>='0') && (a[1] <= '9')) 		temp |= (a[1]-'0');
	else if((a[1]>='a') && (a[1] <= 'f')) 	temp |= (a[1]-'W');	//Capital
	else									temp |= (a[1]-'7');	//small

	return(temp);
}

void CTestSampleDlg::OnBtnReqa() 
{
	int ret;
	int outlen;
	BYTE lpRes[256];
	CString strtmp,strtmp2;
	memset(lpRes,0x00,256);

	m_ctrlList.AddString("=> 21");
	ret = DEA_Idle_Req(m_nPort, &outlen, lpRes);
	if(ret != DE_OK)	
		ret = DEA_Idle_Req(m_nPort, &outlen, lpRes);
	if(ret == DE_OK)
	{
		HEX2STRING(lpRes,strtmp,outlen);
		strtmp2.Format("<= %s",strtmp);
		m_ctrlList.AddString(strtmp2);
	}
	else
	{
		strtmp.Format("<= %02d",ret);
		m_ctrlList.AddString(strtmp);
	}
	m_ctrlList.SetCaretIndex(m_ctrlList.GetCount());
}

void CTestSampleDlg::OnBtnAnticol() 
{
	int ret;
	int outlen;
	BYTE lpRes[256];
	CString strtmp,strtmp2;
	memset(lpRes,0x00,256);

	m_ctrlList.AddString("=> 2300");

	BYTE level = 0x00;			//to read cascade level1 mifare card
	ret = DEA_Anticoll(m_nPort, &outlen, lpRes);
	if(ret == DE_OK)
	{
		HEX2STRING(lpRes,strtmp,outlen);
		strtmp2.Format("<= %s",strtmp);
		m_ctrlList.AddString(strtmp2);
		HEX2STRING(lpRes+1,m_strUID,4);		
	}
	else
	{
		strtmp.Format("<= %02d",ret);
		m_ctrlList.AddString(strtmp);
	}
	m_ctrlList.SetCaretIndex(m_ctrlList.GetCount());
	
}

void CTestSampleDlg::OnBtnSelect() 
{
	int ret;
	int outlen;
	BYTE SBUF[256],RBUF[256];
	CString strtmp,strtmp2;
	memset(RBUF,0x00,256);
	memset(SBUF,0x00,256);

	strtmp.Format("=> 24%s",m_strUID);
	m_ctrlList.AddString(strtmp);	

	STRING2HEX(m_strUID, SBUF);
	ret = DEA_Select(m_nPort, SBUF, &outlen, RBUF);
	if(ret == DE_OK)
	{
		HEX2STRING(RBUF,strtmp,outlen);
		strtmp2.Format("<= %s",strtmp);
		m_ctrlList.AddString(strtmp2);		
	}
	else
	{
		strtmp.Format("<= %02d",ret);
		m_ctrlList.AddString(strtmp);
	}
	m_ctrlList.SetCaretIndex(m_ctrlList.GetCount());
	
}

void CTestSampleDlg::OnBtnAuthkey() 
{
	UpdateData();

	BYTE keytype;
	int blocknum;
	BYTE keydata[6];
	int ret;
	BYTE RBUF[256];
	CString strtmp,strtmp2;
	memset(RBUF,0x00,256);	

	m_strKey.Remove(' ');
	if(m_strKey.GetLength() != 12)
	{
		AfxMessageBox("Key length Error\nKey length should be 6bytes");
		return ;
	}
	STRING2HEX(m_strKey, keydata);
	
	m_strblock.Remove(' ');
	if(m_strblock.GetLength() == 0)
	{
		AfxMessageBox("There is no block number");
		return ;
	}
	blocknum = atoi(m_strblock);
	if(blocknum < 0 || blocknum > 255)
	{
		AfxMessageBox("Block number Error");
		return ;
	}

	int idx = m_ctrlKeyType.GetCurSel();
	if(idx == 0)
		keytype = 0x00;
	else
		keytype = 0x04;

	strtmp.Format("=> 30%02X%s%02d",keytype,m_strKey,blocknum);
	m_ctrlList.AddString(strtmp);	

	ret = DEA_Authkey(m_nPort, keytype, keydata, blocknum);
	strtmp.Format("<= %02d",ret);
	m_ctrlList.AddString(strtmp);
	
	m_ctrlList.SetCaretIndex(m_ctrlList.GetCount());
}

void CTestSampleDlg::OnBtnRead() 
{
	UpdateData();
	
	int blocknum;
	int ret,outlen;
	BYTE RBUF[256];
	CString strtmp,strtmp2;
	memset(RBUF,0x00,256);	

	GetDlgItem(IDC_BTN_READ)->EnableWindow(FALSE);
	m_strblock.Remove(' ');
	if(m_strblock.GetLength() == 0)
	{
		AfxMessageBox("There is no block number");
		GetDlgItem(IDC_BTN_READ)->EnableWindow(TRUE);
		return ;
	}
	blocknum = atoi(m_strblock);
	if(blocknum < 0 || blocknum > 255)
	{
		AfxMessageBox("Block number Error");
		GetDlgItem(IDC_BTN_READ)->EnableWindow(TRUE);
		return ;
	}

	strtmp.Format("=> 27%02d",blocknum);
	m_ctrlList.AddString(strtmp);	

	ret = DEA_Read(m_nPort, blocknum, &outlen, RBUF);
	if(ret == DE_OK)
	{
		HEX2STRING(RBUF,strtmp,outlen);
		strtmp2.Format("<= %s",strtmp);
		m_ctrlList.AddString(strtmp2);	
		HEX2STRING(RBUF+1,strtmp,outlen-1);
		GetDlgItem(IDC_EDIT_DATA)->SetWindowText(strtmp);
	}
	else
	{
		strtmp.Format("<= %02d",ret);
		m_ctrlList.AddString(strtmp);
	}
	m_ctrlList.SetCaretIndex(m_ctrlList.GetCount());	
	GetDlgItem(IDC_BTN_READ)->EnableWindow(TRUE);
}

void CTestSampleDlg::OnBtnWrite() 
{
	UpdateData();
	
	int blocknum;
	int ret;
	BYTE RBUF[256];
	BYTE SBUF[256];
	char errmsg[256];
	CString strtmp,strtmp2;
	memset(RBUF,0x00,256);	
	memset(SBUF,0x00,256);	
	memset(errmsg,0x00,256);	

	GetDlgItem(IDC_BTN_WRITE)->EnableWindow(FALSE);
	m_strData.Remove(' ');
	if(m_strData.GetLength() != 32)
	{
		AfxMessageBox("Data length Error");
		GetDlgItem(IDC_BTN_WRITE)->EnableWindow(TRUE);
		return ;
	}

	m_strblock.Remove(' ');
	if(m_strblock.GetLength() == 0)
	{
		AfxMessageBox("There is no block number");
		GetDlgItem(IDC_BTN_WRITE)->EnableWindow(TRUE);
		return ;
	}
	blocknum = atoi(m_strblock);
	if(blocknum < 0 || blocknum > 255)
	{
		AfxMessageBox("Block number Error");
		GetDlgItem(IDC_BTN_WRITE)->EnableWindow(TRUE);
		return ;
	}

	STRING2HEX(m_strData,SBUF);
	strtmp2.Format("=> 28%02d%s",blocknum,m_strData);
	m_ctrlList.AddString(strtmp2);	

	ret = DEA_Write(m_nPort, blocknum, 16, SBUF);
	
	if(ret == DE_OK)
	{
		strtmp.Format("<= %02d",ret);
		m_ctrlList.AddString(strtmp);
	}
	else
	{
		GetErrMsg(ret,errmsg);
		strtmp.Format("<= %s",errmsg);
		m_ctrlList.AddString(strtmp);
	}
	
	m_ctrlList.SetCaretIndex(m_ctrlList.GetCount());
	GetDlgItem(IDC_BTN_WRITE)->EnableWindow(TRUE);
}

void CTestSampleDlg::OnBtnListclear() 
{
	m_ctrlList.ResetContent();
}

void CTestSampleDlg::OnBnClickedBtnReqb()
{
	BYTE SBUF[MAX_DATA_LENGTH];
	BYTE RBUF[MAX_DATA_LENGTH];
	int nSLen=0;
	int nRLen=0;
	int nRet;
	
	CString msg,strtmp;
	
	if(m_nPort == 0)
	{
		AfxMessageBox("Device is not connected");
		return ;
	}

	DE_RFOff(m_nPort);
	DE_RFOn(m_nPort);

	memset(SBUF, 0x00, sizeof(SBUF));
	memset(RBUF, 0x00, sizeof(RBUF)); 

	SBUF[0] = 0x05;
	SBUF[1] = 0x00;
	SBUF[2] = 0x00;
		
	HEX2STRING(SBUF,msg,3 );
	strtmp.Format("=> 60%s50",msg);
	m_ctrlList.AddString(strtmp);	
	
	nRet = DEB_Transparent(m_nPort, 3, SBUF, 0x50, &nRLen, RBUF);

	if(nRet == DE_OK)
	{
		HEX2STRING(RBUF,strtmp,nRLen);
		msg.Format("<= %s",strtmp);
		m_ctrlList.AddString(msg);	
		memcpy(m_pIdentifier,RBUF+2,4);
	}	
	else
	{
		strtmp.Format("<= %02d",nRet);
		m_ctrlList.AddString(strtmp);
	}
	m_ctrlList.SetCaretIndex(m_ctrlList.GetCount());	
}

void CTestSampleDlg::OnBnClickedBtnAttrib()
{
	BYTE SBUF[MAX_DATA_LENGTH];
	BYTE RBUF[MAX_DATA_LENGTH];
	int nSLen=0;
	int nRLen=0;
	int nRet;
	
	CString msg,strtmp;
	
	if(m_nPort == 0)
	{
		AfxMessageBox("Device is not connected");
		return ;
	}

	memset(SBUF, 0x00, sizeof(SBUF));
	memset(RBUF, 0x00, sizeof(RBUF)); 

	SBUF[nSLen++] = 0x1D;
	memcpy(SBUF+nSLen,m_pIdentifier,4);
	nSLen += 4;
	SBUF[nSLen++] = 0x00;
	SBUF[nSLen++] = 0x08;
	SBUF[nSLen++] = 0x01;
	SBUF[nSLen++] = 0x00;
	
	HEX2STRING(SBUF,msg,nSLen );
	strtmp.Format("=> 60%s50",msg);
	m_ctrlList.AddString(strtmp);	
	
	nRet = DEB_Transparent(m_nPort, nSLen, SBUF, 0x50, &nRLen, RBUF);

	if(nRet == DE_OK)
	{
		HEX2STRING(RBUF,strtmp,nRLen);
		msg.Format("<= %s",strtmp);
		m_ctrlList.AddString(msg);			
	}
	else
	{
		strtmp.Format("<= %02d",nRet);
		m_ctrlList.AddString(strtmp);
	}
	m_ctrlList.SetCaretIndex(m_ctrlList.GetCount());	
}



void CTestSampleDlg::OnBnClickedBtnSel()
{
	BYTE SBUF[MAX_DATA_LENGTH];
	BYTE RBUF[MAX_DATA_LENGTH];
	int nSLen=0;
	int nRLen=0;
	int nRet;
	
	CString msg,strtmp;
	
	if(m_nPort == 0)
	{
		AfxMessageBox("Device is not connected");
		return ;
	}

	memset(SBUF, 0x00, sizeof(SBUF));
	memset(RBUF, 0x00, sizeof(RBUF)); 

	msg = "0A0000A4000002AA22";//0A:PCB,00:CID, 00A4000002AA22:select file

	nSLen = msg.GetLength()/2;
	STRING2HEX(msg,SBUF);
	
	strtmp.Format("=> 60%s50",msg);
	m_ctrlList.AddString(strtmp);		
	nRet = DEB_Transparent(m_nPort, nSLen, SBUF, 0x50, &nRLen, RBUF);

	if(nRet == DE_OK)
	{
		HEX2STRING(RBUF,strtmp,nRLen);
		msg.Format("<= %s",strtmp);
		m_ctrlList.AddString(msg);			
	}
	else
	{
		strtmp.Format("<= %02d",nRet);
		m_ctrlList.AddString(strtmp);
	}
	m_ctrlList.SetCaretIndex(m_ctrlList.GetCount());
}


void CTestSampleDlg::OnBnClickedBtnFindcard()
{
	BYTE RBUF[MAX_DATA_LENGTH];
	int nSLen = 0;
	int nRLen = 0;
	int nRet;
	CString strtmp,tmp2;

	nRet = DE_FindCard(m_nPort, 0, 0, 0, 0, &nRLen, RBUF);

	strtmp.Format("<= ret : %02d", nRet);
	m_ctrlList.AddString(strtmp);

	if (nRet == DE_OK)
	{
		HEX2STRING(RBUF, tmp2, nRLen);
		strtmp.Format("<= %s", tmp2);
		m_ctrlList.AddString(strtmp);
	}
}


void CTestSampleDlg::OnBnClickedBtnTagtest()
{
	BYTE SBUF[MAX_DATA_LENGTH];
	BYTE RBUF[MAX_DATA_LENGTH];
	int nSLen = 0;
	int nRLen = 0;
	int nRet;
	CString strtmp, tmp2;

	SBUF[0] = 0x00;
	nRet = DE_NFC_TAG_CMD(m_nPort, 0x40, 0x00, 1, SBUF, &nRLen, RBUF);

	strtmp.Format("<= ret : %02d", nRet);
	m_ctrlList.AddString(strtmp);

	if (nRet == DE_OK)
	{
		HEX2STRING(RBUF, tmp2, nRLen);
		strtmp.Format("<= %s", tmp2);
		m_ctrlList.AddString(strtmp);
	}
}


void CTestSampleDlg::OnBnClickedButton4()
{
	char devname[100];
	int cnt = DE_GetUSBDeviceList();
	for (int i = 0; i < cnt; i++)
	{
	memset(devname, 0x00, sizeof(devname));
	DE_GetUSBDeviceName(i, devname);
	m_ctrlPort.AddString(devname);
	}
	m_ctrlPort.SetCurSel(0);
	m_ctrlBaud.SetCurSel(1);
	m_ctrlKeyType.SetCurSel(0);
}
