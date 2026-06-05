
// DesFire_SampleDlg.cpp : 구현 파일
//

#include "stdafx.h"
#include "DesFire_Sample.h"
#include "DesFire_SampleDlg.h"
#include "DualCardDllHeader.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif

// 응용 프로그램 정보에 사용되는 CAboutDlg 대화 상자입니다.

class CAboutDlg : public CDialog
{
public:
	CAboutDlg();

// 대화 상자 데이터입니다.
	enum { IDD = IDD_ABOUTBOX };

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV 지원입니다.

// 구현입니다.
protected:
	DECLARE_MESSAGE_MAP()
};

CAboutDlg::CAboutDlg() : CDialog(CAboutDlg::IDD)
{
}

void CAboutDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
}

BEGIN_MESSAGE_MAP(CAboutDlg, CDialog)
END_MESSAGE_MAP()


// CDesFire_SampleDlg 대화 상자




CDesFire_SampleDlg::CDesFire_SampleDlg(CWnd* pParent /*=NULL*/)
	: CDialog(CDesFire_SampleDlg::IDD, pParent)
{
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
	m_nPort = 0;

}

void CDesFire_SampleDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_COMBO_DEVICE, m_comDevice);
	DDX_Control(pDX, IDC_COMBO_KEYTYPE, m_comKeyType);
	DDX_Control(pDX, IDC_EDIT1, m_ctrlData);
	DDX_Control(pDX, IDC_CHECK_DATAENC, m_chkEnc);
	DDX_Control(pDX, IDC_LIST1, m_ctrlLOG);
}

BEGIN_MESSAGE_MAP(CDesFire_SampleDlg, CDialog)
	ON_WM_SYSCOMMAND()
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	//}}AFX_MSG_MAP
	ON_BN_CLICKED(IDC_BUTTON_CONNECT, &CDesFire_SampleDlg::OnBnClickedButtonConnect)
	ON_BN_CLICKED(IDC_BUTTON_CONNECT2, &CDesFire_SampleDlg::OnBnClickedButtonConnect2)
	ON_BN_CLICKED(IDC_BUTTON_READ, &CDesFire_SampleDlg::OnBnClickedButtonRead)
	ON_BN_CLICKED(IDC_BUTTON_WRITE, &CDesFire_SampleDlg::OnBnClickedButtonWrite)
	ON_BN_CLICKED(IDC_BUTTON_BATCH_WRITE, &CDesFire_SampleDlg::OnBnClickedButtonBatchWrite)
	ON_BN_CLICKED(IDC_BUTTON_BATCH_READ, &CDesFire_SampleDlg::OnBnClickedButtonBatchRead)
	ON_BN_CLICKED(IDC_BUTTON_REFLASH, &CDesFire_SampleDlg::OnBnClickedButtonReflash)
END_MESSAGE_MAP()


// CDesFire_SampleDlg 메시지 처리기

BOOL CDesFire_SampleDlg::OnInitDialog()
{
	CDialog::OnInitDialog();

	// 시스템 메뉴에 "정보..." 메뉴 항목을 추가합니다.

	// IDM_ABOUTBOX는 시스템 명령 범위에 있어야 합니다.
	ASSERT((IDM_ABOUTBOX & 0xFFF0) == IDM_ABOUTBOX);
	ASSERT(IDM_ABOUTBOX < 0xF000);

	CMenu* pSysMenu = GetSystemMenu(FALSE);
	if (pSysMenu != NULL)
	{
		BOOL bNameValid;
		CString strAboutMenu;
		bNameValid = strAboutMenu.LoadString(IDS_ABOUTBOX);
		ASSERT(bNameValid);
		if (!strAboutMenu.IsEmpty())
		{
			pSysMenu->AppendMenu(MF_SEPARATOR);
			pSysMenu->AppendMenu(MF_STRING, IDM_ABOUTBOX, strAboutMenu);
		}
	}

	// 이 대화 상자의 아이콘을 설정합니다. 응용 프로그램의 주 창이 대화 상자가 아닐 경우에는
	//  프레임워크가 이 작업을 자동으로 수행합니다.
	SetIcon(m_hIcon, TRUE);			// 큰 아이콘을 설정합니다.
	SetIcon(m_hIcon, FALSE);		// 작은 아이콘을 설정합니다.

	// TODO: 여기에 추가 초기화 작업을 추가합니다.

	InitDevice(); //Initialize device

	GetDlgItem(IDC_BUTTON_CONNECT2)->EnableWindow(FALSE);
	return TRUE;  // 포커스를 컨트롤에 설정하지 않으면 TRUE를 반환합니다.
}

