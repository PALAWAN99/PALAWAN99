import { Title, Text, Stack, Card } from '@mantine/core';
import { IconShieldLock } from '@tabler/icons-react';

export default function SecurityPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>ความปลอดภัยและนโยบาย</Title>
        <Text size="sm" c="dimmed">
          จัดการสิทธิ์การเข้าถึงและตรวจสอบ Audit Log
        </Text>
      </div>

      <Card withBorder p="xl">
        <Stack align="center" gap="md" py={40}>
          <IconShieldLock size={48} color="var(--color-navy)" />
          <Text fw={500}>ระบบจัดการความปลอดภัย (กำลังพัฒนา)</Text>
          <Text size="sm" c="dimmed" ta="center" style={{ maxWidth: 400 }}>
            ใช้สำหรับกำหนดสิทธิ์ของเจ้าหน้าที่ (Admin/Staff) และตรวจสอบประวัติการแก้ไขข้อมูลภายในระบบ (Audit Trail)
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
