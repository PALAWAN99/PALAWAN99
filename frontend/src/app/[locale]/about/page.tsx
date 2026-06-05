'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  List,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconArrowLeft, IconInfoCircle } from '@tabler/icons-react';

const TECH_STACK = [
  'Next.js 16',
  'Mantine v9',
  'Prisma 7',
  'PostgreSQL 16',
  'TypeScript',
  'FastAPI',
  'Python 3.12',
] as const;

const pageBg = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #075985 100%)',
} as const;

const cardStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
} as const;

export default function AboutPage() {
  const t = useTranslations('About');
  const tCommon = useTranslations('Common');
  const year = new Date().getFullYear();

  const capabilities = [
    t('capQr'),
    t('capGate'),
    t('capMember'),
    t('capIdCard'),
    t('capSecurity'),
  ];

  return (
    <Box style={pageBg} py={60}>
      <Container size="md">
        <Stack gap="xl">
          <Button
            component={Link}
            href="/"
            variant="subtle"
            color="gray"
            leftSection={<IconArrowLeft size={18} />}
            style={{ alignSelf: 'flex-start', color: '#94A3B8' }}
          >
            {t('backHome')}
          </Button>

          <Stack gap="xs" align="center">
            <ThemeIconWrap />
            <Title order={1} ta="center" c="white">
              {t('title')}
            </Title>
            <Text ta="center" size="lg" style={{ color: '#94A3B8', maxWidth: 560 }}>
              {t('subtitle')}
            </Text>
          </Stack>

          <Card p="xl" radius="md" style={cardStyle}>
            <Group gap="sm" mb="md">
              <IconInfoCircle size={22} color="#38BDF8" />
              <Text fw={600} size="lg" c="#F0F9FF">
                {tCommon('title')}
              </Text>
            </Group>
            <Text style={{ color: '#CBD5E1', lineHeight: 1.7 }}>{t('overview')}</Text>
          </Card>

          <Card p="xl" radius="md" style={cardStyle}>
            <Text fw={600} size="lg" mb="md" c="#F0F9FF">
              {t('capabilitiesTitle')}
            </Text>
            <List spacing="sm" styles={{ item: { color: '#94A3B8' } }}>
              {capabilities.map((item) => (
                <List.Item key={item}>{item}</List.Item>
              ))}
            </List>
          </Card>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Card p="lg" radius="md" style={cardStyle}>
              <Text fw={600} size="md" mb="sm" c="#F0F9FF">
                {t('techTitle')}
              </Text>
              <Group gap="xs" mb="md">
                {TECH_STACK.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    style={{ borderColor: '#334155', color: '#94A3B8' }}
                  >
                    {tech}
                  </Badge>
                ))}
              </Group>
              <Text size="sm" style={{ color: '#64748B' }}>
                {t('techNote')}
              </Text>
            </Card>

            <Card p="lg" radius="md" style={cardStyle}>
              <Text fw={600} size="md" mb="sm" c="#F0F9FF">
                {t('structureTitle')}
              </Text>
              <Stack gap="xs">
                <Text size="sm" style={{ color: '#94A3B8', fontFamily: 'monospace' }}>
                  {t('structureFrontend')}
                </Text>
                <Text size="sm" style={{ color: '#94A3B8', fontFamily: 'monospace' }}>
                  {t('structureBackend')}
                </Text>
              </Stack>
            </Card>
          </SimpleGrid>

          <Stack gap={4} align="center" pt="md">
            <Text size="sm" style={{ color: '#94A3B8' }}>
              {t('developedBy')}
            </Text>
            <Text size="xs" style={{ color: '#64748B' }}>
              {t('copyright', { year })}
            </Text>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

function ThemeIconWrap() {
  return (
    <Box
      component="svg"
      viewBox="0 0 80 80"
      style={{ width: 56, height: 56, filter: 'drop-shadow(0 4px 16px rgba(56,189,248,0.35))' }}
    >
      <rect width="80" height="80" rx="20" fill="#1E3A5F" stroke="#38BDF8" strokeWidth="2" />
      <path d="M20 20h15v15H20zM45 20h15v15H45zM20 45h15v15H20z" fill="#38BDF8" />
      <circle cx="52.5" cy="52.5" r="7.5" fill="#10B981" />
    </Box>
  );
}