void CDesFire_SampleDlg::InitDevice()
{
	int nNum= DE_GetUSBDeviceList();

	char devName[100];
	int i;

	m_comDevice.ResetContent();

	m_nPort = 0;

	for(i=0; i< nNum; i++)
	{
		memset(devName, 0x00, sizeof(devName));
		DE_GetUSBDeviceName(i, devName);


		m_comDevice.InsertString(i, devName);
	}

	if(i > 0)
	{
		m_bDevice = TRUE;
	}
	else
		m_bDevice = FALSE;


	m_comDevice.SetCurSel(0);
	m_comKeyType.SetCurSel(0);
}

void CDesFire_SampleDlg::OnSysCommand(UINT nID, LPARAM lParam)
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

// 대화 상자에 최소화 단추를 추가할 경우 아이콘을 그리려면
//  아래 코드가 필요합니다. 문서/뷰 모델을 사용하는 MFC 응용 프로그램의 경우에는
//  프레임워크에서 이 작업을 자동으로 수행합니다.

void CDesFire_SampleDlg::OnPaint()
{
	if (IsIconic())
	{
		CPaintDC dc(this); // 그리기를 위한 디바이스 컨텍스트

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

		// 클라이언트 사각형에서 아이콘을 가운데에 맞춥니다.
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		// 아이콘을 그립니다.
		dc.DrawIcon(x, y, m_hIcon);
	}
	else
	{
		CDialog::OnPaint();
	}
}

// 사용자가 최소화된 창을 끄는 동안에 커서가 표시되도록 시스템에서
//  이 함수를 호출합니다.
HCURSOR CDesFire_SampleDlg::OnQueryDragIcon()
{
	return static_cast<HCURSOR>(m_hIcon);
}

void CDesFire_SampleDlg::HEX2STRING(BYTE *hex, CString& str, int hexLen)
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
void CDesFire_SampleDlg::HEX2ASCII(BYTE c, BYTE *asc)
{
	BYTE tmp;

	tmp = c & 0x0f;
	if(tmp<0x0a)	asc[1] = (tmp+0x30);
	else	asc[1] = (tmp+0x37);
	tmp = (c>>4)&0x0f;
	if(tmp<0x0a)	asc[0] = (tmp+0x30);
	else	asc[0] = (tmp+0x37);
}

void CDesFire_SampleDlg::STRING2HEX(CString str, BYTE *hex)
{

	int i;
	
	for(i = 0; i < str.GetLength()/2; i++){
		hex[i] = ASCII2HEX(str.Mid(i*2, 2));	
	}
}

BYTE CDesFire_SampleDlg::ASCII2HEX(CString str)
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

void CDesFire_SampleDlg::OnBnClickedButtonConnect()
{
	int nBaud = 115200;
	int nRcv,idx;
	CString strport;

	m_ctrlData.SetWindowTextA("");


	if(m_bDevice == TRUE)
	{
		m_comDevice.GetWindowText(strport);
		if(strport.Mid(0,3) == "COM")
		{
			m_nPort = atoi(strport.Mid(3));
		}
		else
		{
			idx = m_comDevice.GetCurSel();
			m_nPort = PORT_USB+idx;
		}

		nRcv = DE_InitPort(m_nPort, nBaud);
	}

	if(nRcv != m_nPort)
	{
		AfxMessageBox("Device is not connected");
		m_nPort=0;
		GetDlgItem(IDC_BUTTON_CONNECT)->EnableWindow(TRUE);
		GetDlgItem(IDC_BUTTON_CONNECT2)->EnableWindow(FALSE);
	}
	else
	{
		GetDlgItem(IDC_BUTTON_CONNECT)->EnableWindow(FALSE);
		GetDlgItem(IDC_BUTTON_CONNECT2)->EnableWindow(TRUE);
	}
}

