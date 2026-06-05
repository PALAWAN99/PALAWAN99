// PCSCDlg.cpp : implementation file
//

#include "stdafx.h"
#include "PCSC.h"
#include "PCSCDlg.h"

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
// CPCSCDlg dialog

CPCSCDlg::CPCSCDlg(CWnd* pParent /*=NULL*/)
	: CDialog(CPCSCDlg::IDD, pParent)
{
	//{{AFX_DATA_INIT(CPCSCDlg)
		// NOTE: the ClassWizard will add member initialization here
	//}}AFX_DATA_INIT
	// Note that LoadIcon does not require a subsequent DestroyIcon in Win32
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
}

void CPCSCDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	//{{AFX_DATA_MAP(CPCSCDlg)
	DDX_Control(pDX, IDC_COMBO_SAMID, m_ctrlSAMID);
	DDX_Control(pDX, IDC_COMBO_COM2, m_ctrlControlCodeSAMStatus);
	DDX_Control(pDX, IDC_EDIT_APDU_SAM, m_ctrlCTRLAPDU);
	DDX_Control(pDX, IDC_EDIT1, m_ctrlDataLen);
	DDX_Control(pDX, IDC_COMBO_SENDPCI, m_ctrlIOSendPCI);
	DDX_Control(pDX, IDC_COMBO_Disposition_C, m_ctrlDispositionC);
	DDX_Control(pDX, IDC_COMBO_Disposition_T, m_ctrlDispositionT);
	DDX_Control(pDX, IDC_EDIT_ACTIVE_PROTO, m_ctrlActiveProto);
	DDX_Control(pDX, IDC_COMBO_PROTOCOL, m_ctrlProtocol);
	DDX_Control(pDX, IDC_COMBO_SHARE_MODE, m_ctrlShareMode);
	DDX_Control(pDX, IDC_COMBO_SCOPE_CON, m_ctrlScopeContext);
	DDX_Control(pDX, IDC_COMBO_COM, m_ctrlComList);
	DDX_Control(pDX, IDC_EDIT_APDU, m_ctrlAPDU);
	DDX_Control(pDX, IDC_COMBO_READER, m_ctrlReaderList);
	DDX_Control(pDX, IDC_LIST_DATA, m_ctrlList);
	//}}AFX_DATA_MAP
}

BEGIN_MESSAGE_MAP(CPCSCDlg, CDialog)
	//{{AFX_MSG_MAP(CPCSCDlg)
	ON_WM_SYSCOMMAND()
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	ON_BN_CLICKED(IDC_CONNECT_BTN, OnConnectBtn)
	ON_BN_CLICKED(IDC_DISCONNECT_BTN, OnDisconnectBtn)
	ON_BN_CLICKED(IDC_BTN_ESTABLISHCONTEXT, OnBtnEstablishcontext)
	ON_BN_CLICKED(IDC_REALSECONTEXT_BTN, OnRealsecontextBtn)
	ON_BN_CLICKED(IDC_BEGINTRANS, OnBegintrans)
	ON_BN_CLICKED(IDC_ENDTRANS, OnEndtrans)
	ON_BN_CLICKED(IDC_LISTCLEAR, OnListclear)
	ON_BN_CLICKED(IDC_TRANS_BTN, OnTransBtn)
	ON_CBN_SELCHANGE(IDC_COMBO_COM, OnSelchangeComboCom)
	ON_BN_CLICKED(IDC_MAKE_TEXT, OnMakeText)
	ON_CBN_SELCHANGE(IDC_COMBO_PROTOCOL, OnSelchangeComboProtocol)
	ON_BN_CLICKED(IDC_CTRL_BTN, OnCtrlBtn)
	ON_CBN_SELCHANGE(IDC_COMBO_COM2, OnSelchangeComboCom2)
	//}}AFX_MSG_MAP
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CPCSCDlg message handlers

BOOL CPCSCDlg::OnInitDialog()
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

	// Set the icon for this dialog.  The framework does this automatically
	//  when the application's main window is not a dialog
	SetIcon(m_hIcon, TRUE);			// Set big icon
	SetIcon(m_hIcon, FALSE);		// Set small icon
	
	// TODO: Add extra initialization here
	MakeCombo();

	m_ctrlDataLen.SetWindowText("200");
	m_ctrlList.SetHorizontalExtent(1000);

	SetWindowText("DUALi PC/SC Sample");
	m_ctrlCTRLAPDU.EnableWindow(FALSE);
	m_hCardHandle = NULL;
	return TRUE;  // return TRUE  unless you set the focus to a control
}

void CPCSCDlg::OnSysCommand(UINT nID, LPARAM lParam)
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

void CPCSCDlg::OnPaint() 
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

// The system calls this to obtain the cursor to display while the user drags
//  the minimized window.
HCURSOR CPCSCDlg::OnQueryDragIcon()
{
	return (HCURSOR) m_hIcon;
}

