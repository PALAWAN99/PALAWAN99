# 🔔 Notification System

> **ผู้รับผิดชอบ:** Dev 4 | **Priority:** 🟢 Medium  
> **Dependencies:** Auth (Dev 1), AccessEvent (Dev 2)

---

## 1. Notification Types

| Type | Trigger | ระดับ | ผู้รับ |
|------|---------|------|------|
| `SECURITY_BREACH` | QR ปลอมถูกสแกน > 5 ครั้ง/ชม. | 🔴 Critical | Super Admin |
| `GATE_OFFLINE` | อุปกรณ์ไม่ heartbeat > 5 นาที | 🟡 Warning | Admin |
| `GATE_BACK_ONLINE` | อุปกรณ์กลับมา online | 🟢 Info | Admin |
| `CAPACITY_WARNING` | คนภายใน > 80% capacity | 🟡 Warning | Admin |
| `DAILY_REPORT` | สรุปสถิติประจำวัน | 🔵 Info | Admin |
| `MEMBER_EXPIRED` | สมาชิกหมดอายุ (batch) | 🔵 Info | Admin |
| `QR_ANOMALY` | สแกน QR ผิดปกติ (เช่น ใช้ซ้ำ) | 🟡 Warning | Gate Officer |
| `SYSTEM_ERROR` | Error rate สูงผิดปกติ | 🔴 Critical | Super Admin |

---

## 2. Notification Channels

### 2.1 In-App Notification

```typescript
// components/NotificationBell.tsx
'use client';
import { ActionIcon, Indicator, Popover, Stack, Text } from '@mantine/core';
import { IconBell } from '@tabler/icons-react';

export function NotificationBell() {
  const { notifications, unreadCount } = useNotifications();

  return (
    <Popover position="bottom-end" shadow="md">
      <Popover.Target>
        <Indicator label={unreadCount} size={16} disabled={unreadCount === 0}>
          <ActionIcon variant="subtle">
            <IconBell size={20} />
          </ActionIcon>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown w={350}>
        <Stack gap="xs">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
```

### 2.2 LINE Notify

```typescript
// lib/notifications/line-notify.ts
export async function sendLineNotify(message: string) {
  const token = process.env.LINE_NOTIFY_TOKEN;
  if (!token) return;

  await fetch('https://notify-api.line.me/api/notify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ message }),
  });
}
```

### 2.3 Email (Nodemailer)

```typescript
// lib/notifications/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'QR Gate <noreply@gate.local>',
    to, subject, html,
  });
}
```

---

## 3. Notification Preferences

| Channel | Super Admin | Admin | Gate Officer |
|---------|:-----------:|:-----:|:------------:|
| In-App | ✅ (all) | ✅ (all) | ✅ (own gate) |
| LINE Notify | ✅ Critical | ✅ Warning+ | ❌ |
| Email | ✅ Daily report | ✅ Daily report | ❌ |

---

## 4. Database Model

```prisma
model Notification {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @map("user_id") @db.Uuid
  type      String   @db.VarChar(50)
  title     String
  message   String
  level     String   @db.VarChar(20)  // critical, warning, info
  readAt    DateTime? @map("read_at")
  metadata  Json?
  createdAt DateTime @default(now()) @map("created_at")

  @@index([userId, readAt])
  @@index([createdAt])
  @@map("notifications")
}
```

---

## 5. Notification Dispatcher

```typescript
// lib/notifications/dispatcher.ts
type NotificationType = 'SECURITY_BREACH' | 'GATE_OFFLINE' | 'CAPACITY_WARNING' | ...;

interface NotifyPayload {
  type: NotificationType;
  title: string;
  message: string;
  level: 'critical' | 'warning' | 'info';
  metadata?: Record<string, unknown>;
}

export async function dispatch(payload: NotifyPayload) {
  // 1. Save to DB (in-app)
  const admins = await getRecipientsForType(payload.type);
  for (const admin of admins) {
    await prisma.notification.create({
      data: {
        userId: admin.id,
        ...payload,
      },
    });
  }

  // 2. LINE Notify (critical + warning)
  if (['critical', 'warning'].includes(payload.level)) {
    await sendLineNotify(`[${payload.level.toUpperCase()}] ${payload.title}: ${payload.message}`);
  }

  // 3. Email (critical only)
  if (payload.level === 'critical') {
    for (const admin of admins.filter(a => a.role === 'SUPER_ADMIN')) {
      await sendEmail(admin.email, payload.title, formatEmailTemplate(payload));
    }
  }
}
```

---

## 6. Daily Report Template

```
📊 รายงานประจำวัน — QR Gate Access
📅 วันที่: 28 เมษายน 2569

👤 ผู้เข้าใช้วันนี้: 142 คน
🏢 สูงสุดที่อยู่พร้อมกัน: 89 คน (เวลา 13:30 น.)
📊 สแกนทั้งหมด: 1,543 ครั้ง
🚪 ประตู Active: 8/10
❌ สแกนถูกปฏิเสธ: 12 ครั้ง
⚠️ เหตุการณ์ผิดปกติ: 0 ครั้ง
```

---

## 7. Environment Variables

| Variable | Required | Description |
|----------|----------|------------|
| `LINE_NOTIFY_TOKEN` | Optional | LINE Notify API token |
| `SMTP_HOST` | Optional | SMTP server host |
| `SMTP_PORT` | Optional | SMTP port (587) |
| `SMTP_USER` | Optional | SMTP username |
| `SMTP_PASS` | Optional | SMTP password |
| `SMTP_FROM` | Optional | From email address |

---

*อ้างอิง: [10-security-audit.md](./10-security-audit.md) | [09-dashboard-reports.md](./09-dashboard-reports.md)*
