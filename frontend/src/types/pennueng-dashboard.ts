export type PennuengDashboardStats = {
  members: { total: number; active: number };
  gates: { total: number; active: number };
  todayScans: number;
  todaySuccess: number;
  todayDenied: number;
};

export type PennuengHourlyPoint = {
  name: string;
  in: number;
  out: number;
};

export type PennuengGateTraffic = {
  /** Display label (Thai / admin name) */
  name: string;
  /** Raw Pennueng gate code e.g. cel-b0-1 */
  code: string;
  value: number;
  color: string;
};

export type PennuengGateStatusRow = {
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
  in: number;
  out: number;
  lastScan: string;
};

export type PennuengMemberTypeSlice = {
  name: string;
  value: number;
  /** ป้ายสั้นบนแกน (ชื่อเต็มใน tooltip) */
  axisLabel?: string;
};

export type PennuengRecentEvent = {
  id: string;
  scannedAt: string;
  direction: 'IN' | 'OUT';
  decision: 'ALLOWED' | 'DENIED';
  member?: { firstNameTh: string; lastNameTh: string };
  memberType?: string;
  gateName?: string;
  gateCode?: string;
};

export type PennuengDashboardPayload = {
  source: 'pennueng';
  stats: PennuengDashboardStats;
  chartData: PennuengHourlyPoint[];
  gateTraffic: PennuengGateTraffic[];
  gateStatus: PennuengGateStatusRow[];
  memberTypes: PennuengMemberTypeSlice[];
  /** หลักสูตร/ภาควิชา (mbdepartment) จำนวนสมาชิกสูงสุด */
  topCurricula: PennuengMemberTypeSlice[];
  recentEvents: PennuengRecentEvent[];
};
