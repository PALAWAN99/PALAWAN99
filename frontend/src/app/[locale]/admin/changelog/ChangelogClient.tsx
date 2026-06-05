'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Badge,
  Card,
  Center,
  Group,
  Loader,
  Pagination,
  Select,
  Stack,
  Text,
  TextInput,
  Timeline,
  Title,
} from '@mantine/core';
import { IconSearch, IconVersions } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { APP_VERSION_LABEL } from '@/lib/app-meta';
import { unwrapApiData } from '@/lib/parse-api-response';

type ChangeType = 'FEATURE' | 'FIX' | 'IMPROVEMENT' | 'SECURITY' | 'OTHER';

export type ChangelogRow = {
  id: string;
  version: string;
  title: string;
  description: string;
  changeType: ChangeType;
  releasedAt: string;
  createdAt: string;
};

type PaginatedPayload = {
  data: ChangelogRow[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
};

function changeTypeColor(type: ChangeType): string {
  switch (type) {
    case 'FEATURE':
      return 'skyBlue';
    case 'FIX':
      return 'orange';
    case 'IMPROVEMENT':
      return 'teal';
    case 'SECURITY':
      return 'red';
    default:
      return 'gray';
  }
}

function formatVersion(v: string): string {
  return v.startsWith('v') ? v : `v${v}`;
}

function typeLabelKey(type: ChangeType): 'typeFEATURE' | 'typeFIX' | 'typeIMPROVEMENT' | 'typeSECURITY' | 'typeOTHER' {
  return `type${type}` as 'typeFEATURE' | 'typeFIX' | 'typeIMPROVEMENT' | 'typeSECURITY' | 'typeOTHER';
}

type ChangelogClientProps = {
  /** โหลดจาก Server Component — แสดงทันทีแม้ client fetch ล้ม */
  initialRows?: ChangelogRow[];
  initialTotal?: number;
  pageLimit?: number;
};

export default function ChangelogClient({
  initialRows = [],
  initialTotal = 0,
  pageLimit = 15,
}: ChangelogClientProps) {
  const t = useTranslations('Changelog');

  const [rows, setRows] = useState<ChangelogRow[]>(initialRows);
  const [loading, setLoading] = useState(initialRows.length === 0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.max(1, Math.ceil(initialTotal / pageLimit) || 1));
  const [total, setTotal] = useState(initialTotal);
  const [searchInput, setSearchInput] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [changeType, setChangeType] = useState<string | null>(null);
  const skipInitialClientFetch = useRef(initialRows.length > 0 || initialTotal > 0);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setSearchQ(searchInput.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  const fetchEntries = useCallback(
    async (pageOverride?: number) => {
      const currentPage = pageOverride ?? page;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(pageLimit),
        });
        if (searchQ) params.set('q', searchQ);
        if (changeType) params.set('changeType', changeType);

        const res = await fetch(`/api/changelog?${params}`, {
          credentials: 'include',
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`fetch failed: ${res.status}`);

        const json = (await res.json()) as PaginatedPayload & { success?: boolean };
        const data = unwrapApiData<ChangelogRow[]>(json);
        setRows(Array.isArray(data) ? data : []);
        if (json.pagination) {
          setTotal(json.pagination.total);
          setTotalPages(Math.max(1, json.pagination.totalPages));
        }
      } catch {
        // เก็บข้อมูลจาก SSR / รอบก่อน — ไม่เคลียร์เป็น 0 เมื่อ API ล้ม
      } finally {
        setLoading(false);
      }
    },
    [page, searchQ, changeType, pageLimit],
  );

  useEffect(() => {
    if (skipInitialClientFetch.current && page === 1 && !searchQ && !changeType) {
      skipInitialClientFetch.current = false;
      return;
    }
    skipInitialClientFetch.current = false;
    void fetchEntries();
  }, [fetchEntries]);

  const grouped = useMemo(() => {
    const map = new Map<string, ChangelogRow[]>();
    for (const row of rows) {
      const key = row.version;
      const list = map.get(key) ?? [];
      list.push(row);
      map.set(key, list);
    }
    return Array.from(map.entries());
  }, [rows]);

  const typeOptions = [
    { value: 'FEATURE', label: t('typeFEATURE') },
    { value: 'FIX', label: t('typeFIX') },
    { value: 'IMPROVEMENT', label: t('typeIMPROVEMENT') },
    { value: 'SECURITY', label: t('typeSECURITY') },
    { value: 'OTHER', label: t('typeOTHER') },
  ];

  return (
    <Stack gap="lg" maw={900} mx="auto">
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <div>
          <Group gap="sm" mb={4}>
            <IconVersions size={28} stroke={1.5} color="var(--mantine-color-navy-7)" />
            <Title order={2}>{t('title')}</Title>
          </Group>
          <Text c="dimmed" size="sm">
            {t('subtitle', { version: APP_VERSION_LABEL })}
          </Text>
        </div>
      </Group>

      <Card withBorder radius="md" p="md">
        <Group gap="sm" wrap="wrap">
          <TextInput
            flex={1}
            miw={220}
            placeholder={t('searchPlaceholder')}
            leftSection={<IconSearch size={16} />}
            value={searchInput}
            onChange={(e) => setSearchInput(e.currentTarget.value)}
          />
          <Select
            clearable
            placeholder={t('filterType')}
            data={typeOptions}
            value={changeType}
            onChange={(v) => {
              setChangeType(v);
              setPage(1);
            }}
            w={180}
          />
          <Text size="sm" c="dimmed">
            {t('resultCount', { count: total })}
          </Text>
        </Group>
      </Card>

      {loading ? (
        <Center py="xl">
          <Loader color="skyBlue" />
        </Center>
      ) : rows.length === 0 ? (
        <Card withBorder p="xl" radius="md">
          <Text ta="center" c="dimmed">
            {t('empty')}
          </Text>
        </Card>
      ) : (
        <Stack gap="xl">
          {grouped.map(([version, entries]) => (
            <Card key={version} withBorder radius="md" p="lg">
              <Group gap="sm" mb="md">
                <Badge size="lg" variant="filled" color="navy">
                  {formatVersion(version)}
                </Badge>
                <Text size="xs" c="dimmed">
                  {dayjs(entries[0]?.releasedAt).format('D MMM YYYY HH:mm')}
                </Text>
              </Group>
              <Timeline bulletSize={24} lineWidth={2}>
                {entries.map((entry) => (
                  <Timeline.Item
                    key={entry.id}
                    title={
                      <Group gap="xs" wrap="wrap">
                        <Text fw={600} size="sm">
                          {entry.title}
                        </Text>
                        <Badge size="sm" variant="light" color={changeTypeColor(entry.changeType)}>
                          {t(typeLabelKey(entry.changeType))}
                        </Badge>
                      </Group>
                    }
                  >
                    <Text size="sm" c="dimmed" lh={1.55} mb={4}>
                      {entry.description}
                    </Text>
                    <Text size="xs" c="gray.6">
                      {dayjs(entry.releasedAt).format('D MMM YYYY · HH:mm')}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          ))}
        </Stack>
      )}

      {totalPages > 1 && (
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            {t('pageInfo', { page, totalPages })}
          </Text>
          <Pagination
            value={page}
            onChange={(p) => {
              setPage(p);
              void fetchEntries(p);
            }}
            total={totalPages}
            withEdges
          />
        </Group>
      )}
    </Stack>
  );
}
