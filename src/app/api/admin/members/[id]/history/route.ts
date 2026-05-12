import { NextRequest } from 'next/server';
import { MemberService } from '@/services/memberService';
import { auth } from '@/auth';
import { ApiSuccess, ApiUnauthorized, ApiBadRequest, handleError } from '@/lib/api-response';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return ApiUnauthorized();
    }

    const { id } = params;
    if (!id) {
      return ApiBadRequest('Member ID is required');

    }

    const history = await MemberService.getMemberAccessHistory(id);

    return ApiSuccess({ history }, 'Member history retrieved successfully');
  } catch (error) {
    return handleError(error);
  }
}
