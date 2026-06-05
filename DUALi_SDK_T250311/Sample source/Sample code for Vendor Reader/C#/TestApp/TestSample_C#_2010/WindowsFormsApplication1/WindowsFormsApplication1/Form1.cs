using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.Threading;

namespace WindowsFormsApplication1
{
    public partial class Form1 : Form
    {
        //public const MAX_DATA_LENGH = 1024;
        public string m_strKey;
        public string m_strblock;
        public string m_strData;

        public int m_nPort;
        public string m_strUID;
        public bool m_bConnect;
        public byte[] m_pIdentifier = new byte[4];
        public StringBuilder SB = new StringBuilder();

        public Form1()
        {
            InitializeComponent();

            GetDeviceList();

            this.CB_KeyType.Items.Add("A Key");
            this.CB_KeyType.Items.Add("B Key");

            this.EB_KEY.Text = "FFFFFFFFFFFF";
                        
            this.CB_KeyType.SelectedIndex = 0;

        }

        public void AddList(int ret, int rlen, byte[] rbuf)
        {
            string msg;
            int idx = this.listView1.Items.Count;

            if (ret != 0)
            {
                Duali.Class1.GetErrMsg(ret, SB);
                msg = String.Format("<=[ERR] {0:d}", ret);
                msg += "(" + SB.ToString() + ")";                                
            }
            else
            {
                msg = HexToString(rbuf, rlen);
                msg = "<=" + msg;
            }

            this.listView1.Items.Insert(idx, msg);                
            this.listView1.EnsureVisible(idx - 1);
        }

        private void ConnectDevice_Click(object sender, EventArgs e)
        {
            string strport,strtmp;
            int nidx,nret;

            if (!m_bConnect)
            {
                nidx = this.CB_Device.SelectedIndex;
                strport = this.CB_Device.SelectedItem as string;
                if (strport.Substring(0, 3) == "COM")
                {
                    strtmp = strport.Substring(3);
                    m_nPort = Convert.ToInt32(strtmp);
                }
                else
                    m_nPort = 100 + nidx;

                nret = Duali.Class1.DE_InitPort(m_nPort, 115200);
                if (nret == m_nPort)
                {
                    m_bConnect = true;
                    Duali.Class1.DE_BuzzerOn(m_nPort);
                    Thread.Sleep(100);
                    Duali.Class1.DE_BuzzerOff(m_nPort);
                    this.ConnectDevice.Text = "Disconnect device";
                }
                else
                {
                    MessageBox.Show("Failed to connect device");
                }
            }
            else
            {
                m_nPort = 0;
                m_bConnect = false;
                Duali.Class1.DE_ClosePort(m_nPort);
                Duali.Class1.DE_BuzzerOn(m_nPort);
                //Sleep(100);
                Duali.Class1.DE_BuzzerOff(m_nPort);
                Duali.Class1.DE_BuzzerOn(m_nPort);
                //Sleep(100);
                Duali.Class1.DE_BuzzerOff(m_nPort);
                this.ConnectDevice.Text = "Connect device";
            }
        }

        private void GetVersion_Click(object sender, EventArgs e)
        {
            if(!m_bConnect)
        	{
        		MessageBox.Show("Device is not connected");
        		return ;
        	}

        	int outlen;
            byte[] lpRes = new byte[256];
        	string strtmp;
            int ret;
            StringBuilder SB = new StringBuilder();

        	//memset(lpRes,0x00,256);
            ret = Duali.Class1.DE_GetVersion(m_nPort, out outlen, lpRes);
            if (ret == 0)
            {
                strtmp = System.Text.Encoding.Default.GetString(lpRes, 1, outlen - 1);
                this.textBox1.Text = strtmp;
            }
            else
            {
                Duali.Class1.GetErrMsg(ret, SB);
                strtmp = String.Format("<=[ERR] {0:d}", ret);
                strtmp += "(" + SB.ToString() + ")";
                this.listView1.Items.Add(strtmp);
            }
        }

        private void REAQ_Click(object sender, EventArgs e)
        {
            int ret;
            int outlen;
        	byte []lpRes = new byte[256];
                        
        	this.listView1.Items.Add("=> 21");
            ret = Duali.Class1.DEA_Idle_Req(m_nPort, out outlen, lpRes);
        	if(ret != 0)
                ret = Duali.Class1.DEA_Idle_Req(m_nPort, out outlen, lpRes);
            AddList(ret, outlen, lpRes);
        }

        private void Anticollision_Click(object sender, EventArgs e)
        {
            int ret;
	        int outlen;
            byte[] lpRes = new byte[256];
            	        
        	this.listView1.Items.Add("=> 3D");

            ret = Duali.Class1.DEA_AntiSelLevel(m_nPort, out outlen, lpRes);
            AddList(ret, outlen, lpRes);

	        if(ret == 0)
        	{
                m_strUID = HexToString(lpRes, outlen);
                m_strUID = m_strUID.Substring(2);
        	}        	
        }
        
