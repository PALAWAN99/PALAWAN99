'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Title,
  Text,
  Group,
  Button,
  Stack,
  Card,
  Table,
  Badge,
  TextInput,
  LoadingOverlay,
  Select,
  Pagination,
  ActionIcon,
  Tooltip,
  Alert,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconDatabase,
  IconArchive,
  IconKey,
} from '@tabler/icons-react';

import type { PennuengMember, PennuengMemberTypeOption } from '@/types/pennueng-member';
import type { PennuengMemberInput } from '@/validators/pennuengMemberValidator';
import {
  createPennuengMemberApi,
  fetchPennuengMemberTypesApi,
  fetchPennuengMembersApi,
  softDeletePennuengMemberApi,
  updatePennuengMemberApi,
} from './lib/pennueng-member-api';
import { PennuengMemberFormModal } from './_components/PennuengMemberFormModal';
import { PennuengMemberKeysModal } from './_components/PennuengMemberKeysModal';

const SEARCH_DEBOUNCE_MS = 350;

export default function PennuengMembersClient() {
  const t = useTranslations('PennuengMember');
  const tc = useTranslations('Common');

  const [members, setMembers] = useState<PennuengMember[]>([]);
  const [types, setTypes] = useState<PennuengMemberTypeOption[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PennuengMember | null>(null);
  const [keysMember, setKeysMember] = useState<PennuengMember | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const fetchSeq = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterType]);

  const loadTypes = useCallback(async () => {
    try {
      const data = await fetchPennuengMemberTypesApi();
      setTypes(data);
    } catch {
      /* optional */
    }
  }, []);

  const loadMembers = useCallback(async () => {
    const seq = ++fetchSeq.current;
    setSearching(true);
    try {
      const data = await fetchPennuengMembersApi({
        search: debouncedSearch,
        page,
        memberType: filterType,
        limit: 20,
      });
      if (seq !== fetchSeq.current) return;
      setMembers(data.members);
      setTotal(data.total);
      setPages(data.pages);
      setIsMock(!!data.isMock);
    } catch (e) {
      if (seq !== fetchSeq.current) return;
      notifications.show({
        title: tc('error'),
        message: e instanceof Error ? e.message : tc('error'),
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      if (seq === fetchSeq.current) {
        setSearching(false);
        setLoading(false);
      }
    }
  }, [debouncedSearch, page, filterType, tc]);

  useEffect(() => {
    void loadTypes();
  }, [loadTypes]);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (m: PennuengMember) => {
    setEditing(m);
    setModalOpen(true);
  };

  const openKeys = (m: PennuengMember) => {
    setKeysMember(m);
  };

  const handleSubmit = async (values: PennuengMemberInput) => {
    setSubmitting(true);
    try {
      const { birthDate: _birth, expireDate: _expire, ...withoutDates } = values;
      if (editing) {
        const { memberNo: _no, ...patch } = withoutDates;
        await updatePennuengMemberApi(editing.memberNo, patch);
        notifications.show({
          title: tc('success'),
          message: t('updateSuccess'),
          color: 'teal',
          icon: <IconCheck size={16} />,
        });
      } else {
        await createPennuengMemberApi(withoutDates);
        notifications.show({
          title: tc('success'),
          message: t('createSuccess'),
          color: 'teal',
          icon: <IconCheck size={16} />,
        });
      }
      setModalOpen(false);
      setEditing(null);
      await loadMembers();
    } catch (e) {
      notifications.show({
        title: tc('error'),
        message: e instanceof Error ? e.message : tc('error'),
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const requestDelete = (m: PennuengMember) => {
    modals.openConfirmModal({
      title: t('deleteConfirmTitle'),
      centered: true,
      children: (
        <Text size="sm">
          {t('deleteConfirmMessage', {
            name: `${m.name} ${m.surname}`.trim(),
            memberNo: m.memberNo,
          })}
        </Text>
      ),
      labels: { confirm: t('deleteConfirmButton'), cancel: tc('cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await softDeletePennuengMemberApi(m.memberNo);
          notifications.show({
            title: tc('success'),
            message: t('deleteSuccess'),
            color: 'teal',
            icon: <IconCheck size={16} />,
          });
          await loadMembers();
        } catch (e) {
          notifications.show({
            title: tc('error'),
            message: e instanceof Error ? e.message : tc('error'),
            color: 'red',
            icon: <IconX size={16} />,
          });
        }
      },
    });
  };

  const typeFilterData = [
    { value: '', label: t('allTypes') },
    ...types.map((opt) => ({
      value: opt.memberType,
      label: opt.description ? `${opt.memberType} — ${opt.description}` : opt.memberType,
    })),
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <div>
          <Group gap="xs">
            <IconDatabase size={24} color="var(--mantine-color-blue-filled)" />
            <Title order={2}>{t('title')}</Title>
          </Group>
        </div>
        <Group gap="sm">
          <Button
            component={Link}
            href="/admin/members/deleted"
            variant="light"
            color="gray"
            leftSection={<IconArchive size={18} />}
          >
            {t('deletedMenu')}
          </Button>
          <Button color="skyBlue" leftSection={<IconPlus size={18} />} onClick={openCreate}>
            {t('add')}
          </Button>
        </Group>
      </Group>

      {isMock && (
        <Alert
          icon={<IconDatabase size={16} />}
          title="โหมดทดสอบ (Mock Mode)"
          color="yellow"
          variant="light"
        >
          ขณะนี้แสดงข้อมูลสมาชิกตัวอย่าง เนื่องจากยังไม่ได้เชื่อมต่อกับฐานข้อมูล SQL Server (Pennueng) จริง
          การเพิ่ม แก้ไข และลบสมาชิกจะยังไม่มีผล จนกว่าจะตั้งค่า SQLSERVER_* ใน .env ครับ
        </Alert>
      )}

      <Card withBorder p="md" radius="md">
        <Group grow preventGrowOverflow={false} wrap="wrap">
          <TextInput
            placeholder={t('searchPlaceholder')}
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Select
            placeholder={t('filterType')}
            data={typeFilterData}
            value={filterType ?? ''}
            onChange={(v) => setFilterType(v || null)}
            clearable
          />
        </Group>
      </Card>

      <Card withBorder p={0} radius="md" style={{ position: 'relative', overflow: 'hidden' }}>
        <LoadingOverlay visible={loading || searching} overlayProps={{ blur: 2 }} />
        <Table.ScrollContainer minWidth={900}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead bg="var(--bg-tertiary)">
              <Table.Tr>
                <Table.Th>{t('memberNo')}</Table.Th>
                <Table.Th>{t('name')}</Table.Th>
                <Table.Th>{t('memberType')}</Table.Th>
                <Table.Th>{t('contact')}</Table.Th>
                <Table.Th>{t('expireDate')}</Table.Th>
                <Table.Th w={140} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {members.map((m) => (
                <Table.Tr key={m.memberNo}>
                  <Table.Td>
                    <Badge variant="light" color="navy">
                      {m.memberNo}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500} size="sm">
                      {m.name} {m.surname}
                    </Text>
                    {m.personId ? (
                      <Text size="xs" c="dimmed">
                        {m.personId}
                      </Text>
                    ) : null}
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{m.memberTypeLabel ?? m.memberType}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {[m.tel, m.email].filter(Boolean).join(' · ') || '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {m.expireDate
                        ? new Date(m.expireDate).toLocaleDateString('th-TH')
                        : '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4} justify="flex-end" wrap="nowrap">
                      <Tooltip label={t('keyAccess')}>
                        <ActionIcon
                          variant="light"
                          color="violet"
                          onClick={() => openKeys(m)}
                          aria-label={t('keyAccess')}
                        >
                          <IconKey size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={tc('edit')}>
                        <ActionIcon
                          variant="light"
                          color="skyBlue"
                          onClick={() => openEdit(m)}
                          aria-label={tc('edit')}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={tc('delete')}>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => requestDelete(m)}
                          aria-label={tc('delete')}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        {members.length === 0 && !loading ? (
          <Text ta="center" py="xl" c="dimmed">
            {tc('noData')}
          </Text>
        ) : null}
        {pages > 1 ? (
          <Group justify="center" py="md">
            <Pagination total={pages} value={page} onChange={setPage} />
          </Group>
        ) : null}
        <Text size="xs" c="dimmed" ta="center" pb="sm">
          {t('resultCount', { count: total })}
        </Text>
      </Card>

      <PennuengMemberFormModal
        opened={modalOpen}
        isEdit={!!editing}
        memberNo={editing?.memberNo ?? null}
        initial={editing}
        types={types}
        loading={submitting}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <PennuengMemberKeysModal
        opened={!!keysMember}
        memberNo={keysMember?.memberNo ?? null}
        memberName={
          keysMember ? `${keysMember.name} ${keysMember.surname}`.trim() : null
        }
        onClose={() => setKeysMember(null)}
      />
    </Stack>
  );
}