void CDesFire_SampleDlg::OnBnClickedOk()
{
	// TODO: 여기에 컨트롤 알림 처리기 코드를 추가합니다.
	OnOK();
}

void CDesFire_SampleDlg::OnBnClickedButtonConnect2()
{
	DE_ClosePort(m_nPort);
	GetDlgItem(IDC_BUTTON_CONNECT)->EnableWindow(TRUE);
	GetDlgItem(IDC_BUTTON_CONNECT2)->EnableWindow(FALSE);
}

int CDesFire_SampleDlg::FromDetectToAuth()
{
	int ret;
	CString msg;
	BYTE flag = 0x00;

	m_ctrlLOG.ResetContent();

	if(m_nPort == 0)
	{
		AfxMessageBox("Device is not connected");
		return DE_ERROR;
	}
	
	m_nKeyType=m_comKeyType.GetCurSel();
	nRLen = nSLen = nKey = 0;
	memset(RBUF, 0x00, sizeof(RBUF));

	//Detect Card
	m_ctrlLOG.AddString("=>Detect Card");
	ret = DE_FindCard(m_nPort, 0, 0, 0, 0, &nRLen, RBUF);
	if(ret != DE_OK)
	{
		msg.Format("=>[ERR]%02X",ret);
		m_ctrlLOG.AddString(msg);
		return ret;
	}
	else
	{
		HEX2STRING(RBUF,msg,nRLen);
		m_ctrlLOG.AddString(msg);
	}
	
	memset(RBUF, 0x00, sizeof(RBUF));
	memset(SBUF, 0x00, sizeof(SBUF));
	
	//Select Application
	SBUF[nSLen++] = 0x5A; //select application cmd : 5a
	STRING2HEX(AppID,SBUF+nSLen);
	nSLen += 3; //aid : 000005	
	//flag : 00 (reference : New Desfire Batch.pdf, 7Page)
	//cmd len : 4
	m_ctrlLOG.AddString("=>Select Application");
	ret = DE_DESFireTransparent(m_nPort, flag, 4, nSLen, SBUF, &nRLen, RBUF);
	if(ret!= DE_OK)
	{
		msg.Format("=>[ERR]%02X",ret);
		m_ctrlLOG.AddString(msg);
		msg.Format("=>Make sure your desfire card has applicationId '000005'");
		m_ctrlLOG.AddString(msg);
		return ret;
	}
	else
	{
		HEX2STRING(RBUF,msg,nRLen);
		m_ctrlLOG.AddString(msg);
	}

	memset(RBUF, 0x00, sizeof(RBUF));
	memset(SBUF, 0x00, sizeof(SBUF));
	memset(KEY, 0x00, sizeof(KEY));
	
	//Authenticate
	if(m_nKeyType == 0)//DES/3DES
	{
		nKey=16;
		//Key
		STRING2HEX(KEY_3DES,KEY);
	}
	else if(m_nKeyType == 1)//3KEY3DES
	{
		nKey = 24;
		//Key
		STRING2HEX(KEY_3KEY3DES,KEY);
	}
	else//AES
	{
		nKey=16;
		//Key
		STRING2HEX(KEY_AES,KEY);
	}
	
	if(nKey == 16)
		m_b3key = FALSE;
	else if(nKey == 24)
		m_b3key = TRUE;
	else
	{
		AfxMessageBox("Key Length Error\nShould use the 16 or 24 bytes key data");
		return ret;
	}

	//3Key Check
	if(m_nKeyType==2)//AES
		m_b3key = TRUE;
	m_ctrlLOG.AddString("=>Authenticate");
	ret = DE_DESFireAuthentication_UseKeyType(m_nPort,m_nKeyType, 0, KEY, nKey, RBUF, &nRLen);

	if(ret != DE_OK)
	{
		msg.Format("=>[ERR]%02X",ret);
		m_ctrlLOG.AddString(msg);
		return ret;
	}
	else
	{
		HEX2STRING(RBUF,msg,nRLen);
		m_ctrlLOG.AddString(msg);
	}

	return ret;
}

