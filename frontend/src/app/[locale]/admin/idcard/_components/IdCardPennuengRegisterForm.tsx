'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCash, IconQrcode, IconUserPlus, IconSend } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { QRCodeCanvas } from 'qrcode.react';
import { apiPath } from '@/lib/base-path';
import type { ThaiIdData } from '@/lib/idcard/reader';
import {
  groupDetailForMemberType,
  isExternalPennuengGroup,
} from '@/lib/pennueng-member-groups';
import type { PennuengMember, PennuengMemberTypeOption } from '@/types/pennueng-member';
import {
  registerPennuengFromIdCardApi,
  issueTempQrApi,
  fetchDefaultQrPolicyIdApi,
} from '../lib/idcard-pennueng-api';

type FormValues = {
  memberNo: string;
  memberType: string;
  name: string;
  surname: string;
  personId: string;
  address: string;
  tel: string;
  email: string;
  sex: string;
  description: string;
  accessKey: string;
  keyExpireDate: string;
};

function cardToForm(
  card: ThaiIdData | null,
  member?: PennuengMember | null,
  rfidCapture?: string | null
): Partial<FormValues> {
  const citizenDigits = card?.citizenId?.replace(/\D/g, '') ?? '';
  const parts = card?.fullNameTh?.split(/\s+/).filter(Boolean) ?? [];

  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  const defaultExpireStr = oneYearFromNow.toISOString().split('T')[0];

  return {
    memberNo: member?.memberNo ?? citizenDigits,
    memberType: member?.memberType ?? '',
    name: member?.name ?? parts[1] ?? parts[0] ?? '',
    surname: member?.surname ?? parts.slice(2).join(' ') ?? parts.slice(1).join(' ') ?? '',
    personId: member?.personId ?? citizenDigits,
    address: member?.address ?? card?.address ?? '',
    tel: member?.tel ?? '',
    email: member?.email ?? '',
    sex: member?.sex ?? card?.gender ?? '',
    description: member?.description ?? '',
    accessKey: rfidCapture ?? '',
    keyExpireDate: defaultExpireStr,
  };
}

type Props = {
  card: ThaiIdData | null;
  member?: PennuengMember | null;
  types: PennuengMemberTypeOption[];
  rfidCapture?: string | null;
  onRfidCaptureConsumed?: () => void;
  onSuccess?: () => void;
};

