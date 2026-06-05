import { NextRequest } from 'next/server';
import { MemberService } from '@/services/memberService';
import { auth } from '@/auth';
import { ApiSuccess, ApiUnauthorized, ApiBadRequest, handleError } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) {
      return ApiUnauthorized();
    }
    if (!id) {
      return ApiBadRequest('Member ID is required');

    }

    const history = await MemberService.getMemberAccessHistory(id);

    return ApiSuccess({ history }, 'Member history retrieved successfully');
  } catch (error) {
    return handleError(error);
  }
}
