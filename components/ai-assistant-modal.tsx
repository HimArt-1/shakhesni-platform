'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { Sparkles, FileSearch, AlertTriangle, Lightbulb, CheckCircle, X, Loader2, ShieldAlert } from 'lucide-react';

export const AIAssistantModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { requests, runAIAuditOnDocument, generateAIRecommendations } = useStore();
  const [selectedReqId, setSelectedReqId] = useState(requests[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'AUDIT' | 'CONTRADICTIONS' | 'RECOMMENDATIONS' | 'SUMMARY'>('AUDIT');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionDone, setActionDone] = useState(false);

  const activeReq = requests.find((r) => r.id === selectedReqId) || requests[0];

  const handleRunAudit = () => {
    setIsProcessing(true);
    setActionDone(false);
    setTimeout(() => {
      if (activeReq && activeReq.documents[0]) {
        runAIAuditOnDocument(activeReq.id, activeReq.documents[0].id);
      }
      setIsProcessing(false);
      setActionDone(true);
    }, 1200);
  };

  const handleGenerateRecs = () => {
    setIsProcessing(true);
    setActionDone(false);
    setTimeout(() => {
      if (activeReq) {
        generateAIRecommendations(activeReq.id);
      }
      setIsProcessing(false);
      setActionDone(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base flex items-center gap-2">
                مساعد الذكاء الاصطناعي المساند «شخّصني AI»
                <span className="text-[10px] bg-purple-500/30 text-purple-200 border border-purple-400/40 px-2 py-0.5 rounded-full font-mono">
                  Beta
                </span>
              </h3>
              <p className="text-xs text-purple-200">مراجعة كفاية الوثائق، استخراج البيانات، وصياغة التوصيات التربوية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-200 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Human-in-the-Loop Safeguard Notice */}
        <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-900/60 p-3 px-5 flex items-center gap-3 text-amber-900 dark:text-amber-200 text-xs">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <span className="font-bold">سياسة الأمان المؤسسية الإلزامية: </span>
            <span>
              جميع مخرجات الذكاء الاصطناعي استشارية واقتراح مسودات مساندة فقط. يُمنع منعاً باتاً اصدار التشخيص النهائي أو الاعتماد دون مراجعة ومصادقة بشرية من الأخصائي ورئيس الفريق.
            </span>
          </div>
        </div>

        {/* Request Selector */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
            اختر الطلب لتحليله:
          </label>
          <select
            value={selectedReqId}
            onChange={(e) => {
              setSelectedReqId(e.target.value);
              setActionDone(false);
            }}
            className="w-full max-w-md text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-purple-500"
          >
            {requests.map((r) => (
              <option key={r.id} value={r.id}>
                {r.requestNumber} - {r.student.fullName} ({r.primaryCategoryArabic})
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50">
          <button
            onClick={() => { setActiveTab('AUDIT'); setActionDone(false); }}
            className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'AUDIT'
                ? 'border-purple-600 text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileSearch className="w-4 h-4" />
            <span>فحص المستندات وOCR</span>
          </button>
          <button
            onClick={() => { setActiveTab('CONTRADICTIONS'); setActionDone(false); }}
            className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'CONTRADICTIONS'
                ? 'border-purple-600 text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>اكتشاف التناقضات</span>
          </button>
          <button
            onClick={() => { setActiveTab('RECOMMENDATIONS'); setActionDone(false); }}
            className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'RECOMMENDATIONS'
                ? 'border-purple-600 text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>توليد التوصيات التربوية</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 min-h-[260px] flex flex-col justify-between">
          {activeTab === 'AUDIT' && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">
                  المستندات المرفقة بالطلب ({activeReq?.documents.length || 0})
                </h4>
                <div className="space-y-2">
                  {activeReq?.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between text-xs bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{doc.title}</span>
                        <span className="text-[11px] text-slate-500 block">{doc.fileName} - {doc.fileSize}</span>
                      </div>
                      {doc.aiAuditResult ? (
                        <span className="flex items-center gap-1 text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-1 rounded-lg font-bold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          تم التثبت
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-medium">بانتظار الفحص</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {actionDone && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl p-3.5 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    كتمل تحليل الوثائق بنجاح!
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    تم التأكد من صحة الهوية الوطنية والتقارير الطبية وتوافق التواريخ الأكاديمية بنسبة 99.4%.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'CONTRADICTIONS' && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                نتائج مطابقة التقرير الطبي والتقييم المكتبي المدرسية:
              </h4>
              <div className="space-y-2 text-xs">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">توافق تاريخ النمو واللغة: </span>
                    <span className="text-slate-600 dark:text-slate-400">تتطابق ملاحظات مدرسة الأمل مع التقرير الطبي لمركز الرعاية بالنسبة لتأخر النطق المبدئي.</span>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 dark:text-amber-200">تنبيه اختلاف النطاق السلوكي: </span>
                    <span className="text-amber-800 dark:text-amber-300">يظهر التقرير المدرسي درجات تشتت أعلى بالفصل مقارنة بالملاحظات الأسرية في المنزل. يُوصى بالتركيز على البيئة الصفية.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'RECOMMENDATIONS' && (
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                توليد مسودة الخطة التربوية الفردية (IEP Accommodations):
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                سيقوم النظام بتحليل المؤشرات المعرفية واللغوية وتوليد توصيات مبدئية تقتضي موافقة واعتماد رئيس فريق التشخيص.
              </p>

              {actionDone && (
                <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl p-3.5 text-xs text-purple-900 dark:text-purple-200 space-y-1">
                  <div className="font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    تم إضافة التوصيات المقترحة إلى ملف الطلب!
                  </div>
                  <p className="text-[11px]">يمكن للأخصائيين مراجعتها وتعديلها من تبويب "التوصيات" في تفاصيل الطلب.</p>
                </div>
              )}
            </div>
          )}

          {/* Action Footer Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              إغلاق
            </button>

            {activeTab === 'AUDIT' && (
              <button
                onClick={handleRunAudit}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-md shadow-purple-600/30 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSearch className="w-4 h-4" />}
                <span>تشغيل فحص الذكاء الاصطناعي</span>
              </button>
            )}

            {activeTab === 'RECOMMENDATIONS' && (
              <button
                onClick={handleGenerateRecs}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-md shadow-purple-600/30 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>توليد مسودة التوصيات التربوية</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
