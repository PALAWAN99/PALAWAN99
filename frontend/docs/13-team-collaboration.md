# 🤝 Team Collaboration & Workflow

> **บทบาท:** 4 Developers + 1 Project Manager (PM / DevOps)
> **Platform:** GitHub

---

## 👥 บทบาทหน้าที่ (Team Roles)

### 1. Project Manager (PM) & DevOps / Integrator

**ขอบเขต:** ผู้ควบคุมภาพรวมโครงการ และจัดการ Git/GitHub

- **GitHub Master:** ดูแล Repo, ตั้งค่า Branch Protection, จัดการ Pull Requests (PR)
- **DevOps:** จัดการ CI/CD, Deployment, Environment Variables (.env) บน Server
- **Integrator:** ตรวจสอบ Code Quality และทำการ Merge งานจากทุกคนเข้าสู่ `main` branch
- **Timeline:** ติดตามความคืบหน้าของ Dev ทั้ง 4 คน

### 2. Developer 1 — 🏗️ Infrastructure & Backend Core

**ขอบเขต:** รากฐานของระบบ และความปลอดภัย

- **Database:** Prisma Schema, Migrations, Seed Data
- **Auth:** NextAuth v5 setup, Role-based access control (RBAC)
- **API Core:** ออกแบบ Base API structure และ Middleware

### 3. Developer 2 — 🔐 Access Control Logic & Hardware

**ขอบเขต:** ตรรกะการเข้า-ออก และการเชื่อมต่ออุปกรณ์

- **QR Engine:** การออก QR, การตรวจสอบ (Validation), ตรรกะหมดอายุเที่ยงคืน
- **Hardware:** การเชื่อมต่อ Web USB API สำหรับเครื่องอ่านบัตรประชาชน
- **Gate Logic:** การจัดการสถานะประตู และ Device Heartbeat

### 4. Developer 3 — 🎨 UI/UX Architect

**ขอบเขต:** ส่วนหน้าบ้าน และประสบการณ์ผู้ใช้

- **Design System:** Mantine v9 + Tailwind setup, Theme customization
- **Admin UI:** สร้าง Layout หลัก, หน้า Dashboard, Real-time Monitor
- **Components:** สร้าง Reusable components (Badge, Stats Card, Tables)

### 5. Developer 4 — 📊 Features & Integrations

**ขอบเขต:** ฟังก์ชันเสริม และการจัดการข้อมูล

- **i18n:** ระบบ 3 ภาษา (TH/EN/ZH) และการแปล (Translations)
- **Reporting:** ระบบรายงาน, การ Export CSV/PDF, Charts
- **Notification:** ระบบแจ้งเตือน (In-app, LINE Notify, Email)
- **Audit Log:** บันทึกเหตุการณ์การเปลี่ยนแปลงข้อมูล

---

## 🔄 GitHub Workflow (กระบวนการทำงาน)

### 1. Branching Strategy

- **`main`**: Branch สำหรับ Production (PM เป็นคน Merge เท่านั้น)
- **`develop`**: Branch หลักสำหรับรวมงาน (Staging)
- **`feat/xxx`**: Branch แยกตามฟังก์ชัน (เช่น `feat/qr-gen`, `feat/dashboard`)

### 2. Pull Request (PR) Policy

1. Developer ทำงานเสร็จใน branch ตัวเอง
2. Push ขึ้น GitHub และเปิด PR เข้าสู่ `develop`
3. **PM** ตรวจสอบ Code (Code Review) และทดสอบเบื้องต้น
4. หากผ่าน -> PM Merge เข้า `develop`
5. ทุกสิ้นสัปดาห์ PM Merge `develop` เข้า `main` เพื่อปล่อยเวอร์ชันใหม่

---

## 🛠️ แผนการรวมงาน (DevOps Plan)

1. **GitHub Actions:** ตั้งค่าให้รัน `npm run build` และ `npx prisma validate` ทุกครั้งที่มี PR
2. **Environment Sync:** PM แจ้งการเปลี่ยนแปลง `.env` ในกลุ่มทีม
3. **Database Migration:** ทุกครั้งที่มีการเปลี่ยน Schema ให้รัน `npx prisma migrate dev` และแจ้งทีมให้ `npx prisma generate`

---

### 📌 หมายเหตุ

อัปเดตล่าสุด: 2026-04-28
