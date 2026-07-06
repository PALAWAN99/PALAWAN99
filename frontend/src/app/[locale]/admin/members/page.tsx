'use client';

import { useState, useEffect } from 'react';
import { getMembers } from './memberActions';
import MembersClient from './MembersClient';
import { Loader, Center, Title, Text, Stack } from '@mantine/core';

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getMembers();
        if (res.success) {
          setMembers(res.members || []);
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
