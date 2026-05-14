import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Member, MemberMetadata, AccessEvent, MemberFormData } from '../types';
import { addMember, updateMember, deleteMember } from '../memberActions';

const emptyForm: MemberFormData = {
  id: '',
  memberNo: '',
  citizenId: '',
  prefixTh: '',
  prefixEn: '',
  firstNameTh: '',
  lastNameTh: '',
  firstNameEn: '',
  lastNameEn: '',
  email: '',
  phone: '',
  memberType: 'STUDENT',
  status: 'ACTIVE',
  expireDate: '',
  birthDate: '',
  gender: '',
  address: '',
  school: '',
};

export function useMemberManagement(initialMembers: Member[]) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [total, setTotal] = useState(initialMembers.length);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [readingId, setReadingId] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [initialFormData, setInitialFormData] = useState<MemberFormData | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const typeParam = filterType ? `&type=${filterType}` : '';
      const statusParam = filterStatus ? `&status=${filterStatus}` : '';
      const res = await fetch(`/api/admin/members?search=${search}&page=${page}&limit=20${typeParam}${statusParam}`);
      const result = await res.json();
      
      if (result.success && result.data) {
        setMembers(result.data.members);
        setTotal(result.data.total);
        setTotalPages(result.data.pages);
      }
    } catch (e) {
      console.error('Fetch members failed:', e);
    } finally {
      setLoading(false);
    }
  }, [search, page, filterType, filterStatus]);

  // Fetch when filters change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchMembers]);

  const [renewOpened, { open: openRenew, close: closeRenew }] = useDisclosure(false);
  const [renewMember, setRenewMember] = useState<Member | null>(null);
  const [renewDate, setRenewDate] = useState<Date | null>(null);
  const [renewLoading, setRenewLoading] = useState(false);

  const stats = useMemo(() => ({
    total: total,
    active: members.filter((m) => m.status === 'ACTIVE').length,
    inactive: members.filter((m) => m.status !== 'ACTIVE').length,
  }), [members, total]);

  const filtered = members;

  const handleOpenAdd = useCallback(() => {
    setIsEdit(false);
    setInitialFormData(null);
    open();
  }, [open]);

  const handleOpenEdit = useCallback((member: Member) => {
    setIsEdit(true);
    let meta: MemberMetadata = {};
    if (member.metadata) {
      try {
        meta = typeof member.metadata === 'string' ? JSON.parse(member.metadata) : member.metadata;
      } catch (e) {}
    }
    setInitialFormData({
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
    });
    open();
  }, [open]);

  const handleSubmit = async (values: MemberFormData) => {
    setLoading(true);
    const result = isEdit && values.id ? await updateMember(values.id, values) : await addMember(values);
    setLoading(false);
    
    if (result.success) {
      fetchMembers();
      notifications.show({ title: 'สำเร็จ', message: 'บันทึกข้อมูลเรียบร้อย', color: 'green' });
      close();
    } else {
      notifications.show({ title: 'ข้อผิดพลาด', message: result.error || 'บันทึกไม่สำเร็จ', color: 'red' });
    }
  };

  const handleOpenRenew = useCallback((member: Member) => {
    setRenewMember(member);
    const base = member.expireDate && new Date(member.expireDate) > new Date() ? new Date(member.expireDate) : new Date();
    const next = new Date(base);
    next.setFullYear(next.getFullYear() + 1);
    setRenewDate(next);
    openRenew();
  }, [openRenew]);

  const handleRenew = async () => {
    if (!renewMember || !renewDate) return;
    setRenewLoading(true);
    const result = await updateMember(renewMember.id, { ...renewMember, expireDate: renewDate.toISOString().split('T')[0], status: 'ACTIVE' });
    setRenewLoading(false);
    if (result.success) {
      fetchMembers();
      notifications.show({ title: 'ต่ออายุสำเร็จ', message: 'ขยายวันหมดอายุเรียบร้อย', color: 'teal' });
      closeRenew();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`ยืนยันลบ "${name}"?`)) return;
    setLoading(true);
    const result = await deleteMember(id);
    setLoading(false);
    if (result.success) {
      fetchMembers();
      notifications.show({ title: 'ลบสำเร็จ', message: 'ลบข้อมูลออกจากระบบแล้ว', color: 'green' });
    }
  };

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
      setHistoryLoading(false);
      
      if (result.success) {
        setAccessHistory(result.data.history || []);
      } else {
        notifications.show({
          title: 'ไม่สามารถดึงข้อมูลประวัติได้',
          message: result.error?.message || 'Failed to fetch history',
          color: 'red',
        });
      }
    } catch (error) {
      setHistoryLoading(false);
      notifications.show({ title: 'ข้อผิดพลาด', message: 'Network error', color: 'red' });
    }
  };

  const clearFilters = useCallback(() => {
    setSearch('');
    setFilterType(null);
    setFilterStatus(null);
    setPage(1);
  }, []);

  return {
    members, filtered, stats, loading, readingId, search, setSearch, filterType, setFilterType, filterStatus, setFilterStatus,
    page, setPage, total, totalPages,
    initialFormData, isEdit, opened, handleOpenAdd, handleOpenEdit, handleSubmit, close,
    renewOpened, renewMember, renewDate, setRenewDate, renewLoading, handleOpenRenew, handleRenew, closeRenew,
    handleDelete, clearFilters,
    historyOpened, closeHistory, historyLoading, accessHistory, selectedMember, handleOpenHistory
  };
}
