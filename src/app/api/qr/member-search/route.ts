import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 });

    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { memberNo: query },
          { citizenId: query },
          { phone: query },
        ]
      },
      select: {
        id: true,
        memberNo: true,
        firstNameTh: true,
        lastNameTh: true,
        status: true,
      }
    });

    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
