'use client';

import dynamic from 'next/dynamic';

const LoginForm = dynamic(
  () => import('@/components/auth/LoginForm').then((m) => m.LoginForm),
  {
    ssr: false,
    loading: () => (
      <div
        aria-busy="true"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at top left, #1E293B 0%, #0F172A 100%)',
          color: '#94A3B8',
        }}
      >
        กำลังโหลด...
      </div>
    ),
  },
);

export function LoginPageClient() {
  return <LoginForm />;
}
