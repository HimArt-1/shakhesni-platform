'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store-context';
import { useParams } from 'next/navigation';
import QRCode from 'qrcode';
import { Printer, ShieldCheck, CheckCircle2, ArrowRight, BrainCircuit, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PrintableReportPreviewPage() {
  const params = useParams();
  const { requests } = useStore();
  const reqId = params.id as string;
  const request = requests.find((r) => r.id === reqId || r.requestNumber === reqId) || requests[0];
  const [qrCanvasUrl, setQrCanvasUrl] = useState('');

  useEffect(() => {
    if (request) {
      const verifyUrl = `${window.location.origin}/verify/${request.id}`;
      QRCode.toDataURL(verifyUrl, { width: 140, margin: 1 })
        .then((url) => setQrCanvasUrl(url))
        .catch((err) => console.error(err));
    }
  }, [request]);

  if (!request) {
    return <div className="p-8 text-center text-xs">التقرير غير موجود.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Top Action Bar (Non-printable) */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm print:hidden">
        <Link
          href={`/requests/${request.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لتفاصيل الطلب</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة التقرير / حفظ كـ PDF</span>
        </button>
      </div>

      {/* Formal A4 Printable Document Container */}
      <div className="bg-white text-slate-900 border border-slate-300 rounded-2xl p-8 sm:p-12 shadow-xl space-y-6 print:shadow-none print:border-none print:p-0 font-sans">
        {/* Official Header */}
        <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">المملكة العربية السعودية</h1>
            <h2 className="text-sm font-bold text-slate-700">وزارة التعليم - مركز التشخيص الموحد</h2>
            <p className="text-xs text-slate-500 font-mono">التقرير التشخيصي المعتمد لذوي الإعاقة</p>
          </div>

          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold mx-auto">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-extrabold text-brand-700 block">منصة شخّصني</span>
          </div>

          <div className="text-left space-y-1">
            <div className="text-xs font-mono font-bold">الرقم الموحد: {request.requestNumber}</div>
            <div className="text-[11px] font-mono text-slate-500">تاريخ الاعتماد: {new Date().toLocaleDateString('ar-SA')}</div>
            <div className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-center border border-emerald-300">
              وثيقة معتمدة رسمياً
            </div>
          </div>
        </div>

        {/* Student & School Metadata Grid */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>اسم الطالب: <strong className="font-bold text-slate-900 block">{request.student.fullName}</strong></div>
          <div>رقم الهوية: <strong className="font-mono block">{request.student.nationalId}</strong></div>
          <div>تاريخ الميلاد: <strong className="font-mono block">{request.student.birthDate}</strong></div>
          <div>الصف الدراسي: <strong className="block">{request.student.grade}</strong></div>
          <div>المدرسة: <strong className="block">{request.schoolName}</strong></div>
          <div>فئة التشخيص: <strong className="text-brand-700 font-extrabold block">{request.primaryCategoryArabic}</strong></div>
        </div>

        {/* Diagnosis Results & Clinical Summary */}
        <div className="space-y-3 text-xs">
          <h3 className="font-extrabold text-sm border-b border-slate-200 pb-1 text-slate-900">
            أولاً: خلاصة نتائج المقاييس والتقييمات الإكلينيكية
          </h3>
          {request.assessments.map((ass) => (
            <div key={ass.id} className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>المقياس: {ass.testUsed}</span>
                <span className="font-mono text-brand-700">الدرجة المعيارية: {ass.standardScore}</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">{ass.clinicalSummary}</p>
              {ass.dsmCode && (
                <div className="text-[10px] font-mono text-slate-500 pt-1">
                  التصنيف المعياري: <strong>{ass.dsmCode}</strong>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* IEP Accommodations Table */}
        <div className="space-y-3 text-xs">
          <h3 className="font-extrabold text-sm border-b border-slate-200 pb-1 text-slate-900">
            ثانياً: التوصيات التربوية والخطة الفردية (IEP Accommodations)
          </h3>
          <table className="w-full text-right border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 font-bold text-slate-800">
              <tr>
                <th className="p-2.5 border-b">مجال التوصية</th>
                <th className="p-2.5 border-b">عنوان التوصية</th>
                <th className="p-2.5 border-b">التفاصيل وآلية التطبيق بالفصل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {request.recommendations.map((rec) => (
                <tr key={rec.id}>
                  <td className="p-2.5 font-bold text-brand-700">{rec.category}</td>
                  <td className="p-2.5 font-bold text-slate-900">{rec.title}</td>
                  <td className="p-2.5 text-slate-700 text-[11px]">{rec.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures & QR Code Verification Section */}
        <div className="pt-6 border-t-2 border-slate-800 flex items-center justify-between gap-6">
          <div className="space-y-2 text-xs">
            <div className="font-extrabold text-slate-900">اعتماد رئيس الفريق التشخيصي:</div>
            <div className="font-bold text-slate-700">د. عبد العزيز العتيبي</div>
            <div className="font-mono text-[10px] text-slate-400">التوقيع الرقمي المشفر: e3b0c44298fc1c14...</div>
          </div>

          <div className="space-y-2 text-xs text-center">
            <div className="font-extrabold text-slate-900">اعتماد المشرف والختم الرسمي:</div>
            <div className="font-bold text-slate-700">د. هدى التميمي</div>
            <div className="font-mono text-[10px] text-slate-400">رمز التوثيق: {request.reportVerificationToken || 'VRF-8841-SA'}</div>
          </div>

          {/* Interactive QR Code */}
          <div className="text-center">
            {qrCanvasUrl ? (
              <img src={qrCanvasUrl} alt="QR Verification" className="w-24 h-24 border border-slate-300 rounded-lg p-1 mx-auto" />
            ) : (
              <div className="w-24 h-24 bg-slate-100 rounded-lg border flex items-center justify-center text-[10px]">QR Code</div>
            )}
            <span className="text-[9px] font-bold text-slate-500 block mt-1">امسح للتحقق التلقائي</span>
          </div>
        </div>
      </div>
    </div>
  );
}
