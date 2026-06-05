'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Accordion,
  Alert,
  Box,
  Button,
  Group,
  Modal,
  Paper,
  Progress,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconChevronDown, IconExternalLink, IconShieldCheck } from '@tabler/icons-react';
import { publicAssetPath } from '@/lib/base-path';

const PDPA_PDF_PATH = publicAssetPath(
  process.env.NEXT_PUBLIC_PDPA_KKU_PDF_URL ?? '/pdpa-kku-2565.pdf',
);

interface PdpaConsentModalProps {
  open: boolean;
  onConsent: () => void;
  onCancel: () => void;
}

function Section({
  title,
  children,
  variant = 'default',
}: {
  title: string;
  children: ReactNode;
  variant?: 'default' | 'law' | 'consent';
}) {
  const bg =
    variant === 'law'
      ? 'var(--mantine-color-skyBlue-0)'
      : variant === 'consent'
        ? 'var(--mantine-color-yellow-0)'
        : undefined;
  const border =
    variant === 'law'
      ? '1px solid var(--mantine-color-skyBlue-2)'
      : variant === 'consent'
        ? '1px solid var(--mantine-color-yellow-3)'
        : undefined;

  return (
    <Paper p="md" radius="md" bg={bg} style={{ border }}>
      <Text fw={700} size="sm" mb="xs" c="navy.8">
        {title}
      </Text>
      {children}
    </Paper>
  );
}

