'use client';

import { useLayoutEffect } from 'react';

const EXTENSION_ATTRS = [
  'cz-shortcut-listen',
  'data-new-gr-c-s-check-loaded',
  'data-gr-ext-installed',
  'data-lt-installed',
] as const;

/** Removes browser-extension attributes that cause hydration mismatches on `<html>` / `<body>`. */
export function StripExtensionAttrs() {
  useLayoutEffect(() => {
    function strip() {
      const html = document.documentElement;
      const body = document.body;
      for (const attr of EXTENSION_ATTRS) {
        try {
          html.removeAttribute(attr);
          body?.removeAttribute(attr);
        } catch {
          /* ignore */
        }
      }
    }

    strip();

    const observer = new MutationObserver(strip);
    observer.observe(document.documentElement, { attributes: true });
    if (document.body) {
      observer.observe(document.body, { attributes: true });
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
