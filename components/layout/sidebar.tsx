'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { ROLE_PERMISSIONS } from '@/lib/rbac';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Calendar,
  Stethoscope,
  Users,
  Building2,
  BarChart3,
  ShieldCheck,
  Settings,
  BrainCircuit,
  GraduationCap,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, requests, notifications } = useStore();
  const allowedItems = ROLE_PERMISSIONS[currentUser.role]?.allowedNavItems || [];

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const pendingRequestsCount = requests.filter((r) =>
    ['SUBMITTED', 'DOC_REVIEW', 'PRIORITY_TRIAGE', 'UNDER_EVALUATION', 'TEAM_LEADER_REVIEW'].includes(r.status)
  ).length;

  const NAV_ITEMS: NavItem[] = [
    {
      id: 'dashboard',
      label: 'لوحة القيادة الذكية',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      id: 'requests',
      label: 'إدارة الطلبات',
      href: '/requests',
      icon: FileText,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
    },
    {
      id: 'new-request',
      label: 'طلب تشخيص جديد',
      href: '/requests/new',
      icon: PlusCircle,
    },
    {
      id: 'appointments',
      label: 'المواعيد والتقويم',
      href: '/appointments',
      icon: Calendar,
    },
    {
      id: 'workspace',
      label: 'مساحة التقييم والتشخيص',
      href: '/diagnostic-workspace/req-101',
      icon: Stethoscope,
    },
    {
      id: 'iep',
      label: 'الخطة التربوية الفردية (IEP)',
      href: '/iep/req-101',
      icon: GraduationCap,
    },
    {
      id: 'students',
      label: 'ملفات الطلاب وأولياء الأمور',
      href: '/students',
      icon: Users,
    },
    {
      id: 'centers',
      label: 'المدارس والمراكز',
      href: '/centers',
      icon: Building2,
    },
    {
      id: 'analytics',
      label: 'التقارير الإحصائية',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      id: 'audit-log',
      label: 'سجل التدقيق والأمان',
      href: '/audit-log',
      icon: ShieldCheck,
    },
    {
      id: 'settings',
      label: 'إعدادات النظام',
      href: '/settings',
      icon: Settings,
    },
  ];

  const visibleItems = NAV_ITEMS.filter((item) => allowedItems.includes(item.id));

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen flex flex-col border-l border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-bold">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-wide text-white flex items-center gap-1.5">
            شخّصني
            <span className="text-[10px] bg-brand-500/20 text-brand-400 border border-brand-500/40 px-1.5 py-0.2 rounded font-mono font-medium">
              v1.0
            </span>
          </h1>
          <p className="text-xs text-slate-400">منصة تشخيص الطلاب ذوي الإعاقة</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 mx-3 my-3 rounded-xl flex items-center gap-3">
        <img
          src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-brand-500/40"
        />
        <div className="overflow-hidden">
          <h3 className="text-xs font-bold text-slate-100 truncate">{currentUser.name}</h3>
          <p className="text-[11px] text-brand-400 font-medium truncate">{currentUser.roleArabic}</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-2">
          قائمة النظام الرئيسية
        </div>

        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-900/40 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-brand-700' : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span>حالة النظام:</span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            نشط وآمن (RLS)
          </span>
        </div>
      </div>
    </aside>
  );
};
