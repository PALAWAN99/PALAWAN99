# Developer 2 — Gate, QR & อุปกรณ์ประตู

> แยกจาก [team-assignment-4dev-pm.md](./team-assignment-4dev-pm.md)  
> อัปเดตอ้างอิงสเปก: 2026-04-28

---

## บทบาท

ตรรกะการเข้า–ออก ประตู/สาขา/อุปกรณ์ และ flow สแกนที่ประตู

---

## เมนู / Deliverable ที่รับผิดชอบ

| กลุ่มงาน | เมนู / Deliverable | เอกสารอ้างอิง |
|----------|-------------------|---------------|
| สาขา | `/admin/branches` + API | [03-gate-device-management.md](./03-gate-device-management.md), [08-api-reference.md](./08-api-reference.md) |
| ประตู | `/admin/gates/*` + API | เหมือนกัน |
| อุปกรณ์ | `/admin/devices` + ลงทะเบียน + heartbeat API | [03-gate-device-management.md](./03-gate-device-management.md) |
| QR Engine | issue / validate / revoke, หมดอายุเที่ยงคืน, cron cleanup | [02-qr-code-management.md](./02-qr-code-management.md) |
| นโยบาย QR | UI + API (ถ้าเปิดเมนูแยก เช่น `/admin/qr-policies`) | [02-qr-code-management.md](./02-qr-code-management.md), [01-database-schema.md](./01-database-schema.md) |
| มุมมองประตู | `/gate/dashboard`, หน้าสแกน/validate สำหรับ Gate Officer | [09-dashboard-reports.md](./09-dashboard-reports.md), [02-qr-code-management.md](./02-qr-code-management.md) |

### เส้นทาง UI / API โดยย่อ

| เมนู | เส้นทาง (ตัวอย่าง) |
|------|---------------------|
| สาขา | `/admin/branches` + `GET/POST/PATCH /api/admin/branches` |
| ประตู | `/admin/gates`, `/admin/gates/new`, `/admin/gates/[id]` + `/api/admin/gates` |
| อุปกรณ์ | `/admin/devices` + `/api/admin/devices`, `/api/device/heartbeat` |
| QR | `/api/qr/issue`, `/api/qr/validate`, `/api/qr/revoke` |
| เจ้าหน้าที่ประตู | `/gate/dashboard`, flow สแกน |

---

## สรุป

เจ้าของ **โดเมนการควบคุมการเข้าถึง** ทั้ง UI แอดมินประตูและ logic QR

---

## การประสานงานกับทีมอื่น

| หัวข้อ | หมายเหตุ |
|--------|----------|
| Database / schema | พึ่ง [Dev 1](./team-assignment-dev-01.md) — เปิด PR ชัดเจนเมื่อต้องการฟิลด์ใหม่ |
| API contract | อ้างอิง [08-api-reference.md](./08-api-reference.md); error code สอดคล้องกรอบจาก Dev 1 |
| มอนิเตอร์ประตู (UI แอดมิน) | [Dev 3](./team-assignment-dev-03.md) consume API/สถานะที่คุณจัดหา |
| การสแกน QR ที่ประตู | **คุณ = logic หลัก** — Dev 3 ช่วย UI/styling ถ้าแยกคอมโพเนนต์ |
| แจ้งเตือน (Gate offline ฯลฯ) | trigger อาจเชื่อม [Dev 4](./team-assignment-dev-04.md) |

---

## ลำดับการพึ่งพา

ต้องมี DB + Auth จาก [Dev 1](./team-assignment-dev-01.md) ก่อน จากนั้นคุณเปิด Gate/QR/Device APIs และหน้าประตู

ดูภาพรวมใน [team-assignment-4dev-pm.md](./team-assignment-4dev-pm.md#4-ลำดับการพึ่งพา-แนะนำ)

---

## เอกสารทีมอื่น (อ่านเมื่อต้องประสาน)

- [team-assignment-dev-01.md](./team-assignment-dev-01.md) — Schema, auth, rate limit  
- [team-assignment-dev-03.md](./team-assignment-dev-03.md) — Dashboard gates UI, i18n  
- [team-assignment-dev-04.md](./team-assignment-dev-04.md) — Notifications  
