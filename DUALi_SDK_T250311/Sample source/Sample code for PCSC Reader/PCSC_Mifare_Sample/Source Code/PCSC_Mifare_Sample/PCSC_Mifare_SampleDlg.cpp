
// PCSC_Mifare_SampleDlg.cpp
//

#include "stdafx.h"
#include "PCSC_Mifare_Sample.h"
#include "PCSC_Mifare_SampleDlg.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif

class CAboutDlg : public CDialog
{
public:
	CAboutDlg();

// Dialog Data
	enum { IDD = IDD_ABOUTBOX };

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV Support

// Implementation
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


// CPCSC_Mifare_SampleDlg Dialog
CPCSC_Mifare_SampleDlg::CPCSC_Mifare_SampleDlg(CWnd* pParent /*=NULL*/)
	: CDialog(CPCSC_Mifare_SampleDlg::IDD, pParent)
{
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
}

void CPCSC_Mifare_SampleDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_TAB1, m_ctrlTab);
	DDX_Control(pDX, IDC_COMBO_READER, m_ctrlReaderList);
	DDX_Control(pDX, IDC_LIST_DATA, m_ctrlDataList);
	DDX_Control(pDX, IDC_EDIT_ACTIVE_PROTO, m_ctrlActiveProto);
	DDX_Control(pDX, IDC_COMBO_SHARE_MODE, m_ctrlShareMode);
	DDX_Control(pDX, IDC_COMBO_PROTOCOL, m_ctrlProtocol);
}

BEGIN_MESSAGE_MAP(CPCSC_Mifare_SampleDlg, CDialog)
	ON_WM_SYSCOMMAND()
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	//}}AFX_MSG_MAP
	ON_NOTIFY(TCN_SELCHANGE, IDC_TAB1, &CPCSC_Mifare_SampleDlg::OnTcnSelchangeTab1)
	ON_WM_DESTROY()
	ON_BN_CLICKED(IDC_BTN_ESTABLISHCONTEXT, &CPCSC_Mifare_SampleDlg::OnBnClickedBtnEstablishcontext)
	ON_BN_CLICKED(IDC_REALSECONTEXT_BTN, &CPCSC_Mifare_SampleDlg::OnBnClickedRealsecontextBtn)
	ON_BN_CLICKED(IDC_CONNECT_BTN, &CPCSC_Mifare_SampleDlg::OnBnClickedConnectBtn)
	ON_BN_CLICKED(IDC_DISCONNECT_BTN, &CPCSC_Mifare_SampleDlg::OnBnClickedDisconnectBtn)
	ON_CBN_SELCHANGE(IDC_COMBO_PROTOCOL, OnSelchangeComboProtocol)
	ON_BN_CLICKED(IDC_BTN_CLEAR, &CPCSC_Mifare_SampleDlg::OnBnClickedBtnClear)
	ON_BN_CLICKED(IDIDC_BTN_TEXT, &CPCSC_Mifare_SampleDlg::OnBnClickedBtnText)
	ON_NOTIFY(NM_CUSTOMDRAW, IDC_LIST_DATA, OnNMCustomdrawListData)
END_MESSAGE_MAP()


// CPCSC_Mifare_SampleDlg message handlers

BOOL CPCSC_Mifare_SampleDlg::OnInitDialog()
{
	CDialog::OnInitDialog();

	// Add "About..." menu item to system menu.

	// IDM_ABOUTBOX must be in the system command range.
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

	// Set the icon for this dialog.  The framework does this automatically
	//  when the application's main window is not a dialog
	SetIcon(m_hIcon, TRUE);			// Set big icon
	SetIcon(m_hIcon, FALSE);		// Set small icon

	// TODO: Add extra initialization here
	InitView();

	SetInitListCtrl();

	MakeCombo();

	m_nCurMenu = 0;

	m_CNSuccess = FALSE;

	//Tab Control
	m_pPCSCTestDlg->GetWindowRect(&m_Rect1);
	m_pPCSCTestDlg->MoveWindow(5, 25, m_Rect1.Width(), m_Rect1.Height());
	m_pPCSCTestDlg->ShowWindow(SW_SHOW);

	m_pMifareTestDlg->MoveWindow(5, 25, m_Rect1.Width(), m_Rect1.Height());

	return TRUE;  // return TRUE  unless you set the focus to a control
}

