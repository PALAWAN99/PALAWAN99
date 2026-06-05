'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import {
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
  LoadingOverlay,
  Modal,
  PasswordInput,
  Select,
  Tooltip,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconUserPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconLock,
  IconCheck,
  IconX,
  IconShield,
  IconUserOff,
  IconUserCheck,
} from '@tabler/icons-react';
import { UserRole } from '@prisma/client';

import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage, unwrapApiList } from '@/lib/parse-api-response';

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'red',
  ADMIN: 'blue',
  LIBRARIAN: 'cyan',
  STAFF: 'teal',
  SECURITY: 'orange',
  GATE_OFFICER: 'violet',
  VIEWER: 'gray',
};

const ALL_ROLES = Object.values(UserRole);

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
};

const EMPTY_FORM: FormValues = {
  fullName: '',
  email: '',
  password: '',
  role: UserRole.ADMIN,
  isActive: true,
};

export function AdminUsersClient() {
  const t = useTranslations('Users');
  const tc = useTranslations('Common');
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const currentRole = session?.user?.role;
  const canManage = currentRole === 'SUPER_ADMIN';

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'password' | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const settersRef = useRef({ setUsers, setLoading, setForbidden });
  settersRef.current = { setUsers, setLoading, setForbidden };

  const roleOptions = useMemo(
    () =>
      ALL_ROLES.map((role) => ({
        value: role,
        label: t(`roles.${role}`),
      })),
    [t],
  );

  const form = useForm<FormValues>({
    initialValues: EMPTY_FORM,
    validate: {
      fullName: (v) => (v.trim().length < 2 ? t('fullNameRequired') : null),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : t('emailInvalid')),
      password: (v) => {
        if (modalMode === 'password' || modalMode === 'create') {
          return v.length < 6 ? t('passwordMin') : null;
        }
        if (modalMode === 'edit' && v && v.length < 6) return t('passwordMin');
        return null;
      },
      role: (v) => (!v ? t('roleRequired') : null),
    },
  });

  const fetchUsers = useCallback(async () => {
    const setters = settersRef.current;
    setters.setLoading(true);
    setters.setForbidden(false);
    try {
      const res = await fetch(apiPath('/api/admin/users'));
      const json = await res.json();
      if (res.status === 403) {
        setters.setForbidden(true);
        setters.setUsers([]);
        return;
      }
      if (!res.ok) {
        throw new Error(getApiErrorMessage(json) || tc('error'));
      }
      setters.setUsers(unwrapApiList<AdminUser>(json));
    } catch (error) {
      notifications.show({
        title: tc('error'),
        message: error instanceof Error ? error.message : tc('error'),
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setters.setLoading(false);
    }
  }, [tc]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const closeModal = () => {
    setModalMode(null);
    setEditingUser(null);
    form.reset();
  };

  const openCreate = () => {
    setEditingUser(null);
    setModalMode('create');
    form.setValues(EMPTY_FORM);
  };

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setModalMode('edit');
    form.setValues({
      fullName: user.fullName,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive,
    });
  };

  const openPasswordReset = (user: AdminUser) => {
    setEditingUser(user);
    setModalMode('password');
    form.setValues({
      fullName: user.fullName,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive,
    });
  };

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        const res = await fetch(apiPath('/api/admin/users'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: values.fullName.trim(),
            email: values.email.trim(),
            password: values.password,
            role: values.role,
            isActive: values.isActive,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(getApiErrorMessage(json) || tc('error'));
        notifications.show({
          title: tc('success'),
          message: json.message ?? t('createSuccess'),
          color: 'teal',
          icon: <IconCheck size={16} />,
        });
      } else if (modalMode === 'edit' && editingUser) {
        const body: Record<string, unknown> = {
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          role: values.role,
          isActive: values.isActive,
        };
        if (values.password) body.password = values.password;

        const res = await fetch(apiPath(`/api/admin/users/${editingUser.id}`), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(getApiErrorMessage(json) || tc('error'));
        notifications.show({
          title: tc('success'),
          message: json.message ?? t('updateSuccess'),
          color: 'teal',
          icon: <IconCheck size={16} />,
        });
      } else if (modalMode === 'password' && editingUser) {
        const res = await fetch(apiPath(`/api/admin/users/${editingUser.id}`), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: values.password }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(getApiErrorMessage(json) || tc('error'));
        notifications.show({
          title: tc('success'),
          message: t('passwordResetSuccess'),
          color: 'teal',
          icon: <IconCheck size={16} />,
        });
      }
      closeModal();
      await fetchUsers();
    } catch (error) {
      notifications.show({
        title: tc('error'),
        message: error instanceof Error ? error.message : tc('error'),
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = (user: AdminUser) => {
    const nextActive = !user.isActive;
    modals.openConfirmModal({
      title: nextActive ? t('activateConfirmTitle') : t('suspendConfirmTitle'),
      centered: true,
      children: (
        <Text size="sm">
          {nextActive
            ? t('activateConfirmMessage', { name: user.fullName })
            : t('suspendConfirmMessage', { name: user.fullName })}
        </Text>
      ),
      labels: { confirm: nextActive ? t('activate') : t('suspend'), cancel: tc('cancel') },
      confirmProps: { color: nextActive ? 'teal' : 'orange' },
      onConfirm: async () => {
        try {
          const res = await fetch(apiPath(`/api/admin/users/${user.id}`), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: nextActive }),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(getApiErrorMessage(json) || tc('error'));
          notifications.show({
            title: tc('success'),
            message: json.message ?? (nextActive ? t('activateSuccess') : t('suspendSuccess')),
            color: 'teal',
            icon: <IconCheck size={16} />,
          });
          await fetchUsers();
        } catch (error) {
          notifications.show({
            title: tc('error'),
            message: error instanceof Error ? error.message : tc('error'),
            color: 'red',
            icon: <IconX size={16} />,
          });
        }
      },
    });
  };

  const requestDelete = (user: AdminUser) => {
    modals.openConfirmModal({
      title: t('deleteConfirmTitle'),
      centered: true,
      children: (
        <Text size="sm">{t('deleteConfirmMessage', { name: user.fullName, email: user.email })}</Text>
      ),
      labels: { confirm: t('deleteConfirmButton'), cancel: tc('cancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const res = await fetch(apiPath(`/api/admin/users/${user.id}`), { method: 'DELETE' });
          const json = await res.json();
          if (!res.ok) throw new Error(getApiErrorMessage(json) || tc('error'));
          notifications.show({
            title: tc('success'),
            message: json.message ?? t('deleteSuccess'),
            color: 'teal',
            icon: <IconCheck size={16} />,
          });
          await fetchUsers();
        } catch (error) {
          notifications.show({
            title: tc('error'),
            message: error instanceof Error ? error.message : tc('error'),
            color: 'red',
            icon: <IconX size={16} />,
          });
        }
      },
    });
  };

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const roleLabel = t(`roles.${u.role}`).toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        roleLabel.includes(q)
      );
    });
  }, [search, t, users]);

  const modalTitle =
    modalMode === 'create'
      ? t('modalTitle')
      : modalMode === 'password'
        ? t('resetPasswordTitle')
        : t('editModalTitle');

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <div>
          <Title order={2}>{t('title')}</Title>
          <Text size="sm" c="dimmed" mt={4}>
            {t('subtitle')}
          </Text>
        </div>
        {canManage ? (
          <Button leftSection={<IconUserPlus size={18} />} color="skyBlue" onClick={openCreate}>
            {t('addUser')}
          </Button>
        ) : null}
      </Group>

      {!canManage ? (
        <Alert color="blue" variant="light">
          {t('readOnlyHint')}
          {currentRole ? (
            <>
              {' '}
              ({t('yourRole')}: {t(`roles.${currentRole}`)})
            </>
          ) : null}
        </Alert>
      ) : null}

      {forbidden ? (
        <Alert color="red" title={tc('error')}>
          {t('forbidden')}
        </Alert>
      ) : null}

      <Card withBorder p="md" radius="md">
        <Group justify="space-between" wrap="wrap" gap="sm">
          <TextInput
            placeholder={t('searchPlaceholder')}
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1, minWidth: 240 }}
          />
          <Badge size="lg" variant="light" color="navy">
            {t('resultCount', { count: filteredUsers.length, total: users.length })}
          </Badge>
        </Group>
      </Card>

      <Card withBorder p={0} radius="md" style={{ position: 'relative', overflow: 'hidden' }}>
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 2 }} />
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead bg="var(--bg-tertiary)">
              <Table.Tr>
                <Table.Th>{t('user')}</Table.Th>
                <Table.Th>{t('role')}</Table.Th>
                <Table.Th>{t('status')}</Table.Th>
                <Table.Th>{t('createdAt')}</Table.Th>
                {canManage ? <Table.Th w={140}>{t('management')}</Table.Th> : null}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredUsers.map((user) => {
                const isSelf = user.id === currentUserId;
                return (
                  <Table.Tr key={user.id}>
                    <Table.Td>
                      <Stack gap={0}>
                        <Group gap="xs">
                          <Text fw={600} size="sm">
                            {user.fullName}
                          </Text>
                          {isSelf ? (
                            <Badge size="xs" variant="outline" color="gray">
                              {t('you')}
                            </Badge>
                          ) : null}
                        </Group>
                        <Text size="xs" c="dimmed">
                          {user.email}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={ROLE_COLORS[user.role] ?? 'gray'} variant="light">
                        {t(`roles.${user.role}`)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {user.isActive ? (
                        <Badge color="green" variant="dot">
                          {t('active')}
                        </Badge>
                      ) : (
                        <Badge color="red" variant="dot">
                          {t('inactive')}
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {new Date(user.createdAt).toLocaleDateString('th-TH')}
                      </Text>
                    </Table.Td>
                    {canManage ? (
                      <Table.Td>
                        <Group gap={4} justify="flex-end" wrap="nowrap">
                          <Tooltip label={t('edit')}>
                            <ActionIcon
                              variant="light"
                              color="skyBlue"
                              aria-label={t('edit')}
                              onClick={() => openEdit(user)}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label={t('resetPassword')}>
                            <ActionIcon
                              variant="light"
                              color="gray"
                              aria-label={t('resetPassword')}
                              onClick={() => openPasswordReset(user)}
                            >
                              <IconLock size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label={user.isActive ? t('suspend') : t('activate')}>
                            <ActionIcon
                              variant="light"
                              color={user.isActive ? 'orange' : 'teal'}
                              aria-label={user.isActive ? t('suspend') : t('activate')}
                              disabled={isSelf && user.isActive}
                              onClick={() => toggleActive(user)}
                            >
                              {user.isActive ? <IconUserOff size={16} /> : <IconUserCheck size={16} />}
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label={t('delete')}>
                            <span style={{ display: 'inline-flex' }}>
                              <ActionIcon
                                variant="light"
                                color="red"
                                aria-label={t('delete')}
                                disabled={isSelf}
                                onClick={() => requestDelete(user)}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </span>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    ) : null}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        {filteredUsers.length === 0 && !loading ? (
          <Text ta="center" py="xl" c="dimmed">
            {search.trim() ? t('noSearchResults') : tc('noData')}
          </Text>
        ) : null}
      </Card>

      <Modal
        opened={modalMode !== null}
        onClose={closeModal}
        title={
          <Group gap="xs">
            <IconShield size={20} />
            <Text fw={700}>{modalTitle}</Text>
          </Group>
        }
        size="md"
        radius="md"
        overlayProps={{ blur: 3, opacity: 0.55 }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {modalMode !== 'password' ? (
              <>
                <TextInput label={t('fullName')} required {...form.getInputProps('fullName')} />
                <TextInput label={t('email')} required {...form.getInputProps('email')} />
                <Select
                  label={t('roleSelect')}
                  required
                  data={roleOptions}
                  leftSection={<IconShield size={16} />}
                  {...form.getInputProps('role')}
                />
                {modalMode === 'edit' ? (
                  <Select
                    label={t('status')}
                    data={[
                      { value: 'true', label: t('active') },
                      { value: 'false', label: t('inactive') },
                    ]}
                    value={form.values.isActive ? 'true' : 'false'}
                    onChange={(v) => form.setFieldValue('isActive', v === 'true')}
                    disabled={editingUser?.id === currentUserId}
                  />
                ) : null}
              </>
            ) : (
              <Text size="sm" c="dimmed">
                {t('resetPasswordHint', { name: editingUser?.fullName ?? '' })}
              </Text>
            )}
            {(modalMode === 'create' || modalMode === 'password') ? (
              <PasswordInput
                label={t('password')}
                required
                {...form.getInputProps('password')}
              />
            ) : (
              <PasswordInput
                label={t('passwordOptional')}
                placeholder={t('passwordOptionalHint')}
                {...form.getInputProps('password')}
              />
            )}
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" color="gray" onClick={closeModal}>
                {tc('cancel')}
              </Button>
              <Button color="skyBlue" type="submit" loading={submitting}>
                {modalMode === 'create' ? t('createAccount') : tc('save')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
