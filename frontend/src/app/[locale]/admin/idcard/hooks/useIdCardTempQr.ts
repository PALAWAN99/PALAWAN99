'use client';

import { useCallback, useState } from 'react';
import { notifications } from '@mantine/notifications';
import {
  fetchDefaultQrPolicyIdApi,
  issueTempQrApi,
} from '../lib/idcard-pennueng-api';

export function useIdCardTempQr() {
  const [issuing, setIssuing] = useState(false);
  const [qr, setQr] = useState<{
    qrContent: string;
    expiresAt: string;
    memberKey?: string;
  } | null>(null);

  const issueTempQr = useCallback(async (memberNo: string) => {
    setIssuing(true);
    setQr(null);
    try {
      const policyId = await fetchDefaultQrPolicyIdApi();
      const data = await issueTempQrApi({ memberNo, policyId });
      setQr(data);
      notifications.show({
        title: 'สำเร็จ',
        message: 'ออก QR ชั่วคราวเรียบร้อย',
        color: 'teal',
      });
      return data;
    } catch (e) {
      notifications.show({
        title: 'ข้อผิดพลาด',
        message: e instanceof Error ? e.message : 'ออก QR ไม่สำเร็จ',
        color: 'red',
      });
      return null;
    } finally {
      setIssuing(false);
    }
  }, []);

  const clearQr = useCallback(() => setQr(null), []);

  return { issuing, qr, issueTempQr, clearQr };
}
