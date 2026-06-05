# Developer 4 — สมาชิก (UI), แจ้งเตือน, บัตรประชาชน & ความร่วมมือ

> แยกจาก [team-assignment-4dev-pm.md](./team-assignment-4dev-pm.md)  
> อัปเดตอ้างอิงสเปก: 2026-04-28

---

## บทบาท

ฟีเจอร์เชื่อมต่อภายนอก/ฮาร์ดแวร์ และหน้าจัดการสมาชิกฝั่ง UI

---

## เมนู / Deliverable ที่รับผิดชอบ

| กลุ่มงาน | เมนู / Deliverable | เอกสารอ้างอิง |
|----------|-------------------|---------------|
| สมาชิก (UI) | `/admin/members/*` เชื่อม API ที่ Dev 1 กำหนดสัญญา<br/>**(เน้น)** มีหน้าดูประวัติเข้า-ออก (Access History) ในโปรไฟล์สมาชิก<br/>**(เพิ่ม)** Bulk Import/Export, กรองข้อมูลแบบละเอียด, Member Dashboard Summary, ปุ่มสร้าง QR Code ใหม่ | [08-api-reference.md](./08-api-reference.md) |
| แจ้งเตือน | In-app bell, ตั้งค่า LINE/Email, trigger ตามสเปก<br/>**(เพิ่ม)** จัดกลุ่มแจ้งเตือน (Grouping), ปุ่มอ่านทั้งหมด, กรองเฉพาะที่ยังไม่อ่าน, Browser Push Notifications, Custom Alert Sounds | [12-notification-system.md](./12-notification-system.md) |
| บัตรประชาชน | Web USB **(เน้นสำหรับใช้กรอกข้อมูลลงฟอร์มลงทะเบียนสมาชิกเป็นหลัก)**<br/>**(เพิ่ม)** ดึงรูป/กรอกข้อมูลลงฟอร์มให้อัตโนมัติ (Auto-fill), ตรวจสอบวันหมดอายุบัตร, คีย์ลัด (Keyboard Shortcuts), UI แสดงไฟสถานะ | [04-thai-id-card-reader.md](./04-thai-id-card-reader.md) |
| ทีม / workflow | ปฏิบัติตาม branching & convention ใน repo | [13-team-collaboration.md](./13-team-collaboration.md) |

### เส้นทาง UI / API โดยย่อ

| เมนู | เส้นทาง (ตัวอย่าง) |
|------|---------------------|
| สมาชิก | `/admin/members` + CRUD หน้าย่อย — API `/api/admin/members` โดย [Dev 1](./team-assignment-dev-01.md) |
| แจ้งเตือน | กระดิ่ง in-app + หน้าตั้งค่าช่องทาง (ตามสเปก) |
| บัตร ปชช. | flow ลงทะเบียน + `POST /api/idcard/register` |

---

## สรุป

โฟกัส **integration + member-facing admin UI** โดยไม่แย่ง schema หลักจาก Dev 1

---

## การประสานงานกับทีมอื่น

| หัวข้อ | หมายเหตุ |
|--------|----------|
| สมาชิก API | สัญญาและ Zod จาก [Dev 1](./team-assignment-dev-01.md) — ประสานก่อนเปลี่ยน response |
| AccessEvent / Gate | trigger แจ้งเตือนอาจอ้างอิงเหตุการณ์จาก [Dev 2](./team-assignment-dev-02.md) |
| คำแปล UI | เพิ่ม key ใน PR — เจ้าของรวมคีย์คือ [Dev 3](./team-assignment-dev-03.md) |
| Member table / IdCardSession | schema โดย [Dev 1](./team-assignment-dev-01.md) — ขอ migration ผ่าน PR ชัดเจน |

---

## ลำดับการพึ่งพา

หลัง Members API + Auth พร้อมจาก [Dev 1](./team-assignment-dev-01.md); บัตรประชาชนหลัง QR core ตาม Phase ใน [qr-gate-system-spec.md](./qr-gate-system-spec.md)

ดูภาพรวมใน [team-assignment-4dev-pm.md](./team-assignment-4dev-pm.md#4-ลำดับการพึ่งพา-แนะนำ)

---

## เอกสารทีมอื่น (อ่านเมื่อต้องประสาน)

- [team-assignment-dev-01.md](./team-assignment-dev-01.md) — Members API, Audit, Auth  
- [team-assignment-dev-02.md](./team-assignment-dev-02.md) — QR, Gate, Device (สำหรับ trigger แจ้งเตือน)  
- [team-assignment-dev-03.md](./team-assignment-dev-03.md) — i18n / design system  
