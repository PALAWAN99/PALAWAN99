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

export default function IdCardClient({ forceMode }: { forceMode?: 'idcard' | 'rfid' }) {
  const t = useTranslations('IdCard');
  const [activeTab, setActiveTab] = useState<string | null>('register');
  const [readMode, setReadMode] = useState<'idcard' | 'rfid'>(forceMode || 'idcard');

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
  const activeReadMode = forceMode || readMode;
  const reader = useIdCardReader({
    cardApiConfigReady: cardApiAutoReady,
    localDesktopApiActive: Boolean(localApiBase),
    mode: activeReadMode,
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



  useEffect(() => {
    if (cardApiAutoReady && localApiBase) {
      void loadReaders();
    }
  }, [cardApiAutoReady, localApiBase, loadReaders]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2' && activeReadMode === 'idcard' && hasCard) {
        e.preventDefault();
        void reader.handleRead();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reader, activeReadMode, hasCard]);

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

  const isRfidMode = activeReadMode === 'rfid';
  const pageTitle = isRfidMode ? t('rfidTitle') : t('title');
  const pageSubtitle = isRfidMode ? t('rfidSubtitle') : t('subtitle');

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>{pageTitle}</Title>
          <Text size="sm" c="dimmed">
            {pageSubtitle}
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
            {!forceMode && (
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
            )}

            {activeReadMode === 'rfid' ? (
              <IdCardRfidPanel
                hasReader={hasReader}
                memberTypes={memberTypes}
                readers={reader.readers}
                cardApiReachable={reader.cardApiReachable}
                wsConnected={reader.wsConnected}
                isLoadingReaders={reader.isLoadingReaders}
                isBackendOffline={reader.isBackendOffline}
                handleRefresh={reader.handleRefresh}
              />
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
                                  key={pennMember.memberNo}
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
