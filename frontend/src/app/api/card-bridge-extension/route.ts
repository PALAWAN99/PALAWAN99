import path from 'node:path';
import { readDownloadPackage } from '@/lib/download-package-response';
import { CARD_BRIDGE_ZIP_FILENAME } from '@/lib/card-bridge-download';

export const dynamic = 'force-dynamic';

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    'public',
    'downloads',
    CARD_BRIDGE_ZIP_FILENAME,
  );

  return readDownloadPackage(filePath, 'application/zip', CARD_BRIDGE_ZIP_FILENAME);
}
