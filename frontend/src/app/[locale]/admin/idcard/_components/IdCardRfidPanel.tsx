'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  Code,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconAntenna,
  IconCheck,
  IconCopy,
  IconPlayerPause,
  IconPlayerPlay,
  IconRefresh,
  IconUserPlus,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { QRCodeSVG } from 'qrcode.react';
import type { PennuengMember, PennuengMemberTypeOption } from '@/types/pennueng-member';
import type { PennuengMemberKeyWithMember } from '@/types/pennueng-member';
import { formatUidHex, useRfidReader } from '../hooks/useRfidReader';
import { useIdCardTempQr } from '../hooks/useIdCardTempQr';
import { IdCardMemberFoundBanner } from './IdCardMemberFoundBanner';
import { IdCardPennuengRegisterForm } from './IdCardPennuengRegisterForm';
import {
  lookupMemberKeyApi,
  searchPennuengMembersBriefApi,
} from '../lib/idcard-pennueng-api';

type Props = {
  hasReader: boolean;
  memberTypes: PennuengMemberTypeOption[];
};

const MIN_SEARCH = 3;
const SEARCH_DEBOUNCE_MS = 320;

function isRfidNoCardError(error: string): boolean {
  return (
    error.includes('ไม่พบบัตร') ||
    error.includes('NO_TAG') ||
    error.includes('POLLING')
  );
}

function keyFromRfid(uidHex?: string, uidDecimal?: string): string {
  return uidDecimal?.trim() || uidHex?.replace(/\s/g, '') || '';
}

