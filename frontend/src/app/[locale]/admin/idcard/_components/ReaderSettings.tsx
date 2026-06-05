'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Stack,
  Group,
  Text,
  Divider,
  Grid,
  Paper,
  Badge,
  Code,
  Loader,
  Button,
  Alert,
  TextInput,
} from '@mantine/core';
import { IconRefresh, IconSettings, IconCircleCheck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { fetchDiagnostic, type DiagnosticInfo } from '@/lib/api';
import {
  CARD_API_BASE_CHANGED,
  getCardApiBase,
  getDefaultCardApiBase,
  setCardApiBase,
  usesLocalCardApi,
} from '@/lib/card-api-base';

export function ReaderSettings() {
  const t = useTranslations('IdCard');
  const [apiUrl, setApiUrl] = useState('');
  const [diag, setDiag] = useState<DiagnosticInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setApiUrl(getCardApiBase());
    sync();
    window.addEventListener(CARD_API_BASE_CHANGED, sync);
    return () => window.removeEventListener(CARD_API_BASE_CHANGED, sync);
  }, []);

  const loadDiagnostic = async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await fetchDiagnostic();
      setDiag(info);
    } catch (err) {
      setDiag(null);
      setError(err instanceof Error ? err.message : t('errorBackend'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDiagnostic();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  const showConnected = !loading && !error && diag && usesLocalCardApi();

  return (
    <Card withBorder radius="md" p="xl">
      <Stack gap="md">
        <Group>
          <IconSettings size={20} color="var(--color-sky)" />
          <Text fw={700}>{t('settingsTitle')}</Text>
        </Group>
        <Divider />

        <Text size="sm">{t('settingsDesc')}</Text>

        {showConnected ? (
          <Alert
            color="green"
            variant="light"
            icon={<IconCircleCheck size={18} />}
            title={t('settingsConnectedAlert', { url: getCardApiBase() })}
          />
        ) : null}

        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Text size="sm" fw={600}>
              {t('cardApiUrlLabel')}
            </Text>
            <Text size="xs" c="dimmed">
              {t('cardApiUrlHint')}
            </Text>
            <TextInput
              value={apiUrl}
              onChange={(e) => setApiUrl(e.currentTarget.value)}
              placeholder={getDefaultCardApiBase()}
              size="sm"
            />
            <Button
              variant="light"
              color="skyBlue"
              size="xs"
              onClick={() => {
                setCardApiBase(apiUrl);
                void loadDiagnostic();
              }}
            >
              {t('cardApiUrlSave')}
            </Button>
          </Stack>
        </Paper>

        {loading ? (
          <Stack gap="xs" align="center" py="md">
            <Loader size="sm" />
            <Text size="xs" c="dimmed">
              {t('settingsChecking')}
            </Text>
          </Stack>
        ) : error ? (
          <Stack gap="sm">
            <Alert color="red" variant="light" title={t('errorBackendTitle')}>
              {error}
            </Alert>
            <Text size="xs" c="dimmed">
              {t('settingsErrorDevHint')}: <Code>cd backend && ./run-dev.sh</Code>
            </Text>
            <Button
              variant="light"
              color="skyBlue"
              size="xs"
              leftSection={<IconRefresh size={16} />}
              onClick={() => void loadDiagnostic()}
            >
              {t('btnRefreshPage')}
            </Button>
          </Stack>
        ) : diag ? (
          <Grid gap="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper withBorder p="md" radius="md">
                <Stack gap="xs">
                  <Text fw={600} size="sm">
                    {t('readerDetected')}
                  </Text>
                  {diag.pcsc_readers.length > 0 ? (
                    diag.pcsc_readers.map((name) => (
                      <Badge key={name} variant="light" color="teal">
                        {name}
                      </Badge>
                    ))
                  ) : (
                    <Text size="xs" c="dimmed">
                      —
                    </Text>
                  )}
                </Stack>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper withBorder p="md" radius="md">
                <Stack gap="xs">
                  <Text fw={600} size="sm">
                    {t('systemStatus')}
                  </Text>
                  <Group justify="space-between">
                    <Text size="xs">PC/SC</Text>
                    <Badge color={diag.pcsc_available ? 'green' : 'red'}>
                      {diag.pcsc_available ? 'OK' : 'N/A'}
                    </Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs">USB (DE-620)</Text>
                    <Badge color={diag.usb_detected ? 'green' : 'gray'}>
                      {diag.usb_detected ? diag.usb_product || 'Detected' : 'Not found'}
                    </Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs">Mock mode</Text>
                    <Badge color={diag.mock_mode ? 'yellow' : 'green'} variant="light">
                      {diag.mock_mode ? 'ON' : 'OFF'}
                    </Badge>
                  </Group>
                  {diag.message ? (
                    <Text size="xs" c="dimmed" mt="xs">
                      {diag.message}
                    </Text>
                  ) : null}
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        ) : null}
      </Stack>
    </Card>
  );
}
