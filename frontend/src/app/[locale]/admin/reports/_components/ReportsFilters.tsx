'use client';

import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Group,
  Popover,
  ScrollArea,
  Stack,
  Text,
  Badge,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar, IconChevronDown, IconDoor, IconSearch } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import type { ReportGateOption } from '@/types/reports-analytics';

type Props = {
  startDate: string | null;
  endDate: string | null;
  selectedGateIds: string[];
  gates: ReportGateOption[];
  loading?: boolean;
  onStartDateChange: (value: string | null) => void;
  onEndDateChange: (value: string | null) => void;
  onGateIdsChange: (ids: string[]) => void;
  onGenerate: () => void;
};

export function ReportsFilters({
  startDate,
  endDate,
  selectedGateIds,
  gates,
  loading,
  onStartDateChange,
  onEndDateChange,
  onGateIdsChange,
  onGenerate,
}: Props) {
  const t = useTranslations('Report');
  const [gatePopoverOpened, setGatePopoverOpened] = useState(false);

  const gateLabel = useMemo(() => {
    if (selectedGateIds.length === 0) return t('allGates');
    if (selectedGateIds.length === 1) {
      return gates.find((g) => g.id === selectedGateIds[0])?.label ?? t('gatesSelected', { count: 1 });
    }
    return t('gatesSelected', { count: selectedGateIds.length });
  }, [gates, selectedGateIds, t]);

  const toggleGate = (gateId: string) => {
    if (selectedGateIds.includes(gateId)) {
      onGateIdsChange(selectedGateIds.filter((id) => id !== gateId));
    } else {
      onGateIdsChange([...selectedGateIds, gateId]);
    }
  };

  return (
    <Group align="flex-end" wrap="wrap" gap="md">
      <DatePickerInput
        label={t('startDate')}
        value={startDate}
        onChange={onStartDateChange}
        maxDate={endDate ?? undefined}
        leftSection={<IconCalendar size={16} />}
        size="sm"
        w={170}
        valueFormat="DD/MM/YYYY"
      />
      <DatePickerInput
        label={t('endDate')}
        value={endDate}
        onChange={onEndDateChange}
        minDate={startDate ?? undefined}
        maxDate={dayjs().format('YYYY-MM-DD')}
        leftSection={<IconCalendar size={16} />}
        size="sm"
        w={170}
        valueFormat="DD/MM/YYYY"
      />

      <Stack gap={4}>
        <Text size="sm" fw={500}>
          {t('gateFilter')}
        </Text>
        <Popover
          opened={gatePopoverOpened}
          onChange={setGatePopoverOpened}
          width={320}
          position="bottom-start"
          shadow="md"
        >
          <Popover.Target>
            <Button
              variant="default"
              rightSection={<IconChevronDown size={16} />}
              leftSection={<IconDoor size={16} />}
              justify="space-between"
              w={260}
            >
              <Text size="sm" truncate>
                {gateLabel}
              </Text>
            </Button>
          </Popover.Target>
          <Popover.Dropdown p="sm">
            <Group justify="space-between" mb="xs">
              <Button
                size="compact-xs"
                variant="subtle"
                onClick={() => onGateIdsChange(gates.map((g) => g.id))}
              >
                {t('selectAllGates')}
              </Button>
              <Button size="compact-xs" variant="subtle" onClick={() => onGateIdsChange([])}>
                {t('clearGates')}
              </Button>
            </Group>
            <ScrollArea.Autosize mah={280} type="auto">
              <Stack gap="xs">
                {gates.map((gate) => (
                  <Checkbox
                    key={gate.id}
                    label={
                      <Group gap={6} wrap="nowrap">
                        <Text size="sm" lineClamp={1}>
                          {gate.label}
                        </Text>
                        <Badge size="xs" variant="light" color="gray">
                          {gate.code}
                        </Badge>
                      </Group>
                    }
                    checked={selectedGateIds.includes(gate.id)}
                    onChange={() => toggleGate(gate.id)}
                  />
                ))}
              </Stack>
            </ScrollArea.Autosize>
          </Popover.Dropdown>
        </Popover>
      </Stack>

      <Button
        leftSection={<IconSearch size={16} />}
        onClick={onGenerate}
        loading={loading}
        color="navy"
      >
        {t('generate')}
      </Button>
    </Group>
  );
}
