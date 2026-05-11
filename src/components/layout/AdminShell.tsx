'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppShell,
  Group,
  Text,
  ActionIcon,
  Tooltip,
  Stack,
  Badge,
  useMantineColorScheme,
  Box,
  Divider,
  Select,
} from '@mantine/core';
import {
  IconLayoutDashboard,
  IconQrcode,
  IconDoor,
  IconUsers,
  IconId,
  IconChartBar,
  IconShield,
  IconSettings,
  IconSun,
  IconMoon,
  IconMenu2,
  IconBell,
  IconLogout,
  IconHistory,
} from '@tabler/icons-react';
import NotificationBell from '../notifications/NotificationBell';

const NAV_ITEMS = [
  { label: 'แดชบอร์ด', labelEn: 'Dashboard', icon: IconLayoutDashboard, href: '/admin' },
  { label: 'QR Code', labelEn: 'QR Code', icon: IconQrcode, href: '/admin/qr' },
  { label: 'ประตู', labelEn: 'Gates', icon: IconDoor, href: '/admin/gates' },
  { label: 'สมาชิก', labelEn: 'Members', icon: IconUsers, href: '/admin/members' },
  { label: 'บัตรประชาชน', labelEn: 'ID Card', icon: IconId, href: '/admin/idcard' },
  { label: 'รายงาน', labelEn: 'Reports', icon: IconChartBar, href: '/admin/reports' },
  { label: 'ความปลอดภัย', labelEn: 'Security', icon: IconShield, href: '/admin/security' },
  { label: 'ประวัติเข้า-ออก', labelEn: 'Access History', icon: IconHistory, href: '/admin/history' },
  { label: 'ตั้งค่า', labelEn: 'Settings', icon: IconSettings, href: '/admin/settings' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(true);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const pathname = usePathname();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: opened ? 260 : 72, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      {/* ─── Header ─── */}
      <AppShell.Header
        style={{
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        <Group>
          <ActionIcon variant="subtle" onClick={() => setOpened((o) => !o)}>
            <IconMenu2 size={20} />
          </ActionIcon>
          <Group gap={8}>
            {/* Logo SVG inline */}
            <Box
              component="svg"
              viewBox="0 0 32 32"
              style={{ width: 32, height: 32 }}
            >
              <rect width="32" height="32" rx="8" fill="#1E3A5F" />
              <path d="M8 8h6v6H8zM18 8h6v6h-6zM8 18h6v6H8z" fill="#38BDF8" />
              <circle cx="21" cy="21" r="3" fill="#10B981" />
            </Box>
            {opened && (
              <Text fw={700} size="lg" c="var(--text-primary)">
                QR Gate Access
              </Text>
            )}
          </Group>
        </Group>

        <Group gap="sm">
          <Select
            data={[
              { value: 'th', label: '🇹🇭 ไทย' },
              { value: 'en', label: '🇺🇸 EN' },
              { value: 'zh', label: '🇨🇳 中文' },
            ]}
            defaultValue="th"
            size="xs"
            w={100}
            variant="filled"
          />

          <Tooltip label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}>
            <ActionIcon variant="subtle" onClick={toggleColorScheme}>
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
          </Tooltip>

          <NotificationBell />

          <Tooltip label="ออกจากระบบ">
            <ActionIcon variant="subtle" color="red">
              <IconLogout size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </AppShell.Header>

      {/* ─── Sidebar ─── */}
      <AppShell.Navbar
        style={{
          background: 'var(--sidebar-bg)',
          border: 'none',
          padding: '12px 8px',
        }}
      >
        <Stack gap={4}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} stroke={1.5} />
                {opened && <span>{item.label}</span>}
              </Link>
            );
          })}
        </Stack>

        <Box style={{ flex: 1 }} />

        <Divider color="rgba(255,255,255,0.1)" my="sm" />
        <Box px="xs" pb="xs">
          {opened && (
            <Text size="xs" c="rgba(255,255,255,0.4)" ta="center">
              v1.0.0 · Next.js 16 · Prisma 7
            </Text>
          )}
        </Box>
      </AppShell.Navbar>

      {/* ─── Main Content ─── */}
      <AppShell.Main style={{ background: 'var(--bg-secondary)' }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
