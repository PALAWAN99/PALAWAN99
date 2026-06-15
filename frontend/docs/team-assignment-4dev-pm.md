# การกระจายงานทีมพัฒนา — 4 Developers + Project Manager

> อ้างอิงจากเอกสารในโฟลเดอร์ `docs/` (ภาพรวม: `00-project-overview.md`, `qr-gate-system-spec.md`, และสเปกแต่ละโมดูล)  
> **วัตถุประสงค์:** แยกงานตาม **เมนู / ฟังก์ชัน** ให้ Dev 4 คน (คนหนึ่งรับได้หลายเมนูที่สัมพันธ์กัน) และกำหนดบทบาท **PM** สำหรับการประกอบร่างโปรเจกต์

อัปเดตอ้างอิงสเปกเอกสาร: 2026-04-28

### เอกสารแยกตาม Developer (4 ไฟล์)

| Dev | ไฟล์ |
|-----|------|
| Developer 1 | [team-assignment-dev-01.md](./team-assignment-dev-01.md) |
| Developer 2 | [team-assignment-dev-02.md](./team-assignment-dev-02.md) |
| Developer 3 | [team-assignment-dev-03.md](./team-assignment-dev-03.md) |
| Developer 4 | [team-assignment-dev-04.md](./team-assignment-dev-04.md) |

---

## 1. แม็ปเมนูและเส้นทางหลัก (Functional Menu Map)

ตารางนี้สรุปจาก `03-gate-device-management.md`, `05-auth-and-roles.md`, `08-api-reference.md`, `09-dashboard-reports.md`

| เมนู / โมดูล | เส้นทาง UI (ตัวอย่าง) | API / ระบบหลังบ้านที่เกี่ยวข้อง | เอกสารอ้างอิง |
|-------------|------------------------|----------------------------------|----------------|
| เข้าสู่ระบบ | `/[locale]/login` | NextAuth, session | `05-auth-and-roles.md` |
| แดชบอร์ด | `/admin/dashboard` | `GET /api/admin/dashboard/stats` | `09-dashboard-reports.md` |
| มอนิเตอร์ประตู | `/admin/dashboard/gates` | events + device status | `09-dashboard-reports.md`, `03-gate-device-management.md` |
| สาขา | `/admin/branches` | `/api/admin/branches` | `03-gate-device-management.md`, `08-api-reference.md` |
| ประตู (Gate) | `/admin/gates`, `/admin/gates/new`, `/admin/gates/[id]` | `/api/admin/gates` | `03-gate-device-management.md` |
| อุปกรณ์ | `/admin/devices` | `/api/admin/devices`, heartbeat | `03-gate-device-management.md` |
| QR — ออก/ตรวจ/เพิกถอน | หน้าประตู / แอดมิน (ตามสเปก) | `/api/qr/issue`, `validate`, `revoke` | `02-qr-code-management.md` |
| นโยบาย QR (ถ้าแยกเมนู) | `/admin/qr-policies` (แนะนำ) | CRUD ตาม `QrPolicy` ใน schema | `01-database-schema.md`, `02-qr-code-management.md` |
| สมาชิก | `/admin/members` | `/api/admin/members` | `08-api-reference.md`, `01-database-schema.md` |
| Access Log / เหตุการณ์ | `/admin/events` | `/api/admin/events`, export | `09-dashboard-reports.md` |
| รายงานสมาชิก | `/admin/reports/members` | reports + export | `09-dashboard-reports.md` |
| มุมมองเจ้าหน้าที่ประตู | `/gate/dashboard`, สแกน | validate flow | `09-dashboard-reports.md`, `02-qr-code-management.md` |
| ผู้ใช้ระบบ (Staff) | `/admin/users` | `/api/admin/users` | `05-auth-and-roles.md`, `08-api-reference.md` |
| Audit | `/admin/audit` | `/api/admin/audit` | `10-security-audit.md` |
| แจ้งเตือน | กระดิ่ง in-app + ตั้งค่าช่องทาง | LINE / Email / ตาราง notification | `12-notification-system.md` |
| บัตรประชาชนไทย | ลงทะเบียน / โหมดอ่านบัตร | `/api/idcard/register`, Web USB | `04-thai-id-card-reader.md` |
| i18n / ธีม | ครอบทุกหน้า | `next-intl`, design tokens | `06-i18n-multilanguage.md`, `07-ui-design-system.md` |
| Deploy / Infra | — | Docker, CI/CD, env | `11-deployment-devops.md` |

---

## 2. การแบ่งงาน 4 Developers (ตามเมนู + ชั้นเทคนิค)

หลักการ: **แยกตามโดเมนธุรกิจ** ลดการชนกันของไฟล์เดียวกัน; งานข้ามชั้น (API vs UI) ระบุเจ้าของชัดเจน

### Developer 1 — Platform, Identity & Data Core

**บทบาท:** รากฐานข้อมูล ความปลอดภัยระดับแพลตฟอร์ม และ API หลักที่คนอื่นพึ่งพา

