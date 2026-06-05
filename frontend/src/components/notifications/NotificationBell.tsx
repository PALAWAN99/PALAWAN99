'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ActionIcon,
  Indicator,
  Popover,
  Text,
  Stack,
  ScrollArea,
  Box,
  Divider,
  Group,
  Loader,
  Center,
  Switch,
} from '@mantine/core';
import { IconBell, IconAlertCircle, IconCheck, IconInfoCircle, IconVolume, IconVolume3 } from '@tabler/icons-react';
import { unwrapApiList } from '@/lib/parse-api-response';

interface Notification {
  id: string;
  title: string;
  message: string;
  level: string;
  createdAt: Date;
  readAt: Date | null;
}

export default function NotificationBell() {
  const [opened, setOpened] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [enableSound, setEnableSound] = useState(true);

  const fetchNotifications = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch('/api/notifications', { signal });
      if (!res.ok) return;
      const payload = await res.json();
      setNotifications(unwrapApiList<Notification>(payload));
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Failed to fetch notifications:', error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    
    fetchNotifications(controller.signal);
    const interval = setInterval(() => fetchNotifications(controller.signal), 30000);
    
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.readAt).length;

  const displayedNotifs = notifications
    .filter(n => showUnreadOnly ? !n.readAt : true);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        body: JSON.stringify({ action: 'MARK_READ', id }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date() } : n));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        body: JSON.stringify({ action: 'MARK_ALL_READ' }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date() })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (level: string) => {
    switch (level) {
      case 'critical': return <IconAlertCircle size={16} color="red" />;
      case 'warning': return <IconAlertCircle size={16} color="orange" />;
      case 'info': return <IconInfoCircle size={16} color="blue" />;
      default: return <IconCheck size={16} color="green" />;
    }
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' ' + 
           d.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' });
  };

  return (
    <Popover 
      width={320} 
      position="bottom-end" 
      withArrow 
      shadow="md" 
      opened={opened} 
      onClose={() => setOpened(false)}
    >
      <Popover.Target>
        <Indicator label={unreadCount} size={16} disabled={unreadCount === 0} offset={2} color="red">
          <ActionIcon 
            variant="subtle" 
            color="gray" 
            size="lg" 
            onClick={() => setOpened((o) => !o)}
          >
            <IconBell size={22} stroke={1.5} />
          </ActionIcon>
        </Indicator>
      </Popover.Target>

      <Popover.Dropdown p={0}>
        <Box p="xs">
          <Group justify="space-between" mb="xs">
            <Text fw={700} size="sm">การแจ้งเตือน</Text>
            <Group gap="xs">
              <ActionIcon variant="subtle" size="sm" onClick={() => setEnableSound(!enableSound)} title="เปิด/ปิด เสียงเตือน">
                {enableSound ? <IconVolume size={16} /> : <IconVolume3 size={16} />}
              </ActionIcon>
              <Text 
                size="xs" 
                c="blue" 
                style={{ cursor: 'pointer' }}
                onClick={handleMarkAllAsRead}
              >
                อ่านทั้งหมด
              </Text>
            </Group>
          </Group>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">เฉพาะยังไม่อ่าน</Text>
            <Switch size="xs" checked={showUnreadOnly} onChange={(event) => setShowUnreadOnly(event.currentTarget.checked)} />
          </Group>
        </Box>
        <Divider />
        <ScrollArea h={300}>
          {loading && notifications.length === 0 ? (
            <Center p="xl"><Loader size="sm" /></Center>
          ) : notifications.length === 0 ? (
            <Center p="xl"><Text size="xs" c="dimmed">ไม่มีการแจ้งเตือน</Text></Center>
          ) : (
            <Stack gap={0}>
              {displayedNotifs.map((notif) => (
                <Box 
                  key={notif.id} 
                  p="xs" 
                  onClick={() => !notif.readAt && handleMarkAsRead(notif.id)}
                  style={{ 
                    backgroundColor: notif.readAt ? 'transparent' : 'rgba(56, 189, 248, 0.05)',
                    borderBottom: '1px solid var(--mantine-color-default-border)',
                    cursor: 'pointer'
                  }}
                >
                  <Group align="flex-start" wrap="nowrap" gap="sm">
                    <Box mt={4}>{getIcon(notif.level)}</Box>
                    <Stack gap={2} style={{ flex: 1 }}>
                      <Text size="sm" fw={notif.readAt ? 500 : 700} lineClamp={1}>{notif.title}</Text>
                      <Text size="xs" c="dimmed" lineClamp={2}>{notif.message}</Text>
                      <Text size="xs" c="dimmed" mt={2}>{formatTime(notif.createdAt)}</Text>
                    </Stack>
                  </Group>
                </Box>
              ))}
            </Stack>
          )}
        </ScrollArea>
        <Divider />
        <Box p="xs" ta="center">
          <Text size="xs" c="blue" fw={500} style={{ cursor: 'pointer' }}>ดูทั้งหมด</Text>
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
}
