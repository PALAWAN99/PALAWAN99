import { Modal, Stack, Button, Group, TextInput, Avatar, Text, Card } from '@mantine/core';
import { IconClockHour4 } from '@tabler/icons-react';
import { Member } from '../types';

interface MemberRenewModalProps {
  opened: boolean;
  onClose: () => void;
  member: Member | null;
  renewDate: Date | null;
  onDateChange: (date: Date | null) => void;
  loading: boolean;
  onConfirm: () => void;
}

export function MemberRenewModal({
  opened, onClose, member, renewDate, onDateChange, loading, onConfirm
}: MemberRenewModalProps) {
  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={<Group gap="xs"><IconClockHour4 size={20} color="teal" /><Text fw={600}>ต่ออายุสมาชิก</Text></Group>} 
      size="sm"
    >
      {member && (
        <Stack gap="md">
          <Card withBorder radius="md" p="sm" bg="var(--mantine-color-teal-0)">
             <Group gap="sm">
               <Avatar color="blue" radius="xl">{member.firstNameTh[0]}</Avatar>
               <div>
                 <Text fw={600}>{member.firstNameTh} {member.lastNameTh}</Text>
                 <Text size="xs" c="dimmed">รหัส: {member.memberNo}</Text>
               </div>
             </Group>
          </Card>
          <TextInput 
            label="วันหมดอายุใหม่" 
            type="date" 
            value={renewDate ? renewDate.toISOString().split('T')[0] : ''} 
            onChange={(e) => onDateChange(e.target.value ? new Date(e.target.value) : null)} 
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={onClose}>ยกเลิก</Button>
            <Button color="teal" onClick={onConfirm} loading={loading}>ต่ออายุ</Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
