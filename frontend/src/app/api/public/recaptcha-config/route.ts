import { ApiSuccess } from '@/lib/api-response';
import { getRecaptchaSiteKey, isRecaptchaEnforced } from '@/lib/recaptcha';

/** Public reCAPTCHA v3 config (site key is public; loaded at runtime for Docker deploys). */
export async function GET() {
  return ApiSuccess({
    siteKey: getRecaptchaSiteKey(),
    enforce: isRecaptchaEnforced(),
  });
}
