# 📊 Dashboard & Reports

> **ผู้รับผิดชอบ:** Dev 3 | **Priority:** 🟡 High  
> **Dependencies:** Database (Dev 1), API (Dev 5)

---

## 1. Dashboard Pages

| หน้า | Path | Role | Description |
|------|------|------|------------|
| Main Dashboard | `/admin/dashboard` | Admin+ | ภาพรวมระบบทั้งหมด |
| Gate Monitor | `/admin/dashboard/gates` | Admin+ | สถานะประตู real-time |
| Access Log | `/admin/events` | Admin+ | รายการเข้า-ออก |
| Member Report | `/admin/reports/members` | Admin+ | รายงานสมาชิก |
| Gate Officer View | `/gate/dashboard` | Officer | หน้าประตูที่รับผิดชอบ |

---

## 2. Main Dashboard — Stats Cards

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  👤 142      │ │  🏢 89       │ │  📊 1,543    │ │  🚪 8/10     │
│  ผู้เข้าวันนี้  │ │  อยู่ภายในนี้   │ │  สแกนทั้งหมด    │ │  ประตู Active │
│  ▲ 12%       │ │  ▼ 3%        │ │  ▲ 8%        │ │              │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Stats API

```typescript
// GET /api/admin/dashboard/stats
interface DashboardStats {
  todayVisitors: number;       // จำนวนคนเข้าวันนี้ (unique members)
  currentInside: number;       // คนที่อยู่ภายในตอนนี้
  totalScans: number;          // สแกนทั้งหมดวันนี้
  activeGates: { active: number; total: number };
  comparedYesterday: {         // เปรียบเทียบเมื่อวาน
    visitors: number;          // +/- %
    scans: number;
  };
}
```

---

## 3. Charts

### 3.1 Hourly Traffic (Bar Chart)
- แกน X: ชั่วโมง (06:00–22:00)
- แกน Y: จำนวนคนเข้า/ออก
- สี: เข้า = `emerald`, ออก = `skyBlue`

### 3.2 Daily Trend (Line Chart)
- แกน X: วันที่ (7/30 วัน)
- แกน Y: จำนวนผู้เข้าใช้
- เส้น: Total, Student, Staff, External

### 3.3 Gate Usage (Pie/Donut Chart)
- แต่ละ gate: จำนวนสแกน
- สี: ตาม gate

### 3.4 Member Type Distribution (Donut)
- Student, Staff, Faculty, External, Guest

### Chart Library
```typescript
// ใช้ Recharts
import { BarChart, Bar, LineChart, Line, PieChart, Pie,
         XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
```

---

## 4. Access Event Log

### Filter Options

| Filter | Type | Options |
|--------|------|---------|
| วันที่ | Date Range | from – to |
| ประตู | Select | All / specific gate |
| สมาชิก | Search | ชื่อ / memberNo |
| ทิศทาง | Select | เข้า / ออก / ทั้งหมด |
| ผลลัพธ์ | Select | Allowed / Denied / ทั้งหมด |
| แหล่งที่มา | Select | QR / ID Card / Manual |

### Table Columns

| Column | Description | Sortable |
|--------|------------|----------|
| เวลา | scannedAt | ✅ |
| สมาชิก | ชื่อ + memberNo | ✅ |
| ประตู | ชื่อประตู | ✅ |
| ทิศทาง | เข้า/ออก (badge) | ✅ |
| แหล่ง | QR/ID Card/Manual | ✅ |
| ผลลัพธ์ | Allowed/Denied (badge) | ✅ |
| เหตุผล | reason code (ถ้า denied) | — |

---

## 5. Export

| Format | Description | Endpoint |
|--------|------------|----------|
| CSV | ดาวน์โหลดเป็น .csv | `GET /api/admin/events/export?format=csv` |
| PDF | สร้าง PDF report | `GET /api/admin/events/export?format=pdf` |
| JSON | Raw data | `GET /api/admin/events/export?format=json` |

### Export Filters
- ใช้ query params เดียวกับ Access Event Log
- จำกัด: สูงสุด 10,000 rows ต่อครั้ง

---

## 6. Gate Monitor (Real-time)

```
┌─────────────────────────────────────────────────┐
│  🚪 Gate Monitor                    🔄 Auto-refresh │
├─────────┬──────────┬───────┬───────┬────────────┤
│ ประตู    │ สถานะ     │ เข้า   │ ออก    │ สแกนล่าสุด   │
├─────────┼──────────┼───────┼───────┼────────────┤
│ ประตูหน้า │ 🟢 Active │  45   │  32   │ 10:28 น.   │
│ ประตูหลัง │ 🟢 Active │  23   │  18   │ 10:25 น.   │
│ ห้องสมุด  │ 🟡 Maint. │   0   │   0   │ 09:00 น.   │
└─────────┴──────────┴───────┴───────┴────────────┘
```

- Auto-refresh ทุก 30 วินาที (หรือ SSE/WebSocket)
- แสดงสถานะอุปกรณ์แต่ละ gate

---

*อ้างอิง: [07-ui-design-system.md](./07-ui-design-system.md) | [08-api-reference.md](./08-api-reference.md)*
