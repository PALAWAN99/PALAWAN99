import { config as loadDotenv } from 'dotenv';
import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';
import path from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';

// Monorepo: load root `.env` before Next/Turbopack (loadEnvConfig alone can inject 0 vars in dev)
const repoEnvPath = path.resolve(__dirname, '../.env');
loadDotenv({ path: repoEnvPath });
loadEnvConfig(path.resolve(__dirname, '..'));

const withNextIntl = createNextIntlPlugin();

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '') || undefined;

const nextConfig: NextConfig = {
  output: 'standalone',
  ...(basePath ? { basePath } : {}),
  /** อย่าให้ Turbopack bundle Prisma เป็น `index-browser.js` ใน SSR — จะไม่มี model delegate เช่น changelogEntry */
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg'],
  images: {
    remotePatterns: [],
  },
};

export default withNextIntl(nextConfig);
