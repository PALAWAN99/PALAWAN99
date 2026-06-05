/**
 * แปลข้อความภาษาไทย → อังกฤษ + จีน (ฝั่งเซิร์ฟเวอร์เท่านั้น)
 * - ถ้ามี GOOGLE_TRANSLATE_API_KEY ใช้ Google Cloud Translation v2
 * - ถ้าไม่มี ใช้ MyMemory (ฟรี มีโควตา) — เหมาะกับ dev / โหลดต่ำ
 */

async function googleTranslate(
  text: string,
  target: string,
  apiKey: string,
): Promise<string> {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: 'th',
      target,
      format: 'text',
    }),
  });
  const json = (await res.json()) as {
    data?: { translations?: { translatedText?: string }[] };
    error?: { message?: string };
  };
  if (!res.ok) {
    throw new Error(json.error?.message || `Google Translate HTTP ${res.status}`);
  }
  const out = json.data?.translations?.[0]?.translatedText?.trim();
  if (!out) throw new Error('Google Translate returned empty text');
  return out;
}

async function myMemoryPair(text: string, langpair: string): Promise<string> {
  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', text.slice(0, 450));
  url.searchParams.set('langpair', langpair);
  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'SmartCard-Reader-Member/1.0 (admin translate)' },
  });
  const json = (await res.json()) as {
    responseData?: { translatedText?: string };
    responseStatus?: number;
    QuotaExceeded?: boolean;
  };
  const translated = json.responseData?.translatedText?.trim() ?? '';
  if (json.QuotaExceeded || json.responseStatus === 429) {
    throw new Error('MyMemory quota exceeded — set GOOGLE_TRANSLATE_API_KEY for production');
  }
  if (
    !translated ||
    translated.includes('MYMEMORY WARNING') ||
    translated.includes('INVALID')
  ) {
    throw new Error('MyMemory translation failed for this text');
  }
  return translated;
}

export async function translateThToEnZh(text: string): Promise<{ nameEn: string; nameZh: string }> {
  const trimmed = text.trim();
  if (trimmed.length < 2) {
    throw new Error('Text too short');
  }

  const googleKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (googleKey) {
    const [nameEn, nameZh] = await Promise.all([
      googleTranslate(trimmed, 'en', googleKey),
      googleTranslate(trimmed, 'zh-CN', googleKey),
    ]);
    return { nameEn, nameZh };
  }

  const [nameEn, nameZh] = await Promise.all([
    myMemoryPair(trimmed, 'th|en'),
    myMemoryPair(trimmed, 'th|zh-CN'),
  ]);
  return { nameEn, nameZh };
}
