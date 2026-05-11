import { Modal, Stack, Button, Group, TextInput, Select, Text, Grid } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { IconId, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { useEffect } from 'react';
import { memberSchema } from '@/validators/memberValidator';
import { ThaiIdCardReader } from '@/lib/idcard/reader';
import { notifications } from '@mantine/notifications';

interface MemberFormModalProps {
  opened: boolean;
  onClose: () => void;
  isEdit: boolean;
  initialData: any;
  loading: boolean;
  onSubmit: (values: any) => Promise<void>;
}

export function MemberFormModal({ 
  opened, 
  onClose, 
  isEdit, 
  initialData, 
  loading, 
  onSubmit 
}: MemberFormModalProps) {
  const isMobile = useMediaQuery('(max-width: 48em)');

  const form = useForm({
    initialValues: {
      memberNo: '',
      citizenId: '',
      prefixTh: '',
      firstNameTh: '',
      lastNameTh: '',
      email: '',
      phone: '',
      memberType: 'STUDENT',
      status: 'ACTIVE',
      expireDate: '',
      ...initialData
    },
    validate: zodResolver(memberSchema),
    validateInputOnBlur: true,
  });

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (opened) {
      form.setValues({
        memberNo: '',
        citizenId: '',
        prefixTh: '',
        firstNameTh: '',
        lastNameTh: '',
        email: '',
        phone: '',
        memberType: 'STUDENT',
        status: 'ACTIVE',
        expireDate: '',
        ...initialData
      });
      form.resetDirty();
    }
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
          <Text fw={600}>{isEdit ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มสมาชิกใหม่'}</Text>
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
            <Button 
              variant="light" 
              leftSection={<IconId size={18} />} 
              onClick={handleReadIdCard}
              fullWidth
            >
              ดึงข้อมูลจากบัตรประชาชน
            </Button>
          )}

          <Grid gutter="md">
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
                data={['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง']} 
                {...form.getInputProps('prefixTh')}
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
                data={[
                  { label: 'นักเรียน/นักศึกษา', value: 'STUDENT' },
                  { label: 'บุคลากร', value: 'STAFF' },
                  { label: 'บุคคลภายนอก', value: 'GUEST' }
                ]}
                {...form.getInputProps('memberType')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="สถานะ"
                data={[
                  { label: 'ปกติ', value: 'ACTIVE' },
                  { label: 'ระงับการใช้งาน', value: 'INACTIVE' },
                  { label: 'หมดอายุ', value: 'EXPIRED' }
                ]}
                {...form.getInputProps('status')}
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

