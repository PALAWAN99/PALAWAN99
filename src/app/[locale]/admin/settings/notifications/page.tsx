'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  TextInput,
  Button,
  Group,
  Switch,
  Divider,
  Alert,
  LoadingOverlay,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBrandLine, IconMail, IconCheck, IconAlertCircle, IconBell } from '@tabler/icons-react';

export default function NotificationSettings() {
  const t = useTranslations();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    line_notify_token: '',
    enable_email: false,
    enable_line: true,
    notify_on_offline: true,
    notify_on_security: true,
  });

  useEffect(() => {
    // โหลดการตั้งค่าจาก API (ถ้ามี)
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        // แปลง array settings เป็น object
        const settingsMap: Record<string, string> = {};
        if (Array.isArray(data)) {
          data.forEach((s: { key: string; value: string }) => {
            settingsMap[s.key] = s.value;
          });
        }
        
        setSettings(prev => ({
          ...prev,
          line_notify_token: settingsMap.line_notify_token || '',
          enable_line: settingsMap.enable_line === 'true',
          enable_email: settingsMap.enable_email === 'true',
        }));
      } catch (err) {
        console.error('Load settings failed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.entries(settings).map(([key, value]) => ({
          key,
          value: String(value),
          group: 'notifications'
        }))),
      });

      if (res.ok) {
        notifications.show({
          title: t('Common.success'),
          message: t('Settings.notificationsSaved'),
          color: 'green',
          icon: <IconCheck size={18} />,
        });
      }
    } catch (_) {
      notifications.show({
        title: t('Common.error'),
        message: t('Common.errorDesc'),
        color: 'red',
        icon: <IconAlertCircle size={18} />,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <LoadingOverlay visible={loading} />
      <Stack gap="lg">
        <Stack gap={0}>
          <Title order={2} style={{ color: '#F8FAFC' }}>
            <Group gap="xs"><IconBell size={28} />{t('Settings.notifications')}</Group>
          </Title>
          <Text size="sm" c="dimmed">{t('Settings.notificationsDesc')}</Text>
        </Stack>

        <Card withBorder radius="lg" p="xl" style={{ background: 'rgba(30, 41, 59, 0.5)', borderColor: '#334155' }}>
          <Stack gap="xl">
            {/* LINE Notify */}
            <section>
              <Group mb="md">
                <IconBrandLine size={24} color="#06C755" />
                <Text fw={700} size="lg">LINE Notify</Text>
              </Group>
              <Stack gap="sm">
                <TextInput
                  label={t('Settings.lineToken')}
                  placeholder={t('Settings.lineTokenPlaceholder')}
                  description={t('Settings.lineTokenDesc')}
                  value={settings.line_notify_token}
                  onChange={(e) => setSettings({ ...settings, line_notify_token: e.currentTarget.value })}
                />
                <Switch 
                  label={t('Settings.enableLine')} 
                  checked={settings.enable_line}
                  onChange={(e) => setSettings({ ...settings, enable_line: e.currentTarget.checked })}
                />
              </Stack>
            </section>

            <Divider />

            {/* Email Notification */}
            <section>
              <Group mb="md">
                <IconMail size={24} color="#38BDF8" />
                <Text fw={700} size="lg">Email Notifications</Text>
              </Group>
              <Switch 
                label={t('Settings.enableEmail')} 
                checked={settings.enable_email}
                onChange={(e) => setSettings({ ...settings, enable_email: e.currentTarget.checked })}
              />
            </section>

            <Divider />

            {/* Triggers */}
            <section>
              <Text fw={700} size="lg" mb="md">{t('Settings.triggers')}</Text>
              <Stack gap="md">
                <Switch 
                  label={t('Settings.notifyOffline')} 
                  checked={settings.notify_on_offline}
                  onChange={(e) => setSettings({ ...settings, notify_on_offline: e.currentTarget.checked })}
                />
                <Switch 
                  label={t('Settings.notifySecurity')} 
                  checked={settings.notify_on_security}
                  onChange={(e) => setSettings({ ...settings, notify_on_security: e.currentTarget.checked })}
                />
              </Stack>
            </section>

            <Group justify="flex-end" mt="xl">
              <Button size="md" color="skyBlue" loading={saving} onClick={handleSave}>
                {t('Common.saveSettings')}
              </Button>
            </Group>
          </Stack>
        </Card>

        <Alert color="blue" icon={<IconAlertCircle size={16} />}>
          {t('Settings.criticalAlertDesc')}
        </Alert>
      </Stack>
    </Container>
  );
}
