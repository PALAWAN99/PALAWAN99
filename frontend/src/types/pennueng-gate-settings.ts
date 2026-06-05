export type PennuengGateSettingsRow = {
  gateId: string;
  gateName: string;
  displayLabel: string;
  branchId: string | null;
  branchDesc: string | null;
  gateIp: string | null;
  gateSubnet: string | null;
  gateGateway: string | null;
  gatePort: string | null;
  serverIp: string | null;
  rfidIp: string | null;
  inputIp: string | null;
  gateSerial: string | null;
  gateStatus: number;
};

export type PennuengGateSettingsUpdate = {
  gateIp?: string | null;
  gateSubnet?: string | null;
  gateGateway?: string | null;
  gatePort?: string | null;
  serverIp?: string | null;
  rfidIp?: string | null;
  inputIp?: string | null;
  gateStatus?: number;
};
