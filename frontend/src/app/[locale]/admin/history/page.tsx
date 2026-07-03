import HistoryClient from './HistoryClient';

type Props = {
  searchParams: Promise<{ memberNo?: string }>;
};

export default async function HistoryPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <HistoryClient initialMemberNo={sp.memberNo?.trim() || null} />;
}
