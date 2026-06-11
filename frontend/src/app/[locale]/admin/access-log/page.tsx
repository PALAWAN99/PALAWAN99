import { redirect } from 'next/navigation';

export default function AccessLogPage() {
  redirect('/admin/events');
}
