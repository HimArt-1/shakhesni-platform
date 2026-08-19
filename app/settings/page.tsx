'use client';

import React, { useState } from 'react';
import { Settings, Shield, Clock, Bell, Database, CheckCircle2, Save } from 'lucide-react';

export default function SettingsPage() {
  const [emergentDays, setEmergentDays] = useState(2);
  const [highDays, setHighDays] = useState(5);
  const [normalDays, setNormalDays] = useState(10);
  const [lowDays, setLowDays] = useState(15);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-600" />
          <span>إعدادات النظام وتحديد اتفاقية SLA</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          ضبط مدد الـ SLA التلقائية لكل أولوية، إعدادات الإشعارات، وسياسات النسخ الاحتياطي والأمن
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 text-emerald-900 font-bold text-xs rounded-2xl border border-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>تم حفظ الإعدادات وقواعد الـ SLA الجديدة بنجاح!</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* SLA Configuration Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Clock className="w-4 h-4 text-brand-600" />
            <span>مدد اتفاقية مستوى الخدمة SLA (بالأيام):</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">أولوية عاجلة جداً (Emergent)</label>
              <input
                type="number"
                value={emergentDays}
                onChange={(e) => setEmergentDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">أولوية عالية (High)</label>
              <input
                type="number"
                value={highDays}
                onChange={(e) => setHighDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">أولوية عادية (Normal)</label>
              <input
                type="number"
                value={normalDays}
                onChange={(e) => setNormalDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">أولوية منخفضة (Low)</label>
              <input
                type="number"
                value={lowDays}
                onChange={(e) => setLowDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Security & Backup Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 text-xs">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>سياسات الأمان والنسخ الاحتياطي</span>
          </h3>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
              <input type="checkbox" defaultChecked className="rounded text-brand-600" />
              <span>تفعيل المصادقة الثنائية (MFA) للحسابات الإدارية والأخصائيين</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
              <input type="checkbox" defaultChecked className="rounded text-brand-600" />
              <span>توليد روابط مؤقتة للمستندات والملفات الطبية (Signed URLs - 15 mins)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
              <input type="checkbox" defaultChecked className="rounded text-brand-600" />
              <span>النسخ الاحتياطي المشفر اليومي الآلي لمنصة Supabase PostgreSQL</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>حفظ جميع الإعدادات</span>
          </button>
        </div>
      </form>
    </div>
  );
}
