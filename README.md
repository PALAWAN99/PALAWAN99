# QR Gate Access Control System 🚪🛡️

ระบบควบคุมการเข้า-ออกประตูด้วย QR Code และบัตรประชาชน พัฒนาด้วยเทคโนโลยีสมัยใหม่ เน้นความปลอดภัย ความเร็ว และการตรวจสอบย้อนกลับได้ 100%

---

## 🏗️ Architecture & Tech Stack

ระบบถูกออกแบบด้วยสถาปัตยกรรม **Modern Full-stack** บน Next.js:

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) - รองรับ Server Components และ Streaming
- **UI System:** [Mantine UI v9](https://mantine.dev) - ระบบ Design System ที่ยืดหยุ่นและเป็น Responsive
- **Database ORM:** [Prisma 7](https://www.prisma.io) - ใช้ Type-safe database client
- **Database:** PostgreSQL (Production) / SQLite (Development)
- **Authentication:** [NextAuth.js v5](https://authjs.dev) (Beta) - รองรับ RBAC
- **Validations:** [Zod](https://zod.dev) - ตรวจสอบความถูกต้องของข้อมูลทั้ง Client และ Server

---

## 🚀 วิธีการติดตั้ง (Installation)

### 1. โคลนโปรเจกต์และติดตั้ง Dependencies
```bash
npm install
```

### 2. การตั้งค่า Environment Variables (.env)
คัดลอกไฟล์ `.env.example` เป็น `.env` และตั้งค่าดังนี้:
```env
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/qrgatedb"

# Auth Secret (สร้างด้วย openssl rand -base64 32)
AUTH_SECRET="your-secret-key"

# Next.js Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. การจัดการฐานข้อมูล (Database Setup)
เนื่องจากใช้ Prisma 7 โปรดทำตามขั้นตอนดังนี้:
```bash
# สร้าง Prisma Client
npx prisma generate

# ผลักดัน Schema เข้าฐานข้อมูล (สำหรับ Dev)
npx prisma db push

# หรือใช้ Migration (สำหรับ Prod)
npx prisma migrate dev --name init

# ใส่ข้อมูลเริ่มต้น (Admin, Policies)
npx prisma db seed
```

---

## 🛠️ โครงสร้างโปรเจกต์ (Project Structure)

```text
src/
├── app/                  # Next.js App Router (Pages & API)
│   ├── [locale]/admin/   # ระบบหลังบ้าน (Dashboard, Members, Events)
│   └── api/              # API Endpoints (Gate Validation, Registration)
├── components/           # UI Components แยกตามโมดูล
├── lib/                  # Shared Utilities (Auth, RBAC, Validations, Prisma)
├── services/             # Business Logic Layer (Logging, MemberService)
├── i18n/                 # การตั้งค่าภาษา (TH, EN, ZH)
└── types/                # TypeScript Interfaces
```

---

## 🔐 ระบบสิทธิ์การใช้งาน (RBAC)

ระบบใช้สิทธิ์แบบ **Granular Permission Matrix** กำหนดไว้ใน `src/lib/rbac.ts`:
- **SUPER_ADMIN:** ควบคุมระบบทั้งหมด ดู Audit Logs ได้
- **ADMIN:** จัดการประตู สาขา และอุปกรณ์ได้
- **LIBRARIAN:** จัดการข้อมูลสมาชิกและออก QR Code ได้
- **STAFF:** ดูข้อมูลและออก QR Code ได้อย่างเดียว
- **SECURITY:** ดูประวัติการเข้า-ออก (Access Events) ได้อย่างเดียว

---

## 📡 API Usage (ตัวอย่าง)

### 1. การตรวจสอบรหัส QR (Gate Validation)
**Endpoint:** `POST /api/gate/validate`
**Payload:**
```json
{
  "token": "qr-token-hash",
  "gateCode": "GATE-001",
  "direction": "IN"
}
```

### 2. การลงทะเบียนด้วยบัตรประชาชน
**Endpoint:** `POST /api/idcard/register`
**Payload:**
```json
{
  "citizenId": "1234567890123",
  "fullNameTh": "สมชาย รักเรียน",
  "deviceId": "uuid-of-reader"
}
```

---

## 💾 ระบบ Backup & Recovery
ดูรายละเอียดได้ใน [docs/13-backup-and-restore.md](file:///c:/Users/ACER/Downloads/Library%20Project/docs/13-backup-and-restore.md)

---

## 📝 บันทึกสำหรับนักพัฒนาคนถัดไป
1. **Prisma 7:** ระวังเรื่องการตั้งค่า `url` ใน `schema.prisma` จะถูกย้ายไปอยู่ที่ `prisma.config.ts` แทน
2. **Localization:** ทุกข้อความใน UI ควรใช้ `t('Key')` จาก `next-intl`
3. **Audit Logs:** ทุกการแก้ไขข้อมูลสำคัญ (CUD) ต้องเรียก `logAction` จาก `loggingService` เสมอ

---
**QR Gate Access System** | พัฒนาโดย ทีมงานโครงการระบบควบคุมการเข้า-ออก
