import { existsSync } from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';

/** Monorepo root (parent of `frontend/` when cwd is the Next app). */
function resolveRepoRoot(): string {
  const candidates = [
    path.resolve(process.cwd(), '..'),
    path.resolve(__dirname, '..'),
  ];
  for (const root of candidates) {
    if (existsSync(path.join(root, '.env'))) return root;
  }
  return path.resolve(process.cwd(), '..');
}

export const REPO_ROOT = resolveRepoRoot();

/** Load monorepo `.env` from repository root. */
export function loadRootEnv(): void {
  const envPath = path.join(REPO_ROOT, '.env');
  const result = config({ path: envPath });
  if (process.env.NODE_ENV === 'development' && !result.parsed && !process.env.AUTH_SECRET) {
    console.warn(`[load-root-env] Could not load ${envPath}`);
  }
}

loadRootEnv();
