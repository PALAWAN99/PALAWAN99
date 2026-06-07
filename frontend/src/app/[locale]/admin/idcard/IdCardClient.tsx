'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Title,
  Text,
  Stack,
  Card,
  Button,
  Group,
  Badge,
  Tabs,
  Paper,
  Grid,
  Divider,
  TextInput,
  SegmentedControl,
  Loader,
} from '@mantine/core';
import {
  IconId,
  IconSettings,
  IconAntenna,
  IconUserPlus,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { useIdCardReader } from './hooks/useIdCardReader';
import { useCardBridgeStatus } from './hooks/useCardBridgeStatus';
import { useCardApiAutoConfig } from './hooks/useCardApiAutoConfig';
import { useIdCardTempQr } from './hooks/useIdCardTempQr';
import { ReaderSettings } from './_components/ReaderSettings';
import { CardBridgeInstallPanel } from './_components/CardBridgeInstallPanel';
import { IdCardRfidPanel } from './_components/IdCardRfidPanel';
import { IdCardReadPanel } from './_components/IdCardReadPanel';
import { IdCardVirtualPreview } from './_components/IdCardVirtualPreview';
import { IdCardMemberFoundBanner } from './_components/IdCardMemberFoundBanner';
import { IdCardPennuengRegisterForm } from './_components/IdCardPennuengRegisterForm';
import {
  fetchIdCardMemberTypesApi,
  lookupPennuengByCitizenApi,
} from './lib/idcard-pennueng-api';
import type { PennuengMember, PennuengMemberTypeOption } from '@/types/pennueng-member';

export default function IdCardClient() {
  const t = useTranslations('IdCard');
  const [activeTab, setActiveTab] = useState<string | null>('register');
  const [readMode, setReadMode] = useState<'idcard' | 'rfid'>('idcard');

  const [memberTypes, setMemberTypes] = useState<PennuengMemberTypeOption[]>([]);
  const [pennLookupLoading, setPennLookupLoading] = useState(false);
  const [pennMember, setPennMember] = useState<PennuengMember | null>(null);
  const [pennGroupDetail, setPennGroupDetail] = useState<string | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [rfidCapture, setRfidCapture] = useState<string | null>(null);

  const { issuing, qr, issueTempQr, clearQr } = useIdCardTempQr();

  const { bridgeActive, nativeHostError, refreshBridge } = useCardBridgeStatus();
  const { ready: cardApiAutoReady, localApiBase, discoverLocal } =
    useCardApiAutoConfig();
  const reader = useIdCardReader({
    cardApiConfigReady: cardApiAutoReady,
    localDesktopApiActive: Boolean(localApiBase),
  });
  const {
    cardData,
    streamingCitizen,
    hasReader,
    hasCard,
    cardApiReachable,
    isBackendOffline,
    isReading,
    progress,
    progressMsg,
    loadReaders,
    attachPhoto,
  } = reader;

  const [connectingLocal, setConnectingLocal] = useState(false);

  const connectLocalCardApi = useCallback(async () => {
    setConnectingLocal(true);
    try {
      const base = await discoverLocal();
      if (base) void loadReaders();
      return base;
    } finally {
      setConnectingLocal(false);
    }
  }, [discoverLocal, loadReaders]);

  const [additionalData, setAdditionalData] = useState({
    phone: '',
    email: '',
    school: '',
  });

  useEffect(() => {
    if (cardApiAutoReady && localApiBase) {
      void loadReaders();
    }
  }, [cardApiAutoReady, localApiBase, loadReaders]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2' && readMode === 'idcard' && hasCard) {
        e.preventDefault();
        void reader.handleRead();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reader, readMode, hasCard]);

  useEffect(() => {
    void fetchIdCardMemberTypesApi().then(setMemberTypes).catch(() => {});
  }, []);

  const lookupPennueng = useCallback(async (citizenId: string) => {
    const id = citizenId.replace(/\D/g, '');
    if (!id) {
      setPennMember(null);
      setPennGroupDetail(null);
      return;
    }
    setPennLookupLoading(true);
    try {
      const data = await lookupPennuengByCitizenApi(id);
      setPennMember(data.found ? data.member : null);
      setPennGroupDetail(data.groupDetail);
      setShowRegisterForm(!data.found);
    } catch {
      setPennMember(null);
      setPennGroupDetail(null);
    } finally {
      setPennLookupLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!cardData?.citizenId || isReading) return;
    clearQr();
    void lookupPennueng(cardData.citizenId);
  }, [cardData?.citizenId, isReading, lookupPennueng, clearQr]);

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>{t('title')}</Title>
          <Text size="sm" c="dimmed">
            {t('subtitle')}
          </Text>
        </div>
        <Group gap="xs" wrap="wrap" justify="flex-end">
          {localApiBase ? (
            <Badge color="violet" variant="light" size="lg">
              {t('desktopApiBadge')}
            </Badge>
          ) : bridgeActive ? (
            <Badge color="teal" variant="light" size="lg">
              {t('extensionBridgeActive')}
            </Badge>
          ) : nativeHostError ? (
            <Badge color="orange" variant="light" size="lg">
              {t('extensionTurnOffBridgeShort')}
            </Badge>
          ) : null}
          {isBackendOffline ? (
            <Badge color="red" variant="light" size="lg">
              {t('disconnected')}
            </Badge>
          ) : hasCard ? (
            <Badge color="green" variant="light" size="lg">
              {t('cardInserted')}
            </Badge>
          ) : hasReader || cardApiReachable ? (
            <Badge color="yellow" variant="light" size="lg">
              {hasReader ? t('connected') : t('apiReady')}
            </Badge>
          ) : (
            <Badge color="gray" variant="light" size="lg">
              {t('disconnected')}
            </Badge>
          )}
        </Group>
      </Group>

      <CardBridgeInstallPanel
        bridgeActive={bridgeActive}
        localApiBase={localApiBase}
        nativeHostError={nativeHostError}
        connectingLocal={connectingLocal}
        onConnectLocal={() => void connectLocalCardApi()}
        onRefreshBridge={() => {
          refreshBridge();
          void connectLocalCardApi();
        }}
      />

      <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
        <Tabs.List grow>
          <Tabs.Tab value="register" leftSection={<IconId size={18} />}>
            {t('tabRead')}
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={18} />}>
            {t('tabSettings')}
          </Tabs.Tab>
        </Tabs.List>

        <Divider my="md" />

        <Tabs.Panel value="register">
          <Stack gap="md">
            <Paper withBorder p="sm" radius="md" bg="var(--bg-secondary)">
              <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs" ta="center">
                {t('readModeTitle')}
              </Text>
              <SegmentedControl
                fullWidth
                value={readMode}
                onChange={(v) => setReadMode(v as 'idcard' | 'rfid')}
                data={[
                  {
                    value: 'idcard',
                    label: (
                      <Group gap={6} justify="center" wrap="nowrap">
                        <IconId size={16} />
                        <span>{t('readModeIdCard')}</span>
                      </Group>
                    ),
                  },
                  {
                    value: 'rfid',
                    label: (
                      <Group gap={6} justify="center" wrap="nowrap">
                        <IconAntenna size={16} />
                        <span>{t('readModeRfid')}</span>
                      </Group>
                    ),
                  },
                ]}
              />
            </Paper>

            {readMode === 'rfid' ? (
              <IdCardRfidPanel hasReader={hasReader} memberTypes={memberTypes} />
            ) : (
              <Grid gap="md" align="flex-start">
                <Grid.Col span={{ base: 12, md: 5 }}>
                  <IdCardReadPanel {...reader} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 7 }} mt={{ base: 0, md: 0 }}>
                  <Card withBorder radius="md" p="lg" h="100%">
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Text fw={700}>{t('readResult')}</Text>
                      </Group>
                      <Divider />

                      {cardData || isReading || streamingCitizen ? (
                        <Stack gap="md">
                          <IdCardVirtualPreview
                            citizen={streamingCitizen}
                            isReading={isReading}
                            progress={progress}
                            progressMsg={progressMsg}
                            onPhotoLoaded={attachPhoto}
                          />

                          {cardData && !isReading ? (
                            <>
                              <Divider my="sm" />
                              {pennLookupLoading ? (
                                <Group justify="center" py="md">
                                  <Loader size="sm" />
                                  <Text size="sm" c="dimmed">
                                    {t('pennCheckingMember')}
                                  </Text>
                                </Group>
                              ) : null}

                              {pennMember ? (
                                <IdCardMemberFoundBanner
                                  member={pennMember}
                                  groupDetail={pennGroupDetail}
                                  issuing={issuing}
                                  qr={qr}
                                  onIssueQr={() => void issueTempQr(pennMember.memberNo)}
                                />
                              ) : null}

                              {!pennMember && !pennLookupLoading ? (
                                <>
                                  {!showRegisterForm ? (
                                    <Button
                                      size="md"
                                      variant="light"
                                      color="skyBlue"
                                      leftSection={<IconUserPlus size={18} />}
                                      onClick={() => setShowRegisterForm(true)}
                                    >
                                      {t('pennShowRegister')}
                                    </Button>
                                  ) : (
                                    <IdCardPennuengRegisterForm
                                      card={cardData}
                                      types={memberTypes}
                                      rfidCapture={rfidCapture}
                                      onRfidCaptureConsumed={() => setRfidCapture(null)}
                                      onSuccess={() => {
                                        void lookupPennueng(cardData.citizenId);
                                      }}
                                    />
                                  )}
                                </>
                              ) : null}

                              {!pennMember && (
                                <>
                                  <Text fw={600} size="sm">
                                    {t('additionalInfo')}
                                  </Text>
                                  <Grid gap="xs">
                                    <Grid.Col span={6}>
                                      <TextInput
                                        label={t('phone')}
                                        placeholder="08X-XXX-XXXX"
                                        value={additionalData.phone}
                                        onChange={(e) => {
                                          const raw = e.target.value.replace(/-/g, '');
                                          const d = raw.slice(0, 10);
                                          let fmt = d;
                                          if (d.length > 3) fmt = `${d.slice(0, 3)}-${d.slice(3)}`;
                                          if (d.length > 6) {
                                            fmt = `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
                                          }
                                          setAdditionalData({ ...additionalData, phone: fmt });
                                        }}
                                        maxLength={12}
                                      />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                      <TextInput
                                        label={t('email')}
                                        placeholder="example@mail.com"
                                        value={additionalData.email}
                                        onChange={(e) =>
                                          setAdditionalData({ ...additionalData, email: e.target.value })
                                        }
                                      />
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                      <TextInput
                                        label={t('school')}
                                        placeholder="Enter school name..."
                                        value={additionalData.school}
                                        onChange={(e) =>
                                          setAdditionalData({ ...additionalData, school: e.target.value })
                                        }
                                      />
                                    </Grid.Col>
                                  </Grid>
                                </>
                              )}
                            </>
                          ) : null}
                        </Stack>
                      ) : (
                        <Stack align="center" gap="xs" pt="sm" pb="md">
                          <IconId size={40} color="var(--mantine-color-gray-4)" />
                          <Text c="dimmed" size="sm" ta="center">
                            {t('noData')}
                          </Text>
                          <Text c="dimmed" size="xs" ta="center" maw={280}>
                            {t('virtualCardHint')}
                          </Text>
                        </Stack>
                      )}
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="settings">
          <ReaderSettings />
        </Tabs.Panel>
      </Tabs>

      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes scan {
          0% {
            top: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .pulse-animation {
          animation: pulse 2s infinite ease-in-out;
        }
        .scanner-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--color-emerald);
          box-shadow: 0 0 8px var(--color-emerald);
          z-index: 10;
          animation: scan 2s infinite linear;
        }
      `}</style>
    </Stack>
  );
}
