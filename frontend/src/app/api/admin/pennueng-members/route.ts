import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { logAction } from '@/lib/audit';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import {
  createPennuengMember,
  fetchPennuengMemberTypes,
  listPennuengMembers,
} from '@/lib/pennueng-members';
import { pennuengMemberSchema } from '@/validators/pennuengMemberValidator';
import {
  ApiSuccess,
  ApiCreated,
  ApiUnauthorized,
  ApiForbidden,
  ApiBadRequest,
  ApiServiceUnavailable,
  ApiValidationError,
  handleError,
} from '@/lib/api-response';
import type { PennuengMemberListResult, PennuengMemberTypeOption } from '@/types/pennueng-member';
import type { PennuengMemberSortField } from '@/lib/pennueng-members';

const MEMBER_SORT_FIELDS: PennuengMemberSortField[] = ['memberNo', 'name', 'memberType', 'contact', 'expireDate'];

function parseSortField(value: string | null): PennuengMemberSortField | undefined {
  return MEMBER_SORT_FIELDS.find((field) => field === value);
}

/** ข้อมูลสมาชิกตัวอย่าง — ใช้เมื่อ SQL Server ยังไม่ได้ตั้งค่า (Mock Mode) */
const MOCK_MEMBER_TYPES: PennuengMemberTypeOption[] = [
  { memberType: 'S', description: 'นักศึกษาปริญญาตรี', groupDetail: 'นักศึกษา' },
  { memberType: 'G', description: 'นักศึกษาบัณฑิต', groupDetail: 'นักศึกษา' },
  { memberType: 'T', description: 'อาจารย์/บุคลากร', groupDetail: 'บุคลากร' },
  { memberType: 'X', description: 'บุคคลภายนอก', groupDetail: null },
];

const MOCK_MEMBERS: PennuengMemberListResult['members'] = [
  {
    memberNo: 'S001-MOCK', memberType: 'S', memberTypeLabel: 'นักศึกษาปริญญาตรี',
    name: 'สมชาย', surname: 'ใจดี', personId: '1234567890123',
    email: 'somchai@kku.ac.th', tel: '0812345678',
    groupCode: 'EN', departmentCode: 'CS',
    prenameCode: 'นาย', sex: 'M', address: 'ขอนแก่น',
    birthDate: '2000-01-15', memberDate: '2022-06-01',
    expireDate: '2026-06-01', memberStatus: 1, description: null,
  },
  {
    memberNo: 'S002-MOCK', memberType: 'S', memberTypeLabel: 'นักศึกษาปริญญาตรี',
    name: 'สมหญิง', surname: 'รักเรียน', personId: '9876543210123',
    email: 'somying@kku.ac.th', tel: '0898765432',
    groupCode: 'SC', departmentCode: 'BI',
    prenameCode: 'นางสาว', sex: 'F', address: 'ขอนแก่น',
    birthDate: '2001-05-20', memberDate: '2023-06-01',
    expireDate: '2027-06-01', memberStatus: 1, description: null,
  },
  {
    memberNo: 'T001-MOCK', memberType: 'T', memberTypeLabel: 'อาจารย์/บุคลากร',
    name: 'ประสิทธิ์', surname: 'วิชาการ', personId: '5432109876543',
    email: 'prasit@kku.ac.th', tel: '0876543210',
    groupCode: 'EN', departmentCode: 'CE',
    prenameCode: 'ผศ.ดร.', sex: 'M', address: 'ขอนแก่น',
    birthDate: '1975-03-10', memberDate: '2010-01-01',
    expireDate: '2028-12-31', memberStatus: 1, description: 'ผู้ช่วยศาสตราจารย์',
  },
  {
    memberNo: 'G001-MOCK', memberType: 'G', memberTypeLabel: 'นักศึกษาบัณฑิต',
    name: 'วิทยา', surname: 'มุ่งมั่น', personId: '1122334455667',
    email: 'wittaya@kku.ac.th', tel: '0654321098',
    groupCode: 'GS', departmentCode: 'IT',
    prenameCode: 'นาย', sex: 'M', address: 'มหาสารคาม',
    birthDate: '1998-08-08', memberDate: '2024-06-01',
    expireDate: '2026-06-01', memberStatus: 1, description: null,
  },
];

/** GET /api/admin/pennueng-members — รายชื่อจาก Pennueng SQL Server */
export async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'READ')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    // Mock Mode — ส่งข้อมูลตัวอย่างแทนการ error เพื่อให้พัฒนาได้โดยไม่ต้องต่อ SQL Server
    const { searchParams } = new URL(req.url);
    const typesOnly = searchParams.get('types') === '1';
    if (typesOnly) {
      return NextResponse.json({ success: true, data: { types: MOCK_MEMBER_TYPES }, mock: true });
    }
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const memberType = searchParams.get('type');

    let filtered = MOCK_MEMBERS.filter((m) => {
      const matchSearch = !search || [m.memberNo, m.name, m.surname, m.personId, m.email, m.tel]
        .some((v) => v?.toLowerCase().includes(search));
      const matchType = !memberType || m.memberType === memberType;
      return matchSearch && matchType;
    });
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    filtered = filtered.slice((page - 1) * limit, page * limit);
    return NextResponse.json({
      success: true,
      data: { members: filtered, total, pages, page, limit },
      mock: true,
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const typesOnly = searchParams.get('types') === '1';
    const sortBy = parseSortField(searchParams.get('sortBy'));
    const sortDir = searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc';

    if (typesOnly) {
      const types = await fetchPennuengMemberTypes();
      return ApiSuccess({ types });
    }

    const result = await listPennuengMembers({
      search,
      page,
      limit,
      memberType: type,
      sortBy,
      sortDir,
    });
    return ApiSuccess(result);
  } catch (error) {
    return handleError(error);
  }
}

/** POST /api/admin/pennueng-members — สร้างสมาชิกใน mbmembmaster */
export async function POST(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'CREATE')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('อยู่ในโหมดทดสอบ (Mock Mode) — ไม่สามารถเพิ่มสมาชิกได้จนกว่าจะเชื่อมต่อกับ SQL Server จริง');
  }

  try {
    const body = await req.json();
    const parsed = pennuengMemberSchema.safeParse({
      ...body,
      email: body.email || null,
    });
    if (!parsed.success) return ApiValidationError(parsed.error);

    const member = await createPennuengMember(parsed.data);

    await logAction({
      action: 'CREATE',
      resource: 'MEMBER',
      resourceId: member.memberNo,
      after: member,
      req,
    });

    return ApiCreated(member, 'เพิ่มสมาชิก Pennueng เรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}
