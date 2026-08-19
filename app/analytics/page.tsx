'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Clock,
  Download,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Activity,
  MapPin,
  FileCheck2,
  Calendar,
} from 'lucide-react';

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

  // Regional Distribution
  const regionsData = [
    { name: 'منطقة الرياض (الوسطى)', activeCases: requests.length, centers: 4, satisfactionRate: '98%' },
    { name: 'منطقة مكة المكرمة وجدة (الغربية)', activeCases: 2, centers: 3, satisfactionRate: '96%' },
    { name: 'المنطقة الشرقية (الدمام والخبر)', activeCases: 1, centers: 2, satisfactionRate: '97%' },
  ];

  // Incomplete Document Causes
  const docIssuesData = [
    { cause: 'فحص مقياس السمع والنظر المحدث من مستشفى معتمد', percentage: 45, color: 'bg-rose-500' },
    { cause: 'موافقة ولي الأمر الموقعة عبر النفاذ الوطني', percentage: 30, color: 'bg-amber-500' },
    { cause: 'استبانة الملاحظة السلوكية والصفية من معلم الفصل', percentage: 25, color: 'bg-brand-500' },
  ];

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span>اللوحات التحليلية ومؤشرات الأداء المباشرة (BI Dashboard)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            مؤشرات الأداء المؤسسي، قياس الالتزام باتفاقية مستوى الخدمة SLA، التوزيع الجغرافي، ومعدلات الإنجاز اللحظية
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'ALL' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setActiveFilter('THIS_MONTH')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'THIS_MONTH' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              هذا الشهر
            </button>
            <button
              onClick={() => setActiveFilter('THIS_YEAR')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'THIS_YEAR' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              العام الحالي
            </button>
          </div>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-md shadow-purple-600/30"
          >
            <Download className="w-4 h-4" />
            <span>طباعة / تصدير التقرير PDF</span>
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
                'bg-indigo-500 text-indigo-500',
              ];
              const clr = colorClasses[idx % colorClasses.length];
              const bgBar = clr.split(' ')[0];
              const txtColor = clr.split(' ')[1];

              return (
                <div key={catName}>
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <span>{catName}</span>
                    <span className={`font-mono ${txtColor}`}>
                      %{pct} ({count} طلب)
                    </span>
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
            <span>متوسط وقت المعالجة لكل مرحلة (SLA Turnaround Velocity)</span>
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

        {/* Regional Geographic Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>التوزيع الجغرافي حسب مناطق المملكة</span>
          </h3>

          <div className="space-y-3 text-xs">
            {regionsData.map((reg) => (
              <div
                key={reg.name}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">{reg.name}</span>
                  <span className="text-[11px] text-slate-500">
                    المراكز المعتمدة: {reg.centers} • نسبة رضا المستفيدين: {reg.satisfactionRate}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold font-mono text-brand-600">{reg.activeCases}</span>
                  <span className="text-[10px] text-slate-400 block">طلبات</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Root Cause Analysis for Incomplete Files */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>تحليل أسباب تأخر واستكمال الوثائق (Root Cause Analysis)</span>
          </h3>

          <div className="space-y-3 text-xs">
            {docIssuesData.map((issue) => (
              <div key={issue.cause} className="space-y-1">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span className="text-[11px]">{issue.cause}</span>
                  <span className="font-mono">%{issue.percentage}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`${issue.color} h-full transition-all duration-500`} style={{ width: `${issue.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Operational Load */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>الطاقة التشغيلية للمراكز المعتمدة ومعدلات الاستيعاب اليومية</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {Object.entries(centerCounts).map(([centerName, count]) => (
              <div
                key={centerName}
                className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">{centerName}</span>
                  <span className="text-[11px] text-slate-500">الطاقة الاستيعابية اليومية: 15 جلسة / يوم</span>
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
