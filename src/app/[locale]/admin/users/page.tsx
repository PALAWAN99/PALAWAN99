'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  Table,
  Badge,
  ActionIcon,
  TextInput,
  Menu,
  Box,
  LoadingOverlay,
  Modal,
  PasswordInput,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconUserPlus,
  IconSearch,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconLock,
  IconCheck,
  IconX,
  IconShield,
} from '@tabler/icons-react';

import { useTranslations } from 'next-intl';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'red',
  ADMIN: 'blue',
  GATE_OFFICER: 'teal',
  VIEWER: 'gray',
};

export default function UsersPage() {
  const t = useTranslations('Users');
  const tc = useTranslations('Common');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const ROLES_DATA = [
    { value: 'SUPER_ADMIN', label: `Super Admin (${t('roleSelect')})` },
    { value: 'ADMIN', label: `Admin (${t('roleSelect')})` },
    { value: 'GATE_OFFICER', label: `Gate Officer (${t('roleSelect')})` },
    { value: 'VIEWER', label: `Viewer (${t('roleSelect')})` },
  ];

  const form = useForm({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'ADMIN',
    },
    validate: {
      fullName: (value) => (value.length < 2 ? t('fullName') : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : t('email')),
      password: (value) => (value.length < 6 ? t('password') : null),
      role: (value) => (!value ? t('roleSelect') : null),
    },
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (values: typeof form.values) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        notifications.show({
          title: tc('success'),
          message: t('successMessage') || 'Account created',
          color: 'green',
          icon: <IconCheck size={18} />,
        });
        setModalOpened(false);
        form.reset();
        fetchUsers();
      } else {
        throw new Error(data.error || 'Failed to create user');
      }
    } catch (error: any) {
      notifications.show({
        title: tc('error'),
        message: error.message,
        color: 'red',
        icon: <IconX size={18} />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-end">
          <Stack gap={0}>
            <Title order={2} style={{ color: '#F8FAFC' }}>
              {t('title')}
            </Title>
            <Text size="sm" c="dimmed">
              {t('subtitle')}
            </Text>
          </Stack>
          <Button 
            leftSection={<IconUserPlus size={18} />} 
            color="skyBlue"
            style={{ fontWeight: 600 }}
            onClick={() => setModalOpened(true)}
          >
            {t('addUser')}
          </Button>
        </Group>

        {/* Filters & Search */}
        <Card withBorder p="md" radius="lg" style={{ background: 'rgba(30, 41, 59, 0.5)', borderColor: '#334155' }}>
          <TextInput
            placeholder={t('searchPlaceholder')}
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            styles={{
              input: { backgroundColor: '#0F172A', borderColor: '#475569', color: '#F8FAFC' }
            }}
          />
        </Card>

        {/* Users Table */}
        <Card withBorder radius="lg" p={0} style={{ position: 'relative', overflow: 'hidden', background: 'rgba(30, 41, 59, 0.5)', borderColor: '#334155' }}>
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 2 }} />
          
          <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="md" highlightOnHover>
              <Table.Thead style={{ background: '#1E293B' }}>
                <Table.Tr>
                  <Table.Th style={{ color: '#94A3B8' }}>{t('user')}</Table.Th>
                  <Table.Th style={{ color: '#94A3B8' }}>{t('role')}</Table.Th>
                  <Table.Th style={{ color: '#94A3B8' }}>{t('status')}</Table.Th>
                  <Table.Th style={{ color: '#94A3B8' }}>{t('createdAt')}</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredUsers.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td>
                      <Stack gap={0}>
                        <Text fw={600} size="sm" style={{ color: '#F8FAFC' }}>
                          {user.fullName}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {user.email}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={ROLE_COLORS[user.role]} variant="light">
                        {user.role}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {user.isActive ? (
                        <Badge color="green" variant="dot">{t('active')}</Badge>
                      ) : (
                        <Badge color="red" variant="dot">{t('inactive')}</Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" style={{ color: '#94A3B8' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group justify="flex-end">
                        <Menu shadow="md" width={200} position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Label>{t('management')}</Menu.Label>
                            <Menu.Item leftSection={<IconEdit size={14} />}>{t('edit')}</Menu.Item>
                            <Menu.Item leftSection={<IconLock size={14} />}>{t('resetPassword')}</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item 
                              color="red" 
                              leftSection={<IconTrash size={14} />}
                            >
                              {t('suspend')}
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
          
          {filteredUsers.length === 0 && !loading && (
            <Box py={50} ta="center">
              <Text c="dimmed">{tc('noData') || 'No records found'}</Text>
            </Box>
          )}
        </Card>

        {/* Add User Modal */}
        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          title={<Group gap="xs"><IconUserPlus size={20} /><Text fw={700}>{t('modalTitle')}</Text></Group>}
          size="md"
          radius="md"
          overlayProps={{ blur: 3, opacity: 0.55 }}
        >
          <form onSubmit={form.onSubmit(handleCreateUser)}>
            <Stack gap="md">
              <TextInput
                label={t('fullName')}
                placeholder={t('fullName')}
                required
                {...form.getInputProps('fullName')}
              />
              <TextInput
                label={t('email')}
                placeholder={t('email')}
                required
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label={t('password')}
                placeholder={t('password')}
                required
                {...form.getInputProps('password')}
              />
              <Select
                label={t('roleSelect')}
                placeholder={t('roleSelect')}
                required
                data={ROLES_DATA}
                leftSection={<IconShield size={16} />}
                {...form.getInputProps('role')}
              />
              <Group justify="flex-end" mt="xl">
                <Button variant="subtle" color="gray" onClick={() => setModalOpened(false)}>
                  {tc('cancel')}
                </Button>
                <Button 
                  color="skyBlue" 
                  type="submit" 
                  loading={submitting}
                  leftSection={<IconUserPlus size={18} />}
                >
                  {t('createAccount')}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Stack>
    </Container>
  );
}
