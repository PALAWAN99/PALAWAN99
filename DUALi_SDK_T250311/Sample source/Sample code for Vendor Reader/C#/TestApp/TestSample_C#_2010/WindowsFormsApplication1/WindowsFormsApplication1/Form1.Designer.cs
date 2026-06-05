namespace WindowsFormsApplication1
{
    partial class Form1
    {
        /// <summary>
        /// 필수 디자이너 변수입니다.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 사용 중인 모든 리소스를 정리합니다.
        /// </summary>
        /// <param name="disposing">관리되는 리소스를 삭제해야 하면 true이고, 그렇지 않으면 false입니다.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form 디자이너에서 생성한 코드

        /// <summary>
        /// 디자이너 지원에 필요한 메서드입니다.
        /// 이 메서드의 내용을 코드 편집기로 수정하지 마십시오.
        /// </summary>
        private void InitializeComponent()
        {
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.REFRESH = new System.Windows.Forms.Button();
            this.CB_Device = new System.Windows.Forms.ComboBox();
            this.ConnectDevice = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.GetVersion = new System.Windows.Forms.Button();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.Mi_Write = new System.Windows.Forms.Button();
            this.Mi_Read = new System.Windows.Forms.Button();
            this.EB_Data = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.Mi_Auth = new System.Windows.Forms.Button();
            this.label5 = new System.Windows.Forms.Label();
            this.EB_KEY = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.Anticollision = new System.Windows.Forms.Button();
            this.EB_BlockNum = new System.Windows.Forms.TextBox();
            this.CB_KeyType = new System.Windows.Forms.ComboBox();
            this.REAQ = new System.Windows.Forms.Button();
            this.label3 = new System.Windows.Forms.Label();
            this.groupBox4 = new System.Windows.Forms.GroupBox();
            this.label9 = new System.Windows.Forms.Label();
            this.EB_APDU = new System.Windows.Forms.TextBox();
            this.DETECTCARD = new System.Windows.Forms.Button();
            this.SENDAPDU = new System.Windows.Forms.Button();
            this.listView1 = new System.Windows.Forms.ListView();
            this.Clear = new System.Windows.Forms.Button();
            this.label8 = new System.Windows.Forms.Label();
            this.textBox_TX = new System.Windows.Forms.TextBox();
            this.Sendbutton = new System.Windows.Forms.Button();
            this.textBox_RX = new System.Windows.Forms.TextBox();
            this.label7 = new System.Windows.Forms.Label();
            this.groupBox5 = new System.Windows.Forms.GroupBox();
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.groupBox3.SuspendLayout();
            this.groupBox4.SuspendLayout();
            this.groupBox5.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.REFRESH);
            this.groupBox1.Controls.Add(this.CB_Device);
            this.groupBox1.Controls.Add(this.ConnectDevice);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Location = new System.Drawing.Point(17, 2);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(528, 61);
            this.groupBox1.TabIndex = 0;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Connect";
            // 
            // REFRESH
            // 
            this.REFRESH.Location = new System.Drawing.Point(424, 20);
            this.REFRESH.Name = "REFRESH";
            this.REFRESH.Size = new System.Drawing.Size(94, 31);
            this.REFRESH.TabIndex = 4;
            this.REFRESH.Text = "Refresh";
            this.REFRESH.UseVisualStyleBackColor = true;
            this.REFRESH.Click += new System.EventHandler(this.REFRESH_Click);
            // 
            // CB_Device
            // 
            this.CB_Device.FormattingEnabled = true;
            this.CB_Device.Location = new System.Drawing.Point(67, 23);
            this.CB_Device.Name = "CB_Device";
            this.CB_Device.Size = new System.Drawing.Size(227, 20);
            this.CB_Device.TabIndex = 3;
            this.CB_Device.SelectedIndexChanged += new System.EventHandler(this.comboBox1_SelectedIndexChanged);
            // 
            // ConnectDevice
            // 
            this.ConnectDevice.Location = new System.Drawing.Point(295, 20);
            this.ConnectDevice.Name = "ConnectDevice";
            this.ConnectDevice.Size = new System.Drawing.Size(127, 31);
            this.ConnectDevice.TabIndex = 2;
            this.ConnectDevice.Text = "Connect Device";
            this.ConnectDevice.UseVisualStyleBackColor = true;
            this.ConnectDevice.Click += new System.EventHandler(this.ConnectDevice_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(13, 25);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(51, 12);
            this.label1.TabIndex = 0;
            this.label1.Text = "Device :";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.textBox1);
            this.groupBox2.Controls.Add(this.GetVersion);
            this.groupBox2.Location = new System.Drawing.Point(17, 69);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(528, 66);
            this.groupBox2.TabIndex = 4;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Get Device Version";
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(21, 24);
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(329, 21);
            this.textBox1.TabIndex = 3;
            // 
            // GetVersion
            // 
            this.GetVersion.Location = new System.Drawing.Point(356, 19);
            this.GetVersion.Name = "GetVersion";
            this.GetVersion.Size = new System.Drawing.Size(157, 31);
            this.GetVersion.TabIndex = 2;
            this.GetVersion.Text = "Get Version";
            this.GetVersion.UseVisualStyleBackColor = true;
            this.GetVersion.Click += new System.EventHandler(this.GetVersion_Click);
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.Mi_Write);
            this.groupBox3.Controls.Add(this.Mi_Read);
            this.groupBox3.Controls.Add(this.EB_Data);
            this.groupBox3.Controls.Add(this.label6);
            this.groupBox3.Controls.Add(this.Mi_Auth);
            this.groupBox3.Controls.Add(this.label5);
            this.groupBox3.Controls.Add(this.EB_KEY);
            this.groupBox3.Controls.Add(this.label2);
            this.groupBox3.Controls.Add(this.Anticollision);
            this.groupBox3.Controls.Add(this.EB_BlockNum);
            this.groupBox3.Controls.Add(this.CB_KeyType);
            this.groupBox3.Controls.Add(this.REAQ);
            this.groupBox3.Controls.Add(this.label3);
            this.groupBox3.Location = new System.Drawing.Point(17, 137);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(528, 173);
            this.groupBox3.TabIndex = 4;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "Mifare Card Test";
            // 
            // Mi_Write
            // 
            this.Mi_Write.Location = new System.Drawing.Point(250, 140);
            this.Mi_Write.Name = "Mi_Write";
            this.Mi_Write.Size = new System.Drawing.Size(153, 27);
            this.Mi_Write.TabIndex = 14;
            this.Mi_Write.Text = "WRITE";
            this.Mi_Write.UseVisualStyleBackColor = true;
            this.Mi_Write.Click += new System.EventHandler(this.Mi_Write_Click);
            // 
            // Mi_Read
            // 
            this.Mi_Read.Location = new System.Drawing.Point(43, 140);
            this.Mi_Read.Name = "Mi_Read";
            this.Mi_Read.Size = new System.Drawing.Size(153, 27);
            this.Mi_Read.TabIndex = 13;
            this.Mi_Read.Text = "READ";
            this.Mi_Read.UseVisualStyleBackColor = true;
            this.Mi_Read.Click += new System.EventHandler(this.Mi_Read_Click);
            // 
            // EB_Data
            // 
            this.EB_Data.Location = new System.Drawing.Point(96, 113);
            this.EB_Data.Name = "EB_Data";
            this.EB_Data.Size = new System.Drawing.Size(312, 21);
            this.EB_Data.TabIndex = 12;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(19, 116);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(42, 12);
            this.label6.TabIndex = 11;
            this.label6.Text = "Data : ";
            // 
            // Mi_Auth
            // 
            this.Mi_Auth.Location = new System.Drawing.Point(365, 20);
            this.Mi_Auth.Name = "Mi_Auth";
            this.Mi_Auth.Size = new System.Drawing.Size(128, 31);
            this.Mi_Auth.TabIndex = 4;
            this.Mi_Auth.Text = "AuthKey";
            this.Mi_Auth.UseVisualStyleBackColor = true;
            this.Mi_Auth.Click += new System.EventHandler(this.Mi_Auth_Click);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(19, 90);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(64, 12);
            this.label5.TabIndex = 9;
            this.label5.Text = "Key :    0x";
            // 
            // EB_KEY
            // 
            this.EB_KEY.Location = new System.Drawing.Point(96, 84);
            this.EB_KEY.Name = "EB_KEY";
            this.EB_KEY.Size = new System.Drawing.Size(198, 21);
            this.EB_KEY.TabIndex = 8;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(217, 60);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(97, 12);
            this.label2.TabIndex = 7;
            this.label2.Text = "Block Number : ";
            // 
            // Anticollision
            // 
            this.Anticollision.Location = new System.Drawing.Point(159, 20);
            this.Anticollision.Name = "Anticollision";
            this.Anticollision.Size = new System.Drawing.Size(198, 31);
            this.Anticollision.TabIndex = 5;
            this.Anticollision.Text = "ANTICOLLISION && SELECT";
            this.Anticollision.UseVisualStyleBackColor = true;
            this.Anticollision.Click += new System.EventHandler(this.Anticollision_Click);
            // 
            // EB_BlockNum
            // 
            this.EB_BlockNum.Location = new System.Drawing.Point(333, 57);
            this.EB_BlockNum.Name = "EB_BlockNum";
            this.EB_BlockNum.Size = new System.Drawing.Size(57, 21);
            this.EB_BlockNum.TabIndex = 4;
            // 
            // CB_KeyType
            // 
            this.CB_KeyType.FormattingEnabled = true;
            this.CB_KeyType.Location = new System.Drawing.Point(96, 57);
            this.CB_KeyType.Name = "CB_KeyType";
            this.CB_KeyType.Size = new System.Drawing.Size(103, 20);
            this.CB_KeyType.TabIndex = 3;
            // 
            // REAQ
            // 
            this.REAQ.Location = new System.Drawing.Point(23, 20);
            this.REAQ.Name = "REAQ";
            this.REAQ.Size = new System.Drawing.Size(128, 31);
            this.REAQ.TabIndex = 2;
            this.REAQ.Text = "REQA";
            this.REAQ.UseVisualStyleBackColor = true;
            this.REAQ.Click += new System.EventHandler(this.REAQ_Click);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(19, 60);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(68, 12);
            this.label3.TabIndex = 0;
            this.label3.Text = "Key Type :";
            // 
            // groupBox4
            // 
            this.groupBox4.Controls.Add(this.label9);
            this.groupBox4.Controls.Add(this.EB_APDU);
            this.groupBox4.Controls.Add(this.DETECTCARD);
            this.groupBox4.Controls.Add(this.SENDAPDU);
            this.groupBox4.Location = new System.Drawing.Point(17, 316);
            this.groupBox4.Name = "groupBox4";
            this.groupBox4.Size = new System.Drawing.Size(528, 79);
            this.groupBox4.TabIndex = 4;
            this.groupBox4.TabStop = false;
            this.groupBox4.Text = "14443 Card Test";
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(19, 56);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(45, 12);
            this.label9.TabIndex = 18;
            this.label9.Text = "APDU :";
            // 
            // EB_APDU
            // 
            this.EB_APDU.Location = new System.Drawing.Point(67, 53);
            this.EB_APDU.Name = "EB_APDU";
            this.EB_APDU.Size = new System.Drawing.Size(446, 21);
            this.EB_APDU.TabIndex = 17;
            // 
            // DETECTCARD
            // 
            this.DETECTCARD.Location = new System.Drawing.Point(6, 17);
            this.DETECTCARD.Name = "DETECTCARD";
            this.DETECTCARD.Size = new System.Drawing.Size(128, 31);
            this.DETECTCARD.TabIndex = 15;
            this.DETECTCARD.Text = "Detect Card";
            this.DETECTCARD.UseVisualStyleBackColor = true;
            this.DETECTCARD.Click += new System.EventHandler(this.DetectCard_Click);
            // 
            // SENDAPDU
            // 
            this.SENDAPDU.Location = new System.Drawing.Point(143, 17);
            this.SENDAPDU.Name = "SENDAPDU";
            this.SENDAPDU.Size = new System.Drawing.Size(128, 31);
            this.SENDAPDU.TabIndex = 16;
            this.SENDAPDU.Text = "Send APDU";
            this.SENDAPDU.UseVisualStyleBackColor = true;
            this.SENDAPDU.Click += new System.EventHandler(this.SendAPDU_Click);
            // 
            // listView1
            // 
            this.listView1.Location = new System.Drawing.Point(12, 484);
            this.listView1.Name = "listView1";
            this.listView1.Size = new System.Drawing.Size(355, 151);
            this.listView1.TabIndex = 5;
            this.listView1.UseCompatibleStateImageBehavior = false;
            this.listView1.View = System.Windows.Forms.View.Tile;
            // 
            // Clear
            // 
            this.Clear.Location = new System.Drawing.Point(382, 580);
            this.Clear.Name = "Clear";
            this.Clear.Size = new System.Drawing.Size(86, 55);
            this.Clear.TabIndex = 18;
            this.Clear.Text = "List clear";
            this.Clear.UseVisualStyleBackColor = true;
            this.Clear.Click += new System.EventHandler(this.Clear_Click);
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(17, 22);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(21, 12);
            this.label8.TabIndex = 21;
            this.label8.Text = "TX";
            // 
            // textBox_TX
            // 
            this.textBox_TX.Location = new System.Drawing.Point(44, 19);
            this.textBox_TX.Name = "textBox_TX";
            this.textBox_TX.Size = new System.Drawing.Size(392, 21);
            this.textBox_TX.TabIndex = 17;
            // 
            // Sendbutton
            // 
            this.Sendbutton.Location = new System.Drawing.Point(441, 19);
            this.Sendbutton.Name = "Sendbutton";
            this.Sendbutton.Size = new System.Drawing.Size(72, 49);
            this.Sendbutton.TabIndex = 22;
            this.Sendbutton.Text = "SEND";
            this.Sendbutton.UseVisualStyleBackColor = true;
            this.Sendbutton.Click += new System.EventHandler(this.Sendbutton_Click);
            // 
            // textBox_RX
            // 
            this.textBox_RX.Location = new System.Drawing.Point(43, 47);
            this.textBox_RX.Name = "textBox_RX";
            this.textBox_RX.Size = new System.Drawing.Size(392, 21);
            this.textBox_RX.TabIndex = 23;
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(16, 50);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(21, 12);
            this.label7.TabIndex = 24;
            this.label7.Text = "RX";
            // 
            // groupBox5
            // 
            this.groupBox5.Controls.Add(this.textBox_RX);
            this.groupBox5.Controls.Add(this.label7);
            this.groupBox5.Controls.Add(this.Sendbutton);
            this.groupBox5.Controls.Add(this.textBox_TX);
            this.groupBox5.Controls.Add(this.label8);
            this.groupBox5.Location = new System.Drawing.Point(17, 401);
            this.groupBox5.Name = "groupBox5";
            this.groupBox5.Size = new System.Drawing.Size(528, 77);
            this.groupBox5.TabIndex = 25;
            this.groupBox5.TabStop = false;
            this.groupBox5.Text = "TRX Test";
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(555, 645);
            this.Controls.Add(this.Clear);
            this.Controls.Add(this.listView1);
            this.Controls.Add(this.groupBox4);
            this.Controls.Add(this.groupBox3);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.groupBox5);
            this.Name = "Form1";
            this.Text = "TestSample";
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.groupBox3.ResumeLayout(false);
            this.groupBox3.PerformLayout();
            this.groupBox4.ResumeLayout(false);
            this.groupBox4.PerformLayout();
            this.groupBox5.ResumeLayout(false);
            this.groupBox5.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox CB_Device;
        private System.Windows.Forms.Button ConnectDevice;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.Button GetVersion;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.Button Anticollision;
        private System.Windows.Forms.TextBox EB_BlockNum;
        private System.Windows.Forms.ComboBox CB_KeyType;
        private System.Windows.Forms.Button REAQ;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.GroupBox groupBox4;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Button Mi_Auth;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox EB_KEY;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Button Mi_Write;
        private System.Windows.Forms.Button Mi_Read;
        private System.Windows.Forms.TextBox EB_Data;
        private System.Windows.Forms.Button DETECTCARD;
        private System.Windows.Forms.Button SENDAPDU;
        private System.Windows.Forms.ListView listView1;
        private System.Windows.Forms.Button Clear;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.TextBox textBox_TX;
        private System.Windows.Forms.Button Sendbutton;
        private System.Windows.Forms.TextBox textBox_RX;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Button REFRESH;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.TextBox EB_APDU;
        private System.Windows.Forms.GroupBox groupBox5;
    }
}

