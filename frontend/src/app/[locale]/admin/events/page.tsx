'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Text,
  Stack,
  Card,
  Badge,
  Group,
  ActionIcon,
  Alert,
  Tooltip,
  SimpleGrid,
  Loader,
  SegmentedControl,
  ThemeIcon,
} from '@mantine/core';
import {
  IconRefresh,
  IconActivity,
  IconHistory,
  IconDoorEnter,
  IconDoorExit,
  IconAlertTriangle,
  IconListCheck,
} from '@tabler/icons-react';
import { apiPath } from '@/lib/base-path';
import { unwrapApiData } from '@/lib/parse-api-response';
import { AccessEventCard } from '../access-log/_components/AccessEventCard';
import type { AccessEventCardEvent } from '../access-log/_components/AccessEventCard';
import { GateHistoryPanel } from '../history/_components/GateHistoryPanel';
import { PageHeader } from '@/components/layout/PageHeader';

const LIVE_MAX = 50;

// ─── Live Mode ───────────────────────────────────────────────────────────────

function LiveMode() {
  const [events, setEvents] = useState<AccessEventCardEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  const fetchLive = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch(apiPath('/api/admin/access-events'));
      if (!res.ok) throw new Error('Failed to fetch access events');
      const json = await res.json();
      const data = unwrapApiData<AccessEventCardEvent[]>(json);
      setEvents((data ?? []).slice(0, LIVE_MAX));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let firstConnect = true;
    void fetchLive();

    const eventSource = new EventSource(apiPath('/api/admin/access-events/stream'));

    eventSource.onopen = () => {
      setIsLiveConnected(true);
      if (!firstConnect) {
        void fetchLive(true);
      }
      firstConnect = false;
    };

    eventSource.onmessage = (event) => {
      try {
        const newEvent = JSON.parse(event.data) as AccessEventCardEvent;
        setEvents((prev) => {
          if (prev.some((e) => e.id === newEvent.id)) return prev;
          return [newEvent, ...prev].slice(0, LIVE_MAX);
        });
      } catch (err) {
        console.error('Error parsing SSE event data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
      setIsLiveConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, [fetchLive]);

  const inCount = events.filter((e) => e.direction === 'IN').length;
  const outCount = events.filter((e) => e.direction === 'OUT').length;
  const expiredCount = events.filter(
    (e) =>
      e.decision === 'DENIED' &&
      ['MEMBER_EXPIRED', 'QR_EXPIRED', 'MEMBER_INACTIVE'].includes(e.reasonCode ?? ''),
  ).length;

  return (
    <Stack gap="md">
      {/* Summary strip — uses shared summary-card CSS classes */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
        <Card withBorder radius="md" p="md" className="summary-card summary-card--blue">
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">ทั้งหมด</Text>
              <Text size="xl" fw={800}>{events.length}</Text>
            </Stack>
            <ThemeIcon color="blue" variant="light" size="lg" radius="md">
              <IconListCheck size={18} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md" className="summary-card summary-card--green">
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">เข้า</Text>
              <Text size="xl" fw={800} c="green.6">{inCount}</Text>
            </Stack>
            <ThemeIcon color="green" variant="light" size="lg" radius="md">
              <IconDoorEnter size={18} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md" className="summary-card summary-card--orange">
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">ออก</Text>
              <Text size="xl" fw={800} c="orange.6">{outCount}</Text>
            </Stack>
            <ThemeIcon color="orange" variant="light" size="lg" radius="md">
              <IconDoorExit size={18} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md" className="summary-card summary-card--red">
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">บัตรหมดอายุ</Text>
              <Text size="xl" fw={800} c="red.6">{expiredCount}</Text>
            </Stack>
            <ThemeIcon color="red" variant="light" size="lg" radius="md">
              <IconAlertTriangle size={18} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Toolbar */}
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <Badge 
            color={isLiveConnected ? 'red' : 'gray'} 
            variant="filled" 
            size="sm"
            style={{ transition: 'background-color 0.3s ease' }}
          >
            ● {isLiveConnected ? 'LIVE' : 'OFFLINE'}
          </Badge>
          <Text size="xs" c="dimmed">
            {isLiveConnected 
              ? `อัปเดตแบบเรียลไทม์ · แสดงสูงสุด ${LIVE_MAX} รายการ`
              : 'ขาดการเชื่อมต่อเรียลไทม์ (กำลังเชื่อมต่อใหม่...) · รีเฟรชเพื่อดึงข้อมูลล่าสุด'}
          </Text>
        </Group>
        <Tooltip label="รีเฟรชข้อมูล">
          <ActionIcon variant="light" color="navy" size="lg" onClick={() => void fetchLive()} loading={refreshing}>
            <IconRefresh size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {/* Content */}
      {loading ? (
        <Group justify="center" py="xl">
          <Loader size="md" />
          <Text c="dimmed">กำลังโหลดข้อมูลรายการเข้า-ออก...</Text>
        </Group>
      ) : error ? (
        <Alert color="red">{error}</Alert>
      ) : events.length === 0 ? (
        <Card withBorder p="xl" radius="md">
          <Text ta="center" c="dimmed">ไม่พบรายการสแกนผ่านประตูทางเข้า-ออก</Text>
        </Card>
      ) : (
        <Stack gap="sm">
          {events.map((event, index) => (
            <AccessEventCard key={event.id} event={event} isLatest={index === 0} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

// ─── History Mode ─────────────────────────────────────────────────────────────

function HistoryMode() {
  return <GateHistoryPanel />;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [mode, setMode] = useState<'live' | 'history'>('live');

  return (
    <Stack gap="xl">
      {/* Page header — uses shared PageHeader for consistent styling */}
      <PageHeader
        icon={mode === 'live' ? IconActivity : IconHistory}
        title={mode === 'live' ? 'Access Log (รายการเข้า-ออก)' : 'ประวัติการเข้าใช้งาน'}
        subtitle={
          mode === 'live'
            ? 'แสดงข้อมูลการสแกนผ่านประตูแบบเรียลไทม์'
            : 'ค้นหาและกรองประวัติการเข้าใช้งานจากฐานข้อมูล SQL Server'
        }
        actions={
          <SegmentedControl
            value={mode}
            onChange={(v) => setMode(v as 'live' | 'history')}
            data={[
              { label: 'Live', value: 'live' },
              { label: 'ประวัติ', value: 'history' },
            ]}
            radius="md"
          />
        }
      />

      {/* Mode content */}
      {mode === 'live' ? <LiveMode /> : <HistoryMode />}
    </Stack>
  );
}
