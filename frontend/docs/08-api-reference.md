# 📡 API Reference

> **ผู้รับผิดชอบ:** Dev 5 | **Priority:** 🔴 Critical  
> **Base URL:** `/api`  
> **Validation:** Zod on all endpoints

---

## 1. Endpoints Overview

### QR Code

| Method | Path | Auth | Description |
|--------|------|------|------------|
| `POST` | `/api/qr/issue` | Member/Officer | ออก QR Token |
| `POST` | `/api/qr/validate` | Device | Validate QR + บันทึก event |
| `POST` | `/api/qr/revoke` | Admin | เพิกถอน QR Token |
| `GET` | `/api/qr/status/:tokenId` | Member | ตรวจสอบสถานะ QR |

### Gate & Branch

| Method | Path | Auth | Description |
|--------|------|------|------------|
| `GET` | `/api/admin/gates` | Admin+ | รายการประตูทั้งหมด |
| `POST` | `/api/admin/gates` | Admin+ | สร้างประตูใหม่ |
| `PATCH` | `/api/admin/gates/:id` | Admin+ | แก้ไขประตู |
| `DELETE` | `/api/admin/gates/:id` | SuperAdmin | ลบประตู |
| `GET` | `/api/admin/branches` | Admin+ | รายการสาขา |
| `POST` | `/api/admin/branches` | Admin+ | สร้างสาขา |
| `PATCH` | `/api/admin/branches/:id` | Admin+ | แก้ไขสาขา |

### Members

| Method | Path | Auth | Description |
|--------|------|------|------------|
| `GET` | `/api/admin/members` | Admin+ | รายการสมาชิก + pagination |
| `POST` | `/api/admin/members` | Admin+ | สร้างสมาชิก |
| `PATCH` | `/api/admin/members/:id` | Admin+ | แก้ไขสมาชิก |
| `DELETE` | `/api/admin/members/:id` | Admin+ | ลบ/ระงับสมาชิก |
| `GET` | `/api/admin/members/:id/events` | Admin+ | ประวัติเข้า-ออกสมาชิก |

### Events & Reports

| Method | Path | Auth | Description |
|--------|------|------|------------|
| `GET` | `/api/admin/events` | Admin+ | Access events + filter |
| `GET` | `/api/admin/events/export` | Admin+ | Export CSV |
| `GET` | `/api/admin/dashboard/stats` | Admin+ | สถิติ dashboard |

### Devices

| Method | Path | Auth | Description |
|--------|------|------|------------|
| `GET` | `/api/admin/devices` | Admin+ | รายการอุปกรณ์ |
| `POST` | `/api/admin/devices` | Admin+ | ลงทะเบียนอุปกรณ์ |
| `POST` | `/api/device/heartbeat` | Device | อัปเดตสถานะอุปกรณ์ |

### ID Card

| Method | Path | Auth | Description |
|--------|------|------|------------|
| `POST` | `/api/idcard/register` | Device/Officer | อ่านบัตร + ลงทะเบียน |

### Users & Auth

| Method | Path | Auth | Description |
|--------|------|------|------------|
| `POST` | `/api/auth/[...nextauth]` | Public | NextAuth handlers |
| `GET` | `/api/admin/users` | SuperAdmin | รายการ users |
| `POST` | `/api/admin/users` | SuperAdmin | สร้าง user |

### Audit

| Method | Path | Auth | Description |
|--------|------|------|------------|
| `GET` | `/api/admin/audit` | SuperAdmin | Audit logs |

---

## 2. Request/Response Examples

### POST /api/qr/issue

**Request:**
```json
{
  "memberId": "uuid",
  "purpose": "ENTRY",
  "gateId": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tokenId": "uuid",
    "qrContent": "eyJhbGciOiJIUzI1NiJ9...",
    "purpose": "ENTRY",
    "issuedDate": "2026-04-28",
    "expiresAt": "2026-04-28T23:59:59.999+07:00"
  }
}
```

