import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { authWithRole, checkAccess } from '@/lib/auth-session';
import {
  ApiForbidden,
  ApiPaginated,
  ApiUnauthorized,
  handleError,
} from '@/lib/api-response';
import { withLoggedApi } from '@/lib/route-log';

export const GET = withLoggedApi(async (req: NextRequest) => {
  const session = await authWithRole();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!(await checkAccess(session, 'ROUTE_LOG', 'READ'))) return ApiForbidden();

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const source = searchParams.get('source') || undefined;
    const action = searchParams.get('action') || undefined;
    const path = searchParams.get('path') || undefined;
    const methodParam = searchParams.get('method') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const where: Prisma.RouteLogWhereInput = {
      ...(source && {
        source: source as Prisma.EnumRouteLogSourceFilter['equals'],
      }),
      ...(action && { action: { contains: action, mode: 'insensitive' } }),
      ...(path && { path: { contains: path, mode: 'insensitive' } }),
      ...(methodParam === '__none__' ? { method: null } : methodParam
        ? { method: methodParam.toUpperCase() }
        : {}),
      ...(userId && { userId }),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      prisma.routeLog.count({ where }),
      prisma.routeLog.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, fullName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return ApiPaginated(rows, total, page, limit);
  } catch (error) {
    return handleError(error);
  }
}, { action: 'api.admin.route_logs.get' });
