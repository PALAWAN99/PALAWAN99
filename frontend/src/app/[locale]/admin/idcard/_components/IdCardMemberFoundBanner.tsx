'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Stack, Text, TextInput, Paper } from '@mantine/core';
import { IconQrcode, IconUserCheck, IconMail, IconSend } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { QRCodeCanvas } from 'qrcode.react';
import type { PennuengMember } from '@/types/pennueng-member';
import { notifications } from '@mantine/notifications';
import { apiPath } from '@/lib/base-path';

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
  const [emailValue, setEmailValue] = useState(member.email || '');
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    setEmailValue(member.email || '');
  }, [member.email]);

  const handleSendEmail = async () => {
    if (!emailValue.trim()) {
      notifications.show({
        title: 'คำเตือน',
        message: t('sendEmailRequired'),
        color: 'orange',
      });
      return;
    }
    if (!qr) return;

    setEmailSending(true);
    try {
      const canvas = document.getElementById('idcard-qr-canvas') as HTMLCanvasElement;
      if (!canvas) {
        notifications.show({
          title: 'ข้อผิดพลาด',
          message: t('sendEmailCanvasError'),
          color: 'red',
        });
        return;
      }
      const qrImageDataUrl = canvas.toDataURL('image/png');

      const res = await fetch(apiPath('/api/admin/qr/send-email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailValue.trim(),
          memberName: `${member.name} ${member.surname}`.trim(),
          qrImageDataUrl,
          expiresAt: qr.expiresAt,
          isTemporary: true,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        notifications.show({
          title: 'ข้อผิดพลาด',
          message: json.error || t('sendEmailFailed'),
          color: 'red',
        });
        return;
      }

      notifications.show({
        title: 'สำเร็จ',
        message: t('sendEmailSuccess'),
        color: 'green',
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'ข้อผิดพลาด',
        message: t('sendEmailFailed'),
        color: 'red',
      });
    } finally {
      setEmailSending(false);
    }
  };

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
          <QRCodeCanvas id="idcard-qr-canvas" value={qr.qrContent} size={160} includeMargin level="H" />
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

          <Paper withBorder p="sm" radius="md" w="100%" maw={320} mt="xs" bg="var(--bg-secondary)">
            <Stack gap="xs">
              <TextInput
                label={t('sendEmailLabel')}
                placeholder={t('sendEmailPlaceholder')}
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                leftSection={<IconMail size={16} />}
              />
              <Button
                size="sm"
                color="blue"
                leftSection={<IconSend size={14} />}
                loading={emailSending}
                onClick={handleSendEmail}
                fullWidth
              >
                {t('sendEmailButton')}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      ) : null}
    </Stack>
  );
}
