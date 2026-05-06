# สเปกระบบ QR Code เข้า–ออกประตู (Gate Access)

เอกสารนี้ใช้เป็นฐานพัฒนาระบบใหม่แยกจากระบบสถิติห้องสมุด (Laravel + SQL Server read-only) โดยยึดโดเมนข้อมูลเดิมจาก ER หลัก **`gatemaster` → `gatestatement` ← `mbmembmaster`** แล้วดีไซน์ใหม่ให้รองรับ **QR + PostgreSQL + Next.js**

> 🌐 รองรับ 3 ภาษา: ไทย / English / 中文简体 | ⏰ QR หมดอายุทุกเที่ยงคืน | 🪪 รองรับเครื่องอ่านบัตรประชาชนไทย (Web USB API)

---

## 📚 เอกสารแยกตามฟังก์ชัน (สำหรับทีม 5 คน)

| # | เอกสาร | ผู้รับผิดชอบ |
|---|--------|-------------|
| 00 | [Project Overview + การแบ่งงาน](./00-project-overview.md) | ทุกคน |
| 01 | [Database Schema (Prisma + ER)](./01-database-schema.md) | Dev 1 |
| 02 | [QR Code Management](./02-qr-code-management.md) | Dev 2 |
| 03 | [Gate & Device Management](./03-gate-device-management.md) | Dev 2 |
| 04 | [Thai ID Card Reader (Web USB)](./04-thai-id-card-reader.md) | Dev 4 |
| 05 | [Authentication & Roles](./05-auth-and-roles.md) | Dev 1 |
| 06 | [i18n Multi-language (TH/EN/ZH)](./06-i18n-multilanguage.md) | Dev 3 |
| 07 | [UI Design System](./07-ui-design-system.md) | Dev 3 |
| 08 | [API Reference](./08-api-reference.md) | Dev 5 |
| 09 | [Dashboard & Reports](./09-dashboard-reports.md) | Dev 3 |
| 10 | [Security & Audit](./10-security-audit.md) | Dev 5 |
| 11 | [Deployment & DevOps](./11-deployment-devops.md) | Dev 1 |
| 12 | [Notification System](./12-notification-system.md) | Dev 4 |

---

## 1. วัตถุประสงค์

- ให้ผู้ใช้งาน (สมาชิก / ผู้ได้รับสิทธิ์) **สแกน QR เพื่อบันทึกการเข้า–ออก** ที่ประตูหรือจุดควบคุม
- ผู้ดูแลระบบจัดการ **ประตู (Gate)** และกำหนดนโยบายการออก QR (อายุสั้น, ใช้ครั้งเดียว ฯลฯ)
- เก็บ **Audit trail** เหตุการณ์เข้า–ออกใน PostgreSQL เพื่อรายงานและเชื่อมโยงกับระบบเดิมได้ในอนาคต (ซิงก์หรือ export)

---

## 2. แม็ปความสัมพันธ์จากระบบเดิม → ระบบใหม่

| แนวคิดเดิม (SQL Server) | ระบบใหม่ (PostgreSQL / Prisma) |
|-------------------------|----------------------------------|
| `gatemaster` (นิยามประตู) | ตาราง `Gate` |
| `mbmembmaster` (สมาชิก) | ตาราง `Member` หรือเชื่อม **Identity ภายนอก** (LDAP / เลขบัตร / member_no) |
| `gatestatement` (เหตุการณ์ผ่านประตู) | ตาราง `GateEvent` หรือ `AccessLog` |
| ไม่มี FK จริงใน DB เดิม | แนะนำให้ **กำหนด FK + index** ใน Postgres เพื่อความถูกต้องของข้อมูล |

---

## 3. เทคโนโลยีที่กำหนด