void CPCSCDlg::OnConnectBtn() 
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

	m_ctrlReaderList.GetWindowText(szReader);
	//szReader = "Rainbow Technologies SCR3531 0";

	if(szReader == "")
	{
		AfxMessageBox("There is no selected PC/SC Reader");
		return;
	}
	lReturn = SCardConnect( m_hContext, 
					(LPCTSTR)szReader,
						dwShareMode,
						dwPreferredProtocols,
						&m_hCardHandle,
						&dwAP );
	if ( SCARD_S_SUCCESS != lReturn )
	{
		int a  = GetLastError();
		msg.Format("[ ERR ] : Failed SCardConnect (%s)",GetSCARDErrorMsg(lReturn));
		m_ctrlList.AddString(msg);
		return;  // Or other appropriate action.
	}

	// Use the connection; here we will merely display the
	// active protocol.
	switch ( dwAP )
	{
		case SCARD_PROTOCOL_T0:
			m_ctrlIOSendPCI.SetCurSel(0);
			m_ctrlActiveProto.SetWindowText("Active protocol T0"); 
			break;

		case SCARD_PROTOCOL_T1:
			m_ctrlIOSendPCI.SetCurSel(1);
			m_ctrlActiveProto.SetWindowText("Active protocol T1"); 
			break;

		case SCARD_PROTOCOL_UNDEFINED:
		default:
			m_ctrlList.AddString("Active protocol unnegotiated or unknown"); 
			break;
	}
	GetStatus();
	// Remember to disconnect (by calling SCardDisconnect).
	// ...	
}

void CPCSCDlg::OnDisconnectBtn() 
{
	LONG  lReturn;
	DWORD dwDisposition;
	CString msg;

	int idx = m_ctrlDispositionC.GetCurSel();
	if(idx == 0)
		dwDisposition = SCARD_LEAVE_CARD;
	if(idx == 1)
		dwDisposition = SCARD_RESET_CARD;
	if(idx == 2)
		dwDisposition = SCARD_UNPOWER_CARD;
	if(idx == 3)
		dwDisposition = SCARD_EJECT_CARD;

	lReturn = SCardDisconnect(m_hCardHandle, 
                          SCARD_LEAVE_CARD);
	if ( SCARD_S_SUCCESS != lReturn )
	{
		msg.Format("[ ERR ] : Failed SCardDisconnect (%s)",GetSCARDErrorMsg(lReturn));
		m_ctrlList.AddString(msg);
	}
	else
		m_ctrlList.AddString("Successed SCardDisconnect");

	m_hCardHandle = NULL;		
			
}

void CPCSCDlg::GetSCardListReaders()
{
	CString msg;
	LPTSTR          pmszReaders = NULL;
	LPTSTR          pReader;
	LONG            lReturn, lReturn2;
	DWORD           cch = SCARD_AUTOALLOCATE;

	// Retrieve the list the readers.
	// hSC was set by a previous call to SCardEstablishContext.
	m_ctrlReaderList.ResetContent();

	lReturn = SCardListReaders(m_hContext,
							   NULL,
							   (LPTSTR)&pmszReaders,
							   &cch );
	switch( lReturn )
	{
		case SCARD_E_NO_READERS_AVAILABLE:
			m_ctrlList.AddString("Reader is not in groups.");
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
				//printf("Reader: %S\n", pReader );
				m_ctrlReaderList.AddString(pReader);
				// Advance to the next value.
				pReader = pReader + strlen(pReader) + 1;
			}
			// Free the memory.
			lReturn2 = SCardFreeMemory( m_hContext,
									   pmszReaders );
			if ( SCARD_S_SUCCESS != lReturn2 )
			{
				msg.Format("[ ERR ] : Failed SCardFreeMemory (%s)",GetSCARDErrorMsg(lReturn2));
				m_ctrlList.AddString(msg);
			}
			break;

	default:
			msg.Format("[ ERR ] : Failed SCardListReaders (%s)",GetSCARDErrorMsg(lReturn));
			m_ctrlList.AddString(msg);
			
			// Take appropriate action.
			// ...
			break;
	}

	CString tmp,tmp2;
	tmp2 = "Duali";
	int cnt = m_ctrlReaderList.GetCount();
	m_ctrlReaderList.SetCurSel(0);
	for(int i = 0; i < cnt; i++)
	{
		m_ctrlReaderList.GetLBText(i,tmp);
		if(memcmp(tmp,tmp2,5) == 0)
		{
			m_ctrlReaderList.SetCurSel(i);
			break;
		}
	}
}
/*
#include <windows.h> 

BOOL CALLBACK EnumTopWindow(HWND hwnd, LPARAM lParam) 
{ 
    DWORD   dwStyle; 

    dwStyle = GetWindowLong(hwnd, GWL_STYLE); 

    if((dwStyle & WS_VISIBLE) == WS_VISIBLE && (dwStyle & WS_CAPTION) == WS_CAPTION) 
    { 
        if(GetParent(hwnd) == NULL) 
        { 
            TCHAR   szWindowName[MAX_PATH] = {0}; 

            GetWindowText(hwnd, szWindowName, sizeof szWindowName); 
            printf("window %x, %s\n", hwnd, szWindowName); 
        } 
    } 

    return TRUE; 
} 

int main(int argc, char* argv[]) 
{ 
    EnumWindows(EnumTopWindow, 0); 

    return 0; 
} 

*/
void CPCSCDlg::OnBtnEstablishcontext() 
{
	LONG            lReturn;
	DWORD			dwScope;
	CString			msg;

	int idx = m_ctrlScopeContext.GetCurSel();
	if(idx == 0)
		dwScope = SCARD_SCOPE_USER;
	else
		dwScope = SCARD_SCOPE_SYSTEM;

	lReturn = SCardEstablishContext( dwScope,
									NULL,
									NULL,
								&m_hContext);
	if ( SCARD_S_SUCCESS != lReturn )
	{
		msg.Format("[ ERR ] : Failed SCardEstablishContext (%s)",GetSCARDErrorMsg(lReturn));
		m_ctrlList.AddString(msg);
	}
	else
	{
		//m_ctrlList.AddString("Successed SCardEstablishContext");
		GetSCardListReaders();	
	}

	//CWnd *pwnd = GetActiveWindow();
	//::SendMessage(pwnd->m_hWnd,WM_SETTEXT,0,LPARAM("TEST"));
}