function PdpaConsentModalBody({ onConsent, onCancel }: Omit<PdpaConsentModalProps, 'open'>) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pdfAvailable, setPdfAvailable] = useState<boolean | null>(null);
  const pdfProbedRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const applyScrollMetrics = useCallback((scrollTop: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const { scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 8) {
      setScrollProgress(100);
      setScrolledToBottom(true);
      return;
    }
    const ratio = (scrollTop + clientHeight) / scrollHeight;
    setScrollProgress(Math.min(100, Math.round(ratio * 100)));
    setScrolledToBottom(maxScroll - scrollTop <= 56);
  }, []);

  const updateScrollState = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    applyScrollMetrics(el.scrollTop);
  }, [applyScrollMetrics]);

  const handleScrollPositionChange = useCallback(
    (position: { x: number; y: number }) => {
      applyScrollMetrics(position.y);
    },
    [applyScrollMetrics],
  );

  useEffect(() => {
    const run = () => updateScrollState();
    const raf = requestAnimationFrame(run);
    const t1 = window.setTimeout(run, 150);
    const t2 = window.setTimeout(run, 500);
    const el = viewportRef.current;
    const ro =
      el &&
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(run)
        : null;
    if (el && ro) ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro?.disconnect();
    };
  }, [pdfAvailable, updateScrollState]);

  const probePdpaPdf = useCallback(() => {
    if (pdfProbedRef.current) return;
    pdfProbedRef.current = true;
    fetch(PDPA_PDF_PATH, { method: 'HEAD' })
      .then((res) => setPdfAvailable(res.ok))
      .catch(() => setPdfAvailable(false));
  }, []);

  return (
      <Stack gap="md">
        <Box>
          <Group justify="space-between" mb={6}>
            <Text size="xs" c="dimmed">
              ความคืบหน้าการอ่าน
            </Text>
            <Text size="xs" fw={600} c={scrolledToBottom ? 'green.7' : 'navy.6'}>
              {scrollProgress}%
            </Text>
          </Group>
          <Progress
            value={scrollProgress}
            size="sm"
            radius="xl"
            color={scrolledToBottom ? 'green' : 'skyBlue'}
            aria-label="ความคืบหน้าการอ่านข้อตกลง"
          />
        </Box>

        <ScrollArea
          viewportRef={viewportRef}
          h="min(52vh, 420px)"
          type="auto"
          offsetScrollbars
          scrollbarSize={8}
          onScrollPositionChange={handleScrollPositionChange}
        >
            <Stack gap="md" pr="sm" pb="md">
              <Text fw={700} size="md" c="navy.9">
                พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
              </Text>

              <Section title="วัตถุประสงค์ในการเก็บรวบรวมข้อมูล">
                <Text size="sm" c="gray.8" lh={1.65}>
                  ระบบนี้ทำการอ่านข้อมูลจากบัตรประจำตัวประชาชนของท่านผ่านเครื่องอ่านบัตรอัจฉริยะ
                  DUALi DE-620 เพื่อวัตถุประสงค์ในการยืนยันตัวตนและบันทึกข้อมูลตามที่ท่านร้องขอเท่านั้น
                </Text>
              </Section>

              <Section title="ข้อมูลที่จะเก็บรวบรวม">
                <Stack component="ul" gap={4} pl="md" style={{ listStyle: 'disc' }}>
                  {[
                    'เลขประจำตัวประชาชน 13 หลัก',
                    'ชื่อ-นามสกุล (ภาษาไทยและภาษาอังกฤษ)',
                    'วันเดือนปีเกิด',
                    'เพศ',
                    'ที่อยู่ตามบัตร',
                    'วันที่ออกบัตรและวันหมดอายุ',
                    'รูปถ่าย (เฉพาะเมื่อท่านเลือกดึงรูป)',
                  ].map((item) => (
                    <Text key={item} component="li" size="sm" c="gray.8">
                      {item}
                    </Text>
                  ))}
                </Stack>
              </Section>

              <Section title="มาตรา 19 — หลักความยินยอม" variant="law">
                <Text size="sm" c="gray.7" fs="italic" lh={1.65}>
                  ผู้ควบคุมข้อมูลส่วนบุคคลจะกระทำการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลไม่ได้
                  หากเจ้าของข้อมูลส่วนบุคคลไม่ได้ให้ความยินยอมไว้ก่อนหรือในขณะนั้น
                </Text>
              </Section>

              <Section title="มาตรา 21 — การใช้ตามวัตถุประสงค์" variant="law">
                <Text size="sm" c="gray.7" fs="italic" lh={1.65}>
                  ผู้ควบคุมข้อมูลส่วนบุคคลต้องทำการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล
                  ตามวัตถุประสงค์ที่ได้แจ้งเจ้าของข้อมูลส่วนบุคคลไว้ก่อนหรือในขณะที่เก็บรวบรวม
                </Text>
              </Section>

              <Section title="มาตรา 22 — หลักความจำเป็น" variant="law">
                <Text size="sm" c="gray.7" fs="italic" lh={1.65}>
                  การเก็บรวบรวมข้อมูลส่วนบุคคล ให้เก็บรวบรวมได้เท่าที่จำเป็น
                  ภายใต้วัตถุประสงค์อันชอบด้วยกฎหมายของผู้ควบคุมข้อมูลส่วนบุคคล
                </Text>
              </Section>

              <Section title="มาตรา 23 — การแจ้งรายละเอียด" variant="law">
                <Text size="sm" c="gray.7" fs="italic" lh={1.65}>
                  ในการเก็บรวบรวมข้อมูลส่วนบุคคล ผู้ควบคุมข้อมูลส่วนบุคคลจะต้องแจ้งให้เจ้าของข้อมูลทราบ
                  ถึงวัตถุประสงค์ ข้อมูลที่เก็บ ระยะเวลา ผู้รับข้อมูล ข้อมูลผู้ควบคุม และสิทธิของเจ้าของข้อมูล
                </Text>
              </Section>

              <Section title="สิทธิของเจ้าของข้อมูล (มาตรา 30-36)">
                <Stack gap={4}>
                  {[
                    'สิทธิในการเข้าถึงและขอรับสำเนาข้อมูล',
                    'สิทธิในการโอนย้ายข้อมูล',
                    'สิทธิในการคัดค้านการเก็บรวบรวม ใช้ หรือเปิดเผย',
                    'สิทธิในการลบหรือทำลายข้อมูล',
                    'สิทธิในการระงับการใช้และแก้ไขข้อมูล',
                    'สิทธิในการถอนความยินยอมได้ทุกเมื่อ',
                  ].map((item) => (
                    <Text key={item} size="sm" c="gray.8">
                      • {item}
                    </Text>
                  ))}
                </Stack>
              </Section>

              <Section title="การรักษาความปลอดภัยของข้อมูล">
                <Text size="sm" c="gray.8" lh={1.65}>
                  ข้อมูลที่อ่านจากบัตรจะถูกประมวลผลภายในเครื่องของท่าน (Local Processing)
                  ไม่ส่งออกภายนอกโดยอัตโนมัติ เว้นแต่ท่านจะส่งออกด้วยตนเองผ่าน Export
                </Text>
              </Section>

              <Accordion
                variant="separated"
                radius="md"
                onChange={(value) => {
                  const open =
                    value === 'kku' ||
                    (Array.isArray(value) && value.includes('kku'));
                  if (open) probePdpaPdf();
                  window.setTimeout(updateScrollState, 200);
                }}
              >
                <Accordion.Item value="kku">
                  <Accordion.Control>
                    <Text fw={600} size="sm">
                      ระเบียบ มข. ว่าด้วยการคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2565
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="sm">
                      <Text size="xs" c="dimmed">
                        ประกาศ ณ วันที่ 1 มิถุนายน พ.ศ. 2565 โดยนายกสภามหาวิทยาลัยขอนแก่น
                      </Text>
                      <Text size="sm" c="gray.8" lh={1.65}>
                        ระเบียบนี้กำหนดหลักการคุ้มครองข้อมูลส่วนบุคคลภายในมหาวิทยาลัยขอนแก่น
                        ให้สอดคล้องกับ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
                        รวมถึงสิทธิ หน้าที่ และแนวปฏิบัติของหน่วยงานและบุคลากร
                      </Text>
                      {pdfAvailable === true ? (
                        <Button
                          component="a"
                          href={PDPA_PDF_PATH}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="light"
                          color="navy"
                          size="sm"
                          leftSection={<IconExternalLink size={16} />}
                          w="fit-content"
                        >
                          เปิดเอกสาร PDF ฉบับเต็ม
                        </Button>
                      ) : pdfAvailable === false ? (
                        <Alert color="yellow" variant="light" radius="md" title="ไม่พบไฟล์ PDF ในระบบ">
                          <Text size="xs">
                            วางไฟล์ที่{' '}
                            <Text span ff="monospace" size="xs">
                              frontend/public/pdpa-kku-2565.pdf
                            </Text>{' '}
                            หรือตั้งค่า{' '}
                            <Text span ff="monospace" size="xs">
                              NEXT_PUBLIC_PDPA_KKU_PDF_URL
                            </Text>{' '}
                            ใน .env
                          </Text>
                        </Alert>
                      ) : (
                        <Text size="xs" c="dimmed">
                          เปิดหัวข้อนี้เพื่อตรวจสอบลิงก์เอกสาร PDF
                        </Text>
                      )}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>

              <Section title="คำให้ความยินยอม" variant="consent">
                <Text size="sm" c="gray.8" lh={1.65}>
                  ข้าพเจ้าได้อ่านและเข้าใจข้อมูลข้างต้นแล้ว และให้ความยินยอมโดยสมัครใจ
                  ในการเก็บรวบรวมข้อมูลส่วนบุคคลจากบัตรประจำตัวประชาชน
                  ข้าพเจ้าทราบดีว่าสามารถถอนความยินยอมได้ทุกเมื่อโดยปิดระบบหรือรีเฟรชหน้าเว็บ
                </Text>
              </Section>
            </Stack>
        </ScrollArea>

        <Group justify="space-between" align="center" wrap="wrap" gap="sm" pt="xs">
          {!scrolledToBottom ? (
            <Group gap={6} c="dimmed">
              <IconChevronDown size={16} style={{ animation: 'pdpaHintBounce 1.2s ease-in-out infinite' }} />
              <Text size="xs">เลื่อนลงให้ถึงท้ายเอกสารก่อนกดยินยอม</Text>
            </Group>
          ) : (
            <Text size="xs" c="green.7" fw={500}>
              อ่านครบแล้ว — กดยินยอมได้
            </Text>
          )}

          <Group gap="sm" ml="auto">
            <Button variant="default" color="gray" onClick={onCancel}>
              ไม่ยินยอม
            </Button>
            <Button
              variant="filled"
              color={scrolledToBottom ? 'green' : 'gray'}
              disabled={!scrolledToBottom}
              onClick={onConsent}
              style={{ minWidth: 120 }}
            >
              ยินยอม
            </Button>
          </Group>
        </Group>
      </Stack>
  );
}

export function PdpaConsentModal({ open, onConsent, onCancel }: PdpaConsentModalProps) {
  return (
    <Modal
      opened={open}
      onClose={onCancel}
      title={
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={36} radius="md" color="skyBlue" variant="light">
            <IconShieldCheck size={20} />
          </ThemeIcon>
          <Stack gap={2}>
            <Text fw={700} size="lg" c="navy.9" lh={1.3}>
              ข้อตกลงความยินยอมตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
            </Text>
            <Text size="sm" c="dimmed">
              กรุณาเลื่อนอ่านให้ครบก่อนกดยินยอม
            </Text>
          </Stack>
        </Group>
      }
      size="lg"
      centered
      radius="lg"
      padding="lg"
      overlayProps={{ backgroundOpacity: 0.55, blur: 4 }}
      styles={{
        title: { width: '100%' },
        body: { paddingTop: 0 },
      }}
    >
      {open ? <PdpaConsentModalBody onConsent={onConsent} onCancel={onCancel} /> : null}
    </Modal>
  );
}
