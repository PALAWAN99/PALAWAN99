'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Card,
  Center,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBuilding, IconCheck, IconDoor, IconPlus, IconSchool } from '@tabler/icons-react';

import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage } from '@/lib/parse-api-response';

export type FacultyOverviewRow = {
  facultyKey: string;
  nameTh: string;
  nameEn: string;
  suggestedBranchCode: string;
  gateCount: number;
  registeredGateCount: number;
  pennuengSites: string[];
  gates: Array<{
    pennuengCode: string;
    dashboardLabel: string;
    registered: boolean;
    pennuengBranchDesc: string | null;
    gateStatus: 'ACTIVE' | 'INACTIVE';
  }>;
  systemBranch: {
    id: string;
    code: string;
    nameTh: string;
    gateCount: number;
    isActive: boolean;
  } | null;
};

interface FacultyBranchesOverviewProps {
  refreshKey?: number;
  onBranchCreated?: () => void;
}

export function FacultyBranchesOverview({
  refreshKey = 0,
  onBranchCreated,
}: FacultyBranchesOverviewProps) {
  const [faculties, setFaculties] = useState<FacultyOverviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [creatingKey, setCreatingKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiPath('/api/admin/branches/faculty-overview'));
      const json = await res.json();
      if (!res.ok) throw new Error(getApiErrorMessage(json));
      setConfigured(Boolean(json.data?.configured));
      setFaculties(json.data?.faculties ?? []);
    } catch (err) {
      notifications.show({
        title: 'โหลดข้อมูลคณะไม่สำเร็จ',
        message: err instanceof Error ? err.message : 'เกิดข้อผิดพลาด',
        color: 'red',
      });
      setFaculties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const createBranchFromFaculty = async (faculty: FacultyOverviewRow) => {
    setCreatingKey(faculty.facultyKey);
    try {
      const res = await fetch(apiPath('/api/admin/branches/from-faculty'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facultyKey: faculty.facultyKey }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(getApiErrorMessage(json));
      notifications.show({
        title: 'สำเร็จ',
        message: json.message ?? `สร้างสาขา ${faculty.nameTh} แล้ว`,
        color: 'teal',
        icon: <IconCheck size={16} />,
      });
      await load();
      onBranchCreated?.();
    } catch (err) {
      notifications.show({
        title: 'สร้างสาขาไม่สำเร็จ',
        message: err instanceof Error ? err.message : 'เกิดข้อผิดพลาด',
        color: 'red',
      });
    } finally {
      setCreatingKey(null);
    }
  };

  const totalGates = faculties.reduce((s, f) => s + f.gateCount, 0);
  const withBranch = faculties.filter((f) => f.systemBranch).length;

  return (
    <Stack gap="md">
      {!configured && !loading ? (
        <Alert color="gray">ยังไม่ได้ตั้งค่า SQL Server — ไม่แสดงข้อมูลคณะจาก Pennueng</Alert>
      ) : null}

      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : faculties.length === 0 ? (
        <Text c="dimmed" ta="center" py="md">
          ไม่พบข้อมูลประตูจาก Pennueng
        </Text>
      ) : (
        <>
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
            <Card withBorder padding="sm" radius="md">
              <Text size="xs" c="dimmed">
                คณะ/หน่วยงาน
              </Text>
              <Text fw={800} size="xl">
                {faculties.length}
              </Text>
            </Card>
            <Card withBorder padding="sm" radius="md">
              <Text size="xs" c="dimmed">
                ประตู Pennueng
              </Text>
              <Text fw={800} size="xl">
                {totalGates}
              </Text>
            </Card>
            <Card withBorder padding="sm" radius="md">
              <Text size="xs" c="dimmed">
                มีสาขาในระบบแล้ว
              </Text>
              <Text fw={800} size="xl" c="teal">
                {withBranch}
              </Text>
            </Card>
            <Card withBorder padding="sm" radius="md">
              <Text size="xs" c="dimmed">
                รอสร้างสาขา
              </Text>
              <Text fw={800} size="xl" c="orange">
                {faculties.length - withBranch}
              </Text>
            </Card>
          </SimpleGrid>

          <Accordion variant="separated" radius="md">
            {faculties.map((faculty) => (
              <Accordion.Item key={faculty.facultyKey} value={faculty.facultyKey}>
                <Accordion.Control>
                  <Group justify="space-between" wrap="nowrap" pr="md">
                    <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
                      <ThemeIcon size={36} radius="md" variant="light" color="indigo">
                        <IconSchool size={18} />
                      </ThemeIcon>
                      <div style={{ minWidth: 0 }}>
                        <Text fw={700} lineClamp={1}>
                          {faculty.nameTh}
                        </Text>
                        <Text size="xs" c="dimmed">
                          รหัส {faculty.suggestedBranchCode} · {faculty.nameEn}
                        </Text>
                      </div>
                    </Group>
                    <Group gap={6} wrap="nowrap" style={{ flexShrink: 0 }}>
                      <Badge variant="light" color="blue" leftSection={<IconDoor size={12} />}>
                        {faculty.gateCount} ประตู
                      </Badge>
                      <Badge variant="light" color="teal">
                        ลงทะเบียน {faculty.registeredGateCount}
                      </Badge>
                      {faculty.systemBranch ? (
                        <Badge variant="filled" color="navy" leftSection={<IconBuilding size={12} />}>
                          {faculty.systemBranch.code}
                        </Badge>
                      ) : (
                        <Badge variant="outline" color="orange">
                          ยังไม่มีสาขา
                        </Badge>
                      )}
                    </Group>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="sm">
                    {faculty.pennuengSites.length > 0 ? (
                      <Text size="sm" c="dimmed">
                        สถานที่ Pennueng: {faculty.pennuengSites.join(' · ')}
                      </Text>
                    ) : null}

                    {faculty.systemBranch ? (
                      <Group gap="xs">
                        <IconBuilding size={16} />
                        <Text size="sm">
                          สาขาในระบบ: <strong>{faculty.systemBranch.nameTh}</strong> (
                          {faculty.systemBranch.code}) — ประตูที่ผูกแล้ว{' '}
                          {faculty.systemBranch.gateCount} รายการ
                        </Text>
                      </Group>
                    ) : faculty.facultyKey !== 'other' ? (
                      <Button
                        size="xs"
                        color="teal"
                        leftSection={<IconPlus size={14} />}
                        loading={creatingKey === faculty.facultyKey}
                        onClick={() => createBranchFromFaculty(faculty)}
                      >
                        สร้างสาขา {faculty.nameTh} ({faculty.suggestedBranchCode})
                      </Button>
                    ) : null}

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                      {faculty.gates.map((gate) => (
                        <Card key={gate.pennuengCode} withBorder padding="sm" radius="md">
                          <Group justify="space-between" wrap="nowrap">
                            <div style={{ minWidth: 0 }}>
                              <Badge size="sm" color="navy" mb={4}>
                                {gate.pennuengCode}
                              </Badge>
                              <Text size="sm" fw={600} lineClamp={2}>
                                {gate.dashboardLabel}
                              </Text>
                              {gate.pennuengBranchDesc ? (
                                <Text size="xs" c="dimmed">
                                  {gate.pennuengBranchDesc}
                                </Text>
                              ) : null}
                            </div>
                            <Stack gap={4} align="flex-end" style={{ flexShrink: 0 }}>
                              <Badge
                                size="xs"
                                color={gate.gateStatus === 'ACTIVE' ? 'teal' : 'gray'}
                                variant="light"
                              >
                                {gate.gateStatus === 'ACTIVE' ? 'ออนไลน์' : 'ออฟไลน์'}
                              </Badge>
                              <Badge
                                size="xs"
                                color={gate.registered ? 'teal' : 'orange'}
                                variant={gate.registered ? 'light' : 'outline'}
                              >
                                {gate.registered ? 'ลงทะเบียนแล้ว' : 'ยังไม่ลงทะเบียน'}
                              </Badge>
                            </Stack>
                          </Group>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
      )}
    </Stack>
  );
}
