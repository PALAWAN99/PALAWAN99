import { Title, Text, Stack, Card } from '@mantine/core';
import { IconQrcode } from '@tabler/icons-react';

export default function QrManagementPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>จัดการ QR Code</Title>
        <Text size="sm" c="dimmed">
          ตรวจสอบและยกเลิกรหัส QR ที่ถูกสร้างขึ้นในระบบ
        </Text>
      </div>

      <Card withBorder p="xl">
        <Stack align="center" gap="md" py={40}>
          <IconQrcode size={48} color="var(--color-sky)" />
          <Text fw={500}>หน้าจัดการ QR Code (กำลังพัฒนา)</Text>
          <Text size="sm" c="dimmed" ta="center" style={{ maxWidth: 400 }}>
            ในส่วนนี้จะใช้สำหรับดูรายการ QR Token ทั้งหมดที่ยังใช้งานได้ และสามารถสั่งยกเลิก (Revoke) ได้ทันทีเพื่อความปลอดภัย
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
