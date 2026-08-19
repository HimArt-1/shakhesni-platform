'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { BarChart3, TrendingUp, PieChart, Clock, Download, Sparkles, Building2, CheckCircle2, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const { requests } = useStore();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'THIS_MONTH' | 'THIS_YEAR'>('ALL');

  const totalRequests = requests.length;

  // Category Breakdown
  const categoryCounts = requests.reduce((acc, r) => {
    acc[r.primaryCategoryArabic] = (acc[r.primaryCategoryArabic] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Status Breakdown
  const approvedCount = requests.filter((r) => r.status === 'APPROVED' || r.status === 'DELIVERED').length;
  const inProgressCount = requests.filter((r) => !['APPROVED', 'DELIVERED', 'CLOSED', 'CANCELLED'].includes(r.status)).length;
  const closedCount = requests.filter((r) => r.status === 'CLOSED').length;
  const cancelledCount = requests.filter((r) => r.status === 'CANCELLED').length;

  // SLA Metrics
  const pausedCount = requests.filter((r) => r.isSlaPaused).length;
  const breachedCount = requests.filter((r) => r.slaBreached).length;
  const compliantCount = Math.max(0, totalRequests - breachedCount);
  const slaComplianceRate = totalRequests > 0 ? Math.round((compliantCount / totalRequests) * 100) : 100;

  // Center Breakdown
  const centerCounts = requests.reduce((acc, r) => {
    const center = r.referredCenterName || 'المركز الموحد للتشخيص - الرياض';
    acc[center] = (acc[center] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleExportPDF = () => {
    alert('جاري إنشاء التقرير التحليلي الإحصائي الموحد وتحميله...');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span>اللوحات التحليلية ومؤشرات الأداء المباشرة (BI Dashboard)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            مؤشرات الأداء المؤسسي، قياس الالتزام بـ SLA، توزيع الإعاقات جغرافياً، ومعدلات الإنجاز اللحظية
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-md shadow-purple-600/30"
          >
            <Download className="w-4 h-4" />
            <span>تصدير التقرير الإحصائي PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>إجمالي الطلبات المسجلة</span>
            <Activity className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">{totalRequests}</div>
          <div className="text-[11px] text-slate-500 font-medium">طلبات مسجلة عبر المدارس وأولياء الأمور</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>نسبة الالتزام بالـ SLA</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600">%{slaComplianceRate}</div>
          <div className="text-[11px] text-slate-500 font-medium">{breachedCount} طلبات متأخرة عن الحد الزمني</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>التقارير المعتمدة</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-600">{approvedCount}</div>
          <div className="text-[11px] text-slate-500 font-medium">جاهزة للطباعة والتسليم لولي الأمر</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>حالات قيد التقييم</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-600">{inProgressCount}</div>
          <div className="text-[11px] text-slate-500 font-medium">{pausedCount} طلبات في حالة إيقاف مؤقت للوثائق</div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diagnostic Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <PieChart className="w-4 h-4 text-brand-600" />
            <span>توزيع الطلبات حسب فئة الإعاقة والتشخيص (مباشر)</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            {Object.entries(categoryCounts).map(([catName, count], idx) => {
              const pct = totalRequests > 0 ? Math.round((count / totalRequests) * 100) : 0;
              const colorClasses = [
                'bg-brand-600 text-brand-600',
                'bg-purple-600 text-purple-600',
                'bg-amber-500 text-amber-500',
                'bg-emerald-500 text-emerald-500',
                'bg-indigo-500 text-indigo-500'
              ];
              const clr = colorClasses[idx % colorClasses.length];
              const bgBar = clr.split(' ')[0];
              const txtColor = clr.split(' ')[1];

              return (
                <div key={catName}>
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <span>{catName}</span>
                    <span className={`font-mono ${txtColor}`}>%{pct} ({count} طلب)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className={`${bgBar} h-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SLA Bottlenecks & Turnaround Times */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>متوسط وقت المعالجة لكل مرحلة (SLA Bottlenecks)</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">مراجعة وتدقيق المستندات (الاستقبال):</span>
                <span className="text-[11px] text-slate-500">من التقديم وحتى اعتماد واكتمال الملف</span>
              </div>
              <span className="font-mono font-extrabold text-emerald-600 text-sm">1.1 يوم</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">الجلسات والتشخيص الإكلينيكي:</span>
                <span className="text-[11px] text-slate-500">من تعيين الفريق حتى تسجيل نتائج المقاييس</span>
              </div>
              <span className="font-mono font-extrabold text-amber-600 text-sm">3.8 أيام</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">المصادقة والختم الرقمي والاعتماد:</span>
                <span className="text-[11px] text-slate-500">من رئيس الفريق حتى الاعتماد النهائي للمدير</span>
              </div>
              <span className="font-mono font-extrabold text-emerald-600 text-sm">0.7 يوم</span>
            </div>
          </div>
        </div>

        {/* Center Distribution */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>حجم التوزيع التشغيلي على مراكز التشخيص المعتمدة</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {Object.entries(centerCounts).map(([centerName, count]) => (
              <div key={centerName} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">{centerName}</span>
                  <span className="text-[11px] text-slate-500">القدرة الاستيعابية: 15 جلسة / يوم</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black font-mono text-brand-600">{count}</span>
                  <span className="text-[10px] text-slate-400 block">طلبات نشطة</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
