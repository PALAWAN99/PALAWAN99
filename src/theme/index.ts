'use client';

import { createTheme, MantineColorsTuple } from '@mantine/core';

/* ──────────────────────────────────────────────
 *  Color Palette — ฟ้า / เขียว / ขาว / น้ำเงินเข้ม
 * ──────────────────────────────────────────── */

const skyBlue: MantineColorsTuple = [
  '#e0f7ff',  // 0
  '#b3ecff',  // 1
  '#80dfff',  // 2
  '#4dd2ff',  // 3
  '#38BDF8',  // 4  ← Primary accent
  '#0ea5e9',  // 5
  '#0284c7',  // 6
  '#0369a1',  // 7
  '#075985',  // 8
  '#0c4a6e',  // 9
];

const emerald: MantineColorsTuple = [
  '#ecfdf5',  // 0
  '#d1fae5',  // 1
  '#a7f3d0',  // 2
  '#6ee7b7',  // 3
  '#34d399',  // 4
  '#10B981',  // 5  ← Success
  '#059669',  // 6
  '#047857',  // 7
  '#065f46',  // 8
  '#064e3b',  // 9
];

const navy: MantineColorsTuple = [
  '#f0f9ff',  // 0
  '#e0f2fe',  // 1
  '#bae6fd',  // 2
  '#7dd3fc',  // 3
  '#38bdf8',  // 4
  '#2563a0',  // 5
  '#1E3A5F',  // 6  ← Primary navy
  '#172e4a',  // 7
  '#0f2035',  // 8
  '#0a1628',  // 9
];

export const theme = createTheme({
  primaryColor: 'navy',
  colors: {
    skyBlue,
    emerald,
    navy,
  },
  // ใช้ฟอนต์ Outfit สำหรับ Eng และ Noto Sans Thai สำหรับไทย เพื่อความพรีเมียม
  fontFamily: '"Outfit", "Noto Sans Thai", sans-serif',
  headings: {
    fontFamily: '"Outfit", "Noto Sans Thai", sans-serif',
    fontWeight: '700',
  },
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        fw: 600,
      },
      styles: {
        root: { transition: 'transform 0.15s ease, box-shadow 0.15s ease' },
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm',
        withBorder: true,
      },
      styles: {
        root: { transition: 'transform 0.2s ease, box-shadow 0.2s ease' },
      },
    },
    TextInput: { defaultProps: { radius: 'md' } },
    Select: { defaultProps: { radius: 'md' } },
    Badge: {
      defaultProps: { radius: 'sm', variant: 'light' },
      styles: { root: { textTransform: 'none', fontWeight: 600 } },
    },
  },
  other: {
    appName: 'QR Gate Access',
  },
});