| ชั้น | เทคโนโลยี | หมายเหตุ |
|-----|-----------|---------|
| Framework | **Next.js (App Router)** + **TypeScript** | API Routes / Route Handlers สำหรับ validate QR |
| UI | **Mantine** + **Tailwind CSS** | Mantine เป็นองค์ประกอบ UI หลัก; Tailwind ใช้จัด layout/spacing/utility ที่ Mantine ไม่ครอบ — ติดตั้ง `@mantine/core` และตั้งค่า `postcss` ให้สอดคล้องกัน (หลีกเลี่ยงชนกันของ reset/global CSS) |
| Database | **PostgreSQL** | Core ของข้อมูลเหตุการณ์และนโยบาย QR |
| ORM | **Prisma** | Schema เป็น single source of truth; migrate ผ่าน `prisma migrate` |
| Container | **Docker** + **Docker Compose** | App + Postgres; แยก stage dev/prod |

---

## 4. เทคโนโลยีเสริมที่แนะนำ

| รายการ | ใช้ทำอะไร |
|--------|-----------|
| **Zod** | Validate input API / ฟอร์ม admin |
| **Auth.js (NextAuth v5)** หรือ **Clerk / Lucia** | ล็อกอินผู้ดูแล / พนักงานประตู (ไม่ควรพึ่ง QR อย่างเดียวสำหรับสิทธิ์สูง) |
| **Argon2** หรือ **bcrypt** | Hash secret ของอุปกรณ์/API key |
| **jose** หรือ **@node-rs/argon2** | ลงนาม / ตรวจสอบ QR แบบ signed token (ถ้าใช้ JWT ใน QR) |
| **nuqs** หรือ searchParams ของ Next | จัดการ query บนหน้า scan |
| **Pino** / **consola** | Structured logging ฝั่งเซิร์ฟเวอร์ |
| **Upstash Redis** (ถ้าต้องการ scale) | Rate limit, blacklist token แบบเร็ว, one-time nonce |
| **Playwright** | E2E ฟลוא์สแกน (optional) |
| **OpenAPI** (optional) | สัญญา API สำหรับแอปมือถือ/สแกนเนอร์ |

---

## 5. ฟังก์ชันที่ควรมี

### 5.1 ผู้ใช้ทั่วไป / สมาชิก

- ขอ **QR เข้า** / **QR ออก** (หรือ QR เดียวแล้วตีความจากทิศทางที่เลือกบนอุปกรณ์ประตู)
- QR มี **อายุสั้น** (เช่น 30–120 วินาที) และควร **ผูกกับบุคคล / เซสชัน**
- (ถ้ามี) แสดงสถานะล่าสุดว่า “อยู่ในห้องสมุด” หรือไม่ — คำนวณจากลำดับเหตุการณ์เข้า/ออก

### 5.2 อุปกรณ์ประตู / เจ้าหน้าที่

- หน้า **Scan / Validate**: กล้องหรือสแกนเนอร์ส่ง token ไป API → ตอบ success/deny พร้อมเหตุผล
- **โหมด offline-first** (ถ้าจำเป็น): คิว sync เมื่อกลับ online — ต้องออกแบบ idempotency key

### 5.3 ผู้ดูแลระบบ

- CRUD **Gate** (รหัส, ชื่อ, สาขา, สถานะใช้งาน)
- ตั้งค่า **นโยบาย QR**: TTL, one-time use, จำกัดจำนวนครั้งต่อวัน
- ดู **Access log** + filter ตามวัน, ประตู, สมาชิก
- Export CSV / เตรียม **Webhook** ไปยังระบบสถิติเดิม (optional)

### 5.4 ความปลอดภัย

- **ไม่เก็บข้อมูลลับใน QR แบบ plain text** — ใช้ signed payload หรือ opaque ID อ้างอิงในฐานข้อมูล
- **Rate limiting** ที่ endpoint ออก QR และ validate
- **Audit**: IP, user agent, gate id, decision (allow/deny), reason code

---

## 6. โมเดลข้อมูล (แนวทาง Prisma — ปรับชื่อฟิลด์ได้ตามธุรกิจ)

เอนทิตีหลัก (แนวคิด):