### POST /api/qr/validate

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "gateId": "uuid",
  "deviceCode": "MAIN-G1-SCN01"
}
```

**Response (200 — Allowed):**
```json
{
  "decision": "ALLOWED",
  "member": {
    "memberNo": "STD-2026-0001",
    "name": "สมชาย รักเรียน",
    "type": "STUDENT"
  },
  "event": { "id": "uuid", "scannedAt": "2026-04-28T10:30:00+07:00" }
}
```

**Response (410 — Expired):**
```json
{
  "decision": "DENIED",
  "reasonCode": "TOKEN_EXPIRED",
  "message": "QR Code has expired"
}
```

---

## 3. Error Codes

| Code | HTTP | TH | EN | ZH |
|------|------|-----|-----|-----|
| `INVALID_SIGNATURE` | 401 | ลายเซ็นไม่ถูกต้อง | Invalid signature | 签名无效 |
| `TOKEN_EXPIRED` | 410 | QR หมดอายุ | Token expired | 二维码已过期 |
| `TOKEN_REVOKED` | 410 | QR ถูกเพิกถอน | Token revoked | 二维码已撤销 |
| `ALREADY_USED` | 409 | QR ถูกใช้แล้ว | Already used | 已使用 |
| `TOKEN_NOT_FOUND` | 404 | ไม่พบ QR | Token not found | 未找到 |
| `MEMBER_INACTIVE` | 403 | สมาชิกไม่ active | Member inactive | 会员已停用 |
| `GATE_DISABLED` | 403 | ประตูปิด | Gate disabled | 门已停用 |
| `DAILY_LIMIT_EXCEEDED` | 429 | เกินจำนวนต่อวัน | Daily limit exceeded | 超出每日限额 |
| `OUTSIDE_HOURS` | 403 | นอกเวลาทำการ | Outside hours | 非工作时间 |
| `DIRECTION_MISMATCH` | 400 | ทิศทางไม่ตรง | Direction mismatch | 方向不匹配 |
| `DEVICE_UNKNOWN` | 401 | อุปกรณ์ไม่ได้ลงทะเบียน | Unknown device | 未注册设备 |
| `RATE_LIMITED` | 429 | คำขอมากเกินไป | Rate limited | 请求过多 |
| `VALIDATION_ERROR` | 422 | ข้อมูลไม่ถูกต้อง | Validation error | 数据验证失败 |
| `UNAUTHORIZED` | 401 | ไม่ได้เข้าสู่ระบบ | Unauthorized | 未授权 |
| `FORBIDDEN` | 403 | ไม่มีสิทธิ์ | Forbidden | 禁止访问 |

---

## 4. Pagination Format

**Request:** `GET /api/admin/events?page=1&limit=20&gateId=xxx&from=2026-04-01&to=2026-04-28`

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1543,
    "totalPages": 78
  }
}
```

---

## 5. Zod Schemas

```typescript
// lib/schemas/qr.ts
import { z } from 'zod';

export const issueQrSchema = z.object({
  memberId: z.string().uuid(),
  purpose: z.enum(['ENTRY', 'EXIT']),
  gateId: z.string().uuid().optional(),
});

export const validateQrSchema = z.object({
  token: z.string().min(10),
  gateId: z.string().uuid(),
  deviceCode: z.string().min(1),
});

// lib/schemas/gate.ts
export const createGateSchema = z.object({
  gateCode: z.string().min(1).max(20),
  nameTh: z.string().min(1),
  nameEn: z.string().min(1),
  nameZh: z.string().min(1),
  branchId: z.string().uuid(),
  direction: z.enum(['IN', 'OUT', 'BIDIRECTIONAL']),
});

// lib/schemas/member.ts
export const createMemberSchema = z.object({
  memberNo: z.string().min(1).max(30),
  citizenId: z.string().length(13).optional(),
  firstNameTh: z.string().min(1),
  lastNameTh: z.string().min(1),
  firstNameEn: z.string().optional(),
  lastNameEn: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  memberType: z.enum(['STUDENT', 'STAFF', 'FACULTY', 'EXTERNAL', 'GUEST']),
});
```

---

*อ้างอิง: [02-qr-code-management.md](./02-qr-code-management.md) | [10-security-audit.md](./10-security-audit.md)*
