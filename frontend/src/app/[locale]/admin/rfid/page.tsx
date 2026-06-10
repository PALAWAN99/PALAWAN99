import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import IdCardClient from '../idcard/IdCardClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('IdCard');
  return {
    title: t('rfidTitle'),
    description: t('rfidSubtitle'),
  };
}

export default function RfidAdminPage() {
  return <IdCardClient forceMode="rfid" />;
}