- **User** — บัญชีแอดมิน/เจ้าหน้าที่ (แยกจาก Member ถ้าจำเป็น)
- **Member** — `memberNo`, ชื่อ, อีเมล, สถานะสมาชิก, `expireDate` (optional sync จากระบบเดิม)
- **Gate** — `gateId` (string/uuid), `name`, `branchId`, `status`
- **QrSession** หรือ **QrToken** — token id, hash, `memberId`, `purpose` (in/out), `expiresAt`, `usedAt`, `revokedAt`
- **AccessEvent** — เหมือน `gatestatement`: เวลา, `gateId`, `memberId`, ทิศทาง, `source` (qr/manual), metadata

**Indexes ที่ควรมี:** `(gateId, createdAt)`, `(memberId, createdAt)`, unique บน one-time token hash

---

## 7. API ที่ควรออกแบบ (Route Handlers)

- `POST /api/qr/issue` — ออก QR (ต้อง authenticated เป็นสมาชิกหรือหลังพิสูจน์ตัวตน)
- `POST /api/qr/validate` — อุปกรณ์ประตูส่ง token → บันทึก `AccessEvent`
- `GET /api/admin/gates` / `POST/PATCH/DELETE` — จัดการประตู (role admin)
- `GET /api/admin/events` — รายงานเหตุการณ์ + pagination

ทุก endpoint ใช้ **Zod** validate body และคืน error code ชัดเจน (เช่น `TOKEN_EXPIRED`, `ALREADY_USED`, `GATE_DISABLED`)

---

## 8. Docker (ภาพรวม)

- **Service `app`**: Next.js (multi-stage build)
- **Service `db`**: `postgres:16-alpine` (หรือเวอร์ชันที่ทีมล็อก)
- Volume สำหรับข้อมูล Postgres
- ไฟล์ `.env` / `env_file` สำหรับ `DATABASE_URL`
- (Prod) reverse proxy + TLS ภายนอก container

ตัวอย่างตัวแปรสภาพแวดล้อมที่ต้องมี:

- `DATABASE_URL=postgresql://user:pass@db:5432/gate_qr`
- `NEXTAUTH_SECRET` / คีย์ลงนาม QR
- `QR_SIGNING_SECRET` (แยกจาก session secret)

---

## 9. การทำงานร่วมกับระบบเดิม (SQL Server / lib-stat)

- **Phase 1**: ระบบ QR ยืนของเองบน Postgres — ไม่บังคับเชื่อมทันที
- **Phase 2**: Job ซิงก์ `Member` จาก SQL Server → Postgres (read-only user, จำกัดตาราง)
- **Phase 3**: ส่ง `AccessEvent` กลับเป็น staging / warehouse สำหรับรายงานรวม

ช่วยลดความเสี่ยง: อย่าเขียนกลับ SQL Server จากระบบ QR โดยไม่มีข้อตกลงกับทีม infra

---

## 10. เช็กลิสต์ก่อนเริ่มโค้ด

- [ ] กำหนดว่า QR เป็น **JWT สั้นๆ** หรือ **random id + row ในฐานข้อมูล**
- [ ] ยืนยันว่า Mantine + Tailwind **ไม่ชนกัน** (ลำดับ import CSS / `MantineProvider`)
- [ ] Prisma schema v1 + migration แรก
- [ ] Docker Compose ขึ้น Postgres + healthcheck
- [ ] Flow ทดสอบ: issue → validate → event ถูกบันทึก
- [ ] แผน backup Postgres และการหมุน secret

---

## 11. เอกสารอ้างอิง

- [Mantine](https://mantine.dev/) — คอมโพเนนต์ UI
- [Prisma](https://www.prisma.io/docs) — Postgres + migrations
- [Next.js App Router](https://nextjs.org/docs)

---

*ไฟล์นี้สร้างเพื่อใช้เริ่มโปรเจกต์ใหม่ — ปรับขอบเขตและชื่อเอนทิตีให้ตรงนโยบายองค์กรก่อนลงมือ implement*
