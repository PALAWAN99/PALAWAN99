'use client';

import type { ReactNode } from 'react';
import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Paper,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import type { ReaderInfo } from '@/lib/api';

interface CardReaderStatusProps {
  readers: ReaderInfo[];
  isConnected: boolean;
  isLoading: boolean;
  onRefresh?: () => void;
  backendOffline?: boolean;
  embedded?: boolean;
}

type ShellAccent = 'neutral' | 'attention' | 'error';

function StatusShell({
  embedded,
  accent = 'neutral',
  children,
}: {
  embedded?: boolean;
  accent?: ShellAccent;
  children: ReactNode;
}) {
  const accentColor =
    accent === 'error' ? 'red' : accent === 'attention' ? 'yellow' : 'gray';

  const embeddedStyle =
    embedded && accent !== 'neutral'
      ? {
          borderLeftWidth: 3,
          borderLeftStyle: 'solid' as const,
          borderLeftColor: `var(--mantine-color-${accentColor}-5)`,
          backgroundColor: `var(--mantine-color-${accentColor}-0)`,
        }
      : undefined;

  if (!embedded) {
    return (
      <Card withBorder radius="md" padding="sm">
        {children}
      </Card>
    );
  }

  return (
    <Paper withBorder radius="md" p="sm" style={embeddedStyle}>
      {children}
    </Paper>
  );
}

function RefreshButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button
      variant="light"
      size="xs"
      color="gray"
      leftSection={<IconRefresh size={14} stroke={1.75} />}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function ReaderRow({
  reader,
  hasCardLabel,
  noCardLabel,
}: {
  reader: ReaderInfo;
  hasCardLabel: string;
  noCardLabel: string;
}) {
  const statusLabel = reader.has_card ? hasCardLabel : noCardLabel;

  return (
    <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
      <Tooltip label={reader.name} withArrow openDelay={400}>
        <Badge
          variant="dot"
          color={reader.has_card ? 'green' : 'yellow'}
          size="lg"
          radius="sm"
          maw={160}
          style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {reader.name}
        </Badge>
      </Tooltip>
      <Tooltip label={statusLabel} withArrow openDelay={400}>
        <Badge
          variant="light"
          color={reader.has_card ? 'green' : 'gray'}
          size="sm"
          radius="sm"
          maw={{ base: 160, sm: 240 }}
          style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {statusLabel}
        </Badge>
      </Tooltip>
    </Group>
  );
}

export function CardReaderStatus({
  readers,
  isConnected,
  isLoading,
  onRefresh,
  backendOffline = false,
  embedded = false,
}: CardReaderStatusProps) {
  const t = useTranslations('CardReader');

  if (isLoading) {
    return (
      <StatusShell embedded={embedded}>
        <Group gap="sm" wrap="nowrap">
          <Loader size="xs" type="dots" color="skyBlue" />
          <Text size="sm" c="dimmed">
            {t('checking')}
          </Text>
        </Group>
      </StatusShell>
    );
  }

  if (backendOffline) {
    return (
      <StatusShell embedded={embedded} accent="error">
        <Group justify="space-between" wrap="wrap" gap="sm">
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
            <Badge variant="dot" color="red" size="lg">
              {t('backendOffline')}
            </Badge>
          </Group>
          {onRefresh && (
            <RefreshButton onClick={onRefresh} label={t('retry')} />
          )}
        </Group>
      </StatusShell>
    );
  }

  if (readers.length === 0) {
    return (
      <StatusShell embedded={embedded} accent="attention">
        <Group justify="space-between" wrap="wrap" gap="sm">
          <Badge variant="dot" color="yellow" size="lg">
            {t('noReader')}
          </Badge>
          {onRefresh && (
            <RefreshButton onClick={onRefresh} label={t('refresh')} />
          )}
        </Group>
      </StatusShell>
    );
  }

  return (
    <StatusShell embedded={embedded}>
      <Group justify="space-between" align="center" wrap="wrap" gap="sm">
        <Group
          gap="md"
          wrap="wrap"
          align="center"
          style={{ flex: 1, minWidth: 0 }}
        >
          {readers.map((reader) => (
            <ReaderRow
              key={reader.name}
              reader={reader}
              hasCardLabel={t('hasCard')}
              noCardLabel={t('noCard')}
            />
          ))}

          {isConnected && (
            <>
              <Divider orientation="vertical" visibleFrom="sm" />
              <Tooltip label={t('signalReady')} withArrow>
                <Badge variant="dot" color="teal" size="sm" radius="sm">
                  {t('signalReady')}
                </Badge>
              </Tooltip>
            </>
          )}
        </Group>

        {onRefresh && (
          <RefreshButton onClick={onRefresh} label={t('refresh')} />
        )}
      </Group>
    </StatusShell>
  );
}
