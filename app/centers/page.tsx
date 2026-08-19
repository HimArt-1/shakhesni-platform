'use client';

import React from 'react';
import { INITIAL_CENTERS, INITIAL_SCHOOLS } from '@/lib/mock-data';
import { Building2, School as SchoolIcon, Users, CheckCircle2, Phone, MapPin } from 'lucide-react';

export default function CentersPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-brand-600" />
          <span>دليل مراكز التشخيص والمدارس المعتمدة</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          إدارة الطاقة الاستيعابية اليومية للمراكز، التخصصات التشخيصية المتاحة، والمدارس المرفقة
        </p>
      </div>

      {/* Centers List */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
          مراكز التشخيص المعتمدة (Diagnostic Centers)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_CENTERS.map((c) => (
            <div key={c.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{c.name}</h4>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                    <MapPin className="w-3 h-3 text-brand-600" />
                    {c.city} - {c.district} ({c.code})
                  </span>
                </div>
                <span className="text-[10px] bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 px-2 py-1 rounded-full font-bold">
                  {c.capacityPerDay} حالة / يومياً
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div>مدير المركز: <strong>{c.directorName}</strong></div>
                <div className="font-mono">الهاتف: {c.phone}</div>
                <div>عدد الفرق الفاعلة: <strong>{c.activeTeamCount} أخصائيين</strong></div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1">
                {c.specializations.map((s, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schools List */}
      <div className="space-y-4 pt-4">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
          المدارس الحكومية والأهلية المسجلة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_SCHOOLS.map((s) => (
            <div key={s.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-2 text-xs">
              <div className="flex justify-between items-center font-extrabold text-slate-900 dark:text-slate-100">
                <span>{s.name}</span>
                <span className="font-mono text-slate-400 text-[10px]">{s.code}</span>
              </div>
              <div className="text-slate-600 dark:text-slate-300">المرحلة: {s.educationalStage} • {s.city} ({s.district})</div>
              <div className="text-slate-500">المرشد الطلابي: <strong>{s.counselorName}</strong> ({s.counselorPhone})</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