void CPCSCDlg::OnRealsecontextBtn() 
{
	LONG            lReturn;
	CString			msg;

	lReturn = SCardReleaseContext(m_hContext);
	if ( SCARD_S_SUCCESS != lReturn )
	{
		msg.Format("[ ERR ] : Failed SCardReleaseContext (%s)",GetSCARDErrorMsg(lReturn));
		m_ctrlList.AddString(msg);
	}
	else
		m_ctrlList.AddString("Successed SCardReleaseContext");	
	m_hCardHandle = NULL;
}

void CPCSCDlg::OnBegintrans() 
{
	LONG            lReturn;
	CString		msg;

	lReturn = SCardBeginTransaction(m_hCardHandle);
	if ( SCARD_S_SUCCESS != lReturn )
	{
		msg.Format("[ ERR ] : Failed SCardBeginTransaction (%s)",GetSCARDErrorMsg(lReturn));
		m_ctrlList.AddString(msg);
	}
	else
		m_ctrlList.AddString("Successed SCardBeginTransaction");	
}

void CPCSCDlg::OnEndtrans() 
{
	LONG  lReturn;
	DWORD dwDisposition;
	CString msg;

	int idx = m_ctrlDispositionT.GetCurSel();
	if(idx == 0)
		dwDisposition = SCARD_LEAVE_CARD;
	if(idx == 1)
		dwDisposition = SCARD_RESET_CARD;
	if(idx == 2)
		dwDisposition = SCARD_UNPOWER_CARD;
	if(idx == 3)
		dwDisposition = SCARD_EJECT_CARD;
	
	lReturn = SCardEndTransaction(m_hCardHandle, 
                              dwDisposition);
	if ( SCARD_S_SUCCESS != lReturn )
	{
		msg.Format("[ ERR ] : Failed SCardEndTransaction (%s)",GetSCARDErrorMsg(lReturn));
		m_ctrlList.AddString(msg);
	}
	else
		m_ctrlList.AddString("Successed SCardEndTransaction");
}

void CPCSCDlg::OnListclear() 
{
	m_ctrlList.ResetContent();	
}

/*#define SCARD_CTL_CODE(code) (0x42000000 + (code))
#define SCARD_CTL_CODE(code)        CTL_CODE(FILE_DEVICE_SMARTCARD, \
                                            (code), \
                                            METHOD_BUFFERED, \
                                            FILE_ANY_ACCESS)
#define IOCTL_SMARTCARD_VENDOR_IFD_EXCHANGE     SCARD_CTL_CODE(1)
#define IOCTL_SMARTCARD_VENDOR_VERIFY_PIN       SCARD_CTL_CODE(2)
#define IOCTL_SMARTCARD_VENDOR_MODIFY_PIN       SCARD_CTL_CODE(3)
#define IOCTL_SMARTCARD_VENDOR_TRANSFER_PIN     SCARD_CTL_CODE(4)*/


