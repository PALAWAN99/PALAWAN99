export type ReportGateOption = {
  id: string;
  label: string;
  code: string;
};

export type ReportsDailyPoint = {
  date: string;
  label: string;
  total: number;
  allowed: number;
  denied: number;
  in: number;
  out: number;
};

export type ReportsGateRow = {
  gateId: string;
  gateName: string;
  code: string;
  total: number;
  allowed: number;
  denied: number;
  in: number;
  out: number;
  denyRate: number;
  avgDaily: number;
};

export type ReportsNamedValue = {
  name: string;
  value: number;
  color?: string;
};

export type ReportsInOutPoint = {
  name: string;
  in: number;
  out: number;
  denied: number;
  total: number;
};

export type ReportsRadarPoint = {
  gate: string;
  total: number;
  allowed: number;
  denied: number;
  in: number;
  out: number;
};

export type ReportsDenyRatePoint = {
  date: string;
  label: string;
  total: number;
  denyRate: number;
};

export type ReportsFunnelStep = {
  name: string;
  value: number;
  fill: string;
};

export type ReportsAnalyticsPayload = {
  source: 'pennueng' | 'postgres';
  summary: {
    totalScans: number;
    allowed: number;
    denied: number;
    uniqueMembers: number;
    activeGatesInRange: number;
    avgDailyScans: number;
    denyRate: number;
  };
  dailyTrend: ReportsDailyPoint[];
  cumulativeTrend: { date: string; label: string; cumulative: number }[];
  gateShare: ReportsNamedValue[];
  gateInOut: ReportsInOutPoint[];
  hourlyDistribution: { hour: string; count: number }[];
  weekdayDistribution: ReportsNamedValue[];
  memberTypeAccess: ReportsNamedValue[];
  gateRadar: ReportsRadarPoint[];
  denyRateTrend: ReportsDenyRatePoint[];
  funnel: ReportsFunnelStep[];
  detailTable: ReportsGateRow[];
};

export type ReportsAnalyticsQuery = {
  startDate: string;
  endDate: string;
  gateIds: string[];
};