export function IdCardRfidPanel({ hasReader, memberTypes }: Props) {
  const t = useTranslations('IdCard');
  const { isScanning, lastResult, history, autoScan, setAutoScan, doScan } =
    useRfidReader(false);
  const { issuing, qr, issueTempQr } = useIdCardTempQr();

  const [copied, setCopied] = useState<string | null>(null);
  const [keyRow, setKeyRow] = useState<PennuengMemberKeyWithMember | null>(null);
  const [keyLoading, setKeyLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedMember, setSelectedMember] = useState<PennuengMember | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchOptions, setSearchOptions] = useState<{ value: string; label: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [rfidCapture, setRfidCapture] = useState<string | null>(null);
  const [awaitRfidForForm, setAwaitRfidForForm] = useState(false);
  const searchSeq = useRef(0);

  const lookupKey = useCallback(async (raw: string) => {
    const key = raw.trim();
    if (!key) {
      setKeyRow(null);
      return;
    }
    setKeyLoading(true);
    try {
      const data = await lookupMemberKeyApi(key);
      setKeyRow(data.found ? data.row : null);
      if (!data.found) setShowRegister(true);
    } catch {
      setKeyRow(null);
      setShowRegister(true);
    } finally {
      setKeyLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!lastResult?.success) return;
    const raw = keyFromRfid(lastResult.uid_hex, lastResult.uid_decimal);
    if (awaitRfidForForm) {
      setRfidCapture(raw);
      setAwaitRfidForForm(false);
      return;
    }
    void lookupKey(raw);
  }, [lastResult, awaitRfidForForm, lookupKey]);

  useEffect(() => {
    const q = searchValue.trim();
    if (q.length < MIN_SEARCH) {
      setSearchOptions([]);
      return;
    }
    const seq = ++searchSeq.current;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const members = await searchPennuengMembersBriefApi(q);
        if (seq !== searchSeq.current) return;
        setSearchOptions(
          members.map((m) => ({
            value: m.memberNo,
            label: `${m.name} ${m.surname} · ${m.memberNo}`,
          })),
        );
      } catch {
        if (seq === searchSeq.current) setSearchOptions([]);
      } finally {
        if (seq === searchSeq.current) setSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const err = lastResult?.error ?? '';
  const showError =
    Boolean(lastResult && !lastResult.success && err && !isRfidNoCardError(err)) &&
    (!hasReader || !err.includes('not found'));

  const pennMember: PennuengMember | null = keyRow
    ? {
        memberNo: keyRow.memberNo,
        memberType: keyRow.memberType,
        memberTypeLabel: keyRow.memberTypeLabel,
        groupCode: null,
        departmentCode: null,
        prenameCode: null,
        name: keyRow.name,
        surname: keyRow.surname,
        sex: null,
        address: null,
        tel: null,
        email: null,
        birthDate: null,
        personId: null,
        memberDate: null,
        expireDate: keyRow.expireDate,
        memberStatus: 1,
        description: null,
      }
    : selectedMember;

  return (
    <Stack gap="md">
      <Card
        withBorder
        radius="md"
        p={0}
        style={{ overflow: 'hidden', cursor: isScanning ? 'default' : 'pointer' }}
        onClick={() => {
          if (!isScanning && !autoScan) void doScan();
        }}
      >
        <Paper p="xl" radius={0} bg="var(--bg-secondary)">
          <Stack align="center" gap="md">
            <ThemeIcon size={80} radius="xl" variant="light" color="teal">
              {isScanning ? (
                <Loader color="green" size={32} type="dots" />
              ) : (
                <IconAntenna size={40} stroke={1.5} />
              )}
            </ThemeIcon>
            <Text fw={700} size="lg" ta="center">
              {isScanning ? t('rfidScanning') : t('rfidPlaceCard')}
            </Text>
          </Stack>
        </Paper>
      </Card>

      <Group grow>
        <Button
          variant={autoScan ? 'filled' : 'light'}
          color={autoScan ? 'orange' : 'green'}
          leftSection={autoScan ? <IconPlayerPause size={18} /> : <IconPlayerPlay size={18} />}
          onClick={() => setAutoScan(!autoScan)}
        >
          {autoScan ? t('rfidStopAuto') : t('rfidStartAuto')}
        </Button>
        <Button
          variant="light"
          leftSection={<IconRefresh size={18} />}
          onClick={() => void doScan()}
          loading={isScanning}
        >
          {t('rfidScanOnce')}
        </Button>
      </Group>

      {showError ? (
        <Alert color="orange" variant="light" title={t('rfidErrorTitle')}>
          {lastResult!.error}
        </Alert>
      ) : null}

      {keyLoading ? (
        <Group justify="center" py="md">
          <Loader size="sm" />
          <Text size="sm" c="dimmed">
            {t('pennKeyLookup')}
          </Text>
        </Group>
      ) : null}

      {keyRow && pennMember ? (
        <IdCardMemberFoundBanner
          member={pennMember}
          groupDetail={keyRow.groupDetail}
          issuing={issuing}
          qr={qr}
          onIssueQr={() => void issueTempQr(keyRow.memberNo)}
        />
      ) : null}

      {!keyLoading && !keyRow && lastResult?.success ? (
        <Alert color="orange" variant="light" title={t('pennKeyNotFound')}>
          {t('pennKeyNotFoundHint')}
        </Alert>
      ) : null}

      <Autocomplete
        label={t('pennMemberSearch')}
        placeholder={t('pennMemberSearchPlaceholder')}
        value={searchValue}
        onChange={setSearchValue}
        data={searchOptions}
        filter={({ options }) => options}
        rightSection={searching ? <Loader size={16} /> : null}
        onOptionSubmit={async (memberNo) => {
          const members = await searchPennuengMembersBriefApi(memberNo);
          const m = members.find((x) => x.memberNo === memberNo) ?? members[0] ?? null;
          setSelectedMember(m);
          setShowRegister(true);
          setSearchValue(m ? `${m.name} ${m.surname}` : memberNo);
        }}
      />

      {!showRegister && !keyRow ? (
        <Button
          variant="light"
          leftSection={<IconUserPlus size={18} />}
          onClick={() => setShowRegister(true)}
        >
          {t('pennShowRegister')}
        </Button>
      ) : null}

      {showRegister ? (
        <IdCardPennuengRegisterForm
          card={null}
          member={selectedMember}
          types={memberTypes}
          rfidCapture={rfidCapture}
          onRfidCaptureConsumed={() => setRfidCapture(null)}
        />
      ) : null}

      {lastResult?.success && (
        <Card withBorder radius="md" p="md">
          <Stack gap="xs">
            <Group gap="xs">
              <IconCheck size={16} color="green" />
              <Text fw={600} size="sm">
                UID: {formatUidHex(lastResult.uid_hex!)}
              </Text>
              <Button
                size="compact-xs"
                variant="light"
                leftSection={<IconCopy size={12} />}
                onClick={() => void handleCopy(lastResult.uid_decimal!, 'dec')}
              >
                {copied === 'dec' ? t('rfidCopied') : lastResult.uid_decimal}
              </Button>
            </Group>
            <Code block>{formatUidHex(lastResult.uid_hex!)}</Code>
          </Stack>
        </Card>
      )}

      {history.length > 0 && (
        <Card withBorder radius="md" p="md">
          <Text fw={600} size="sm" mb="sm">
            {t('rfidHistory')}
          </Text>
          <ScrollArea h={160}>
            <Stack gap="xs">
              {history.map((record) => (
                <Paper key={record.id} withBorder p="xs" radius="sm">
                  <Group justify="space-between" wrap="nowrap">
                    <Text size="xs" c="dimmed">
                      {record.timestamp}
                    </Text>
                    <Code>{formatUidHex(record.result.uid_hex!)}</Code>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </ScrollArea>
        </Card>
      )}
    </Stack>
  );
}
