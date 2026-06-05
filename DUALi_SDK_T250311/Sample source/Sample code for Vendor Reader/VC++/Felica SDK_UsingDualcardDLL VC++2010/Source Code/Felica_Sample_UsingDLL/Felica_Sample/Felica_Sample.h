
// Felica_Sample.h 
//

#pragma once

#ifndef __AFXWIN_H__
	#error "'stdafx.h'"
#endif

#include "resource.h"		


// CFelica_SampleApp:

//

class CFelica_SampleApp : public CWinApp
{
public:
	CFelica_SampleApp();


	public:
	virtual BOOL InitInstance();



	DECLARE_MESSAGE_MAP()
};

extern CFelica_SampleApp theApp;