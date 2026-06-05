import { readFile, stat } from 'node:fs/promises';
import { NextResponse } from 'next/server';

/** Avoid stale Windows/Mac zip after deploy (browser/CDN cache). */
export const DOWNLOAD_PACKAGE_CACHE_CONTROL = 'no-store, no-cache, must-revalidate';

export async function readDownloadPackage(
  filePath: string,
  contentType: string,
  filename: string,
): Promise<NextResponse> {
  try {
    const [data, st] = await Promise.all([readFile(filePath), stat(filePath)]);
    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': DOWNLOAD_PACKAGE_CACHE_CONTROL,
        'X-Package-Mtime': String(Math.floor(st.mtimeMs)),
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Package not built. Run npm run extension:pack before deploy.' },
      { status: 404 },
    );
  }
}
