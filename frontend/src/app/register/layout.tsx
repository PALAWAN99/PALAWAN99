import { MantineAppProvider } from '@/components/providers/MantineAppProvider';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <MantineAppProvider>
          {children}
        </MantineAppProvider>
      </body>
    </html>
  );
}
