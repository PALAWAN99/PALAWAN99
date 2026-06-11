const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

type SiteVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  'error-codes'?: string[];
};

const MIN_SCORE_PRODUCTION = 0.5;
const MIN_SCORE_DEVELOPMENT = 0.3;

/** Production enforces siteverify unless RECAPTCHA_ENFORCE is set explicitly. */
export function isRecaptchaEnforced(): boolean {
  if (process.env.RECAPTCHA_ENFORCE === 'true') return true;
  if (process.env.RECAPTCHA_ENFORCE === 'false') return false;
  
  // Fallback: If no site key is configured on the server, disable enforcement
  // to prevent locking out administrators.
  if (!getRecaptchaSiteKey()) {
    return false;
  }
  
  return process.env.NODE_ENV === 'production';
}

/** Public site key — available at runtime from container env (not only build-time NEXT_PUBLIC). */
export function getRecaptchaSiteKey(): string | null {
  const key =
    process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY ??
    process.env.GOOGLE_RECAPTCHA_SITE_KEY;
  const trimmed = key?.trim();
  return trimmed ? trimmed : null;
}

export async function verifyRecaptchaV3(
  token: string,
  expectedAction = 'login',
): Promise<{ ok: boolean; error?: string }> {
  if (!isRecaptchaEnforced()) {
    return { ok: true };
  }

  const secret = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return { ok: false, error: 'GOOGLE_RECAPTCHA_SECRET_KEY is not configured' };
  }
  if (!token) {
    return { ok: false, error: 'Missing reCAPTCHA token' };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  const res = await fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    return { ok: false, error: 'reCAPTCHA verification request failed' };
  }

  const data = (await res.json()) as SiteVerifyResponse;

  if (!data.success) {
    return {
      ok: false,
      error: data['error-codes']?.join(', ') ?? 'reCAPTCHA rejected',
    };
  }

  if (data.action && data.action !== expectedAction) {
    return { ok: false, error: 'reCAPTCHA action mismatch' };
  }

  const minScore =
    process.env.NODE_ENV === 'production'
      ? MIN_SCORE_PRODUCTION
      : MIN_SCORE_DEVELOPMENT;

  if (typeof data.score === 'number' && data.score < minScore) {
    return { ok: false, error: `reCAPTCHA score too low (${data.score})` };
  }

  return { ok: true };
}
