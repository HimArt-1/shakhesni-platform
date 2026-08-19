'use client';

import React from 'react';
import { useStore } from '@/lib/store-context';
import { UserRole } from '@/types/database';
import { ROLE_PERMISSIONS } from '@/lib/rbac';
import { Shield, UserCheck, ChevronDown, Sparkles } from 'lucide-react';

const ROLES_LIST: { role: UserRole; label: string; icon: string }[] = [
  { role: 'SYSTEM_ADMIN', label: 'مدير النظام', icon: '👑' },
  { role: 'RECEPTIONIST', label: 'موظفة الاستقبال', icon: '🎧' },
  { role: 'CENTER_COORDINATOR', label: 'منسق المركز', icon: '📋' },
  { role: 'DIAGNOSTIC_MEMBER', label: 'عضو فريق التشخيص', icon: '🩺' },
  { role: 'TEAM_LEADER', label: 'رئيس الفريق', icon: '👨‍⚕️' },
  { role: 'SUPERVISOR', label: 'المشرف / المدير', icon: '🏅' },
  { role: 'SCHOOL_REP', label: 'المدرسة (المرشد)', icon: '🏫' },
  { role: 'PARENT', label: 'ولي الأمر', icon: '👨‍👩‍👦' },
];

export const RoleSwitcherBar: React.FC = () => {
  const { currentUser, switchRole } = useStore();
  const currentRoleConfig = ROLE_PERMISSIONS[currentUser.role];

  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-3 shadow-inner z-50">
      <div className="flex items-center gap-2 font-medium">
        <img src="/logo.png" alt="شخّصني" className="w-6 h-6 object-contain rounded-md bg-white p-0.5" />
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-300 font-bold hidden sm:inline">محاكي الأدوار (RBAC Persona Switcher):</span>
        <span className="bg-brand-600/30 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded font-mono">
          {currentUser.name}
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {ROLES_LIST.map((r) => {
          const isActive = currentUser.role === r.role;
          return (
            <button
              key={r.role}
              onClick={() => switchRole(r.role)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all text-xs whitespace-nowrap font-medium ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-900/50 ring-1 ring-brand-400 font-bold scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
              title={ROLE_PERMISSIONS[r.role].description}
            >
              <span>{r.icon}</span>
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>

      <div className="hidden lg:flex items-center gap-2 text-slate-400 text-[11px] border-r border-slate-800 pr-3">
        <Shield className="w-3.5 h-3.5 text-slate-400" />
        <span className="truncate max-w-[280px]" title={currentRoleConfig.description}>
          {currentRoleConfig.description}
        </span>
      </div>
    </div>
  );
};
