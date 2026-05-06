# 🌏 Multi-Language (i18n) — TH / EN / 中文简体

> **ผู้รับผิดชอบ:** Dev 3 | **Priority:** 🟡 High  
> **Tech:** next-intl

---

## 1. Supported Languages

| Code | ภาษา | Font Family | Default |
|------|------|------------|---------|
| `th` | ไทย | Noto Sans Thai | ✅ |
| `en` | English | Inter | — |
| `zh` | 中文简体 | Noto Sans SC | — |

---

## 2. Project Structure

```
src/
├── i18n/
│   ├── config.ts          # i18n configuration
│   ├── request.ts         # next-intl request config
│   └── routing.ts         # locale routing
├── messages/
│   ├── th.json            # Thai translations
│   ├── en.json            # English translations
│   └── zh.json            # Chinese translations
├── app/
│   └── [locale]/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── login/
│       ├── admin/
│       └── gate/
```

---

## 3. Configuration

```typescript
// src/i18n/config.ts
export const locales = ['th', 'en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'th';

export const localeNames: Record<Locale, string> = {
  th: 'ไทย',
  en: 'English',
  zh: '中文',
};
```

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // ไม่แสดง /th ใน URL (default)
});
```

---

## 4. Translation Keys Structure

```json
// messages/th.json
{
  "common": {
    "appName": "ระบบ QR Gate Access",
    "save": "บันทึก",
    "cancel": "ยกเลิก",
    "delete": "ลบ",
    "edit": "แก้ไข",
    "search": "ค้นหา",
    "loading": "กำลังโหลด...",
    "confirm": "ยืนยัน",
    "back": "กลับ",
    "export": "ส่งออก",
    "noData": "ไม่มีข้อมูล"
  },
  "auth": {
    "login": "เข้าสู่ระบบ",
    "logout": "ออกจากระบบ",
    "email": "อีเมล",
    "password": "รหัสผ่าน",
    "loginFailed": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    "unauthorized": "คุณไม่มีสิทธิ์เข้าถึงหน้านี้"
  },
  "qr": {
    "issueQr": "ออก QR Code",
    "scanQr": "สแกน QR Code",
    "entry": "เข้า",
    "exit": "ออก",
    "expired": "QR หมดอายุแล้ว",
    "valid": "QR ใช้งานได้",
    "timeRemaining": "เหลือเวลา: {hours} ชม. {minutes} นาที",
    "dailyExpiry": "QR นี้จะหมดอายุเที่ยงคืนวันนี้"
  },
  "gate": {
    "title": "จัดการประตู",
    "name": "ชื่อประตู",
    "code": "รหัสประตู",
    "branch": "สาขา",
    "status": "สถานะ",
    "active": "ใช้งาน",
    "maintenance": "ซ่อมบำรุง",
    "disabled": "ปิด"
  },
  "member": {
    "title": "สมาชิก",
    "memberNo": "รหัสสมาชิก",
    "name": "ชื่อ-สกุล",
    "type": "ประเภท",
    "student": "นักศึกษา",
    "staff": "บุคลากร",
    "external": "บุคคลภายนอก",
    "guest": "ผู้เยี่ยมชม"
  },
  "dashboard": {
    "title": "แดชบอร์ด",
    "todayVisitors": "ผู้เข้าใช้วันนี้",
    "currentInside": "อยู่ภายในขณะนี้",
    "totalScans": "สแกนทั้งหมด",
    "activeGates": "ประตูที่ใช้งาน"
  },
  "idcard": {
    "insertCard": "กรุณาเสียบบัตรประชาชน",
    "reading": "กำลังอ่านบัตร...",
    "success": "อ่านบัตรสำเร็จ",
    "failed": "อ่านบัตรไม่สำเร็จ",
    "privacyNotice": "ข้อมูลจะถูกใช้เพื่อการลงทะเบียนเท่านั้น"
  }
}
```

```json
// messages/en.json
{
  "common": {
    "appName": "QR Gate Access System",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "search": "Search",
    "loading": "Loading...",
    "confirm": "Confirm",
    "back": "Back",
    "export": "Export",
    "noData": "No data"
  },
  "auth": {
    "login": "Sign In",
    "logout": "Sign Out",
    "email": "Email",
    "password": "Password",
    "loginFailed": "Invalid email or password",
    "unauthorized": "You do not have permission to access this page"
  },
  "qr": {
    "issueQr": "Issue QR Code",
    "scanQr": "Scan QR Code",
    "entry": "Entry",
    "exit": "Exit",
    "expired": "QR Code has expired",
    "valid": "QR Code is valid",
    "timeRemaining": "Time remaining: {hours}h {minutes}m",
    "dailyExpiry": "This QR expires at midnight today"
  },
  "gate": {
    "title": "Gate Management",
    "name": "Gate Name",
    "code": "Gate Code",
    "branch": "Branch",
    "status": "Status",
    "active": "Active",
    "maintenance": "Maintenance",
    "disabled": "Disabled"
  },
  "member": {
    "title": "Members",
    "memberNo": "Member No.",
    "name": "Name",
    "type": "Type",
    "student": "Student",
    "staff": "Staff",
    "external": "External",
    "guest": "Guest"
  },
  "dashboard": {
    "title": "Dashboard",
    "todayVisitors": "Today's Visitors",
    "currentInside": "Currently Inside",
    "totalScans": "Total Scans",
    "activeGates": "Active Gates"
  },
  "idcard": {
    "insertCard": "Please insert your ID card",
    "reading": "Reading card...",
    "success": "Card read successfully",
    "failed": "Failed to read card",
    "privacyNotice": "Data will be used for registration only"
  }
}
```

```json
// messages/zh.json
{
  "common": {
    "appName": "QR门禁系统",
    "save": "保存",
    "cancel": "取消",
    "delete": "删除",
    "edit": "编辑",
    "search": "搜索",
    "loading": "加载中...",
    "confirm": "确认",
    "back": "返回",
    "export": "导出",
    "noData": "暂无数据"
  },
  "auth": {
    "login": "登录",
    "logout": "退出",
    "email": "邮箱",
    "password": "密码",
    "loginFailed": "邮箱或密码不正确",
    "unauthorized": "您没有权限访问此页面"
  },
  "qr": {
    "issueQr": "生成QR码",
    "scanQr": "扫描QR码",
    "entry": "入场",
    "exit": "出场",
    "expired": "QR码已过期",
    "valid": "QR码有效",
    "timeRemaining": "剩余时间：{hours}小时{minutes}分钟",
    "dailyExpiry": "此QR码将于今天午夜过期"
  },
  "gate": {
    "title": "门禁管理",
    "name": "门名称",
    "code": "门编号",
    "branch": "分支",
    "status": "状态",
    "active": "启用",
    "maintenance": "维护中",
    "disabled": "停用"
  },
  "member": {
    "title": "会员",
    "memberNo": "会员编号",
    "name": "姓名",
    "type": "类型",
    "student": "学生",
    "staff": "员工",
    "external": "外部人员",
    "guest": "访客"
  },
  "dashboard": {
    "title": "仪表盘",
    "todayVisitors": "今日访客",
    "currentInside": "目前在内",
    "totalScans": "总扫描次数",
    "activeGates": "启用的门"
  },
  "idcard": {
    "insertCard": "请插入身份证",
    "reading": "正在读取...",
    "success": "读取成功",
    "failed": "读取失败",
    "privacyNotice": "数据仅用于注册"
  }
}
```

---

## 5. Usage in Components

```typescript
// app/[locale]/admin/gates/page.tsx
import { useTranslations } from 'next-intl';

export default function GatesPage() {
  const t = useTranslations('gate');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      {/* ... */}
    </div>
  );
}
```

---

## 6. Language Switcher Component

```typescript
// components/LanguageSwitcher.tsx
'use client';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Select } from '@mantine/core';
import { localeNames, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const options = Object.entries(localeNames).map(([value, label]) => ({
    value, label,
  }));

  return (
    <Select
      value={locale}
      data={options}
      onChange={(val) => {
        if (val) router.replace(`/${val}${pathname}`);
      }}
      size="xs"
      w={100}
    />
  );
}
```

---

## 7. Date/Time Locale Formatting

| Locale | Date Format | Time Format | Example |
|--------|------------|------------|---------|
| `th` | `dd/MM/yyyy` (พ.ศ.) | `HH:mm น.` | 28/04/2569 11:30 น. |
| `en` | `MM/dd/yyyy` | `hh:mm A` | 04/28/2026 11:30 AM |
| `zh` | `yyyy年MM月dd日` | `HH:mm` | 2026年04月28日 11:30 |

---

*อ้างอิง: [07-ui-design-system.md](./07-ui-design-system.md) | [00-project-overview.md](./00-project-overview.md)*
