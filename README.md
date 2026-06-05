# 🛡️ QR Gate Access Control Platform (Production Ready)

ระบบบริหารจัดการทางเข้า-ออกอัจฉริยะด้วย QR Code สำหรับห้องสมุดและองค์กร ออกแบบมาเพื่อความปลอดภัย ประสิทธิภาพ และความง่ายในการบำรุงรักษา

---

## 🏗️ Architecture (โครงสร้างระบบ)

ระบบนี้พัฒนาด้วยแนวคิด **Layered Architecture** เพื่อแยกส่วนการทำงานอย่างชัดเจน:

- **UI Layer (Next.js 15+):** ใช้ Mantine UI 7 สำหรับการแสดงผลที่สวยงามและ Responsive
- **Service Layer:** บรรจุ Business Logic ทั้งหมดของระบบ
- **Repository Layer:** แยกส่วนการติดต่อฐานข้อมูล (Prisma 6+) ออกจาก Logic
- **Validator Layer:** ตรวจสอบความถูกต้องของข้อมูลด้วย Zod ก่อนเข้าสู่ระบบ
- **Security Layer:** ระบบป้องกันระดับสูง (Signed QR, Rate Limiting, RBAC, Audit Logs)

```mermaid
graph TD
    User((User/Admin)) --> NextJS[Next.js AppShell]
    NextJS --> API[API Routes / Server Actions]
    API --> Validator{Validator Layer}
    Validator --> Service[Service Layer]
    Service --> Repo[Repository Layer]
    Repo --> DB[(PostgreSQL)]
    Service --> Storage[Storage / Member Photos]
    Service --> Logs[(Audit Logs)]
```

---

## 📊 ER Diagram (ผังฐานข้อมูล)

```mermaid
erDiagram
    MEMBER ||--o{ ACCESS_EVENT : scans
    GATE ||--o{ ACCESS_EVENT : records
    BRANCH ||--o{ GATE : owns
    USER ||--o{ AUDIT_LOG : performs
    
    MEMBER {
        string id PK
        string memberNo UK
        string citizenId
        string firstNameTh
        string lastNameTh
        buffer photo
        enum status
        datetime expireDate
    }
    
    GATE {
        string id PK
        string gateCode UK
        string nameTh
        enum direction
        enum status
    }
    
    ACCESS_EVENT {
        string id PK
        datetime scannedAt
        enum direction
        enum decision
    }
```

---

## 🚀 Getting Started (วิธีการติดตั้ง)

### 1. ติดตั้งผ่าน Docker (แนะนำสำหรับ Production)

```bash
# 1. Clone Repository
git clone <repository-url>
cd qrcode-accesscontrol

# 2. สร้างไฟล์ .env จากตัวอย่าง
cp .env.example .env

# 3. รันระบบทั้งหมดด้วย Docker Compose
docker-compose up -d
```

### 2. ติดตั้งแบบ Local (สำหรับการพัฒนา)

```bash
# 1. ตั้งค่า environment (ไฟล์เดียวที่ราก monorepo)
cp .env.example .env
# แก้ไข DATABASE_URL, AUTH_SECRET, ฯลฯ

# 2. Frontend
cd frontend && npm install
npx prisma generate
npx prisma db push
npm run dev          # http://localhost:3000

# 3. Backend (เครื่องอ่านบัตร — โหลด .env จากรากโปรเจกต์อัตโนมัติ)
cd backend && ./run-dev.sh   # http://localhost:8000
```

---

## ⚙️ Environment Variables (การตั้งค่า)

ตั้งค่าทั้งหมดใน **`.env` ที่ราก repository** (ไม่ใช้ `frontend/.env.local`) — ดูตัวอย่างใน `.env.example`

ระบบใช้ **Zod Validation** ตรวจสอบตัวแปร environment ตอนเริ่มทำงาน:

| Variable | Description | Example |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL Connection String | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_SECRET` | คีย์สำหรับเข้ารหัส Session | `your-secret-key` |
| `QR_SIGN_SECRET` | คีย์สำหรับลงนาม QR Code | `shh-its-a-secret` |
| `RATE_LIMIT_MAX` | จำนวนคำขอสูงสุดต่อนาที | `100` |

---

## 📑 API Documentation (สรุป API ที่สำคัญ)

### Admin API

- `GET /api/admin/dashboard/stats` - ข้อมูลสรุปหน้าแรก
- `GET /api/admin/members` - จัดการข้อมูลสมาชิก
- `POST /api/admin/gates` - เพิ่ม/แก้ไขข้อมูลประตู

### Hardware API (Gate Interface)

- `POST /api/qr/validate` - ตรวจสอบ QR Code (รองรับ Signed Token)
- `POST /api/device/heartbeat` - ตรวจสอบสถานะอุปกรณ์

---

## 📸 Screenshots

ตัวอย่างหน้าจอหลักของระบบ

| Dashboard | Member Management |
| --- | --- |
| ![Dashboard](https://via.placeholder.com/400x250?text=Admin+Dashboard) | ![Members](https://via.placeholder.com/400x250?text=Member+Management) |

---

## 🔒 Security Features

- **HMAC-SHA256 Signed QR:** ป้องกันการปลอมแปลง QR Code
- **Audit Logging:** บันทึกทุกการกระทำของ Admin
- **Rate Limiting:** ป้องกันการโจมตีแบบ Brute Force/DDoS
- **Stateless Auth:** ใช้ JWT Strategy เพื่อความรวดเร็วและ Scalability

---

## 🛠️ Maintenance (การดูแลรักษา)

- **Backup:** รัน `.\scripts\db-backup.ps1` เพื่อสำรองฐานข้อมูล
- **Logs:** ตรวจสอบ Log การเข้า-ออกได้ที่เมนู **"ประวัติกิจกรรม"** ในหน้า Admin
