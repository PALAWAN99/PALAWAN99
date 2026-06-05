import { Modal, Group, Stack, Text, LoadingOverlay, Table, Badge, Button } from '@mantine/core';
import { IconClockHour4 } from '@tabler/icons-react';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { Member } from '../types';

interface MemberHistoryModalProps {
  opened: boolean;
  onClose: () => void;
  loading: boolean;
  history: any[];
  member: Member | null;
}

export function MemberHistoryModal({
  opened,
  onClose,
  loading,
  history,
  member
}: MemberHistoryModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconClockHour4 size={20} />
          <Text fw={600} size="lg">
            ประวัติการเข้า-ออก: {member?.firstNameTh} {member?.lastNameTh}
          </Text>
        </Group>
      }
      size="xl"
    >
      <Stack gap="md" style={{ minHeight: 400, position: 'relative' }}>
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        
        {history.length > 0 ? (
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
                {history.map((event) => (
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
        ) : !loading && (
          <Stack align="center" py={60} gap="xs">
            <IconClockHour4 size={40} color="var(--mantine-color-dimmed)" />
            <Text c="dimmed">ไม่พบประวัติการเข้า-ออก</Text>
          </Stack>
        )}
        
        <Group justify="flex-end">
          <Button variant="light" color="gray" onClick={onClose}>
            ปิดหน้าต่าง
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
