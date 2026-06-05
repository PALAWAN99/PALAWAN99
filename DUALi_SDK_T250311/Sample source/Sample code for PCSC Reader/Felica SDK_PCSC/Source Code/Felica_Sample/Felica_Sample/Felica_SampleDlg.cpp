
// Felica_SampleDlg.cpp
//

#include "stdafx.h"
#include "Felica_Sample.h"
#include "Felica_SampleDlg.h"
#include "FelicaMakeBlockList.h"
#include "MutualAuthSamDes2.h"
#include "MutualAuthSamAes1.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif



class CAboutDlg : public CDialog
{
public:
	CAboutDlg();


	enum { IDD = IDD_ABOUTBOX };

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);  


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







CFelica_SampleDlg::CFelica_SampleDlg(CWnd* pParent /*=NULL*/)
	: CDialog(CFelica_SampleDlg::IDD, pParent)
	, m_strSamPos(_T("0"))
	, m_strKey(_T("12341234123412341234123412341234"))
	, m_radio_RWASM_keytype(1)
	, m_bUseRWSAM(TRUE)
	, m_strSystemCode(_T("0018"))
	, m_strTimeSlot(_T("00"))
	, m_strRequestCode(_T("00"))
	, m_strBL(_T(""))
	, m_strData(_T(""))
	, m_strTransData(_T(""))
{
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
	m_FlagScardStatus = 0;
	m_hCardHandle = NULL;
}

void CFelica_SampleDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_COMBO1, m_ctrlPort);
	DDX_Control(pDX, IDC_CONNECT, m_ctrlConnect);
	DDX_Control(pDX, IDC_CONNECT2, m_ctrlDisConnect);
	DDX_Text(pDX, IDC_EDIT1, m_strSamPos);
	DDX_Text(pDX, IDC_EDIT2, m_strKey);
	DDV_MaxChars(pDX, m_strKey, 48);
	DDX_Radio(pDX, IDC_RADIO2, m_radio_RWASM_keytype);
	DDX_Check(pDX, IDC_CHECK1, m_bUseRWSAM);
	DDX_Control(pDX, IDC_LIST1, m_ctrlDataList);
	DDX_Text(pDX, IDC_EDIT3, m_strSystemCode);
	DDX_Text(pDX, IDC_EDIT4, m_strTimeSlot);
	DDX_Text(pDX, IDC_EDIT5, m_strRequestCode);
	DDV_MaxChars(pDX, m_strSystemCode, 4);
	DDV_MaxChars(pDX, m_strTimeSlot, 2);
	DDV_MaxChars(pDX, m_strRequestCode, 2);
	DDX_Text(pDX, IDC_EDIT_BL, m_strBL);
	DDX_Text(pDX, IDC_EDIT11, m_strData);
	DDX_Text(pDX, IDC_EDIT12, m_strTransData);
}

BEGIN_MESSAGE_MAP(CFelica_SampleDlg, CDialog)
	ON_WM_SYSCOMMAND()
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	//}}AFX_MSG_MAP
	ON_BN_CLICKED(IDC_CONNECT, &CFelica_SampleDlg::OnBnClickedConnect)
	ON_BN_CLICKED(IDC_CONNECT2, &CFelica_SampleDlg::OnBnClickedConnect2)
	ON_BN_CLICKED(IDC_CONNECT3, &CFelica_SampleDlg::OnBnClickedConnect3)
	ON_BN_CLICKED(IDC_AUTH_RWSAM, &CFelica_SampleDlg::OnBnClickedAuthRwsam)
	ON_BN_CLICKED(IDC_CLEAR, &CFelica_SampleDlg::OnBnClickedClear)
	ON_BN_CLICKED(IDC_RADIO2, &CFelica_SampleDlg::OnBnClickedRadio2)
	ON_BN_CLICKED(IDC_RADIO1, &CFelica_SampleDlg::OnBnClickedRadio1)
	ON_BN_CLICKED(IDC_POLLING, &CFelica_SampleDlg::OnBnClickedPolling)
	ON_BN_CLICKED(IDC_Make_BLOCKLIST, &CFelica_SampleDlg::OnBnClickedMakeBlocklist)
	ON_BN_CLICKED(IDC_CHECK1, &CFelica_SampleDlg::OnBnClickedCheck1)
	ON_BN_CLICKED(IDC_MUTUAL_AUTH, &CFelica_SampleDlg::OnBnClickedMutualAuth)
	ON_BN_CLICKED(IDC_READ, &CFelica_SampleDlg::OnBnClickedRead)
	ON_BN_CLICKED(IDC_WRITE, &CFelica_SampleDlg::OnBnClickedWrite)
	ON_BN_CLICKED(IDC_FELICA_TRANS, &CFelica_SampleDlg::OnBnClickedFelicaTrans)