void CPCSCDlg::OnTransBtn() 
{
	CString msg,tmp,recvdata,csn;
	int len,len2;
	BYTE	pbRecv[1024];
	DWORD	dwRecv = sizeof(pbRecv);
	
	if(m_nCommandIDX == 11)
	{
		//set  normal mode
		msg = "a000000006000000e6020200";
		memset(pbRecv,0x00,1024);
		tmp.Format("[SEND] : %s",msg);
		m_ctrlList.AddString(tmp);	
		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			msg = "<RECV> : ";
			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
			}
			m_ctrlList.AddString(msg);		
		}
		//attention
		msg = "a00000000600000000000000";
		memset(pbRecv,0x00,1024);
		tmp.Format("[SEND] : %s",msg);
		m_ctrlList.AddString(tmp);	
		dwRecv = sizeof(pbRecv);
		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			msg = "<RECV> : ";
			csn = "";
			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
				if(i > 3 && i < 12)
					csn += tmp;
			}
			m_ctrlList.AddString(msg);		
		}
		//authentication1
		msg.Format("a000000016000000e00000%s2923BE84E16CD6AE00",csn);
		memset(pbRecv,0x00,1024);
		tmp.Format("[SEND] : %s",msg);
		m_ctrlList.AddString(tmp);	
		dwRecv = sizeof(pbRecv);
		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			msg = "<RECV> : ";
			recvdata = "";
			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
				if(i > 4 && i < 53)
					recvdata += tmp;
			}
			m_ctrlList.AddString(msg);		
		}
		//authentication2 (Rcr = 1122334455667788)
		msg.Format("A00000004D000000E002%s2923BE84E16CD6AE%s112233445566778800",csn,recvdata);
		memset(pbRecv,0x00,1024);
		tmp.Format("[SEND] : %s",msg);
		m_ctrlList.AddString(tmp);	
		dwRecv = sizeof(pbRecv);
		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			msg = "<RECV> : ";
			recvdata = "";
			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
				if(i > 4 && i < 52)
					recvdata += tmp;
			}
			m_ctrlList.AddString(msg);		
		}
	}
	else
	{
		m_ctrlAPDU.GetWindowText(msg);
		if(msg == "")
		{
			AfxMessageBox("There is  no APDU");
			return ;
		}
		len = msg.GetLength();
		len2 = len % 2;
		if(len2 != 0)
		{
			AfxMessageBox("Wrong command");
			return ;
		}
		
		memset(pbRecv,0x00,1024);
			
		tmp.Format("[SEND] : %s",msg);
		m_ctrlList.AddString(tmp);	

		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			msg = "<RECV> : ";
			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
			}
			m_ctrlList.AddString(msg);		
		}	
	}
}

void CPCSCDlg::STRING2HEX(LPCTSTR str, BYTE *hex)
{
	int i,len;
	char	pBuf[3];
	len = strlen(str);
	if(len%2 != 0)
	{
		strcat((char*)str, "0");
		len++;
	}
	for(i = 0; i < len/2; i++){
		memset(pBuf, 0x00, sizeof(pBuf));
		memcpy(pBuf, str+(i*2), 2);
		hex[i] = ASCII2HEX(pBuf);
	}

}

BYTE CPCSCDlg::ASCII2HEX(CString str)
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

/* inq parameter
¸í·É¾î : 0x1d 0x00
DATA[0] : Max Card Communication Speed : 0(106K), 1(212K), 2(424k), 3(848K)
DATA[1] : Field Strength Resister : 0 ~ 63
DATA[2] : B-TYPE Modulation Resister : 0 ~ 63
DATA[3] : A-TYPE Receive Gain : 1 ~ 3
DATA[4] : B-TYPE Receive Gain : 1 ~ 3
DATA[5] : A-TYPE Receive Threshold : 0~255
DATA[6] : B-TYPE Receive Threshold : 0~255
DATA[7] : Auto communication change  : 0(speed auto change), 1(always at highest (max) speed)
*/
//033F060103596A01
void CPCSCDlg::OnSelchangeComboCom() 
{
	// TODO: Add your control notification handler code here
	CString str,all;
	int len;
	int idx = m_ctrlComList.GetCurSel();
	m_nCommandIDX = idx;
	if(idx == 0)
		m_ctrlAPDU.SetWindowText("");
	else if(idx == 1)
		m_ctrlAPDU.SetWindowText("00a4040007a0000002450001");
	else if(idx == 2)
		m_ctrlAPDU.SetWindowText("0084000010");
	else if(idx == 3)
		m_ctrlAPDU.SetWindowText("00C000001A");
	else if(idx == 4)
	{
		m_ctrlAPDU.SetWindowText("00000000000013");
	}
	else if(idx == 5)
	{
		m_ctrlAPDU.SetWindowText("000200000000050001020304");
	}
	else if(idx == 6)
	{
		all = "00020000000100";
		for(int i = 0; i < 256; i++)
		{
			str.Format("%02X",i);
			all += str;
		}		
		m_ctrlAPDU.SetWindowText(all);
	}
	else if(idx == 7)
	{
		m_ctrlAPDU.SetWindowText("000400000000060001020304050006");
	}
	else if(idx == 8)
	{
		int i;
		all = "000400000001B2";
		for(i = 0; i < 256; i++)
		{
			str.Format("%02X",i);
			all += str;
		}
		for(i = 0; i < (434-256); i++)
		{
			str.Format("%02X",i);
			all += str;
		}
		str.Format("01B2");
		all += str;
		m_ctrlAPDU.SetWindowText(all);
	}
	else if(idx == 9)
	{
		m_ctrlDataLen.GetWindowText(str);
		len = atoi(str);
		all.Format("0000000000%02X%02X",len/256,len%256);
		m_ctrlAPDU.SetWindowText(all);
	}
	else if(idx == 10)
	{
		m_ctrlDataLen.GetWindowText(str);
		len = atoi(str);
		all.Format("0002000000%02X%02X",len/256,len%256);
		for(int i = 0; i < len; i++)
		{
			if(i > 255)
				str.Format("%02X",i-256);
			else
				str.Format("%02X",i);
			all += str;
		}		
		m_ctrlAPDU.SetWindowText(all);
		len = all.GetLength();
	}
	else if(idx == 11)
	{
		m_ctrlAPDU.SetWindowText("");
	}
	else if(idx == 12)
	{
		m_ctrlAPDU.SetWindowText("FD2f000006FFFFFFFFFFFF");
	}
	else if(idx == 13)
	{
		m_ctrlAPDU.SetWindowText("FD3500000101");
	}
	else if(idx == 14)
	{
		m_ctrlAPDU.SetWindowText("FD370000110111223344556677889900112233445566");
	}
}

