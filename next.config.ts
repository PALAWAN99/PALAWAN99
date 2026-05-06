import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma', '.prisma/client'],
};

export default nextConfig;
// Force Next.js dev server restart to clear actions module cache
