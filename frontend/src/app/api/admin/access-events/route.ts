import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { checkAccess } from '@/lib/rbac';
import { ApiSuccess, ApiUnauthorized, ApiForbidden, handleError } from '@/lib/api-response';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { withLoggedApi } from '@/lib/route-log';
import { isSqlServerConfigured, getSqlServerPool } from '@/lib/sqlserver';
import { loadGateDisplayRegistry } from '@/lib/gate-display-registry';
import { pennuengSqlDateToIso } from '@/lib/pennueng-datetime';
import { pennuengStatusToDirection } from '@/lib/pennueng-dashboard';

export const GET = withLoggedApi(async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'ACCESS_EVENT', 'READ')) return ApiForbidden();

  // If SQL Server is configured, fetch from the real gate statement database
  if (isSqlServerConfigured()) {
    try {
      const pool = await getSqlServerPool();
      const gateLabels = await loadGateDisplayRegistry('th');

      const result = await pool.request().query<any>(`
        SELECT TOP 50
          gs.id,
          gs.operate_date,
          gs.status,
          gs.success,
          gs.name,
          gs.surname,
          RTRIM(gs.gate_id) AS gate_id,
          COALESCE(NULLIF(RTRIM(g.gate_name), ''), RTRIM(gs.gate_id)) AS gate_name,
          RTRIM(gs.member_no) AS member_no,
          RTRIM(gs.member_key) AS member_key,
          RTRIM(gs.member_type) AS member_type,
          COALESCE(NULLIF(RTRIM(mt.description), ''), NULLIF(RTRIM(gs.member_type), ''), N'—') AS member_type_label,
          RTRIM(m.department_code) AS department_code,
          RTRIM(dept.department_desc) AS department_desc,
          RTRIM(gs.remark) AS remark
        FROM gatestatement gs WITH (NOLOCK)
        LEFT JOIN gatemaster g ON RTRIM(gs.gate_id) = RTRIM(g.gate_id)
        LEFT JOIN mbmembtype mt ON RTRIM(gs.member_type) = RTRIM(mt.member_type)
        LEFT JOIN mbmembmaster m ON RTRIM(gs.member_no) = RTRIM(m.member_no)
        LEFT JOIN mbdepartment dept ON RTRIM(m.department_code) = RTRIM(dept.department_code)
        ORDER BY gs.operate_date DESC, gs.id DESC
      `);

      const formattedEvents = result.recordset.map((row) => {
        const gateCode = row.gate_name?.trim() || row.gate_id?.trim() || '—';
        const resolvedGate = gateLabels.resolve(gateCode);
        const iso = pennuengSqlDateToIso(new Date(row.operate_date));

        return {
          id: String(row.id),
          gateId: row.gate_id?.trim() || '',
          memberId: row.member_no?.trim() || '',
          direction: pennuengStatusToDirection(row.status),
          decision: row.success === 1 ? 'ALLOWED' : 'DENIED',
          reasonCode: row.remark?.trim() || null,
          scannedAt: iso,
          gate: {
            gateCode: resolvedGate.displayName || gateCode,
          },
          member: {
            firstNameTh: row.name?.trim() || '—',
            lastNameTh: row.surname?.trim() || '',
            memberType: row.member_type?.trim() || 'EXTERNAL',
            department: row.department_desc?.trim() || null,
          },
        };
      });

      return ApiSuccess(formattedEvents);
    } catch (error) {
      console.error('[access-events SQL Server GET]', error);
      // Fallback to postgres on SQL Server connection failure during query
    }
  }

  try {
    const events = await prisma.accessEvent.findMany({
      take: 50,
      orderBy: { scannedAt: 'desc' },
      include: {
        gate: {
          select: {
            gateCode: true,
          },
        },
        member: {
          select: {
            firstNameTh: true,
            lastNameTh: true,
            memberType: true,
            metadata: true,
          },
        },
      },
    });

    // Map metadata.department/departmentCode/school to member.department
    const formattedEvents = events.map((event) => {
      const member = event.member;
      const metadata = (member?.metadata as any) || {};
      const department = metadata.department || metadata.departmentCode || metadata.school || '';
      
      return {
        id: event.id,
        gateId: event.gateId,
        memberId: event.memberId,
        qrTokenId: event.qrTokenId,
        direction: event.direction,
        source: event.source,
        decision: event.decision,
        reasonCode: event.reasonCode,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        scannedAt: event.scannedAt,
        createdAt: event.createdAt,
        gate: event.gate,
        member: member
          ? {
              firstNameTh: member.firstNameTh,
              lastNameTh: member.lastNameTh,
              memberType: member.memberType,
              department,
            }
          : null,
      };
    });

    return ApiSuccess(formattedEvents);
  } catch (error) {
    return handleError(error);
  }
});
