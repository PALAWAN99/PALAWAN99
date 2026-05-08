'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Title,
  Text,
  Stack,
  Card,
  Group,
  Tabs,
  Table,
  Badge,
  ActionIcon,
  ScrollArea,
  Tooltip,
  Loader,
  Center,
  Avatar,
  Box,
  Divider,
} from '@mantine/core';
import { 
  IconShieldLock, 
  IconHistory, 
  IconUserShield, 
  IconInfoCircle,
  IconEye,
  IconDatabase,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
  };
}

export default function SecurityPage() {
  const t = useTranslations('Security');
  const tc = useTranslations('Common');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>('audit');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit?limit=20');
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'audit') {
      fetchLogs();
    }
  }, [activeTab, fetchLogs]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'teal';
      case 'UPDATE': return 'blue';
      case 'DELETE': return 'red';
      default: return 'gray';
    }
  };

  const auditRows = logs.map((log) => (
    <Table.Tr key={log.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar color="navy" radius="xl" size="sm">
            {log.user?.fullName?.charAt(0) || 'U'}
          </Avatar>
          <div>
            <Text size="sm" fw={500}>{log.user?.fullName || 'System'}</Text>
            <Text size="xs" c="dimmed">{log.user?.email}</Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge color={getActionColor(log.action)} variant="light" size="sm">
          {log.action}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={4}>
          <IconDatabase size={14} color="var(--text-muted)" />
          <Text size="sm">{log.resource}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text size="xs" c="dimmed" fontFamily="monospace">
          {log.resourceId?.substring(0, 8)}...
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{dayjs(log.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
      </Table.Td>
      <Table.Td>
        <Tooltip label={tc('view')}>
          <ActionIcon variant="subtle" color="gray">
            <IconEye size={16} />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Group gap="xs" mb={4}>
            <IconShieldLock size={28} color="var(--color-navy)" />
            <Title order={2} c="var(--text-primary)">{t('title')}</Title>
          </Group>
          <Text size="sm" c="var(--text-secondary)">
            {t('subtitle')}
          </Text>
        </div>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
        <Tabs.List mb="md">
          <Tabs.Tab value="audit" leftSection={<IconHistory size={16} />}>
            {t('auditTrail')}
          </Tabs.Tab>
          <Tabs.Tab value="permissions" leftSection={<IconUserShield size={16} />}>
            {t('permissions')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="audit">
          <Card withBorder p={0} radius="md">
            <ScrollArea>
              <Table verticalSpacing="sm" highlightOnHover>
                <Table.Thead bg="var(--bg-tertiary)">
                  <Table.Tr>
                    <Table.Th>{t('admin')}</Table.Th>
                    <Table.Th>{t('action')}</Table.Th>
                    <Table.Th>{t('resource')}</Table.Th>
                    <Table.Th>{t('refId')}</Table.Th>
                    <Table.Th>{t('datetime')}</Table.Th>
                    <Table.Th w={80}></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {loading ? (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Center py="xl"><Loader size="sm" /></Center>
                      </Table.Td>
                    </Table.Tr>
                  ) : logs.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Center py="xl"><Text c="dimmed">{t('empty')}</Text></Center>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    auditRows
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="permissions">
          <Stack gap="md">
            <Card withBorder radius="md" p="xl">
              <Group mb="lg">
                <IconInfoCircle size={20} color="var(--color-sky)" />
                <Text fw={600} size="lg">{t('matrixTitle')}</Text>
              </Group>
              
              <Text size="sm" c="dimmed" mb="xl">
                {t('matrixSubtitle')}
              </Text>

              <Stack gap="xl">
                <RoleInfo 
                  role="SUPER_ADMIN" 
                  title="Super Admin" 
                  color="red"
                  badges={['Full Access', 'System Config']}
                />
                <Divider variant="dashed" />
                <RoleInfo 
                  role="ADMIN" 
                  title="Admin" 
                  color="blue"
                  badges={['Manage Gates', 'Manage Members']}
                />
                <Divider variant="dashed" />
                <RoleInfo 
                  role="GATE_OFFICER" 
                  title="Gate Officer" 
                  color="teal"
                  badges={['View Status', 'Scan QR']}
                />
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

function RoleInfo({ role, title, color, badges }: any) {
  return (
    <Group align="flex-start" wrap="nowrap">
      <Box w={180}>
        <Badge color={color} variant="filled" fullWidth size="lg" radius="sm">
          {role}
        </Badge>
      </Box>
      <Stack gap={4} style={{ flex: 1 }}>
        <Text fw={700}>{title}</Text>
        <Group gap="xs" mt={4}>
          {badges.map((b: string) => (
            <Badge key={b} variant="light" color={color} size="xs">
              {b}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Group>
  );
}
