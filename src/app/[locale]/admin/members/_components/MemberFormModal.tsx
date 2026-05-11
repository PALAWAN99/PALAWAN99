import { Modal, Stack, Button, Group, TextInput, Select, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconId } from '@tabler/icons-react';

interface MemberFormModalProps {
  opened: boolean;
  onClose: () => void;
  isEdit: boolean;
  formData: any;
  setFormData: (data: any) => void;
  loading: boolean;
  readingId: boolean;
  handleReadIdCard: () => void;
  handleSubmit: () => void;
}

  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={<Text fw={600}>{isEdit ? 'แก้ไขข้อมูล' : 'เพิ่มสมาชิกใหม่'}</Text>} 
      size="lg"
      fullScreen={isMobile}
      transitionProps={{ transition: 'fade', duration: 200 }}
    >
      <Stack gap="md">
        {!isEdit && (
          <Button 
            variant="light" 
            leftSection={<IconId size={18} />} 
            loading={readingId} 
            onClick={handleReadIdCard}
            fullWidth={isMobile}
          >
            อ่านบัตรประชาชน
          </Button>
        )}
        <Group grow wrap={isMobile ? 'wrap' : 'nowrap'}>
          <TextInput 
            label="รหัสสมาชิก" 
            required 
            value={formData.memberNo} 
            onChange={e => setFormData({...formData, memberNo: e.target.value})} 
            w={isMobile ? '100%' : undefined}
          />
          <TextInput 
            label="เลขบัตรประชาชน" 
            value={formData.citizenId} 
            onChange={e => setFormData({...formData, citizenId: e.target.value})} 
            w={isMobile ? '100%' : undefined}
          />
        </Group>
        <Group grow wrap={isMobile ? 'wrap' : 'nowrap'}>
           <Select 
            label="คำนำหน้า" 
            data={['นาย', 'นาง', 'นางสาว']} 
            value={formData.prefixTh} 
            onChange={val => setFormData({...formData, prefixTh: val || ''})} 
            w={isMobile ? '100%' : undefined}
          />
           <TextInput 
            label="ชื่อ (ไทย)" 
            required 
            value={formData.firstNameTh} 
            onChange={e => setFormData({...formData, firstNameTh: e.target.value})} 
            w={isMobile ? '100%' : undefined}
          />
           <TextInput 
            label="นามสกุล (ไทย)" 
            required 
            value={formData.lastNameTh} 
            onChange={e => setFormData({...formData, lastNameTh: e.target.value})} 
            w={isMobile ? '100%' : undefined}
          />
        </Group>
        <Group grow wrap={isMobile ? 'wrap' : 'nowrap'}>
          <TextInput 
            label="อีเมล" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            w={isMobile ? '100%' : undefined}
          />
          <TextInput 
            label="เบอร์โทรศัพท์" 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
            w={isMobile ? '100%' : undefined}
          />
        </Group>
        <Group justify="flex-end" grow={isMobile}>
          <Button variant="light" onClick={onClose}>ยกเลิก</Button>
          <Button onClick={handleSubmit} loading={loading}>บันทึก</Button>
        </Group>
      </Stack>
    </Modal>
  );
}
