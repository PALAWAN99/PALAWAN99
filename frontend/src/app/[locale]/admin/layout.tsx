import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AdminShell } from '@/components/layout/AdminShell';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Common');
  return {
    title: {
      default: t('brandName'),
      template: `%s · ${t('brandName')}`,
    },
    description: t('brandSubtitle'),
  };
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
