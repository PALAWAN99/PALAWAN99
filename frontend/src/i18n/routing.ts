import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['th', 'en', 'zh'],
  defaultLocale: 'th',
  /** Thai at `/`, English at `/en`, Chinese at `/zh` */
  localePrefix: 'as-needed',
  /** Do not auto-redirect `/` to browser language (e.g. `/en`) */
  localeDetection: false,
});

// Lightweight wrappers around Next.js navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
