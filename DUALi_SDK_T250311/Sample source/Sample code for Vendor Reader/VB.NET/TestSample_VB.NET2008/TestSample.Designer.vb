<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> Partial Class TestForm
#Region "Windows Form 디자이너에서 생성한 코드 "
	<System.Diagnostics.DebuggerNonUserCode()> Public Sub New()
		MyBase.New()
		'이 호출은 Windows Form 디자이너에 필요합니다.
		InitializeComponent()
	End Sub
	'Form은 Dispose를 재정의하여 구성 요소 목록을 정리합니다.
	<System.Diagnostics.DebuggerNonUserCode()> Protected Overloads Overrides Sub Dispose(ByVal Disposing As Boolean)
		If Disposing Then
			If Not components Is Nothing Then
				components.Dispose()
			End If
		End If
		MyBase.Dispose(Disposing)
	End Sub
	'Windows Form 디자이너에 필요합니다.
	Private components As System.ComponentModel.IContainer
	Public ToolTip1 As System.Windows.Forms.ToolTip
	Public WithEvents Command9 As System.Windows.Forms.Button
	Public WithEvents TxtResult As System.Windows.Forms.TextBox
    Public WithEvents Command2 As System.Windows.Forms.Button
	Public WithEvents Label2 As System.Windows.Forms.Label
	Public WithEvents Frame2 As System.Windows.Forms.GroupBox
	Public WithEvents Command1 As System.Windows.Forms.Button
	Public WithEvents ComboDevice As System.Windows.Forms.ComboBox
	Public WithEvents Label1 As System.Windows.Forms.Label
	Public WithEvents Frame1 As System.Windows.Forms.GroupBox
	'참고: 다음 프로시저는 Windows Form 디자이너에 필요합니다.
	'Windows Form 디자이너를 사용하여 수정할 수 있습니다.
	'코드 편집기를 사용하여 수정하지 마십시오.
	<System.Diagnostics.DebuggerStepThrough()> Private Sub InitializeComponent()
        Me.components = New System.ComponentModel.Container
        Me.ToolTip1 = New System.Windows.Forms.ToolTip(Me.components)
        Me.Command9 = New System.Windows.Forms.Button
        Me.TxtResult = New System.Windows.Forms.TextBox
        Me.Frame2 = New System.Windows.Forms.GroupBox
        Me.Command2 = New System.Windows.Forms.Button
        Me.Label2 = New System.Windows.Forms.Label
        Me.Frame1 = New System.Windows.Forms.GroupBox
        Me.Button_Refresh = New System.Windows.Forms.Button
        Me.Command1 = New System.Windows.Forms.Button
        Me.ComboDevice = New System.Windows.Forms.ComboBox
        Me.Label1 = New System.Windows.Forms.Label
        Me.Label3 = New System.Windows.Forms.Label
        Me.Label4 = New System.Windows.Forms.Label
        Me.Label5 = New System.Windows.Forms.Label
        Me.Label6 = New System.Windows.Forms.Label
        Me.Command3 = New System.Windows.Forms.Button
        Me.Command4 = New System.Windows.Forms.Button
        Me.ComboKtype = New System.Windows.Forms.ComboBox
        Me.BLnum = New System.Windows.Forms.TextBox
        Me.KeyData = New System.Windows.Forms.TextBox
        Me.Command6 = New System.Windows.Forms.Button
        Me.rvData = New System.Windows.Forms.TextBox
        Me.Command7 = New System.Windows.Forms.Button
        Me.Command8 = New System.Windows.Forms.Button
        Me.Frame3 = New System.Windows.Forms.GroupBox
        Me.Button_SendAPDU = New System.Windows.Forms.Button
        Me.GroupBox1 = New System.Windows.Forms.GroupBox
        Me.Button_DetectCard = New System.Windows.Forms.Button
        Me.TextBox_14443 = New System.Windows.Forms.TextBox
        Me.Label7 = New System.Windows.Forms.Label
        Me.GroupBox2 = New System.Windows.Forms.GroupBox
        Me.TextBox_TX = New System.Windows.Forms.TextBox
        Me.Label9 = New System.Windows.Forms.Label
        Me.Button_Polling = New System.Windows.Forms.Button
        Me.TextBox_RX = New System.Windows.Forms.TextBox
        Me.Label8 = New System.Windows.Forms.Label
        Me.Frame2.SuspendLayout()
        Me.Frame1.SuspendLayout()
        Me.Frame3.SuspendLayout()
        Me.GroupBox1.SuspendLayout()
        Me.GroupBox2.SuspendLayout()
        Me.SuspendLayout()
        '
        'Command9
        '
        Me.Command9.BackColor = System.Drawing.SystemColors.Control
        Me.Command9.Cursor = System.Windows.Forms.Cursors.Default
        Me.Command9.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Command9.Location = New System.Drawing.Point(381, 694)
        Me.Command9.Name = "Command9"
        Me.Command9.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Command9.Size = New System.Drawing.Size(105, 33)
        Me.Command9.TabIndex = 23
        Me.Command9.Text = "Clear List"
        Me.Command9.UseVisualStyleBackColor = False
        '
        'TxtResult
        '
        Me.TxtResult.AcceptsReturn = True
        Me.TxtResult.BackColor = System.Drawing.SystemColors.Window
        Me.TxtResult.Cursor = System.Windows.Forms.Cursors.IBeam
        Me.TxtResult.ForeColor = System.Drawing.SystemColors.WindowText
        Me.TxtResult.Location = New System.Drawing.Point(24, 557)
        Me.TxtResult.MaxLength = 0
        Me.TxtResult.Multiline = True
        Me.TxtResult.Name = "TxtResult"
        Me.TxtResult.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.TxtResult.ScrollBars = System.Windows.Forms.ScrollBars.Vertical
        Me.TxtResult.Size = New System.Drawing.Size(462, 131)
        Me.TxtResult.TabIndex = 22
        '
        'Frame2
        '
        Me.Frame2.BackColor = System.Drawing.SystemColors.Control
        Me.Frame2.Controls.Add(Me.Command2)
        Me.Frame2.Controls.Add(Me.Label2)
        Me.Frame2.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Frame2.Location = New System.Drawing.Point(24, 112)
        Me.Frame2.Name = "Frame2"
        Me.Frame2.Padding = New System.Windows.Forms.Padding(0)
        Me.Frame2.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Frame2.Size = New System.Drawing.Size(462, 59)
        Me.Frame2.TabIndex = 4
        Me.Frame2.TabStop = False
        Me.Frame2.Text = " Get device version "
        '
        'Command2
        '
        Me.Command2.BackColor = System.Drawing.SystemColors.Control
        Me.Command2.Cursor = System.Windows.Forms.Cursors.Default
        Me.Command2.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Command2.Location = New System.Drawing.Point(319, 15)
        Me.Command2.Name = "Command2"
        Me.Command2.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Command2.Size = New System.Drawing.Size(129, 33)
        Me.Command2.TabIndex = 6
        Me.Command2.Text = "Get version"
        Me.Command2.UseVisualStyleBackColor = False
        '
        'Label2
        '
        Me.Label2.BackColor = System.Drawing.SystemColors.Control
        Me.Label2.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D
        Me.Label2.Cursor = System.Windows.Forms.Cursors.Default
        Me.Label2.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Label2.Location = New System.Drawing.Point(13, 22)
        Me.Label2.Name = "Label2"
        Me.Label2.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Label2.Size = New System.Drawing.Size(297, 17)
        Me.Label2.TabIndex = 5
        '
        'Frame1
        '
        Me.Frame1.BackColor = System.Drawing.SystemColors.Control
        Me.Frame1.Controls.Add(Me.Button_Refresh)
        Me.Frame1.Controls.Add(Me.Command1)
        Me.Frame1.Controls.Add(Me.ComboDevice)
        Me.Frame1.Controls.Add(Me.Label1)
        Me.Frame1.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Frame1.Location = New System.Drawing.Point(24, 12)
        Me.Frame1.Name = "Frame1"
        Me.Frame1.Padding = New System.Windows.Forms.Padding(0)
        Me.Frame1.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Frame1.Size = New System.Drawing.Size(462, 94)
        Me.Frame1.TabIndex = 0
        Me.Frame1.TabStop = False
        Me.Frame1.Text = " Connect "
        '
        'Button_Refresh
        '
        Me.Button_Refresh.BackColor = System.Drawing.SystemColors.Control
        Me.Button_Refresh.Cursor = System.Windows.Forms.Cursors.Default
        Me.Button_Refresh.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Button_Refresh.Location = New System.Drawing.Point(357, 55)
        Me.Button_Refresh.Name = "Button_Refresh"
        Me.Button_Refresh.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Button_Refresh.Size = New System.Drawing.Size(91, 33)
        Me.Button_Refresh.TabIndex = 4
        Me.Button_Refresh.Text = "Refresh"
        Me.Button_Refresh.UseVisualStyleBackColor = False
        '
        'Command1
        '
        Me.Command1.BackColor = System.Drawing.SystemColors.Control
        Me.Command1.Cursor = System.Windows.Forms.Cursors.Default
        Me.Command1.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Command1.Location = New System.Drawing.Point(224, 54)
        Me.Command1.Name = "Command1"
        Me.Command1.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Command1.Size = New System.Drawing.Size(127, 33)
        Me.Command1.TabIndex = 3
        Me.Command1.Text = "Connect Device"
        Me.Command1.UseVisualStyleBackColor = False
        '
        'ComboDevice
        '
        Me.ComboDevice.BackColor = System.Drawing.SystemColors.Window
        Me.ComboDevice.Cursor = System.Windows.Forms.Cursors.Default
        Me.ComboDevice.ForeColor = System.Drawing.SystemColors.WindowText
        Me.ComboDevice.Location = New System.Drawing.Point(64, 25)
        Me.ComboDevice.Name = "ComboDevice"
        Me.ComboDevice.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.ComboDevice.Size = New System.Drawing.Size(384, 20)
        Me.ComboDevice.TabIndex = 2
        Me.ComboDevice.Text = "ComboDevice"
        '
        'Label1
        '
        Me.Label1.BackColor = System.Drawing.SystemColors.Control
        Me.Label1.Cursor = System.Windows.Forms.Cursors.Default
        Me.Label1.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Label1.Location = New System.Drawing.Point(8, 26)
        Me.Label1.Name = "Label1"
        Me.Label1.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Label1.Size = New System.Drawing.Size(57, 17)
        Me.Label1.TabIndex = 1
        Me.Label1.Text = "Device :"
        '
        'Label3
        '
        Me.Label3.BackColor = System.Drawing.SystemColors.Control
        Me.Label3.Cursor = System.Windows.Forms.Cursors.Default
        Me.Label3.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Label3.Location = New System.Drawing.Point(24, 72)
        Me.Label3.Name = "Label3"
        Me.Label3.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Label3.Size = New System.Drawing.Size(62, 17)
        Me.Label3.TabIndex = 11
        Me.Label3.Text = "Key type"
        '
        'Label4
        '
        Me.Label4.BackColor = System.Drawing.SystemColors.Control
        Me.Label4.Cursor = System.Windows.Forms.Cursors.Default
        Me.Label4.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Label4.Location = New System.Drawing.Point(161, 72)
        Me.Label4.Name = "Label4"
        Me.Label4.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Label4.Size = New System.Drawing.Size(89, 17)
        Me.Label4.TabIndex = 13
        Me.Label4.Text = "Block number :"
        '
        'Label5
        '
        Me.Label5.BackColor = System.Drawing.SystemColors.Control
        Me.Label5.Cursor = System.Windows.Forms.Cursors.Default
        Me.Label5.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Label5.Location = New System.Drawing.Point(291, 72)
        Me.Label5.Name = "Label5"
        Me.Label5.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Label5.Size = New System.Drawing.Size(41, 21)
        Me.Label5.TabIndex = 15
        Me.Label5.Text = "Key"
        '
        'Label6
        '
        Me.Label6.BackColor = System.Drawing.SystemColors.Control
        Me.Label6.Cursor = System.Windows.Forms.Cursors.Default
        Me.Label6.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Label6.Location = New System.Drawing.Point(16, 98)
        Me.Label6.Name = "Label6"
        Me.Label6.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Label6.Size = New System.Drawing.Size(41, 17)
        Me.Label6.TabIndex = 18
        Me.Label6.Text = "Data :"
        '
        'Command3
        '
        Me.Command3.BackColor = System.Drawing.SystemColors.Control
        Me.Command3.Cursor = System.Windows.Forms.Cursors.Default
        Me.Command3.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Command3.Location = New System.Drawing.Point(16, 24)
        Me.Command3.Name = "Command3"
        Me.Command3.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Command3.Size = New System.Drawing.Size(89, 33)
        Me.Command3.TabIndex = 8
        Me.Command3.Text = "REQA"
        Me.Command3.UseVisualStyleBackColor = False
        '
        'Command4
        '
        Me.Command4.BackColor = System.Drawing.SystemColors.Control
        Me.Command4.Cursor = System.Windows.Forms.Cursors.Default
        Me.Command4.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Command4.Location = New System.Drawing.Point(120, 24)
        Me.Command4.Name = "Command4"
        Me.Command4.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Command4.Size = New System.Drawing.Size(185, 33)
        Me.Command4.TabIndex = 9
        Me.Command4.Text = "Anticollison & Select"
        Me.Command4.UseVisualStyleBackColor = False
        '
        'ComboKtype
        '
        Me.ComboKtype.BackColor = System.Drawing.SystemColors.Window
        Me.ComboKtype.Cursor = System.Windows.Forms.Cursors.Default
        Me.ComboKtype.ForeColor = System.Drawing.SystemColors.WindowText
        Me.ComboKtype.Location = New System.Drawing.Point(83, 72)
        Me.ComboKtype.Name = "ComboKtype"
        Me.ComboKtype.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.ComboKtype.Size = New System.Drawing.Size(73, 20)
        Me.ComboKtype.TabIndex = 12
        Me.ComboKtype.Text = "ComboKtype"
        '
        'BLnum
        '
        Me.BLnum.AcceptsReturn = True
        Me.BLnum.BackColor = System.Drawing.SystemColors.Window
        Me.BLnum.Cursor = System.Windows.Forms.Cursors.IBeam
        Me.BLnum.ForeColor = System.Drawing.SystemColors.WindowText
        Me.BLnum.Location = New System.Drawing.Point(244, 71)
        Me.BLnum.MaxLength = 0
        Me.BLnum.Name = "BLnum"
        Me.BLnum.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.BLnum.Size = New System.Drawing.Size(41, 21)
        Me.BLnum.TabIndex = 14
        Me.BLnum.Text = "1"
        '
        'KeyData
        '
        Me.KeyData.AcceptsReturn = True
        Me.KeyData.BackColor = System.Drawing.SystemColors.Window
        Me.KeyData.Cursor = System.Windows.Forms.Cursors.IBeam
        Me.KeyData.ForeColor = System.Drawing.SystemColors.WindowText
        Me.KeyData.Location = New System.Drawing.Point(319, 69)
        Me.KeyData.MaxLength = 12
        Me.KeyData.Name = "KeyData"
        Me.KeyData.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.KeyData.Size = New System.Drawing.Size(113, 21)
        Me.KeyData.TabIndex = 16
        Me.KeyData.Text = "FFFFFFFFFFFF"
        '
        'Command6
        '
        Me.Command6.BackColor = System.Drawing.SystemColors.Control
        Me.Command6.Cursor = System.Windows.Forms.Cursors.Default
        Me.Command6.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Command6.Location = New System.Drawing.Point(319, 24)
        Me.Command6.Name = "Command6"
        Me.Command6.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Command6.Size = New System.Drawing.Size(129, 33)
        Me.Command6.TabIndex = 17
        Me.Command6.Text = "AuthKey"
        Me.Command6.UseVisualStyleBackColor = False
        '
        'rvData
        '
        Me.rvData.AcceptsReturn = True
        Me.rvData.BackColor = System.Drawing.SystemColors.Window
        Me.rvData.Cursor = System.Windows.Forms.Cursors.IBeam
        Me.rvData.ForeColor = System.Drawing.SystemColors.WindowText
        Me.rvData.Location = New System.Drawing.Point(56, 98)
        Me.rvData.MaxLength = 32
        Me.rvData.Name = "rvData"
        Me.rvData.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.rvData.Size = New System.Drawing.Size(392, 21)
        Me.rvData.TabIndex = 19
        '
        'Command7
        '
        Me.Command7.BackColor = System.Drawing.SystemColors.Control
        Me.Command7.Cursor = System.Windows.Forms.Cursors.Default
        Me.Command7.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Command7.Location = New System.Drawing.Point(18, 125)
        Me.Command7.Name = "Command7"
        Me.Command7.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Command7.Size = New System.Drawing.Size(145, 33)
        Me.Command7.TabIndex = 20
        Me.Command7.Text = "Read"
        Me.Command7.UseVisualStyleBackColor = False
        '
        'Command8
        '
        Me.Command8.BackColor = System.Drawing.SystemColors.Control
        Me.Command8.Cursor = System.Windows.Forms.Cursors.Default
        Me.Command8.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Command8.Location = New System.Drawing.Point(176, 125)
        Me.Command8.Name = "Command8"
        Me.Command8.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Command8.Size = New System.Drawing.Size(129, 33)
        Me.Command8.TabIndex = 21
        Me.Command8.Text = "Write"
        Me.Command8.UseVisualStyleBackColor = False
        '
        'Frame3
        '
        Me.Frame3.BackColor = System.Drawing.SystemColors.Control
        Me.Frame3.Controls.Add(Me.Command8)
        Me.Frame3.Controls.Add(Me.Command7)
        Me.Frame3.Controls.Add(Me.rvData)
        Me.Frame3.Controls.Add(Me.Command6)
        Me.Frame3.Controls.Add(Me.KeyData)
        Me.Frame3.Controls.Add(Me.BLnum)
        Me.Frame3.Controls.Add(Me.ComboKtype)
        Me.Frame3.Controls.Add(Me.Command4)
        Me.Frame3.Controls.Add(Me.Command3)
        Me.Frame3.Controls.Add(Me.Label6)
        Me.Frame3.Controls.Add(Me.Label5)
        Me.Frame3.Controls.Add(Me.Label4)
        Me.Frame3.Controls.Add(Me.Label3)
        Me.Frame3.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Frame3.Location = New System.Drawing.Point(24, 177)
        Me.Frame3.Name = "Frame3"
        Me.Frame3.Padding = New System.Windows.Forms.Padding(0)
        Me.Frame3.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Frame3.Size = New System.Drawing.Size(462, 170)
        Me.Frame3.TabIndex = 7
        Me.Frame3.TabStop = False
        Me.Frame3.Text = " Mifare card test "
        '
        'Button_SendAPDU
        '
        Me.Button_SendAPDU.BackColor = System.Drawing.SystemColors.Control
        Me.Button_SendAPDU.Cursor = System.Windows.Forms.Cursors.Default
        Me.Button_SendAPDU.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Button_SendAPDU.Location = New System.Drawing.Point(176, 20)
        Me.Button_SendAPDU.Name = "Button_SendAPDU"
        Me.Button_SendAPDU.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Button_SendAPDU.Size = New System.Drawing.Size(129, 33)
        Me.Button_SendAPDU.TabIndex = 21
        Me.Button_SendAPDU.Text = "Send APDU"
        Me.Button_SendAPDU.UseVisualStyleBackColor = False
        '
        'GroupBox1
        '
        Me.GroupBox1.BackColor = System.Drawing.SystemColors.Control
        Me.GroupBox1.Controls.Add(Me.Button_SendAPDU)
        Me.GroupBox1.Controls.Add(Me.Button_DetectCard)
        Me.GroupBox1.Controls.Add(Me.TextBox_14443)
        Me.GroupBox1.Controls.Add(Me.Label7)
        Me.GroupBox1.ForeColor = System.Drawing.SystemColors.ControlText
        Me.GroupBox1.Location = New System.Drawing.Point(24, 353)
        Me.GroupBox1.Name = "GroupBox1"
        Me.GroupBox1.Padding = New System.Windows.Forms.Padding(0)
        Me.GroupBox1.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.GroupBox1.Size = New System.Drawing.Size(462, 96)
        Me.GroupBox1.TabIndex = 24
        Me.GroupBox1.TabStop = False
        Me.GroupBox1.Text = "14443 Card test "
        '
        'Button_DetectCard
        '
        Me.Button_DetectCard.BackColor = System.Drawing.SystemColors.Control
        Me.Button_DetectCard.Cursor = System.Windows.Forms.Cursors.Default
        Me.Button_DetectCard.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Button_DetectCard.Location = New System.Drawing.Point(18, 20)
        Me.Button_DetectCard.Name = "Button_DetectCard"
        Me.Button_DetectCard.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Button_DetectCard.Size = New System.Drawing.Size(145, 33)
        Me.Button_DetectCard.TabIndex = 20
        Me.Button_DetectCard.Text = "Detect Card"
        Me.Button_DetectCard.UseVisualStyleBackColor = False
        '
        'TextBox_14443
        '
        Me.TextBox_14443.AcceptsReturn = True
        Me.TextBox_14443.BackColor = System.Drawing.SystemColors.Window
        Me.TextBox_14443.Cursor = System.Windows.Forms.Cursors.IBeam
        Me.TextBox_14443.ForeColor = System.Drawing.SystemColors.WindowText
        Me.TextBox_14443.Location = New System.Drawing.Point(56, 62)
        Me.TextBox_14443.MaxLength = 32
        Me.TextBox_14443.Name = "TextBox_14443"
        Me.TextBox_14443.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.TextBox_14443.Size = New System.Drawing.Size(392, 21)
        Me.TextBox_14443.TabIndex = 19
        '
        'Label7
        '
        Me.Label7.BackColor = System.Drawing.SystemColors.Control
        Me.Label7.Cursor = System.Windows.Forms.Cursors.Default
        Me.Label7.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Label7.Location = New System.Drawing.Point(16, 62)
        Me.Label7.Name = "Label7"
        Me.Label7.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Label7.Size = New System.Drawing.Size(41, 17)
        Me.Label7.TabIndex = 18
        Me.Label7.Text = "Data :"
        '
        'GroupBox2
        '
        Me.GroupBox2.BackColor = System.Drawing.SystemColors.Control
        Me.GroupBox2.Controls.Add(Me.TextBox_TX)
        Me.GroupBox2.Controls.Add(Me.Label9)
        Me.GroupBox2.Controls.Add(Me.Button_Polling)
        Me.GroupBox2.Controls.Add(Me.TextBox_RX)
        Me.GroupBox2.Controls.Add(Me.Label8)
        Me.GroupBox2.ForeColor = System.Drawing.SystemColors.ControlText
        Me.GroupBox2.Location = New System.Drawing.Point(24, 455)
        Me.GroupBox2.Name = "GroupBox2"
        Me.GroupBox2.Padding = New System.Windows.Forms.Padding(0)
        Me.GroupBox2.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.GroupBox2.Size = New System.Drawing.Size(462, 96)
        Me.GroupBox2.TabIndex = 25
        Me.GroupBox2.TabStop = False
        Me.GroupBox2.Text = "TRX test "
        '
        'TextBox_TX
        '
        Me.TextBox_TX.AcceptsReturn = True
        Me.TextBox_TX.BackColor = System.Drawing.SystemColors.Window
        Me.TextBox_TX.Cursor = System.Windows.Forms.Cursors.IBeam
        Me.TextBox_TX.ForeColor = System.Drawing.SystemColors.WindowText
        Me.TextBox_TX.Location = New System.Drawing.Point(40, 32)
        Me.TextBox_TX.MaxLength = 32
        Me.TextBox_TX.Name = "TextBox_TX"
        Me.TextBox_TX.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.TextBox_TX.Size = New System.Drawing.Size(330, 21)
        Me.TextBox_TX.TabIndex = 22
        '
        'Label9
        '
        Me.Label9.BackColor = System.Drawing.SystemColors.Control
        Me.Label9.Cursor = System.Windows.Forms.Cursors.Default
        Me.Label9.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Label9.Location = New System.Drawing.Point(16, 35)
        Me.Label9.Name = "Label9"
        Me.Label9.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Label9.Size = New System.Drawing.Size(23, 21)
        Me.Label9.TabIndex = 21
        Me.Label9.Text = "TX"
        '
        'Button_Polling
        '
        Me.Button_Polling.BackColor = System.Drawing.SystemColors.Control
        Me.Button_Polling.Cursor = System.Windows.Forms.Cursors.Default
        Me.Button_Polling.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Button_Polling.Location = New System.Drawing.Point(380, 17)
        Me.Button_Polling.Name = "Button_Polling"
        Me.Button_Polling.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Button_Polling.Size = New System.Drawing.Size(68, 63)
        Me.Button_Polling.TabIndex = 20
        Me.Button_Polling.Text = "Send"
        Me.Button_Polling.UseVisualStyleBackColor = False
        '
        'TextBox_RX
        '
        Me.TextBox_RX.AcceptsReturn = True
        Me.TextBox_RX.BackColor = System.Drawing.SystemColors.Window
        Me.TextBox_RX.Cursor = System.Windows.Forms.Cursors.IBeam
        Me.TextBox_RX.ForeColor = System.Drawing.SystemColors.WindowText
        Me.TextBox_RX.Location = New System.Drawing.Point(40, 59)
        Me.TextBox_RX.MaxLength = 32
        Me.TextBox_RX.Name = "TextBox_RX"
        Me.TextBox_RX.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.TextBox_RX.Size = New System.Drawing.Size(330, 21)
        Me.TextBox_RX.TabIndex = 19
        '
        'Label8
        '
        Me.Label8.BackColor = System.Drawing.SystemColors.Control
        Me.Label8.Cursor = System.Windows.Forms.Cursors.Default
        Me.Label8.ForeColor = System.Drawing.SystemColors.ControlText
        Me.Label8.Location = New System.Drawing.Point(16, 62)
        Me.Label8.Name = "Label8"
        Me.Label8.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Label8.Size = New System.Drawing.Size(23, 21)
        Me.Label8.TabIndex = 18
        Me.Label8.Text = "RX"
        '
        'TestForm
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(7.0!, 12.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.BackColor = System.Drawing.SystemColors.Control
        Me.ClientSize = New System.Drawing.Size(498, 733)
        Me.Controls.Add(Me.GroupBox2)
        Me.Controls.Add(Me.GroupBox1)
        Me.Controls.Add(Me.TxtResult)
        Me.Controls.Add(Me.Command9)
        Me.Controls.Add(Me.Frame3)
        Me.Controls.Add(Me.Frame2)
        Me.Controls.Add(Me.Frame1)
        Me.Cursor = System.Windows.Forms.Cursors.Default
        Me.Location = New System.Drawing.Point(4, 30)
        Me.Name = "TestForm"
        Me.RightToLeft = System.Windows.Forms.RightToLeft.No
        Me.Text = "TestSample_VB"
        Me.Frame2.ResumeLayout(False)
        Me.Frame1.ResumeLayout(False)
        Me.Frame3.ResumeLayout(False)
        Me.Frame3.PerformLayout()
        Me.GroupBox1.ResumeLayout(False)
        Me.GroupBox1.PerformLayout()
        Me.GroupBox2.ResumeLayout(False)
        Me.GroupBox2.PerformLayout()
        Me.ResumeLayout(False)
        Me.PerformLayout()

    End Sub
    Public WithEvents Button_Refresh As System.Windows.Forms.Button
    Public WithEvents Label3 As System.Windows.Forms.Label
    Public WithEvents Label4 As System.Windows.Forms.Label
    Public WithEvents Label5 As System.Windows.Forms.Label
    Public WithEvents Label6 As System.Windows.Forms.Label
    Public WithEvents Command3 As System.Windows.Forms.Button
    Public WithEvents Command4 As System.Windows.Forms.Button
    Public WithEvents ComboKtype As System.Windows.Forms.ComboBox
    Public WithEvents BLnum As System.Windows.Forms.TextBox
    Public WithEvents KeyData As System.Windows.Forms.TextBox
    Public WithEvents Command6 As System.Windows.Forms.Button
    Public WithEvents rvData As System.Windows.Forms.TextBox
    Public WithEvents Command7 As System.Windows.Forms.Button
    Public WithEvents Command8 As System.Windows.Forms.Button
    Public WithEvents Frame3 As System.Windows.Forms.GroupBox
    Public WithEvents Button_SendAPDU As System.Windows.Forms.Button
    Public WithEvents GroupBox1 As System.Windows.Forms.GroupBox
    Public WithEvents Button_DetectCard As System.Windows.Forms.Button
    Public WithEvents TextBox_14443 As System.Windows.Forms.TextBox
    Public WithEvents Label7 As System.Windows.Forms.Label
    Public WithEvents GroupBox2 As System.Windows.Forms.GroupBox
    Public WithEvents Button_Polling As System.Windows.Forms.Button
    Public WithEvents TextBox_RX As System.Windows.Forms.TextBox
    Public WithEvents Label8 As System.Windows.Forms.Label
    Public WithEvents TextBox_TX As System.Windows.Forms.TextBox
    Public WithEvents Label9 As System.Windows.Forms.Label
#End Region 
End Class