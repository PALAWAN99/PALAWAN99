import type { NextConfig } from "next";
<<<<<<< HEAD
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/i18n.ts'
);

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@prisma/client', 'prisma', '.prisma/client'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);

=======

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
>>>>>>> origin/upload/gate-system
