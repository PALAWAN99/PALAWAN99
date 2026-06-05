/** สมาชิกจาก Pennueng mbmembmaster */
export type PennuengMember = {
  memberNo: string;
  memberType: string;
  memberTypeLabel: string | null;
  groupCode: string | null;
  departmentCode: string | null;
  prenameCode: string | null;
  name: string;
  surname: string;
  sex: string | null;
  address: string | null;
  tel: string | null;
  email: string | null;
  birthDate: string | null;
  personId: string | null;
  memberDate: string | null;
  expireDate: string | null;
  memberStatus: number | null;
  description: string | null;
};

export type PennuengMemberTypeOption = {
  memberType: string;
  description: string | null;
  groupDetail: string | null;
};

export type PennuengMemberSoftDeleteRow = {
  id: string;
  memberNo: string;
  snapshot: PennuengMember;
  deletedBy: string | null;
  deletedAt: string;
  restoredAt: string | null;
};

export type PennuengMemberListResult = {
  members: PennuengMember[];
  total: number;
  pages: number;
  page: number;
  limit: number;
};

export type PennuengMemberKey = {
  seqNo: number;
  memberKey: string;
  expireDate: string | null;
};

/** mbmemberkey + ข้อมูลสมาชิก (client/API) */
export type PennuengMemberKeyWithMember = PennuengMemberKey & {
  memberNo: string;
  name: string;
  surname: string;
  memberType: string;
  memberTypeLabel: string | null;
  groupDetail: string | null;
};
