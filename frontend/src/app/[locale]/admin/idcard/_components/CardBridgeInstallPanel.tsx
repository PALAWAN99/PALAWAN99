'use client';

import { useState } from 'react';
import {
  Alert,
  Button,
  Collapse,
  Group,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { IconChevronDown, IconDeviceDesktop, IconDownload } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import {
  isExtensionDownloadVisible,
  cardAgentDownloadUrl,
  cardBridgeEasyInstallUrl,
  cardBridgeZipUrl,
} from '@/lib/card-bridge-download';
import { usesServerCardApi } from '@/lib/card-api-base';

function isMacOs(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPhone|iPad|Macintosh/.test(navigator.userAgent);
}

type CardBridgeInstallPanelProps = {
  bridgeActive: boolean;
  localApiBase?: string | null;
  nativeHostError?: string | null;
  onRefreshBridge: () => void;
  onConnectLocal?: () => void;
  connectingLocal?: boolean;
};

export function CardBridgeInstallPanel({
  bridgeActive,
  localApiBase,
  nativeHostError,
  onRefreshBridge,
  onConnectLocal,
  connectingLocal,
}: CardBridgeInstallPanelProps) {
  const t = useTranslations('IdCard');
  const [expanded, setExpanded] = useState(false);
  const [showExtensionAdvanced, setShowExtensionAdvanced] = useState(false);
  const isMac = isMacOs();
  const os = isMac ? 'mac' : 'windows';
  const agentUrl = cardAgentDownloadUrl(os);
  const desktopReady = Boolean(localApiBase);
  const showExtensionDownload = isExtensionDownloadVisible(os);

  const extensionBlock = showExtensionDownload ? (
    <Alert
      color="teal"
      variant="light"
      title={
        os === 'windows'
          ? t('extensionEasyInstallTitleWindows')
          : t('extensionEasyInstallTitleMac')
      }
    >
      <Text size="xs" mb="sm">
        {os === 'windows' ? t('extensionEasyInstallHintWindows') : t('extensionEasyInstallHintMac')}
      </Text>
      <Group gap="xs">
        <Button
          component="a"
          href={cardBridgeEasyInstallUrl(os)}
          download
          leftSection={<IconDownload size={16} />}
          color="teal"
          variant="filled"
          size="sm"
        >
          {isMac ? t('extensionEasyInstallMac') : t('extensionEasyInstallWindows')}
        </Button>
        <Button
          component="a"
          href={cardBridgeZipUrl()}
          download
          variant="subtle"
          size="sm"
        >
          {t('extensionDownloadManual')}
        </Button>
      </Group>
    </Alert>
  ) : (
    <>
      <UnstyledButton onClick={() => setShowExtensionAdvanced((v) => !v)} w="100%">
        <Group justify="space-between" gap="xs">
          <Text size="xs" fw={600} c="dimmed">
            {t('extensionAdvancedTitle')}
          </Text>
          <IconChevronDown
            size={14}
            style={{
              transform: showExtensionAdvanced ? 'rotate(180deg)' : undefined,
              transition: 'transform 0.2s ease',
            }}
          />
        </Group>
      </UnstyledButton>
      <Collapse expanded={showExtensionAdvanced}>
        <Text size="xs" c="dimmed">
          {t('extensionAdvancedBody')}
        </Text>
      </Collapse>
    </>
  );

  return (
    <Paper withBorder p="md" radius="md">
      <UnstyledButton
        w="100%"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <Group justify="space-between" wrap="nowrap" gap="sm">
          <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            <IconDeviceDesktop
              size={18}
              color="var(--mantine-color-violet-6)"
              style={{ flexShrink: 0 }}
            />
            <Stack gap={2} style={{ minWidth: 0 }}>
              <Text fw={600} size="sm" lineClamp={1}>
                {t('readerSetupTitle')}
              </Text>
              {!expanded ? (
                <Text size="xs" c="dimmed" lineClamp={1}>
                  {desktopReady
                    ? t('readerSetupCollapsedReady', { url: localApiBase ?? '' })
                    : t('readerSetupCollapsedHint')}
                </Text>
              ) : null}
            </Stack>
          </Group>
          <IconChevronDown
            size={18}
            style={{
              flexShrink: 0,
              transform: expanded ? 'rotate(180deg)' : undefined,
              transition: 'transform 0.2s ease',
            }}
          />
        </Group>
      </UnstyledButton>

      <Collapse expanded={expanded}>
        <Stack gap="sm" mt="sm" pt="sm" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
          <Text size="xs" c="dimmed">
            {t('readerSetupDesc')}
          </Text>

          {usesServerCardApi() && !desktopReady && !bridgeActive ? (
            <Alert color="yellow" variant="light" title={t('serverCardApiWarningTitle')}>
              <Text size="xs">{t('serverCardApiWarningBody')}</Text>
            </Alert>
          ) : null}

          {!desktopReady && !bridgeActive ? (
            <Alert color="orange" variant="light" title={t('wafCleanUrlTitle')}>
              <Text size="xs" mb="sm">
                {t('wafCleanUrlBody')}
              </Text>
              {onConnectLocal ? (
                <Button
                  size="sm"
                  color="orange"
                  variant="light"
                  loading={connectingLocal}
                  onClick={onConnectLocal}
                >
                  {t('btnConnectCardApi')}
                </Button>
              ) : null}
            </Alert>
          ) : null}

          {desktopReady ? (
            <Alert color="green" variant="light" title={t('desktopApiActiveTitle')}>
              <Text size="xs">{t('desktopApiActiveBody', { url: localApiBase ?? '' })}</Text>
            </Alert>
          ) : null}

          {nativeHostError && !desktopReady ? (
            <Alert color="orange" variant="light" title={t('extensionBridgeNativeHostFailed')}>
              <Text size="xs">{t('extensionTurnOffBridgeHint')}</Text>
            </Alert>
          ) : null}

          {extensionBlock}

          <Alert color="violet" variant="light" title={t('desktopAgentTitle')}>
            <Text size="xs" mb="sm">
              {t('desktopAgentHint')}
            </Text>
            <Group gap="xs">
              <Button
                component="a"
                href={agentUrl}
                download
                leftSection={<IconDownload size={16} />}
                color="violet"
                variant="filled"
                size="sm"
              >
                {isMac ? t('desktopAgentMac') : t('desktopAgentWindows')}
              </Button>
              <Button variant="subtle" size="sm" onClick={onRefreshBridge}>
                {t('extensionRecheck')}
              </Button>
            </Group>
          </Alert>

          {bridgeActive ? (
            <Alert color="teal" variant="light" title={t('extensionBridgeActive')}>
              <Text size="xs">{t('extensionBridgeActiveNote')}</Text>
            </Alert>
          ) : null}
        </Stack>
      </Collapse>
    </Paper>
  );
}