END_MESSAGE_MAP()




BOOL CFelica_SampleDlg::OnInitDialog()
{
	CDialog::OnInitDialog();


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


	SetIcon(m_hIcon, TRUE);			
	SetIcon(m_hIcon, FALSE);		



	//Init Status
	PortStatus = CLOSE;
	pcscAutoDetect = CLOSE;
	SetDlgItemText(IDC_EDIT_BL,"8000");



	//Establish Context
	EstablishContext();

	//Init ListControl
	SetInitListCtrl();

	return TRUE;  
}

void CFelica_SampleDlg::OnSysCommand(UINT nID, LPARAM lParam)
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



void CFelica_SampleDlg::OnPaint()
{
	if (IsIconic())
	{
		CPaintDC dc(this); 

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

	
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		
		dc.DrawIcon(x, y, m_hIcon);
	}
	else
	{
		CDialog::OnPaint();
	}
}

HCURSOR CFelica_SampleDlg::OnQueryDragIcon()
{
	return static_cast<HCURSOR>(m_hIcon);
}

/*
description :
This Function is for Establish Context SCARD
variable :none
return : none
*/
void CFelica_SampleDlg::EstablishContext()
{
	LONG            lReturn;
	DWORD			dwScope;
	CString			msg;

	dwScope = SCARD_SCOPE_USER;
	lReturn = SCardEstablishContext( dwScope,
									NULL,
									NULL,
								&m_hContext);
	if ( SCARD_S_SUCCESS != lReturn )
	{
		msg.Format("[ ERR ] : Failed SCardEstablishContext (%s)",GetSCARDErrorMsg(lReturn));
		AfxMessageBox(msg);
	}
	else
	{
		GetSCardListReaders();	
	}
}

/*
description :
This Function is for Error Message with SCARD
variable :none
return : CString, Error message
*/
CString CFelica_SampleDlg::GetSCARDErrorMsg(LONG ret)
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
/*
description :
This Function is for Find to Readers
variable :none
return : none
*/

void CFelica_SampleDlg::GetSCardListReaders()
{
	CString msg;
	LPTSTR          pmszReaders = NULL;
	LPTSTR          pReader;
	LONG            lReturn, lReturn2;
	DWORD           cch = SCARD_AUTOALLOCATE;

	// Retrieve the list the readers.
	// hSC was set by a previous call to SCardEstablishContext.
	m_ctrlPort.ResetContent();

	lReturn = SCardListReaders(m_hContext,
							   NULL,
							   (LPTSTR)&pmszReaders,
							   &cch );
	switch( lReturn )
	{
		case SCARD_E_NO_READERS_AVAILABLE:
			msg.Format("Reader is not in groups.");
			AfxMessageBox(msg);
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
				m_ctrlPort.AddString(pReader);
				// Advance to the next value.
				pReader = pReader + strlen(pReader) + 1;
			}
			// Free the memory.
			lReturn2 = SCardFreeMemory( m_hContext,
									   pmszReaders );
			if ( SCARD_S_SUCCESS != lReturn2 )
			{
				msg.Format("[ ERR ] : Failed SCardFreeMemory (%s)",GetSCARDErrorMsg(lReturn2));
				AfxMessageBox(msg);
			}
			break;

	default:
			msg.Format("[ ERR ] : Failed SCardListReaders (%s)",GetSCARDErrorMsg(lReturn));
			AfxMessageBox(msg);
			
			// Take appropriate action.
			// ...
			break;
	}

	CString tmp,tmp2;
	tmp2 = "Duali";
	int cnt = m_ctrlPort.GetCount();
	m_ctrlPort.SetCurSel(0);
	for(int i = 0; i < cnt; i++)
	{
		m_ctrlPort.GetLBText(i,tmp);
		if(memcmp(tmp,tmp2,5) == 0)
		{
			m_ctrlPort.SetCurSel(i);
			break;
		}
	}
}

/*
description :
This Function is for When push the button "Connect"
variable :none
return : none
*/
void CFelica_SampleDlg::OnBnClickedConnect()
{

	//When push the button "Connect"
	if(OpenPort())
	{
			PortStatus = OPEN;
			m_ctrlDisConnect.EnableWindow(TRUE);
			m_ctrlConnect.EnableWindow(FALSE);
	}
	else
	{
		PortStatus = CLOSE;
	}
}

