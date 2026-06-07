'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Paper,
  Progress,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconCheck,
  IconId,
  IconRefresh,
  IconShieldCheck,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { CardReaderStatus } from '@/components/CardReaderStatus';
import { PdpaConsentModal } from '@/components/PdpaConsentModal';
import { De620WindowsDriverAlert } from './De620WindowsDriverAlert';
import { logClientAction } from '@/lib/route-log/client';
import type { useIdCardReader } from '../hooks/useIdCardReader';

type ReaderState = ReturnType<typeof useIdCardReader>;

function StepPill({
  n,
  label,
  state,
}: {
  n: number;
  label: string;
  state: 'done' | 'active' | 'idle';
}) {
  const bg =
    state === 'done'
      ? 'var(--mantine-color-green-light)'
      : state === 'active'
        ? 'var(--mantine-color-sky-light)'
        : 'var(--mantine-color-default-hover)';
        
  const border =
    state === 'active'
      ? '1px solid var(--mantine-color-sky-light-hover)'
      : '1px solid var(--mantine-color-default-border)';
      
  const textColor =
    state === 'done'
      ? 'var(--mantine-color-green-light-color)'
      : state === 'active'
        ? 'var(--mantine-color-sky-light-color)'
        : 'var(--mantine-color-text)';

  return (
    <Paper
      flex={1}
      p="sm"
      radius="md"
      style={{ background: bg, border, minWidth: 72, color: textColor }}
    >
      <Stack gap={6} align="center">
        <ThemeIcon
          size={28}
          radius="xl"
          color={state === 'done' ? 'green' : state === 'active' ? 'sky' : 'gray'}
          variant={state === 'idle' ? 'light' : 'filled'}
        >
          {state === 'done' ? <IconCheck size={16} /> : <Text size="xs" fw={700}>{n}</Text>}
        </ThemeIcon>
        <Text size="xs" fw={600} ta="center" lh={1.35} style={{ wordBreak: 'break-word' }}>
          {label}
        </Text>
      </Stack>
    </Paper>
  );
}

