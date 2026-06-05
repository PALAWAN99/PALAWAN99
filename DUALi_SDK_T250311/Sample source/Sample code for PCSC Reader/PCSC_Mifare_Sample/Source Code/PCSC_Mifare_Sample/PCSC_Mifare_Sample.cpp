
// PCSC_Mifare_Sample.cpp : 응용 프로그램에 대한 클래스 동작을 정의합니다.
//

#include "stdafx.h"
#include "PCSC_Mifare_Sample.h"
#include "PCSC_Mifare_SampleDlg.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


// CPCSC_Mifare_SampleApp

BEGIN_MESSAGE_MAP(CPCSC_Mifare_SampleApp, CWinApp)
	ON_COMMAND(ID_HELP, &CWinApp::OnHelp)
END_MESSAGE_MAP()


// CPCSC_Mifare_SampleApp construction

CPCSC_Mifare_SampleApp::CPCSC_Mifare_SampleApp()
{
	// TODO: add construction code here,
	// Place all significant initialization in InitInstance
}


// The one and only CPCSC_Mifare_SampleApp object.

CPCSC_Mifare_SampleApp theApp;


// CPCSC_Mifare_SampleApp initialization

BOOL CPCSC_Mifare_SampleApp::InitInstance()
{
	// 응용 프로그램 매니페스트가 ComCtl32.dll 버전 6 이상을 사용하여 비주얼 스타일을
	// 사용하도록 지정하는 경우, Windows XP 상에서 반드시 InitCommonControlsEx()가 필요합니다.
	// InitCommonControlsEx()를 사용하지 않으면 창을 만들 수 없습니다.
	INITCOMMONCONTROLSEX InitCtrls;
	InitCtrls.dwSize = sizeof(InitCtrls);
	// 응용 프로그램에서 사용할 모든 공용 컨트롤 클래스를 포함하도록
	// 이 항목을 설정하십시오.
	InitCtrls.dwICC = ICC_WIN95_CLASSES;
	InitCommonControlsEx(&InitCtrls);

	CWinApp::InitInstance();

	AfxEnableControlContainer();

	// 표준 초기화
	// 이들 기능을 사용하지 않고 최종 실행 파일의 크기를 줄이려면
	// 아래에서 필요 없는 특정 초기화
	// 루틴을 제거해야 합니다.
	// 해당 설정이 저장된 레지스트리 키를 변경하십시오.
	// TODO: 이 문자열을 회사 또는 조직의 이름과 같은
	// 적절한 내용으로 수정해야 합니다.
	SetRegistryKey(_T("로컬 응용 프로그램 마법사에서 생성된 응용 프로그램"));

	CPCSC_Mifare_SampleDlg dlg;
	m_pMainWnd = &dlg;
	INT_PTR nResponse = dlg.DoModal();
	if (nResponse == IDOK)
	{
		// TODO: Place code here to handle when the dialog is
		//  dismissed with OK
	}
	else if (nResponse == IDCANCEL)
	{
		// TODO: Place code here to handle when the dialog is
		//  dismissed with Cancel
	}

	// Since the dialog has been closed, return FALSE so that we exit the
	//  application, rather than start the application's message pump.
	return FALSE;
}
//Ascii to Hex
BYTE CPCSC_Mifare_SampleApp::ASCII2HEX(CString str)
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
//String to Hex Change
void CPCSC_Mifare_SampleApp::STRING2HEX(LPCTSTR str, BYTE *hex)
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


//SCard Error Message
CString CPCSC_Mifare_SampleApp::GetSCARDErrorMsg(LONG ret)
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

//Hex to String Change
void CPCSC_Mifare_SampleApp::HEX2STRING(BYTE *hex, CString& str, int hexLen)
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

// HEX to ASCII Change
void CPCSC_Mifare_SampleApp::HEX2ASCII(BYTE c, BYTE *asc)
{
	BYTE tmp;

	tmp = c & 0x0f;
	if(tmp<0x0a)	asc[1] = (tmp+0x30);
	else	asc[1] = (tmp+0x37);
	tmp = (c>>4)&0x0f;
	if(tmp<0x0a)	asc[0] = (tmp+0x30);
	else	asc[0] = (tmp+0x37);
}