void CPCSCDlg::MakeCombo()
{
	m_ctrlScopeContext.AddString("SCARD_SCOPE_USER");
	m_ctrlScopeContext.AddString("SCARD_SCOPE_SYSTEM");
	m_ctrlScopeContext.SetCurSel(0);

	m_ctrlComList.AddString("User command");
	m_ctrlComList.AddString("Select DF");
	m_ctrlComList.AddString("Get Challenge");
	m_ctrlComList.AddString("Get Response");
	m_ctrlComList.AddString("Extended Case2");
	m_ctrlComList.AddString("Extended Case3-5");	
	m_ctrlComList.AddString("Extended Case3-256");
	m_ctrlComList.AddString("Extended Case4-6");
	m_ctrlComList.AddString("Extended Case4-434");
	m_ctrlComList.AddString("Extended Case2");
	m_ctrlComList.AddString("Extended Case3");
	m_ctrlComList.AddString("Felica-SAM-Auth");
	m_ctrlComList.AddString("MiFare-Load key(default key)");
	m_ctrlComList.AddString("MiFare-Read block(block number:1)");
	m_ctrlComList.AddString("MiFare-Write block(block number:1)");
	m_ctrlComList.SetCurSel(0);
	m_nCommandIDX = 0;

	m_ctrlShareMode.AddString("SCARD_SHARE_SHARED");
	m_ctrlShareMode.AddString("SCARD_SHARE_EXCLUSIVE");
	m_ctrlShareMode.AddString("SCARD_SHARE_DIRECT");
	m_ctrlShareMode.SetCurSel(0);

	m_ctrlProtocol.AddString("PROTOCOL_T0 or PROTOCOL_T1");
	m_ctrlProtocol.AddString("SCARD_PROTOCOL_T0");
	m_ctrlProtocol.AddString("SCARD_PROTOCOL_T1");	
	m_ctrlProtocol.AddString("SCARD_PROTOCOL_UNDEFINED");
	m_ctrlProtocol.SetCurSel(0);

	m_ctrlDispositionT.AddString("SCARD_LEAVE_CARD");
	m_ctrlDispositionT.AddString("SCARD_RESET_CARD");
	m_ctrlDispositionT.AddString("SCARD_UNPOWER_CARD");
	m_ctrlDispositionT.AddString("SCARD_EJECT_CARD");
	m_ctrlDispositionT.SetCurSel(0);

	m_ctrlDispositionC.AddString("SCARD_LEAVE_CARD");
	m_ctrlDispositionC.AddString("SCARD_RESET_CARD");
	m_ctrlDispositionC.AddString("SCARD_UNPOWER_CARD");
	m_ctrlDispositionC.AddString("SCARD_EJECT_CARD");
	m_ctrlDispositionC.SetCurSel(0);

	m_ctrlIOSendPCI.AddString("SCARD_PCI_T0");
	m_ctrlIOSendPCI.AddString("SCARD_PCI_T1");
	m_ctrlIOSendPCI.AddString("SCARD_PCI_RAW");
	m_ctrlIOSendPCI.SetCurSel(0);

	m_ctrlControlCodeSAMStatus.AddString("SAM_ENABLE");
	m_ctrlControlCodeSAMStatus.AddString("SAM_COMMAND");
	m_ctrlControlCodeSAMStatus.AddString("SAM_DISABLE");
	m_ctrlControlCodeSAMStatus.AddString("CTRL_BUZZER(0:on 1:off)");
	m_ctrlControlCodeSAMStatus.AddString("BYPASS_COMMAND");
	m_ctrlControlCodeSAMStatus.AddString("READ_FLASH");
	m_ctrlControlCodeSAMStatus.AddString("WRITE_FLASH");
	m_ctrlControlCodeSAMStatus.AddString("Get card's information");
	m_ctrlControlCodeSAMStatus.AddString("Get driver version");
	/*m_ctrlControlCodeSAMStatus.AddString("Set Parameter (Max Card Communication Speed:0~3(106K,212K,424k,848K))");
	m_ctrlControlCodeSAMStatus.AddString("Set Parameter (Field Strength Resister:0~3F)");
	m_ctrlControlCodeSAMStatus.AddString("Set Parameter (B-TYPE Modulation Resister:0~3F)");
	m_ctrlControlCodeSAMStatus.AddString("Set Parameter (A-TYPE Receive Gain:1~3)");
	m_ctrlControlCodeSAMStatus.AddString("Set Parameter (B-TYPE Receive Gain:1~3)");
	m_ctrlControlCodeSAMStatus.AddString("Set Parameter (A-TYPE Receive Threshold:0~255)");
	m_ctrlControlCodeSAMStatus.AddString("Set Parameter (B-TYPE Receive Threshold:0~255)");
	m_ctrlControlCodeSAMStatus.AddString("Set Parameter (Max Card Wait Parameter Set:10~14(300ms,600ms,1.2s,2.4s,4.8s)");
	m_ctrlControlCodeSAMStatus.AddString("Get Parameters");*/
	m_ctrlControlCodeSAMStatus.SetCurSel(0);

	m_ctrlSAMID.AddString("0");
	m_ctrlSAMID.AddString("1");
	m_ctrlSAMID.AddString("2");
	m_ctrlSAMID.AddString("3");
	m_ctrlSAMID.SetCurSel(1);
}

