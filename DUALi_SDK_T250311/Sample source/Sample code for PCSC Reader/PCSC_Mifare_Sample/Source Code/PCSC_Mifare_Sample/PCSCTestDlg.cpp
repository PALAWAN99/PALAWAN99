// PCSCTestDlg.cpp : implementation file
//

#include "stdafx.h"
#include "PCSC_Mifare_Sample.h"
#include "PCSC_Mifare_SampleDlg.h"
#include "PCSCTestDlg.h"
// CPCSCTestDlg dialog

IMPLEMENT_DYNAMIC(CPCSCTestDlg, CDialog)

CPCSCTestDlg::CPCSCTestDlg(CComboBox* m_ctrlReaderList, CEdit* m_ctrlActiveProto, CListCtrlEx* m_ctrlDataList, CWnd* pParent /*=NULL*/)
	: CDialog(CPCSCTestDlg::IDD, pParent)
{
	ctrlDataList = m_ctrlDataList;
	p_ctrlReaderList = m_ctrlReaderList;
	p_ctrlActiveProto = m_ctrlActiveProto;
}

CPCSCTestDlg::~CPCSCTestDlg()
{
}

void CPCSCTestDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_COMBO_COM, m_ctrlComList);
	DDX_Control(pDX, IDC_COMBO_SENDPCI, m_ctrlIOSendPCI);
	DDX_Control(pDX, IDC_COMBO_COM2, m_ctrlControlCodeSAMStatus);
	DDX_Control(pDX, IDC_COMBO_SAMID, m_ctrlSAMID);
	DDX_Control(pDX, IDC_EDIT1, m_ctrlDataLen);
	DDX_Control(pDX, IDC_EDIT_APDU, m_ctrlAPDU);
	DDX_Control(pDX, IDC_EDIT_APDU_SAM, m_ctrlCTRLAPDU);
}


BEGIN_MESSAGE_MAP(CPCSCTestDlg, CDialog)
	ON_BN_CLICKED(IDC_TRANS_BTN, &CPCSCTestDlg::OnBnClickedTransBtn)
	ON_BN_CLICKED(IDC_CTRL_BTN, &CPCSCTestDlg::OnBnClickedCtrlBtn)
	ON_CBN_SELCHANGE(IDC_COMBO_COM, OnSelchangeComboCom)
	ON_CBN_SELCHANGE(IDC_COMBO_COM2, OnSelchangeComboCom2)
END_MESSAGE_MAP()


// CPCSCTestDlg message handlers
BOOL CPCSCTestDlg::OnInitDialog()
{
	CDialog::OnInitDialog();

	MakeCombo();

	m_ctrlDataLen.SetWindowText("200");

	SetWindowText("DUALi PC/SC Sample");
	m_ctrlCTRLAPDU.EnableWindow(FALSE);
	m_hCardHandle = NULL;

	return TRUE;  // return TRUE unless you set the focus to a control
}

//ComboBox Cotrol Initialization
void CPCSCTestDlg::MakeCombo()
{
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
	m_ctrlControlCodeSAMStatus.SetCurSel(0);

	m_ctrlSAMID.AddString("0");
	m_ctrlSAMID.AddString("1");
	m_ctrlSAMID.AddString("2");
	m_ctrlSAMID.AddString("3");
	m_ctrlSAMID.SetCurSel(1);
}