| กลุ่มงาน | เมนู / Deliverable | เอกสาร |
|----------|-------------------|--------|
| ฐานข้อมูล | Prisma schema, migrations, indexes, seed | `01-database-schema.md` |
| Authentication | หน้า Login, NextAuth v5, session, middleware ป้องกัน route | `05-auth-and-roles.md` |
| ผู้ใช้ระบบ & สิทธิ์ | `/admin/users`, RBAC ฝั่ง server, permission helper | `05-auth-and-roles.md` |
| สมาชิก (API) | `/api/admin/members`, validation Zod | `08-api-reference.md`, `01-database-schema.md` |
| Audit (API + ความปลอดภัย) | `/api/admin/audit`, นโยบาย rate limit กลาง, security model | `10-security-audit.md` |
| DevOps (ร่วมกับ PM) | Dockerfile, compose, ตัวแปรสภาพแวดล้อมหลัก | `11-deployment-devops.md` |

**สรุป:** Dev 1 รับ **หลายเมนู** ที่เป็นแกนความปลอดภัยและข้อมูลหลัก (login, users, audit, members API) — เหมาะกับคนที่ถนัด backend/infra

---

### Developer 2 — Gate, QR & อุปกรณ์ประตู

**บทบาท:** ตรรกะการเข้า–ออก, ประตู/สาขา/อุปกรณ์, และ flow สแกนที่ประตู

| กลุ่มงาน | เมนู / Deliverable | เอกสาร |
|----------|-------------------|--------|
| สาขา | `/admin/branches` + API | `03-gate-device-management.md`, `08-api-reference.md` |
| ประตู | `/admin/gates/*` + API | เหมือนกัน |
| อุปกรณ์ | `/admin/devices` + ลงทะเบียน + heartbeat API | `03-gate-device-management.md` |
| QR Engine | issue / validate / revoke, หมดอายุเที่ยงคืน, cron cleanup | `02-qr-code-management.md` |
| นโยบาย QR | UI + API (ถ้าเปิดเมนูแยก) | `02-qr-code-management.md`, `01-database-schema.md` |
| มุมมองประตู | `/gate/dashboard`, หน้าสแกน/validate สำหรับ Gate Officer | `09-dashboard-reports.md`, `02-qr-code-management.md` |

**สรุป:** Dev 2 เป็นเจ้าของ **โดเมนการควบคุมการเข้าถึง** ทั้ง UI แอดมินประตูและ logic QR

---

### Developer 3 — Design System, i18n & หน้ารายงาน/แดชบอร์ด

**บทบาท:** ประสบการณ์ผู้ใช้แอดมิน, ภาษา, และการนำเสนอข้อมูล

| กลุ่มงาน | เมนู / Deliverable | เอกสาร |
|----------|-------------------|--------|
| Design System | Mantine v9 + Tailwind, theme, typography, สี | `07-ui-design-system.md` |
| i18n | `next-intl`, `messages/th|en|zh.json`, routing `[locale]` | `06-i18n-multilanguage.md` |
| แดชบอร์ด | `/admin/dashboard`, การ์ดสถิติ, charts | `09-dashboard-reports.md` |
| มอนิเตอร์ประตู (UI) | `/admin/dashboard/gates` (consume API จาก Dev 2) | `09-dashboard-reports.md` |
| Access Log (UI) | `/admin/events`, filter, ตาราง | `09-dashboard-reports.md` |
| รายงาน & Export (UI) | `/admin/reports/members`, ปุ่ม CSV/PDF เชื่อม API | `09-dashboard-reports.md` |

**สรุป:** Dev 3 รับ **หลายเมนู** ที่เป็น “หน้าจอข้อมูล” และ **cross-cutting UI** (ธีม + ภาษา)

---

### Developer 4 — สมาชิก (UI), แจ้งเตือน, บัตรประชาชน & ความร่วมมือ

**บทบาท:** ฟีเจอร์เชื่อมต่อภายนอก/ฮาร์ดแวร์ และหน้าจัดการสมาชิกฝั่ง UI

| กลุ่มงาน | เมนู / Deliverable | เอกสาร |
|----------|-------------------|--------|
| สมาชิก (UI) | `/admin/members/*` เชื่อม API ที่ Dev 1 เป็นคนกำหนดสัญญา | `08-api-reference.md` |
| แจ้งเตือน | In-app bell, ตั้งค่า LINE/Email, trigger ตามสเปก | `12-notification-system.md` |
| บัตรประชาชน | Web USB, หน้าลงทะเบียน, `IdCardSession` (Phase 2) | `04-thai-id-card-reader.md` |
| ทีม / workflow | ปฏิบัติตาม branching & convention ใน repo | `13-team-collaboration.md` |

**สรุป:** Dev 4 โฟกัส **integration + member-facing admin UI** โดยไม่แย่ง schema หลักจาก Dev 1

---

## 3. จุดสัมผัสระหว่างทีม (ลดความสับสน)

