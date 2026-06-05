'use client';

import { useCallback, useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Box, Divider, NavLink, ScrollArea, Stack, Tooltip } from '@mantine/core';
import {
  ADMIN_NAV_PRIMARY,
  ADMIN_NAV_GROUPS,
  ADMIN_NAV_FOOTER,
  isNavGroupActive,
  isNavItemActive,
  type AdminNavGroup,
  type AdminNavItem,
} from '@/config/admin-nav';
import { SIDEBAR_NAV_PROPS, sidebarNavStyles } from './sidebar-nav-styles';

type AppHref = Parameters<typeof Link>[0]['href'];

function itemHref(href: string): AppHref {
  return href as AppHref;
}

function SidebarItemLink({
  item,
  active,
  nested,
  showLabel,
}: {
  item: AdminNavItem;
  active: boolean;
  nested?: boolean;
  showLabel: boolean;
}) {
  const t = useTranslations();

  const link = (
    <NavLink
      {...SIDEBAR_NAV_PROPS}
      component={Link}
      href={itemHref(item.href)}
      label={showLabel ? t(item.labelKey) : undefined}
      leftSection={<item.icon size={nested ? 18 : 20} stroke={1.5} />}
      active={active}
      styles={sidebarNavStyles({
        root: nested
          ? { paddingLeft: 'var(--mantine-spacing-lg)' }
          : undefined,
      })}
    />
  );

  if (showLabel) return link;

  return (
    <Tooltip label={t(item.labelKey)} position="right" withArrow>
      {link}
    </Tooltip>
  );
}

function SidebarNavGroupExpanded({
  group,
  opened,
  onChange,
}: {
  group: AdminNavGroup;
  opened: boolean;
  onChange: (opened: boolean) => void;
}) {
  const pathname = usePathname();
  const t = useTranslations();
  const groupActive = isNavGroupActive(pathname, group);

  return (
    <NavLink
      {...SIDEBAR_NAV_PROPS}
      label={t(group.labelKey)}
      leftSection={<group.icon size={20} stroke={1.5} />}
      active={groupActive}
      opened={opened}
      onChange={onChange}
      childrenOffset="md"
    >
      {group.items.map((item) => (
        <SidebarItemLink
          key={item.href}
          item={item}
          nested
          showLabel
          active={isNavItemActive(pathname, item.href)}
        />
      ))}
    </NavLink>
  );
}

function SidebarNavGroupCollapsed({
  group,
  onActivate,
}: {
  group: AdminNavGroup;
  onActivate: (groupId: string) => void;
}) {
  const pathname = usePathname();
  const t = useTranslations();
  const groupActive = isNavGroupActive(pathname, group);

  return (
    <Tooltip label={t(group.labelKey)} position="right" withArrow>
      <NavLink
        {...SIDEBAR_NAV_PROPS}
        label=""
        leftSection={<group.icon size={22} stroke={1.5} />}
        active={groupActive}
        styles={sidebarNavStyles({ root: { justifyContent: 'center' } })}
        onClick={() => onActivate(group.id)}
      />
    </Tooltip>
  );
}

function SidebarPrimaryLink({
  item,
  expanded,
  onRequestExpand,
}: {
  item: AdminNavItem;
  expanded: boolean;
  onRequestExpand?: () => void;
}) {
  const pathname = usePathname();
  const t = useTranslations();
  const active = isNavItemActive(pathname, item.href);

  const link = (
    <NavLink
      {...SIDEBAR_NAV_PROPS}
      component={Link}
      href={itemHref(item.href)}
      label={expanded ? t(item.labelKey) : undefined}
      leftSection={<item.icon size={20} stroke={1.5} />}
      active={active}
      styles={
        expanded
          ? SIDEBAR_NAV_PROPS.styles
          : sidebarNavStyles({ root: { justifyContent: 'center' } })
      }
      onClick={() => {
        if (!expanded) onRequestExpand?.();
      }}
    />
  );

  if (expanded) return link;

  return (
    <Tooltip label={t(item.labelKey)} position="right" withArrow>
      {link}
    </Tooltip>
  );
}

export function SidebarNav({
  expanded,
  onRequestExpand,
}: {
  expanded: boolean;
  /** เมื่อ sidebar ย่อ: เรียกเมื่อผู้ใช้คลิกที่เมนู เพื่อขยายแถบทันที */
  onRequestExpand?: () => void;
}) {
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const group of ADMIN_NAV_GROUPS) {
      initial[group.id] = isNavGroupActive(pathname, group);
    }
    return initial;
  });

  const handleCollapsedGroupActivate = useCallback(
    (groupId: string) => {
      setOpenGroups((prev) => ({ ...prev, [groupId]: true }));
      onRequestExpand?.();
    },
    [onRequestExpand],
  );

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const group of ADMIN_NAV_GROUPS) {
        if (isNavGroupActive(pathname, group) && !next[group.id]) {
          next[group.id] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [pathname]);

  const primaryLinks = ADMIN_NAV_PRIMARY.map((item) => (
    <SidebarPrimaryLink
      key={item.href}
      item={item}
      expanded={expanded}
      onRequestExpand={onRequestExpand}
    />
  ));

  const footerLinks = ADMIN_NAV_FOOTER.map((item) => (
    <SidebarPrimaryLink
      key={item.href}
      item={item}
      expanded={expanded}
      onRequestExpand={onRequestExpand}
    />
  ));

  const navContent = !expanded ? (
    <Stack gap={4} align="stretch" px={4}>
      {primaryLinks}
      {ADMIN_NAV_GROUPS.map((group) => (
        <SidebarNavGroupCollapsed
          key={group.id}
          group={group}
          onActivate={handleCollapsedGroupActivate}
        />
      ))}
    </Stack>
  ) : (
    <Stack gap={4}>
      {primaryLinks}
      {ADMIN_NAV_GROUPS.map((group) => (
        <SidebarNavGroupExpanded
          key={group.id}
          group={group}
          opened={openGroups[group.id] ?? false}
          onChange={(opened) =>
            setOpenGroups((prev) => ({ ...prev, [group.id]: opened }))
          }
        />
      ))}
    </Stack>
  );

  return (
    <Box
      className="admin-sidebar-nav"
      data-mantine-color-scheme="dark"
      w="100%"
      style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 120px)' }}
    >
      <ScrollArea.Autosize mah="calc(100vh - 180px)" type="scroll" offsetScrollbars style={{ flex: 1 }}>
        {navContent}
      </ScrollArea.Autosize>
      {ADMIN_NAV_FOOTER.length > 0 ? (
        <Box mt="auto" pt="xs">
          <Divider color="rgba(148, 163, 184, 0.2)" mb="xs" />
          <Stack gap={4}>{footerLinks}</Stack>
        </Box>
      ) : null}
    </Box>
  );
}
