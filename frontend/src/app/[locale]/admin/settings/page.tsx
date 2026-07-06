'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import {
  Title,
  Text,
  Stack,
  Card,
  Group,
  Tabs,
  TextInput,
  Button,
  Switch,
  Select,
  Avatar,
  Divider,
  Alert,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconSettings,
  IconUserCircle,
  IconBell,
  IconDeviceFloppy,
  IconLock,
  IconWorld,
  IconBrandLine,
  IconMail,
} from '@tabler/icons-react';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const tc = useTranslations('Common');
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('profile');

  const profileForm = useForm({
    initialValues: {
      fullName: '',
      email: '',
    },
  });

  const systemForm = useForm({
    initialValues: {
      systemName: 'QR Gate Access',
      maintenanceMode: false,
      timezone: 'Asia/Bangkok',
      lineNotifyToken: '',
      emailNotifications: true,
    },
  });

  useEffect(() => {
    if (session?.user) {
      profileForm.setValues({
        fullName: session.user.name || '',
        email: session.user.email || '',
      });
    }
  }, [session]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          systemForm.setValues({
            systemName: data.systemName || 'QR Gate Access',
            maintenanceMode: data.maintenanceMode === 'true',
            timezone: data.timezone || 'Asia/Bangkok',
            lineNotifyToken: data.lineNotifyToken || '',
            emailNotifications: data.emailNotifications !== 'false',
          });
        }
      } catch (err) {
        console.error('Failed to fetch settings');
      }
    };
    fetchSettings();
  }, []);

  const handleUpdateSystem = async (values: typeof systemForm.values) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (res.ok) {
        notifications.show({
          title: tc('success'),
          message: tc('success'),
          color: 'green',
        });
      }
    } catch (err) {
      notifications.show({
        title: tc('error'),
        message: tc('error'),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2} c="var(--text-primary)">{t('title')}</Title>
          <Text size="sm" c="var(--text-secondary)">{t('subtitle')}</Text>
        </div>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
        <Tabs.List mb="lg">
          <Tabs.Tab value="profile" leftSection={<IconUserCircle size={18} />}>{t('profile')}</Tabs.Tab>
          <Tabs.Tab value="system" leftSection={<IconSettings size={18} />}>{t('system')}</Tabs.Tab>
          <Tabs.Tab value="notifications" leftSection={<IconBell size={18} />}>{t('notifications')}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile">
          <Card withBorder radius="md" p="xl">
            <Stack gap="xl">
              <Group>
                <Avatar size={80} radius={80} color="navy">
                  {session?.user?.name?.charAt(0) || 'A'}
                </Avatar>
                <div>
                  <Text size="xl" fw={700}>{session?.user?.name}</Text>
                  <Text size="sm" c="dimmed">{(session?.user as any)?.role}</Text>
                </div>
              </Group>

              <Divider />

              <Stack gap="md" style={{ maxWidth: 500 }}>
                <TextInput
                  label={t('fullName')}
                  {...profileForm.getInputProps('fullName')}
                />
                <TextInput
                  label={t('email')}
                  disabled
                  {...profileForm.getInputProps('email')}
                />
                <Button 
                  leftSection={<IconDeviceFloppy size={18} />} 
                  color="navy"
                  loading={loading}
                >
                  {t('saveProfile')}
                </Button>
              </Stack>

              <Divider />

              <Box>
                <Text fw={600} mb="sm">{t('security')}</Text>
                <Button variant="outline" color="red" leftSection={<IconLock size={18} />}>
                  {t('changePassword')}
                </Button>
              </Box>
            </Stack>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="system">
          <Card withBorder radius="md" p="xl">
            <form onSubmit={systemForm.onSubmit(handleUpdateSystem)}>
              <Stack gap="xl">
                <Box>
                  <Text fw={600} mb="xs">{t('generalInfo')}</Text>
                  <Stack gap="md" style={{ maxWidth: 500 }}>
                    <TextInput
                      label={t('appName')}
                      {...systemForm.getInputProps('systemName')}
                    />
                    <Select
                      label={t('timezone')}
                      data={['Asia/Bangkok', 'UTC', 'Asia/Singapore']}
                      leftSection={<IconWorld size={16} />}
                      {...systemForm.getInputProps('timezone')}
                    />
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Text fw={600} mb="sm">{t('maintenance')}</Text>
                  <Alert color="orange" title={t('maintenanceMode')} icon={<IconSettings size={18} />}>
                    <Group justify="space-between">
                      <Text size="sm">{t('maintenanceDesc')}</Text>
                      <Switch 
                        color="orange"
                        {...systemForm.getInputProps('maintenanceMode', { type: 'checkbox' })}
                      />
                    </Group>
                  </Alert>
                </Box>

                <Group justify="flex-end">
                  <Button 
                    type="submit" 
                    loading={loading}
                    color="navy"
                    leftSection={<IconDeviceFloppy size={18} />}
                  >
                    {t('saveSystem')}
                  </Button>
                </Group>
              </Stack>
            </form>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="notifications">
          <Card withBorder radius="md" p="xl">
            <Stack gap="xl">
              <Box>
                <Group mb="xs">
                  <IconBrandLine color="#06C755" />
                  <Text fw={600}>{t('lineNotify')}</Text>
                </Group>
                <Stack gap="md" style={{ maxWidth: 500 }}>
                  <TextInput
                    label={t('lineToken')}
                    {...systemForm.getInputProps('lineNotifyToken')}
                  />
                  <Text size="xs" c="dimmed">{t('lineDesc')}</Text>
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Group mb="xs">
                  <IconMail color="var(--color-sky)" />
                  <Text fw={600}>{t('emailNotify')}</Text>
                </Group>
                <Group justify="space-between" style={{ maxWidth: 500 }}>
                  <Text size="sm">{t('emailDesc')}</Text>
                  <Switch 
                    {...systemForm.getInputProps('emailNotifications', { type: 'checkbox' })}
                  />
                </Group>
              </Box>

              <Group justify="flex-end">
                <Button 
                  onClick={() => handleUpdateSystem(systemForm.values)}
                  loading={loading}
                  color="navy"
                  leftSection={<IconDeviceFloppy size={18} />}
                >
                  {t('saveNotify')}
                </Button>
              </Group>
            </Stack>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
