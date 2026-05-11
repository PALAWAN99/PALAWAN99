'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Table,
  Badge,
  TextInput,
  Group,
  LoadingOverlay,
  Code,
  Modal,
  ActionIcon,
  ScrollArea,
  Box,
} from '@mantine/core';
import { IconSearch, IconEye, IconHistory } from '@tabler/icons-react';

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  before: Record<string, any> | null;
  after: Record<string, any> | null;
  ipAddress: string | null;
  createdAt: string;
  user?: {
    fullName: string;
    email: string;
  };
}

export default function AuditPage() {
  const t = useTranslations();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/audit');
        const data = await res.json();
        if (isMounted && Array.isArray(data)) setLogs(data);
      } catch (error) {
        console.error('Fetch logs failed:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase()) ||
      log.user?.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'green';
    if (action.includes('UPDATE')) return 'blue';
    if (action.includes('DELETE')) return 'red';
    return 'gray';
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Stack gap={0}>
          <Title order={2} style={{ color: '#F8FAFC' }}>
            <Group gap="xs"><IconHistory size={28} />{t('Security.auditLogs')}</Group>
          </Title>
          <Text size="sm" c="dimmed">{t('Security.auditDesc')}</Text>
        </Stack>

        <Card withBorder p="md" radius="lg" style={{ background: 'rgba(30, 41, 59, 0.5)', borderColor: '#334155' }}>
          <TextInput
            placeholder={t('Security.searchLogs')}
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </Card>

        <Card withBorder radius="lg" p={0} style={{ position: 'relative', overflow: 'hidden', background: 'rgba(30, 41, 59, 0.5)', borderColor: '#334155' }}>
          <LoadingOverlay visible={loading} />
          <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="md" highlightOnHover>
              <Table.Thead style={{ background: '#1E293B' }}>
                <Table.Tr>
                  <Table.Th style={{ color: '#94A3B8' }}>{t('Common.timestamp')}</Table.Th>
                  <Table.Th style={{ color: '#94A3B8' }}>{t('Common.user')}</Table.Th>
                  <Table.Th style={{ color: '#94A3B8' }}>{t('Security.action')}</Table.Th>
                  <Table.Th style={{ color: '#94A3B8' }}>{t('Security.resource')}</Table.Th>
                  <Table.Th style={{ color: '#94A3B8' }}>IP Address</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredLogs.map((log) => (
                  <Table.Tr key={log.id}>
                    <Table.Td>
                      <Text size="sm" style={{ color: '#F8FAFC' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={0}>
                        <Text fw={600} size="sm" style={{ color: '#F8FAFC' }}>
                          {log.user?.fullName || 'System'}
                        </Text>
                        <Text size="xs" c="dimmed">{log.user?.email || '-'}</Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getActionColor(log.action)} variant="light">
                        {log.action}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" style={{ color: '#F8FAFC' }}>{log.resource}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">{log.ipAddress || '-'}</Text>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon 
                        variant="subtle" 
                        color="skyBlue" 
                        onClick={() => setSelectedLog(log)}
                      >
                        <IconEye size={18} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
          {filteredLogs.length === 0 && !loading && (
            <Box py={50} ta="center"><Text c="dimmed">{t('Common.noData')}</Text></Box>
          )}
        </Card>

        {/* Modal แสดงรายละเอียด JSON */}
        <Modal
          opened={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={t('Security.logDetails')}
          size="lg"
          radius="md"
        >
          {selectedLog && (
            <Stack gap="md">
              <Group grow>
                <Stack gap={4}>
                  <Text size="xs" fw={700} c="dimmed">ข้อมูลก่อนเปลี่ยน (Before)</Text>
                  <ScrollArea h={200} offsetScrollbars>
                    <Code block color="gray.1">
                      {selectedLog.before ? JSON.stringify(selectedLog.before, null, 2) : 'ไม่มีข้อมูล'}
                    </Code>
                  </ScrollArea>
                </Stack>
                <Stack gap={4}>
                  <Text size="xs" fw={700} c="dimmed">ข้อมูลหลังเปลี่ยน (After)</Text>
                  <ScrollArea h={200} offsetScrollbars>
                    <Code block color="blue.0">
                      {selectedLog.after ? JSON.stringify(selectedLog.after, null, 2) : 'ไม่มีข้อมูล'}
                    </Code>
                  </ScrollArea>
                </Stack>
              </Group>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  );
}
