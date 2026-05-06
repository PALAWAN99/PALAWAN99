'use client';

import { useTranslations } from 'next-intl';
import { Title, Text, Stack, Card, Center } from '@mantine/core';
import { IconQrcode } from '@tabler/icons-react';

export default function QRPage() {
  const t = useTranslations();

  return (
    <Stack gap="lg">
      <Title order={2}>{t('Common.qr')}</Title>
      <Text c="dimmed">ระบบออก QR Code สำหรับการเข้า-ออกประตู</Text>

      <Card withBorder p="xl">
        <Center style={{ flexDirection: 'column', padding: '40px 0' }}>
          <IconQrcode size={120} stroke={1} color="var(--color-sky)" />
          <Text mt="md" fw={500}>ระบบออก QR Code กำลังอยู่ในระหว่างการพัฒนา</Text>
          <Text size="sm" c="dimmed">ส่วนนี้จะเชื่อมต่อกับระบบสมาชิกและ Token เพื่อสร้างรหัสความปลอดภัย</Text>
        </Center>
      </Card>
    </Stack>
  );
}
