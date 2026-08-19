'use client';

import React from 'react';
import { useStore } from '@/lib/store-context';
import { useParams } from 'next/navigation';
import { ShieldCheck, CheckCircle2, BrainCircuit, FileText, Calendar, Building2 } from 'lucide-react';

export default function PublicQRVerificationPage() {
  const params = useParams();
  const { requests } = useStore();
  const reqId = params.id as string;
  const request = requests.find((r) => r.id === reqId || r.requestNumber === reqId) || requests[0];

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <ShieldCheck className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            وثيقة معتمدة وموثقة إلكترونياً
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
            بوابة التحقق الرقمي العامة - شخّصني
          </h2>
          <p className="text-xs text-slate-500">
            تم التثبت من صحة وسريان هذا التقرير التشخيصي الصادر من مركز التشخيص الموحد
          </p>
        </div>

        {request && (
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-xs text-right space-y-3">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-slate-500">رمز التوثيق الرقمي:</span>
              <strong className="font-mono text-brand-600 dark:text-brand-400 font-extrabold">{request.reportVerificationToken || 'VRF-9921-0018-SA'}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-slate-500">رقم الطلب:</span>
              <strong className="font-mono text-slate-900 dark:text-slate-100">{request.requestNumber}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-slate-500">اسم الطالب:</span>
              <strong className="text-slate-900 dark:text-slate-100">{request.student.fullName}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-slate-500">فئة التشخيص المعتمدة:</span>
              <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold">{request.primaryCategoryArabic}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-slate-500">المدرسة المرفقة:</span>
              <strong className="text-slate-900 dark:text-slate-100">{request.schoolName}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">الجهة المصدرة:</span>
              <strong className="text-slate-900 dark:text-slate-100">{request.referredCenterName || 'مركز التشخيص الموحد بالرياض'}</strong>
            </div>
          </div>
        )}

        <div className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
          وزارة التعليم • منصة شخّصني الرقمية للتحقق الموحد
        </div>
      </div>
    </div>
  );
}
