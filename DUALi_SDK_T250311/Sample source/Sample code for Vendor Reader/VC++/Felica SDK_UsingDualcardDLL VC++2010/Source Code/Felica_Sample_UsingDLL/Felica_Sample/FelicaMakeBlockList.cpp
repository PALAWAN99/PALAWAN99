// FelicaMakeBlockList.cpp : 구현 파일입니다.
//

#include "stdafx.h"
//#include "DualCard.h"
#include "Felica_Sample.h"
#include "FelicaMakeBlockList.h"


// CFelicaMakeBlockList 대화 상자입니다.

IMPLEMENT_DYNAMIC(CFelicaMakeBlockList, CDialog)

CFelicaMakeBlockList::CFelicaMakeBlockList(CWnd* pParent /*=NULL*/)
	: CDialog(CFelicaMakeBlockList::IDD, pParent)
	, m_strBL(_T(""))
{

}

CFelicaMakeBlockList::~CFelicaMakeBlockList()
{
}

void CFelicaMakeBlockList::DoDataExchange(CDataExchange* pDX)
{
	CDialog::DoDataExchange(pDX);
	for(int i = 0; i < 16; i++)
	{
		DDX_Text(pDX, IDC_MSG1+i, m_strServiceCode[i]);
		DDV_MaxChars(pDX, m_strServiceCode[i], 4);
		DDX_Control(pDX, IDC_MSG1+i, m_ctrlService[i]);

		DDX_Text(pDX, IDC_MSG17+i, m_strblocklist[i]);
		DDX_Control(pDX, IDC_MSG17+i, m_ctrlBlock[i]);				
	}
	DDX_Text(pDX, IDC_MSG_LIST, m_strBL);
}


BEGIN_MESSAGE_MAP(CFelicaMakeBlockList, CDialog)
	ON_BN_CLICKED(IDC_GEN, &CFelicaMakeBlockList::OnBnClickedGen)
END_MESSAGE_MAP()




void CFelicaMakeBlockList::OnBnClickedGen()
{
	CString tmp,service,block;

	int nservicecnt = 0;
	int nblockcnt = 0;
	int cnt,i;
	BYTE cblock[2];

	UpdateData();
	
	for(i = 0; i < 16; i++)
	{
		m_strServiceCode[i].Remove(' ');
		if(m_strServiceCode[i] == "")
			break;
		if(m_strServiceCode[i].GetLength() != 4)
		{
			AfxMessageBox("Wrong service code");
			m_ctrlService[i].SetFocus();
			m_ctrlService[i].SetSel(0,tmp.GetLength());
			return ;
		}
		service += m_strServiceCode[i];
		m_strblocklist[i].Remove(' ');
		if(m_strblocklist[i] == "")
		{
			AfxMessageBox("There is no block list");
			m_ctrlBlock[i].SetFocus();
			return ;
		}
		cnt = GetBlockList(m_strblocklist[i]);		
		if(cnt == 0)
			return ;
		nservicecnt++;
		nblockcnt += cnt;
			
		for(int j = 0; j < cnt; j++)
		{
			memset(cblock,0x00,2);
			cblock[0] = 0x80;
			cblock[0] += i;
			cblock[1] = m_pBlockList[j];
			tmp.Format("%02X%02X",cblock[0],cblock[1]);
			block += tmp;
		}		
	}

	if(m_bEncWithRWSAM)
		m_strBL.Format("%s",block);
	else
	{
		m_strBL.Format("%02d%s%02d%s",i,service,cnt,block);
	}
	SetDlgItemText(IDC_MSG_LIST,m_strBL);
}

BOOL CFelicaMakeBlockList::OnInitDialog()
{
	CDialog::OnInitDialog();


	if(m_bEncWithRWSAM)
	{
		m_ctrlService[0].SetWindowTextA("8811");
		m_ctrlService[1].SetWindowTextA("0812");

		m_ctrlBlock[0].SetWindowTextA("0");
		m_ctrlBlock[1].SetWindowTextA("0-1");
		SetDlgItemText(IDC_MSG_LIST,"800081008101");
	}
	else
	{
		m_ctrlService[0].SetWindowTextA("CB11");
		m_ctrlBlock[0].SetWindowTextA("0");
		SetDlgItemText(IDC_MSG_LIST,"01CB11018000");
	}

	return TRUE;  
}

BOOL CFelicaMakeBlockList::PreTranslateMessage(MSG* pMsg)
{

	if (pMsg->message == WM_KEYDOWN)
	{
		if(pMsg->wParam == VK_RETURN || pMsg->wParam == VK_ESCAPE)
			return TRUE;
	}
	return CDialog::PreTranslateMessage(pMsg);
}

int CFelicaMakeBlockList::GetBlockList(CString data)
{
	char pSep[2];
	bool	bChk1, bChk2;
	int n,j,ntmp1,ntmp2;
	char *pToken;
	char *context=NULL; 

	memset(pSep, 0x00, sizeof(pSep));
	bChk1 = false;		
	bChk2 = false;
	n = data.Find(',');
	if(n > 0)
		bChk1 = true;
	n = data.Find('-');
	if(n > 0)
	{
		if(bChk1)
		{
			AfxMessageBox("You can't use ',' and '-' simultaneously");
			return 0;
		}
		bChk2 = true;
	}
	j = 0;
	if(bChk1)
	{
		pSep[0] = ',';
		pToken = strtok_s((LPSTR)(LPCSTR)data, pSep,&context);		
		while(pToken != NULL)
		{
			m_pBlockList[j] = atoi(pToken);			
			pToken = strtok_s(NULL, pSep,&context);
			j++;
		}		
	}
	else if(bChk2)
	{
		n = data.Find('-');
		ntmp1 = atoi(data.Mid(0, n));		
		ntmp2 = atoi(data.Mid(n+1));
		j = ntmp2 - ntmp1;
		for(int i = 0; i <= j; i++)
		{
			m_pBlockList[i] = ntmp1+i;
		}
		j += 1;
	}
	else
	{
		m_pBlockList[0] = atoi(data);
		j = 1;
	}

	return j;
}

