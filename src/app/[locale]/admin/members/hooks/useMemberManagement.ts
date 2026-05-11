import { useState, useMemo, useCallback } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Member, MemberMetadata } from '../types';
import { addMember, updateMember, deleteMember } from '../memberActions';
import { ThaiIdCardReader } from '@/lib/idcard/reader';

const PREFIX_MAP: Record<string, string> = {
  'นาย': 'Mr.',
  'นาง': 'Mrs.',
  'นางสาว': 'Ms.',
  'เด็กชาย': 'Master',
  'เด็กหญิง': 'Miss',
};

const emptyForm = {
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
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [readingId, setReadingId] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);

  const [renewOpened, { open: openRenew, close: closeRenew }] = useDisclosure(false);
  const [renewMember, setRenewMember] = useState<Member | null>(null);
  const [renewDate, setRenewDate] = useState<Date | null>(null);
  const [renewLoading, setRenewLoading] = useState(false);

  const stats = useMemo(() => ({
    total: members.length,
    active: members.filter((m) => m.status === 'ACTIVE').length,
    inactive: members.filter((m) => m.status !== 'ACTIVE').length,
  }), [members]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter((m) => {
      const matchQ = !q || 
        m.firstNameTh.toLowerCase().includes(q) || 
        m.lastNameTh.toLowerCase().includes(q) || 
        m.memberNo.toLowerCase().includes(q) || 
        (m.citizenId ?? '').includes(q) || 
        (m.email ?? '').toLowerCase().includes(q) || 
        (m.phone ?? '').includes(q);
      const matchType = !filterType || m.memberType === filterType;
      const matchStatus = !filterStatus || (filterStatus === 'INACTIVE' ? m.status !== 'ACTIVE' : m.status === filterStatus);
      return matchQ && matchType && matchStatus;
    });
  }, [members, search, filterType, filterStatus]);

  const handleOpenAdd = useCallback(() => {
    setIsEdit(false);
    setFormData(emptyForm);
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
    setFormData({
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

  const handleSubmit = async () => {
    if (!formData.memberNo || !formData.firstNameTh || !formData.lastNameTh) {
      notifications.show({ title: 'ข้อมูลไม่ครบ', message: 'กรุณากรอกข้อมูลที่จำเป็น', color: 'orange' });
      return;
    }
    setLoading(true);
    const result = isEdit ? await updateMember(formData.id, formData) : await addMember(formData);
    setLoading(false);
    if (result.success) {
      if (isEdit) {
        setMembers(prev => prev.map(m => m.id === formData.id ? { ...m, ...formData, expireDate: formData.expireDate ? new Date(formData.expireDate) : null } : m));
      } else if (result.member) {
        setMembers(prev => [result.member as Member, ...prev]);
      }
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
      setMembers(prev => prev.map(m => m.id === renewMember.id ? { ...m, expireDate: renewDate, status: 'ACTIVE' } : m));
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
      setMembers(prev => prev.filter(m => m.id !== id));
      notifications.show({ title: 'ลบสำเร็จ', message: 'ลบข้อมูลออกจากระบบแล้ว', color: 'green' });
    }
  };

  const handleReadIdCard = async () => {
    setReadingId(true);
    const reader = new ThaiIdCardReader();
    try {
      const connected = await reader.connect();
      if (!connected) throw new Error('ไม่พบเครื่องอ่าน');
      const data = await reader.readAllData();
      if (!data) throw new Error('อ่านข้อมูลไม่ได้');
      const namesTh = data.fullNameTh.split(' ');
      const namesEn = data.fullNameEn.split(' ');
      setFormData(prev => ({
        ...prev,
        citizenId: data.citizenId,
        prefixTh: namesTh[0] ?? '',
        firstNameTh: namesTh[1] ?? '',
        lastNameTh: namesTh.slice(2).join(' ') || '',
        firstNameEn: namesEn[1] ?? '',
        lastNameEn: namesEn.slice(2).join(' ') || '',
        gender: data.gender,
        birthDate: data.birthDate,
        address: data.address,
      }));
    } catch (e: any) {
      notifications.show({ title: 'ข้อผิดพลาด', message: e.message, color: 'red' });
    } finally {
      await reader.disconnect();
      setReadingId(false);
    }
  };

  return {
    members, filtered, stats, loading, readingId, search, setSearch, filterType, setFilterType, filterStatus, setFilterStatus,
    formData, setFormData, isEdit, opened, handleOpenAdd, handleOpenEdit, handleSubmit, close,
    renewOpened, renewMember, renewDate, setRenewDate, renewLoading, handleOpenRenew, handleRenew, closeRenew,
    handleDelete, handleReadIdCard, clearFilters: () => { setSearch(''); setFilterType(null); setFilterStatus(null); }
  };
}
