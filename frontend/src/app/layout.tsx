import type { Metadata } from "next";
import { mantineHtmlProps, ColorSchemeScript } from "@mantine/core";
import { AppShell } from "@/components/providers/AppShell";
import { withBasePath } from "@/lib/base-path";
import "./globals.css";

const faviconPath = withBasePath("/favicon.svg");
const appleIconPath = withBasePath("/apple-touch-icon.png");

const PRE_HYDRATE_SCRIPT = `
(function(){
  var h=document.documentElement,b=document.body;
  ['cz-shortcut-listen','data-new-gr-c-s-check-loaded','data-gr-ext-installed','data-lt-installed'].forEach(function(a){
    try{h.removeAttribute(a);b&&b.removeAttribute(a);}catch(e){}
  });
})();
`.trim();

export const metadata: Metadata = {
  title: {
    default: "QR Gate Access Control — ระบบ QR เข้า-ออกประตู",
    template: "%s | QR Gate Access Control",
  },
  description:
    "ระบบจัดการเข้า-ออกอาคารด้วย QR Code รองรับ 3 ภาษา (ไทย/English/中文) — QR Gate Access Control System",
  keywords: ["QR Code", "Gate Access", "Access Control", "ระบบเข้า-ออก", "门禁系统"],
  authors: [{ name: "QR Gate Team" }],
  icons: {
    icon: faviconPath,
    apple: appleIconPath,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body suppressHydrationWarning>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: PRE_HYDRATE_SCRIPT }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
