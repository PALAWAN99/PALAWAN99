import { Modal, Stack, Button, Divider, Group, TextInput, Select, Text, Card, Badge, Avatar, LoadingOverlay, Table } from '@mantine/core';
import { IconId, IconMail, IconPhone, IconCalendar, IconClockHour4 } from '@tabler/icons-react';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { Member } from '../types';

interface MemberModalsProps {
  opened: boolean;
  onClose: () => void;
  isEdit: boolean;
  formData: any;
  setFormData: (data: any) => void;
  loading: boolean;
  readingId: boolean;
  handleReadIdCard: () => void;
  handleSubmit: () => void;
  renewOpened: boolean;
  onCloseRenew: () => void;
  renewMember: Member | null;
  renewDate: Date | null;
  setRenewDate: (date: Date | null) => void;
  renewLoading: boolean;
  handleRenew: () => void;
  t: (key: string) => string;
  historyOpened: boolean;
  closeHistory: () => void;
  historyLoading: boolean;
  accessHistory: any[];
  selectedMember: Member | null;
}

const PREFIX_MAP: Record<string, string> = {
  'นาย': 'Mr.',
  'นาง': 'Mrs.',
  'นางสาว': 'Ms.',
  'เด็กชาย': 'Master',
  'เด็กหญิง': 'Miss',
};

export function MemberModals({
  opened, onClose, isEdit, formData, setFormData, loading, readingId, handleReadIdCard, handleSubmit,
  renewOpened, onCloseRenew, renewMember, renewDate, setRenewDate, renewLoading, handleRenew, t,
  historyOpened, closeHistory, historyLoading, accessHistory, selectedMember
}: MemberModalsProps) {
  return (
    <>
      {/* Renew Modal */}
      <Modal opened={renewOpened} onClose={onCloseRenew} title={<Group gap="xs"><IconClockHour4 size={20} color="teal" /><Text fw={600}>ต่ออายุสมาชิก</Text></Group>} size="sm">
        {renewMember && (
          <Stack gap="md">
            <Card withBorder radius="md" p="sm" bg="var(--mantine-color-teal-0)">
               <Group gap="sm">
                 <Avatar color="blue" radius="xl">{renewMember.firstNameTh[0]}</Avatar>
                 <div><Text fw={600}>{renewMember.firstNameTh} {renewMember.lastNameTh}</Text><Text size="xs" c="dimmed">รหัส: {renewMember.memberNo}</Text></div>
               </Group>
            </Card>
            <TextInput label="วันหมดอายุใหม่" type="date" value={renewDate ? renewDate.toISOString().split('T')[0] : ''} onChange={(e) => setRenewDate(e.target.value ? new Date(e.target.value) : null)} />
            <Group justify="flex-end"><Button variant="light" onClick={onCloseRenew}>ยกเลิก</Button><Button color="teal" onClick={handleRenew} loading={renewLoading}>ต่ออายุ</Button></Group>
          </Stack>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal opened={opened} onClose={onClose} title={<Text fw={600}>{isEdit ? 'แก้ไขข้อมูล' : 'เพิ่มสมาชิกใหม่'}</Text>} size="lg">
        <Stack gap="md">
          {!isEdit && <Button variant="light" leftSection={<IconId size={18} />} loading={readingId} onClick={handleReadIdCard}>อ่านบัตรประชาชน</Button>}
          <Group grow>
            <TextInput label="รหัสสมาชิก" required value={formData.memberNo} onChange={e => setFormData({...formData, memberNo: e.target.value})} />
            <TextInput label="เลขบัตรประชาชน" value={formData.citizenId} onChange={e => setFormData({...formData, citizenId: e.target.value})} />
          </Group>
          <Group grow>
             <Select label="คำนำหน้า" data={['นาย', 'นาง', 'นางสาว']} value={formData.prefixTh} onChange={val => setFormData({...formData, prefixTh: val || ''})} />
             <TextInput label="ชื่อ (ไทย)" required value={formData.firstNameTh} onChange={e => setFormData({...formData, firstNameTh: e.target.value})} />
             <TextInput label="นามสกุล (ไทย)" required value={formData.lastNameTh} onChange={e => setFormData({...formData, lastNameTh: e.target.value})} />
          </Group>
          <Group grow>
            <TextInput label="อีเมล" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <TextInput label="เบอร์โทรศัพท์" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </Group>
          <Group justify="flex-end"><Button variant="light" onClick={onClose}>ยกเลิก</Button><Button onClick={handleSubmit} loading={loading}>บันทึก</Button></Group>
        </Stack>
      </Modal>

      {/* History Modal */}
      <Modal
        opened={historyOpened}
        onClose={closeHistory}
        title={
          <Group gap="xs">
            <IconClockHour4 size={20} />
            <Text fw={600} size="lg">
              ประวัติการเข้า-ออก: {selectedMember?.firstNameTh} {selectedMember?.lastNameTh}
            </Text>
          </Group>
        }
        size="xl"
      >
        <Stack gap="md" style={{ minHeight: 400, position: 'relative' }}>
          <LoadingOverlay visible={historyLoading} overlayProps={{ blur: 2 }} />
          
          {accessHistory.length > 0 ? (
            <Table.ScrollContainer minWidth={600}>
              <Table verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>วัน/เวลา</Table.Th>
                    <Table.Th>ประตู/จุดควบคุม</Table.Th>
                    <Table.Th>ทิศทาง</Table.Th>
                    <Table.Th>สถานะ</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {accessHistory.map((event) => (
                    <Table.Tr key={event.id}>
                      <Table.Td>
                        <Stack gap={0}>
                          <Text size="sm" fw={500}>
                            {dayjs(event.scannedAt).format('D MMM YYYY')}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {dayjs(event.scannedAt).format('HH:mm:ss')} น.
                          </Text>
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{event.gate?.nameTh || 'ไม่ระบุ'}</Text>
                        <Text size="xs" c="dimmed">{event.gate?.nameEn || ''}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          variant="light" 
                          color={event.direction === 'IN' ? 'blue' : 'orange'}
                        >
                          {event.direction === 'IN' ? 'เข้า' : 'ออก'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          color={event.decision === 'ALLOWED' ? 'green' : 'red'}
                        >
                          {event.decision === 'ALLOWED' ? 'ผ่าน' : 'ปฏิเสธ'}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          ) : !historyLoading && (
            <Stack align="center" py={60} gap="xs">
              <IconClockHour4 size={40} color="var(--mantine-color-dimmed)" />
              <Text c="dimmed">ไม่พบประวัติการเข้า-ออก</Text>
            </Stack>
          )}
          
          <Group justify="flex-end">
            <Button variant="light" color="gray" onClick={closeHistory}>
              ปิดหน้าต่าง
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