void CPCSCDlg::GetStatus()
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
		msg.Format("[ ERR ] : Failed SCardStatus (%s)",GetSCARDErrorMsg(lReturn));
		m_ctrlList.AddString(msg);
		return ;     // or other appropriate action
	}

	// Examine retrieved status elements.
	// Look at the reader name and card state.	
	switch ( dwState )
	{
		case SCARD_ABSENT:
			m_ctrlList.AddString("[INFO] : Card absent.");
			break;
		case SCARD_PRESENT:			
			m_ctrlList.AddString("[INFO] : Card present.");
			break;			
		case SCARD_SWALLOWED:
			m_ctrlList.AddString("[INFO] : Card swallowed.");
			break;
		case SCARD_POWERED:
			m_ctrlList.AddString("[INFO] : Card has power.");
			break;
		case SCARD_NEGOTIABLE:
			m_ctrlList.AddString("[INFO] : Card reset and waiting PTS negotiation.");
			break;
		case SCARD_SPECIFIC:
			m_ctrlList.AddString("[INFO] : Card has specific communication protocols set.");
			break;
		default:
			m_ctrlList.AddString("[INFO] : Unknown or unexpected card state.");
			break;
	}

	switch ( dwProtocol )
	{
		case SCARD_PROTOCOL_RAW :
			m_ctrlList.AddString("[INFO] : SCARD_PROTOCOL_RAW protocols");
		break;
		case SCARD_PROTOCOL_T0 :
			m_ctrlList.AddString("[INFO] : SCARD_PROTOCOL_T0 protocols");
		break;
		case SCARD_PROTOCOL_T1 :
			m_ctrlList.AddString("[INFO] : SCARD_PROTOCOL_T1 protocols");
		break;
		default:
			m_ctrlList.AddString("[INFO] : Unknown or unexpected protocols");
			break;
	}
	

	if(cByte != 0)
	{
		msg = "[ ATR ] : ";
		for(i = 0; i < (int)cByte; i++)
		{
			msg2.Format("%02X",bAttr[i]);
			msg += msg2;
		}
		m_ctrlList.AddString(msg);
	}

	cch= 200;
	lReturn = SCardGetAttrib(m_hCardHandle,SCARD_ATTR_VENDOR_NAME,(LPBYTE)&szReader, &cch); 
}

void CPCSCDlg::OnMakeText() 
{
	CString filename = ".\\data.txt";
	CString msg,all;
	CFileException e;
	int cnt = m_ctrlList.GetCount();

	for(int i = 0; i < cnt; i++)
	{
		m_ctrlList.GetText(i,msg);
		all += msg + "\r\n";
	}
	
	CFile f;
	CFileFind ff;
	if(ff.FindFile(filename))
	{
		f.Remove(filename);
	}

	if( !f.Open( filename, CFile::modeWrite | CFile::shareExclusive | CFile::modeCreate, &e ) )
 	{
 		msg.Format(_T("failed to make File : %d"),e.m_cause);		
		AfxMessageBox(msg);
 		e.Delete();	 		
 		return ;
 	} 	
 	f.Write(all, all.GetLength()); 	

 	f.Close();

	ShellExecute(NULL, "open", filename, NULL, NULL, SW_SHOW); 
}

void CPCSCDlg::OnSelchangeComboProtocol() 
{
	int idx = m_ctrlProtocol.GetCurSel();	
	if(idx == 2)
		m_ctrlIOSendPCI.SetCurSel(1);
	else
		m_ctrlIOSendPCI.SetCurSel(0);
}


