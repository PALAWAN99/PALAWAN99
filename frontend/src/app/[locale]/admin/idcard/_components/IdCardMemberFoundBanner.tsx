'use client';

import { Alert, Button, Stack, Text } from '@mantine/core';
import { IconQrcode, IconUserCheck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { QRCodeSVG } from 'qrcode.react';
import type { PennuengMember } from '@/types/pennueng-member';

type Props = {
  member: PennuengMember;
  groupDetail: string | null;
  issuing: boolean;
  qr: { qrContent: string; expiresAt: string; memberKey?: string } | null;
  onIssueQr: () => void;
};

export function IdCardMemberFoundBanner({
  member,
  groupDetail,
  issuing,
  qr,
  onIssueQr,
}: Props) {
  const t = useTranslations('IdCard');

  const typeLabel = member.memberTypeLabel
    ? `${member.memberType} — ${member.memberTypeLabel}`
    : member.memberType;

  return (
    <Stack gap="md">
      <Alert
        color="green"
        variant="filled"
        radius="md"
        title={
          <Text fw={800} size="lg">
            {t('pennMemberFoundTitle')}
          </Text>
        }
        icon={<IconUserCheck size={28} />}
        styles={{
          root: { padding: '1.25rem 1.5rem' },
          title: { marginBottom: 4 },
        }}
      >
        <Text size="md" fw={600}>
          {t('pennMemberFoundBody', {
            name: `${member.name} ${member.surname}`.trim(),
            memberNo: member.memberNo,
            memberType: typeLabel,
          })}
        </Text>
        {groupDetail ? (
          <Text size="sm" mt={4} opacity={0.95}>
            {t('pennMemberGroup')}: {groupDetail}
          </Text>
        ) : null}
      </Alert>

      <Button
        size="lg"
        color="teal"
        leftSection={<IconQrcode size={20} />}
        loading={issuing}
        onClick={onIssueQr}
      >
        {t('pennIssueTempQr')}
      </Button>

      {qr ? (
        <Stack align="center" gap="xs" py="sm">
          <QRCodeSVG value={qr.qrContent} size={160} includeMargin level="H" />
          {qr.memberKey ? (
            <Text size="xs" c="dimmed" ff="monospace">
              {qr.memberKey}
            </Text>
          ) : null}
          <Text size="sm" c="green" fw={500}>
            {t('pennQrUntil', {
              date: new Date(qr.expiresAt).toLocaleString('th-TH'),
            })}
          </Text>
        </Stack>
      ) : null}
    </Stack>
  );
}
