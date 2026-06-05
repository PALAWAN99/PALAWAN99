import path from 'node:path';
import { NextRequest } from 'next/server';
import { readDownloadPackage } from '@/lib/download-package-response';

export const dynamic = 'force-dynamic';

const FILES = {
  mac: 'kku-card-bridge-easy-install-mac.zip',
  windows: 'kku-card-bridge-easy-install-windows.zip',
} as const;

export async function GET(request: NextRequest) {
  const os = request.nextUrl.searchParams.get('os')?.toLowerCase();
  const filename =
    os === 'windows' || os === 'win' ? FILES.windows : FILES.mac;

  const filePath = path.join(process.cwd(), 'public', 'downloads', filename);

  return readDownloadPackage(filePath, 'application/zip', filename);
}
