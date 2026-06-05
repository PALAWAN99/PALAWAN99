'use client';

import { Badge, Group, Paper, Stack, Text } from '@mantine/core';
import { IconDoorEnter, IconDoorExit, IconBuildingBank } from '@tabler/icons-react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface AccessEventCardEvent {
  id: string;
  scannedAt: string | Date;
  direction: 'IN' | 'OUT';
  decision: 'ALLOWED' | 'DENIED';
  reasonCode?: string | null;
  member: {
    firstNameTh: string;
    lastNameTh: string;
    memberType: string;
    department?: string | null;
  } | null;
  gate: {
    gateCode: string;
  };
}

interface AccessEventCardProps {
  event: AccessEventCardEvent;
  isLatest?: boolean;
}

// ─────────────────────────────────────────────
// Lookup tables
// ─────────────────────────────────────────────

const MEMBER_TYPE_LABELS: Record<string, string> = {
  STUDENT: 'นักศึกษา',
  STAFF: 'บุคลากร',
  FACULTY: 'อาจารย์',
  EXTERNAL: 'บุคคลภายนอก',
  GUEST: 'แขก',
};

const MEMBER_TYPE_COLORS: Record<string, string> = {
  STUDENT: 'blue',
  STAFF: 'teal',
  FACULTY: 'violet',
  EXTERNAL: 'orange',
  GUEST: 'gray',
};

/** แปล reasonCode → label ภาษาไทย */
function getDecisionBadge(
  decision: 'ALLOWED' | 'DENIED',
  reasonCode?: string | null,
): { label: string; color: string } {
  if (decision === 'ALLOWED') {
    return { label: '✓ ผ่าน', color: 'green' };
  }
  switch (reasonCode) {
    case 'MEMBER_EXPIRED':
    case 'QR_EXPIRED':
    case 'MEMBER_INACTIVE':
      return { label: '⚠ บัตรหมดอายุ', color: 'orange' };
    case 'INVALID_SIGNATURE':
      return { label: '✗ QR ปลอม', color: 'red' };
    case 'ALREADY_USED':
      return { label: '✗ ใช้แล้ว', color: 'red' };
    default:
      return { label: '✗ ปฏิเสธ', color: 'red' };
  }
}

/** border-left: ฟ้า=ล่าสุด, เขียว=เข้า, ส้ม=ออก */
function getBorderColor(direction: 'IN' | 'OUT', isLatest: boolean): string {
  if (isLatest) return 'var(--mantine-color-blue-5)';
  return direction === 'IN'
    ? 'var(--mantine-color-green-6)'
    : 'var(--mantine-color-orange-5)';
}

/** แสดงเวลาในโซน Asia/Bangkok */
function formatBangkokTime(value: string | Date): { time: string; date: string } {
  const d = typeof value === 'string' ? new Date(value) : value;
  const opts: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Bangkok' };
  const time = d.toLocaleTimeString('th-TH', { ...opts, hour: '2-digit', minute: '2-digit' });
  const date = d.toLocaleDateString('th-TH', {
    ...opts,
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  });
  return { time, date };
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function AccessEventCard({ event, isLatest = false }: AccessEventCardProps) {
  const { time, date } = formatBangkokTime(event.scannedAt);
  const decisionBadge = getDecisionBadge(event.decision, event.reasonCode);
  const borderColor = getBorderColor(event.direction, isLatest);
  const isIn = event.direction === 'IN';

  const memberTypeLabel =
    MEMBER_TYPE_LABELS[event.member?.memberType ?? ''] ?? event.member?.memberType ?? '—';
  const memberTypeColor = MEMBER_TYPE_COLORS[event.member?.memberType ?? ''] ?? 'gray';
  const fullName = event.member
    ? `${event.member.firstNameTh} ${event.member.lastNameTh}`.trim()
    : 'ไม่ทราบชื่อ';

  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      style={{
        borderLeft: `4px solid ${borderColor}`,
        transition: 'box-shadow 0.15s ease',
      }}
    >
      <Group justify="space-between" wrap="nowrap" align="flex-start" gap="sm">
        {/* ───── Left: member info ───── */}
        <Stack gap={6} style={{ minWidth: 0, flex: 1 }}>
          {/* ชื่อ + badge ล่าสุด */}
          <Group gap={8} wrap="nowrap" align="center">
            <Text fw={700} size="sm" lineClamp={1} style={{ minWidth: 0 }}>
              {fullName}
            </Text>
            {isLatest && (
              <Badge size="xs" color="blue" variant="filled" style={{ flexShrink: 0 }}>
                ล่าสุด
              </Badge>
            )}
          </Group>

          {/* badges แถวล่าง */}
          <Group gap={6} wrap="wrap">
            {/* ประเภทสมาชิก */}
            <Badge size="xs" variant="light" color={memberTypeColor}>
              {memberTypeLabel}
            </Badge>

            {/* คณะ / department */}
            {event.member?.department ? (
              <Badge
                size="xs"
                variant="outline"
                color="gray"
                leftSection={<IconBuildingBank size={10} />}
              >
                {event.member.department}
              </Badge>
            ) : null}

            {/* gate code */}
            <Badge size="xs" variant="light" color="indigo" ff="monospace">
              {event.gate.gateCode}
            </Badge>
          </Group>
        </Stack>

        {/* ───── Right: direction + decision + time ───── */}
        <Stack gap={6} align="flex-end" style={{ flexShrink: 0 }}>
          {/* direction badge */}
          <Badge
            size="sm"
            variant="filled"
            color={isIn ? 'green' : 'orange'}
            leftSection={
              isIn ? <IconDoorEnter size={13} /> : <IconDoorExit size={13} />
            }
          >
            {isIn ? 'เข้า' : 'ออก'}
          </Badge>

          {/* decision badge */}
          <Badge size="sm" variant="light" color={decisionBadge.color}>
            {decisionBadge.label}
          </Badge>

          {/* เวลา */}
          <Stack gap={0} align="flex-end">
            <Text size="xs" fw={600} c="dimmed">
              {time}
            </Text>
            <Text size="xs" c="dimmed" style={{ opacity: 0.7 }}>
              {date}
            </Text>
          </Stack>
        </Stack>
      </Group>
    </Paper>
  );
}
