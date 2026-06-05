'use client';

import { Stack, Text, Center, ThemeIcon, Box } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <Center py={60}>
      <Stack align="center" gap="xs">
        <Box
          style={{
            background: 'var(--bg-secondary)',
            padding: '30px',
            borderRadius: '50%',
            marginBottom: '10px'
          }}
        >
          <ThemeIcon size={80} radius="xl" variant="light" color="gray">
            {icon || <IconInbox size={48} stroke={1} />}
          </ThemeIcon>
        </Box>
        <Text fw={700} size="lg" ta="center" c="var(--text-primary)">
          {title}
        </Text>
        {description && (
          <Text size="sm" ta="center" c="var(--text-muted)" maw={300}>
            {description}
          </Text>
        )}
      </Stack>
    </Center>
  );
}
