#!/bin/bash
sed -i '' "s/  const visibleItems = NAV_ITEMS.filter((item) => allowedItems.includes(item.id));/  const visibleItems = NAV_ITEMS.filter((item) => allowedItems.includes(item.id));\n\n  if (pathname === '\/' || pathname === '\/login') return null;/g" components/layout/sidebar.tsx
sed -i '' "s/  const unreadCount = notifications.filter((n) => \!n.isRead).length;/  const unreadCount = notifications.filter((n) => \!n.isRead).length;\n  const pathname = usePathname();/g" components/layout/header.tsx
sed -i '' "s/import { useTheme } from 'next-themes';/import { usePathname } from 'next\/navigation';\nimport { useTheme } from 'next-themes';/g" components/layout/header.tsx
sed -i '' "s/  return (/  if (pathname === '\/' || pathname === '\/login') return null;\n\n  return (/g" components/layout/header.tsx
sed -i '' "s/import { useStore } from '@\/lib\/store-context';/import { usePathname } from 'next\/navigation';\nimport { useStore } from '@\/lib\/store-context';/g" components/role-switcher.tsx
sed -i '' "s/  const currentRoleConfig = ROLE_PERMISSIONS\[currentUser.role\];/  const currentRoleConfig = ROLE_PERMISSIONS\[currentUser.role\];\n\n  if (pathname === '\/' || pathname === '\/login') return null;/g" components/role-switcher.tsx