void CPCSCDlg::OnCtrlBtn() 
{
	LONG	lReturn;
	DWORD	dwControlCode;
	BYTE in[1024];		//lpInBuffer
	BYTE out[1024];		//lpOutBuffer
	DWORD pLen = 0;		//lpBytesReturned
	CString	msg,temp,temp2,cmd;
	int len,len2,nInLen;

	// TODO:
	m_ctrlCTRLAPDU.GetWindowText(msg);
	len = msg.GetLength();
	len2 = len % 2;
	len = len/2;
	if(len2 != 0)
	{
		AfxMessageBox("Wrong command");
		return ;
	}
	
	cmd = "";	
	int idx = m_ctrlControlCodeSAMStatus.GetCurSel();	
	if(idx == 0)
	{
		cmd = "C0";
		dwControlCode = IOCTL_IC_POWER_ON;
	}
	else if(idx == 1)
	{
		cmd = "C4";
		dwControlCode = IOCTL_IC_COMMAND;
	}
	else if(idx == 2)
	{
		cmd = "C5";
		dwControlCode = IOCTL_IC_POWER_OFF;
	}
	else if(idx == 3)
	{
		cmd = "13";
		dwControlCode = IOCTL_BUZZER;
	}
	else if(idx == 4)
		dwControlCode = IOCTL_BYPASS_COMMAND;
	else if(idx == 5)
		dwControlCode = IOCTL_READ_FLASH;
	else if(idx == 6)
		dwControlCode = IOCTL_WRITE_FLASH;
	else if(idx == 7)
		dwControlCode = IOCTL_GET_CARDINFO;
	else if(idx == 8)
		dwControlCode = IOCTL_GET_DRIVERVER;
	
//	in = new BYTE[len];
	memset(in,0x00,1024);
	memset(out,0x00,1024);
	if(idx >= 3)
	{
		nInLen = msg.GetLength()/2;		
		if(idx == 4)
		{
			in[0] = nInLen/256;
			in[1] = nInLen%256;
			STRING2HEX(msg, in+2);
			nInLen += 2;
			temp2.Format("%02X%02X%s",in[0],in[1],msg);
		}
		else
		{			
			STRING2HEX(msg, in);
			if(idx == 5 || idx == 6)
			{
				if(in[0] > 128 || (in[0]+(nInLen-1)) > 128)
				{
					AfxMessageBox("Memory size is 128 bytes.\nSo¡®offset + data length[N]¡¯ should not exceed 128.");
					return ;
				}
			}
			temp2.Format("%s",msg);
		}
		temp.Format("[SEND] : %s%s",cmd,temp2);
	}
	else
	{
		in[0] = m_ctrlSAMID.GetCurSel();
		STRING2HEX(msg, in+1);
		nInLen = msg.GetLength()/2 + 1;
		temp.Format("[SEND] : %s%02d%s",cmd,in[0],msg);
	}
	if(idx == 8)
	{
		temp.Format("[SEND] : Get driver version");
	}
	m_ctrlList.AddString(temp);
	
	lReturn = SCardControl( m_hCardHandle,
							SCARD_CTL_CODE(dwControlCode),
							in,
							nInLen,
							out,
							255,
							&pLen );
	if( SCARD_S_SUCCESS != lReturn )
	{
		msg.Format("[ ERR ] : Failed SCardControl (%s)",GetSCARDErrorMsg(lReturn));
		m_ctrlList.AddString(msg);
	}
	else
	{
		if(idx == 8)
		{
			msg.Format("<RECV> : %s",out);
		}
		else
		{
			msg = "<RECV> : ";
			for(int i = 0; i < int(pLen); i++)
			{
				temp.Format("%02X",out[i]);
				msg += temp;
			}			
		}
		m_ctrlList.AddString(msg);
	}	
}

bool CPCSCDlg::TransData(CString data,BYTE *pbRecv,DWORD *dwRecv,DWORD ioctlcode,bool usemsgbox)
{
	CString tmp;
	int len,len2;
	LONG            lReturn;
	BYTE	*pbSend;
	const struct _SCARD_IO_REQUEST * iorequest;
		
	len = data.GetLength();
	len2 = len % 2;
	len = len/2;
	
	pbSend = new BYTE[len];
	memset(pbSend,0x00,len);
	STRING2HEX(data, pbSend);
	
	if(ioctlcode == 0)
	{
		int idx = m_ctrlIOSendPCI.GetCurSel();
		if(idx == 0)
			iorequest = SCARD_PCI_T0;
		else if(idx == 1)
			iorequest = SCARD_PCI_T1;
		else
			iorequest = SCARD_PCI_RAW;

		lReturn = SCardTransmit(m_hCardHandle,
								iorequest,
								pbSend,
								len,
								NULL,
								pbRecv,
								dwRecv );
	}
	else
	{
		lReturn = SCardControl( m_hCardHandle,
							SCARD_CTL_CODE(ioctlcode),
							pbSend,
							len,
							pbRecv,
							1024,
							dwRecv);
	}

	if ( SCARD_S_SUCCESS != lReturn )
	{
		tmp.Format("[ ERR ] : Failed TransData (%s)",GetSCARDErrorMsg(lReturn));
		m_ctrlList.AddString(tmp);
		if(usemsgbox)
			AfxMessageBox(tmp);
		return false;
	}
		
	delete []pbSend;
	return true;
}

