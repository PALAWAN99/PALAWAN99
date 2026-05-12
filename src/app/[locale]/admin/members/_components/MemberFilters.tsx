import { Group, TextInput, ActionIcon, Select, Button, Text, Stack, Box } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';

interface MemberFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterType: string | null;
  onFilterTypeChange: (value: string | null) => void;
  filterStatus: string | null;
  onFilterStatusChange: (value: string | null) => void;
  onClear: () => void;
  hasFilter: boolean;
  filteredCount: number;
  totalCount: number;
}

export function MemberFilters({
  search,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  filterStatus,
  onFilterStatusChange,
  onClear,
  hasFilter,
  filteredCount,
  totalCount,
}: MemberFiltersProps) {
  return (
    <Stack gap="xs">
      <Group grow wrap="wrap">
        <TextInput
          placeholder="ค้นหาชื่อ, รหัสสมาชิก, เลขบัตร, อีเมล..."
          leftSection={<IconSearch size={16} />}
          style={{ flex: 1, minWidth: '300px' }}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          rightSection={
            search ? (
              <ActionIcon variant="transparent" color="gray" onClick={() => onSearchChange('')}>
                <IconX size={14} />
              </ActionIcon>
            ) : null
          }
        />
        <Group gap="xs" style={{ flex: '0 0 auto' }}>
          <Select
            placeholder="ประเภทสมาชิก"
            clearable
            data={[
              { value: 'STUDENT', label: 'นักเรียน' },
              { value: 'STAFF', label: 'เจ้าหน้าที่' },
              { value: 'FACULTY', label: 'อาจารย์' },
              { value: 'EXTERNAL', label: 'บุคคลภายนอก' },
              { value: 'GUEST', label: 'ผู้เยี่ยมชม' },
            ]}
            value={filterType}
            onChange={onFilterTypeChange}
            w={{ base: '100%', sm: 160 }}
          />
          <Select
            placeholder="สถานะ"
            clearable
            data={[
              { value: 'ACTIVE', label: 'ใช้งาน' },
              { value: 'EXPIRED', label: 'หมดอายุ' },
              { value: 'SUSPENDED', label: 'ระงับ' },
              { value: 'REVOKED', label: 'ยกเลิก' },
            ]}
            value={filterStatus}
            onChange={onFilterStatusChange}
            w={{ base: '100%', sm: 130 }}
          />
        </Group>
      </Group>

      <Group justify="space-between">
        {hasFilter ? (
          <Text size="sm" c="dimmed">
            แสดง {filteredCount} จาก {totalCount} รายการ
          </Text>
        ) : <Box />}
        
        {hasFilter && (
          <Button variant="subtle" color="gray" size="sm" onClick={onClear} leftSection={<IconX size={14} />}>
            ล้างตัวกรอง
          </Button>
        )}
      </Group>
    </Stack>
  );
}