        private void Mi_Auth_Click(object sender, EventArgs e)
        {
            byte keytype, blocknum;
	        byte[] keydata = new byte[6];
            byte[] RBUF = new byte[256]; 
            int ret;
	        string strtmp;

            m_strKey = this.EB_KEY.Text;
            m_strKey.Replace(" ", "");
	        if(m_strKey.Length != 12)
	        {
                MessageBox.Show("Key length Error\nKey length should be 6bytes");
		        return ;
	        }
	        keydata = StringToBytes(m_strKey);

            m_strblock = this.EB_BlockNum.Text;
            m_strblock.Replace(" ", "");
	        if(m_strblock.Length == 0)
	        {
                MessageBox.Show("There is no block number");
		        return ;
	        }
            ret = Convert.ToInt32(m_strblock, 16);
            blocknum = Convert.ToByte(ret);

	        if(blocknum < 0 || blocknum > 255)
	        {
                MessageBox.Show("Block number Error");
		        return ;
	        }

            strtmp = this.CB_KeyType.Text;
	        if(strtmp == "A Key")
		        keytype = 0x00;
	        else if(strtmp == "B Key")
		        keytype = 0x04;
            else 
            {
                MessageBox.Show("Key Type Error");
		        return ;
	        }

            strtmp = String.Format("=> 30{0:x2}{1:s}{2:d2}", keytype, m_strKey, blocknum);
	        this.listView1.Items.Add(strtmp);

	        ret = Duali.Class1.DEA_Authkey(m_nPort, keytype, keydata, blocknum);
            if (ret == 0)
            {
                strtmp = String.Format("<= {0:d2}", ret);
                this.listView1.Items.Add(strtmp);
                this.listView1.EnsureVisible(this.listView1.Items.Count - 1); 
            }
            else
            {
                AddList(ret, 0, null);
            }
        }

        private void Mi_Read_Click(object sender, EventArgs e)
        {
            byte blocknum;
	        int ret,outlen;
            byte[] RBUF = new byte[256];
	        string strtmp;
	        
	        m_strblock = this.EB_BlockNum.Text;
            m_strblock.Replace(" ", "");
	        if(m_strblock.Length == 0)
	        {
		        MessageBox.Show("There is no block number");
		        return ;
	        }
	        ret = Convert.ToInt32(m_strblock, 16);
            blocknum = Convert.ToByte(ret);
	        if(blocknum < 0 || blocknum > 255)
	        {
		        MessageBox.Show("Block number Error");
		        return ;
	        }

            strtmp = String.Format("=> 27{0:d2}", blocknum);
	        this.listView1.Items.Add(strtmp);

	        ret = Duali.Class1.DEA_Read(m_nPort, blocknum, out outlen, RBUF);
	        if(ret == 0)
	        {                
                strtmp = HexToString(RBUF, outlen);
                strtmp = strtmp.Substring(2);
                this.EB_Data.Text = strtmp;
	        }
            AddList(ret, outlen, RBUF);
        }

        private void Mi_Write_Click(object sender, EventArgs e)
        {
            byte blocknum;
	        int ret;
	        byte[] RBUF = new byte[256];
	        byte[] SBUF = new byte[256];
            StringBuilder SB = new StringBuilder();
	        string strtmp,strtmp2;

            m_strData = this.EB_Data.Text;
            m_strData.Replace(" ", "");
	        if(m_strData.Length != 32)
	        {
		        MessageBox.Show("Data length Error");
		        return ;
	        }

            m_strblock = this.EB_BlockNum.Text;
            m_strblock.Replace(" ", "");
	        if(m_strblock.Length== 0)
	        {
		        MessageBox.Show("There is no block number");
		        return ;
	        }
            ret = Convert.ToInt32(m_strblock, 16);
            blocknum = Convert.ToByte(ret);
	        if(blocknum < 0 || blocknum > 255)
	        {
		        MessageBox.Show("Block number Error");
		        return ;
	        }

            SBUF = StringToBytes(m_strData);
	        strtmp2 = String.Format("=> 28{0:d2}{1:s}",blocknum,m_strData);
            this.listView1.Items.Add(strtmp2);

	        ret = Duali.Class1.DEA_Write(m_nPort, blocknum, 16, SBUF);
        	
	        if(ret == 0)
	        {
		        strtmp = String.Format("<= {0:d2}",ret);
                this.listView1.Items.Add(strtmp);
                this.listView1.EnsureVisible(this.listView1.Items.Count - 1); 
	        }
	        else
	        {
                AddList(ret, 0, null);
	        }
        }

        private void DetectCard_Click(object sender, EventArgs e)
        {
            byte[] SBUF = new byte[1024];
	        byte[] RBUF = new byte[1024];
            
            int nRLen = 0;
	        int nRet;
        	
	        if(m_nPort == 0)
	        {
		        MessageBox.Show("Device is not connected");
		        return ;
	        }

            this.listView1.Items.Add("=> Detect Card");
            nRet = Duali.Class1.DE_FindCard(m_nPort, 0, 0, 0, 0, out nRLen,RBUF);
            AddList(nRet, nRLen, RBUF);
        }

