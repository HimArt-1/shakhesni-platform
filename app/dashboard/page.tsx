'use client';

import React from 'react';
import { useStore } from '@/lib/store-context';
import { REQUEST_STATES } from '@/lib/state-machine';
import { calculateSLA } from '@/lib/sla-calculator';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  PlusCircle,
  Stethoscope,
  Building2,
  TrendingUp,
  Sparkles,
  ArrowUpLeft,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function SmartDashboardPage() {
  const { currentUser, requests, notifications } = useStore();

  // Metric Calculations
  const totalCount = requests.length;
  const pendingDocsCount = requests.filter((r) => r.status === 'DOC_REVIEW' || r.status === 'SUBMITTED').length;
  const inEvaluationCount = requests.filter((r) => r.status === 'UNDER_EVALUATION' || r.status === 'TEAM_ASSIGNED').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED' || r.status === 'DELIVERED').length;
  const missingDocsCount = requests.filter((r) => r.status === 'DOCS_INCOMPLETE').length;

  const slaBreachedCount = requests.filter((r) => {
    const sla = calculateSLA(r.createdAt, r.priority, r.status, r.statusHistory);
    return sla.isBreached;
  }).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>نظام التشخيص والمتابعة الذكي v1.0</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
            أهلاً بك، {currentUser.name}
          </h2>
          <p className="text-xs text-brand-100 max-w-xl leading-relaxed">
            المنصة متكيفة حالياً وفق صلاحياتك كـ ({currentUser.roleArabic}). تتابع المنصة حالة {totalCount} طلبات تشخيص نشطة مع حساب اتفاقية مستويات الخدمة SLA لحظياً.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/requests/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-950/40 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إنشاء طلب جديد</span>
          </Link>
        </div>

        {/* Ambient Glow Decorative */}
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Requests */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">إجمالي الطلبات</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{totalCount}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-1 font-semibold">
              ↑ +12% مقارنة بالشهر السابق
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Docs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">بانتظار تدقيق المستندات</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{pendingDocsCount}</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-1 font-semibold">
              تحتاج إجراء موظفة الاستقبال
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Under Evaluation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">قيد التقييم والتشخيص</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{inEvaluationCount}</span>
            <span className="text-[10px] text-brand-600 dark:text-brand-400 block mt-1 font-semibold">
              أخصائيين وفريق متعدد التخصصات
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        {/* Missing Docs (SLA Paused) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">مستندات ناقصة (SLA متوقف)</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{missingDocsCount}</span>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 block mt-1 font-semibold">
              بانتظار استكمال ولي الأمر
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Approved Reports */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">تقارير معتمدة ومنتهية</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{approvedCount}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-1 font-semibold">
              جاهزة للطباعة والتسليم
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Layout: Active Requests Table + Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Requests Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-600" />
                  <span>أحدث طلبات التشخيص المباشرة</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  قائمة بالطلبات المحدثة مع تتبع مؤشر اتفاقية مستوى الخدمة SLA
                </p>
              </div>

              <Link
                href="/requests"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
              >
                <span>عرض الكل</span>
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                    <th className="pb-3 pr-2">رقم الطلب / الطالب</th>
                    <th className="pb-3 px-2">الفئة</th>
                    <th className="pb-3 px-2">الأولوية</th>
                    <th className="pb-3 px-2">الحالة الحالية</th>
                    <th className="pb-3 px-2">مؤشر SLA</th>
                    <th className="pb-3 pl-2">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {requests.slice(0, 5).map((req) => {
                    const statusMeta = REQUEST_STATES[req.status];
                    const sla = calculateSLA(req.createdAt, req.priority, req.status, req.statusHistory);

                    return (
                      <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 pr-2">
                          <div className="font-extrabold text-slate-800 dark:text-slate-200">
                            {req.student.fullName}
                          </div>
                          <div className="font-mono text-[10px] text-brand-600 dark:text-brand-400 font-bold">
                            {req.requestNumber}
                          </div>
                        </td>

                        <td className="py-3 px-2 text-slate-600 dark:text-slate-300">
                          {req.primaryCategoryArabic}
                        </td>

                        <td className="py-3 px-2">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              req.priority === 'EMERGENT'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : req.priority === 'HIGH'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {req.priority === 'EMERGENT' ? 'طوارئ' : req.priority === 'HIGH' ? 'عالية' : req.priority === 'LOW' ? 'منخفضة' : 'عادية'}
                          </span>
                        </td>

                        <td className="py-3 px-2">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${statusMeta.badgeClass}`}>
                            {statusMeta.arabicName}
                          </span>
                        </td>

                        <td className="py-3 px-2">
                          {sla.isPaused ? (
                            <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>متوقف</span>
                            </span>
                          ) : sla.isBreached ? (
                            <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>متأخر عن الحد الزمني</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono font-bold text-emerald-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{sla.daysRemaining}d {sla.hoursRemaining}h</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 pl-2">
                          <Link
                            href={`/requests/${req.id}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold transition-all text-xs inline-block"
                          >
                            معاينة
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Center Info & Live SLA Gauge */}
        <div className="space-y-6">
          {/* Quick SLA Health Gauge */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>مؤشر الالتزام باتفاقية مستوى الخدمة</span>
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">معدل الامتثال العام:</span>
                <span className="font-mono text-emerald-600 text-sm font-black">
                  %{totalCount > 0 ? Math.round(((totalCount - slaBreachedCount) / totalCount) * 100) : 100}
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalCount > 0 ? Math.round(((totalCount - slaBreachedCount) / totalCount) * 100) : 100}%`,
                  }}
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                يتم قياس زمن المعالجة بدقة لحظية مع إيقاف العداد تلقائياً أثناء انتظار المستندات الإضافية من أولياء الأمور حمايةً لكفاءة المركز.
              </p>
            </div>
          </div>

          {/* Quick Shortcuts Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>الإجراءات التشغيلية السريعة</span>
            </h3>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <Link
                href="/requests/new"
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 group transition-all"
              >
                <span>تقديم طلب تشخيص جديد</span>
                <ArrowUpLeft className="w-4 h-4 text-brand-600 group-hover:-translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/appointments"
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 group transition-all"
              >
                <span>جدول المواعيد والتقويم</span>
                <ArrowUpLeft className="w-4 h-4 text-indigo-600 group-hover:-translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/analytics"
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 group transition-all"
              >
                <span>اللوحات التحليلية ومؤشرات الأداء</span>
                <ArrowUpLeft className="w-4 h-4 text-purple-600 group-hover:-translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
