// ListCtrlEx.cpp : implementation file
//

#include "stdafx.h"
#include "ListCtrlEx.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#undef THIS_FILE
static char THIS_FILE[] = __FILE__;
#endif
#define MAX_BUFF_SIZE				2048    
/////////////////////////////////////////////////////////////////////////////
// CListCtrlEx 

CListCtrlEx::CListCtrlEx()
{
	m_nEnableEdit	= 0x00;
	m_bEnableEdit	= false;
	m_nEnableCombo	= 0x00;
	m_bEnableCombo	= false;
	m_bClickMsg		= false;
}

CListCtrlEx::~CListCtrlEx()
{
}


BEGIN_MESSAGE_MAP(CListCtrlEx, CListCtrl)
	//{{AFX_MSG_MAP(CListCtrlEx)
	ON_NOTIFY_REFLECT(NM_CLICK, OnClick)
	//}}AFX_MSG_MAP
END_MESSAGE_MAP()

/////////////////////////////////////////////////////////////////////////////
// CListCtrlEx message handlers
int CListCtrlEx::AddItem(char* strItem, int nItem, int nSubItem, UINT nState, int nImageIndex, long nParam)
{
	LVITEM lvItem;
	lvItem.mask = LVIF_TEXT;
	lvItem.iItem = nItem;
	lvItem.iSubItem = nSubItem;

	lvItem.pszText = strItem;

	if (nState != -1)
	{
		lvItem.mask |= LVIF_STATE;
		lvItem.state = nState;
	}
	if (nImageIndex != -1)
	{
		lvItem.mask |= LVIF_IMAGE;
		lvItem.iImage = nImageIndex;
	}
	if (nParam != -1)
	{
		lvItem.mask |= LVIF_PARAM;
		lvItem.lParam = nParam;
	}
	if (nSubItem == 0)
		return InsertItem(&lvItem);
	else
		return SetItem(&lvItem);
}

int CListCtrlEx::AddArgItem(int nItem, int nSubItem, char* pBuff,...)
{
	int		n;
	char	pBuf[MAX_BUFF_SIZE];
	va_list	ap;

	memset(pBuf, 0x00, sizeof(pBuf));
	va_start(ap, pBuff);
	vsprintf_s(pBuf, pBuff, ap);
	n = AddItem(pBuf, nItem, nSubItem);
	va_end(ap);
	return n;
}

void CListCtrlEx::EnableComboBox(bool bEnable, int nPos)
{
	CRect	rc;
	unsigned short n = 0x01;
	n <<= nPos;
	m_nEnableCombo |= n;

	m_bEnableCombo = bEnable;
/*	if(!m_pComboBox.GetSafeHwnd())
	{
		m_pComboBox.Create(CBS_DROPDOWNLIST | WS_VSCROLL | WS_TABSTOP, rc, this, ID_COMBO_LIST);
		m_pComboBox.ShowWindow(false);
	}*/
}

void CListCtrlEx::EnableEditBox(bool bEnable, int nPos)
{
	CRect	rc;
	unsigned short n = 0x01;
	n <<= nPos;
	m_nEnableEdit |= n;

	m_bEnableEdit = bEnable;
	/*if(!m_pEditBox.GetSafeHwnd())
	{
		m_pEditBox.Create(ES_MULTILINE | ES_AUTOHSCROLL | WS_TABSTOP, rc, this, ID_EDIT_LIST);
		m_pEditBox.ShowWindow(false);
	}*/
}

void CListCtrlEx::OnClick(NMHDR* pNMHDR, LRESULT* pResult) 
{
	/*int		i, j, k;
	char	pBuf[MAX_DATA_LENGTH];
	CRect	rc;
	LV_DISPINFO*	pDisp;
	unsigned short	nPos = 0x01;

	pDisp = (LV_DISPINFO*)pNMHDR;
	i = GetSelectionMark();
	j = pDisp->item.iItem;
	nPos <<= j;
	if(i < 0)
		return;
	GetSubItemRect(i, j, LVIR_LABEL, rc);
	if((nPos & m_nEnableEdit) && m_bEnableEdit)
	{
		m_pEditBox.MoveWindow(rc.left, rc.top, rc.Width(), rc.Height());
		m_pEditBox.ShowWindow(true);

		GetItemText(i, j, pBuf, MAX_DATA_LENGTH);
		m_pEditBox.m_nRow = i;
		m_pEditBox.m_nCol = j;
		m_pEditBox.SetWindowText(pBuf);
		m_pEditBox.SetFocus();
	}
	else if((nPos & m_nEnableCombo) && m_bEnableCombo)
	{
		m_pComboBox.MoveWindow(rc.left, rc.top, rc.Width(), 250);//MAX_COMBO_HEIGHT);
		m_pComboBox.ShowWindow(true);

		m_pComboBox.m_nRow = i;
		m_pComboBox.m_nCol = j;
		GetItemText(i, j, pBuf, sizeof(pBuf));
		k = m_pComboBox.FindString(0, pBuf);
		m_pComboBox.SetCurSel(k);
		m_pComboBox.SetFocus();
	}
	else if(m_bClickMsg && j == 2)
	{
		memset(pBuf, 0x00, sizeof(pBuf));
		GetItemText(i, 1, pBuf, 512);
		if(!memcmp(pBuf, "=>", 2))
		{
			memset(pBuf, 0x00, sizeof(pBuf));
			GetItemText(i, 2, pBuf, 512);
			if(pBuf[0] == 'Y')
				SetItemText(i, 2, "N");
			else
				SetItemText(i, 2, "Y");
		}
	}*/
	*pResult = 0;
}

void CListCtrlEx::SetEnableClickMsg(bool bEnable)
{
	m_bClickMsg = bEnable;
}
