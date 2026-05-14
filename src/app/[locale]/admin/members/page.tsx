'use client';

import { useState, useEffect } from 'react';
import { getMembers } from './memberActions';
import MembersClient from './MembersClient';
import { Loader, Center, Title, Text, Stack } from '@mantine/core';

const MOCK_MEMBERS = [
  {
    id: 'm1',
    memberNo: '6600001',
    firstNameTh: 'สมชาย',
    lastNameTh: 'ใจดี',
    firstNameEn: 'Somchai',
    lastNameEn: 'Jaidee',
    citizenId: '1-1001-xxxxx-xx-x',
    email: 'somchai@mail.com',
    phone: '081-234-5678',
    memberType: 'STUDENT',
    status: 'ACTIVE',
    expireDate: new Date('2028-05-01'),
    createdAt: new Date(),
    metadata: {
      birthDate: '10/10/2548',
      gender: 'ชาย',
      address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
      school: 'โรงเรียนสมมติวิทยา',
    }
  },
  {
    id: 'm2',
    memberNo: '6600002',
    firstNameTh: 'สมหญิง',
    lastNameTh: 'รักเรียน',
    firstNameEn: 'Somying',
    lastNameEn: 'Rakrian',
    citizenId: '3-4501-xxxxx-xx-x',
    email: 'somying@mail.com',
    phone: '089-876-5432',
    memberType: 'STUDENT',
    status: 'ACTIVE',
    expireDate: new Date('2028-05-01'),
    createdAt: new Date(),
    metadata: {
      birthDate: '15/05/2549',
      gender: 'หญิง',
      address: '456 ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพมหานคร 10400',
      school: 'โรงเรียนรักเรียนศึกษา',
    }
  },
  {
    id: 'm3',
    memberNo: 'EMP001',
    firstNameTh: 'สมศักดิ์',
    lastNameTh: 'ห้องสมุด',
    firstNameEn: 'Somsak',
    lastNameEn: 'Hongsamut',
    citizenId: '5-2201-xxxxx-xx-x',
    email: 'somsak.h@mail.com',
    phone: '081-111-1111',
    memberType: 'STAFF',
    status: 'ACTIVE',
    expireDate: new Date('2030-05-01'),
    createdAt: new Date(),
    metadata: {
      birthDate: '01/01/2523',
      gender: 'ชาย',
      address: '789 ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900',
      school: '',
    }
  },
  {
    id: 'm4',
    memberNo: 'EXT001',
    firstNameTh: 'วิชัย',
    lastNameTh: 'แวะมา',
    firstNameEn: 'Wichai',
    lastNameEn: 'Waema',
    citizenId: '1-2345-xxxxx-xx-x',
    email: 'wichai@mail.com',
    phone: '082-222-2222',
    memberType: 'EXTERNAL',
    status: 'EXPIRED',
    expireDate: new Date('2023-01-01'),
    createdAt: new Date('2022-01-01'),
    metadata: {
      birthDate: '20/12/2533',
      gender: 'ชาย',
      address: '321 ถนนเจริญกรุง แขวงบางรัก เขตบางรัก กรุงเทพมหานคร 10500',
      school: '',
    }
  }
];

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getMembers();
        if (res.success) {
          // If empty, use mock members for dev
          setMembers(res.members && res.members.length > 0 ? res.members : MOCK_MEMBERS);
        } else {
          setError(res.error || 'Failed to load members');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="lg" variant="dots" />
      </Center>
    );
  }

  if (error) {
    return (
      <Stack align="center" gap="md" mt={100}>
        <Title order={3} c="red">เกิดข้อผิดพลาด</Title>
        <Text>{error}</Text>
      </Stack>
    );
  }

  return <MembersClient initialMembers={members} />;
}