CString CPCSCDlg::GetSCARDErrorMsg(LONG ret)
{
	CString remsg;
	switch(ret)
	{
	case 0x7A:
		remsg = "Return length Error(check 'dwRecv')";
		break;
	case SCARD_E_CANCELLED:
		remsg = "SCARD_E_CANCELLED";
		break;
	case SCARD_E_CANT_DISPOSE:
		remsg = "SCARD_E_CANT_DISPOSE";
		break;
	case SCARD_E_CARD_UNSUPPORTED:
		remsg = "SCARD_E_CARD_UNSUPPORTED";
		break;
	case SCARD_E_DUPLICATE_READER:
		remsg = "SCARD_E_DUPLICATE_READER";
		break;
	case SCARD_E_INSUFFICIENT_BUFFER:
		remsg = "SCARD_E_INSUFFICIENT_BUFFER";
		break;
	case SCARD_E_INVALID_ATR:
		remsg = "SCARD_E_INVALID_ATR";
		break;
	case SCARD_E_INVALID_HANDLE:
		remsg = "SCARD_E_INVALID_HANDLE";
		break;
	case SCARD_E_INVALID_PARAMETER:
		remsg = "SCARD_E_INVALID_PARAMETER";
		break;
	case SCARD_E_INVALID_TARGET:
		remsg = "SCARD_E_INVALID_TARGET";
		break;
	case SCARD_E_INVALID_VALUE:
		remsg = "SCARD_E_INVALID_VALUE";
		break;
	case SCARD_E_NOT_READY:
		remsg = "SCARD_E_NOT_READY";
		break;
	case SCARD_E_NOT_TRANSACTED:
		remsg = "SCARD_E_NOT_TRANSACTED";
		break;
	case SCARD_E_NO_MEMORY:
		remsg = "SCARD_E_NO_MEMORY";
		break;
	case SCARD_E_NO_SERVICE:
		remsg = "SCARD_E_NO_SERVICE";
		break;
	case SCARD_E_NO_SMARTCARD:
		remsg = "SCARD_E_NO_SMARTCARD";
		break;
	case SCARD_E_PCI_TOO_SMALL:
		remsg = "SCARD_E_PCI_TOO_SMALL";
		break;
	case SCARD_E_PROTO_MISMATCH:
		remsg = "SCARD_E_PROTO_MISMATCH";
		break;
	case SCARD_E_READER_UNAVAILABLE:
		remsg = "SCARD_E_READER_UNAVAILABLE";
		break;
	case SCARD_E_READER_UNSUPPORTED:
		remsg = "SCARD_E_READER_UNSUPPORTED";
		break;
	case SCARD_E_SERVICE_STOPPED:
		remsg = "SCARD_E_SERVICE_STOPPED";
		break;
	case SCARD_E_SHARING_VIOLATION:
		remsg = "SCARD_E_SHARING_VIOLATION";
		break;
	case SCARD_E_SYSTEM_CANCELLED:
		remsg = "SCARD_E_SYSTEM_CANCELLED";
		break;
	case SCARD_E_TIMEOUT:
		remsg = "SCARD_E_TIMEOUT";
		break;
	case SCARD_E_UNKNOWN_CARD:
		remsg = "SCARD_E_UNKNOWN_CARD";
		break;
	case SCARD_E_UNKNOWN_READER:
		remsg = "SCARD_E_UNKNOWN_READER";
		break;
	case _HRESULT_TYPEDEF_(0x8010002FL):
		remsg = "SCARD_E_COMM_DATA_LOST";
		break;
	case SCARD_F_COMM_ERROR:
		remsg = "SCARD_F_COMM_ERROR";
		break;
	case SCARD_F_INTERNAL_ERROR:
		remsg = "SCARD_F_INTERNAL_ERROR";
		break;
	case SCARD_F_UNKNOWN_ERROR:
		remsg = "SCARD_F_UNKNOWN_ERROR";
		break;
	case SCARD_F_WAITED_TOO_LONG:
		remsg = "SCARD_F_WAITED_TOO_LONG";
		break;
	case SCARD_W_REMOVED_CARD:
		remsg = "SCARD_W_REMOVED_CARD";
		break;
	case SCARD_W_RESET_CARD:
		remsg = "SCARD_W_RESET_CARD";
		break;
	case SCARD_W_UNPOWERED_CARD:
		remsg = "SCARD_W_UNPOWERED_CARD";
		break;
	case SCARD_W_UNRESPONSIVE_CARD:
		remsg = "SCARD_W_UNRESPONSIVE_CARD";
		break;
	case SCARD_W_UNSUPPORTED_CARD:
		remsg = "SCARD_W_UNSUPPORTED_CARD";
		break;	
	default:
		remsg.Format("Unkonwn:%X",ret);
		break;
	}
	return remsg;
}

void CPCSCDlg::OnSelchangeComboCom2() 
{
	int idx = m_ctrlControlCodeSAMStatus.GetCurSel();
	m_ctrlCTRLAPDU.EnableWindow(TRUE);
	m_ctrlCTRLAPDU.SetWindowText("");
	if(idx == 0 || idx == 2 || idx == 7)
	{
		m_ctrlCTRLAPDU.EnableWindow(FALSE);
	}
	/*int idx = m_ctrlControlCodeSAMStatus.GetCurSel();

	if(idx == 5)
		m_ctrlCTRLAPDU.SetWindowText("1D0103");
	else if(idx == 6)
		m_ctrlCTRLAPDU.SetWindowText("1D023F");
	else if(idx == 7)
		m_ctrlCTRLAPDU.SetWindowText("1D0307");
	else if(idx == 8)
		m_ctrlCTRLAPDU.SetWindowText("1D0402");
	else if(idx == 9)
		m_ctrlCTRLAPDU.SetWindowText("1D0503");
	else if(idx == 10)
		m_ctrlCTRLAPDU.SetWindowText("1D0659");
	else if(idx == 11)
		m_ctrlCTRLAPDU.SetWindowText("1D076A");
	else if(idx == 12)
		m_ctrlCTRLAPDU.SetWindowText("1D0814");
	else if(idx == 13)
		m_ctrlCTRLAPDU.SetWindowText("1D00");*/
	
}
