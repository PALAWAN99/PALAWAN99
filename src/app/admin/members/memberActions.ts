'use server';

import { prisma } from '@/lib/prisma';
import { MemberType, MemberStatus } from '@prisma/client';

export async function getMembers() {
  console.log('[MembersAction] Fetching members. DB_URL:', process.env.DATABASE_URL);
  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return { success: true, members };
  } catch (error: any) {
    console.error('[MembersAction] Error fetching members:', error);
    return { success: false, error: error.message || 'Failed to fetch members' };
  }
}

export async function addMember(data: any) {
  try {
    const member = await prisma.member.create({
      data: {
        memberNo: data.memberNo,
        citizenId: data.citizenId || null,
        firstNameTh: data.firstNameTh,
        lastNameTh: data.lastNameTh,
        firstNameEn: data.firstNameEn || null,
        lastNameEn: data.lastNameEn || null,
        email: data.email || null,
        phone: data.phone || null,
        memberType: data.memberType as MemberType,
        status: (data.status as MemberStatus) || 'ACTIVE',
        expireDate: data.expireDate ? new Date(data.expireDate) : null,
        metadata: {
          birthDate: data.birthDate || '',
          gender: data.gender || '',
          address: data.address || '',
          school: data.school || ''
        },
      },
    });
    return { success: true, member };
  } catch (error: any) {
    console.error('[MembersAction] Error adding member:', error);
    return { success: false, error: error.message || 'Failed to add member' };
  }
}

export async function updateMember(id: string, data: any) {
  try {
    const member = await prisma.member.update({
      where: { id },
      data: {
        memberNo: data.memberNo,
        citizenId: data.citizenId || null,
        firstNameTh: data.firstNameTh,
        lastNameTh: data.lastNameTh,
        firstNameEn: data.firstNameEn || null,
        lastNameEn: data.lastNameEn || null,
        email: data.email || null,
        phone: data.phone || null,
        memberType: data.memberType as MemberType,
        status: data.status as MemberStatus,
        expireDate: data.expireDate ? new Date(data.expireDate) : null,
        metadata: {
          birthDate: data.birthDate || '',
          gender: data.gender || '',
          address: data.address || '',
          school: data.school || ''
        },
      },
    });
    return { success: true, member };
  } catch (error: any) {
    console.error('[MembersAction] Error updating member:', error);
    return { success: false, error: error.message || 'Failed to update member' };
  }
}

export async function deleteMember(id: string) {
  try {
    await prisma.member.delete({
      where: { id },
    });
    return { success: true };
  } catch (error: any) {
    console.error('[MembersAction] Error deleting member:', error);
    return { success: false, error: error.message || 'Failed to delete member' };
  }
}
