'use client';

import { useEffect } from 'react';
import { Modal, Stack, TextInput, Select, Button, Group, Text, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useTranslations } from 'next-intl';
import {
  pennuengMemberSchema,
  type PennuengMemberInput,
} from '@/validators/pennuengMemberValidator';
import type { PennuengMember, PennuengMemberTypeOption } from '@/types/pennueng-member';

type FormValues = PennuengMemberInput;

const EMPTY: FormValues = {
  memberNo: '',
  memberType: '',
  name: '',
  surname: '',
  groupCode: '',
  departmentCode: '',
  prenameCode: '',
  sex: '',
  address: '',
  tel: '',
  email: '',
  personId: '',
  description: '',
};

interface Props {
  opened: boolean;
  isEdit: boolean;
  memberNo: string | null;
  initial: PennuengMember | null;
  types: PennuengMemberTypeOption[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
}

export function PennuengMemberFormModal({
  opened,
  isEdit,
  memberNo,
  initial,
  types,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const t = useTranslations('PennuengMember');
  const tc = useTranslations('Common');

  const form = useForm<FormValues>({
    initialValues: EMPTY,
    validate: zodResolver(pennuengMemberSchema),
  });

  useEffect(() => {
    if (!opened) return;
    if (initial) {
      form.setValues({
        memberNo: initial.memberNo,
        memberType: initial.memberType,
        name: initial.name,
        surname: initial.surname,
        groupCode: initial.groupCode ?? '',
        departmentCode: initial.departmentCode ?? '',
        prenameCode: initial.prenameCode ?? '',
        sex: initial.sex ?? '',
        address: initial.address ?? '',
        tel: initial.tel ?? '',
        email: initial.email ?? '',
        personId: initial.personId ?? '',
        description: initial.description ?? '',
      });
    } else {
      form.setValues(EMPTY);
    }
    form.resetDirty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, initial]);

  const typeOptions = types.map((opt) => ({
    value: opt.memberType,
    label: opt.description ? `${opt.memberType} — ${opt.description}` : opt.memberType,
  }));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={700}>{isEdit ? t('editTitle') : t('addTitle')}</Text>}
      size="lg"
      radius="md"
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput
            label={t('memberNo')}
            required
            disabled={isEdit}
            {...form.getInputProps('memberNo')}
          />
          <Select
            label={t('memberType')}
            required
            searchable
            data={typeOptions}
            {...form.getInputProps('memberType')}
          />
          <Group grow>
            <TextInput label={t('name')} required {...form.getInputProps('name')} />
            <TextInput label={t('surname')} required {...form.getInputProps('surname')} />
          </Group>
          <Group grow>
            <TextInput label={t('personId')} {...form.getInputProps('personId')} />
            <TextInput label={t('tel')} {...form.getInputProps('tel')} />
          </Group>
          <TextInput label={t('email')} {...form.getInputProps('email')} />
          <Textarea label={t('address')} minRows={2} {...form.getInputProps('address')} />
          <Textarea label={t('description')} minRows={2} {...form.getInputProps('description')} />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={onClose}>
              {tc('cancel')}
            </Button>
            <Button type="submit" color="skyBlue" loading={loading}>
              {isEdit ? tc('save') : t('create')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