/*
description :
This Function is for Port Open
variable :none
return : BOOL, Result - Success or Fail 
*/
BOOL CFelica_SampleDlg::OpenPort()
{
	
	LONG            lReturn;
	DWORD           dwAP,dwShareMode,dwPreferredProtocols;
	CString         szReader,msg;  

	
	
	dwShareMode = SCARD_SHARE_SHARED;
	dwPreferredProtocols = SCARD_PROTOCOL_T0 | SCARD_PROTOCOL_T1;


	CString tmp, recvdata,csn;
	BYTE	pbRecv[1024];
	DWORD	dwRecv = sizeof(pbRecv);
	int len=0;

	m_ctrlPort.GetWindowText(szReader);

	if(szReader == "")
	{
		AfxMessageBox("There is no selected PC/SC Reader");
		return FALSE;
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
		AfxMessageBox(msg);
		return FALSE;  // Or other appropriate action.
	}

	
	// Use the connection; here we will merely display the
	// active protocol.
	switch ( dwAP )
	{
		case SCARD_PROTOCOL_T0:
			m_FlagScardStatus = IOSENDPCI_T0;
			break;

		case SCARD_PROTOCOL_T1:
			m_FlagScardStatus = IOSENDPCI_T1;
			break;

		case SCARD_PROTOCOL_UNDEFINED:
		default:
			break;
	}


	//ON OFF DETECT
	//Auto Detect Off, pcsc Device's Card Auto Detect OFF 
	if(pcscAutoDetect == CLOSE)
	{
		
		//POLLING CMD for TransParent CMD
		msg.Format("FE81FEFE01FF");//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH + OFF CMD
		SendList(TRUE, msg);
		//SEND DATA
		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			if(pbRecv[0] == 0x00) //success
			{
				msg.Format("");
				pcscAutoDetect = OPEN;
			}
			else
			{
				msg.Format("(ERROR : Failed Auto Polling Off)");
				ClosePort();
			}
			
			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
			}

			SendList(FALSE, msg);
		}
	}

	return TRUE;
}

/*
description :
This Function is for Port Close
variable :none
return : BOOL, Result - Success or Fail 
*/
BOOL CFelica_SampleDlg::ClosePort()
{
	LONG  lReturn;
	DWORD dwDisposition;
	CString msg;	
	CString tmp, recvdata,csn;
	BYTE	pbRecv[1024];
	DWORD	dwRecv = sizeof(pbRecv);
	int len=0;

	//ON OFF DETECT
	//Auto Detect Off, pcsc Device's Card Auto Detect ON 
	if(pcscAutoDetect == OPEN)
	{
		//POLLING CMD for TransParent CMD
		msg.Format("FE81FEFE0100");//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH + ON CMD
		SendList(TRUE, msg);
		//SEND DATA
		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			if(pbRecv[0] == 0x00) //success
			{
				msg.Format("");
				pcscAutoDetect = CLOSE;
			}
			else
			{
				msg.Format("(ERROR : Failed Auto Polling On)");
			}
			
			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
			}

			SendList(FALSE, msg);
		}
	}

	dwDisposition = SCARD_LEAVE_CARD;
	

	lReturn = SCardDisconnect(m_hCardHandle, 
                          SCARD_LEAVE_CARD);
	if ( SCARD_S_SUCCESS != lReturn )
	{
		msg.Format("[ ERR ] : Failed SCardDisconnect (%s)",GetSCARDErrorMsg(lReturn));
		AfxMessageBox(msg);
		return FALSE;
	}

	

	m_hCardHandle = NULL;
	
	return TRUE;
}

/*
description :
This Function is for When push the button "DisConnect"
variable :none
return : none
*/
void CFelica_SampleDlg::OnBnClickedConnect2()
{
	
	//When push the button "DisConnect"
	if(ClosePort())
	{
			PortStatus = CLOSE;
			m_ctrlConnect.EnableWindow(TRUE);
			m_ctrlDisConnect.EnableWindow(FALSE);
	}
	
}

/*
description :
This Function is for When push the button "Reflash"
variable :none
return : none
*/
void CFelica_SampleDlg::OnBnClickedConnect3()
{
	//Reflash and Establish New Context
	EstablishContext();
}