export function IdCardPennuengRegisterForm({
  card,
  member,
  types,
  rfidCapture,
  onRfidCaptureConsumed,
  onSuccess,
}: Props) {
  const t = useTranslations('IdCard');
  const tp = useTranslations('PennuengMember');
  const tc = useTranslations('Common');

  const [submitting, setSubmitting] = useState(false);
  const [qr, setQr] = useState<{ qrContent: string; expiresAt: string } | null>(null);
  const [awaitRfid, setAwaitRfid] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      memberNo: '',
      memberType: '',
      name: '',
      surname: '',
      personId: '',
      address: '',
      tel: '',
      email: '',
      sex: '',
      description: '',
      accessKey: '',
      keyExpireDate: '',
    },
  });

  useEffect(() => {
    form.setValues((prev) => ({ ...prev, ...cardToForm(card, member, rfidCapture) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, member, rfidCapture]);

  useEffect(() => {
    if (rfidCapture && awaitRfid) {
      form.setFieldValue('accessKey', rfidCapture);
      setAwaitRfid(false);
      onRfidCaptureConsumed?.();
    }
  }, [rfidCapture, awaitRfid, form, onRfidCaptureConsumed]);

  const selectedGroup = useMemo(
    () => groupDetailForMemberType(types, form.values.memberType),
    [types, form.values.memberType],
  );
  const isExternal = isExternalPennuengGroup(selectedGroup);

  const typeOptions = types.map((opt) => ({
    value: opt.memberType,
    label: opt.description ? `${opt.memberType} — ${opt.description}` : opt.memberType,
  }));

  const runAfterRegister = async (memberNo: string) => {
    const policyId = await fetchDefaultQrPolicyIdApi();
    const data = await issueTempQrApi({ memberNo, policyId });
    setQr(data);
  };

  const submitRegister = async (options: { thenQr: boolean; payFlow?: boolean }) => {
    setSubmitting(true);
    setQr(null);
    try {
      const v = form.values;
      const result = await registerPennuengFromIdCardApi({
        memberNo: v.memberNo.trim(),
        memberType: v.memberType,
        name: v.name.trim(),
        surname: v.surname.trim(),
        personId: v.personId || null,
        address: v.address || null,
        tel: v.tel || null,
        email: v.email || null,
        sex: v.sex || null,
        description: v.description || null,
        accessKey: v.accessKey.trim() || null,
        keyExpireDate: v.keyExpireDate.trim() || null,
      });

      if (options.payFlow) {
        notifications.show({
          title: t('pennPayRecorded'),
          message: t('pennPayHint'),
          color: 'blue',
        });
      }

      notifications.show({
        title: tc('success'),
        message: tp('createSuccess'),
        color: 'teal',
      });

      if (options.thenQr) {
        await runAfterRegister(result.member.memberNo);
      }

      onSuccess?.();
    } catch (e) {
      notifications.show({
        title: tc('error'),
        message: e instanceof Error ? e.message : tc('error'),
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const issueQrOnly = async () => {
    const memberNo = form.values.memberNo.trim();
    if (!memberNo) return;
    setSubmitting(true);
    setQr(null);
    try {
      await runAfterRegister(memberNo);
    } catch (e) {
      notifications.show({
        title: tc('error'),
        message: e instanceof Error ? e.message : tc('error'),
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const [emailSending, setEmailSending] = useState(false);

  const handleSendEmail = async () => {
    const email = form.values.email.trim();
    if (!email) {
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
      const canvas = document.getElementById('register-qr-canvas') as HTMLCanvasElement;
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
          email,
          memberName: `${form.values.name} ${form.values.surname}`.trim(),
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

  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="sm">
        <Text fw={700}>{tp('addTitle')}</Text>

        <TextInput label={tp('memberNo')} required {...form.getInputProps('memberNo')} />
        <Select
          label={tp('memberType')}
          required
          searchable
          data={typeOptions}
          {...form.getInputProps('memberType')}
        />
        <Group grow>
          <TextInput label={tp('name')} required {...form.getInputProps('name')} />
          <TextInput label={tp('surname')} required {...form.getInputProps('surname')} />
        </Group>
        <Group grow>
          <TextInput
            label={t('phone')}
            placeholder="08X-XXX-XXXX"
            {...form.getInputProps('tel')}
            onChange={(e) => {
              const raw = e.target.value.replace(/-/g, '');
              const d = raw.slice(0, 10);
              let fmt = d;
              if (d.length > 3) fmt = `${d.slice(0, 3)}-${d.slice(3)}`;
              if (d.length > 6) {
                fmt = `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
              }
              form.setFieldValue('tel', fmt);
            }}
            maxLength={12}
          />
          <TextInput label={t('email')} placeholder="example@mail.com" {...form.getInputProps('email')} />
        </Group>
        <TextInput
          label={t('school')}
          placeholder="School / University name..."
          {...form.getInputProps('description')}
        />

        <Text fw={600} size="sm" mt="xs">
          {t('accessKeySection')}
        </Text>
        <Group grow align="flex-end">
          <TextInput
            label={t('accessKeyLabel')}
            description={awaitRfid ? t('accessKeyAwaitRfid') : t('accessKeyHint')}
            ff="monospace"
            {...form.getInputProps('accessKey')}
          />
          <Button
            variant={awaitRfid ? 'filled' : 'light'}
            color="violet"
            onClick={() => setAwaitRfid(true)}
          >
            {t('accessKeyTapRfid')}
          </Button>
        </Group>

        <Group grow mt="md">
          <Button
            color="skyBlue"
            leftSection={<IconUserPlus size={18} />}
            loading={submitting}
            onClick={() => void submitRegister({ thenQr: false })}
          >
            {tp('create')}
          </Button>
          {isExternal ? (
            <Button
              color="orange"
              leftSection={<IconCash size={18} />}
              loading={submitting}
              onClick={() => void submitRegister({ thenQr: true, payFlow: true })}
            >
              {t('pennPayAndQr')}
            </Button>
          ) : (
            <Button
              color="teal"
              leftSection={<IconQrcode size={18} />}
              loading={submitting}
              onClick={() => void submitRegister({ thenQr: true })}
            >
              {t('pennRegisterAndTempQr')}
            </Button>
          )}
        </Group>

        {member ? (
          <Button variant="light" loading={submitting} onClick={() => void issueQrOnly()}>
            {t('pennIssueTempQr')}
          </Button>
        ) : null}

        {qr ? (
          <Stack align="center" gap="xs" py="sm">
            <QRCodeCanvas id="register-qr-canvas" value={qr.qrContent} size={140} includeMargin level="H" />
            <Text size="xs" c="green">
              {t('pennQrUntil', { date: new Date(qr.expiresAt).toLocaleString('th-TH') })}
            </Text>
            <Button
              size="xs"
              color="blue"
              leftSection={<IconSend size={12} />}
              loading={emailSending}
              onClick={handleSendEmail}
              w="100%"
              maw={240}
              mt="xs"
            >
              {t('sendEmailButton')}
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}
