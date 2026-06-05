import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { checkAccess } from '@/lib/rbac';
import { ApiSuccess, ApiUnauthorized, ApiForbidden, handleError } from '@/lib/api-response';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { withLoggedApi } from '@/lib/route-log';

export const GET = withLoggedApi(async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'ACCESS_EVENT', 'READ')) return ApiForbidden();

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
