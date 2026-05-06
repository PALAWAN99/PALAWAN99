# Developer 1 — Platform, Identity & Data Core

> แยกจาก [team-assignment-4dev-pm.md](./team-assignment-4dev-pm.md)  
> อัปเดตอ้างอิงสเปก: 2026-04-28

---

## บทบาท

รากฐานข้อมูล ความปลอดภัยระดับแพลตฟอร์ม และ API หลักที่ทีมอื่นพึ่งพา

---

## เมนู / Deliverable ที่รับผิดชอบ

| กลุ่มงาน | เมนู / Deliverable | เอกสารอ้างอิง |
|----------|-------------------|---------------|
| ฐานข้อมูล | Prisma schema, migrations, indexes, seed | [01-database-schema.md](./01-database-schema.md) |
| Authentication | หน้า Login, NextAuth v5, session, middleware ป้องกัน route | [05-auth-and-roles.md](./05-auth-and-roles.md) |
| ผู้ใช้ระบบ & สิทธิ์ | `/admin/users`, RBAC ฝั่ง server, permission helper | [05-auth-and-roles.md](./05-auth-and-roles.md) |
| สมาชิก (API) | `/api/admin/members`, validation Zod | [08-api-reference.md](./08-api-reference.md), [01-database-schema.md](./01-database-schema.md) |
| Audit & ความปลอดภัย | `/api/admin/audit`, rate limit กลาง, security model | [10-security-audit.md](./10-security-audit.md) |
| DevOps (ร่วม PM) | Dockerfile, compose, ตัวแปรสภาพแวดล้อมหลัก | [11-deployment-devops.md](./11-deployment-devops.md) |

### เส้นทาง UI / API โดยย่อ

| เมนู | เส้นทาง (ตัวอย่าง) |
|------|---------------------|
| เข้าสู่ระบบ | `/[locale]/login` + `/api/auth/[...nextauth]` |
| ผู้ใช้ระบบ | `/admin/users` + `/api/admin/users` |
| Audit | `/admin/audit` (ถ้ามีหน้า) + `/api/admin/audit` |
| สมาชิก | API เท่านั้น — UI โดย [team-assignment-dev-04.md](./team-assignment-dev-04.md) |

---

## สรุป

รับ **หลายเมนู** ที่เป็นแกนความปลอดภัยและข้อมูลหลัก (login, users, audit, members API) — เหมาะกับคนที่ถนัด backend/infra

---

## การประสานงานกับทีมอื่น

| หัวข้อ | หมายเหตุ |
|--------|----------|
| รูปแบบ JSON API, error code | กำหนดกรอบร่วมกับเจ้าของโดเมน — อ้างอิง [08-api-reference.md](./08-api-reference.md) |
| Prisma models ใหม่ | **Dev 1 เป็นผู้ merge schema** — Dev 2–4 เปิด PR ชัดเจนหรือสาขาย่อย |
| สมาชิก UI | [Dev 4](./team-assignment-dev-04.md) consume API ที่คุณกำหนดสัญญา |
| Gate / QR / Events API | [Dev 2](./team-assignment-dev-02.md) implement endpoint ตามกรอบเดียวกัน |

---

## ลำดับการพึ่งพา (ตำแหน่งคุณในโปรเจกต์)

คุณอยู่ **ลำดับแรกหลัง PM ตั้ง repo/CI**: DB + Auth ต้องพร้อมก่อน Dev 2–4 ขยายฟีเจอร์

ดูภาพรวม dependency ใน [team-assignment-4dev-pm.md](./team-assignment-4dev-pm.md#4-ลำดับการพึ่งพา-แนะนำ) และ [00-project-overview.md](./00-project-overview.md)

---

## เอกสารทีมอื่น (อ่านเมื่อต้องประสาน)

- [team-assignment-dev-02.md](./team-assignment-dev-02.md) — Gate, QR, Device  
- [team-assignment-dev-03.md](./team-assignment-dev-03.md) — i18n keys สำหรับเมนูที่คุณสร้าง  
- [team-assignment-dev-04.md](./team-assignment-dev-04.md) — Members UI, Notifications  
