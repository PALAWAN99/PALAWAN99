import { THAI_ID_CARD } from './apdu-commands';

export interface ThaiIdData {
  citizenId: string;
  fullNameTh: string;
  fullNameEn: string;
  birthDate: string;
  gender: string;
  address: string;
  expireDate: string;
}

/**
 * Class สำหรับเชื่อมต่อและอ่านข้อมูลจากเครื่องอ่านบัตรประชาชนไทยผ่าน Web USB API
 */
export class ThaiIdCardReader {
  private device: any = null;
  private endpointIn = 0;
  private endpointOut = 0;

  /**
   * ร้องขอการเชื่อมต่อกับเครื่องอ่านบัตร
   */
  async connect(): Promise<boolean> {
    try {
      // ค้นหาเครื่องอ่านบัตรมาตรฐาน (ACS, SCM, HID, Identiv, Gemalto)
      this.device = await (navigator as any).usb.requestDevice({
        filters: [
          { vendorId: 0x072f }, // ACS
          { vendorId: 0x04e6 }, // SCM / Identiv
          { vendorId: 0x076b }, // HID / OmniKey
          { vendorId: 0x08e6 }, // Gemalto / Thales
          { vendorId: 0x058f }, // Alcor Micro
          { vendorId: 0x2ce3 }, // Generic / Thai readers
        ],
      });

      await this.device.open();
      if (this.device.configuration === null) {
        await this.device.selectConfiguration(1);
      }
      await this.device.claimInterface(0);

      // ค้นหา Endpoints สำหรับส่งและรับข้อมูล
      const interface0 = this.device.configuration?.interfaces[0];
      const alternate = interface0?.alternates[0];
      
      alternate?.endpoints.forEach((ep: any) => {
        if (ep.direction === 'in') this.endpointIn = ep.endpointNumber;
        if (ep.direction === 'out') this.endpointOut = ep.endpointNumber;
      });

      return true;
    } catch (error) {
      console.error('Failed to connect to ID Card Reader:', error);
      return false;
    }
  }

  /**
   * อ่านข้อมูลทั้งหมดจากบัตร
   */
  async readAllData(): Promise<ThaiIdData | null> {
    if (!this.device) return null;

    try {
      // 1. Select Thai ID Application
      await this.sendAPDU(THAI_ID_CARD.SELECT);

      // 2. Read Fields
      const cid = await this.readField('CID');
      const fullNameTh = await this.readField('FULLNAME_TH');
      const fullNameEn = await this.readField('FULLNAME_EN');
      const birthDate = await this.readField('BIRTHDATE');
      const gender = await this.readField('GENDER');
      const address = await this.readField('ADDRESS');
      const expireDate = await this.readField('EXPIRE_DATE');

      if (!cid) return null;

      return {
        citizenId: cid,
        fullNameTh: this.cleanThaiString(fullNameTh),
        fullNameEn: this.cleanThaiString(fullNameEn),
        birthDate: birthDate,
        gender: gender === '1' ? 'ชาย' : 'หญิง',
        address: this.cleanThaiString(address),
        expireDate: expireDate
      };
    } catch (error) {
      console.error('Error reading card data:', error);
      return null;
    }
  }

  /**
   * ส่งคำสั่ง APDU ไปยังบัตร (ผ่านโปรโตคอล CCID)
   */
  private async sendAPDU(apdu: number[]): Promise<Uint8Array | null> {
    if (!this.device) return null;

    // หมายเหตุ: การส่งข้อมูล CCID จริงต้องการการสร้าง PC_to_RDR_XfrBlock header
    // ตัวอย่างนี้เป็นการจำลองโครงสร้างข้อมูลเบื้องต้น
    const header = new Uint8Array([
      0x6f, // PC_to_RDR_XfrBlock
      apdu.length, 0, 0, 0, // Length
      0, // Slot
      0, // Sequence
      0, 0, 0 // Reserved
    ]);

    const packet = new Uint8Array(header.length + apdu.length);
    packet.set(header);
    packet.set(apdu, header.length);

    await this.device.transferOut(this.endpointOut, packet);
    const result = await this.device.transferIn(this.endpointIn, 1024);

    if (result.data) {
      // ตัด CCID header ออก (10 bytes)
      return new Uint8Array(result.data.buffer.slice(10));
    }
    return null;
  }

  private async readField(fieldName: keyof typeof THAI_ID_CARD.COMMANDS): Promise<string> {
    const config = THAI_ID_CARD.COMMANDS[fieldName];
    const response = await this.sendAPDU(config.cmd);
    if (!response) return '';
    
    // แปลง TIS-620 เป็น UTF-8 (ใช้ TextDecoder ถ้า Browser รองรับ)
    try {
      const decoder = new TextDecoder('tis-620');
      return decoder.decode(response).trim();
    } catch (e) {
      return '';
    }
  }

  private cleanThaiString(str: string): string {
    // ลบตัวอักษรพิเศษหรือช่องว่างส่วนเกินที่มักมาจากบัตร (ป้องกันกรณี str เป็น undefined)
    return (str || '').replace(/#/g, ' ').replace(/\s+/g, ' ').trim();
  }

  async disconnect() {
    if (this.device) {
      await this.device.releaseInterface(0);
      await this.device.close();
      this.device = null;
    }
  }
}
