'use client';

import { useState, useEffect } from 'react';
import {
  Title,
  Text,
  Stack,
  Card,
  TextInput,
  Switch,
  Group,
  Button,
  Divider,
  Grid,
  LoadingOverlay,
} from '@mantine/core';
import { IconSettings, IconBell, IconMail, IconBrandLine } from '@tabler/icons-react';
import { getSettings, saveSettings } from './actions';
import { notifications } from '@mantine/notifications';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<Record<string, string>>({
    library_name: 'สำนักหอสมุดกลาง',
    welcome_message: 'ยินดีต้อนรับสู่หอสมุด',
    line_notify_enabled: 'true',
    line_notify_token: '',
    email_enabled: 'false',
    email_recipient: '',
    notify_access_denied: 'true',
    notify_device_offline: 'true',
    notify_new_member: 'false',
  });

  useEffect(() => {
    const load = async () => {
      const res = await getSettings();
      if (res.success && res.config) {
        setConfig(prev => ({ ...prev, ...res.config }));
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await saveSettings(config);
    setSaving(false);
    if (res.success) {
      notifications.show({ title: 'บันทึกสำเร็จ', message: 'บันทึกการตั้งค่าระบบเรียบร้อยแล้ว', color: 'green' });
    } else {
      notifications.show({ title: 'ผิดพลาด', message: res.error, color: 'red' });
    }
  };

  const updateConfig = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Stack gap="lg" style={{ position: 'relative' }}>
      <LoadingOverlay visible={loading} />
      
      <div>
        <Title order={2}>ตั้งค่าระบบ</Title>
        <Text size="sm" c="dimmed">
          ปรับแต่งการทำงานทั่วไปของระบบ QR Gate Access
        </Text>
      </div>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            {/* General Settings */}
            <Card withBorder p="xl" radius="md">
              <Stack gap="md">
                <Group>
                  <IconSettings size={20} color="blue" />
                  <Text fw={700}>ตั้งค่าทั่วไป</Text>
                </Group>
                <Divider />
                <TextInput
                  label="ชื่อสถานที่ / สำนักหอสมุด"
                  placeholder="Library Name"
                  value={config.library_name}
                  onChange={(e) => updateConfig('library_name', e.target.value)}
                />
                <TextInput
                  label="ข้อความต้อนรับบนเครื่องสแกน"
                  placeholder="Welcome Message"
                  value={config.welcome_message}
                  onChange={(e) => updateConfig('welcome_message', e.target.value)}
                />
              </Stack>
            </Card>

            {/* Notification Settings */}
            <Card withBorder p="xl" radius="md">
              <Stack gap="md">
                <Group>
                  <IconBell size={20} color="orange" />
                  <Text fw={700}>การแจ้งเตือน (Notification)</Text>
                </Group>
                <Divider />
                
                <Stack gap="sm">
                  <Text size="sm" fw={500}>ช่องทางการแจ้งเตือน</Text>
                  <Group justify="space-between">
                    <Group>
                      <IconBrandLine size={18} color="#00B900" />
                      <Text size="sm">LINE Notify</Text>
                    </Group>
                    <Switch 
                      checked={config.line_notify_enabled === 'true'} 
                      onChange={(e) => updateConfig('line_notify_enabled', e.currentTarget.checked ? 'true' : 'false')}
                    />
                  </Group>
                  <TextInput
                    placeholder="LINE Notify Token"
                    description="โทเคนสำหรับการส่งข้อความผ่าน LINE Notify"
                    value={config.line_notify_token}
                    onChange={(e) => updateConfig('line_notify_token', e.target.value)}
                    type="password"
                  />
                  
                  <Divider variant="dashed" />
                  
                  <Group justify="space-between">
                    <Group>
                      <IconMail size={18} color="red" />
                      <Text size="sm">Email Notification</Text>
                    </Group>
                    <Switch 
                      checked={config.email_enabled === 'true'} 
                      onChange={(e) => updateConfig('email_enabled', e.currentTarget.checked ? 'true' : 'false')}
                    />
                  </Group>
                  <TextInput
                    placeholder="admin@example.com"
                    label="อีเมลผู้รับ"
                    value={config.email_recipient}
                    onChange={(e) => updateConfig('email_recipient', e.target.value)}
                  />
                </Stack>

                <Divider variant="dashed" />

                <Stack gap="xs">
                  <Text size="sm" fw={500}>เหตุการณ์ที่ต้องการแจ้งเตือน</Text>
                  <Switch 
                    label="เมื่อมีผู้สแกนบัตรไม่ผ่าน (Access Denied)" 
                    checked={config.notify_access_denied === 'true'}
                    onChange={(e) => updateConfig('notify_access_denied', e.currentTarget.checked ? 'true' : 'false')}
                  />
                  <Switch 
                    label="เมื่อเครื่องสแกนประตูปิดการเชื่อมต่อ (Device Offline)" 
                    checked={config.notify_device_offline === 'true'}
                    onChange={(e) => updateConfig('notify_device_offline', e.currentTarget.checked ? 'true' : 'false')}
                  />
                  <Switch 
                    label="เมื่อมีการลงทะเบียนสมาชิกใหม่" 
                    checked={config.notify_new_member === 'true'}
                    onChange={(e) => updateConfig('notify_new_member', e.currentTarget.checked ? 'true' : 'false')}
                  />
                </Stack>
              </Stack>
            </Card>

            <Group justify="flex-end">
              <Button color="blue" onClick={handleSave} loading={saving}>บันทึกการตั้งค่า</Button>
            </Group>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder p="md" radius="md" bg="var(--bg-secondary)">
            <Stack gap="sm">
              <Text fw={700} size="sm">ข้อมูลระบบ</Text>
              <Divider />
              <Group justify="space-between">
                <Text size="xs" c="dimmed">เวอร์ชัน</Text>
                <Text size="xs" fw={700}>1.0.0-stable</Text>
              </Group>
              <Group justify="space-between">
                <Text size="xs" c="dimmed">สถานะฐานข้อมูล</Text>
                <Text size="xs" fw={700} color="green">Connected</Text>
              </Group>
              <Group justify="space-between">
                <Text size="xs" c="dimmed">Last Sync</Text>
                <Text size="xs">{new Date().toLocaleString('th-TH')}</Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