void CDesFire_SampleDlg::OnBnClickedButtonRead()
{
	int ret;
	BYTE flag = 0x00;
	int nOffset=0;
	int nSize = 8;
	CString strRes;
	
	if(FromDetectToAuth() != DE_OK)
		return ;

	m_ctrlData.SetWindowTextA("");
	
	memset(RBUF, 0x00, sizeof(RBUF));
	memset(SBUF, 0x00, sizeof(SBUF));
	nSLen = 0;

	//Read
	SBUF[nSLen++] = 0xBD;//Type : Stand Data
	//TYPE : BackupData 0xBD
	//TYPE : Value 0x6C
	SBUF[nSLen++] = FILENUM; //filenum
	SBUF[nSLen++] = nOffset % 256;//offset
	SBUF[nSLen++] = (nOffset / 256) % (256 * 256);	
	SBUF[nSLen++] = (nOffset / 256) / (256 * 256);
	SBUF[nSLen++] = nSize % 256;	//size
	SBUF[nSLen++] = (nSize / 256) % (256 * 256);	
	SBUF[nSLen++] = (nSize / 256) / (256 * 256);

	//flag	
	if( m_chkEnc.GetCheck() )
	{
		if( m_b3key )
			flag = 0x05;
		else if(m_nKeyType == DESFIRE_KEYTYPE_AES_FOR_FIRSTAUTH)
			flag = 0x11;
		else
			flag = 0x03;
	}
	else
		flag = 0x00;

	//CmdLength= 8;
	m_ctrlLOG.AddString("=>Read");
	ret = DE_DESFireTransparent(m_nPort, flag, 8, nSLen, SBUF, &nRLen, RBUF);
	
	if(ret == DE_OK)
	{
		HEX2STRING(RBUF,strRes,nRLen);
		m_ctrlLOG.AddString(strRes);
		if(RBUF[1] == 0x00)
		{
			HEX2STRING(RBUF, strRes, nRLen);
			m_ctrlData.SetWindowTextA(strRes);
		}
		else
		{
			AfxMessageBox("CARD ERROR");
		}

	}
	else
	{
		strRes.Format("=>[ERR]%02X",ret);
		m_ctrlLOG.AddString(strRes);
	}

}

