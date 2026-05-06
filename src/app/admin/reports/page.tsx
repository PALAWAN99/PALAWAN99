import { Title, Text, Stack, Card } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';

export default function ReportsPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>รายงานและสถิติ</Title>
        <Text size="sm" c="dimmed">
          วิเคราะห์ข้อมูลการเข้าใช้งานหอสมุดย้อนหลัง
        </Text>
      </div>

      <Card withBorder p="xl">
        <Stack align="center" gap="md" py={40}>
          <IconChartBar size={48} color="var(--color-emerald)" />
          <Text fw={500}>ระบบรายงาน (กำลังพัฒนา)</Text>
          <Text size="sm" c="dimmed" ta="center" style={{ maxWidth: 400 }}>
            ในส่วนนี้จะใช้สำหรับส่งออกข้อมูล (Export) เป็น Excel/PDF และแสดงกราฟสถิติรายวัน รายเดือน เพื่อใช้ในการประเมินการเข้าใช้บริการของหอสมุด
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
