'use client';

import { useEffect } from 'react';
import {
  Modal,
  Stack,
  TextInput,
  Select,
  Button,
  Group,
  Text,
  Textarea,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import {
  gateHistoryRecordSchema,
  type GateHistoryRecordInput,
} from '@/validators/gateHistoryRecordValidator';
import type { PennuengGateHistoryRow } from '@/types/pennueng-gate-history';
import type { ReportGateOption } from '@/types/reports-analytics';

type FormMode = 'create' | 'edit' | 'copy';

type Props = {
  opened: boolean;
  mode: FormMode;
  recordId: number | null;
  initialRow: PennuengGateHistoryRow | null;
  gates: ReportGateOption[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: GateHistoryRecordInput) => Promise<void>;
};

const EMPTY: GateHistoryRecordInput = {
  operateDate: new Date().toISOString(),
  direction: 'IN',
  decision: 'ALLOWED',
  gateId: '',
  memberNo: '',
  memberKey: '',
  memberType: '',
  name: '',
  surname: '',
  personId: '',
  remark: '',
};

function rowToForm(row: PennuengGateHistoryRow, copy: boolean): GateHistoryRecordInput {
  return {
    operateDate: copy ? new Date().toISOString() : row.scannedAt,
    direction: row.direction,
    decision: row.decision,
    gateId: row.gateId,
    memberNo: row.memberNo ?? '',
    memberKey: row.memberKey ?? '',
    memberType: row.memberType ?? '',
    name: row.firstName === '—' ? '' : row.firstName,
    surname: row.lastName ?? '',
    personId: row.personId ?? '',
    remark: row.remark ?? '',
  };
}

export function GateHistoryRecordFormModal({
  opened,
  mode,
  recordId,
  initialRow,
  gates,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const t = useTranslations('History');
  const tc = useTranslations('Common');

  const form = useForm<GateHistoryRecordInput>({
    initialValues: EMPTY,
    validate: zodResolver(gateHistoryRecordSchema),
  });

  useEffect(() => {
    if (!opened) return;
    if (initialRow && (mode === 'edit' || mode === 'copy')) {
      form.setValues(rowToForm(initialRow, mode === 'copy'));
    } else {
      form.setValues({
        ...EMPTY,
        operateDate: new Date().toISOString(),
      });
    }
    form.resetDirty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, initialRow, mode]);

  const gateOptions = gates.map((g) => ({ value: g.id, label: g.label }));

  const title =
    mode === 'edit'
      ? t('editRecordTitle', { id: recordId ?? '' })
      : mode === 'copy'
        ? t('copyRecordTitle')
        : t('addRecordTitle');

  return (
    <Modal opened={opened} onClose={onClose} title={<Text fw={700}>{title}</Text>} size="lg" radius="md">
      <form
        onSubmit={form.onSubmit((values) => {
          void onSubmit({
            ...values,
            memberNo: values.memberNo?.trim() || null,
            memberKey: values.memberKey?.trim() || null,
            memberType: values.memberType?.trim() || null,
            surname: values.surname?.trim() || null,
            personId: values.personId?.trim() || null,
            remark: values.remark?.trim() || null,
          });
        })}
      >
        <Stack gap="sm">
          <DateTimePicker
            label={t('scannedAt')}
            value={form.values.operateDate ? new Date(form.values.operateDate) : null}
            onChange={(value) =>
              form.setFieldValue('operateDate', value ? dayjs(value).toISOString() : '')
            }
            valueFormat="DD/MM/YYYY HH:mm"
            required
          />
          <Group grow>
            <Select
              label={t('direction')}
              data={[
                { value: 'IN', label: t('directionIn') },
                { value: 'OUT', label: t('directionOut') },
              ]}
              {...form.getInputProps('direction')}
            />
            <Select
              label={t('decision')}
              data={[
                { value: 'ALLOWED', label: t('allowed') },
                { value: 'DENIED', label: t('denied') },
              ]}
              {...form.getInputProps('decision')}
            />
          </Group>
          <Select
            label={t('gate')}
            data={gateOptions}
            searchable
            required
            {...form.getInputProps('gateId')}
          />
          <Group grow>
            <TextInput label={t('memberNo')} {...form.getInputProps('memberNo')} />
            <TextInput label={t('personId')} {...form.getInputProps('personId')} />
          </Group>
          <Group grow>
            <TextInput label={t('nameField')} required {...form.getInputProps('name')} />
            <TextInput label={t('surnameField')} {...form.getInputProps('surname')} />
          </Group>
          <Group grow>
            <TextInput label={t('memberKey')} {...form.getInputProps('memberKey')} />
            <TextInput label={t('memberType')} {...form.getInputProps('memberType')} />
          </Group>
          <Textarea label={t('remark')} minRows={2} {...form.getInputProps('remark')} />
          {mode === 'copy' ? (
            <Text size="xs" c="dimmed">
              {t('copyRecordHint')}
            </Text>
          ) : null}
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={onClose}>
              {tc('cancel')}
            </Button>
            <Button type="submit" color="skyBlue" loading={loading}>
              {mode === 'edit' ? tc('save') : t('addRecordButton')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
