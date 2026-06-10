'use client';

import { Group, Title, Text, Stack, Badge } from '@mantine/core';
import type { TablerIcon } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  /** Tabler icon component */
  icon: TablerIcon;
  /** Page title */
  title: string;
  /** Subtitle / description */
  subtitle?: string;
  /** Optional badge/status rendered below the subtitle */
  badge?: ReactNode;
  /** Optional action buttons rendered on the right side */
  actions?: ReactNode;
  /** Icon size — default 28 */
  iconSize?: number;
}

/**
 * Shared page header used across all admin pages.
 * Enforces consistent icon colour (--color-navy), title order (h2),
 * subtitle colour (--text-secondary), and action slot on the right.
 */
export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
  actions,
  iconSize = 28,
}: PageHeaderProps) {
  return (
    <Group justify="space-between" align="flex-start" wrap="wrap" mb="lg">
      <Stack gap={4}>
        <Group gap="xs" align="center">
          <Icon size={iconSize} color="var(--color-navy)" />
          <Title order={2} c="var(--text-primary)" fw={800}>
            {title}
          </Title>
        </Group>
        {subtitle && (
          <Text size="sm" c="var(--text-secondary)">
            {subtitle}
          </Text>
        )}
        {badge && <>{badge}</>}
      </Stack>

      {actions && (
        <Group gap="sm" wrap="nowrap">
          {actions}
        </Group>
      )}
    </Group>
  );
}
