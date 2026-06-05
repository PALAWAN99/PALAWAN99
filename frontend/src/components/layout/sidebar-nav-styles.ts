import type { CSSProperties } from 'react';
import type { NavLinkProps } from '@mantine/core';

type NavLinkStyleObject = Partial<{
  root: CSSProperties;
  label: CSSProperties;
  section: CSSProperties;
  description: CSSProperties;
  chevron: CSSProperties;
  body: CSSProperties;
  collapse: CSSProperties;
  children: CSSProperties;
}>;

/**
 * NavLink on navy sidebar — glass style, high-contrast active state.
 * Visual polish is completed in globals.css (`.admin-sidebar-nav`).
 */
export const SIDEBAR_NAV_PROPS: Pick<NavLinkProps, 'variant' | 'color' | 'noWrap'> & {
  styles: NavLinkStyleObject;
} = {
  variant: 'subtle',
  color: 'gray',
  noWrap: true,
  styles: {
    root: {
      borderRadius: 'var(--mantine-radius-md)',
      border: '1px solid transparent',
      transition:
        'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease',
    },
    label: {
      fontWeight: 500,
    },
  },
};

export function sidebarNavStyles(
  extra?: NavLinkProps['styles'],
): NavLinkProps['styles'] {
  const base = SIDEBAR_NAV_PROPS.styles;
  if (!extra) return base;
  if (typeof extra === 'function') return extra;
  const e = extra as NavLinkStyleObject;
  return {
    root: { ...base.root, ...e.root },
    label: { ...base.label, ...e.label },
    section: { ...base.section, ...e.section },
    description: { ...base.description, ...e.description },
    chevron: { ...base.chevron, ...e.chevron },
    body: { ...base.body, ...e.body },
    collapse: { ...base.collapse, ...e.collapse },
    children: { ...base.children, ...e.children },
  };
}
