import Script from 'next/script';

/** GA4 Measurement ID (รหัสการวัด) — ใช้ใน gtag */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function shouldLoadAnalytics(): boolean {
  if (!GA_MEASUREMENT_ID) return false;
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_GA_ENABLED === 'true';
  }
  return true;
}

export function GoogleAnalytics() {
  if (!shouldLoadAnalytics()) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
