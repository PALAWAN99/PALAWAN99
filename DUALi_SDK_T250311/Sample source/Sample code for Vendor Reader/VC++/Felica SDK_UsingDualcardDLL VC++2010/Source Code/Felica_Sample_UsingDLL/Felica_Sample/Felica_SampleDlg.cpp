
// Felica_SampleDlg.cpp
//

#include "stdafx.h"
#include "Felica_Sample.h"
#include "Felica_SampleDlg.h"
#include "FelicaMakeBlockList.h"
#include "MutualAuthSamDes2.h"
#include "MutualAuthSamAes1.h"
#include "DualCardDllHeader.h"

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
	DDX_Control(pDX, IDC_CHECK2, m_chkPcsc);
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
	ON_BN_CLICKED(IDC_CHECK2, &CFelica_SampleDlg::OnBnClickedCheck2)
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
	pcscAutoDetect = CLOSE;
	SetDlgItemText(IDC_EDIT_BL,"8000");



	

	m_nBaud = 115200;

	RecognizeDevice(); //Initialize device for VENDOR
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
This Function is for When push the button "Connect"
variable :none
return : none
*/
void CFelica_SampleDlg::OnBnClickedConnect()
{

	int nRcv,idx;
	CString strport;


	//When push the button "Connect"

	if(m_chkPcsc.GetCheck()==1)	//PCSCMODE
		OpenPort();
	else	//VENDORMODE
	{
		m_ctrlPort.GetWindowText(strport);
		if(strport.Mid(0,3) == "COM")
		{
			m_nPort = atoi(strport.Mid(3));
		}
		else
		{
			idx = m_ctrlPort.GetCurSel();
			m_nPort = PORT_USB+idx;
		}

		m_ctrlDisConnect.EnableWindow(TRUE);
		m_ctrlConnect.EnableWindow(FALSE);
		if(m_bDevice == TRUE)
		{			
			nRcv = DE_InitPort(m_nPort, m_nBaud);
		}
		if(nRcv != m_nPort)
		{
			AfxMessageBox("Device is not connected");
			m_nPort=0;
		}
		else
			DEVICEMODE = VENDORMODE;
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
	int nRcv;
	int idx = m_ctrlPort.GetCurSel();
	CString msg;
	m_nPort = DUALI_PCSCPORT+idx; //pcsc port
	nRcv = DE_SCardConnect(m_nPort);//Connect
	if(nRcv != m_nPort)
	{
		
		AfxMessageBox("Please, Place a card on the device. or check driver");
		
		m_nPort=0;
		return FALSE;
	}
	else
	{
		DEVICEMODE = PCSCMODE;
		m_ctrlDisConnect.EnableWindow(TRUE);
		m_ctrlConnect.EnableWindow(FALSE);

		if(pcscAutoDetect == CLOSE)
		{
			//Auto Detect Off, pcsc Device's Card Auto Detect OFF 
			nRcv = DE_AutoDetectOnOff(m_nPort,PCSC_DETECTFLAG_OFF);
			if(nRcv !=DE_OK)
			{
				msg.Format("Failed Auto polling off\n");
				AfxMessageBox(msg);
				ClosePort();
			}
			else
				pcscAutoDetect = OPEN;
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
	if(m_nPort > 1000 )
	{	//PCSC mode
		//Auto Detect ON, pcsc Device's Card Auto Detect On
		DE_AutoDetectOnOff(m_nPort,PCSC_DETECTFLAG_ON);
		pcscAutoDetect = CLOSE;
		DE_SCardDisConnect(m_nPort);
	}

	m_ctrlConnect.EnableWindow(TRUE);
	m_ctrlDisConnect.EnableWindow(FALSE);
	
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
	if(m_chkPcsc.GetCheck()==1)//PCSCMODE
		ClosePort();
	else//VENDORMODE
	{
		DE_ClosePort(m_nPort);
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
	//Reflash and Find New Device
	OnBnClickedCheck2();
}

/*
description :
Recognize PCSC Device
variable :none
return : none
*/
void CFelica_SampleDlg::RecognizeDevice()
{

	int nNum= DE_GetUSBDeviceList();

	char devName[100];
	int i;

	m_ctrlPort.ResetContent();

	m_nPort = 0;

	for(i=0; i< nNum; i++)
	{
		memset(devName, 0x00, sizeof(devName));
		DE_GetUSBDeviceName(i, devName);


		m_ctrlPort.InsertString(i, devName);
	}

	if(i > 0)
		m_bDevice = TRUE;
	else
		m_bDevice = FALSE;


	m_ctrlPort.SetCurSel(0);
}
BOOL CFelica_SampleDlg::RecognizePCSCDevice()
{

	int i, cnt;
	BYTE PCSCNAME[MAX_BUFF_SIZE];
	CString strReaderName;

	deviceCnt = 1;
	m_ctrlPort.ResetContent();

	//Get PCSC ReaderList
	cnt = DE_GetPSCSReaderList();
	for(i = 0 ; i < cnt ; i++)
	{
		memset(PCSCNAME, 0x00, sizeof(PCSCNAME));
		if(DE_GetPCSCReaderName(i, PCSCNAME))
		{
			strReaderName.Format("%s", PCSCNAME);
			m_ctrlPort.AddString(strReaderName);
		}
		else
		{
			AfxMessageBox("Fail To Read");
			return FALSE;
		}
	}
	m_ctrlPort.SetCurSel(0);

	return TRUE;
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


	CString str, strRCmd, strRcv, txCmd, txData;
	char pRecv[128];
	BYTE RBUF[500];
	memset(pRecv, 0x00, sizeof(pRecv));
	memset(RBUF, 0x00, sizeof(RBUF));

	if(m_nPort == 0)
	{
		AfxMessageBox("Device is not connected");
		return;
	}
	if(m_strSamPos.GetLength() < 1 || m_strSamPos.GetLength() > 2)
	{
		{
			AfxMessageBox("Please check SAM position");
			return;
		}
	}
	samPos = atoi(m_strSamPos);

	BYTE enc;
	enc = 0x01;//Authentication for encrypted communication
		
	int ret;
	//DES Type
	if(m_radio_RWASM_keytype==0)
	{
		if(m_strKey.GetLength()!=48)
		{
			AfxMessageBox("Please check DES Key(24Bytes)");//The Key must be 24bytes.
			return;
		}
		BYTE defKey[24];
		memset(defKey, 0x00, 24);

		com.STRING2HEX(m_strKey, defKey);
		

		if(m_chkPcsc.GetCheck() == 1) //PCSC
			txCmd = "5AFEFE1B";//FELICA CMD+ LENGTH + PARAMETER1 + PARAMETER2 + LENTH
		else //vendor
			txCmd = "5A";//FELICA CMD

		txData.Format("%s%02X%02X%s", "00", samPos, enc,m_strKey); //MUTUALAUTH DES + SAMSLOTNUM + ENC MODE + KEY
		txData.MakeUpper();
		SendList(TRUE, txCmd + txData);


		ret = DE_FeliCa_RWSAMMutualAuthInDES(m_nPort, samPos, enc, defKey, &outlen, RBUF);
	}
	else//AES Type
	{
		if(m_strKey.GetLength()!=32)
		{
			AfxMessageBox("Please check AES Key(16Bytes)");//The Key must be 16bytes.
			return;
		}
		BYTE defKey[16];
		memset(defKey, 0x00, 16);

		com.STRING2HEX(m_strKey, defKey);

		
		if(m_chkPcsc.GetCheck() == 1) //PCSC
			txCmd = "5AFEFE12";//FELICA CMD+ LENGTH + PARAMETER1 + PARAMETER2 + LENTH
		else //vendor
			txCmd = "5A";//FELICA CMD

		txData.Format("%s%02X%02X%s", "01", samPos, enc, m_strKey);//MUTUALAUTH AES + SAMSLOTNUM + ENC MODE + KEY
		txData.MakeUpper();
		
		SendList(TRUE, txCmd + txData);

		ret = DE_FeliCa_RWSAMMutualAuthInAES(m_nPort, samPos, enc, defKey, &outlen, RBUF);
	}

	if(ret != DE_OK)
	{

		GetErrMsg(ret, pRecv);
		str.Format("%02X(%s)",ret,pRecv);
		SendList(FALSE, str);

	}
	else
	{
		
		SendList(FALSE, outlen, RBUF);
		com.HEX2STRING(RBUF+1, strRcv, outlen-1);
		
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

	int ret;
	BYTE SystemCode[2];
	BYTE timeSlot;
	BYTE RequestCode;
	char pRecv[128];
	BYTE RBUF[500];
	memset(pRecv, 0x00, sizeof(pRecv));
	memset(RBUF, 0x00, sizeof(RBUF));


	if(m_nPort == 0)
	{
		AfxMessageBox("Device is not connected");
		return;
	}


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
		
		com.STRING2HEX(m_strSystemCode, SystemCode);
		com.STRING2HEX(m_strTimeSlot, &timeSlot);
		com.STRING2HEX(m_strRequestCode, &RequestCode);

		outlen = (m_strSystemCode.GetLength()/2 + m_strTimeSlot.GetLength()/2 + m_strRequestCode.GetLength()/2)+1;
		
		if(m_chkPcsc.GetCheck() == 1) //PCSC
			txCmd.Format("5BFEFE%02d", outlen);//FELICA CMD+ LENGTH + PARAMETER1 + PARAMETER2 + LENGTH
		else //vendor
			txCmd = "5B";//FELICA CMD

		txData.Format("00%s%s%s", m_strSystemCode,m_strTimeSlot,m_strRequestCode); //CMD + SYSTEM CODE + TIME SLOT + REQUEST CODE
		txData.MakeUpper();
		
		SendList(TRUE, txCmd + txData);

		ret = DE_FeliCa_PollingWithoutRWSAM(m_nPort, SystemCode, timeSlot, RequestCode, &outlen, RBUF);	

	}
	else
	{
		
		com.STRING2HEX(m_strSystemCode, SystemCode);

		if(m_chkPcsc.GetCheck() == 1) //PCSC
			txCmd.Format("5AFEFE03", outlen);//FELICA CMD+ LENGTH + PARAMETER1 + PARAMETER2 + LENGTH
		else //vendor
			txCmd = "5A";//FELICA CMD

		txData.Format("10%s", m_strSystemCode); // CMD + SYSTEMCODE;
		txData.MakeUpper();
		
		SendList(TRUE, txCmd + txData);

		ret = DE_FeliCa_Polling(m_nPort, SystemCode, &outlen, RBUF);
					
	}

	if(ret != DE_OK)
	{


		GetErrMsg(ret, pRecv);
		str.Format("%02X(%s)",ret,pRecv);
		SendList(FALSE, str);


	}
	else 
	{

		SendList(FALSE, outlen, RBUF);
		com.HEX2STRING(RBUF+1, strRcv, outlen-1);
		
		BYTE temp[8];
		memset(temp, 0x00, 8);
		memcpy(temp, RBUF+1, 8);
		CString str;
		com.HEX2STRING(temp, str, 8);

		GetDlgItem(IDC_EDIT_IDM)->SetWindowTextA(str);
		
		memset(temp, 0x00, 8);
		memcpy(temp, RBUF+9, 8);
		com.HEX2STRING(temp, str, 8);
		GetDlgItem(IDC_EDIT_PMM)->SetWindowTextA(str);
	}
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

	int outlen;
	int ret;
	UpdateData();

	CString str, strRCmd, strRcv, txCmd, txData;

	CString msg,tmp,recvdata,csn;

	BYTE RBUF[500];
	char pRecv[128];

	memset(pRecv, 0x00, sizeof(pRecv));
	memset(RBUF, 0x00, sizeof(RBUF));


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
			if(m_chkPcsc.GetCheck() == 1) //PCSC
				msg.Format("5AFEFE%02X", len);//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH
			else //vendor
				msg = "5A";//FELICA CMD


			msg+="04"; //SYSTEM CODE KEY VERSION LENTH; 
			msg+=dlg.m_strSystemCode;//SYSTEM CODE KEY VERSION

			tmp.Format("%02X", NoA);//LENGTH
			msg+=tmp;
			msg += dlg.m_strACL;//AREA CODE & KEY VERSION LIST
			tmp.Format("%02X", NoS);//LENGTH
			msg+=tmp;
			msg += dlg.m_strSCL;//SERVICE CODE & KEY VERSION LIST
			
			BYTE SC[4];
			memset(SC, 0x00, sizeof(SC));
			com.STRING2HEX(dlg.m_strSystemCode, SC);


			BYTE LoACKV[64];
			BYTE temp[64];
			memset(LoACKV, 0x00, sizeof(LoACKV));
			memset(temp, 0x00, sizeof(temp));
			com.STRING2HEX(dlg.m_strACL, temp);

			int nLenACL = NoA*4;

			memcpy(LoACKV, temp, nLenACL);
				
			BYTE LoSCKV[64];
			memset(temp, 0x00, sizeof(temp));
			int nLenSCL = NoS*4;
			com.STRING2HEX(dlg.m_strSCL, temp);
			memcpy(LoSCKV, temp, nLenSCL);
			
			msg.MakeUpper();
			SendList(TRUE, msg);

			ret = DE_FeliCa_MutualAuthRWSAMInDES_ACSC(m_nPort, SC, SC+2, NoA, LoACKV, NoS, LoSCKV, &outlen, RBUF);
		
		
		}
		else
			return;
			
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
		
			if(m_chkPcsc.GetCheck() == 1) //PCSC
				msg.Format("5AFEFE%02X", len);//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH
			else //vendor
				msg = "5A";//FELICA CMD


			msg+="06"; //CMD2 
			msg+=dlg.m_strSC;//SYSTEM CODE KEY VERSION


			tmp.Format("%02X", NoS);//LENGTH
			msg+=tmp;
			msg += dlg.m_strLoSC;//SERVICE CODE
		
			msg.MakeUpper();
			SendList(TRUE, msg);

			BYTE SC[2];
			memset(SC, 0x00, sizeof(SC));
			com.STRING2HEX(dlg.m_strSC, SC);

			BYTE LoSCKV[64];
			BYTE temp[32];
			memset(LoSCKV, 0x00, sizeof(LoSCKV));
			memset(temp, 0x00, sizeof(temp));
					
			int nLenLoSC = dlg.m_strLoSC.GetLength() / 2;
			com.STRING2HEX(dlg.m_strLoSC, temp);
			memcpy(LoSCKV, temp, nLenLoSC);

		//	m_nServiceCode = NoS;
		//	m_strServiceCodeList = dlg.m_strLoSC;

			ret = DE_FeliCa_MutualAuthRWSAMInAES_SC(m_nPort, SC, NoS, LoSCKV, &outlen, RBUF);

			}
			else
				return;
		
	}


	if(ret != DE_OK) 
	{

		GetErrMsg(ret, pRecv);
		str.Format("%02X(%s)",ret,pRecv);
		SendList(FALSE, str);

	}
	else
	{

		SendList(FALSE, outlen, RBUF);

		BYTE IDi[8];
		BYTE PMi[8];
		memset(IDi, 0x00, sizeof(IDi));
		memset(PMi, 0x00, sizeof(PMi));

		memcpy(IDi, RBUF+1, 8);
		memcpy(IDi, RBUF+9, 8);

		CString str;
		com.HEX2STRING(IDi, str, 8);
		GetDlgItem(IDC_EDIT_IDI)->SetWindowTextA(str);

		com.HEX2STRING(PMi, str, 8);
		GetDlgItem(IDC_EDIT_PMI)->SetWindowTextA(str);
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
	int NoB = m_strBL.GetLength()/4;
	int len=0;
	int ret;
	int outlen;

	CString str;
	BYTE RBUF[500];
	char pRecv[128];
	memset(pRecv, 0x00, sizeof(pRecv));
	memset(RBUF, 0x00, sizeof(RBUF));

	if(IsDlgButtonChecked(IDC_CHECK1))//RWSAM
	{
		len = m_strBL.GetLength()/2; //length

		//POLLING CMD for TransParent CMD

		if(m_chkPcsc.GetCheck() == 1) //PCSC
			msg.Format("FE5AFEFE%02X", len+2);//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH
		else //vendor
			msg = "5A";//FELICA CMD


		msg+="11";//CMD
		tmp.Format("%02X", NoB);//LENGTH OF BLOCK LIST
		msg+=tmp;
		msg+= m_strBL;

		msg.MakeUpper();
		SendList(TRUE, msg);

		//5A11
		int NoB = m_strBL.GetLength()/4;
		BYTE BL[MAX_BUFF_SIZE];
		memset(BL, 0x00, sizeof(BL));
		com.STRING2HEX(m_strBL, BL);

		//SEND DATA
		ret = DE_FeliCa_ReadBlock(m_nPort, NoB, BL, &outlen, RBUF);
	
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
		
		if(m_chkPcsc.GetCheck() == 1) //PCSC
			msg.Format("5BFEFE%02X", len+1);//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH
		else //vendor
			msg = "5B";//FELICA CMD


		msg+="01"; // CMD
		tmp.Format("%02X%S%02X%S", NoS, strSCL, NoB, strBL);//Count of Service Code + Service Code + Count of Block List + BlockList
		msg+=tmp;

		SendList(TRUE, msg);

		BYTE LoSC[32]; 
		memset(LoSC, 0x00, sizeof(LoSC));
		com.STRING2HEX(strSCL, LoSC);

		BYTE BL[MAX_BUFF_SIZE];
		memset(BL, 0x00, sizeof(BL));
		com.STRING2HEX(strBL, BL);

		ret = DE_FeliCa_ReadWithoutRWSAMWithoutEnc(m_nPort, NoS, LoSC, NoB, BL, &outlen, RBUF);

	}


	if(ret != DE_OK)
	{

		GetErrMsg(ret, pRecv);
		str.Format("%02X(%s)",ret,pRecv);
		SendList(FALSE, str);

	}
	else
	{
		
		SendList(FALSE, outlen, RBUF);

		
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
	int NoB = m_strBL.GetLength()/4;
	int len=0;
	int ret;
	char pRecv[128];
	CString str;
	memset(pRecv, 0x00, sizeof(pRecv));
	BYTE status;


	if(IsDlgButtonChecked(IDC_CHECK1))//RWSAM
	{

		int NoB = m_strBL.GetLength()/4; //length
		len = (m_strData.GetLength()+m_strBL.GetLength()) /2; //length

		//POLLING CMD for TransParent CMD
		if(m_chkPcsc.GetCheck() == 1) //PCSC
			msg.Format("5AFEFE%02X", len+2);//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH
		else //vendor
			msg = "5A";//FELICA CMD


		msg+="12";//CMD
		tmp.Format("%02x%s%s", NoB, m_strBL, m_strData);//LENGTH OF BLOCK LIST
		msg+=tmp;
		msg+= m_strBL;

		msg.MakeUpper();
		SendList(TRUE, msg);

		//5A12
		
		BYTE BL[MAX_BUFF_SIZE];
		memset(BL, 0x00, sizeof(BL));
		com.STRING2HEX(m_strBL, BL);

		BYTE BD[MAX_BUFF_SIZE];
		memset(BD, 0x00, sizeof(BD));
		com.STRING2HEX(m_strData, BD);

		ret = DE_FeliCa_WriteBlock(m_nPort, NoB, BL, BD);


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

		if(m_chkPcsc.GetCheck() == 1) //PCSC
			msg.Format("FE5BFEFE%02X", len+1);//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH
		else //vendor
			msg = "5B";//FELICA CMD



		msg+="02"; // CMD
		tmp.Format("%02X%s%02X%s%s", NoS, strSCL, NoB, strBL,m_strData);//Count of Service Code + Service Code + Count of Block List + BlockList
		msg+=tmp;

		msg.MakeUpper();
		SendList(TRUE, msg);

		//SEND DATA
		BYTE LoSC[32]; 
		memset(LoSC, 0x00, sizeof(LoSC));
		com.STRING2HEX(strSCL, LoSC);

		BYTE BL[MAX_BUFF_SIZE];
		memset(BL, 0x00, sizeof(BL));
		com.STRING2HEX(strBL, BL);

		BYTE BD[MAX_BUFF_SIZE];
		memset(BD, 0x00, sizeof(BD));
		com.STRING2HEX(m_strData, BD);	

		ret = DE_FeliCa_WriteWithoutRWSAMWithoutEnc(m_nPort, NoS, LoSC, NoB, BL, BD);
		

	}

	
	if(ret != DE_OK)
	{

		GetErrMsg(ret, pRecv);
		str.Format("%02X(%s)",ret,pRecv);
		SendList(FALSE, str);


	}
	else
	{
		status = ret;
		SendList(FALSE, 1, &status);

		
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
	BYTE pSend[256], pRecv[256];
	memset(pSend,0x00,sizeof(pSend));
	int len=0;

	int nSend, nRecv,ret;
	if(m_strTransData.GetLength() == 0)
	{
		AfxMessageBox("Please, check data to send");
		return ;
	}
	com.STRING2HEX(m_strTransData, pSend);
	nSend = tmp.GetLength()/2;

	len=(m_strTransData.GetLength()/2)+1;//length

	//POLLING CMD for TransParent CMD
	if(m_chkPcsc.GetCheck() == 1) //PCSC
		msg.Format("50FEFE%02x%02x%sB0", len+1, len, m_strTransData);//CLASS + FELICA CMD+ PARAMETER1 + PARAMETER2 + LENGTH + Data
	else //vendor
		msg.Format("50%sB0", m_strTransData);

	msg.MakeUpper();
	SendList(TRUE, msg);

	//SEND DATA
	ret = DEC_Transparent(m_nPort, nSend, pSend,&nRecv,pRecv);


}
/*
description :
When push the Check button "PCSC"
Checked -> PCSC MODE
Non Checked -> Vendor MODE
variable : none
return : none
*/
void CFelica_SampleDlg::OnBnClickedCheck2()
{

	//Before Change mode, Disconnect

	if(DEVICEMODE == VENDORMODE) //Vendor Disconnect
	{
		DE_ClosePort(m_nPort);
		m_ctrlConnect.EnableWindow(TRUE);
		m_ctrlDisConnect.EnableWindow(FALSE);
	}
	else//PCSC Disconnect
	{
		ClosePort();
	}
	

	if(m_chkPcsc.GetCheck()==1)
	{

		//Recognize PCSC Device
		RecognizePCSCDevice();
	}
	else
	{
		//Recognize Vendor Device
		RecognizeDevice();
		
	}
}

