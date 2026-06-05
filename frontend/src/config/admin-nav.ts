import type { TablerIcon } from '@tabler/icons-react';
import {
  IconLayoutDashboard,
  IconQrcode,
  IconUsers,
  IconId,
  IconTrash,
  IconChartBar,
  IconShield,
  IconSettings,
  IconHistory,
  IconUserShield,
  IconMapPin,
  IconUserCircle,
  IconReportAnalytics,
  IconTool,
  IconActivity,
} from '@tabler/icons-react';

export type AdminNavItem = {
  labelKey: string;
  icon: TablerIcon;
  href: string;
};

export type AdminNavGroup = {
  id: string;
  labelKey: string;
  icon: TablerIcon;
  items: AdminNavItem[];
};

/** เมนูหลักด้านบน sidebar — /admin = ผู้ใช้ระบบ (login web app) */
export const ADMIN_NAV_PRIMARY: AdminNavItem[] = [
  {
    labelKey: 'Common.dashboard',
    icon: IconLayoutDashboard,
    href: '/admin/dashboard',
  },
];

/** เมนูหลักด้านล่าง sidebar (แยกจากกลุ่มเมนู) */
export const ADMIN_NAV_FOOTER: AdminNavItem[] = [
  {
    labelKey: 'PennuengMember.deletedMenu',
    icon: IconTrash,
    href: '/admin/members/deleted',
  },
];

/** @deprecated ใช้ ADMIN_NAV_PRIMARY[0] แทน */
export const ADMIN_NAV_DASHBOARD = ADMIN_NAV_PRIMARY[0];

/**
 * หมวดเมนู sidebar (แต่ละกลุ่มมี chevron + เมนูย่อย)
 */
export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: 'people',
    labelKey: 'Common.navGroupPeople',
    icon: IconUserCircle,
    items: [
      { labelKey: 'Common.members', icon: IconUsers, href: '/admin/members' },
      { labelKey: 'Common.idcard', icon: IconId, href: '/admin/idcard' },
      { labelKey: 'Common.qr', icon: IconQrcode, href: '/admin/qr' },
    ],
  },
  {
    id: 'analytics',
    labelKey: 'Common.navGroupAnalytics',
    icon: IconReportAnalytics,
    items: [
      { labelKey: 'Common.history', icon: IconHistory, href: '/admin/history' },
      { labelKey: 'Common.events', icon: IconActivity, href: '/admin/events' },
      { labelKey: 'Common.reports', icon: IconChartBar, href: '/admin/reports' },
    ],
  },
  {
    id: 'system',
    labelKey: 'Common.navGroupSystem',
    icon: IconTool,
    items: [
      { labelKey: 'Common.admins', icon: IconUserShield, href: '/admin' },
      {
        labelKey: 'Common.gateFoundationData',
        icon: IconMapPin,
        href: '/admin/infrastructure',
      },
      { labelKey: 'Common.security', icon: IconShield, href: '/admin/security' },
      { labelKey: 'Common.settings', icon: IconSettings, href: '/admin/settings' },
    ],
  },
];

export function isNavItemActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === '/admin') {
    return pathname === '/admin' || pathname.endsWith('/admin');
  }
  if (href === '/admin/dashboard') {
    return pathname === '/admin/dashboard' || pathname.endsWith('/admin/dashboard');
  }
  if (href === '/admin/members/deleted') {
    return pathname.includes('/admin/members/deleted');
  }
  if (href === '/admin/members') {
    return pathname.includes('/admin/members') && !pathname.includes('/admin/members/deleted');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isNavGroupActive(pathname: string | null, group: AdminNavGroup): boolean {
  return group.items.some((item) => isNavItemActive(pathname, item.href));
}
