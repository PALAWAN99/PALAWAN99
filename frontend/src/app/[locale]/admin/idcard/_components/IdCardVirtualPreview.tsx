'use client';

import { Badge, Group, Paper, Stack, Text } from '@mantine/core';
import { IconScan } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { CitizenInfoCard, CitizenInfoSkeleton } from '@/components/CitizenInfo';
import type { CitizenInfo } from '@/lib/api';
import { hasCitizenPreview } from '@/lib/idcard/map-citizen';

interface IdCardVirtualPreviewProps {
  citizen: CitizenInfo | null;
  isReading: boolean;
  progress: number;
  progressMsg: string;
  onPhotoLoaded?: (photo: string) => void;
}

export function IdCardVirtualPreview({
  citizen,
  isReading,
  progress,
  progressMsg,
  onPhotoLoaded,
}: IdCardVirtualPreviewProps) {
  const t = useTranslations('IdCard');
  const showLiveCard = citizen && hasCitizenPreview(citizen);
  const showSkeleton = isReading && !showLiveCard;

  return (
    <Stack gap="md">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="xs">
          {isReading && (
            <Badge
              color="skyBlue"
              variant="light"
              leftSection={<IconScan size={12} />}
              style={{ textTransform: 'none' }}
            >
              {progressMsg || t('reading')}
            </Badge>
          )}
          {!isReading && showLiveCard && (
            <Badge color="green" variant="light" style={{ textTransform: 'none' }}>
              {t('readComplete')}
            </Badge>
          )}
        </Group>
        {isReading && (
          <Text size="xs" fw={700} c="navy.7">
            {progress}%
          </Text>
        )}
      </Group>

      <Paper p="md" radius="lg" bg="gray.0" withBorder>
        {showSkeleton ? (
          <CitizenInfoSkeleton />
        ) : showLiveCard ? (
          <CitizenInfoCard
            data={citizen}
            loading={isReading && !citizen.photo_base64}
            onPhotoLoaded={onPhotoLoaded}
            autoFetchPhoto={!isReading}
          />
        ) : (
          <Stack align="center" justify="center" py="md" gap="xs">
            <Text c="dimmed" size="sm" ta="center">
              {t('noData')}
            </Text>
            <Text c="dimmed" size="xs" ta="center">
              {t('virtualCardHint')}
            </Text>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
