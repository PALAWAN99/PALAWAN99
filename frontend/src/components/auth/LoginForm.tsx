'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Container,
  Group,
  Stack,
  Box,
  Alert,
  Loader,
} from '@mantine/core';
import { IconLock, IconMail, IconAlertCircle, IconShieldCheck } from '@tabler/icons-react';
import { apiPath, withBasePath } from '@/lib/base-path';
import { unwrapApiData } from '@/lib/parse-api-response';

type RecaptchaConfig = {
  siteKey: string | null;
  enforce: boolean;
};

const inputStyles = {
  label: { color: '#CBD5E1', marginBottom: 8, fontSize: '0.95rem' },
  input: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    color: '#F8FAFC',
    fontSize: '1.05rem',
    minHeight: 48,
  },
};

function waitForRecaptcha(timeoutMs = 12_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        window.grecaptcha.ready(() => resolve());
        return;
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error('reCAPTCHA script not loaded'));
        return;
      }
      window.setTimeout(tick, 120);
    };
    tick();
  });
}

async function fetchRecaptchaConfig(): Promise<RecaptchaConfig> {
  const res = await fetch(apiPath('/api/public/recaptcha-config'));
  const json = await res.json();
  if (!res.ok) {
    return { siteKey: null, enforce: false };
  }
  return unwrapApiData<RecaptchaConfig>(json);
}

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [recaptchaConfig, setRecaptchaConfig] = useState<RecaptchaConfig | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const recaptchaInjected = useRef(false);

  const siteKey = recaptchaConfig?.siteKey ?? null;
  const enforceRecaptcha = recaptchaConfig?.enforce ?? false;
  const canSubmit = !enforceRecaptcha || !siteKey || scriptReady;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    void fetchRecaptchaConfig()
      .then(setRecaptchaConfig)
      .catch(() => setRecaptchaConfig({ siteKey: null, enforce: false }));
  }, []);

  useEffect(() => {
    if (!siteKey || !enforceRecaptcha || recaptchaInjected.current) return;
    recaptchaInjected.current = true;

    const id = 'google-recaptcha-v3';
    if (document.getElementById(id)) {
      void waitForRecaptcha().then(
        () => setScriptReady(true),
        () => setScriptReady(false),
      );
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => {
      void waitForRecaptcha().then(
        () => setScriptReady(true),
        () => setScriptReady(false),
      );
    };
    script.onerror = () => setScriptReady(false);
    document.head.appendChild(script);
  }, [enforceRecaptcha, siteKey]);

  const getRecaptchaToken = useCallback(async (): Promise<string> => {
    if (!enforceRecaptcha) return '';
    if (!siteKey) {
      throw new Error('reCAPTCHA is not configured');
    }
    await waitForRecaptcha();
    return window.grecaptcha!.execute(siteKey, { action: 'login' });
  }, [enforceRecaptcha, siteKey]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const recaptchaToken = await getRecaptchaToken();

      const result = await signIn('credentials', {
        email,
        password,
        recaptchaToken,
        redirect: false,
      });

      if (result?.error) {
        setError(
          enforceRecaptcha
            ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือการยืนยัน reCAPTCHA ล้มเหลว'
            : 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
        );
      } else if (result?.ok) {
        window.location.assign(withBasePath('/admin/dashboard'));
      } else {
        setError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('reCAPTCHA')) {
        setError('โหลด reCAPTCHA ไม่สำเร็จ กรุณารีเฟรชหน้า หรือปิดตัวบล็อกโฆษณา');
      } else {
        setError('ไม่สามารถยืนยันตัวตนได้ กรุณารีเฟรชหน้าแล้วลองใหม่');
      }
    } finally {
      setLoading(false);
    }
  }, [enforceRecaptcha, getRecaptchaToken]);

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top left, #1E293B 0%, #0F172A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <Container size={520} w="100%">
        <Stack align="center" gap="md" mb={36}>
          <Box
            component="svg"
            viewBox="0 0 80 80"
            style={{ width: 72, height: 72, filter: 'drop-shadow(0 0 15px rgba(56,189,248,0.5))' }}
          >
            <rect width="80" height="80" rx="18" fill="#1E3A5F" stroke="#38BDF8" strokeWidth="2" />
            <path d="M20 20h15v15H20zM45 20h15v15H45zM20 45h15v15H20z" fill="#38BDF8" />
            <circle cx="52.5" cy="52.5" r="7.5" fill="#10B981" />
          </Box>
          <Title ta="center" style={{ color: '#F8FAFC', fontWeight: 800, fontSize: '2.25rem' }}>
            ยินดีต้อนรับกลับมา
          </Title>
          <Text c="dimmed" size="md" ta="center">
            ระบบจัดการ QR Gate Access Control
          </Text>
        </Stack>

        <Paper
          withBorder
          shadow="xl"
          p={{ base: 28, sm: 40 }}
          radius="lg"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.75)',
            borderColor: 'rgba(51, 65, 85, 1)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack gap="lg">
              {error && (
                <Alert
                  icon={<IconAlertCircle size={18} />}
                  title="เข้าสู่ระบบไม่สำเร็จ"
                  color="red"
                  variant="filled"
                >
                  {error}
                </Alert>
              )}

              <TextInput
                label="อีเมล"
                placeholder="admin@library.kku.ac.th"
                name="email"
                type="email"
                autoComplete="email"
                required
                size="lg"
                leftSection={<IconMail size={20} />}
                styles={inputStyles}
              />

              <PasswordInput
                label="รหัสผ่าน"
                placeholder="รหัสผ่านของคุณ"
                name="password"
                autoComplete="current-password"
                required
                size="lg"
                leftSection={<IconLock size={20} />}
                styles={inputStyles}
              />

              <Group justify="space-between">
                <Checkbox
                  label="จดจำฉัน"
                  size="md"
                  styles={{
                    label: { color: '#94A3B8' },
                    input: { backgroundColor: '#0F172A', borderColor: '#475569' },
                  }}
                />
                <Button variant="transparent" size="sm" color="skyBlue" type="button">
                  ลืมรหัสผ่าน?
                </Button>
              </Group>

              <Button
                fullWidth
                size="xl"
                type="submit"
                disabled={!mounted || loading || !canSubmit || recaptchaConfig === null}
                style={{
                  background: 'linear-gradient(to right, #0EA5E9, #2563EB)',
                  fontWeight: 600,
                  minHeight: 52,
                }}
              >
                {loading ? <Loader size="md" color="white" /> : 'เข้าสู่ระบบ'}
              </Button>

              {enforceRecaptcha ? (
                <Stack gap={6} align="center">
                  <Group gap={6} justify="center">
                    <IconShieldCheck size={16} color={scriptReady ? '#38BDF8' : '#64748B'} />
                    <Text size="xs" ta="center" style={{ color: scriptReady ? '#94A3B8' : '#64748B' }}>
                      {recaptchaConfig === null
                        ? 'กำลังโหลดการตั้งค่า reCAPTCHA...'
                        : siteKey
                          ? scriptReady
                            ? 'ป้องกันด้วย Google reCAPTCHA v3 (พร้อมใช้งาน)'
                            : 'กำลังโหลด Google reCAPTCHA...'
                          : 'ยังไม่ได้ตั้งค่า reCAPTCHA site key บนเซิร์ฟเวอร์'}
                    </Text>
                  </Group>
                  <Text size="xs" ta="center" maw={360} style={{ color: '#64748B', lineHeight: 1.5 }}>
                    reCAPTCHA v3 ทำงานเบื้องหลัง — ดูโลโก้ Google มุมล่างขวาของหน้าจอ
                    {' '}
                    <Box
                      component="a"
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#38BDF8' }}
                    >
                      นโยบายความเป็นส่วนตัว
                    </Box>
                  </Text>
                </Stack>
              ) : null}
            </Stack>
          </form>
        </Paper>

        <Text ta="center" mt="xl" size="sm" style={{ color: '#64748B' }}>
          ต้องการความช่วยเหลือ? ติดต่อผู้ดูแลระบบห้องสมุด
        </Text>
      </Container>
    </Box>
  );
}