void CDesFire_SampleDlg::OnBnClickedButtonWrite()
{
	int ret;
	BYTE flag = 0x00;
	int nOffset=0;
	int nSize = 8;
	CString strRes;

	if(FromDetectToAuth() != DE_OK)
		return ;

	memset(RBUF, 0x00, sizeof(RBUF));
	memset(SBUF, 0x00, sizeof(SBUF));
	memset(DATA, 0x00, sizeof(DATA));
	nSLen = 0;

	//Copy Data
	m_ctrlData.GetWindowTextA(strRes);
	if((strRes.GetLength()%2)!=0)
	{
		AfxMessageBox("Please enter data length is an even number.");
		return;
	}
	
	STRING2HEX(strRes, DATA);
	nSize = strRes.GetLength()/2;
	if(nSize > 256)
	{
		AfxMessageBox("The device can write until max 256 byte at once");
		return ;
	}

	//Write
	SBUF[nSLen++] = 0x3D;//Type : Stand Data
	//TYPE : BackupData 0x3D
	//TYPE : Record 0x3B
	SBUF[nSLen++] = FILENUM; //filenum
	SBUF[nSLen++] = nOffset % 256;//offset
	SBUF[nSLen++] = (nOffset / 256) % (256 * 256);	
	SBUF[nSLen++] = (nOffset / 256) / (256 * 256);
	SBUF[nSLen++] = nSize % 256;	//size
	SBUF[nSLen++] = (nSize / 256) % (256 * 256);	
	SBUF[nSLen++] = (nSize / 256) / (256 * 256);
	memcpy(SBUF + nSLen, DATA, nSize);
	nSLen += nSize;
	HEX2STRING(SBUF, strRes, nSLen);

	//flag	
	if( m_chkEnc.GetCheck() )
		if( m_b3key )
			flag = 0x05;
		else if(m_nKeyType == DESFIRE_KEYTYPE_AES_FOR_FIRSTAUTH)
			flag = 0x11;
		else
			flag = 0x03;
	else
		flag = 0x00;

	//CmdLength= 8;
	m_ctrlLOG.AddString("=>Write");
	ret = DE_DESFireTransparent(m_nPort, flag, 8, nSLen, SBUF, &nRLen, RBUF);


	if(ret == DE_OK)
	{
		HEX2STRING(RBUF,strRes,nRLen);
		m_ctrlLOG.AddString(strRes);

		if(RBUF[1] == 0x00)
		{
			HEX2STRING(RBUF, strRes, nRLen);
			m_ctrlData.SetWindowTextA(strRes);
		}
		else
		{
			AfxMessageBox("CARD ERROR");
		}

	}
	else
	{
		strRes.Format("=>[ERR]%02X",ret);
		m_ctrlLOG.AddString(strRes);
	}
}

int CDesFire_SampleDlg::SetConfBatch()
{
	BYTE AID[AID_LENGTH];
	int ret;
	int nKeyNo = 0x00; //Keynumber
	CString msg;

	m_ctrlLOG.ResetContent();
	m_nKeyType=m_comKeyType.GetCurSel();

	if(m_nPort == 0)
	{
		AfxMessageBox("Device is not connected");
		return DE_ERROR;
	}

	nRLen = nSLen = nKey = 0;
	memset(KEY, 0x00, sizeof(KEY));
	memset(AID, 0x00, sizeof(AID));
	
	m_nKeyType=m_comKeyType.GetCurSel();

	m_ctrlLOG.AddString("=>Set Config");
	STRING2HEX(AppID,AID);	//aid : 000005
	if(m_nKeyType == 0)//DES/3DES
	{
		nKey=16;
		//Key
		STRING2HEX(KEY_3DES,KEY);		
		ret = DE_DESFire_SetConfig_Batch(m_nPort, AID, KEY, nKey, nKeyNo);
	}
	else if(m_nKeyType == 1)//3KEY3DES
	{
		nKey=24;
		//Key
		STRING2HEX(KEY_3KEY3DES,KEY);	
		ret = DE_DESFire_SetConfig_Batch(m_nPort, AID, KEY, nKey, nKeyNo);
	}
	else//AES
	{
		nKey=16;
		//Key
		STRING2HEX(KEY_AES,KEY);
		ret = DE_DESFire_SetConfig_Batch_AES(m_nPort, AID, KEY, nKey, nKeyNo);
	}
	
	if(ret != DE_OK)
	{
		msg.Format("=>[ERR]%02X",ret);
		m_ctrlLOG.AddString(msg);
		return ret;
	}
	else
	{
		msg.Format("=>OK");
		m_ctrlLOG.AddString(msg);
	}

	return ret;
}

