import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { Text } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import React from 'react';

import { Member, MemberMetadata, AccessEvent, MemberFormData } from '../types';
import {
  createMemberApi,
  deleteMemberApi,
  fetchMembersApi,
  updateMemberApi,
} from '../lib/member-api';

function memberToFormData(member: Member, overrides?: Partial<MemberFormData>): MemberFormData {
  let meta: MemberMetadata = {};
  if (member.metadata) {
    try {
      meta = typeof member.metadata === 'string' ? JSON.parse(member.metadata) : member.metadata;
    } catch {
      /* ignore */
    }
  }
  return {
    id: member.id,
    memberNo: member.memberNo,
    citizenId: member.citizenId ?? '',
    firstNameTh: member.firstNameTh,
    lastNameTh: member.lastNameTh,
    firstNameEn: member.firstNameEn ?? '',
    lastNameEn: member.lastNameEn ?? '',
    email: member.email ?? '',
    phone: member.phone ?? '',
    memberType: member.memberType,
    status: member.status,
    expireDate: member.expireDate ? new Date(member.expireDate).toISOString().split('T')[0] : '',
    prefixTh: meta.prefixTh || '',
    prefixEn: meta.prefixEn || '',
    birthDate: meta.birthDate || '',
    gender: meta.gender || '',
    address: meta.address || '',
    school: meta.school || '',
    ...overrides,
  };
}

const SEARCH_DEBOUNCE_MS = 350;

