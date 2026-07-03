export type GateHistoryDirection = 'IN' | 'OUT';

export type GateHistoryDecision = 'ALLOWED' | 'DENIED';

export type PennuengGateHistoryRow = {
  id: number;
  scannedAt: string;
  scannedAtLabel: string;
  direction: GateHistoryDirection;
  decision: GateHistoryDecision;
  memberNo: string | null;
  memberKey: string | null;
  memberType: string | null;
  memberTypeLabel: string | null;
  personId: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  gateId: string;
  gateName: string;
  gateLabel: string;
  remark: string | null;
};

export type PennuengGateHistoryResult = {
  rows: PennuengGateHistoryRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type PennuengGateHistoryQuery = {
  startDate: string;
  endDate: string;
  gateId?: string;
  search?: string;
  memberType?: string;
  decision?: string;
  direction?: string;
  department?: string;
  memberNo?: string;
  page: number;
  pageSize: number;
  /** เมื่อ true จะดึงทุกแถวที่ตรงเงื่อนไข (จำกัดด้วย MAX_PAGE_SIZE) แทนการแบ่งหน้าตาม pageSize */
  all?: boolean;
};
