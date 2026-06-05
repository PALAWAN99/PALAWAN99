Option Strict Off
Option Explicit On
Friend Class TestForm
	Inherits System.Windows.Forms.Form
	Public explicit As Object
	Dim m_bConnect As Boolean
	Dim m_nPort As Integer
	Dim Dunk As String
	Dim m_UID(4) As Byte

    Public Sub GetDeviceList()
        Dim i, nCnt As Integer
        Dim devname(256) As Byte
        Dim strTemp As String

        ComboDevice.Items.Clear()

        nCnt = DE_GetUSBDeviceList(1)

        If nCnt > 0 Then
            strTemp = " "
            For i = 0 To (nCnt - 1)
                DE_GetUSBDeviceName(i, devname(0))
                strTemp = System.Text.Encoding.UTF8.GetString(devname)
                ComboDevice.Items.Add(strTemp)
            Next i
            ComboDevice.SelectedIndex = 0

        End If
    End Sub

    Private Sub Command2_Click(ByVal eventSender As System.Object, ByVal eventArgs As System.EventArgs) Handles Command2.Click
        Dim nret As Integer
        Dim lpRes(256) As Byte
        Dim outlen(1) As Integer
        Dim Temp As String
        Dim i As Integer

        If m_bConnect = False Then
            MsgBox("Device is not connected")
            Exit Sub
        End If

        nret = DE_GetVersion(m_nPort, outlen(0), lpRes(0))

        If nret <> 0 Then
            MsgBox("Ger version Error(" & CStr(nret) & ")")
        Else
            Temp = ""
            For i = 1 To outlen(0) - 1
                Dunk = Chr(lpRes(i))
                Temp = Temp & Dunk
            Next i
            Label2.Text = Temp
        End If
    End Sub

    Private Sub Command1_Click(ByVal eventSender As System.Object, ByVal eventArgs As System.EventArgs) Handles Command1.Click
        Dim ret As Integer
        Dim msg As String

        If m_bConnect = True Then
            DE_ClosePort((m_nPort))
            Command1.Text = "Connect device"
            m_bConnect = False
            DE_BuzzerOn(m_nPort)
            Sleep((100))
            DE_BuzzerOff(m_nPort)
        Else

            If ComboDevice.Text.Length = 0 Then
                msg = "There is no selected device."
                MsgBox(msg)
                Exit Sub
            End If

            msg = Mid(ComboDevice.Text, 1, 3)

            If msg = "COM" Then
                msg = Mid(ComboDevice.Text, 4)
                m_nPort = CInt(msg)
            Else
                m_nPort = 100 + ComboDevice.SelectedIndex
            End If

            ret = DE_InitPort(m_nPort, 115200)
            'm_nPort = 3
            'ret = DUAL_InitPort(m_nPort)
            If ret <> m_nPort Then
                msg = "Failed to connect device(" & CStr(ret) & ")"
                MsgBox(msg)
                m_nPort = 0
                Exit Sub
            End If
            Command1.Text = "Disconnect device"
            m_bConnect = True
            DE_BuzzerOn(m_nPort)
            Sleep((100))
            DE_BuzzerOff(m_nPort)
        End If



    End Sub


    Private Sub Command3_Click(ByVal eventSender As System.Object, ByVal eventArgs As System.EventArgs) Handles Command3.Click
        Dim nlen As Object
        Dim nret As Integer
        Dim lpRes(256) As Byte
        Dim outlen(1) As Integer
        Dim Temp As String
        Dim i As Integer

        If m_bConnect = False Then
            MsgBox("Device is not connected")
            Exit Sub
        End If

        If TxtResult.Text = "" Then
            TxtResult.Text = TxtResult.Text & "=>21"
        Else
            TxtResult.Text = TxtResult.Text & vbCrLf & "=>21"
        End If

        nret = DEA_Idle_Req(m_nPort, outlen(0), lpRes(0))

        If nret <> 0 Then
            nret = DEA_Idle_Req(m_nPort, outlen(0), lpRes(0))
        End If

        If nret <> 0 Then
            Temp = CStr(nret)
            'UPGRADE_WARNING: nlen 개체의 기본 속성을 확인할 수 없습니다. 자세한 내용은 다음을 참조하십시오. 'ms-help://MS.VSCC.v90/dv_commoner/local/redirect.htm?keyword="6A50421D-15FE-4896-8A1B-2EC21E9037B2"'
            nlen = GetErrMsg(CShort(Temp), lpRes(0))
            If Len(Temp) < 2 Then
                Temp = "<=Error code:0" & Temp
            Else
                Temp = "<=Error code:" & Temp
            End If
            Temp = Temp & vbCrLf & "<=Error messge:"
            'UPGRADE_WARNING: nlen 개체의 기본 속성을 확인할 수 없습니다. 자세한 내용은 다음을 참조하십시오. 'ms-help://MS.VSCC.v90/dv_commoner/local/redirect.htm?keyword="6A50421D-15FE-4896-8A1B-2EC21E9037B2"'
            For i = 0 To nlen - 1
                Dunk = Chr(lpRes(i))
                Temp = Temp & Dunk
            Next i
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        Else
            Temp = "<="
            For i = 0 To outlen(0) - 1
                Dunk = Hex(lpRes(i))
                If Len(Dunk) < 2 Then
                    Temp = Temp & "0" & Dunk
                Else
                    Temp = Temp & Dunk
                End If
            Next i
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
            TxtResult.SelectionStart = (Len(TxtResult.Text))
        End If
    End Sub


    Private Sub Command4_Click(ByVal eventSender As System.Object, ByVal eventArgs As System.EventArgs) Handles Command4.Click
        Dim nret As Integer
        Dim lpRes(256) As Byte
        Dim outlen(1) As Integer
        Dim Temp As String
        Dim i As Integer
        Dim nlen As Integer

        If m_bConnect = False Then
            MsgBox("Device is not connected")
            Exit Sub
        End If

        If TxtResult.Text = "" Then
            TxtResult.Text = TxtResult.Text & "=>3D"
        Else
            TxtResult.Text = TxtResult.Text & vbCrLf & "=>3D"
        End If

        nret = DEA_AntiSelLevel(m_nPort, outlen(0), lpRes(0))

        If nret <> 0 Then
            Temp = CStr(nret)
            nlen = GetErrMsg(CShort(Temp), lpRes(0))
            If Len(Temp) < 2 Then
                Temp = "<=Error code:0" & Temp
            Else
                Temp = "<=Error code:" & Temp
            End If
            Temp = Temp & vbCrLf & "<=Error messge:"
            For i = 0 To nlen - 1
                Dunk = Chr(lpRes(i))
                Temp = Temp & Dunk
            Next i
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        Else
            Temp = "<="
            For i = 0 To outlen(0) - 1
                If i > 0 Then
                    m_UID(i - 1) = lpRes(i)
                End If

                Dunk = Hex(lpRes(i))
                If Len(Dunk) < 2 Then
                    Temp = Temp & "0" & Dunk
                Else
                    Temp = Temp & Dunk
                End If
            Next i
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        End If
        TxtResult.SelectionStart = (Len(TxtResult.Text))
    End Sub

    Private Sub Command6_Click(ByVal eventSender As System.Object, ByVal eventArgs As System.EventArgs) Handles Command6.Click
        Dim nlen As Object
        Dim lpRes(256) As Byte
        Dim nret As Integer
        Dim m As Integer
        Dim i As Integer
        Dim j As Integer
        Dim Tot As Integer
        Dim Temp As String
        Dim outlen(1) As Integer
        Dim keytype As Byte
        Dim SKData(6) As Byte
        Dim nKeylen As Integer
        Dim blocknum As Byte

        If ComboKtype.SelectedIndex = 0 Then
            keytype = 0
        Else
            keytype = 4
        End If

        nKeylen = Len(KeyData.Text) \ 2

        If nKeylen <> 6 Then
            MsgBox("Key length Error")
            Exit Sub
        End If

        For i = 0 To 5 '16 -> 10
            m = 0
            Tot = 0
            For j = 0 To 1
                m = RetVal(Mid(Mid(KeyData.Text, (2 * i) + 1, 2), j + 1, 1))
                Tot = Tot + m * 16 ^ (1 - j)
            Next j
            SKData(i) = Tot
        Next i

        blocknum = CShort(BLnum.Text)

        Temp = "=>30"
        If ComboKtype.SelectedIndex = 0 Then
            Temp = Temp & "00"
        Else
            Temp = Temp & "04"
        End If

        For i = 0 To 5
            Dunk = Hex(SKData(i))
            If Len(Dunk) < 2 Then
                Temp = Temp & "0" & Dunk
            Else
                Temp = Temp & Dunk
            End If
        Next i
        Dunk = Hex(blocknum)
        If Len(Dunk) = 1 Then
            Temp = Temp & "0" & Dunk
        Else
            Temp = Temp & Dunk
        End If
        If TxtResult.Text = "" Then
            TxtResult.Text = TxtResult.Text & Trim(Temp)
        Else
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        End If

        nret = DEA_Authkey(m_nPort, keytype, SKData(0), blocknum)
        Temp = CStr(nret)
        If nret <> 0 Then
            Temp = CStr(nret)
            'UPGRADE_WARNING: nlen 개체의 기본 속성을 확인할 수 없습니다. 자세한 내용은 다음을 참조하십시오. 'ms-help://MS.VSCC.v90/dv_commoner/local/redirect.htm?keyword="6A50421D-15FE-4896-8A1B-2EC21E9037B2"'
            nlen = GetErrMsg(CShort(Temp), lpRes(0))
            If Len(Temp) < 2 Then
                Temp = "<=Error code:0" & Temp
            Else
                Temp = "<=Error code:" & Temp
            End If
            Temp = Temp & vbCrLf & "<=Error messge:"
            'UPGRADE_WARNING: nlen 개체의 기본 속성을 확인할 수 없습니다. 자세한 내용은 다음을 참조하십시오. 'ms-help://MS.VSCC.v90/dv_commoner/local/redirect.htm?keyword="6A50421D-15FE-4896-8A1B-2EC21E9037B2"'
            For i = 0 To nlen - 1
                Dunk = Chr(lpRes(i))
                Temp = Temp & Dunk
            Next i
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        Else
            Temp = "<=00"
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        End If
        TxtResult.SelectionStart = (Len(TxtResult.Text))
    End Sub

    Public Function RetVal(ByRef k As String) As Integer
        If Not IsNumeric(k) Then
            RetVal = Val(CStr(Asc(UCase(k)))) - 55
        Else
            RetVal = Val(k)
        End If

    End Function

    Private Sub Command7_Click(ByVal eventSender As System.Object, ByVal eventArgs As System.EventArgs) Handles Command7.Click
        Dim nlen As Object
        Dim lpRes(256) As Byte
        Dim nret As Integer
        Dim i As Integer
        Dim Temp As String
        Dim outlen(1) As Integer
        Dim blocknum As Byte

        blocknum = CShort(BLnum.Text)

        Temp = "=>27"
        Dunk = Hex(blocknum)
        If Len(Dunk) = 1 Then
            Temp = Temp & "0" & Dunk
        Else
            Temp = Temp & Dunk
        End If
        If TxtResult.Text = "" Then
            TxtResult.Text = TxtResult.Text & Trim(Temp)
        Else
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        End If

        nret = DEA_Read(m_nPort, blocknum, outlen(0), lpRes(0))
        If nret <> 0 Then
            Temp = CStr(nret)
            'UPGRADE_WARNING: nlen 개체의 기본 속성을 확인할 수 없습니다. 자세한 내용은 다음을 참조하십시오. 'ms-help://MS.VSCC.v90/dv_commoner/local/redirect.htm?keyword="6A50421D-15FE-4896-8A1B-2EC21E9037B2"'
            nlen = GetErrMsg(CShort(Temp), lpRes(0))
            If Len(Temp) < 2 Then
                Temp = "<=Error code:0" & Temp
            Else
                Temp = "<=Error code:" & Temp
            End If
            Temp = Temp & vbCrLf & "<=Error messge:"
            'UPGRADE_WARNING: nlen 개체의 기본 속성을 확인할 수 없습니다. 자세한 내용은 다음을 참조하십시오. 'ms-help://MS.VSCC.v90/dv_commoner/local/redirect.htm?keyword="6A50421D-15FE-4896-8A1B-2EC21E9037B2"'
            For i = 0 To nlen - 1
                Dunk = Chr(lpRes(i))
                Temp = Temp & Dunk
            Next i
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        Else
            Temp = "<="
            For i = 0 To outlen(0) - 1
                Dunk = Hex(lpRes(i))
                If Len(Dunk) < 2 Then
                    Temp = Temp & "0" & Dunk
                Else
                    Temp = Temp & Dunk
                End If
            Next i
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        End If
        TxtResult.SelectionStart = (Len(TxtResult.Text))
    End Sub

    Private Sub Command8_Click(ByVal eventSender As System.Object, ByVal eventArgs As System.EventArgs) Handles Command8.Click
        Dim lpRes(256) As Byte
        Dim nret As Integer
        Dim m As Integer
        Dim i As Integer
        Dim j As Integer
        Dim Tot As Integer
        Dim Temp As String
        Dim outlen(1) As Integer
        Dim SData(16) As Byte
        Dim nlen As Integer
        Dim blocknum As Byte

        nlen = Len(rvData.Text) \ 2

        If nlen <> 16 Then
            MsgBox("Data length Error")
            Exit Sub
        End If

        For i = 0 To 15 '16 -> 10
            m = 0
            Tot = 0
            For j = 0 To 1
                m = RetVal(Mid(Mid(rvData.Text, (2 * i) + 1, 2), j + 1, 1))
                Tot = Tot + m * 16 ^ (1 - j)
            Next j
            SData(i) = Tot
        Next i

        blocknum = CShort(BLnum.Text)

        Temp = "=>28"
        Dunk = Hex(blocknum)
        If Len(Dunk) = 1 Then
            Temp = Temp & "0" & Dunk
        Else
            Temp = Temp & Dunk
        End If
        For i = 0 To 15
            Dunk = Hex(SData(i))
            If Len(Dunk) < 2 Then
                Temp = Temp & "0" & Dunk
            Else
                Temp = Temp & Dunk
            End If
        Next i
        If TxtResult.Text = "" Then
            TxtResult.Text = TxtResult.Text & Trim(Temp)
        Else
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        End If

        nret = DEA_Write(m_nPort, blocknum, 16, SData(0))
        Temp = CStr(nret)
        If nret <> 0 Then
            Temp = CStr(nret)
            nlen = GetErrMsg(CShort(Temp), lpRes(0))
            If Len(Temp) < 2 Then
                Temp = "<=Error code:0" & Temp
            Else
                Temp = "<=Error code:" & Temp
            End If
            Temp = Temp & vbCrLf & "<=Error messge:"
            For i = 0 To nlen - 1
                Dunk = Chr(lpRes(i))
                Temp = Temp & Dunk
            Next i
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        Else
            Temp = "<=00"
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        End If
        TxtResult.SelectionStart = (Len(TxtResult.Text))
    End Sub

    Private Sub Command9_Click(ByVal eventSender As System.Object, ByVal eventArgs As System.EventArgs) Handles Command9.Click
        TxtResult.Text = ""
    End Sub

    Private Sub TestForm_Load(ByVal eventSender As System.Object, ByVal eventArgs As System.EventArgs) Handles MyBase.Load

        ComboDevice.Items.Clear()

        GetDeviceList()

        ComboKtype.Items.Clear()

        ComboKtype.Items.Add("A type")
        ComboKtype.Items.Add("B type")
        ComboKtype.Text = "A type"
        ComboKtype.SelectedIndex = 0

        m_bConnect = False
        m_nPort = 0
    End Sub

    Private Sub Button_Refresh_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button_Refresh.Click
        GetDeviceList()
    End Sub

    Private Sub Button_DetectCard_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button_DetectCard.Click
        Dim nlen As Integer
        Dim nret As Integer
        Dim lpRes(256) As Byte
        Dim outlen(1) As Integer
        Dim Temp As String
        Dim i As Integer

        If m_bConnect = False Then
            MsgBox("Device is not connected")
            Exit Sub
        End If

        If TxtResult.Text = "" Then
            TxtResult.Text = TxtResult.Text & "=>Detect Card"
        Else
            TxtResult.Text = TxtResult.Text & vbCrLf & "=>Detect Card"
        End If

        nret = DE_FindCard(m_nPort, 0, 0, 0, 0, outlen(0), lpRes(0))


        If nret <> 0 Then
            Temp = CStr(nret)
            nlen = GetErrMsg(CShort(Temp), lpRes(0))
            If Len(Temp) < 2 Then
                Temp = "<=Error code:0" & Temp
            Else
                Temp = "<=Error code:" & Temp
            End If
            Temp = Temp & vbCrLf & "<=Error messge:"
            For i = 0 To nlen - 1
                Dunk = Chr(lpRes(i))
                Temp = Temp & Dunk
            Next i
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        Else
            Temp = "<="
            For i = 0 To outlen(0) - 1
                Dunk = Hex(lpRes(i))
                If Len(Dunk) < 2 Then
                    Temp = Temp & "0" & Dunk
                Else
                    Temp = Temp & Dunk
                End If
            Next i
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
            TxtResult.SelectionStart = (Len(TxtResult.Text))
        End If
    End Sub

    Private Sub Button_SendAPDU_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button_SendAPDU.Click
        Dim lpRes(256) As Byte
        Dim nret As Integer
        Dim i, m, Tot, j As Integer
        Dim Temp As String
        Dim outlen(1) As Integer
        Dim SData(256) As Byte
        Dim nlen As Integer


        nlen = Len(TextBox_14443.Text) \ 2

        If nlen = 0 Then
            MsgBox("There is no APDU to send.")
            Exit Sub
        End If

        For i = 0 To (nlen - 1)
            m = 0
            Tot = 0
            For j = 0 To 1
                m = RetVal(Mid(Mid(TextBox_14443.Text, (2 * i) + 1, 2), j + 1, 1))
                Tot = Tot + m * 16 ^ (1 - j)
            Next j
            SData(i) = Tot
        Next i

        Temp = "=>61"
        Temp = Temp & TextBox_14443.Text

        If TxtResult.Text = "" Then
            TxtResult.Text = TxtResult.Text & Trim(Temp)
        Else
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        End If

        nret = DE_APDU(m_nPort, nlen, SData(0), outlen(0), lpRes(0))
        If nret <> 0 Then
            Temp = CStr(nret)
            nlen = GetErrMsg(CShort(Temp), lpRes(0))
            If Len(Temp) < 2 Then
                Temp = "<=Error code:0" & Temp
            Else
                Temp = "<=Error code:" & Temp
            End If
            Temp = Temp & vbCrLf & "<=Error messge:"
            For i = 0 To nlen - 1
                Dunk = Chr(lpRes(i))
                Temp = Temp & Dunk
            Next i
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        Else
            Temp = "<="
            For i = 0 To outlen(0) - 1
                Dunk = Hex(lpRes(i))
                If Len(Dunk) < 2 Then
                    Temp = Temp & "0" & Dunk
                Else
                    Temp = Temp & Dunk
                End If
            Next i
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
            TxtResult.SelectionStart = (Len(TxtResult.Text))
        End If
    End Sub

    Private Sub Button_Polling_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button_Polling.Click
        Dim lpRes(256) As Byte
        Dim nret As Integer
        Dim i, m, Tot, j As Integer
        Dim Temp As String
        Dim outlen(1) As Integer
        Dim SData(256) As Byte
        Dim nlen As Integer


        nlen = Len(TextBox_TX.Text) \ 2

        If nlen = 0 Then
            MsgBox("There is no TX data to send.")
            Exit Sub
        End If

        For i = 0 To (nlen - 1)
            m = 0
            Tot = 0
            For j = 0 To 1
                m = RetVal(Mid(Mid(TextBox_TX.Text, (2 * i) + 1, 2), j + 1, 1))
                Tot = Tot + m * 16 ^ (1 - j)
            Next j
            SData(i) = Tot
        Next i

        Temp = TextBox_TX.Text

        If TxtResult.Text = "" Then
            TxtResult.Text = TxtResult.Text & Trim(Temp)
        Else
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        End If

        nret = DE_Polling(m_nPort, nlen, SData(0), outlen(0), lpRes(0), 1000)
        If nret <> 0 Then
            Temp = CStr(nret)
            nlen = GetErrMsg(CShort(Temp), lpRes(0))
            If Len(Temp) < 2 Then
                Temp = "<=Error code:0" & Temp
            Else
                Temp = "<=Error code:" & Temp
            End If
            Temp = Temp & vbCrLf & "<=Error messge:"
            For i = 0 To nlen - 1
                Dunk = Chr(lpRes(i))
                Temp = Temp & Dunk
            Next i
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
        Else
            Temp = "<="
            For i = 0 To outlen(0) - 1
                Dunk = Hex(lpRes(i))
                If Len(Dunk) < 2 Then
                    Temp = Temp & "0" & Dunk
                Else
                    Temp = Temp & Dunk
                End If
            Next i
            TxtResult.Text = TxtResult.Text & vbCrLf & Trim(Temp)
            TxtResult.SelectionStart = (Len(TxtResult.Text))
            TextBox_RX.Text = Mid(Temp, 3)
        End If
    End Sub
End Class