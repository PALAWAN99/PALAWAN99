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
} from '@mantine/core';
import {
  IconUserPlus,
  IconSearch,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconLock,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
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
              ผู้ใช้ระบบ (System Users)
            </Title>
            <Text size="sm" c="dimmed">
              จัดการสิทธิ์การเข้าถึงสำหรับผู้ดูแลระบบและเจ้าหน้าที่ประจำจุด
            </Text>
          </Stack>
          <Button 
            leftSection={<IconUserPlus size={18} />} 
            color="skyBlue"
            style={{ fontWeight: 600 }}
          >
            เพิ่มผู้ใช้ใหม่
          </Button>
        </Group>

        {/* Filters & Search */}
        <Card withBorder p="md" radius="lg" style={{ background: 'rgba(30, 41, 59, 0.5)', borderColor: '#334155' }}>
          <TextInput
            placeholder="ค้นหาชื่อ หรือ อีเมล..."
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
                  <Table.Th style={{ color: '#94A3B8' }}>ผู้ใช้</Table.Th>
                  <Table.Th style={{ color: '#94A3B8' }}>สิทธิ์ (Role)</Table.Th>
                  <Table.Th style={{ color: '#94A3B8' }}>สถานะ</Table.Th>
                  <Table.Th style={{ color: '#94A3B8' }}>วันที่สร้าง</Table.Th>
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
                        <Badge color="green" variant="dot">ปกติ</Badge>
                      ) : (
                        <Badge color="red" variant="dot">ระงับการใช้งาน</Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" style={{ color: '#94A3B8' }}>
                        {new Date(user.createdAt).toLocaleDateString('th-TH')}
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
                            <Menu.Label>การจัดการ</Menu.Label>
                            <Menu.Item leftSection={<IconEdit size={14} />}>แก้ไขข้อมูล</Menu.Item>
                            <Menu.Item leftSection={<IconLock size={14} />}>รีเซ็ตรหัสผ่าน</Menu.Item>
                            <Menu.Divider />
                            <Menu.Item 
                              color="red" 
                              leftSection={<IconTrash size={14} />}
                            >
                              ระงับการใช้งาน
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
              <Text c="dimmed">ไม่พบข้อมูลผู้ใช้</Text>
            </Box>
          )}
        </Card>
      </Stack>
    </Container>
  );
}
