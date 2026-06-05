'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Card, Stack, Text, Box, Center, Badge, Button, Loader, Avatar, Group, Paper } from '@mantine/core';
import { QRCodeSVG } from 'qrcode.react';
import { IconTicket, IconDeviceFloppy, IconCheck, IconIdBadge2 } from '@tabler/icons-react';

function TicketContent() {
  const searchParams = useSearchParams();
  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(dataParam)));
        setTicketData(decoded);
      } catch (e) {
        console.error('Invalid ticket data', e);
      }
    }
    // Simulate short loading for aesthetic effect
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [searchParams]);

  if (loading) {
    return (
      <Center h="100vh" bg="var(--bg-primary)">
        <Stack align="center">
          <Loader color="skyBlue" size="xl" type="bars" />
          <Text fw={600} c="dimmed">กำลังสร้างตั๋ว E-Ticket...</Text>
        </Stack>
      </Center>
    );
  }

  if (!ticketData) {
    return (
      <Center h="100vh" bg="var(--bg-primary)">
        <Card withBorder p="xl" radius="md">
          <Stack align="center">
            <IconTicket size={48} color="var(--color-red)" opacity={0.5} />
            <Text fw={700}>ไม่พบข้อมูลตั๋ว</Text>
            <Text size="sm" c="dimmed">QR Code อาจหมดอายุหรือไม่ถูกต้อง</Text>
          </Stack>
        </Card>
      </Center>
    );
  }

  const accessCode = `GATE-ACCESS-${ticketData.citizenId}-${new Date().toISOString().split('T')[0]}`;

  return (
    <Box mih="100vh" bg="var(--bg-primary)" py="xl" className="ticket-container">
      <Container size="xs">
        <Stack gap="xl" align="center">
          
          <Stack align="center" gap={4}>
            <IconIdBadge2 size={32} color="var(--color-sky)" />
            <Text fw={800} size="xl">E-Ticket เข้าใช้บริการ</Text>
            <Text size="sm" c="dimmed">กรุณาสแกน QR Code ด้านล่างที่เครื่องกั้น</Text>
          </Stack>

          <Card 
            radius="xl" 
            p="xl" 
            w="100%"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Stack align="center" gap="lg">
              <Badge size="lg" color="green" variant="light" leftSection={<IconCheck size={14} />}>
                พร้อมใช้งาน
              </Badge>

              <Box
                style={{
                  padding: '24px',
                  background: 'white',
                  borderRadius: '24px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
              >
                <QRCodeSVG 
                  value={accessCode} 
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </Box>

              <Text ff="monospace" size="xs" c="dimmed" style={{ letterSpacing: 2 }}>{accessCode}</Text>

              <Paper withBorder p="md" radius="md" bg="var(--bg-secondary)" w="100%" mt="md">
                <Stack gap="sm">
                  <Group wrap="nowrap" gap="md">
                    <Avatar color="skyBlue" radius="xl">
                      {ticketData.fullNameTh ? ticketData.fullNameTh.charAt(0) : 'U'}
                    </Avatar>
                    <Stack gap={0} style={{ flex: 1 }}>
                      <Text size="xs" c="dimmed">ผู้ใช้งาน</Text>
                      <Text fw={700} lineClamp={1}>{ticketData.fullNameTh || 'Unknown User'}</Text>
                    </Stack>
                  </Group>

                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">รหัสบัตร</Text>
                    <Text size="sm" ff="monospace">{ticketData.citizenId}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">ประเภท</Text>
                    <Badge color="blue" size="sm">บุคคลภายนอก (Visitor)</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed">หมดอายุ</Text>
                    <Text size="sm" fw={700} c="red">วันนี้ (23:59 น.)</Text>
                  </Group>

                  {(ticketData.school || ticketData.phone || ticketData.email) && (
                    <>
                      <Box mt="xs" style={{ borderTop: '1px dashed var(--mantine-color-gray-3)' }} />
                      {ticketData.school && (
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">สถานศึกษา</Text>
                          <Text size="xs" fw={600} c="skyBlue" lineClamp={1}>{ticketData.school}</Text>
                        </Group>
                      )}
                      {ticketData.phone && (
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">เบอร์โทร</Text>
                          <Text size="xs">{ticketData.phone}</Text>
                        </Group>
                      )}
                      {ticketData.email && (
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">อีเมล</Text>
                          <Text size="xs">{ticketData.email}</Text>
                        </Group>
                      )}
                    </>
                  )}
                </Stack>
              </Paper>
            </Stack>
          </Card>

          <Button 
            size="lg" 
            fullWidth 
            color="skyBlue" 
            radius="xl"
            leftSection={<IconDeviceFloppy size={20} />}
            onClick={() => alert('ฟังก์ชันบันทึกรูปภาพจะทำงานเมื่อเปิดใน Mobile Browser')}
          >
            แคปหน้าจอเพื่อบันทึก
          </Button>

        </Stack>
      </Container>
      <style jsx global>{`
        .ticket-container {
          background-image: radial-gradient(circle at 50% -20%, rgba(56, 189, 248, 0.15), transparent 60%);
        }
      `}</style>
    </Box>
  );
}

export default function TicketPage() {
  return (
    <Suspense fallback={
      <Center h="100vh" bg="var(--bg-primary)">
        <Loader color="skyBlue" />
      </Center>
    }>
      <TicketContent />
    </Suspense>
  );
}
