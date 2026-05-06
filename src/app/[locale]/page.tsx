'use client';

import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  SimpleGrid,
  ThemeIcon,
  Box,
  Badge,
} from '@mantine/core';
import {
  IconQrcode,
  IconDoor,
  IconShieldCheck,
  IconLanguage,
  IconArrowRight,
} from '@tabler/icons-react';

export default function HomePage() {
  const router = useRouter();
  const t = useTranslations();

  const FEATURES = [
    {
      icon: IconQrcode,
      title: t('Common.gates'), // Example of using translation
      desc: 'ออก QR เข้า-ออก หมดอายุทุกเที่ยงคืน ปลอดภัยด้วย JWT signing',
      color: 'skyBlue',
    },
    {
      icon: IconDoor,
      title: 'Gate Management',
      desc: 'จัดการประตู อุปกรณ์ สาขา พร้อม real-time monitoring',
      color: 'emerald',
    },
    {
      icon: IconShieldCheck,
      title: 'Security & Audit',
      desc: 'Audit trail, PDPA compliance, rate limiting, encryption',
      color: 'navy',
    },
    {
      icon: IconLanguage,
      title: '3 Languages',
      desc: 'รองรับ ไทย / English / 中文简体 พร้อม dark/light mode',
      color: 'skyBlue',
    },
  ];

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #075985 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container size="lg" py={80}>
        <Stack align="center" gap="xl">
          {/* Logo */}
          <Box
            component="svg"
            viewBox="0 0 80 80"
            style={{ width: 80, height: 80, filter: 'drop-shadow(0 4px 20px rgba(56,189,248,0.4))' }}
          >
            <rect width="80" height="80" rx="20" fill="#1E3A5F" stroke="#38BDF8" strokeWidth="2" />
            <path d="M20 20h15v15H20zM45 20h15v15H45zM20 45h15v15H20z" fill="#38BDF8" />
            <circle cx="52.5" cy="52.5" r="7.5" fill="#10B981" />
          </Box>

          <Stack align="center" gap={8}>
            <Title
              order={1}
              ta="center"
              style={{ color: '#FFFFFF', fontSize: '2.5rem', letterSpacing: '-0.02em' }}
            >
              {t('Common.title')}
            </Title>
            <Text
              size="lg"
              ta="center"
              style={{ color: '#94A3B8', maxWidth: 500 }}
            >
              ระบบจัดการเข้า-ออกอาคารด้วย QR Code
              <br />
              <Text component="span" size="md" c="dimmed">
                Smart Access Control · 3 Languages · Daily QR Expiry
              </Text>
            </Text>
          </Stack>

          <Group gap="md">
            <Button
              size="lg"
              color="skyBlue"
              rightSection={<IconArrowRight size={18} />}
              onClick={() => router.push('/admin')}
              style={{ fontWeight: 600 }}
            >
              {t('Common.dashboard')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              color="gray"
              style={{ borderColor: '#475569', color: '#94A3B8' }}
              onClick={() => router.push('/admin')}
            >
              {t('Dashboard.recentActivity')}
            </Button>
          </Group>

          {/* Feature Cards */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" mt="xl" w="100%">
            {FEATURES.map((f) => (
              <Card
                key={f.title}
                p="lg"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <ThemeIcon color={f.color} size="xl" radius="md" variant="light" mb="sm">
                  <f.icon size={24} />
                </ThemeIcon>
                <Text fw={600} size="md" mb={4} style={{ color: '#F0F9FF' }}>
                  {f.title}
                </Text>
                <Text size="sm" style={{ color: '#94A3B8' }}>
                  {f.desc}
                </Text>
              </Card>
            ))}
          </SimpleGrid>

          {/* Tech Stack */}
          <Group gap="sm" mt="md">
            {['Next.js 16', 'Mantine v9', 'Prisma 7', 'PostgreSQL 16', 'TypeScript'].map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                style={{ borderColor: '#334155', color: '#64748B' }}
                size="sm"
              >
                {tech}
              </Badge>
            ))}
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
