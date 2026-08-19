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
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">قيد الجلسات والتشخيص</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{inEvaluationCount}</span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 block mt-1 font-semibold">
              فريق الأخصائيين الميداني
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        {/* Approved Reports */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">تقارير معتمدة (QR)</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{approvedCount}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-1 font-semibold">
              جاهزة للتسليم والأرشفة
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* SLA Paused / Missing Docs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">مستندات ناقصة (SLA متوقف)</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{missingDocsCount}</span>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 block mt-1 font-semibold">
              بانتظار إرفاق ولي الأمر
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Requests Table Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-600" />
                  <span>طلبات التشخيص الحالية وأداء الـ SLA</span>
                </h3>
                <p className="text-[11px] text-slate-500">نظرة عامة على أحدث الطلبات ومستوى تقدم الإجراءات</p>
              </div>

              <Link
                href="/requests"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>عرض جميع الطلبات ({totalCount})</span>
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-x-auto">
              {requests.map((r) => {
                const sla = calculateSLA(r.createdAt, r.priority, r.status, r.statusHistory);
                const meta = REQUEST_STATES[r.status];

                return (
                  <div
                    key={r.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 p-2 rounded-xl transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                          {r.student.fullName}
                        </span>
                        <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                          {r.requestNumber}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${meta.badgeClass}`}>
                          {meta.arabicName}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                        <span>فئة الإعاقة: <strong>{r.primaryCategoryArabic}</strong></span>
                        <span>•</span>
                        <span>المدرسة: {r.schoolName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      {/* SLA Gauge */}
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-[11px] font-bold">
                          {sla.isPaused ? (
                            <span className="text-amber-600 dark:text-amber-400">متوقف مؤقتاً</span>
                          ) : (
                            <span className={sla.isBreached ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}>
                              متبقي {sla.daysRemaining} يوم
                            </span>
                          )}
                        </div>
                        <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full transition-all ${
                              sla.isPaused
                                ? 'bg-amber-400'
                                : sla.isBreached
                                ? 'bg-rose-500'
                                : sla.percentageUsed > 75
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${sla.percentageUsed}%` }}
                          />
                        </div>
                      </div>

                      <Link
                        href={`/requests/${r.id}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-600 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        معاينة
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SLA Escalation Rules & Priority Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>مؤشرات وقواعد التصعيد التلقائي (SLA Rules)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                <span className="font-bold text-rose-800 dark:text-rose-300 block mb-1">
                  أولوية عاجلة جداً (Emergent - 48 ساعة):
                </span>
                <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug block">
                  الحالات المحالة بشرط التدخل السريع. يتم إرسال تنبيه فوري لمشرف المركز بعد انقضاء 24 ساعة.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                  أولوية عالية (High - 5 أيام):
                </span>
                <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug block">
                  تحديد الفريق الطبي والتربوي وحجز الموعد خلال 48 ساعة من مراجعة المستندات.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Center Workload & Quick Actions */}
        <div className="space-y-6">
          {/* Diagnostic Center Capacity */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              <span>الطاقة الاستيعابية للمراكز</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span>مركز الرياض الموحد</span>
                  <span className="text-brand-600">80% مشغولة</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-full w-[80%]" />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">12 من أصل 15 حالة يومية</span>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span>مركز جدة للتقييم</span>
                  <span className="text-emerald-600">50% مشغولة</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[50%]" />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">6 من أصل 12 حالة يومية</span>
              </div>
            </div>
          </div>

          {/* Quick Tasks & Shortcuts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>الإجراءات السريعة في النظام</span>
            </h3>

            <div className="space-y-2 text-xs">
              <Link
                href="/appointments"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-slate-700 dark:text-slate-300 transition-colors font-medium border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  <span>جدولة مواعيد الجلسات والتقويم</span>
                </div>
                <ArrowUpLeft className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/audit-log"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-slate-700 dark:text-slate-300 transition-colors font-medium border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>سجل الأمان والتدقيق غير القابل للتعديل</span>
                </div>
                <ArrowUpLeft className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
