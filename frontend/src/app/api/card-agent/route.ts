import path from 'node:path';
import { NextRequest } from 'next/server';
import { readDownloadPackage } from '@/lib/download-package-response';

export const dynamic = 'force-dynamic';

const FILES = {
  mac: { name: 'kku-card-api-mac.dmg', type: 'application/x-apple-diskimage' },
  windows: {
    name: 'kku-card-api-windows.zip',
    type: 'application/zip',
  },
} as const;

export async function GET(request: NextRequest) {
  const os = request.nextUrl.searchParams.get('os')?.toLowerCase();
  const spec =
    os === 'windows' || os === 'win' ? FILES.windows : FILES.mac;

  const filePath = path.join(process.cwd(), 'public', 'downloads', spec.name);

  return readDownloadPackage(filePath, spec.type, spec.name);
}
