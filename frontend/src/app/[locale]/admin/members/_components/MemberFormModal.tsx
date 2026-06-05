import { Modal, Stack, Button, Group, TextInput, Select, Text, Grid, Divider } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useForm, type FormErrors } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useMediaQuery } from '@mantine/hooks';
import { IconId, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { useEffect } from 'react';
import { memberSchema } from '@/validators/memberValidator';
import { ThaiIdCardReader } from '@/lib/idcard/reader';
import { notifications } from '@mantine/notifications';
import type { MemberFormData } from '../types';

const PREFIX_OPTIONS = [
  { value: 'นาย', label: 'นาย' },
  { value: 'นาง', label: 'นาง' },
  { value: 'นางสาว', label: 'นางสาว' },
  { value: 'เด็กชาย', label: 'เด็กชาย' },
  { value: 'เด็กหญิง', label: 'เด็กหญิง' },
];

const MEMBER_TYPE_OPTIONS = [
  { value: 'STUDENT', label: 'นักเรียน/นักศึกษา' },
  { value: 'STAFF', label: 'บุคลากร' },
  { value: 'FACULTY', label: 'อาจารย์' },
  { value: 'EXTERNAL', label: 'บุคคลภายนอก' },
  { value: 'GUEST', label: 'ผู้เยี่ยมชม' },
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'ปกติ' },
  { value: 'EXPIRED', label: 'หมดอายุ' },
  { value: 'SUSPENDED', label: 'ระงับการใช้งาน' },
  { value: 'REVOKED', label: 'ยกเลิก' },
];

const EMPTY_FORM: MemberFormData = {
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

interface MemberFormModalProps {
  opened: boolean;
  onClose: () => void;
  isEdit: boolean;
  initialData: MemberFormData | null;
  loading: boolean;
  onSubmit: (values: MemberFormData) => Promise<void>;
}

export function MemberFormModal({ 
  opened, 
  onClose, 
  isEdit, 
  initialData, 
  loading, 
  onSubmit 
}: MemberFormModalProps) {
  const tm = useTranslations('Member');
  const isMobile = useMediaQuery('(max-width: 48em)');

  const form = useForm<MemberFormData>({
    initialValues: { ...EMPTY_FORM, ...(initialData ?? {}) },
    validate: zodResolver(memberSchema) as unknown as (values: MemberFormData) => FormErrors,
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (opened) {
      form.setValues({ ...EMPTY_FORM, ...(initialData ?? {}) });
      form.resetDirty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when modal opens or edit target changes
  }, [opened, initialData]);

  const handleReadIdCard = async () => {
    const reader = new ThaiIdCardReader();
    try {
      const connected = await reader.connect();
      if (!connected) throw new Error('ไม่พบเครื่องอ่านบัตร');
      
      notifications.show({ 
        id: 'reading-id', 
        loading: true, 
        title: 'กำลังอ่านบัตร', 
        message: 'กรุณาเสียบบัตรประชาชน', 
        autoClose: false 
      });

      const data = await reader.readAllData();
      if (!data) throw new Error('อ่านข้อมูลจากบัตรไม่ได้');

      const namesTh = data.fullNameTh.split(' ');
      form.setValues({
        citizenId: data.citizenId,
        prefixTh: namesTh[0] ?? '',
        firstNameTh: namesTh[1] ?? '',
        lastNameTh: namesTh.slice(2).join(' ') || '',
      });

      notifications.update({
        id: 'reading-id',
        title: 'อ่านสำเร็จ',
        message: 'ดึงข้อมูลจากบัตรเรียบร้อยแล้ว',
        color: 'green',
        loading: false,
        autoClose: 2000
      });
    } catch (e: any) {
      notifications.show({ title: 'ข้อผิดพลาด', message: e.message, color: 'red' });
    } finally {
      await reader.disconnect();
    }
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={
        <Group gap="xs">
          <IconId size={20} color="var(--mantine-color-blue-filled)" />
          <Text fw={600}>{isEdit ? tm('editMember') : tm('addMember')}</Text>
        </Group>
      } 
      size="lg"
      fullScreen={isMobile}
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      radius="md"
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="md">
          {!isEdit && (
            <>
              <Button 
                variant="light" 
                color="blue"
                leftSection={<IconId size={18} />} 
                onClick={handleReadIdCard}
                fullWidth
              >
                อ่านข้อมูลจากบัตรประชาชน (Web USB)
              </Button>
              <Divider label="หรือกรอกข้อมูลด้วยตนเอง" labelPosition="center" />
            </>
          )}

          <Grid gap="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput 
                label="รหัสสมาชิก" 
                placeholder="เช่น MEM-001"
                required 
                {...form.getInputProps('memberNo')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput 
                label="เลขบัตรประชาชน" 
                placeholder="เลข 13 หลัก"
                {...form.getInputProps('citizenId')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="คำนำหน้า"
                placeholder="เลือก"
                clearable
                data={PREFIX_OPTIONS}
                value={form.values.prefixTh || null}
                onChange={(v) => form.setFieldValue('prefixTh', v ?? '')}
                error={form.errors.prefixTh}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput 
                label="ชื่อ (ไทย)" 
                placeholder="ชื่อจริง"
                required 
                {...form.getInputProps('firstNameTh')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput 
                label="นามสกุล (ไทย)" 
                placeholder="นามสกุล"
                required 
                {...form.getInputProps('lastNameTh')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput 
                label="อีเมล" 
                placeholder="example@email.com"
                {...form.getInputProps('email')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput 
                label="เบอร์โทรศัพท์" 
                placeholder="08x-xxx-xxxx"
                {...form.getInputProps('phone')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="ประเภทสมาชิก"
                data={MEMBER_TYPE_OPTIONS}
                value={form.values.memberType}
                onChange={(v) => form.setFieldValue('memberType', (v as MemberFormData['memberType']) ?? 'STUDENT')}
                error={form.errors.memberType}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="สถานะ"
                data={STATUS_OPTIONS}
                value={form.values.status}
                onChange={(v) => form.setFieldValue('status', (v as MemberFormData['status']) ?? 'ACTIVE')}
                error={form.errors.status}
              />
            </Grid.Col>
          </Grid>

          <Group justify="flex-end" mt="xl">
            <Button variant="subtle" color="gray" onClick={onClose} leftSection={<IconX size={16} />}>
              ยกเลิก
            </Button>
            <Button 
              type="submit" 
              loading={loading} 
              leftSection={<IconDeviceFloppy size={16} />}
              color="blue"
            >
              บันทึกข้อมูล
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

