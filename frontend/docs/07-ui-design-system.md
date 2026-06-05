# 🎨 UI Design System

> **ผู้รับผิดชอบ:** Dev 3 | **Priority:** 🔴 Critical  
> **Tech:** Mantine v7 + Tailwind CSS

---

## 1. Color Palette

### Primary Colors

| ชื่อ | HEX Light | HEX Dark | CSS Variable | ใช้สำหรับ |
|------|-----------|----------|-------------|----------|
| Sky Blue | `#38BDF8` | `#7DD3FC` | `--color-sky` | Accent, Links, Interactive |
| Emerald | `#10B981` | `#34D399` | `--color-emerald` | Success, Active, Confirm |
| White | `#FFFFFF` | `#0F172A` | `--color-bg` | Background |
| Navy | `#1E3A5F` | `#93C5FD` | `--color-navy` | Primary text, Headers |

### Extended Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--bg-primary` | `#FFFFFF` | `#0F172A` | Page background |
| `--bg-secondary` | `#F0F9FF` | `#1E293B` | Card/panel background |
| `--bg-tertiary` | `#E0F2FE` | `#334155` | Hover states |
| `--text-primary` | `#1E3A5F` | `#F0F9FF` | Main text |
| `--text-secondary` | `#475569` | `#94A3B8` | Secondary text |
| `--text-muted` | `#94A3B8` | `#64748B` | Muted/placeholder |
| `--border` | `#CBD5E1` | `#334155` | Borders |
| `--accent-blue` | `#38BDF8` | `#7DD3FC` | Links, buttons |
| `--accent-green` | `#10B981` | `#34D399` | Success states |
| `--status-error` | `#EF4444` | `#F87171` | Errors, denied |
| `--status-warning` | `#F59E0B` | `#FBBF24` | Warnings |
| `--status-info` | `#3B82F6` | `#60A5FA` | Info |

---

## 2. Mantine v7 Theme

```typescript
// theme/mantine-theme.ts
import { createTheme, MantineColorsTuple } from '@mantine/core';

const skyBlue: MantineColorsTuple = [
  '#e0f7ff', '#b3ecff', '#80dfff', '#4dd2ff',
  '#38BDF8', '#0ea5e9', '#0284c7', '#0369a1',
  '#075985', '#0c4a6e',
];

const emerald: MantineColorsTuple = [
  '#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7',
  '#34d399', '#10B981', '#059669', '#047857',
  '#065f46', '#064e3b',
];

const navy: MantineColorsTuple = [
  '#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc',
  '#38bdf8', '#1E3A5F', '#1e3a5f', '#172e4a',
  '#0f2035', '#0a1628',
];

export const theme = createTheme({
  primaryColor: 'navy',
  colors: { skyBlue, emerald, navy },
  fontFamily: '"Inter", "Noto Sans Thai", "Noto Sans SC", sans-serif',
  headings: {
    fontFamily: '"Inter", "Noto Sans Thai", "Noto Sans SC", sans-serif',
    fontWeight: '700',
  },
  radius: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px' },
  defaultRadius: 'md',
  components: {
    Button: { defaultProps: { radius: 'md' } },
    Card: { defaultProps: { radius: 'lg', shadow: 'sm' } },
    TextInput: { defaultProps: { radius: 'md' } },
    Select: { defaultProps: { radius: 'md' } },
  },
});
```

---

## 3. Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 | Inter | 32px / 2rem | 700 | 1.2 |
| H2 | Inter | 24px / 1.5rem | 700 | 1.3 |
| H3 | Inter | 20px / 1.25rem | 600 | 1.4 |
| Body | Inter | 16px / 1rem | 400 | 1.5 |
| Small | Inter | 14px / 0.875rem | 400 | 1.5 |
| Caption | Inter | 12px / 0.75rem | 400 | 1.4 |

### Google Fonts Import
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
```

---

## 4. Dark / Light Mode

```typescript
// components/ThemeToggle.tsx
'use client';
import { useMantineColorScheme, ActionIcon } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      variant="subtle"
      onClick={toggleColorScheme}
      aria-label="Toggle theme"
    >
      {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
    </ActionIcon>
  );
}
```

---

## 5. Component Patterns

### Status Badges

| Status | Color (Light) | Color (Dark) |
|--------|-------------|-------------|
| Active / Allowed | `emerald.5` | `emerald.4` |
| Disabled / Denied | `red.6` | `red.4` |
| Maintenance / Pending | `yellow.6` | `yellow.4` |
| Expired | `gray.6` | `gray.4` |
| Info | `skyBlue.5` | `skyBlue.3` |

### Card Layout
```
┌──────────────────────────────────┐
│  🏷️ Title            [Actions] │
│  ─────────────────────────────  │
│  Content area                    │
│  • Stat 1: value                 │
│  • Stat 2: value                 │
│                                  │
│  [Primary Button] [Secondary]    │
└──────────────────────────────────┘
```

---

## 6. Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|-----------|-----------|-------|
| `xs` | 576px | Mobile landscape |
| `sm` | 768px | Tablet |
| `md` | 992px | Tablet landscape |
| `lg` | 1200px | Desktop |
| `xl` | 1408px | Wide desktop |

---

## 7. Layout Structure

```
┌─────────────────────────────────────────┐
│  Header: Logo  [Nav]  [Lang] [Theme]    │
├──────┬──────────────────────────────────┤
│      │                                   │
│ Side │    Main Content Area              │
│ Nav  │                                   │
│      │                                   │
│      │                                   │
├──────┴──────────────────────────────────┤
│  Footer: © 2026 | Version | Links       │
└─────────────────────────────────────────┘
```

- **Sidebar**: `AppShell.Navbar` (Mantine) — collapsible on mobile
- **Header**: Fixed, 60px height
- **Main**: `AppShell.Main` with padding

---

## 8. Animation Guidelines

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Page transition | 200ms | ease-out | Route changes |
| Modal open | 250ms | ease-out | Dialog appear |
| Hover effects | 150ms | ease-in-out | Buttons, cards |
| QR countdown | 1000ms | linear | Timer display |
| Status change | 300ms | ease-out | Badge color change |
| Toast notification | 300ms | ease-out | Slide in from top |

---

## 9. Icon Set

ใช้ **Tabler Icons** (`@tabler/icons-react`) ซึ่งรองรับ Mantine v7:

| Icon | Usage |
|------|-------|
| `IconQrcode` | QR related |
| `IconDoor` | Gate |
| `IconUsers` | Members |
| `IconChartBar` | Dashboard |
| `IconShield` | Security |
| `IconId` | ID Card |
| `IconLanguage` | Language switcher |
| `IconSun` / `IconMoon` | Theme toggle |

---

*อ้างอิง: [06-i18n-multilanguage.md](./06-i18n-multilanguage.md) | [09-dashboard-reports.md](./09-dashboard-reports.md)*
