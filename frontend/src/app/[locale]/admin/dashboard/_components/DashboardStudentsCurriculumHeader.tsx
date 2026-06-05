'use client';

import { Box, Group, ThemeIcon, Title } from '@mantine/core';
import { IconSchool } from '@tabler/icons-react';

type DashboardStudentsCurriculumHeaderProps = {
  title: string;
};

/** หัวข้อส่วนนักศึกษา/หลักสูตร — ไม่แสดงคำอธิบายย่อย */
export function DashboardStudentsCurriculumHeader({ title }: DashboardStudentsCurriculumHeaderProps) {
  return (
    <Box
      style={{
        background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 55%, #b91c1c 100%)',
        borderRadius: 12,
        padding: '18px 22px',
      }}
    >
      <Group gap="md" wrap="nowrap">
        <ThemeIcon
          size={48}
          radius="md"
          variant="white"
          style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', flexShrink: 0 }}
        >
          <IconSchool size={26} stroke={1.5} />
        </ThemeIcon>
        <Title order={3} c="white" fw={700} style={{ letterSpacing: '-0.02em' }}>
          {title}
        </Title>
      </Group>
    </Box>
  );
}
