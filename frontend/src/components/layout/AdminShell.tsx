'use client';

import { useState, useTransition, useEffect, useSyncExternalStore } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import {
  AppShell,
  Group,
  Text,
  ActionIcon,
  Tooltip,
  useMantineColorScheme,
  Box,
  Divider,
  Select,
  Stack,
} from '@mantine/core';
import {
  IconSun,
  IconMoon,
  IconMenu2,
  IconLogout,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { signOut } from 'next-auth/react';
import NotificationBell from '../notifications/NotificationBell';
import { APP_VERSION_LABEL, appCopyright } from '@/lib/app-meta';
import { SidebarNav } from './SidebarNav';

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(true);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const mounted = useIsClient();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenHeader, setShowFullscreenHeader] = useState(false);
  const [showFullscreenSidebar, setShowFullscreenSidebar] = useState(false);

  useEffect(() => {
    const checkIsFullscreen = () => {
      if (typeof window === 'undefined') return false;
      // 1. Standard HTML Fullscreen API check
      if (document.fullscreenElement) return true;
      // 2. Native F11 Fullscreen detection: innerHeight is equal/close to screen height
      return window.innerHeight >= window.screen.height - 15;
    };

    const updateFullscreenState = () => {
      const active = checkIsFullscreen();
      setIsFullscreen(active);
      if (active) {
        document.documentElement.classList.add('fullscreen-mode');
      } else {
        document.documentElement.classList.remove('fullscreen-mode');
      }
    };

    // Detect immediately on mount (handles F11 toggled on previous pages)
    updateFullscreenState();

    window.addEventListener('resize', updateFullscreenState);
    document.addEventListener('fullscreenchange', updateFullscreenState);

    return () => {
      window.removeEventListener('resize', updateFullscreenState);
      document.removeEventListener('fullscreenchange', updateFullscreenState);
      document.documentElement.classList.remove('fullscreen-mode');
    };
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      setShowFullscreenHeader(false);
      setShowFullscreenSidebar(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Reveal header if mouse is at the top edge (<= 15px) or keep it open if inside header area
      if (e.clientY <= 15) {
        setShowFullscreenHeader(true);
      } else if (e.clientY > 60) {
        setShowFullscreenHeader(false);
      }

      // Reveal sidebar if mouse is at the left edge (<= 15px) or keep it open if inside sidebar area
      if (e.clientX <= 15) {
        setShowFullscreenSidebar(true);
      } else if (e.clientX > (opened ? 252 : 68)) {
        setShowFullscreenSidebar(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isFullscreen, opened]);

  const handleLocaleChange = (value: string | null) => {
    if (!value) return;
    startTransition(() => {
      router.replace(pathname, { locale: value });
    });
  };

  useEffect(() => {
    if (!opened) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const el = e.target;
      if (!(el instanceof Element)) return;
      if (el.closest('.admin-sidebar-glass')) return;
      setOpened(false);
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [opened]);

  const handleLogoutClick = () => {
    modals.openConfirmModal({
      title: t('Common.logoutConfirmTitle'),
      children: <Text size="sm">{t('Common.logoutConfirmMessage')}</Text>,
      labels: { confirm: t('Common.logout'), cancel: t('Common.cancel') },
      confirmProps: { color: 'red' },
      centered: true,
      onConfirm: () => {
        void signOut();
      },
    });
  };

  return (
    <AppShell
      header={{
        height: 60,
        collapsed: isFullscreen && !showFullscreenHeader,
      }}
      navbar={{
        width: opened ? 252 : 68,
        breakpoint: 'sm',
        collapsed: {
          mobile: !opened,
          desktop: isFullscreen && !showFullscreenSidebar,
        },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
            <ActionIcon variant="subtle" onClick={() => setOpened((o) => !o)} aria-label="Toggle navigation">
              <IconMenu2 size={20} />
            </ActionIcon>
            <Group gap={10} wrap="nowrap" style={{ minWidth: 0 }}>
              <Box
                component="svg"
                viewBox="0 0 32 32"
                style={{ width: 32, height: 32, flexShrink: 0 }}
                aria-hidden
              >
                <rect width="32" height="32" rx="8" fill="#1E3A5F" />
                <path d="M8 8h6v6H8zM18 8h6v6h-6zM8 18h6v6H8z" fill="#38BDF8" />
                <circle cx="21" cy="21" r="3" fill="#10B981" />
              </Box>
              <Box style={{ minWidth: 0 }}>
                <Text fw={800} size="md" lh={1.25} truncate>
                  {t('Common.brandName')}
                </Text>
                <Text size="xs" c="dimmed" lh={1.3} truncate>
                  {t('Common.brandSubtitle')}
                </Text>
              </Box>
            </Group>
          </Group>

          <Group gap="sm" wrap="nowrap">
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
              variant="default"
            />

            <Tooltip label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}>
              <ActionIcon variant="subtle" onClick={toggleColorScheme}>
                {!mounted ? (
                  <Box w={18} h={18} />
                ) : colorScheme === 'dark' ? (
                  <IconSun size={18} />
                ) : (
                  <IconMoon size={18} />
                )}
              </ActionIcon>
            </Tooltip>

            <NotificationBell />

            <Tooltip label={t('Common.logout')}>
              <ActionIcon variant="subtle" color="red" onClick={handleLogoutClick}>
                <IconLogout size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        p="xs"
        className="admin-sidebar-glass"
        onMouseEnter={() => {
          if (!opened) setOpened(true);
        }}
      >
        <AppShell.Section grow component="nav" aria-label="Admin navigation">
          <SidebarNav expanded={opened} onRequestExpand={() => setOpened(true)} />
        </AppShell.Section>

        <AppShell.Section>
          <Divider color="rgba(148, 163, 184, 0.2)" my="sm" />
          {opened ? (
            <Stack gap={2} align="center" px={4}>
              <Text
                component={Link}
                href="/admin/changelog"
                prefetch={false}
                size="xs"
                c="skyBlue.3"
                ta="center"
                fw={600}
                style={{ textDecoration: 'none' }}
              >
                {APP_VERSION_LABEL}
              </Text>
              <Text size="10px" c="gray.5" ta="center" lh={1.25}>
                {appCopyright()}
              </Text>
            </Stack>
          ) : (
            <Tooltip label={APP_VERSION_LABEL} position="right" withArrow>
              <Text
                component={Link}
                href="/admin/changelog"
                prefetch={false}
                size="10px"
                c="skyBlue.3"
                ta="center"
                fw={700}
                display="block"
                style={{ textDecoration: 'none' }}
                onClick={() => setOpened(true)}
              >
                v1
              </Text>
            </Tooltip>
          )}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main bg="var(--bg-secondary)" style={{ minHeight: '100%' }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