export function IdCardReadPanel({
  readers,
  isLoadingReaders,
  wsConnected,
  cardApiReachable,
  hasReader,
  hasCard,
  isBackendOffline,
  needsManualConnect,
  isReading,
  error,
  progress,
  progressMsg,
  handleRead,
  handleRefresh,
  handleConnectLocal,
}: ReaderState) {
  const t = useTranslations('IdCard');
  const [pdpaConsented, setPdpaConsented] = useState(false);
  const [showPdpaModal, setShowPdpaModal] = useState(false);

  useEffect(() => {
    if (!hasCard) {
      setPdpaConsented(false);
      setShowPdpaModal(false);
    }
  }, [hasCard]);

  const connectionStep: 'done' | 'active' | 'idle' = isBackendOffline
    ? 'active'
    : hasReader || wsConnected
      ? 'done'
      : cardApiReachable
        ? 'active'
        : isLoadingReaders
          ? 'idle'
          : 'active';

  const canShowPdpa = hasCard && !isBackendOffline && !isReading;
  const consentStep: 'done' | 'active' | 'idle' = pdpaConsented
    ? 'done'
    : connectionStep === 'done' && canShowPdpa
      ? 'active'
      : 'idle';

  const readStep: 'done' | 'active' | 'idle' = isReading
    ? 'active'
    : pdpaConsented && hasCard
      ? 'active'
      : 'idle';

  return (
    <Stack gap="md">
      <Group gap="xs" grow>
        <StepPill n={1} label={t('stepConnect')} state={connectionStep} />
        <StepPill n={2} label={t('stepPdpa')} state={consentStep} />
        <StepPill n={3} label={t('stepRead')} state={readStep} />
      </Group>

      <CardReaderStatus
        readers={readers}
        isConnected={cardApiReachable || hasReader || wsConnected}
        isLoading={isLoadingReaders}
        onRefresh={handleRefresh}
        backendOffline={isBackendOffline}
        embedded
      />

      <De620WindowsDriverAlert
        cardApiReachable={cardApiReachable}
        hasReader={hasReader}
        loading={isLoadingReaders}
      />

      <Card withBorder radius="md" p="xl">
        <Stack align="center" gap="lg">
          <Box
            className={hasCard || isReading ? 'pulse-animation' : undefined}
            style={{
              width: 140,
              height: 140,
              borderRadius: 16,
              background: hasCard
                ? 'rgba(16, 185, 129, 0.08)'
                : 'rgba(56, 189, 248, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${hasCard ? 'rgba(16, 185, 129, 0.35)' : 'rgba(56, 189, 248, 0.25)'}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isReading && <div className="scanner-line" />}
            {isReading ? (
              <Loader color="green" size="lg" type="dots" />
            ) : (
              <IconId size={72} color={hasCard ? 'var(--color-emerald)' : 'var(--color-sky)'} />
            )}
          </Box>

          <Stack align="center" gap={4}>
            <Text fw={700} size="lg" ta="center">
              {isReading
                ? progressMsg || t('reading')
                : hasCard
                  ? t('cardInserted')
                  : hasReader
                    ? t('readStart')
                    : t('notConnected')}
            </Text>
            {hasCard && !pdpaConsented && (
              <Text size="sm" c="dimmed" ta="center">
                {t('pdpaRequiredHint')}
              </Text>
            )}
          </Stack>

          {needsManualConnect ? (
            <Stack w="100%" gap="xs">
              <Button
                fullWidth
                size="lg"
                variant="filled"
                color="skyBlue"
                leftSection={<IconRefresh size={20} />}
                loading={isLoadingReaders}
                onClick={() => {
                  logClientAction('idcard.connect.manual');
                  void handleConnectLocal();
                }}
                styles={{ root: { minHeight: 48 } }}
              >
                {t('btnConnectCardApi')}
              </Button>
              <Text size="xs" c="dimmed" ta="center">
                {t('manualConnectHint')}
              </Text>
            </Stack>
          ) : !pdpaConsented ? (
            canShowPdpa ? (
              <Button
                fullWidth
                size="lg"
                variant="filled"
                color="skyBlue"
                leftSection={<IconShieldCheck size={20} />}
                onClick={() => {
                  logClientAction('idcard.pdpa.open');
                  setShowPdpaModal(true);
                }}
                styles={{
                  root: {
                    minHeight: 48,
                    fontSize: 'var(--mantine-font-size-md)',
                  },
                }}
              >
                {t('btnPdpa')}
              </Button>
            ) : (
              hasReader &&
              !isBackendOffline &&
              !isReading && (
                <Text size="xs" c="yellow.8" ta="center" fw={500}>
                  {t('pdpaInsertCardHint')}
                </Text>
              )
            )
          ) : (
            <Group w="100%" grow preventGrowOverflow={false}>
              <Button
                size="lg"
                color="green"
                leftSection={<IconId size={20} />}
                onClick={() => {
                  logClientAction('idcard.read.start');
                  void handleRead();
                }}
                loading={isReading}
                disabled={!hasCard || !hasReader || isBackendOffline}
                style={{ minHeight: 48, flex: 1 }}
              >
                {isReading ? t('reading') : t('btnReadCard')}
              </Button>
              <Button
                variant="light"
                size="lg"
                onClick={() => void handleRefresh()}
                title={t('btnRefreshPage')}
                style={{ minHeight: 48, width: 52, padding: 0 }}
              >
                <IconRefresh size={20} />
              </Button>
            </Group>
          )}

          {isReading && (
            <Stack gap={6} w="100%">
              <Progress value={progress} size="md" radius="xl" animated color="teal" />
              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  {progressMsg || t('reading')}
                </Text>
                <Text size="xs" c="dimmed" fw={600}>
                  {progress}%
                </Text>
              </Group>
            </Stack>
          )}

          {error && !isBackendOffline && (
            <Alert color="orange" variant="light" w="100%">
              {error}
            </Alert>
          )}
        </Stack>
      </Card>

      <PdpaConsentModal
        open={showPdpaModal}
        onConsent={() => {
          logClientAction('idcard.pdpa.consent');
          setPdpaConsented(true);
          setShowPdpaModal(false);
        }}
        onCancel={() => setShowPdpaModal(false)}
      />
    </Stack>
  );
}
