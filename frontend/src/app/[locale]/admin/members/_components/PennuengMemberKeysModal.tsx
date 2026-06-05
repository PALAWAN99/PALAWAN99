'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Table,
  Text,
  Stack,
  LoadingOverlay,
  Badge,
  Group,
  TextInput,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { formatPennuengBangkok } from '@/lib/pennueng-datetime';
import type { PennuengMemberKey } from '@/types/pennueng-member';
import {
  deletePennuengMemberKeyApi,
  fetchPennuengMemberKeysApi,
  updatePennuengMemberKeyApi,
} from '../lib/pennueng-member-api';

interface Props {
  opened: boolean;
  memberNo: string | null;
  memberName: string | null;
  onClose: () => void;
}

function formatExpireDate(iso: string | null): string {
  if (!iso) return '—';
  return formatPennuengBangkok(iso, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function isoToDateLocal(iso: string | null): string {
  if (!iso) return '';
  const m = iso.match(/^(\d{4}-\d{2}-\d{2})/);
  return m?.[1] ?? '';
}

function isExpired(iso: string | null): boolean {
  if (!iso) return false;
  return new Date(iso).getTime() < Date.now();
}

export function PennuengMemberKeysModal({ opened, memberNo, memberName, onClose }: Props) {
  const t = useTranslations('PennuengMember');
  const tc = useTranslations('Common');

  const [keys, setKeys] = useState<PennuengMemberKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingSeqNo, setEditingSeqNo] = useState<number | null>(null);
  const [draftKey, setDraftKey] = useState('');
  const [draftExpire, setDraftExpire] = useState('');
  const [saving, setSaving] = useState(false);

  const loadKeys = useCallback(async () => {
    if (!memberNo) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPennuengMemberKeysApi(memberNo);
      setKeys(data.keys);
    } catch (e) {
      setKeys([]);
      setError(e instanceof Error ? e.message : tc('error'));
    } finally {
      setLoading(false);
    }
  }, [memberNo, tc]);

  useEffect(() => {
    if (opened && memberNo) {
      void loadKeys();
    } else if (!opened) {
      setKeys([]);
      setError(null);
      setEditingSeqNo(null);
    }
  }, [opened, memberNo, loadKeys]);

  const startEdit = (row: PennuengMemberKey) => {
    setEditingSeqNo(row.seqNo);
    setDraftKey(row.memberKey);
    setDraftExpire(isoToDateLocal(row.expireDate));
  };

  const cancelEdit = () => {
    setEditingSeqNo(null);
    setDraftKey('');
    setDraftExpire('');
  };

  const saveEdit = async (seqNo: number) => {
    if (!memberNo || !draftKey.trim()) return;
    setSaving(true);
    try {
      await updatePennuengMemberKeyApi(memberNo, seqNo, {
        memberKey: draftKey.trim(),
        expireDate: draftExpire.trim() || null,
      });
      notifications.show({
        title: tc('success'),
        message: t('keyUpdateSuccess'),
        color: 'teal',
      });
      cancelEdit();
      await loadKeys();
    } catch (e) {
      notifications.show({
        title: tc('error'),
        message: e instanceof Error ? e.message : tc('error'),
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (row: PennuengMemberKey) => {
    if (!memberNo) return;
    modals.openConfirmModal({
      title: t('keyDeleteConfirmTitle'),
      centered: true,
      children: (
        <Text size="sm">
          {t('keyDeleteConfirmMessage', { memberKey: row.memberKey })}
        </Text>
      ),
      labels: { confirm: t('keyDeleteConfirmButton'), cancel: tc('cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deletePennuengMemberKeyApi(memberNo, row.seqNo);
          notifications.show({
            title: tc('success'),
            message: t('keyDeleteSuccess'),
            color: 'teal',
          });
          if (editingSeqNo === row.seqNo) cancelEdit();
          await loadKeys();
        } catch (e) {
          notifications.show({
            title: tc('error'),
            message: e instanceof Error ? e.message : tc('error'),
            color: 'red',
          });
        }
      },
    });
  };

  const title = memberName
    ? t('keysModalTitle', { name: memberName, memberNo: memberNo ?? '' })
    : t('keysModalTitleShort', { memberNo: memberNo ?? '' });

  return (
    <Modal opened={opened} onClose={onClose} title={title} size="lg" centered>
      <Stack gap="sm" pos="relative" mih={120}>
        <LoadingOverlay visible={loading || saving} overlayProps={{ blur: 2 }} />
        {error ? (
          <Text size="sm" c="red">
            {error}
          </Text>
        ) : null}
        {!loading && !error && keys.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="md">
            {t('keysEmpty')}
          </Text>
        ) : null}
        {keys.length > 0 ? (
          <Table.ScrollContainer minWidth={560}>
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('keyMemberKey')}</Table.Th>
                  <Table.Th>{t('keyExpireDate')}</Table.Th>
                  <Table.Th w={88} />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {keys.map((row) => {
                  const editing = editingSeqNo === row.seqNo;
                  return (
                    <Table.Tr key={`${row.seqNo}-${row.memberKey}`}>
                      <Table.Td>
                        {editing ? (
                          <TextInput
                            size="xs"
                            value={draftKey}
                            onChange={(e) => setDraftKey(e.currentTarget.value)}
                            ff="monospace"
                          />
                        ) : (
                          <Text size="sm" ff="monospace" fw={500}>
                            {row.memberKey}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        {editing ? (
                          <TextInput
                            size="xs"
                            type="date"
                            value={draftExpire}
                            onChange={(e) => setDraftExpire(e.currentTarget.value)}
                          />
                        ) : row.expireDate ? (
                          <Badge
                            variant="light"
                            color={isExpired(row.expireDate) ? 'red' : 'teal'}
                            size="sm"
                          >
                            {formatExpireDate(row.expireDate)}
                          </Badge>
                        ) : (
                          <Text size="sm" c="dimmed">
                            —
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4} justify="flex-end" wrap="nowrap">
                          {editing ? (
                            <>
                              <Tooltip label={tc('save')}>
                                <ActionIcon
                                  variant="light"
                                  color="teal"
                                  size="sm"
                                  onClick={() => void saveEdit(row.seqNo)}
                                  aria-label={tc('save')}
                                >
                                  <IconCheck size={14} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label={tc('cancel')}>
                                <ActionIcon
                                  variant="subtle"
                                  color="gray"
                                  size="sm"
                                  onClick={cancelEdit}
                                  aria-label={tc('cancel')}
                                >
                                  <IconX size={14} />
                                </ActionIcon>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip label={tc('edit')}>
                                <ActionIcon
                                  variant="light"
                                  color="skyBlue"
                                  size="sm"
                                  onClick={() => startEdit(row)}
                                  aria-label={tc('edit')}
                                >
                                  <IconEdit size={14} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label={tc('delete')}>
                                <ActionIcon
                                  variant="light"
                                  color="red"
                                  size="sm"
                                  onClick={() => requestDelete(row)}
                                  aria-label={tc('delete')}
                                >
                                  <IconTrash size={14} />
                                </ActionIcon>
                              </Tooltip>
                            </>
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        ) : null}
        <Text size="xs" c="dimmed">
          {t('keysSourceHint')}
        </Text>
      </Stack>
    </Modal>
  );
}
