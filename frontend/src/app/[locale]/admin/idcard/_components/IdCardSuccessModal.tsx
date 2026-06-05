'use client';

import { Modal, Stack, Text, Box, Loader, Group, Button } from '@mantine/core';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslations } from 'next-intl';

interface IdCardSuccessModalProps {
  opened: boolean;
  onClose: () => void;
  ticketUrl: string;
  fullName: string;
  citizenId: string;
}

export function IdCardSuccessModal({ opened, onClose, ticketUrl, fullName, citizenId }: IdCardSuccessModalProps) {
  const t = useTranslations('IdCard');

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={700}>{t('successTitle')}</Text>}
      centered
      size="md"
      radius="lg"
    >
      <Stack align="center" py="xl" gap="xl">
        <Stack align="center" gap={4}>
          <Text fw={800} size="xl" c="skyBlue">{t('scanToReceive')}</Text>
          <Text size="sm" c="dimmed" ta="center">
            {t('scanDesc')}
          </Text>
        </Stack>

        <Box
          style={{
            padding: 20,
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
          }}
        >
          {ticketUrl ? (
            <QRCodeSVG 
              value={ticketUrl} 
              size={220}
              level="M"
              includeMargin
            />
          ) : (
            <Loader color="skyBlue" />
          )}
        </Box>
        
        <Stack align="center" gap={4}>
          <Text fw={700}>{fullName}</Text>
          <Text size="sm" c="dimmed">{t('citizenId')}: {citizenId}</Text>
        </Stack>

        <Group grow w="100%">
          <Button size="md" variant="light" color="gray" onClick={onClose}>
            {t('close')}
          </Button>
          {ticketUrl && (
            <Button 
              size="md" 
              color="skyBlue" 
              component="a" 
              href={ticketUrl} 
              target="_blank"
            >
              {t('testTicket')}
            </Button>
          )}
        </Group>
      </Stack>
    </Modal>
  );
}
