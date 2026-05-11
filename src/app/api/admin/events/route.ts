import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { AccessEventService } from '@/services/accessEventService';
import { handleApiError } from '@/lib/api-error';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const gateId = searchParams.get('gateId') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;

  try {
    const result = await AccessEventService.getEvents({
      search,
      gateId,
      page,
      limit,
      startDate,
      endDate
    });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
