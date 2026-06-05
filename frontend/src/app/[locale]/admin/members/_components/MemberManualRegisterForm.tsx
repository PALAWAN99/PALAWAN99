'use client';

import { Card, Stack, Group, Text, Divider, Button, TextInput, Select } from '@mantine/core';
import { IconUserPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export type ManualMemberData = {
  citizenId: string;
  prefixTh: string;
  prefixEn: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  birthDate: string;
  gender: string;
  address: string;
};

export type ManualMemberAdditional = {
  phone: string;
  email: string;
  school: string;
};

const PREFIX_MAP: Record<string, string> = {
  นาย: 'Mr.',
  นาง: 'Mrs.',
  นางสาว: 'Ms.',
  เด็กชาย: 'Master',
  เด็กหญิง: 'Miss',
};

export const EMPTY_MANUAL_MEMBER: ManualMemberData = {
  citizenId: '',
  prefixTh: '',
  prefixEn: '',
  firstNameTh: '',
  lastNameTh: '',
  firstNameEn: '',
  lastNameEn: '',
  birthDate: '',
  gender: '',
  address: '',
};

export const EMPTY_MANUAL_ADDITIONAL: ManualMemberAdditional = {
  phone: '',
  email: '',
  school: '',
};

interface MemberManualRegisterFormProps {
  manualData: ManualMemberData;
  setManualData: (data: ManualMemberData) => void;
  additionalData: ManualMemberAdditional;
  setAdditionalData: (data: ManualMemberAdditional) => void;
  onRegister: () => void;
  loading?: boolean;
}

export function MemberManualRegisterForm({
  manualData,
  setManualData,
  additionalData,
  setAdditionalData,
  onRegister,
  loading = false,
}: MemberManualRegisterFormProps) {
  const t = useTranslations('IdCard');
  const tm = useTranslations('Member');

  return (
    <Card withBorder radius="md" p="xl">
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={700}>{tm('manualTitle')}</Text>
          <Button
            size="md"
            variant="filled"
            color="green"
            leftSection={<IconUserPlus size={18} />}
            onClick={onRegister}
            loading={loading}
          >
            {t('btnRegister')}
          </Button>
        </Group>
        <Divider />

        <TextInput
          label={t('citizenId')}
          placeholder="x-xxxx-xxxxx-xx-x"
          value={manualData.citizenId}
          onChange={(e) => {
            const raw = e.target.value.replace(/-/g, '');
            const d = raw.slice(0, 13);
            let fmt = d;
            if (d.length > 1) fmt = `${d[0]}-${d.slice(1)}`;
            if (d.length > 5) fmt = `${d[0]}-${d.slice(1, 5)}-${d.slice(5)}`;
            if (d.length > 10) fmt = `${d[0]}-${d.slice(1, 5)}-${d.slice(5, 10)}-${d.slice(10)}`;
            if (d.length > 12) {
              fmt = `${d[0]}-${d.slice(1, 5)}-${d.slice(5, 10)}-${d.slice(10, 12)}-${d.slice(12)}`;
            }
            setManualData({ ...manualData, citizenId: fmt });
          }}
          maxLength={17}
        />

        <Group grow>
          <Select
            label={t('prefixTh')}
            placeholder="Select"
            data={['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง']}
            style={{ flex: '0 0 120px' }}
            value={manualData.prefixTh}
            onChange={(val) => {
              const en = val ? PREFIX_MAP[val] : '';
              setManualData({
                ...manualData,
                prefixTh: val || '',
                prefixEn: en || manualData.prefixEn,
              });
            }}
          />
          <TextInput
            label={t('firstNameTh')}
            placeholder="First Name"
            value={manualData.firstNameTh}
            onChange={(e) => setManualData({ ...manualData, firstNameTh: e.target.value })}
          />
          <TextInput
            label={t('lastNameTh')}
            placeholder="Last Name"
            value={manualData.lastNameTh}
            onChange={(e) => setManualData({ ...manualData, lastNameTh: e.target.value })}
          />
        </Group>

        <Group grow>
          <Select
            label={t('prefixEn')}
            placeholder="Select"
            data={['Mr.', 'Mrs.', 'Ms.', 'Master', 'Miss']}
            style={{ flex: '0 0 120px' }}
            value={manualData.prefixEn}
            onChange={(val) => setManualData({ ...manualData, prefixEn: val || '' })}
          />
          <TextInput
            label={t('firstNameEn')}
            placeholder="First Name"
            value={manualData.firstNameEn}
            onChange={(e) => setManualData({ ...manualData, firstNameEn: e.target.value })}
          />
          <TextInput
            label={t('lastNameEn')}
            placeholder="Last Name"
            value={manualData.lastNameEn}
            onChange={(e) => setManualData({ ...manualData, lastNameEn: e.target.value })}
          />
        </Group>

        <Group grow>
          <TextInput
            label={t('birthDate')}
            placeholder="e.g. 15/04/2538"
            value={manualData.birthDate}
            onChange={(e) => {
              const raw = e.target.value.replace(/\//g, '');
              const d = raw.slice(0, 8);
              let fmt = d;
              if (d.length > 2) fmt = `${d.slice(0, 2)}/${d.slice(2)}`;
              if (d.length > 4) fmt = `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
              setManualData({ ...manualData, birthDate: fmt });
            }}
            maxLength={10}
          />
          <Select
            label={t('gender')}
            placeholder="Select"
            data={['ชาย', 'หญิง']}
            value={manualData.gender}
            onChange={(val) => setManualData({ ...manualData, gender: val || '' })}
          />
        </Group>

        <TextInput
          label={t('address')}
          placeholder="Full Address"
          value={manualData.address}
          onChange={(e) => setManualData({ ...manualData, address: e.target.value })}
        />

        <Divider my="sm" />
        <Text fw={600} size="sm">
          {t('additionalInfo')}
        </Text>

        <Group grow>
          <TextInput
            label={t('phone')}
            placeholder="08X-XXX-XXXX"
            value={additionalData.phone}
            onChange={(e) => {
              const raw = e.target.value.replace(/-/g, '');
              const d = raw.slice(0, 10);
              let fmt = d;
              if (d.length > 3) fmt = `${d.slice(0, 3)}-${d.slice(3)}`;
              if (d.length > 6) fmt = `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
              setAdditionalData({ ...additionalData, phone: fmt });
            }}
            maxLength={12}
          />
          <TextInput
            label={t('email')}
            placeholder="example@mail.com"
            value={additionalData.email}
            onChange={(e) => setAdditionalData({ ...additionalData, email: e.target.value })}
          />
        </Group>

        <TextInput
          label={t('school')}
          placeholder="School / University name..."
          value={additionalData.school}
          onChange={(e) => setAdditionalData({ ...additionalData, school: e.target.value })}
        />
      </Stack>
    </Card>
  );
}
