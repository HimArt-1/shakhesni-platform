'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { ShieldCheck, Search, Lock, User, Terminal, Clock, Filter } from 'lucide-react';

export default function AuditLogPage() {
  const { auditLogs } = useStore();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.includes(search) ||
      l.actorName.includes(search) ||
      (l.requestId && l.requestId.includes(search))
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span>سجل التدقيق والنشاط غير القابل للتعديل (Immutable Audit Log)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            تسجيل مشفر وغير قابل للتغيير لجميع عمليات التصفح، التعديل، تغيير الحالات والاعتمادات الرقمية
          </p>
        </div>

        <div className="relative w-full sm:w-72 text-xs">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث بالاسم، الإجراء، أو رقم الطلب..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
          />
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
          <span>سجل الأحداث والعمليات ({filteredLogs.length})</span>
          <span className="flex items-center gap-1 text-emerald-600 font-mono">
            <Lock className="w-3.5 h-3.5" />
            SHA-256 Encrypted Audit Trail
          </span>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all hover:border-brand-300"
            >
              <div className="space-y-1 font-sans">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">
                    {log.actorName}
                  </span>
                  <span className="text-[10px] bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 px-2 py-0.5 rounded font-bold">
                    {log.actorRole}
                  </span>
                  {log.requestId && (
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono">
                      {log.requestId}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{log.action}</p>
                <div className="text-[11px] text-slate-400">{log.details}</div>
              </div>

              <div className="text-left font-mono text-[10px] text-slate-400 shrink-0">
                <div>{new Date(log.timestamp).toLocaleString('ar-SA')}</div>
                <div>IP: {log.ipAddress}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