| หัวข้อ | เจ้าของหลัก | ผู้ใช้ / ผู้ประสาน |
|--------|-------------|-------------------|
| รูปแบบ JSON API, error code | Dev 1 (กรอบ) + เจ้าของโดเมน (implement endpoint) | ทุกคน — อ้างอิง `08-api-reference.md` |
| Prisma models ใหม่ | Dev 1 merge schema | Dev 2–4 เปิด PR ชัดเจนหรือสาขาย่อย |
| คำแปลเมนูใหม่ | Dev 3 | Dev อื่นเพิ่ม key ใน PR เดียวกันกับฟีเจอร์ |
| การสแกน QR ที่ประตู | Dev 2 (logic) | Dev 3 (UI/styling ถ้าแยกคอมโพเนนต์) |

---

## 4. ลำดับการพึ่งพา (แนะนำ)

```text
PM: repo + CI + สภาพแวดล้อม
    → Dev 1: DB + Auth
        → Dev 2: Gate / QR / Device APIs + หน้าประตู
        → Dev 3: Layout + i18n + Dashboard/Events/Reports UI
        → Dev 4: Members UI + Notifications (+ ID Card ตาม Phase)
    → PM: รวม branch, UAT, release
```

รายละเอียดแนวคิด dependency เดิมอยู่ใน `00-project-overview.md` (mermaid) — ไฟล์นี้ปรับให้เหลือ **4 dev** โดยรวมงานเดิมของ “Dev 5” ในเอกสารเก่าเข้ากับ **Dev 1** (API กลาง + audit/security) และ **Dev 2–4** ตามตารางด้านบน

---

## 5. Project Manager (PM) — ประกอบร่างโปรเจกต์

บทบาท PM ไม่ได้แทนที่การเขียนโค้ดของ dev แต่รับผิดชอบ **ให้ระบบหนึ่งชิ้นทำงานครบ end-to-end** ตามเอกสาร `13-team-collaboration.md` และภาพรวม `00-project-overview.md`

### 5.1 ภาระงานหลัก

| หมวด | รายละเอียด |
|------|------------|
| แผนงาน | แตก milestone (Phase 1: QR core, Phase 2: ID card, ฯลฯ) ตาม `qr-gate-system-spec.md` |
| Git / GitHub | Branch protection, นโยบาย PR, merge เข้า `develop` / `main` |
| Integration | จับคู่ PR ที่มี dependency (เช่น schema ก่อน API ก่อน UI) |
| คุณภาพ | Code review, checklist ความปลอดภัยจาก `10-security-audit.md` |
| DevOps | ประสาน `11-deployment-devops.md` — secrets, pipeline, monitoring |
| สื่อสาร | sync รายสัปดาห์, รายการ blockers, อัปเดตสเปกเมื่อสCOPE เปลี่ยน |

### 5.2 เช็กลิสต์ก่อน “ประกอบร่าง” รุ่นทดสอบ

- [ ] `DATABASE_URL` + migration ล่าสุดรันผ่านในสภาพแวดล้อมกลาง  
- [ ] Login + role ครบอย่างน้อย 1 role ต่อ use case หลัก  
- [ ] Flow: ออก QR → validate → มี `AccessEvent` ใน DB  
- [ ] หน้าแดชบอร์ดแสดงตัวเลขจาก API จริง  
- [ ] i18n ครอบคลุมเมนูหลักอย่างน้อย `th` + `en`  
- [ ] (ถ้าเปิด) แจ้งเตือนทดสอบอย่างน้อย 1 ช่องทาง  

### 5.3 สิ่งที่ PM ควรมีในมือ

- ลิงก์เอกสาร `docs/00-project-overview.md` เป็นดัชนีหลัก  
- ตารางเมนูในหมวด **1** ของไฟล์นี้เป็น backlog ระดับฟังก์ชัน  
- รายชื่อเจ้าของโดเมนจากหมวด **2** ใช้ตัดสินใจเมื่อมี conflict ระหว่าง PR  

---

## 6. สรุปการจับคู่ Dev ↔ เมนู (ภาพรวดเร็ว)

| Dev | เมนู / พื้นที่รับผิดชอบหลัก |
|-----|------------------------------|
| **Dev 1** | Login, Users, Audit, Members **API**, DB/Prisma, security/rate-limit กลาง, DevOps ร่วม PM |
| **Dev 2** | Branches, Gates, Devices, QR ทั้งกระบวนการ, Gate officer / สแกน, QrPolicy |
| **Dev 3** | Theme, i18n, Dashboard, Gate monitor UI, Events, Reports/Export UI |
| **Dev 4** | Members **UI**, Notifications, Thai ID card (Phase 2), ปฏิบัติตาม workflow ทีม |

---

*เอกสารนี้สร้างเพื่อกระจายงานจากสเปกใน `docs/` — ปรับชื่อ path หรือเมนูให้ตรงกับ implementation จริงใน repo ได้เมื่อเริ่มลงมือ implement*
