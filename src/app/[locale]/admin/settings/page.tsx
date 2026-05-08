'use client';

import { useTranslations } from 'next-intl';
import { Title, Text, Stack, Card } from '@mantine/core';

export default function SettingsPage() {
  const t = useTranslations();

  return (
    <Stack gap="lg">
      <Title order={2}>{t('Common.settings')}</Title>
      <Text c="dimmed">ตั้งค่าการใช้งานระบบและโปรไฟล์แอดมิน</Text>

      <Card withBorder p="xl" ta="center">
        <Text>หน้าตั้งค่ากำลังอยู่ในระหว่างการพัฒนา</Text>
      </Card>
    </Stack>
  );
}