export function useMemberManagement() {
  const t = useTranslations();
  const tm = useTranslations('Member');
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [initialFormData, setInitialFormData] = useState<MemberFormData | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const fetchSeq = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterType, filterStatus]);

  const fetchMembers = useCallback(async () => {
    const seq = ++fetchSeq.current;
    setSearching(true);
    try {
      const data = await fetchMembersApi({
        search: debouncedSearch,
        page,
        filterType,
        filterStatus,
      });
      if (seq !== fetchSeq.current) return;
      setMembers(data.members as Member[]);
      setTotal(data.total);
      setTotalPages(data.pages);
    } catch (e) {
      if (seq !== fetchSeq.current) return;
      console.error('Fetch members failed:', e);
      notifications.show({
        title: tm('loadFailed'),
        message: e instanceof Error ? e.message : t('Common.error'),
        color: 'red',
        icon: React.createElement(IconX, { size: 16 }),
      });
    } finally {
      if (seq === fetchSeq.current) setSearching(false);
    }
  }, [debouncedSearch, page, filterType, filterStatus]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const [renewOpened, { open: openRenew, close: closeRenew }] = useDisclosure(false);
  const [renewMember, setRenewMember] = useState<Member | null>(null);
  const [renewDate, setRenewDate] = useState<Date | null>(null);
  const [renewLoading, setRenewLoading] = useState(false);

  const stats = useMemo(
    () => ({
      total,
      active: members.filter((m) => m.status === 'ACTIVE').length,
      inactive: members.filter((m) => m.status !== 'ACTIVE').length,
    }),
    [members, total],
  );

  const handleOpenAdd = useCallback(() => {
    setIsEdit(false);
    setInitialFormData(null);
    open();
  }, [open]);

  const handleOpenEdit = useCallback(
    (member: Member) => {
      setIsEdit(true);
      setInitialFormData(memberToFormData(member));
      open();
    },
    [open],
  );

  const handleSubmit = async (values: MemberFormData) => {
    setLoading(true);
    try {
      if (isEdit && values.id) {
        await updateMemberApi(values.id, values);
      } else {
        await createMemberApi(values);
      }
      await fetchMembers();
      notifications.show({
        title: t('Common.success'),
        message: isEdit ? tm('saveSuccessEdit') : tm('saveSuccessAdd'),
        color: 'teal',
        icon: React.createElement(IconCheck, { size: 16 }),
      });
      close();
    } catch (e) {
      notifications.show({
        title: tm('saveFailed'),
        message: e instanceof Error ? e.message : t('Common.error'),
        color: 'red',
        icon: React.createElement(IconX, { size: 16 }),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRenew = useCallback(
    (member: Member) => {
      setRenewMember(member);
      const base =
        member.expireDate && new Date(member.expireDate) > new Date()
          ? new Date(member.expireDate)
          : new Date();
      const next = new Date(base);
      next.setFullYear(next.getFullYear() + 1);
      setRenewDate(next);
      openRenew();
    },
    [openRenew],
  );

  const handleRenew = async () => {
    if (!renewMember || !renewDate) return;
    setRenewLoading(true);
    try {
      await updateMemberApi(
        renewMember.id,
        memberToFormData(renewMember, {
          expireDate: renewDate.toISOString().split('T')[0],
          status: 'ACTIVE',
        }),
      );
      await fetchMembers();
      notifications.show({
        title: 'ต่ออายุสำเร็จ',
        message: 'ขยายวันหมดอายุเรียบร้อย',
        color: 'teal',
        icon: React.createElement(IconCheck, { size: 16 }),
      });
      closeRenew();
    } catch (e) {
      notifications.show({
        title: 'ต่ออายุไม่สำเร็จ',
        message: e instanceof Error ? e.message : 'เกิดข้อผิดพลาด',
        color: 'red',
      });
    } finally {
      setRenewLoading(false);
    }
  };

  const requestDelete = useCallback(
    (member: Member) => {
      const fullName = `${member.firstNameTh} ${member.lastNameTh}`.trim();
      modals.openConfirmModal({
        title: tm('deleteConfirmTitle'),
        centered: true,
        children: (
          <Text size="sm">
            {tm('deleteConfirmMessage', { name: fullName, memberNo: member.memberNo })}
          </Text>
        ),
        labels: { confirm: tm('deleteConfirmButton'), cancel: t('Common.cancel') },
        confirmProps: { color: 'red' },
        onConfirm: async () => {
          setLoading(true);
          try {
            await deleteMemberApi(member.id);
            await fetchMembers();
            notifications.show({
              title: t('Common.success'),
              message: tm('deleteSuccess'),
              color: 'teal',
              icon: React.createElement(IconCheck, { size: 16 }),
            });
          } catch (e) {
            notifications.show({
              title: tm('deleteFailed'),
              message: e instanceof Error ? e.message : t('Common.error'),
              color: 'red',
              icon: React.createElement(IconX, { size: 16 }),
            });
          } finally {
            setLoading(false);
          }
        },
      });
    },
    [fetchMembers, t, tm],
  );

  const [historyOpened, { open: openHistory, close: closeHistory }] = useDisclosure(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [accessHistory, setAccessHistory] = useState<AccessEvent[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleOpenHistory = async (member: Member) => {
    setSelectedMember(member);
    setHistoryLoading(true);
    setAccessHistory([]);
    openHistory();

    try {
      const res = await fetch(`/api/admin/members/${member.id}/history`);
      const result = await res.json();
      if (result.success) {
        setAccessHistory(result.data.history || []);
      } else {
        notifications.show({
          title: 'ไม่สามารถดึงประวัติได้',
          message: result.error?.message || 'เกิดข้อผิดพลาด',
          color: 'red',
        });
      }
    } catch {
      notifications.show({ title: 'ข้อผิดพลาด', message: 'Network error', color: 'red' });
    } finally {
      setHistoryLoading(false);
    }
  };

  const clearFilters = useCallback(() => {
    setSearch('');
    setFilterType(null);
    setFilterStatus(null);
    setPage(1);
  }, []);

  return {
    members,
    filtered: members,
    stats,
    loading,
    searching,
    search,
    setSearch,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    page,
    setPage,
    total,
    totalPages,
    initialFormData,
    isEdit,
    opened,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,
    close,
    renewOpened,
    renewMember,
    renewDate,
    setRenewDate,
    renewLoading,
    handleOpenRenew,
    handleRenew,
    closeRenew,
    requestDelete,
    clearFilters,
    historyOpened,
    closeHistory,
    historyLoading,
    accessHistory,
    selectedMember,
    handleOpenHistory,
    refresh: fetchMembers,
  };
}
