'use client';

import { useState, useTransition } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
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
  IconUserShield,
} from '@tabler/icons-react';
import { signOut } from 'next-auth/react';

const NAV_ITEMS = [
  { labelKey: 'Common.dashboard', icon: IconLayoutDashboard, href: '/admin' },
  { labelKey: 'Common.admins', icon: IconUserShield, href: '/admin/users' },
  { labelKey: 'Common.qr', icon: IconQrcode, href: '/admin/qr' },
  { labelKey: 'Common.gates', icon: IconDoor, href: '/admin/gates' },
  { labelKey: 'Common.members', icon: IconUsers, href: '/admin/members' },
  { labelKey: 'Common.reports', icon: IconChartBar, href: '/admin/reports/members' },
  { labelKey: 'Common.security', icon: IconShield, href: '/admin/security' },
  { labelKey: 'Common.settings', icon: IconSettings, href: '/admin/settings' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(true);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (value: string | null) => {
    if (!value) return;
    startTransition(() => {
      router.replace(pathname, { locale: value });
    });
  };

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
                {t('Common.title')}
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
            value={locale}
            onChange={handleLocaleChange}
            disabled={isPending}
            size="xs"
            w={100}
            variant="filled"
          />

          <Tooltip label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}>
            <ActionIcon variant="subtle" onClick={toggleColorScheme}>
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Notifications">
            <ActionIcon variant="subtle" pos="relative">
              <IconBell size={18} />
              <Badge
                size="xs"
                circle
                color="red"
                style={{ position: 'absolute', top: -2, right: -2 }}
              >
                3
              </Badge>
            </ActionIcon>
          </Tooltip>

          <Tooltip label={t('Common.logout')}>
            <ActionIcon variant="subtle" color="red" onClick={() => signOut()}>
              <IconLogout size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </AppShell.Header>

      {/* ─── Sidebar ─── */}
      <AppShell.Navbar
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--border-color)',
          padding: '12px 8px',
        }}
      >
        <Stack gap={4}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href as any}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} stroke={1.5} />
                {opened && <span>{t(item.labelKey)}</span>}
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
