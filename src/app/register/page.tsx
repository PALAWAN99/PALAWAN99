'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Card,
  Group,
  ThemeIcon,
  Box,
  Loader,
  Alert,
  Paper,
  Divider,
  TextInput,
  Transition,
} from '@mantine/core';
import {
  IconId,
  IconAlertCircle,
  IconArrowLeft,
  IconDeviceUsb,
  IconUserPlus,
  IconCircleCheck,
} from '@tabler/icons-react';
import { QRCodeSVG } from 'qrcode.react';
import { ThaiIdCardReader } from '@/lib/idcard/reader';
import Link from 'next/link';

export default function RegistrationPage() {
  const [step, setStep] = useState<'IDLE' | 'READING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const [memberData, setMemberData] = useState<{
    fullNameTh: string;
    memberNo: string;
    qrToken: string;
    expiresAt: string;
  } | null>(null);

  const [regMode, setRegMode] = useState<'CARD' | 'MANUAL'>('CARD');
  const [manualData, setManualData] = useState({
    citizenId: '',
    firstName: '',
    lastName: '',
  });

  const handleStartRegistration = async () => {
    setStep('READING');
    setError(null);

    const reader = new ThaiIdCardReader();
    
    try {
      const connected = await reader.connect();
      if (!connected) {
        throw new Error('ไม่สามารถเชื่อมต่อกับเครื่องอ่านบัตรได้ กรุณาเสียบเครื่องอ่านบัตรและลองอีกครั้ง');
      }

      const data = await reader.readAllData();
      if (!data) {
        throw new Error('ไม่สามารถอ่านข้อมูลจากบัตรได้ กรุณาเสียบบัตรให้แน่นและลองอีกครั้ง');
      }

      await sendRegistration(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ');
      setStep('ERROR');
    } finally {
      await reader.disconnect();
    }
  };

  const handleManualRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualData.citizenId || !manualData.firstName || !manualData.lastName) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setStep('READING');
    try {
      await sendRegistration({
        citizenId: manualData.citizenId,
        fullNameTh: `${manualData.firstName} ${manualData.lastName}`,
      });
    } catch (err: any) {
      setError(err.message);
      setStep('ERROR');
    }
  };

  const sendRegistration = async (data: any) => {
    const response = await fetch('/api/idcard/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
    }

    setMemberData(result);
    setStep('SUCCESS');
  };

  const reset = () => {
    setStep('IDLE');
    setError(null);
    setMemberData(null);
    setManualData({ citizenId: '', firstName: '', lastName: '' });
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top left, #F0F9FF 0%, #E0F2FE 40%, #DBEAFE 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Container size="sm" w="100%">
        <Transition mounted={true} transition="fade" duration={800} timingFunction="ease">
          {(styles) => (
            <Card 
              radius="lg" 
              p={40} 
              withBorder 
              shadow="xl" 
              style={{ 
                ...styles,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <Stack align="center" gap="xl">
                
                {/* Header */}
                <Stack align="center" gap={4}>
                  <Title order={2} ta="center" c="#1E3A5F" style={{ letterSpacing: -0.5 }}>
                    ลงทะเบียนเข้าใช้งานหอสมุด
                  </Title>
                  <Text c="dimmed" size="sm">
                    เลือกวิธีลงทะเบียนเพื่อรับ QR Code เข้าใช้งานรายวัน
                  </Text>
                </Stack>

                <Group grow w="100%">
                  <Button 
                    variant={regMode === 'CARD' ? 'filled' : 'light'} 
                    color="skyBlue" 
                    onClick={() => setRegMode('CARD')}
                    leftSection={<IconId size={18} />}
                    radius="md"
                  >
                    ใช้บัตรประชาชน
                  </Button>
                  <Button 
                    variant={regMode === 'MANUAL' ? 'filled' : 'light'} 
                    color="emerald" 
                    onClick={() => setRegMode('MANUAL')}
                    leftSection={<IconUserPlus size={18} />}
                    radius="md"
                  >
                    กรอกข้อมูลเอง
                  </Button>
                </Group>

                <Divider w="100%" />

                {/* Step: IDLE */}
                {step === 'IDLE' && (
                  <Stack align="center" gap="lg" w="100%">
                    {regMode === 'CARD' ? (
                      <>
                        <Box
                          className="pulse-animation"
                          style={{
                            width: 140,
                            height: 140,
                            borderRadius: '50%',
                            background: '#F0F9FF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #E0F2FE'
                          }}
                        >
                          <IconId size={70} color="#38BDF8" stroke={1.2} />
                        </Box>
                        
                        <Text ta="center" fw={500} c="#475569">
                          กรุณาเสียบบัตรประชาชนเข้ากับเครื่องอ่านบัตร <br />
                          แล้วกดปุ่มด้านล่างเพื่อเริ่มอ่านข้อมูล
                        </Text>

                        <Button
                          size="xl"
                          fullWidth
                          color="skyBlue"
                          leftSection={<IconDeviceUsb size={24} />}
                          onClick={handleStartRegistration}
                          style={{ height: 64, fontSize: 18, boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)' }}
                          radius="md"
                        >
                          เริ่มอ่านบัตรประชาชน
                        </Button>
                      </>
                    ) : (
                      <Box component="form" onSubmit={handleManualRegistration} w="100%">
                        <Stack gap="md">
                          <TextInput
                            label="เลขบัตรประชาชน (13 หลัก)"
                            placeholder="1xxxxxxxxxxxx"
                            required
                            radius="md"
                            value={manualData.citizenId}
                            onChange={(e) => setManualData({ ...manualData, citizenId: e.target.value })}
                          />
                          <Group grow>
                            <TextInput
                              label="ชื่อ (ไทย)"
                              placeholder="ภาษาไทย"
                              required
                              radius="md"
                              value={manualData.firstName}
                              onChange={(e) => setManualData({ ...manualData, firstName: e.target.value })}
                            />
                            <TextInput
                              label="นามสกุล (ไทย)"
                              placeholder="ภาษาไทย"
                              required
                              radius="md"
                              value={manualData.lastName}
                              onChange={(e) => setManualData({ ...manualData, lastName: e.target.value })}
                            />
                          </Group>
                          <Button
                            type="submit"
                            size="xl"
                            fullWidth
                            color="emerald"
                            mt="md"
                            radius="md"
                            style={{ height: 64, fontSize: 18, boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}
                          >
                            ลงทะเบียนและรับ QR Code
                          </Button>
                        </Stack>
                      </Box>
                    )}
                    
                    <Button variant="subtle" color="gray" component={Link} href="/">
                      <IconArrowLeft size={16} style={{ marginRight: 8 }} /> กลับหน้าหลัก
                    </Button>
                  </Stack>
                )}

                {/* Step: READING */}
                {step === 'READING' && (
                  <Stack align="center" gap="lg" py={40}>
                    <Loader size={60} color="skyBlue" type="bars" />
                    <Stack gap={4} align="center">
                      <Text fw={700} size="xl" c="#1E3A5F">
                        กำลังดำเนินการ...
                      </Text>
                      <Text size="sm" c="dimmed">
                        {regMode === 'CARD' ? 'กรุณาอย่าดึงบัตรออกจนกว่าจะเสร็จสิ้น' : 'กำลังบันทึกข้อมูลและสร้าง QR Code'}
                      </Text>
                    </Stack>
                  </Stack>
                )}

                {/* Step: SUCCESS */}
                {step === 'SUCCESS' && memberData && (
                  <Stack align="center" gap="lg" w="100%">
                    <Box className="scale-up-animation">
                      <ThemeIcon color="emerald" size={80} radius="xl">
                        <IconCircleCheck size={48} />
                      </ThemeIcon>
                    </Box>

                    <Stack align="center" gap={4}>
                      <Text fw={800} size="24px" c="#1E3A5F">
                        ลงทะเบียนสำเร็จ!
                      </Text>
                      <Text size="lg" fw={600} c="emerald">
                        ยินดีต้อนรับคุณ {memberData.fullNameTh}
                      </Text>
                    </Stack>

                    <Paper withBorder p="xl" radius="lg" style={{ background: '#FFFFFF', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                      <Stack align="center" gap="md">
                        <Box style={{ padding: 10, borderRadius: 12, border: '2px solid #F1F5F9' }}>
                          <QRCodeSVG
                            value={memberData.qrToken}
                            size={220}
                            level="H"
                            includeMargin={false}
                          />
                        </Box>
                        <Stack align="center" gap={2}>
                          <Text size="xs" c="dimmed" tt="uppercase" fw={800}>
                            QR Code เข้าห้องสมุด (รายวัน)
                          </Text>
                          <Text size="sm" c="red" fw={700}>
                            Valid until: {new Date(memberData.expiresAt).toLocaleTimeString('th-TH')} น.
                          </Text>
                        </Stack>
                      </Stack>
                    </Paper>

                    <Text size="sm" ta="center" c="dimmed">
                      รหัสสมาชิก: {memberData.memberNo} <br />
                      ใช้ QR นี้สแกนที่ประตูเพื่อเข้าสู่หอสมุด
                    </Text>

                    <Button size="lg" fullWidth variant="light" color="skyBlue" onClick={reset} radius="md">
                      ลงทะเบียนคนถัดไป
                    </Button>
                  </Stack>
                )}

                {/* Step: ERROR */}
                {step === 'ERROR' && (
                  <Stack align="center" gap="lg" w="100%">
                    <Alert
                      variant="light"
                      color="red"
                      radius="md"
                      title="เกิดข้อผิดพลาด"
                      icon={<IconAlertCircle size={20} />}
                    >
                      {error}
                    </Alert>
                    
                    <Button size="lg" fullWidth color="red" onClick={reset} radius="md">
                      ลองใหม่อีกครั้ง
                    </Button>
                  </Stack>
                )}

              </Stack>
            </Card>
          )}
        </Transition>

        {/* Footer Info */}
        <Group justify="center" mt="xl">
          <Text size="xs" c="dimmed">
            &copy; {new Date().getFullYear()} สำนักหอสมุด - QR Access Control
          </Text>
        </Group>

        <style jsx global>{`
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(56, 189, 248, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
          }
          .pulse-animation {
            animation: pulse 2s infinite;
          }
          @keyframes scaleUp {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .scale-up-animation {
            animation: scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
        `}</style>
      </Container>
    </Box>
  );
}
