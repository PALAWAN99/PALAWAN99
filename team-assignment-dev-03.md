# Developer 3 — Design System, i18n & หน้ารายงาน/แดชบอร์ด

> แยกจาก [team-assignment-4dev-pm.md](./team-assignment-4dev-pm.md)  
> อัปเดตอ้างอิงสเปก: 2026-04-28

---

## บทบาท

ประสบการณ์ผู้ใช้แอดมิน ภาษา และการนำเสนอข้อมูล (แดชบอร์ด รายงาน เหตุการณ์)

---

## เมนู / Deliverable ที่รับผิดชอบ

| กลุ่มงาน | เมนู / Deliverable | เอกสารอ้างอิง |
|----------|-------------------|---------------|
| Design System | Mantine v9 + Tailwind, theme, typography, สี | [07-ui-design-system.md](./07-ui-design-system.md) |
| i18n | `next-intl`, `messages/th|en|zh.json`, routing `[locale]` | [06-i18n-multilanguage.md](./06-i18n-multilanguage.md) |
| แดชบอร์ด | `/admin/dashboard`, การ์ดสถิติ, charts | [09-dashboard-reports.md](./09-dashboard-reports.md) |
| มอนิเตอร์ประตู (UI) | `/admin/dashboard/gates` — consume API/สถานะจาก Dev 2 | [09-dashboard-reports.md](./09-dashboard-reports.md) |
| Access Log (UI) | `/admin/events`, filter, ตาราง | [09-dashboard-reports.md](./09-dashboard-reports.md) |
| รายงาน & Export (UI) | `/admin/reports/members`, ปุ่ม CSV/PDF เชื่อม API | [09-dashboard-reports.md](./09-dashboard-reports.md) |

### เส้นทาง UI โดยย่อ

| เมนู | เส้นทาง (ตัวอย่าง) |
|------|---------------------|
| แดชบอร์ดหลัก | `/admin/dashboard` |
| มอนิเตอร์ประตู | `/admin/dashboard/gates` |
| Access Log | `/admin/events` |
| รายงานสมาชิก | `/admin/reports/members` |

---

## สรุป

รับ **หลายเมนู** ที่เป็นหน้าจอข้อมูล และ **cross-cutting UI** (ธีม + ภาษา) ครอบทั้งแอป

---

## การประสานงานกับทีมอื่น

| หัวข้อ | หมายเหตุ |
|--------|----------|
| คำแปลเมนูใหม่ | **คุณเป็นเจ้าของคีย์แปล** — Dev อื่นเพิ่ม key ใน PR เดียวกับฟีเจอร์ได้ |
| สถิติแดชบอร์ด | consume `GET /api/admin/dashboard/stats` — ประสาน [Dev 1](./team-assignment-dev-01.md) / [Dev 2](./team-assignment-dev-02.md) ตามที่ implement |
| Events / export | consume `/api/admin/events`, export endpoints ตาม [08-api-reference.md](./08-api-reference.md) |
| การสแกนที่ประตู | logic จาก [Dev 2](./team-assignment-dev-02.md) — คุณช่วย UI/styling ถ้าแยกคอมโพเนนต์ |

---

## ลำดับการพึ่งพา

หลัง [Dev 1](./team-assignment-dev-01.md) (layout/auth) และควรมี API จาก [Dev 2](./team-assignment-dev-02.md) สำหรับข้อมูลประตู/เหตุการณ์บางส่วน — ดู [team-assignment-4dev-pm.md](./team-assignment-4dev-pm.md#4-ลำดับการพึ่งพา-แนะนำ)

---

## เอกสารทีมอื่น (อ่านเมื่อต้องประสาน)

- [team-assignment-dev-01.md](./team-assignment-dev-01.md) — Session, สิทธิ์เข้าหน้า admin  
- [team-assignment-dev-02.md](./team-assignment-dev-02.md) — ข้อมูล gate / device / validate  
- [team-assignment-dev-04.md](./team-assignment-dev-04.md) — เมนูสมาชิก UI (ไม่ทับกันถ้าแยก path ชัด)  
