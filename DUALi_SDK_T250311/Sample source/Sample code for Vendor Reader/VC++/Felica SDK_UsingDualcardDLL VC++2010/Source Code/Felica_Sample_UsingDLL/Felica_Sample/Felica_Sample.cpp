
// Felica_Sample.cpp 
//

#include "stdafx.h"
#include "Felica_Sample.h"
#include "Felica_SampleDlg.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


// CFelica_SampleApp

BEGIN_MESSAGE_MAP(CFelica_SampleApp, CWinApp)
	ON_COMMAND(ID_HELP, &CWinApp::OnHelp)
END_MESSAGE_MAP()


// CFelica_SampleApp

CFelica_SampleApp::CFelica_SampleApp()
{
	
}




CFelica_SampleApp theApp;


// CFelica_SampleApp 

BOOL CFelica_SampleApp::InitInstance()
{

	INITCOMMONCONTROLSEX InitCtrls;
	InitCtrls.dwSize = sizeof(InitCtrls);

	InitCtrls.dwICC = ICC_WIN95_CLASSES;
	InitCommonControlsEx(&InitCtrls);

	CWinApp::InitInstance();

	AfxEnableControlContainer();

	SetRegistryKey(_T("local application program"));

	CFelica_SampleDlg dlg;
	m_pMainWnd = &dlg;
	INT_PTR nResponse = dlg.DoModal();
	if (nResponse == IDOK)
	{
	
	}
	else if (nResponse == IDCANCEL)
	{
	
	}

	
	return FALSE;
}
