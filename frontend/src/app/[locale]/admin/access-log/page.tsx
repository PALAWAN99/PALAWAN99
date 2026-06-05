'use client';

import { useEffect, useState, useCallback } from 'react';
import { Container, SimpleGrid, Card, Text, Title, Group, Stack, Badge, Loader, ActionIcon, Tooltip } from '@mantine/core';
import { IconRefresh, IconDoorEnter, IconDoorExit, IconAlertTriangle, IconActivity } from '@tabler/icons-react';
import { apiPath } from '@/lib/base-path';
import { unwrapApiData } from '@/lib/parse-api-response';
import { AccessEventCard, type AccessEventCardEvent } from './_components/AccessEventCard';

export default function AccessLogPage() {
  const [events, setEvents] = useState<AccessEventCardEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setRefreshing(true);
    }
    try {
      const res = await fetch(apiPath('/api/admin/access-events'));
      if (!res.ok) {
        throw new Error('Failed to fetch access events');
      }
      const json = await res.json();
      const data = unwrapApiData<AccessEventCardEvent[]>(json);
      setEvents(data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch on mount and set up interval for every 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchEvents();
    }, 0);

    const interval = setInterval(() => {
      void fetchEvents(true); // Silent update every 10 seconds
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchEvents]);

  // Calculations for Summary
  const totalCount = events.length;
  const inCount = events.filter((e) => e.direction === 'IN').length;
  const outCount = events.filter((e) => e.direction === 'OUT').length;
  const expiredCount = events.filter(
    (e) =>
      e.decision === 'DENIED' &&
      (e.reasonCode === 'MEMBER_EXPIRED' ||
        e.reasonCode === 'QR_EXPIRED' ||
        e.reasonCode === 'MEMBER_INACTIVE')
  ).length;

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="center">
          <div>
            <Group gap="xs" mb={4}>
              <IconActivity size={28} color="var(--mantine-color-blue-6)" />
              <Title order={2}>Access Log (รายการเข้า-ออก)</Title>
            </Group>
            <Text size="sm" c="dimmed">
              แสดงข้อมูลการสแกนผ่านประตูทางเข้า-ออกห้องสมุดแบบเรียลไทม์ (อัปเดตทุก 10 วินาที)
            </Text>
          </div>
          <Tooltip label="รีเฟรชข้อมูล">
            <ActionIcon
              variant="light"
              color="blue"
              size="lg"
              onClick={() => fetchEvents()}
              loading={refreshing}
            >
              <IconRefresh size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>

        {/* Summary Widgets */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
          {/* ทั้งหมด */}
          <Card withBorder radius="md" p="md" style={{ borderLeft: '4px solid var(--mantine-color-blue-5)' }}>
            <Group justify="space-between" wrap="nowrap">
              <Stack gap={2}>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">ทั้งหมด</Text>
                <Text size="xl" fw={700}>{totalCount}</Text>
              </Stack>
              <Badge size="lg" circle color="blue" variant="light">
                {totalCount}
              </Badge>
            </Group>
          </Card>

          {/* เข้า */}
          <Card withBorder radius="md" p="md" style={{ borderLeft: '4px solid var(--mantine-color-green-6)' }}>
            <Group justify="space-between" wrap="nowrap">
              <Stack gap={2}>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">เข้า</Text>
                <Text size="xl" fw={700} c="green.6">{inCount}</Text>
              </Stack>
              <Badge size="lg" circle color="green" variant="light">
                <IconDoorEnter size={14} />
              </Badge>
            </Group>
          </Card>

          {/* ออก */}
          <Card withBorder radius="md" p="md" style={{ borderLeft: '4px solid var(--mantine-color-orange-5)' }}>
            <Group justify="space-between" wrap="nowrap">
              <Stack gap={2}>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">ออก</Text>
                <Text size="xl" fw={700} c="orange.6">{outCount}</Text>
              </Stack>
              <Badge size="lg" circle color="orange" variant="light">
                <IconDoorExit size={14} />
              </Badge>
            </Group>
          </Card>

          {/* บัตรหมดอายุ */}
          <Card withBorder radius="md" p="md" style={{ borderLeft: '4px solid var(--mantine-color-red-6)' }}>
            <Group justify="space-between" wrap="nowrap">
              <Stack gap={2}>
                <Text size="xs" c="dimmed" fw={700} tt="uppercase">บัตรหมดอายุ</Text>
                <Text size="xl" fw={700} c="red.6">{expiredCount}</Text>
              </Stack>
              <Badge size="lg" circle color="red" variant="light">
                <IconAlertTriangle size={14} />
              </Badge>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Content list */}
        {loading ? (
          <Group justify="center" py="xl">
            <Loader size="md" />
            <Text c="dimmed">กำลังโหลดข้อมูลรายการเข้า-ออก...</Text>
          </Group>
        ) : error ? (
          <Card withBorder color="red" p="md" radius="md">
            <Text c="red" fw={600}>{error}</Text>
          </Card>
        ) : events.length === 0 ? (
          <Card withBorder p="xl" radius="md">
            <Text ta="center" c="dimmed">ไม่พบรายการสแกนผ่านประตูทางเข้า-ออก</Text>
          </Card>
        ) : (
          <Stack gap="sm">
            {events.map((event, index) => (
              <AccessEventCard
                key={event.id}
                event={event}
                isLatest={index === 0}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
