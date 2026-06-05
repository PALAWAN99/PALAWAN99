# KKU Smart Access — Chrome Card Bridge

เชื่อมเครื่องอ่านบัตร USB บน **Mac / Windows** กับหน้า `https://lib.kku.ac.th/smart-access/admin/idcard` โดยไม่ต้องเปิดพอร์ต localhost เอง (ใช้ **Native Messaging** กับ Python backend เดิม)

## สถาปัตยกรรม

```text
หน้าเว็บ (Next.js)
  ↔ postMessage
Content Script (extension)
  ↔ chrome.runtime
Service Worker
  ↔ connectNative (stdio)
card_bridge_host.py → backend/card_reader.py → USB / PC/SC
```

## ติดตั้งแบบคลิกเดียว (แนะนำ)

จากหน้า `/admin/idcard` → **ดาวน์โหลดตัวติดตั้ง Mac/Windows** → แตก zip → **ดับเบิลคลิก** `Install-Mac.command` หรือ `Install-Windows.bat`

สคริปต์จะ: ติดตั้ง Python packages (ถ้ายังไม่มี) → ลงทะเบียน Native Host → ลงทะเบียน extension ใน Chrome (External Extensions) → เปิด Chrome

จากนั้นใน extension popup: **ทดสอบ Native Host** → **เปิด Bridge** → รีเฟรชหน้าอ่านบัตร

Extension ID คงที่ (มี `key` ใน manifest): ดู `extension/EXTENSION_ID`

## ติดตั้งมือ (เคาน์เตอร์)

1. **Python + dependencies** (ครั้งเดียวต่อเครื่อง):

   ```bash
   cd backend
   python3.12 -m venv venv
   ./venv/bin/pip install -r requirements.txt   # Mac
   # หรือ backend\venv\Scripts\pip install -r requirements.txt  # Windows
   ```

2. **โหลด Extension ใน Chrome**

   - เปิด `chrome://extensions` → เปิด Developer mode
   - Load unpacked → เลือกโฟลเดอร์ `extension/`
   - คัดลอก **Extension ID**

3. **ลงทะเบียน Native Host**

   Mac:

   ```bash
   chmod +x extension/install-native-host.sh extension/native-host/card_bridge_host.py
   ./extension/install-native-host.sh <EXTENSION_ID>
   ```

   Windows (PowerShell):

   ```powershell
   .\extension\install-native-host.ps1 -ExtensionId <EXTENSION_ID>
   ```

4. รีสตาร์ท Chrome → คลิกไอคอน Extension → **ทดสอบ Native Host** → **เปิดใช้งาน Bridge**

5. เปิดหน้าอ่านบัตร → hard refresh (Ctrl+Shift+R)

## แพ็กสำหรับแจกจ่าย

```bash
./extension/build.sh
# ได้ extension/dist/kku-smart-access-card-bridge.zip
```

Chrome Web Store ต้องมีบัญชี Developer ($5) และ review — ภายใน มข. ใช้ Load unpacked + zip ได้

## ข้อจำกัด

- ต้องใช้ **Google Chrome** (หรือ Chromium ที่รองรับ Native Messaging)
- ต้องติดตั้ง Native Host หลัง Extension ID เปลี่ยน (โหลด unpacked ใหม่)
- ยังต้องมี Python + `backend/requirements.txt` บนเครื่อง (ไม่ใช่ .dmg standalone)
- Safari / Firefox ไม่รองรับ extension นี้

## ทางเลือกอื่น

- รัน `run-card-api-windows.ps1` / uvicorn แล้วตั้ง `http://127.0.0.1:8000` ใน「ตั้งค่าเครื่องอ่าน」
- เสียบ USB ที่เซิร์ฟเวอร์ Linux แล้วใช้ URL `/smart-access/card-api`