//'SCardTransmit' Button Click
void CPCSCTestDlg::OnBnClickedTransBtn()
{
	CPCSC_Mifare_SampleDlg* p_PMSDlg = (CPCSC_Mifare_SampleDlg*)AfxGetMainWnd();
	CString msg,tmp,recvdata,csn;
	int len,len2;
	BYTE	pbRecv[1024];
	DWORD	dwRecv = sizeof(pbRecv);
	
	if(m_nCommandIDX == 11)	//Felica-SAM-Auth
	{
		//set  normal mode
		msg = "a000000006000000e6020200";
		memset(pbRecv,0x00,1024);
		tmp.Format("[SEND] : %s",msg);

		p_PMSDlg->SendList(TRUE, tmp);

		// APDU command transmit
		if(p_PMSDlg->TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			msg = "<RECV> : ";
			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
			}
			p_PMSDlg->SendList(TRUE, msg);
		}

		//attention
		msg = "a00000000600000000000000";
		memset(pbRecv,0x00,1024);
		tmp.Format("[SEND] : %s",msg);
		p_PMSDlg->SendList(TRUE, tmp);
		dwRecv = sizeof(pbRecv);

		// APDU command transmit
		if(p_PMSDlg->TransData(msg,pbRecv,&dwRecv,0,false))	
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
			p_PMSDlg->SendList(TRUE, msg);
		}

		//authentication1
		msg.Format("a000000016000000e00000%s2923BE84E16CD6AE00",csn);
		memset(pbRecv,0x00,1024);
		tmp.Format("[SEND] : %s",msg);
		p_PMSDlg->SendList(TRUE, tmp);
		dwRecv = sizeof(pbRecv);

		// APDU command transmit
		if(p_PMSDlg->TransData(msg,pbRecv,&dwRecv,0,false))	
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
			p_PMSDlg->SendList(TRUE, msg);
		}

		//authentication2 (Rcr = 1122334455667788)
		msg.Format("A00000004D000000E002%s2923BE84E16CD6AE%s112233445566778800",csn,recvdata);
		memset(pbRecv,0x00,1024);
		tmp.Format("[SEND] : %s",msg);
		p_PMSDlg->SendList(TRUE, tmp);
		dwRecv = sizeof(pbRecv);

		// APDU command transmit
		if(p_PMSDlg->TransData(msg,pbRecv,&dwRecv,0,false))	
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
			p_PMSDlg->SendList(FALSE, msg);	//Output on a ListBox Control
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
		p_PMSDlg->SendList(TRUE, tmp);

		// APDU command transmit
		if(p_PMSDlg->TransData(msg,pbRecv,&dwRecv,0,false))	
		{
			msg = "<RECV> : ";
			for(int i = 0; i < int(dwRecv); i++)
			{
				tmp.Format("%02X",pbRecv[i]);
				msg += tmp;
			}
			p_PMSDlg->SendList(FALSE, msg);
		}	
	}
}

// SCardControl Button Click
void CPCSCTestDlg::OnBnClickedCtrlBtn()
{
	CPCSC_Mifare_SampleDlg* p_PMSDlg = (CPCSC_Mifare_SampleDlg*)AfxGetMainWnd();

	//LONG	lReturn;
	DWORD	dwControlCode;
	BYTE in[1024];		//lpInBuffer
	BYTE out[1024];		//lpOutBuffer
	DWORD pLen = 0;		//lpBytesReturned
	CString	msg,temp,temp2,cmd;
	int len,len2,nInLen;

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
	int idx = m_ctrlControlCodeSAMStatus.GetCurSel();	//Get Selected 'IOctrl Command' ComboBox
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
		if(idx == 4)	//BYPASS_COMMAND
		{
			in[0] = nInLen/256;
			in[1] = nInLen%256;
			p_PMSApp->STRING2HEX(msg, in+2);
			nInLen += 2;
			temp2.Format("%02X%02X%s",in[0],in[1],msg);
		}
		else
		{			
			p_PMSApp->STRING2HEX(msg, in);
			if(idx == 5 || idx == 6)	// Read Flash or Write Flash
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
		p_PMSApp->STRING2HEX(msg, in+1);
		nInLen = msg.GetLength()/2 + 1;
		temp.Format("[SEND] : %s%02d%s",cmd,in[0],msg);
	}
	if(idx == 8)
	{
		temp.Format("[SEND] : Get driver version");
	}
	p_PMSDlg->SendList(TRUE, temp);


	p_PMSApp->HEX2STRING(in,msg,nInLen);

	// APDU command transmit
	if(p_PMSDlg->TransData(msg,out,&pLen,dwControlCode, false))	
	{
		if(idx == 8)	// Get driver version
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
		p_PMSDlg->SendList(FALSE, msg);
	}
}

// 'APDU Command' ComboBox Control changed function
void CPCSCTestDlg::OnSelchangeComboCom() 
{
	// APDU command output in the edit box
	CString str,all;
	int len;
	int idx = m_ctrlComList.GetCurSel();
	int i;
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

//'IOctrl Command' ComboBox Control Changed 
void CPCSCTestDlg::OnSelchangeComboCom2() 
{
	int idx = m_ctrlControlCodeSAMStatus.GetCurSel();
	m_ctrlCTRLAPDU.EnableWindow(TRUE);	
	m_ctrlCTRLAPDU.SetWindowText("");
	if(idx == 0 || idx == 2 || idx == 7)
	{
		m_ctrlCTRLAPDU.EnableWindow(FALSE);	//SAM_ENABLE, SAM_DISABLE or Get card's information APDU Command edit control is Disable
	}
}