        private void SendAPDU_Click(object sender, EventArgs e)
        {
            byte[] SBUF = new byte[1024];
	        byte[] RBUF = new byte[1024];
            int nSLen = 0;
            int nRLen = 0;
	        int nRet;
        	
	        string strtmp;
        	
	        if(m_nPort == 0)
	        {
		        MessageBox.Show("Device is not connected");
		        return ;
	        }

            m_strData = this.EB_APDU.Text;
            m_strData.Replace(" ", "");
            nSLen = m_strData.Length / 2;
            if (nSLen == 0)
            {
                MessageBox.Show("Please, input APDU");
                return;
            }

            SBUF = StringToBytes(m_strData);            
            strtmp = String.Format("=> 61{0:s}", m_strData);
            this.listView1.Items.Add(strtmp);

            nRet = Duali.Class1.DE_APDU(m_nPort, nSLen, SBUF, out nRLen, RBUF);
            AddList(nRet, nRLen, RBUF);
        }

        private void Clear_Click(object sender, EventArgs e)
        {
            this.listView1.Items.Clear();
        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (m_bConnect)
            {
                m_bConnect = false;
                Duali.Class1.DE_ClosePort(m_nPort);
                Duali.Class1.DE_BuzzerOn(m_nPort);
                //Sleep(100);
                Duali.Class1.DE_BuzzerOff(m_nPort);
                Duali.Class1.DE_BuzzerOn(m_nPort);
                //Sleep(100);
                Duali.Class1.DE_BuzzerOff(m_nPort);
                this.ConnectDevice.Text = "Connect device";
            }	
        }

        public void GetDeviceList()
        {
            int i,cnt;
            string strdev;
            this.CB_Device.Items.Clear();

            cnt = Duali.Class1.DE_GetUSBDeviceList(1);

            for (i = 0; i < cnt; i++)
            {
                Duali.Class1.DE_GetUSBDeviceName(i, SB);
                strdev = SB.ToString();               
                this.CB_Device.Items.Add(strdev);
            }

            if(cnt > 0)
                this.CB_Device.SelectedIndex = 0;
        }

        String HexToString(Byte[] pInput, int nLen)
        {
            StringBuilder strTemp = new StringBuilder(nLen * 2);
            int i = 0;
            foreach (byte pTemp in pInput)
            {
                i++;
                strTemp.AppendFormat("{0:x2}", pTemp);

                if (i == nLen)
                    break;
            }
            return strTemp.ToString();
        }

        String InttoString(int ret)
        {
            StringBuilder strTemp = new StringBuilder(2);

            strTemp.AppendFormat("{0:d2}", ret);

            return strTemp.ToString();
        }

        byte[] StringToBytes(string str)
        {
            string[] hexValuesSplit = new string[str.Length / 2];
            byte[] byteArray = new byte[hexValuesSplit.Length];
            int i = 0;

            for (i = 0; i < str.Length / 2; i++)
            {
                hexValuesSplit[i] = str.Substring(i * 2, 2);
            }

            i = 0;
            foreach (String hex in hexValuesSplit)
            {
                // 16진수를 Integer 로 변환
                int value = Convert.ToInt32(hex, 16);
                // Integer 를 byte 로 변환
                byte bytevalue = Convert.ToByte(value);

                byteArray[i++] = bytevalue;
            }

            return byteArray;
        }
        
        void ByteArrayCopy( byte[] Result , int ResultStart , byte[] Source , int SourceStart , int Count )
        {
            for( int i = 0 ; i < Count ; i++ )
            {
                Result[ResultStart + i] = Source[SourceStart + i];
            }
        }

        private void Sendbutton_Click(object sender, EventArgs e)
        {
            byte[] SBUF = new byte[1024];
            byte[] RBUF = new byte[1024];
            int nSlen,nRLen = 0;
            int nRet;
            string msg, strtmp, strtmp2;

            if (m_nPort == 0)
            {
                MessageBox.Show("Device is not connected");
                return;
            }

            msg = this.textBox_TX.Text;
            msg.Replace(" ", "");
            if (msg.Length == 0)
            {
                MessageBox.Show("There is no data to send");
                return;
            }
            SBUF = StringToBytes(msg);
            nSlen = (msg.Length) / 2;

            strtmp = String.Format("=>{0:s}", msg);
            this.listView1.Items.Add(strtmp);

            nRet = Duali.Class1.DE_Polling(m_nPort, nSlen, SBUF, out nRLen, RBUF, 3000);

            if (nRet == 0)
            {
                strtmp = HexToString(RBUF, nRLen);
                strtmp2 = "<= " + strtmp;
                this.listView1.Items.Add(strtmp2);  
                strtmp = HexToString(RBUF, nRLen);
                strtmp = strtmp.Substring(2);
                this.textBox_RX.Text = strtmp;                
            }
            else
            {
                SB.Remove(0, SB.Length);
                Duali.Class1.GetErrMsg(nRet, SB);
                strtmp = String.Format("<= [ERR] {0:d}", nRet);
                strtmp += "(" + SB.ToString() + ")";
                this.listView1.Items.Add(strtmp);
            }
            this.listView1.EnsureVisible(this.listView1.Items.Count - 1);

        }

        private void REFRESH_Click(object sender, EventArgs e)
        {
            GetDeviceList();
        }
    }
}