/*
description :
This Function is for When push the button "Ahthenticate RWSAM". Ahthenticate RWSAM
variable :none
return : none
*/
void CFelica_SampleDlg::OnBnClickedAuthRwsam()
{
	UpdateData();

	int samPos = 0;
	int outlen = 0;

	CString msg,tmp,recvdata,csn;
	BYTE	pbRecv[1024];
	DWORD	dwRecv = sizeof(pbRecv);


	if(m_strSamPos.GetLength() < 1 || m_strSamPos.GetLength() > 2)
	{
		{
			AfxMessageBox("Please check SAM position");
			return;
		}
	}
	//DES Type
	if(m_radio_RWASM_keytype==0)
	{
		if(m_strKey.GetLength()!=48)
		{
			AfxMessageBox("Please check DES Key(24Bytes)");//The Key must be 24bytes.
			return;
		}
		
		msg.Format("FE5AFEFE1B");//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH

		msg += "00"; //MUTUALAUTH DES 

		samPos = atoi(m_strSamPos);
		tmp.Format("%02X", samPos);
		msg += tmp; //SAMPOS

		msg += "01"; //Authentication for encrypted communication
		msg += m_strKey;

		msg.MakeUpper();
		SendList(TRUE, msg);

		//SEND DATA
		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			if(pbRecv[0] == 0x00)//success
				msg.Format("");
			else
				msg.Format("(ERROR)");
			

			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
			}

			SendList(FALSE, msg);
		}

	
	}
	else//AES Type
	{
		if(m_strKey.GetLength()!=32)
		{
			AfxMessageBox("Please check AES Key(16Bytes)");//The Key must be 16bytes.
			return;
		}

		msg.Format("FE5AFEFE13");//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH

		msg += "01"; //MUTUALAUTH AES 

		samPos = atoi(m_strSamPos);
		tmp.Format("%02X", samPos);
		msg += tmp; //SAMPOS

		msg += "01"; //Authentication for encrypted communication
		msg += m_strKey;

		msg.MakeUpper();
		SendList(TRUE, msg);

		//SEND DATA
		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			if(pbRecv[0] == 0x00)//success
				msg.Format("");
			else
				msg.Format("(ERROR)");
			

			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
			}

			SendList(FALSE, msg);
		}

	}
}

/*
description :
Show The List Control
variable :
bSend - Flag for checking send or receive. and depens on length.
        1 : "=>"
		2 : "<="
		3 : "=>  "
nLen - Data length.
pData - Data to show in the List Control
return : none
*/
void CFelica_SampleDlg::SendList(int bSend, int nLen, BYTE *pData)
{
	int		i, n,npre;
	BYTE	c, pBuf[1024];


	memset(pBuf, 0x00, sizeof(pBuf));

	npre = 2;
	if(bSend)
	{
		memcpy(pBuf, "=>", 2);
		if(bSend == 2)
		{
			memcpy(pBuf, "<=  ", 4);
			npre = 4;
		}
		else if(bSend == 3)
		{
			memcpy(pBuf, "=>  ", 4);
			npre = 4;
		}
	}
	else
	{
		memcpy(pBuf, "<=", 2);
	}
	for(i = 0; i < nLen; i++)
	{
		c = pData[i];
		c >>= 4;
		if(c < 0x0a)
			pBuf[i*2+npre] = c+0x30;
		else
			pBuf[i*2+npre] = c+0x37;
		c = pData[i]&0x0f;
		if(c < 0x0a)
			pBuf[i*2+npre+1] = c+0x30;
		else
			pBuf[i*2+npre+1] = c+0x37;
	}
	n = m_ctrlDataList.GetItemCount();
	if(n > 1000)
	{
		m_ctrlDataList.DeleteAllItems();
		n = 0;
	}
	m_ctrlDataList.AddArgItem(n, 0, "%d", n+1);
	m_ctrlDataList.AddItem((char*)pBuf, n, 1);

	m_ctrlDataList.EnsureVisible(m_ctrlDataList.GetItemCount()-1, TRUE);

}

/*
description :
Show The List Control
variable :
bSend - Flag for checking send or receive
        true : Send Flag
		false : Receive Flag
data - Data to show in the List Control
return : none
*/
void CFelica_SampleDlg::SendList(BOOL bSend, CString data)
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
	m_ctrlDataList.EnsureVisible(m_ctrlDataList.GetItemCount()-1, TRUE);
}

/*
description :
Init The List Control
variable :none
return : none
*/
void CFelica_SampleDlg::SetInitListCtrl()
{
	ListView_SetExtendedListViewStyle(m_ctrlDataList.m_hWnd, LVS_EX_FULLROWSELECT | LVS_EX_GRIDLINES );
	m_ctrlDataList.InsertColumn(0, "IDX", LVCFMT_CENTER, 50);
	m_ctrlDataList.InsertColumn(1, "Data", LVCFMT_LEFT, 440);
}