void CDesFire_SampleDlg::OnBnClickedButtonBatchWrite()
{	
	int ret;
	BYTE flag = 0x00;
	int nOffset=0;
	int nSize = 8;
	CString strRes;
	BYTE status;
		
	if(SetConfBatch() != DE_OK)
		return ;

	//3Key Check
	if(nKey == 16 && m_nKeyType==0) //DES/3DES
		m_b3key = FALSE;
	else if(nKey == 24)//3KEY3DES
		m_b3key = TRUE;
	else if(m_nKeyType==2)//AES
		m_b3key = TRUE;

	memset(RBUF, 0x00, sizeof(RBUF));
	memset(SBUF, 0x00, sizeof(SBUF));
	memset(DATA, 0x00, sizeof(DATA));
	nSLen = 0;

	//Copy Data
	m_ctrlData.GetWindowTextA(strRes);
	if((strRes.GetLength()%2)!=0)
	{
		AfxMessageBox("Please enter data length is an even number.");
		return;
	}
	
	STRING2HEX(strRes, DATA);
	nSize = strRes.GetLength()/2;
	if(nSize > 256)
	{
		AfxMessageBox("The device can write until max 256 byte at once");
		return ;
	}

	//flag value 
	if( m_chkEnc.GetCheck() )
		if( m_bBatch3key )
			flag = 0x05;
		else
			flag = 0x03;
	else
		flag = 0x00;
	
	//Write File Batch
	m_ctrlLOG.AddString("=>Write File Batch");
	ret = DE_DESFire_WriteFile_Batch(m_nPort, flag, FILENUM, nOffset, nSize, DATA, &status);

	if(ret == DE_OK)
	{
		m_ctrlLOG.AddString("=>OK");
		if(status == 0x00)
		{
			HEX2STRING(RBUF, strRes, nRLen);
			m_ctrlData.SetWindowTextA(strRes);
		}
		else
		{
			AfxMessageBox("CARD ERROR");
		}	
	}
	else
	{
		strRes.Format("=>[ERR]%02X",ret);
		m_ctrlLOG.AddString(strRes);
	}
}

void CDesFire_SampleDlg::OnBnClickedButtonBatchRead()
{
	int ret;
	BYTE flag = 0x00;
	int nOffset=0;
	int nSize = 8;
	CString strRes;
	BYTE status;
	
	if(SetConfBatch() != DE_OK)
		return ;

	m_ctrlData.SetWindowTextA("");
 
	//3Key Check
	if(nKey == 16 && m_nKeyType==0) //DES/3DES
		m_b3key = FALSE;
	else if(nKey == 24)//3KEY3DES
		m_b3key = TRUE;
	else if(m_nKeyType==2)//AES
		m_b3key = TRUE;

	memset(RBUF, 0x00, sizeof(RBUF));
	memset(SBUF, 0x00, sizeof(SBUF));
	memset(DATA, 0x00, sizeof(DATA));
	nSLen = 0;

	//Copy Data
	m_ctrlData.GetWindowTextA(strRes);
	STRING2HEX(strRes, DATA);
	nSize = 8;//size
	if(nSize > 256)
	{
		AfxMessageBox("The device can write until max 256 byte at once");
		return ;
	}

	//flag value 
	if( m_chkEnc.GetCheck() )
		if( m_bBatch3key )
			flag = 0x05;
		else
			flag = 0x03;
	else
		flag = 0x00;

	//Read File Batch
	m_ctrlLOG.AddString("=>Read File Batch");
	ret = DE_DESFire_ReadFile_Batch(m_nPort, flag, FILENUM, nOffset, nSize, &nRLen, RBUF, &status);


	if(ret == DE_OK)
	{
		HEX2STRING(RBUF,strRes,nRLen);
		m_ctrlLOG.AddString(strRes);
		if(status == 0x00)
		{
			HEX2STRING(RBUF, strRes, nRLen);
			m_ctrlData.SetWindowTextA(strRes);
		}
		else
		{
			AfxMessageBox("CARD ERROR");
		}

	}
	else
	{
		strRes.Format("=>[ERR]%02X",ret);
		m_ctrlLOG.AddString(strRes);
	}
}

void CDesFire_SampleDlg::OnBnClickedButtonReflash()
{
		InitDevice(); 
}
