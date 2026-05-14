'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThaiIdCardReader, ThaiIdData } from '@/lib/idcard/reader';
import { useTranslations } from 'next-intl';

export function useIdCardReader() {
  const t = useTranslations('IdCard');
  const [isConnected, setIsConnected] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [cardData, setCardData] = useState<ThaiIdData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reader, setReader] = useState<ThaiIdCardReader | null>(null);

  useEffect(() => {
    setReader(new ThaiIdCardReader());
  }, []);

  const handleConnect = useCallback(async () => {
    if (!reader) return;
    setError(null);
    const success = await reader.connect();
    if (success) {
      setIsConnected(true);
    } else {
      setError(t('errorConnect'));
    }
  }, [reader, t]);

  const handleRead = useCallback(async () => {
    if (!reader || !isConnected) return;
    setIsReading(true);
    setError(null);
    setCardData(null);

    try {
      const data = await reader.readAllData();
      if (data) {
        setCardData(data);
        if (data.expireDate) {
          const parts = data.expireDate.split('/');
          if (parts.length === 3) {
            const year = parseInt(parts[2]);
            const currentYear = new Date().getFullYear();
            const yearCe = year > 2500 ? year - 543 : year;
            if (yearCe < currentYear) {
              setError(t('errorExpired'));
            }
          }
        }
      } else {
        setError(t('errorRead'));
      }
    } catch (err) {
      setError(t('errorGeneral'));
    } finally {
      setIsReading(false);
    }
  }, [reader, isConnected, t]);

  const handleDisconnect = useCallback(async () => {
    if (reader) {
      await reader.disconnect();
      setIsConnected(false);
      setCardData(null);
    }
  }, [reader]);

  return {
    isConnected,
    isReading,
    cardData,
    setCardData,
    error,
    setError,
    handleConnect,
    handleRead,
    handleDisconnect
  };
}
