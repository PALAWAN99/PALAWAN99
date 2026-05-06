'use client';

import { useState, useEffect } from 'react';
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
} from '@mantine/core';
import { IconBell, IconAlertCircle, IconCheck, IconInfoCircle } from '@tabler/icons-react';
import { getNotifications, markAsRead, markAllAsRead } from '@/lib/notifications/actions';

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

  // ในระบบจริงจะใช้ ID จาก Auth
  const MOCK_USER_ID = 'system-admin';

  const fetchNotifications = async () => {
    setLoading(true);
    const res = await getNotifications(MOCK_USER_ID);
    if (res.success && res.notifications) {
      setNotifications(res.notifications as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh ทุก 30 วินาที
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.readAt).length;

  const handleMarkAsRead = async (id: string) => {
    const res = await markAsRead(id);
    if (res.success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date() } : n));
    }
  };

  const handleMarkAllAsRead = async () => {
    const res = await markAllAsRead(MOCK_USER_ID);
    if (res.success) {
      setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date() })));
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
      onChange={setOpened}
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
          <Group justify="space-between">
            <Text fw={700} size="sm">การแจ้งเตือน</Text>
            <Text 
              size="xs" 
              c="blue" 
              style={{ cursor: 'pointer' }}
              onClick={handleMarkAllAsRead}
            >
              อ่านทั้งหมด
            </Text>
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
              {notifications.map((notif) => (
                <Box 
                  key={notif.id} 
                  p="xs" 
                  onClick={() => !notif.readAt && handleMarkAsRead(notif.id)}
                  style={{ 
                    backgroundColor: notif.readAt ? 'transparent' : 'rgba(56, 189, 248, 0.05)',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer'
                  }}
                >
                  <Group align="flex-start" wrap="nowrap" gap="sm">
                    <Box mt={4}>{getIcon(notif.level)}</Box>
                    <Stack gap={2}>
                      <Text size="sm" fw={notif.readAt ? 500 : 700}>{notif.title}</Text>
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
