'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Title,
  Text,
  Stack,
  Group,
  Button,
  Card,
  Tabs,
  Table,
  Badge,
  ActionIcon,
  Modal,
  TextInput,
  NumberInput,
  Select,
  Switch,
  Center,
  Loader,
  Paper,
  SimpleGrid,
  Divider,
} from '@mantine/core';
import {
  IconQrcode,
  IconSettings,
  IconPlus,
  IconEdit,
  IconSearch,
  IconUserCheck,
  IconClock,
  IconRepeat,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { QRCodeSVG } from 'qrcode.react';

export default function QRManagementPage() {
  const t = useTranslations();
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>('issue');
  
  // States for Issuing QR
  const [searchMember, setSearchMember] = useState('');
  const [memberData, setMemberData] = useState<any>(null);
  const [generatedQR, setGeneratedQR] = useState<any>(null);
  const [issuing, setIssuing] = useState(false);
  const [duration, setDuration] = useState<string>('1D');

  // States for Policy Modal
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<any>(null);

  const policyForm = useForm({
    initialValues: {
      name: '',
      ttlSeconds: 86400,
      oneTimeUse: false,
      maxUsesPerDay: 10,
      isDefault: false,
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/qr-policies');
      const data = await res.json();
      setPolicies(data);
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to fetch policies', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Issuing Logic ---
  const handleMemberSearch = async () => {
    if (!searchMember) return;
    setLoading(true);
    try {
      // ค้นหาสมาชิกด้วยรหัสหรือเลขบัตร
      const res = await fetch(`/api/qr/member-search?query=${searchMember}`);
      const data = await res.json();
      if (data) setMemberData(data);
      else notifications.show({ message: 'Member not found', color: 'orange' });
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Search failed', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  const handleIssueQR = async () => {
    if (!memberData) return;
    setIssuing(true);
    try {
      const res = await fetch('/api/qr/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          memberId: memberData.id,
          purpose: 'ENTRY',
          duration: duration
        }),
      });
      const result = await res.json();
      if (result.success) {
        setGeneratedQR(result.data);
        notifications.show({ title: 'Success', message: 'QR Code Issued', color: 'green' });
      }
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Issuance failed', color: 'red' });
    } finally {
      setIssuing(false);
    }
  };

  // --- Policy Logic ---
  const handleSavePolicy = async (values: typeof policyForm.values) => {
    const method = editingPolicy ? 'PATCH' : 'POST';
    try {
      const res = await fetch('/api/admin/qr-policies', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPolicy ? { ...values, id: editingPolicy.id } : values),
      });
      if (res.ok) {
        notifications.show({ title: 'Success', message: 'Policy saved', color: 'green' });
        setPolicyModalOpen(false);
        fetchData();
      }
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Save failed', color: 'red' });
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>{t('Common.qr')}</Title>
          <Text size="sm" c="dimmed">Manage QR issuance and security policies</Text>
        </div>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} variant="outline" radius="md">
        <Tabs.List>
          <Tabs.Tab value="issue" leftSection={<IconQrcode size={16} />}>
            Issue QR Code
          </Tabs.Tab>
          <Tabs.Tab value="policies" leftSection={<IconSettings size={16} />}>
            Policies
          </Tabs.Tab>
        </Tabs.List>

        {/* --- Tab: Issue QR --- */}
        <Tabs.Panel value="issue" pt="lg">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Card withBorder radius="md">
              <Title order={4} mb="md">Issue New Access QR</Title>
              <Stack gap="md">
                <Group align="flex-end">
                  <TextInput
                    label="Member Search"
                    placeholder="Enter Member No. or ID Card"
                    style={{ flex: 1 }}
                    value={searchMember}
                    onChange={(e) => setSearchMember(e.currentTarget.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMemberSearch()}
                  />
                  <Button variant="light" onClick={handleMemberSearch} loading={loading}>
                    <IconSearch size={18} />
                  </Button>
                </Group>

                {memberData && (
                  <Paper withBorder p="md" bg="gray.0">
                    <Select
                      label="QR Validity"
                      data={[
                        { value: '1H', label: '1 Hour' },
                        { value: '1D', label: '1 Day' },
                        { value: '7D', label: '7 Days' },
                        { value: '30D', label: '30 Days' },
                      ]}
                      value={duration}
                      onChange={(val) => setDuration(val || '1D')}
                      mb="sm"
                    />
                    <Group justify="space-between">
                      <div>
                        <Text fw={700}>{memberData.firstNameTh} {memberData.lastNameTh}</Text>
                        <Text size="xs" c="dimmed">{memberData.memberNo}</Text>
                      </div>
                      <Badge color={memberData.status === 'ACTIVE' ? 'green' : 'red'}>
                        {memberData.status}
                      </Badge>
                    </Group>
                    <Button 
                      fullWidth 
                      mt="md" 
                      leftSection={<IconUserCheck size={18} />}
                      onClick={handleIssueQR}
                      loading={issuing}
                      disabled={memberData.status !== 'ACTIVE'}
                    >
                      Generate QR Code
                    </Button>
                  </Paper>
                )}
              </Stack>
            </Card>

            <Card withBorder radius="md">
              <Title order={4} mb="md">QR Preview</Title>
              <Center h="100%">
                {generatedQR ? (
                  <Stack align="center" gap="md">
                    <QRCodeSVG 
                      value={generatedQR.qrContent} 
                      size={200} 
                      includeMargin 
                      level="H"
                    />
                    <Text size="sm" fw={500} c="green">Valid until {new Date(generatedQR.expiresAt).toLocaleString()}</Text>
                    <Button variant="subtle" size="xs" onClick={() => window.print()}>Print QR</Button>
                  </Stack>
                ) : (
                  <Stack align="center" gap="xs" c="dimmed">
                    <IconQrcode size={64} stroke={1} />
                    <Text size="sm">Search member and generate QR to preview</Text>
                  </Stack>
                )}
              </Center>
            </Card>
          </SimpleGrid>
        </Tabs.Panel>

        {/* --- Tab: Policies --- */}
        <Tabs.Panel value="policies" pt="lg">
          <Card withBorder radius="md" p="0">
            <Group p="md" justify="space-between">
              <Text fw={700}>System Policies</Text>
              <Button size="xs" leftSection={<IconPlus size={16} />} onClick={() => {
                setEditingPolicy(null);
                policyForm.reset();
                setPolicyModalOpen(true);
              }}>
                Add Policy
              </Button>
            </Group>
            <Divider />
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>TTL (Minutes)</Table.Th>
                  <Table.Th>One-time</Table.Th>
                  <Table.Th>Daily Limit</Table.Th>
                  <Table.Th>Default</Table.Th>
                  <Table.Th ta="right">Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {policies.map((p) => (
                  <Table.Tr key={p.id}>
                    <Table.Td><Text fw={500}>{p.name}</Text></Table.Td>
                    <Table.Td>{Math.round(p.ttlSeconds / 60)} min</Table.Td>
                    <Table.Td>{p.oneTimeUse ? 'Yes' : 'No'}</Table.Td>
                    <Table.Td>{p.maxUsesPerDay} uses</Table.Td>
                    <Table.Td>
                      {p.isDefault && <Badge color="blue" size="sm">Default</Badge>}
                    </Table.Td>
                    <Table.Td ta="right">
                      <ActionIcon variant="subtle" onClick={() => {
                        setEditingPolicy(p);
                        policyForm.setValues(p);
                        setPolicyModalOpen(true);
                      }}>
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* --- Policy Modal --- */}
      <Modal 
        opened={policyModalOpen} 
        onClose={() => setPolicyModalOpen(false)}
        title={editingPolicy ? 'Edit Policy' : 'Add Policy'}
        radius="md"
      >
        <form onSubmit={policyForm.onSubmit(handleSavePolicy)}>
          <Stack gap="md">
            <TextInput label="Policy Name" required {...policyForm.getInputProps('name')} />
            <NumberInput 
              label="TTL (Seconds)" 
              required 
              min={60} 
              leftSection={<IconClock size={16} />}
              {...policyForm.getInputProps('ttlSeconds')} 
            />
            <NumberInput 
              label="Max Uses Per Day" 
              required 
              min={1} 
              leftSection={<IconRepeat size={16} />}
              {...policyForm.getInputProps('maxUsesPerDay')} 
            />
            <Switch 
              label="One-time Use Only" 
              {...policyForm.getInputProps('oneTimeUse', { type: 'checkbox' })} 
            />
            <Switch 
              label="Set as Default Policy" 
              {...policyForm.getInputProps('isDefault', { type: 'checkbox' })} 
            />
            <Group justify="flex-end" mt="md">
              <Button type="submit">Save Policy</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