/*
description :
This Function is for When push the button "Clear". Clear the List Control
variable :none
return : none
*/
void CFelica_SampleDlg::OnBnClickedClear()
{
	m_ctrlDataList.DeleteAllItems();
}

/*
description :
This Function is for When push the Radio button "DES". The Option change for "DES" 
variable :none
return : none
*/
void CFelica_SampleDlg::OnBnClickedRadio2()
{
	m_strKey = "123412341234123412341234123412341234123412341234";
	SetDlgItemText(IDC_EDIT2,m_strKey);	
	m_radio_RWASM_keytype = 0;
}

/*
description :
This Function is for When push the Radio button "AES". The Option change for "AES" 
variable :none
return : none
*/
void CFelica_SampleDlg::OnBnClickedRadio1()
{
	m_strKey = "12341234123412341234123412341234";
	SetDlgItemText(IDC_EDIT2,m_strKey);	
	m_radio_RWASM_keytype = 1;
}
/*
description :
When Push the Button "Polling", for Polling 
variable : none
return : none
*/
void CFelica_SampleDlg::OnBnClickedPolling()
{
	int outlen = 0;

	UpdateData();

	CString str, strRCmd, strRcv, txCmd, txData;

	CString msg,tmp,recvdata,csn;
	BYTE	pbRecv[1024];
	DWORD	dwRecv = sizeof(pbRecv);


	if(m_strSystemCode.GetLength() != 4)
	{
		AfxMessageBox("Please check System Code");
		return ;
	}

	if(!IsDlgButtonChecked(IDC_CHECK1))//polling without sam
	{
		if(m_strTimeSlot.GetLength() != 2)
		{
			AfxMessageBox("Please check Time slot");
			return ;
		}

		if(m_strRequestCode.GetLength() != 2)
		{
			AfxMessageBox("Please check Request code");
			return ;
		}
		
		//POLLING CMD for TransParent CMD
		msg.Format("FE5BFEFE05");//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH

		tmp.Format("00%s%s%s", m_strSystemCode,m_strTimeSlot,m_strRequestCode); //SYSTEM CODE + TIME SLOT + REQUEST CODE

		msg+=tmp;

		msg.MakeUpper();
		SendList(TRUE, msg);

		//SEND DATA
		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			if(pbRecv[0] == 0x00)//success
				msg.Format("");
			else
				msg.Format("(ERROR)");

			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
			}
			SendList(FALSE, msg);

			BYTE temp[8];
			memset(temp, 0x00, 8);
			memcpy(temp, pbRecv+1, 8);
			CString str;
			com.HEX2STRING(temp, str, 8);

			GetDlgItem(IDC_EDIT_IDM)->SetWindowTextA(str);
			
			memset(temp, 0x00, 8);
			memcpy(temp, pbRecv+9, 8);
			com.HEX2STRING(temp, str, 8);
			GetDlgItem(IDC_EDIT_PMM)->SetWindowTextA(str);
		}	

	}
	else
	{
		
		//POLLING CMD for TransParent CMD
		msg.Format("FE5AFEFE03");//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH

		tmp.Format("10%s", m_strSystemCode); //SYSTEM CODE + TIME SLOT + REQUEST CODE

		msg+=tmp;

		msg.MakeUpper();
		SendList(TRUE, msg);

		//SEND DATA
		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			if(pbRecv[0] == 0x00)//success
				msg.Format("");
			else
				msg.Format("(ERROR)");

			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
			}
			SendList(FALSE, msg);

			BYTE temp[8];
			memset(temp, 0x00, 8);
			memcpy(temp, pbRecv+1, 8);
			CString str;
			com.HEX2STRING(temp, str, 8);

			GetDlgItem(IDC_EDIT_IDM)->SetWindowTextA(str);
			
			memset(temp, 0x00, 8);
			memcpy(temp, pbRecv+9, 8);
			com.HEX2STRING(temp, str, 8);
			GetDlgItem(IDC_EDIT_PMM)->SetWindowTextA(str);
		}	
					
	}

	
}
/*
description :
This Function is for Connect to Readers
variable :
data - Send Data
pbRecv - Receive Data
dwRecv - length of pbRecv
ioctlcode - ioctlcode
usemsgbox- Flag for use message box
			true : use
			false : not use
return : BOOL Succee or Fail 
*/
BOOL CFelica_SampleDlg::TransData(CString data,BYTE *pbRecv,DWORD *dwRecv,DWORD ioctlcode,BOOL usemsgbox)
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
	com.STRING2HEX(data, pbSend);
	
	if(ioctlcode == 0)
	{
		if(m_FlagScardStatus == 0)
			iorequest = SCARD_PCI_T0;
		else if(m_FlagScardStatus == 1)
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
		SendList(TRUE, tmp);
		if(usemsgbox)
			AfxMessageBox(tmp);
		return FALSE;
	}
		
	delete []pbSend;
	return TRUE;
}
/*
description :
When push the button "Make Block List"
Make Blocklist for memory to Read, Write
variable : none
return : none
*/
void CFelica_SampleDlg::OnBnClickedMakeBlocklist()
{
	CFelicaMakeBlockList bldlg;

	bldlg.m_bEncWithRWSAM = IsDlgButtonChecked(IDC_CHECK1);
	if(bldlg.DoModal() == IDOK)
	{
		SetDlgItemText(IDC_EDIT_BL,bldlg.m_strBL);
	}
}
/*
description :
When push the CheckBox "Using RW SAM"
variable : none
return : none
*/
void CFelica_SampleDlg::OnBnClickedCheck1()
{
	if(IsDlgButtonChecked(IDC_CHECK1))
	{
		GetDlgItem(IDC_MUTUAL_AUTH)->EnableWindow(TRUE);
		GetDlgItem(IDC_AUTH_RWSAM)->EnableWindow(TRUE);
		GetDlgItem(IDC_EDIT1)->EnableWindow(TRUE);
		GetDlgItem(IDC_EDIT4)->EnableWindow(FALSE);
		GetDlgItem(IDC_EDIT5)->EnableWindow(FALSE);
		GetDlgItem(IDC_EDIT2)->EnableWindow(TRUE);
		SetDlgItemText(IDC_EDIT_BL,"8000");
	}
	else
	{
		GetDlgItem(IDC_MUTUAL_AUTH)->EnableWindow(FALSE);
		GetDlgItem(IDC_AUTH_RWSAM)->EnableWindow(FALSE);
		GetDlgItem(IDC_EDIT1)->EnableWindow(FALSE);
		GetDlgItem(IDC_EDIT4)->EnableWindow(TRUE);
		GetDlgItem(IDC_EDIT5)->EnableWindow(TRUE);
		GetDlgItem(IDC_EDIT2)->EnableWindow(FALSE);
		SetDlgItemText(IDC_EDIT_BL,"01CB11018000");
	}
}
/*
description :
When push the button "Mutual Authentication"
Mutual Authentication
variable : none
return : none
*/
void CFelica_SampleDlg::OnBnClickedMutualAuth()
{
	int len = 0;

	UpdateData();

	CString str, strRCmd, strRcv, txCmd, txData;

	CString msg,tmp,recvdata,csn;
	BYTE	pbRecv[1024];
	DWORD	dwRecv = sizeof(pbRecv);
	//des

	if(m_radio_RWASM_keytype==0)//DES
	{
		CMutualAuthSamDes2 dlg;

		if(dlg.DoModal()==IDOK)
		{
			int NoA, NoS;
			NoA = dlg.m_strACL.GetLength()/8; //length;
			NoS = dlg.m_strSCL.GetLength()/8; //length;

			if(NoA < 1 || NoA > 16)
			{
				AfxMessageBox("Please Check Number of Area");
				return;
			}

			if(NoS < 1 || NoS > 16)
			{
				AfxMessageBox("Please Check Number of Service");
				return;
			}

			len = ((dlg.m_strSystemCode.GetLength()+dlg.m_strSCL.GetLength()+dlg.m_strACL.GetLength())/2) + 3; //length

			//POLLING CMD for TransParent CMD
			msg.Format("FE5AFEFE%02X", len);//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH

			msg+="04"; //SYSTEM CODE KEY VERSION LENTH; 
			msg+=dlg.m_strSystemCode;//SYSTEM CODE KEY VERSION

			tmp.Format("%02X", NoA);//LENGTH
			msg+=tmp;
			msg += dlg.m_strACL;//AREA CODE & KEY VERSION LIST
			tmp.Format("%02X", NoS);//LENGTH
			msg+=tmp;
			msg += dlg.m_strSCL;//SERVICE CODE & KEY VERSION LIST
		
			
			msg.MakeUpper();
			SendList(TRUE, msg);

			//SEND DATA
			if(TransData(msg,pbRecv,&dwRecv,0,false))	
			{
				if(pbRecv[0] == 0x00)//success
					msg.Format("");
				else
					msg.Format("(ERROR)");
				for(int i = 0; i < int(dwRecv); i++)
				{
					tmp.Format("%02X",pbRecv[i]);
					msg += tmp;
				}
				SendList(FALSE, msg);

				BYTE IDi[8];
				BYTE PMi[8];
				memset(IDi, 0x00, sizeof(IDi));
				memset(PMi, 0x00, sizeof(PMi));

				memcpy(IDi, pbRecv+1, 8);
				memcpy(IDi, pbRecv+9, 8);

				CString str;
				com.HEX2STRING(IDi, str, 8);
				GetDlgItem(IDC_EDIT_IDI)->SetWindowTextA(str);

				com.HEX2STRING(PMi, str, 8);
				GetDlgItem(IDC_EDIT_PMI)->SetWindowTextA(str);
			}
			else
				return;
			
		}
	}
	else
	{
		//AES

		CMutualAuthSamAes1 dlg;

		if(dlg.DoModal()==IDOK)
		{
			int NoS;
			NoS = dlg.m_strLoSC.GetLength() / 8; //length;

			if(NoS < 1 || NoS > 16)
			{
				AfxMessageBox("Please Check Number of Service code");
				return;
			}


			len = (dlg.m_strSC.GetLength()/2 + dlg.m_strLoSC.GetLength()/2)+2; //length

			//POLLING CMD for TransParent CMD
			msg.Format("FE5AFEFE%02X", len);//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH

			msg+="06"; //CMD2 
			msg+=dlg.m_strSC;//SYSTEM CODE KEY VERSION


			tmp.Format("%02X", NoS);//LENGTH
			msg+=tmp;
			msg += dlg.m_strLoSC;//SERVICE CODE
		
			msg.MakeUpper();
			SendList(TRUE, msg);

			//SEND DATA
			if(TransData(msg,pbRecv,&dwRecv,0,false))	
			{
				if(pbRecv[0] == 0x00)//success
					msg.Format("");
				else
					msg.Format("(ERROR)");
				for(int i = 0; i < int(dwRecv); i++)
				{
					tmp.Format("%02X",pbRecv[i]);
					msg += tmp;
				}
				SendList(FALSE, msg);

				BYTE IDi[8];
				BYTE PMi[8];
				memset(IDi, 0x00, sizeof(IDi));
				memset(PMi, 0x00, sizeof(PMi));

				memcpy(IDi, pbRecv+1, 8);
				memcpy(IDi, pbRecv+9, 8);

				CString str;
				com.HEX2STRING(IDi, str, 8);
				GetDlgItem(IDC_EDIT_IDI)->SetWindowTextA(str);

				com.HEX2STRING(PMi, str, 8);
				GetDlgItem(IDC_EDIT_PMI)->SetWindowTextA(str);
			}
			else
				return;
			
		}


	}

}
/*
description :
When push the button "Read"
To Read Card
variable : none
return : none
*/
void CFelica_SampleDlg::OnBnClickedRead()
{
	UpdateData();
	CString msg,tmp,recvdata,csn;
	BYTE	pbRecv[1024];
	DWORD	dwRecv = sizeof(pbRecv);
	int NoB = m_strBL.GetLength()/4;
	int len=0;

	if(IsDlgButtonChecked(IDC_CHECK1))//RWSAM
	{
		len = m_strBL.GetLength()/2; //length

		//POLLING CMD for TransParent CMD
		msg.Format("FE5AFEFE%02X", len+2);//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH

		msg+="11";//CMD
		tmp.Format("%02X", NoB);//LENGTH OF BLOCK LIST
		msg+=tmp;
		msg+= m_strBL;


		SendList(TRUE, msg);

		//SEND DATA
		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			if(pbRecv[0] == 0x00)//success
				msg.Format("");
			else
				msg.Format("(ERROR)");

			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
			}
			SendList(FALSE, msg);
		}
	}
	else //without SAM
	{

		len = m_strBL.GetLength(); //length;

		if(len < 12)
		{
			AfxMessageBox("Please, check service code and block list.");
			return ;
		}
		int idx = 0;
		int NoS = atoi(m_strBL.Mid(0,2));
		idx = 2;
		if((idx+(4*NoS)) > len)
		{
			AfxMessageBox("Please, check count of service code list.");
			return ;
		}

		CString strSCL = m_strBL.Mid(idx,4*NoS);
		idx += 4*NoS;
		if((idx+2) > len)
		{
			AfxMessageBox("Please, check block list.");
			return ;
		}
		int NoB = atoi(m_strBL.Mid(idx,2));
		idx += 2;
		if((idx+(4*NoS)) > len)
		{
			AfxMessageBox("Please, check count of block list.");
			return ;
		}
		CString strBL = m_strBL.Mid(idx,4*NoB);
	

		len = m_strBL.GetLength()/2; //length;

		//POLLING CMD for TransParent CMD
		msg.Format("FE5BFEFE%02X", len+1);//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH

		msg+="01"; // CMD
		tmp.Format("%02X%S%02X%S", NoS, strSCL, NoB, strBL);//Count of Service Code + Service Code + Count of Block List + BlockList
		msg+=tmp;

		SendList(TRUE, msg);

		//SEND DATA
		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			if(pbRecv[0] == 0x00)//sucess
				msg.Format("");
			else
				msg.Format("(ERROR)");

			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
			}
			SendList(FALSE, msg);
		}

	}

}
/*
description :
When push the button "Write"
To WRite Card
variable : none
return : none
*/
void CFelica_SampleDlg::OnBnClickedWrite()
{
	UpdateData();
	CString msg,tmp,recvdata,csn;
	BYTE	pbRecv[1024];
	DWORD	dwRecv = sizeof(pbRecv);
	int NoB = m_strBL.GetLength()/4;
	int len=0;

	if(IsDlgButtonChecked(IDC_CHECK1))//RWSAM
	{
		
				
		int NoB = m_strBL.GetLength()/4; //length
		len = (m_strData.GetLength()+m_strBL.GetLength()) /2; //length

		//POLLING CMD for TransParent CMD
		msg.Format("FE5AFEFE%02X", len+2);//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH

		msg+="12";//CMD
		tmp.Format("%02x%s%s", NoB, m_strBL, m_strData);//LENGTH OF BLOCK LIST
		msg+=tmp;
		msg+= m_strBL;

		msg.MakeUpper();
		SendList(TRUE, msg);

		//SEND DATA
		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			if(pbRecv[0] == 0x00)//sucess
				msg.Format("");
			else
				msg.Format("(ERROR)");

			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
			}
			SendList(FALSE, msg);
		}
	}
	else //without SAM
	{

		len = m_strBL.GetLength();

		if(len < 12)
		{
			AfxMessageBox("Please, check service code and block list.");
			return ;
		}
		int idx = 0;
		int NoS = atoi(m_strBL.Mid(0,2));
		idx = 2;
		if((idx+(4*NoS)) > len)
		{
			AfxMessageBox("Please, check count of service code list.");
			return ;
		}

		CString strSCL = m_strBL.Mid(idx,4*NoS);
		idx += 4*NoS;
		if((idx+2) > len)
		{
			AfxMessageBox("Please, check block list.");
			return ;
		}
		int NoB = atoi(m_strBL.Mid(idx,2));
		idx += 2;
		if((idx+(4*NoS)) > len)
		{
			AfxMessageBox("Please, check count of block list.");
			return ;
		}
		CString strBL = m_strBL.Mid(idx,4*NoB);

		len = (m_strBL.GetLength() + m_strData.GetLength())/2;//length

		//POLLING CMD for TransParent CMD
		msg.Format("FE5BFEFE%02X", len+1);//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH

		msg+="02"; // CMD
		tmp.Format("%02X%s%02X%s%s", NoS, strSCL, NoB, strBL,m_strData);//Count of Service Code + Service Code + Count of Block List + BlockList
		msg+=tmp;

		msg.MakeUpper();
		SendList(TRUE, msg);

		//SEND DATA
		if(TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			if(pbRecv[0] == 0x00)//sucess
				msg.Format("");
			else
				msg.Format("(ERROR)");
			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
			}
			SendList(FALSE, msg);
		}

	}
}
/*
description :
When push the button "Send"
Felica Transparent cmd to Card
variable : none
return : none
*/
void CFelica_SampleDlg::OnBnClickedFelicaTrans()
{
	UpdateData();
	CString msg,tmp,recvdata,csn;
	BYTE	pbRecv[1024];
	DWORD	dwRecv = sizeof(pbRecv);
	int len=0;


	if(m_strTransData.GetLength() == 0)
	{
		AfxMessageBox("Please, check data to send");
		return ;
	}

	len=(m_strTransData.GetLength()/2)+1;//length

	//POLLING CMD for TransParent CMD
	msg.Format("FE50FEFE%02x%02x%sB0", len+1, len, m_strTransData);//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH + Data

	msg.MakeUpper();
	SendList(TRUE, msg);

	//SEND DATA
	if(TransData(msg,pbRecv,&dwRecv,0,false))	
	{
		if(pbRecv[0] == 0x00) //success
			msg.Format("");
		else
			msg.Format("(ERROR)");
		
		for(int i = 0; i < int(dwRecv); i++)
		{
			tmp.Format("%02X",pbRecv[i]);
			msg += tmp;
		}

		SendList(FALSE, msg);
	}


}