void CPCSC_Mifare_SampleDlg::OnSysCommand(UINT nID, LPARAM lParam)
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

void CPCSC_Mifare_SampleDlg::OnPaint()
{
	if (IsIconic())
	{
		CPaintDC dc(this);  // device context for painting

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

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

// The system calls this to obtain the cursor to display while the user drags
//  the minimized window.
HCURSOR CPCSC_Mifare_SampleDlg::OnQueryDragIcon()
{
	return static_cast<HCURSOR>(m_hIcon);
}

//Tab control settings
void CPCSC_Mifare_SampleDlg::InitView()
{
	m_ctrlTab.InsertItem(TAB_PCSCTEST, "PCSC Test");
	m_ctrlTab.InsertItem(TAB_MifareTEST, "Mifare Test");

	m_pPCSCTestDlg = new CPCSCTestDlg(&m_ctrlReaderList, &m_ctrlActiveProto, &m_ctrlDataList);
	m_pPCSCTestDlg->Create(IDD_PCSCTEST_DLG, &m_ctrlTab);
	m_pPCSCTestDlg->ShowWindow(SW_HIDE);

	m_pMifareTestDlg = new CMifareTestDlg(&m_ctrlReaderList, &m_ctrlActiveProto, &m_ctrlDataList);
	m_pMifareTestDlg->Create(IDD_MIFARETEST_DLG, &m_ctrlTab);
	m_pMifareTestDlg->ShowWindow(SW_HIDE);

}

//Tab changed Event
void CPCSC_Mifare_SampleDlg::OnTcnSelchangeTab1(NMHDR *pNMHDR, LRESULT *pResult)
{
	int select = m_ctrlTab.GetCurSel();
	m_nCurMenu = select;

	ShowTABWindow();

	*pResult = 0;
}

// Tab shown settings
void CPCSC_Mifare_SampleDlg::ShowTABWindow()
{
	if(m_nCurMenu == TAB_PCSCTEST)
		m_pPCSCTestDlg->ShowWindow(SW_SHOW);
	else
		m_pPCSCTestDlg->ShowWindow(SW_HIDE);


	if(m_nCurMenu == TAB_MifareTEST)
	{
		m_pMifareTestDlg->ShowWindow(SW_SHOW);
	}
	else
		m_pMifareTestDlg->ShowWindow(SW_HIDE);		
		
}

void CPCSC_Mifare_SampleDlg::OnDestroy()
{
	CDialog::OnDestroy();

	if(m_pPCSCTestDlg)
	{
		delete []m_pPCSCTestDlg;
		m_pPCSCTestDlg = NULL;
	}

	if(m_pMifareTestDlg)
	{
		delete []m_pMifareTestDlg;
		m_pMifareTestDlg = NULL;
	}
}

// Set Init ListControl
void CPCSC_Mifare_SampleDlg::SetInitListCtrl()
{
	ListView_SetExtendedListViewStyle(m_ctrlDataList.m_hWnd, LVS_EX_FULLROWSELECT | LVS_EX_GRIDLINES );
	//List Column Add
	m_ctrlDataList.InsertColumn(0, "Index", LVCFMT_CENTER, 60);
	m_ctrlDataList.InsertColumn(1, "Data", LVCFMT_LEFT, 413);
}
//Establishcontext Button Click
void CPCSC_Mifare_SampleDlg::OnBnClickedBtnEstablishcontext()
{
	LONG            lReturn;
	DWORD			dwScope;
	CString			msg;


	dwScope = SCARD_SCOPE_USER;

	// The context handle returned by SCardEstablishContext can be used by database query and management functions.
	lReturn = SCardEstablishContext( dwScope,
									NULL,
									NULL,
								&m_hContext);	

	// if not Succeed
	if ( SCARD_S_SUCCESS != lReturn )
	{
		msg.Format("[ ERR ] : Failed SCardEstablishContext (%s)",p_PMSApp->GetSCARDErrorMsg(lReturn));
		SendList(TRUE, msg);
	}
	else
	{
		GetSCardListReaders();	//Call the GetSCardListReaders();
	}

}

// Get Readers
void CPCSC_Mifare_SampleDlg::GetSCardListReaders()
{
	CString msg;
	LPTSTR          pmszReaders = NULL;
	LPTSTR          pReader;
	LONG            lReturn, lReturn2;
	DWORD           cch = SCARD_AUTOALLOCATE;

	// Retrieve the list the readers.
	// hSC was set by a previous call to SCardEstablishContext.
	m_ctrlReaderList.ResetContent();

	// Returns a list of currently available readers on the system. 
	lReturn = SCardListReaders(m_hContext,
							   NULL,
							   (LPTSTR)&pmszReaders,
							   &cch );
	switch( lReturn )
	{
		case SCARD_E_NO_READERS_AVAILABLE:
			SendList(TRUE, "Reader is not in groups.");
			// Take appropriate action.
			// ...
			break;

		case SCARD_S_SUCCESS:
			// Do something with the multi string of readers.
			// Here, we'll merely output the values.
			// A double-null terminates the list of values.
			pReader = pmszReaders;
			while ( '\0' != *pReader )
			{
				// Display the value.
				// printf("Reader: %S\n", pReader );
				m_ctrlReaderList.AddString(pReader);
				// Advance to the next value.
				pReader = pReader + strlen(pReader) + 1;
			}

			// Releases memory that has been returned from the resource manager using the SCARD_AUTOALLOCATE length designator. 
			lReturn2 = SCardFreeMemory( m_hContext,
									   pmszReaders );
			if ( SCARD_S_SUCCESS != lReturn2 )
			{
				msg.Format("[ ERR ] : Failed SCardFreeMemory (%s)",p_PMSApp->GetSCARDErrorMsg(lReturn2));
				SendList(TRUE, msg);
			}
			break;

	default:
			msg.Format("[ ERR ] : Failed SCardListReaders (%s)",p_PMSApp->GetSCARDErrorMsg(lReturn));
			SendList(TRUE, msg);
			
			// Take appropriate action.
			// ...
			break;
	}

	// Show reader in combo box.
	CString tmp,tmp2;
	tmp2 = "duali";
	int cnt = m_ctrlReaderList.GetCount();
	m_ctrlReaderList.SetCurSel(0);
	for(int i = 0; i < cnt; i++)
	{
		m_ctrlReaderList.GetLBText(i,tmp);
		tmp.MakeLower();
		if(memcmp(tmp,tmp2,5) == 0)
		{
			m_ctrlReaderList.SetCurSel(i);
			break;
		}
	}
}

//Release Context Button Click
void CPCSC_Mifare_SampleDlg::OnBnClickedRealsecontextBtn()
{
	LONG            lReturn;
	CString			msg;

	// Destroys a communication context to the PC/SC Resource Manager. 
	// Parameters : hContext	Connection context to be closed.
	lReturn = SCardReleaseContext(m_hContext);
	if ( SCARD_S_SUCCESS != lReturn )
	{
		msg.Format("[ ERR ] : Failed SCardReleaseContext (%s)",p_PMSApp->GetSCARDErrorMsg(lReturn));
		SendList(TRUE, msg);
	}
	else
		SendList(TRUE, "Successed SCardReleaseContext");
	m_hCardHandle = NULL;
}

// Connect Button Click
void CPCSC_Mifare_SampleDlg::OnBnClickedConnectBtn()
{
	LONG            lReturn;
	DWORD           dwAP,dwShareMode,dwPreferredProtocols;
	CString         szReader,msg;  
	int idx;
	
	idx = m_ctrlShareMode.GetCurSel();
	if(idx == 0)
		dwShareMode = SCARD_SHARE_SHARED;
	if(idx == 1)
		dwShareMode = SCARD_SHARE_EXCLUSIVE;
	if(idx == 2)
		dwShareMode = SCARD_SHARE_DIRECT;

	idx = m_ctrlProtocol.GetCurSel();
	if(idx == 0)
		dwPreferredProtocols = SCARD_PROTOCOL_T0 | SCARD_PROTOCOL_T1;
	if(idx == 1)
		dwPreferredProtocols = SCARD_PROTOCOL_T0;
	if(idx == 2)
		dwPreferredProtocols = SCARD_PROTOCOL_T1;
	if(idx == 3)
		dwPreferredProtocols = SCARD_PROTOCOL_UNDEFINED;

	//Get the name of the reader
	m_ctrlReaderList.GetWindowText(szReader);
	//szReader = "Rainbow Technologies SCR3531 0";

	if(szReader == "")
	{
		AfxMessageBox("There is no selected PC/SC Reader");
		m_CNSuccess = FALSE;
		return;
	}

	// SCardConnect is a smart card and reader access function.
	lReturn = SCardConnect( m_hContext, 
					(LPCTSTR)szReader,
						dwShareMode,
						dwPreferredProtocols,
						&m_hCardHandle,
						&dwAP );

	if ( SCARD_S_SUCCESS != lReturn )
	{
		int a  = GetLastError();
		msg.Format("[ ERR ] : Failed SCardConnect (%s)",p_PMSApp->GetSCARDErrorMsg(lReturn));
		SendList(TRUE, msg);
		m_CNSuccess = FALSE;
		return;  // Or other appropriate action.
	}

	// Use the connection; here we will merely display the
	// active protocol.
	switch ( dwAP )
	{
		case SCARD_PROTOCOL_T0:
			m_pPCSCTestDlg->m_ctrlIOSendPCI.SetCurSel(0);
			m_pIOrequest = SCARD_PCI_T0;
			m_ctrlActiveProto.SetWindowText("Active protocol T0"); 
			break;

		case SCARD_PROTOCOL_T1:
			m_pPCSCTestDlg->m_ctrlIOSendPCI.SetCurSel(1);
			m_pIOrequest = SCARD_PCI_T1;
			m_ctrlActiveProto.SetWindowText("Active protocol T1"); 
			break;

		case SCARD_PROTOCOL_UNDEFINED:
		default:
			m_pIOrequest = NULL;
			SendList(TRUE,"Active protocol unnegotiated or unknown");
			break;
	}
	GetStatus();
	m_CNSuccess = TRUE;
	// Remember to disconnect (by calling SCardDisconnect).
	// ...	
}

//DisConnect Button Click
void CPCSC_Mifare_SampleDlg::OnBnClickedDisconnectBtn()
{
	LONG  lReturn;
	DWORD dwDisposition;
	CString msg;

	dwDisposition = SCARD_LEAVE_CARD;

	// Terminates a connection made through SCardConnect(). 
	lReturn = SCardDisconnect(m_hCardHandle, 
                          SCARD_LEAVE_CARD);

	if ( SCARD_S_SUCCESS != lReturn )
	{
		msg.Format("[ ERR ] : Failed SCardDisconnect (%s)",p_PMSApp->GetSCARDErrorMsg(lReturn));
		SendList(TRUE, msg); 
	}
	else
		SendList(TRUE, "Successed SCardDisconnect");

	m_hCardHandle = NULL;	
	m_CNSuccess = FALSE;
}

// ListControl print
void CPCSC_Mifare_SampleDlg::SendList(BOOL bSend, CString data)
{
	CString msg;
	if(bSend)
		msg = "=>";
	else
		msg = "<=";

	msg += data;

	int n = m_ctrlDataList.GetItemCount();

	m_ctrlDataList.AddArgItem(n, 0, "%d", n+1);
	m_ctrlDataList.AddItem((LPSTR)(LPCSTR)msg, n, 1);
	m_ctrlDataList.EnsureVisible(n, TRUE);
}

//ComboBox control value Setting
void CPCSC_Mifare_SampleDlg::MakeCombo()
{	
	m_ctrlShareMode.AddString("SCARD_SHARE_SHARED");
	m_ctrlShareMode.AddString("SCARD_SHARE_EXCLUSIVE");
	m_ctrlShareMode.AddString("SCARD_SHARE_DIRECT");
	m_ctrlShareMode.SetCurSel(0);

	m_ctrlProtocol.AddString("PROTOCOL_T0 or PROTOCOL_T1");
	m_ctrlProtocol.AddString("SCARD_PROTOCOL_T0");
	m_ctrlProtocol.AddString("SCARD_PROTOCOL_T1");	
	m_ctrlProtocol.AddString("SCARD_PROTOCOL_UNDEFINED");
	m_ctrlProtocol.SetCurSel(0);
}

//Gets the status of the SCard
void CPCSC_Mifare_SampleDlg::GetStatus()
{
	DWORD           cch = 200;
	BYTE            bAttr[32],szReader[200];
	DWORD           cByte = 32;
	DWORD           dwState, dwProtocol;
	LONG            lReturn;	
	CString         msg,msg2;    
	int i = 0;

	// Determine the status.
	// hCardHandle was set by an earlier call to SCardConnect.
	lReturn = SCardStatus(m_hCardHandle,
						  (LPTSTR)&szReader,
						  &cch,
						  &dwState,
						  &dwProtocol,
						  (LPBYTE)&bAttr,
						  &cByte); 

		if (SCARD_S_SUCCESS != lReturn )
	{
		msg.Format("[ ERR ] : Failed SCardStatus (%s)",p_PMSApp->GetSCARDErrorMsg(lReturn));
		SendList(TRUE, msg);
		return ;     // or other appropriate action
	}

	// Examine retrieved status elements.
	// Look at the reader name and card state.	
	switch ( dwState )
	{
		case SCARD_ABSENT:
			SendList(TRUE, "[INFO] : Card absent.");
			break;
		case SCARD_PRESENT:			
			SendList(TRUE, "[INFO] : Card present.");
			break;			
		case SCARD_SWALLOWED:
			SendList(TRUE,"[INFO] : Card swallowed.");
			break;
		case SCARD_POWERED:
			SendList(TRUE,"[INFO] : Card has power.");
			break;
		case SCARD_NEGOTIABLE:
			SendList(TRUE,"[INFO] : Card reset and waiting PTS negotiation.");
			break;
		case SCARD_SPECIFIC:
			SendList(TRUE, "[INFO] : Card has specific communication protocols set.");
			break;
		default:
			SendList(TRUE, "[INFO] : Unknown or unexpected card state.");
			break;
	}

	// Look at the card protocol.
	switch ( dwProtocol )
	{
		case SCARD_PROTOCOL_RAW :
			SendList(TRUE, "[INFO] : SCARD_PROTOCOL_RAW protocols");
		break;
		case SCARD_PROTOCOL_T0 :
			SendList(TRUE, "[INFO] : SCARD_PROTOCOL_T0 protocols");
		break;
		case SCARD_PROTOCOL_T1 :
			SendList(TRUE, "[INFO] : SCARD_PROTOCOL_T1 protocols");
		break;
		default:
			SendList(TRUE, "[INFO] : Unknown or unexpected protocols");
			break;
	}
	
	// After connecting ATR information prints.
	if(cByte != 0)
	{
		msg = "[ ATR ] : ";
		for(i = 0; i < (int)cByte; i++)
		{
			msg2.Format("%02X",bAttr[i]);
			msg += msg2;
		}
		SendList(TRUE, msg);	
	}
}

//Changed Protocol ComboBox
void CPCSC_Mifare_SampleDlg::OnSelchangeComboProtocol() 
{
	int idx = m_ctrlProtocol.GetCurSel();	
	if(idx == 2)
		m_pPCSCTestDlg->m_ctrlIOSendPCI.SetCurSel(1);
	else
		m_pPCSCTestDlg->m_ctrlIOSendPCI.SetCurSel(0);
}

// Function to transmit APDU Command
// data : APDU Command, pbRecv : The data being returned, dwRecv : Size of the returned data, ioctlcode : SCARD_E_NO_READERS_AVAILABLE, usemsgbox : usemsgbox 
bool CPCSC_Mifare_SampleDlg::TransData(CString data,BYTE *pbRecv,DWORD *dwRecv,DWORD ioctlcode,bool usemsgbox)
{
	CString tmp;
	int len,len2;
	LONG            lReturn;
	BYTE	*pbSend;
			
	len = data.GetLength();
	len2 = len % 2;
	len = len/2;
	
	pbSend = new BYTE[len];
	memset(pbSend,0x00,len);
	p_PMSApp->STRING2HEX(data, pbSend);
	
	if(ioctlcode == 0)
	{
		// Sends an APDU to the smart card contained in the reader connected to by SCardConnect(). 
		lReturn = SCardTransmit(m_hCardHandle,
								m_pIOrequest,
								pbSend,
								len,
								NULL,
								pbRecv,
								dwRecv );
	}
	else
	{	// Sends a command directly to the IFD Handler (reader driver) to be processed by the reader. 
		lReturn = SCardControl(m_hCardHandle,
							SCARD_CTL_CODE(ioctlcode),
							pbSend,
							len,
							pbRecv,
							255,
							dwRecv);
	}

	if ( SCARD_S_SUCCESS != lReturn )
	{
		tmp.Format("[ ERR ] : Failed TransData (%s)",p_PMSApp->GetSCARDErrorMsg(lReturn));	
		AfxMessageBox(tmp);
		return false;
	}
		
	delete []pbSend;
	return true;
}

// The function prints the information in ListBox control
void CPCSC_Mifare_SampleDlg::SendList(int bSend, int nLen, BYTE *pData,BYTE cmd)
{
	int		n,npre;
	BYTE	pBuf[1024];
	CString msg;

	memset(pBuf, 0x00, sizeof(pBuf));

	npre = 2;		
	if(cmd == 0x00)
		memcpy(pBuf,pData,nLen);
	else
	{
		pBuf[0] = cmd;
		memcpy(pBuf+1,pData,nLen);
		nLen += 1;
	}
	p_PMSApp->HEX2STRING(pBuf,msg,nLen);
	if(bSend)
	{
		if(bSend == 1)
		{
			msg = "=>" + msg;
			if(bSend == 2)		
				msg = "<=" + msg;
		}
		else
		{
			msg.Format("=>CONTROL Command");
		}
	}
	else
	{
		msg = "<=" + msg;
	}

	n = m_ctrlDataList.GetItemCount();
	if(n > 1000)
	{
		m_ctrlDataList.DeleteAllItems();
		n = 0;
	}
	m_ctrlDataList.AddArgItem(n, 0, "%d", n+1);
	m_ctrlDataList.AddItem((LPSTR)(LPCSTR)msg, n, 1);

	m_ctrlDataList.EnsureVisible(n, TRUE);
	//  bSend is TRUE, the data sent, FALSE if the received data
	//	nLen is data length
	//	pData is actual data
}

// 'List Clear' Button Clicked
void CPCSC_Mifare_SampleDlg::OnBnClickedBtnClear()
{
	m_ctrlDataList.DeleteAllItems();	//Delete all List items
}

// 'Text File' Button clicked, Generates a text file that lists the data
void CPCSC_Mifare_SampleDlg::OnBnClickedBtnText()
{
	CWaitCursor c;
	int		i, j, n, nLen, nSize, nAddr;
	char	pText[1024], pBuf[512], pFilePath[128], pData[MAX_LINE+20];
	bool	bSend;
	CTime	time;
	CStdioFile pFile;

	time = CTime::GetCurrentTime();
	memset(pFilePath, 0x00, sizeof(pFilePath));
	sprintf(pFilePath, ".\\Text\\");
	::CreateDirectory(pFilePath, NULL);
	memset(pBuf, 0x00, sizeof(pBuf));
	sprintf(pBuf, "Data(%04d%02d%02d%02d%02d%02d).txt", time.GetYear(), time.GetMonth(), time.GetDay(), time.GetHour(), time.GetMinute(), time.GetSecond());
	strcat(pFilePath, pBuf);

	if(!pFile.Open(pFilePath, CFile::modeCreate | CFile::modeWrite))
	{
		AfxMessageBox("Failed to open file!");
		return;
	}

	n = m_ctrlDataList.GetItemCount();
	if(n <= 0)
	{
		AfxMessageBox("Data is nothing");
		return;
	}

	//List Data Write
	for(i = 0; i < n; i++)
	{
		memset(pText, 0x00, sizeof(pText));
		memset(pBuf, 0x00, sizeof(pBuf));
		m_ctrlDataList.GetItemText(i, 0, pBuf, sizeof(pBuf));
		j = atoi(pBuf);

		sprintf(pText, " %3d ", j);
		memset(pBuf, 0x00, sizeof(pBuf));
		m_ctrlDataList.GetItemText(i, 1, pBuf, sizeof(pBuf));
		if(!memcmp(pBuf, "=>", 2))
			bSend = true;
		else
			bSend = false;
		nLen = (int)strlen(pBuf);
		nAddr = 0;
		while(nLen > 0)
		{
			nSize = nLen;
	
			memset(pData, 0x00, sizeof(pData));
			memcpy(pData, pBuf+nAddr, nSize);

			strcat(pText, pData);
			strcat(pText, "\r\n");
			pFile.WriteString(pText);
			nLen -= nSize;	
			nAddr += nSize;
		}
		if(!bSend)
			pFile.WriteString("\n");
	}
	pFile.Flush();
	pFile.Close();
	::ShellExecute(NULL, "open", "notepad.exe", pFilePath, NULL, SW_SHOWNOACTIVATE);
}

// Main list allows to change the color of text when printing.
void CPCSC_Mifare_SampleDlg::OnNMCustomdrawListData(NMHDR *pNMHDR, LRESULT *pResult)
{
	NMLVCUSTOMDRAW* pLVCD = reinterpret_cast<NMLVCUSTOMDRAW*>( pNMHDR );

	CListCtrlEx* pList3 = (CListCtrlEx*)GetDlgItem(IDC_LIST_DATA);

	*pResult = 0;

	if ( CDDS_PREPAINT == pLVCD->nmcd.dwDrawStage)
	{
		*pResult = CDRF_NOTIFYITEMDRAW;
	}
	else if ( CDDS_ITEMPREPAINT == pLVCD->nmcd.dwDrawStage )
	{
		CString strCmp,strtemp;
		
		strCmp = pList3->GetItemText((int)pLVCD->nmcd.dwItemSpec, 1);

		if(strCmp.Find("<=") >= 0)
		{
			if(strCmp.Find('(') >= 0)
				pLVCD->clrText   = RGB(255, 0, 0);	// Red Text Color
			else
				pLVCD->clrText   = RGB(10, 140, 240);	//Blue Text Color
		}

		if(strCmp.Find("[ ERR ]") >= 0)
		{
			pLVCD->clrText   = RGB(255, 0, 0);	//Red Text Color
		}
		
		if((pLVCD->nmcd.dwItemSpec % 2) == 0)
		{
			pLVCD->clrTextBk = RGB(230,230,230);	// Gray background color
		}
		else
		{    
			pLVCD->clrTextBk = RGB(255, 255, 255);	// White background color
		}

		*pResult = CDRF_DODEFAULT;
	}
}