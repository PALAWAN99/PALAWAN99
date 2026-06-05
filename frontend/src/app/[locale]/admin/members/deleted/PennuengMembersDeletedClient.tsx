'use client';

import { useCallback, useEffect, useState } from 'react';
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
  Pagination,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconSearch, IconArrowLeft, IconRestore, IconCheck, IconX, IconArchive } from '@tabler/icons-react';

import type { PennuengMemberSoftDeleteRow } from '@/types/pennueng-member';
import { fetchPennuengDeletedApi, restorePennuengMemberApi } from '../lib/pennueng-member-api';

export default function PennuengMembersDeletedClient() {
  const t = useTranslations('PennuengMember');
  const tc = useTranslations('Common');

  const [rows, setRows] = useState<PennuengMemberSoftDeleteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPennuengDeletedApi({ search, page, limit: 20 });
      setRows(data.rows);
      setPages(data.pages);
      setTotal(data.total);
    } catch (e) {
      notifications.show({
        title: tc('error'),
        message: e instanceof Error ? e.message : tc('error'),
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  }, [search, page, tc]);

  useEffect(() => {
    void load();
  }, [load]);

  const requestRestore = (row: PennuengMemberSoftDeleteRow) => {
    const snap = row.snapshot;
    modals.openConfirmModal({
      title: t('restoreConfirmTitle'),
      centered: true,
      children: (
        <Text size="sm">
          {t('restoreConfirmMessage', {
            name: `${snap.name} ${snap.surname}`.trim(),
            memberNo: row.memberNo,
          })}
        </Text>
      ),
      labels: { confirm: t('restore'), cancel: tc('cancel') },
      confirmProps: { color: 'teal' },
      onConfirm: async () => {
        try {
          await restorePennuengMemberApi(row.memberNo);
          notifications.show({
            title: tc('success'),
            message: t('restoreSuccess'),
            color: 'teal',
            icon: <IconCheck size={16} />,
          });
          await load();
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

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <div>
          <Group gap="xs" mb={4}>
            <IconArchive size={24} />
            <Title order={2}>{t('deletedTitle')}</Title>
          </Group>
          <Text size="sm" c="dimmed">
            {t('deletedSubtitle')}
          </Text>
        </div>
        <Button
          component={Link}
          href="/admin/members"
          variant="light"
          leftSection={<IconArrowLeft size={18} />}
        >
          {t('backToList')}
        </Button>
      </Group>

      <Card withBorder p="md" radius="md">
        <TextInput
          placeholder={t('searchPlaceholder')}
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
            setPage(1);
          }}
        />
      </Card>

      <Card withBorder p={0} radius="md" style={{ position: 'relative', overflow: 'hidden' }}>
        <LoadingOverlay visible={loading} />
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead bg="var(--bg-tertiary)">
              <Table.Tr>
                <Table.Th>{t('memberNo')}</Table.Th>
                <Table.Th>{t('name')}</Table.Th>
                <Table.Th>{t('deletedAt')}</Table.Th>
                <Table.Th w={80} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((row) => (
                <Table.Tr key={row.id}>
                  <Table.Td>
                    <Badge variant="light" color="gray">
                      {row.memberNo}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {row.snapshot.name} {row.snapshot.surname}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {new Date(row.deletedAt).toLocaleString('th-TH')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Tooltip label={t('restore')}>
                      <ActionIcon
                        variant="light"
                        color="teal"
                        onClick={() => requestRestore(row)}
                        aria-label={t('restore')}
                      >
                        <IconRestore size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        {rows.length === 0 && !loading ? (
          <Text ta="center" py="xl" c="dimmed">
            {t('deletedEmpty')}
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
    </Stack>
  );
}
