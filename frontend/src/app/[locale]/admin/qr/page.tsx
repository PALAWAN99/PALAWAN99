'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  Title,
  Text,
  Stack,
  Group,
  Button,
  Card,
  Tabs,
  Table,
  Badge,
  ActionIcon,
  Modal,
  TextInput,
  NumberInput,
  Select,
  Switch,
  Center,
  Paper,
  SimpleGrid,
  Divider,
  Autocomplete,
  Loader,
  Alert,
} from '@mantine/core';
import {
  IconQrcode,
  IconSettings,
  IconPlus,
  IconEdit,
  IconTrash,
  IconUserCheck,
  IconClock,
  IconRepeat,
  IconMail,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage, unwrapApiData } from '@/lib/parse-api-response';
import {
  formatTtl,
  decodeTtlSeconds,
  encodeTtlToSeconds,
  TtlUnit,
} from '@/lib/qr-policy-ttl';

type QrMemberRow = {
  id: string;
  memberNo: string;
  firstNameTh: string;
  lastNameTh: string;
  status: string;
  memberTypeLabel?: string | null;
  email?: string | null;
};

type AutocompleteOption = { value: string; label: string };

const MIN_SEARCH_CHARS = 3;
const SEARCH_DEBOUNCE_MS = 320;

export default function QRManagementPage() {
  const t = useTranslations();
  const [policies, setPolicies] = useState<Record<string, unknown>[]>([]);
  const [policiesLoading, setPoliciesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>('issue');

  const [searchValue, setSearchValue] = useState('');
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutocompleteOption[]>([]);
  const [searching, setSearching] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [memberData, setMemberData] = useState<QrMemberRow | null>(null);
  const [generatedQR, setGeneratedQR] = useState<{
    qrContent: string;
    expiresAt: string;
    temporary?: boolean;
    memberKey?: string;
  } | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);

  const searchAbortRef = useRef<AbortController | null>(null);

  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Record<string, unknown> | null>(null);
  const [deletingPolicy, setDeletingPolicy] = useState<Record<string, unknown> | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [emailSending, setEmailSending] = useState(false);

  const policyForm = useForm({
    initialValues: {
      name: '',
      ttlValue: 24,
      ttlUnit: 'hour' as TtlUnit,
      oneTimeUse: false,
      maxUsesPerDay: 10,
      isDefault: false,
    },
  });

  const fetchPolicies = async () => {
    setPoliciesLoading(true);
    try {
      const res = await fetch(apiPath('/api/admin/qr-policies'));
      if (!res.ok) {
        setPolicies([]);
        return;
      }
      const data = await res.json();
      setPolicies(Array.isArray(data) ? data : []);
    } catch {
      notifications.show({ title: 'Error', message: 'Failed to fetch policies', color: 'red' });
    } finally {
      setPoliciesLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    if (!policies.length || selectedPolicyId) return;
    const def =
      policies.find((p) => p.isDefault) ?? policies[0];
    if (def?.id) setSelectedPolicyId(String(def.id));
  }, [policies, selectedPolicyId]);

  const resolveMember = useCallback(async (memberNo: string) => {
    const key = memberNo.trim();
    if (!key) return;

    setResolving(true);
    setMemberData(null);
    setGeneratedQR(null);
    try {
      const res = await fetch(
        apiPath(`/api/qr/member-search?memberNo=${encodeURIComponent(key)}`),
      );
      const json = await res.json();
      if (!res.ok) {
        notifications.show({
          message: getApiErrorMessage(json) || t('Qr.memberNotFound'),
          color: 'orange',
        });
        return;
      }
      const data = unwrapApiData<{ member: QrMemberRow }>(json);
      setMemberData(data.member);
      setSearchValue(data.member.memberNo);
      setEmailValue(data.member.email ?? '');
    } catch {
      notifications.show({ title: 'Error', message: t('Qr.searchFailed'), color: 'red' });
    } finally {
      setResolving(false);
    }
  }, [t]);

  useEffect(() => {
    const q = searchValue.trim();
    if (q.length < MIN_SEARCH_CHARS) {
      setAutocompleteOptions([]);
      setSearching(false);
      searchAbortRef.current?.abort();
      return;
    }

    const timer = setTimeout(async () => {
      searchAbortRef.current?.abort();
      const controller = new AbortController();
      searchAbortRef.current = controller;
      setSearching(true);
      try {
        const res = await fetch(
          apiPath(`/api/qr/member-search?q=${encodeURIComponent(q)}`),
          { signal: controller.signal },
        );
        const json = await res.json();
        if (!res.ok) {
          const msg = getApiErrorMessage(json);
          if (msg) {
            notifications.show({ message: msg, color: 'orange' });
          }
          setAutocompleteOptions([]);
          return;
        }
        const data = unwrapApiData<{
          suggestions: { memberNo: string; label: string }[];
        }>(json);
        setAutocompleteOptions(
          data.suggestions.map((s) => ({ value: s.memberNo, label: s.label })),
        );
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setAutocompleteOptions([]);
      } finally {
        setSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      searchAbortRef.current?.abort();
    };
  }, [searchValue]);

  const handleIssueQR = async (temporary: boolean) => {
    if (!memberData) return;
    setIssuing(true);
    setGeneratedQR(null);
    try {
      const res = await fetch(apiPath('/api/qr/issue'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: memberData.id,
          memberNo: memberData.memberNo,
          purpose: 'ENTRY',
          policyId: selectedPolicyId,
          temporary,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        notifications.show({
          title: 'Error',
          message: getApiErrorMessage(json) || t('Qr.issueFailed'),
          color: 'red',
        });
        return;
      }
      const data = unwrapApiData<{
        qrContent: string;
        expiresAt: string;
        temporary?: boolean;
        memberKey?: string;
      }>(json);
      setGeneratedQR(data);
      notifications.show({
        title: t('Common.success'),
        message: temporary ? t('Qr.issueTempSuccess') : t('Qr.issueSuccess'),
        color: 'green',
      });
    } catch {
      notifications.show({ title: 'Error', message: t('Qr.issueFailed'), color: 'red' });
    } finally {
      setIssuing(false);
    }
  };

  const handleSavePolicy = async (values: typeof policyForm.values) => {
    const method = editingPolicy ? 'PATCH' : 'POST';
    const { ttlValue, ttlUnit, ...rest } = values;
    const payload = {
      ...rest,
      ttlSeconds: encodeTtlToSeconds(ttlValue, ttlUnit),
    };
    try {
      const res = await fetch(apiPath('/api/admin/qr-policies'), {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          editingPolicy ? { ...payload, id: editingPolicy.id } : payload,
        ),
      });
      if (res.ok) {
        notifications.show({ title: 'Success', message: 'Policy saved', color: 'green' });
        setPolicyModalOpen(false);
        fetchPolicies();
      }
    } catch {
      notifications.show({ title: 'Error', message: 'Save failed', color: 'red' });
    }
  };

  const handleDeletePolicy = async () => {
    if (!deletingPolicy) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(apiPath(`/api/admin/qr-policies?id=${deletingPolicy.id}`), {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok) {
        notifications.show({
          title: t('Common.error'),
          message: getApiErrorMessage(json) || t('Qr.deletePolicyFailed'),
          color: 'red',
        });
        return;
      }
      notifications.show({ title: t('Common.success'), message: t('Qr.deletePolicySuccess'), color: 'green' });
      setDeletingPolicy(null);
      fetchPolicies();
    } catch {
      notifications.show({ title: t('Common.error'), message: t('Qr.deletePolicyFailed'), color: 'red' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailValue.trim()) {
      notifications.show({
        message: t('Qr.emailRequired'),
        color: 'orange',
      });
      return;
    }
    if (!generatedQR || !memberData) return;

    setEmailSending(true);
    try {
      const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
      if (!canvas) {
        notifications.show({
          title: t('Common.error'),
          message: 'QR Code canvas not found',
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
          memberName: `${memberData.firstNameTh} ${memberData.lastNameTh}`,
          qrImageDataUrl,
          expiresAt: generatedQR.expiresAt,
          isTemporary: generatedQR.temporary,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        notifications.show({
          title: t('Common.error'),
          message: getApiErrorMessage(json) || t('Qr.sendEmailFailed'),
          color: 'red',
        });
        return;
      }

      notifications.show({
        title: t('Common.success'),
        message: t('Qr.sendEmailSuccess'),
        color: 'green',
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: t('Common.error'),
        message: t('Qr.sendEmailFailed'),
        color: 'red',
      });
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>{t('Common.qr')}</Title>
          <Text size="sm" c="dimmed">
            {t('Qr.pageSubtitle')}
          </Text>
        </div>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
        <Tabs.List>
          <Tabs.Tab value="issue" leftSection={<IconQrcode size={16} />}>
            {t('Qr.issueTab')}
          </Tabs.Tab>
          <Tabs.Tab value="policies" leftSection={<IconSettings size={16} />}>
            {t('Qr.policiesTab')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="issue" pt="lg">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Card withBorder radius="md">
              <Title order={4} mb="md">
                {t('Qr.issueCardTitle')}
              </Title>
              <Stack gap="md">
                <Autocomplete
                  label={t('Qr.memberSearchLabel')}
                  placeholder={t('Qr.memberSearchPlaceholder')}
                  value={searchValue}
                  onChange={(value) => {
                    setSearchValue(value);
                    if (!value) {
                      setMemberData(null);
                      setGeneratedQR(null);
                      setEmailValue('');
                    }
                  }}
                  data={autocompleteOptions}
                  filter={({ options }) => options}
                  limit={20}
                  rightSection={searching || resolving ? <Loader size={16} /> : null}
                  onOptionSubmit={(memberNo) => resolveMember(memberNo)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchValue.trim().length >= MIN_SEARCH_CHARS) {
                      e.preventDefault();
                      resolveMember(searchValue.trim());
                    }
                  }}
                  description={
                    searchValue.trim().length > 0 &&
                    searchValue.trim().length < MIN_SEARCH_CHARS
                      ? t('Qr.memberSearchMinChars')
                      : undefined
                  }
                />

                {memberData && (
                  <Paper withBorder p="md" bg="gray.0">
                    <Select
                      label={t('Qr.policySelectLabel')}
                      description={t('Qr.policySelectHint')}
                      data={policies.map((p) => ({
                        value: String(p.id),
                        label: `${String(p.name)} (${formatTtl(Number(p.ttlSeconds) || 0, t)})`,
                      }))}
                      value={selectedPolicyId}
                      onChange={(val) => setSelectedPolicyId(val)}
                      mb="sm"
                      disabled={policies.length === 0}
                      placeholder={t('Qr.policySelectEmpty')}
                    />
                    <Group justify="space-between" align="flex-start">
                      <div>
                        <Text fw={700}>
                          {memberData.firstNameTh} {memberData.lastNameTh}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {memberData.memberNo}
                          {memberData.memberTypeLabel
                            ? ` · ${memberData.memberTypeLabel}`
                            : ''}
                        </Text>
                      </div>
                      <Badge color={memberData.status === 'ACTIVE' ? 'green' : 'red'}>
                        {memberData.status}
                      </Badge>
                    </Group>
                    <Alert color="blue" variant="light" mt="sm">
                      {t('Qr.tempQrHint')}
                    </Alert>
                    <Stack gap="xs" mt="md">
                      <Button
                        fullWidth
                        leftSection={<IconQrcode size={18} />}
                        onClick={() => handleIssueQR(true)}
                        loading={issuing}
                      >
                        {t('Qr.generateTempButton')}
                      </Button>
                      {memberData.status === 'ACTIVE' ? (
                        <Button
                          fullWidth
                          variant="light"
                          leftSection={<IconUserCheck size={18} />}
                          onClick={() => handleIssueQR(false)}
                          loading={issuing}
                        >
                          {t('Qr.generateTokenButton')}
                        </Button>
                      ) : null}
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </Card>

            <Card withBorder radius="md">
              <Title order={4} mb="md">
                {t('Qr.previewTitle')}
              </Title>
              <Center mih={280}>
                {generatedQR ? (
                  <Stack align="center" gap="md" style={{ width: '100%', maxWidth: 320 }}>
                    <QRCodeCanvas
                      id="qr-code-canvas"
                      value={generatedQR.qrContent}
                      size={200}
                      includeMargin
                      level="H"
                    />
                    {generatedQR.temporary && generatedQR.memberKey ? (
                      <Text size="xs" c="dimmed" ta="center">
                        {t('Qr.memberKeyLabel')}: {generatedQR.memberKey}
                      </Text>
                    ) : null}
                    <Text size="sm" fw={500} c="green" ta="center">
                      {t('Qr.validUntil', {
                        date: new Date(generatedQR.expiresAt).toLocaleString('th-TH'),
                      })}
                    </Text>
                    {generatedQR.temporary ? (
                      <Badge color="orange" variant="light">
                        {t('Qr.tempBadge')}
                      </Badge>
                    ) : null}

                    <Divider my="xs" style={{ width: '100%' }} />

                    <Stack gap="xs" style={{ width: '100%' }}>
                      <TextInput
                        label={t('Qr.sendEmailLabel')}
                        placeholder="example@kku.ac.th"
                        value={emailValue}
                        onChange={(e) => setEmailValue(e.currentTarget.value)}
                        leftSection={<IconMail size={16} />}
                      />
                      <Button
                        loading={emailSending}
                        onClick={handleSendEmail}
                        variant="light"
                        fullWidth
                      >
                        {t('Qr.sendButton')}
                      </Button>
                    </Stack>

                    <Button variant="subtle" size="xs" onClick={() => window.print()}>
                      {t('Qr.printButton')}
                    </Button>
                  </Stack>
                ) : (
                  <Stack align="center" gap="xs" c="dimmed">
                    <IconQrcode size={64} stroke={1} />
                    <Text size="sm" ta="center">
                      {t('Qr.previewEmpty')}
                    </Text>
                  </Stack>
                )}
              </Center>
            </Card>
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="policies" pt="lg">
          <Card withBorder radius="md" p="0">
            <Group p="md" justify="space-between">
              <Text fw={700}>{t('Qr.policiesTitle')}</Text>
              <Button
                size="xs"
                leftSection={<IconPlus size={16} />}
                onClick={() => {
                  setEditingPolicy(null);
                  policyForm.reset();
                  setPolicyModalOpen(true);
                }}
              >
                {t('Qr.addPolicy')}
              </Button>
            </Group>
            <Divider />
            {policiesLoading ? (
              <Center py="xl">
                <Loader />
              </Center>
            ) : (
              <Table verticalSpacing="sm" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{t('Qr.policyName')}</Table.Th>
                    <Table.Th>{t('Qr.policyTtl')}</Table.Th>
                    <Table.Th>{t('Qr.policyOneTime')}</Table.Th>
                    <Table.Th>{t('Qr.policyDailyLimit')}</Table.Th>
                    <Table.Th>{t('Qr.policyDefault')}</Table.Th>
                    <Table.Th ta="right">{t('Common.actions')}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {policies.map((p) => (
                    <Table.Tr key={String(p.id)}>
                      <Table.Td>
                        <Text fw={500}>{String(p.name)}</Text>
                      </Table.Td>
                      <Table.Td>
                        {formatTtl(Number(p.ttlSeconds) || 0, t)}
                      </Table.Td>
                      <Table.Td>{p.oneTimeUse ? t('Qr.yes') : t('Qr.no')}</Table.Td>
                      <Table.Td>
                        {String(p.maxUsesPerDay)} {t('Qr.uses')}
                      </Table.Td>
                      <Table.Td>
                        {p.isDefault ? (
                          <Badge color="blue" size="sm">
                            {t('Qr.policyDefault')}
                          </Badge>
                        ) : null}
                      </Table.Td>
                      <Table.Td ta="right">
                        <Group gap={4} justify="flex-end">
                          <ActionIcon
                            variant="subtle"
                            onClick={() => {
                              setEditingPolicy(p);
                              const { value, unit } = decodeTtlSeconds(Number(p.ttlSeconds) || 86400);
                              policyForm.setValues({
                                name: String(p.name ?? ''),
                                ttlValue: value,
                                ttlUnit: unit,
                                oneTimeUse: Boolean(p.oneTimeUse),
                                maxUsesPerDay: Number(p.maxUsesPerDay) || 10,
                                isDefault: Boolean(p.isDefault),
                              });
                              setPolicyModalOpen(true);
                            }}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            disabled={Boolean(p.isDefault)}
                            title={p.isDefault ? t('Qr.cannotDeleteDefault') : t('Qr.deletePolicy')}
                            onClick={() => setDeletingPolicy(p)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Delete confirmation modal */}
      <Modal
        opened={!!deletingPolicy}
        onClose={() => setDeletingPolicy(null)}
        title={t('Qr.deletePolicyConfirmTitle')}
        radius="md"
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">
            {t('Qr.deletePolicyConfirmBody', { name: String(deletingPolicy?.name ?? '') })}
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={() => setDeletingPolicy(null)} disabled={deleteLoading}>
              {t('Common.cancel')}
            </Button>
            <Button color="red" loading={deleteLoading} onClick={handleDeletePolicy}>
              {t('Qr.deletePolicy')}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        title={editingPolicy ? t('Qr.editPolicy') : t('Qr.addPolicy')}
        radius="md"
      >
        <form onSubmit={policyForm.onSubmit(handleSavePolicy)}>
          <Stack gap="md">
            <TextInput label={t('Qr.policyName')} required {...policyForm.getInputProps('name')} />
            <Select
              label={t('Qr.policyTtlUnitLabel')}
              data={[
                { value: 'hour', label: t('Qr.ttlUnitHour') },
                { value: 'day', label: t('Qr.ttlUnitDay') },
                { value: 'month', label: t('Qr.ttlUnitMonth') },
                { value: 'year', label: t('Qr.ttlUnitYear') },
                { value: 'lifetime', label: t('Qr.ttlUnitLifetime') },
              ]}
              required
              {...policyForm.getInputProps('ttlUnit')}
            />
            {policyForm.values.ttlUnit !== 'lifetime' && (
              <NumberInput
                label={t('Qr.policyTtlValue')}
                description={t('Qr.policyTtlHint')}
                required
                min={1}
                step={1}
                decimalScale={0}
                leftSection={<IconClock size={16} />}
                {...policyForm.getInputProps('ttlValue')}
              />
            )}
            <NumberInput
              label={t('Qr.policyDailyLimit')}
              required
              min={1}
              leftSection={<IconRepeat size={16} />}
              {...policyForm.getInputProps('maxUsesPerDay')}
            />
            <Switch
              label={t('Qr.policyOneTimeOnly')}
              {...policyForm.getInputProps('oneTimeUse', { type: 'checkbox' })}
            />
            <Switch
              label={t('Qr.policySetDefault')}
              {...policyForm.getInputProps('isDefault', { type: 'checkbox' })}
            />
            <Group justify="flex-end" mt="md">
              <Button type="submit">{t('Common.save')}</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
