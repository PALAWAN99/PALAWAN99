'use client';

import { useTranslations } from 'next-intl';
import { Title, Text, Stack, Card, Button, Group, SimpleGrid, ThemeIcon, Box, SegmentedControl, Divider, ActionIcon } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconFileTypeCsv, IconFileTypePdf, IconChartPie, IconUsers, IconCalendarStats, IconPrinter } from '@tabler/icons-react';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';

export default function MemberReportsPage() {
  const t = useTranslations();
  const [dateRange, setDateRange] = useState<any>([new Date(), new Date()]);
  const [isExporting, setIsExporting] = useState(false);

  // ข้อมูลจำลองสำหรับ Export
  const MOCK_REPORT_DATA = [
    { id: '1', name: 'สมชาย รักเรียน', type: 'Employee', gate: 'Main Entrance', time: '2024-04-30 10:28', status: 'ALLOWED' },
    { id: '2', name: 'John Smith', type: 'Visitor', gate: 'Side Exit', time: '2024-04-30 10:25', status: 'ALLOWED' },
    { id: '3', name: 'Sarah Wilson', type: 'Contractor', gate: 'Main Entrance', time: '2024-04-30 10:12', status: 'ALLOWED' },
  ];

  const handleExportCSV = () => {
    setIsExporting(true);
    
    // จำลองการสร้างไฟล์ CSV
    const headers = ['ID,Name,Type,Gate,Time,Status'];
    const rows = MOCK_REPORT_DATA.map(d => `${d.id},${d.name},${d.type},${d.gate},${d.time},${d.status}`);
    const csvContent = headers.concat(rows).join('\n');
    
    // สร้าง Blob และดาวน์โหลด
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `gate_report_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifications.show({
      title: 'Export Successful',
      message: 'Your CSV report has been downloaded.',
      color: 'teal',
    });
    
    setIsExporting(false);
  };

  const handleExportPDF = () => {
    notifications.show({
      title: 'Generating PDF...',
      message: 'Preparing your document for printing.',
      loading: true,
      autoClose: 2000,
    });
    
    // จำลองการ Export PDF ด้วยระบบ Print ของ Browser
    setTimeout(() => {
      window.print();
    }, 2100);
  };

  const REPORT_TYPES = [
    { title: 'Member Access Summary', icon: IconUsers, color: 'skyBlue', desc: 'Summary of access counts per member.' },
    { title: 'Gate Traffic Report', icon: IconCalendarStats, iconColor: 'emerald', desc: 'Detailed traffic analysis for each gate.' },
    { title: 'Daily Activity Peak', icon: IconChartPie, iconColor: 'navy', desc: 'Identify busiest hours during the day.' },
  ];

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2} fw={800}>{t('Common.reports')}</Title>
          <Text c="dimmed" size="sm">Generate and export system activity reports.</Text>
        </div>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
        {REPORT_TYPES.map((rep) => (
          <Card key={rep.title} withBorder p="xl" radius="lg" className="stat-card">
            <ThemeIcon size={48} radius="md" variant="light" color={rep.color || 'blue'} mb="md">
              <rep.icon size={24} />
            </ThemeIcon>
            <Text fw={700} mb={4}>{rep.title}</Text>
            <Text size="xs" c="dimmed" mb="lg">{rep.desc}</Text>
            <Button variant="light" fullWidth radius="md">Select Report</Button>
          </Card>
        ))}
      </SimpleGrid>

      <Card withBorder p="xl" radius="lg">
        <Stack gap="xl">
          <Group justify="space-between">
            <Text fw={800} size="lg">Report Configuration</Text>
            <SegmentedControl 
              data={['Daily', 'Weekly', 'Monthly', 'Custom']} 
              radius="md"
            />
          </Group>

          <Divider variant="dashed" />

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
            <DatePickerInput
              type="range"
              label="Select Date Range"
              placeholder="Pick dates range"
              value={dateRange}
              onChange={setDateRange}
              radius="md"
              leftSection={<IconCalendarStats size={18} stroke={1.5} />}
            />

            <Stack gap={4}>
              <Text size="sm" fw={500} mb={4}>Export Options</Text>
              <Group gap="sm">
                <Button 
                  flex={1} 
                  variant="outline" 
                  color="teal" 
                  leftSection={<IconFileTypeCsv size={18} />}
                  radius="md"
                  onClick={handleExportCSV}
                  loading={isExporting}
                >
                  Export CSV
                </Button>
                <Button 
                  flex={1} 
                  variant="outline" 
                  color="red" 
                  leftSection={<IconFileTypePdf size={18} />}
                  radius="md"
                  onClick={handleExportPDF}
                >
                  Export PDF
                </Button>
                <ActionIcon variant="outline" size="lg" radius="md" onClick={() => window.print()}><IconPrinter size={18} /></ActionIcon>
              </Group>
            </Stack>
          </SimpleGrid>

          <Box p="xl" bg="var(--bg-secondary)" style={{ border: '2px dashed var(--border-color)', borderRadius: '12px' }}>
            <Stack align="center" gap="xs">
              <IconFileTypeCsv size={40} color="var(--text-muted)" stroke={1} />
              <Text size="sm" fw={600} c="var(--text-muted)">Report Preview will appear here</Text>
              <Text size="xs" c="var(--text-muted)">Configure the range and type to generate preview</Text>
            </Stack>
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
}
