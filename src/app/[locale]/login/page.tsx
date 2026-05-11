'use client';

import { useState } from 'react';
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
import { IconLock, IconMail, IconAlertCircle } from '@tabler/icons-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else {
        window.location.href = '/admin';
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top left, #1E293B 0%, #0F172A 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container size={420} my={40}>
        <Stack align="center" gap="xs" mb={30}>
          <Box
            component="svg"
            viewBox="0 0 80 80"
            style={{ width: 60, height: 60, filter: 'drop-shadow(0 0 15px rgba(56,189,248,0.5))' }}
          >
            <rect width="80" height="80" rx="18" fill="#1E3A5F" stroke="#38BDF8" strokeWidth="2" />
            <path d="M20 20h15v15H20zM45 20h15v15H45zM20 45h15v15H20z" fill="#38BDF8" />
            <circle cx="52.5" cy="52.5" r="7.5" fill="#10B981" />
          </Box>
          <Title ta="center" style={{ color: '#F8FAFC', fontWeight: 800, fontSize: '1.8rem' }}>
            ยินดีต้อนรับกลับมา
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            ระบบจัดการ QR Gate Access Control
          </Text>
        </Stack>

        <Paper 
          withBorder 
          shadow="xl" 
          p={30} 
          radius="lg"
          style={{ 
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderColor: 'rgba(51, 65, 85, 1)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack>
              {error && (
                <Alert icon={<IconAlertCircle size={16} />} title="เข้าสู่ระบบไม่สำเร็จ" color="red" variant="filled">
                  {error}
                </Alert>
              )}

              <TextInput 
                label="อีเมล" 
                placeholder="admin@gate.local" 
                name="email"
                required 
                leftSection={<IconMail size={16} />}
                styles={{
                  label: { color: '#CBD5E1', marginBottom: 5 },
                  input: { backgroundColor: '#0F172A', borderColor: '#334155', color: '#F8FAFC' }
                }}
              />
              
              <PasswordInput 
                label="รหัสผ่าน" 
                placeholder="ของคุณ" 
                name="password"
                required 
                mt="md" 
                leftSection={<IconLock size={16} />}
                styles={{
                  label: { color: '#CBD5E1', marginBottom: 5 },
                  input: { backgroundColor: '#0F172A', borderColor: '#334155', color: '#F8FAFC' }
                }}
              />

              <Group justify="space-between" mt="lg">
                <Checkbox 
                  label="จดจำฉัน" 
                  styles={{
                    label: { color: '#94A3B8' },
                    input: { backgroundColor: '#0F172A', borderColor: '#475569' }
                  }}
                />
                <Button variant="transparent" size="xs" color="skyBlue">
                  ลืมรหัสผ่าน?
                </Button>
              </Group>

              <Button 
                fullWidth 
                mt="xl" 
                size="md" 
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(to right, #0EA5E9, #2563EB)',
                  fontWeight: 600,
                }}
              >
                {loading ? <Loader size="sm" color="white" /> : 'เข้าสู่ระบบ'}
              </Button>
            </Stack>
          </form>
        </Paper>

        <Text ta="center" mt="xl" size="sm" style={{ color: '#64748B' }}>
          ต้องการความช่วยเหลือ? ติดต่อผู้ดูแลระบบ
        </Text>
      </Container>
    </Box>
  );
}
