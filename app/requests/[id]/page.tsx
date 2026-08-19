'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { useParams, useRouter } from 'next/navigation';
import { REQUEST_STATES, ALLOWED_TRANSITIONS, canTransitionState } from '@/lib/state-machine';
import { calculateSLA } from '@/lib/sla-calculator';
import { RequestStatus } from '@/types/database';
import { RequestStepper } from '@/components/request-stepper';
import {
  FileText,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Calendar,
  Stethoscope,
  Lightbulb,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  FileSearch,
  MessageSquare,
  QrCode,
  Printer,
  ChevronDown,
  Plus,
  Trash2,
  Check,
  XCircle,
  Eye,
  History,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reqId = params.id as string;
  const {
    requests,
    currentUser,
    transitionRequestStatus,
    runAIAuditOnDocument,
    verifyDocument,
    approveReport,
    addDocument,
    scheduleAppointment,
    cancelAppointment,
    updateAppointmentStatus,
    addRecommendation,
    deleteRecommendation,
    toggleApproveRecommendation,
    generateAIRecommendations
  } = useStore();

  const request = requests.find((r) => r.id === reqId || r.requestNumber === reqId) || requests[0];
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'DOCS' | 'APPOINTMENTS' | 'ASSESSMENTS' | 'RECOMMENDATIONS' | 'APPROVALS' | 'AUDIT'>('DETAILS');
  const [transitionNotes, setTransitionNotes] = useState('');
  const [transitionTarget, setTransitionTarget] = useState<RequestStatus | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Modal States
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<'MEDICAL_REPORT' | 'SCHOOL_REPORT' | 'NATIONAL_ID' | 'OTHER'>('MEDICAL_REPORT');

  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [appDate, setAppDate] = useState('2026-08-10');
  const [appTimeSlot, setAppTimeSlot] = useState('09:00 ص - 10:30 ص');
  const [appSpecialist, setAppSpecialist] = useState('د. منيرة آل سعود');
  const [appSpecialization, setAppSpecialization] = useState('التقييم النفسي المعرفي');

  const [showAddRecModal, setShowAddRecModal] = useState(false);
  const [recTitle, setRecTitle] = useState('');
  const [recDesc, setRecDesc] = useState('');
  const [recCategory, setRecCategory] = useState<any>('CLASSROOM_ACCOMMODATION');

  const [cancelModalAppId, setCancelModalAppId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  if (!request) {
    return <div className="p-8 text-center text-xs">الطلب غير موجود.</div>;
  }

  const sla = calculateSLA(request.createdAt, request.priority, request.status, request.statusHistory);
  const statusMeta = REQUEST_STATES[request.status];
  const allowedNextStates = ALLOWED_TRANSITIONS[request.status] || [];

  const handleStateTransition = (nextState: RequestStatus) => {
    const res = transitionRequestStatus(request.id, nextState, transitionNotes);
    setActionFeedback(res);
    setTransitionNotes('');
    setTransitionTarget(null);
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) return;
    addDocument(request.id, {
      title: newDocTitle,
      category: newDocCategory,
      fileName: `${newDocTitle.trim().replace(/\s+/g, '_')}.pdf`,
      fileSize: '1.8 MB',
    });
    setNewDocTitle('');
    setShowAddDocModal(false);
    setActionFeedback({ success: true, message: 'تم إرفاق المستند بنجاح.' });
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleAppointment({
      requestId: request.id,
      studentName: request.student.fullName,
      specialistName: appSpecialist,
      specialization: appSpecialization,
      date: appDate,
      timeSlot: appTimeSlot,
    });
    setShowAddAppModal(false);
    setActionFeedback({ success: true, message: 'تم حجز الموعد التشخيصي بنجاح.' });
  };

  const handleCancelAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalAppId) return;
    cancelAppointment(cancelModalAppId, cancelReason || 'طلب ولي الأمر أو المدرسة التأجيل');
    setCancelModalAppId(null);
    setCancelReason('');
    setActionFeedback({ success: true, message: 'تم إلغاء الموعد وتسجيل السبب.' });
  };

  const handleCreateRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recTitle || !recDesc) return;
    addRecommendation(request.id, {
      title: recTitle,
      description: recDesc,
      category: recCategory,
      isApprovedByTeam: true,
    });
    setRecTitle('');
    setRecDesc('');
    setShowAddRecModal(false);
    setActionFeedback({ success: true, message: 'تمت إضافة التوصية التربوية بنجاح.' });
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          href="/requests"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لقائمة الطلبات</span>
        </Link>

        {request.status === 'APPROVED' && (
          <Link
            href={`/reports/${request.id}/preview`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>معاينة وتنزيل التقرير المعتمد (PDF & QR)</span>
          </Link>
        )}
      </div>

      {/* Main Request Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {request.student.fullName}
              </h2>
              <span className="font-mono text-xs bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-800 font-extrabold">
                {request.requestNumber}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${statusMeta.badgeClass}`}>
                {statusMeta.arabicName}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3 pt-1">
              <span>الهوية: <strong className="font-mono">{request.student.nationalId}</strong></span>
              <span>•</span>
              <span>الفئة: <strong>{request.primaryCategoryArabic}</strong></span>
              <span>•</span>
              <span>المدرسة: {request.schoolName}</span>
              <span>•</span>
              <span>المركز المحال: <strong>{request.referredCenterName || 'المركز الموحد'}</strong></span>
            </div>
          </div>

          {/* SLA Countdown Gauge */}
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 min-w-[240px] text-xs shadow-sm">
            <div className="flex justify-between items-center mb-1 font-bold">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>مؤشر SLA المتبقي:</span>
              </span>
              <span className={sla.isPaused ? 'text-amber-600 font-bold' : sla.isBreached ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                {sla.isPaused ? 'متوقف (نقص وثائق)' : `${sla.daysRemaining}d ${sla.hoursRemaining}h`}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  sla.isPaused
                    ? 'bg-amber-400'
                    : sla.isBreached
                    ? 'bg-rose-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, sla.percentageUsed))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between border animate-in fade-in-50 duration-200 ${
              actionFeedback.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border-rose-300'
            }`}
          >
            <span>{actionFeedback.message}</span>
            <button onClick={() => setActionFeedback(null)} className="text-xs hover:opacity-75">✕</button>
          </div>
        )}

        {/* State Machine Strict Action Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>إجراءات مسار الطلب (محرك الحالات والصلاحيات - RBAC):</span>
            </span>
            <span className="text-[11px] text-slate-500 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              الدور الحالي: <strong className="text-brand-600">{currentUser.roleArabic}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {allowedNextStates.length > 0 ? (
              allowedNextStates.map((nextStatus) => {
                const nextMeta = REQUEST_STATES[nextStatus];
                const checkRole = canTransitionState(request.status, nextStatus, currentUser.role);

                return (
                  <button
                    key={nextStatus}
                    onClick={() => setTransitionTarget(nextStatus)}
                    disabled={!checkRole.allowed}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      checkRole.allowed
                        ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20 active:scale-95'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                    title={checkRole.reason}
                  >
                    <span>الانتقال إلى: {nextMeta.arabicName}</span>
                  </button>
                );
              })
            ) : (
              <span className="text-xs text-slate-500 italic">وصل الطلب للحالة النهائية المقفلة.</span>
            )}
          </div>

          {/* Transition Modal Confirmation Note */}
          {transitionTarget && (
            <div className="mt-3 p-4 bg-white dark:bg-slate-800 border border-brand-300 dark:border-brand-700 rounded-2xl space-y-3 shadow-md animate-in slide-in-from-top-2 duration-150">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-600" />
                <span>تأكيد الانتقال للحالة [{REQUEST_STATES[transitionTarget].arabicName}]:</span>
              </h4>
              <input
                type="text"
                placeholder="أدخل سبب أو ملاحظات التغيير لتضمينها بسجل التاريخ والتدقيق..."
                value={transitionNotes}
                onChange={(e) => setTransitionNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-medium focus:ring-2 focus:ring-brand-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setTransitionTarget(null)}
                  className="px-3.5 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold hover:bg-slate-200"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleStateTransition(transitionTarget)}
                  className="px-4 py-1.5 text-xs bg-emerald-600 text-white font-bold rounded-xl shadow hover:bg-emerald-700"
                >
                  تأكيد الانتقال
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request Stepper Progress */}
      <RequestStepper
        currentStatus={request.status}
        statusHistory={request.statusHistory}
        isSlaPaused={request.isSlaPaused}
      />

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('DETAILS')}
          className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'DETAILS'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          بيانات الطلب والطالب
        </button>

        <button
          onClick={() => setActiveTab('DOCS')}
          className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'DOCS'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          المستندات والوثائق ({request.documents.length})
        </button>

        <button
          onClick={() => setActiveTab('APPOINTMENTS')}
          className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'APPOINTMENTS'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          المواعيد والحضور ({request.appointments.length})
        </button>

        <button
          onClick={() => setActiveTab('ASSESSMENTS')}
          className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'ASSESSMENTS'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          مساحة التقييم والتشخيص ({request.assessments.length})
        </button>

        <button
          onClick={() => setActiveTab('RECOMMENDATIONS')}
          className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'RECOMMENDATIONS'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          التوصيات التربوية الفردية ({request.recommendations.length})
        </button>

        <button
          onClick={() => setActiveTab('APPROVALS')}
          className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'APPROVALS'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          سلسلة الاعتمادات والتوقيعات ({request.approvals.length})
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'AUDIT'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          سجل التدقيق الزمني ({request.statusHistory.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {/* DETAILS TAB */}
        {activeTab === 'DETAILS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-600" />
                <span>سجل بيانات الطالب الطبي والتعليمي</span>
              </h4>
              <div className="space-y-2.5 leading-relaxed">
                <div>الاسم الكامل: <strong className="text-slate-900 dark:text-slate-100 text-sm">{request.student.fullName}</strong></div>
                <div>رقم الهوية / الإقامة: <strong className="font-mono">{request.student.nationalId}</strong></div>
                <div>الجنس: <strong>{request.student.gender === 'MALE' ? 'ذكر' : 'أنثى'}</strong></div>
                <div>تاريخ الميلاد: <strong className="font-mono">{request.student.birthDate} ({request.student.ageYears} سنوات)</strong></div>
                <div>الصف الدراسي الحالي: <strong className="text-brand-700 dark:text-brand-300">{request.student.grade}</strong></div>
                <div>الحالة الطبية المبدئية: <span className="text-slate-600 dark:text-slate-300">{request.student.medicalConditions || 'لا يوجد'}</span></div>
                <div>ملاحظات المرشد: <span className="text-slate-600 dark:text-slate-300">{request.student.notes || 'لا يوجد'}</span></div>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>بيانات المدرسة المرفقة وولي الأمر</span>
              </h4>
              <div className="space-y-2.5 leading-relaxed">
                <div>المدرسة المسجل بها: <strong className="text-slate-900 dark:text-slate-100">{request.schoolName}</strong></div>
                <div>اسم ولي الأمر: <strong>{request.student.parentName}</strong></div>
                <div>هاتف التواصل: <strong className="font-mono">{request.student.parentPhone}</strong></div>
                <div>البريد الإلكتروني: <strong className="font-mono">{request.student.parentEmail}</strong></div>
                <div>الفريق التشخيصي المعين: <strong className="text-purple-600">{request.assignedTeamLeaderName || 'لم يتم التعيين بعد'}</strong></div>
                <div>الأخصائيون المشاركون: <strong>{request.assignedSpecialists.length > 0 ? request.assignedSpecialists.join(', ') : 'بانتظار التعيين'}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* DOCS TAB */}
        {activeTab === 'DOCS' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  المستندات المرفقة والتحقق الذكي
                </h4>
                <p className="text-[11px] text-slate-500">إدارة وفحص الوثائق الطبية والتقارير المدرسية والهوية الوطنية</p>
              </div>

              <button
                onClick={() => setShowAddDocModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>إرفاق مستند جديد</span>
              </button>
            </div>

            {showAddDocModal && (
              <form onSubmit={handleCreateDocument} className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-brand-200 dark:border-brand-800 space-y-3 animate-in fade-in-50">
                <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">إرفاق مستند تشخيصي أو تقرير طبي جديد:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">عنوان المستند:</label>
                    <input
                      type="text"
                      placeholder="مثال: تقرير التقييم السمعي والبصري"
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تصنيف المستند:</label>
                    <select
                      value={newDocCategory}
                      onChange={(e: any) => setNewDocCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                    >
                      <option value="MEDICAL_REPORT">تقرير طبي إكلينيكي</option>
                      <option value="SCHOOL_REPORT">تقرير الأداء والسلوك المدرسي</option>
                      <option value="NATIONAL_ID">الهوية الوطنية / كرت العائلة</option>
                      <option value="PREVIOUS_DIAGNOSIS">تشخيص سابق أو تقرير تأهيلي</option>
                      <option value="OTHER">أخرى</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddDocModal(false)}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-xl font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-600 text-white rounded-xl font-bold shadow"
                  >
                    رفع وحفظ
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {request.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 transition-all"
                >
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-600" />
                      <span>{doc.title}</span>
                      {doc.isVerified && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          متحقق منه
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 font-mono text-[11px]">
                      {doc.fileName} ({doc.fileSize}) • مرفق بواسطة: {doc.uploadedBy}
                    </div>
                    {doc.aiAuditResult && (
                      <p className="text-[11px] text-purple-700 dark:text-purple-300 font-medium pt-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        <span>AI OCR Audit: {doc.aiAuditResult.summary}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => runAIAuditOnDocument(request.id, doc.id)}
                      className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold hover:bg-purple-200 transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>فحص AI</span>
                    </button>
                    {!doc.isVerified && (
                      <button
                        onClick={() => verifyDocument(request.id, doc.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>اعتماد الوثيقة</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'APPOINTMENTS' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  سجل الجلسات والمواعيد التشخيصية
                </h4>
                <p className="text-[11px] text-slate-500">إدارة مواعيد الكشف والتقييم الإكلينيكي وحضور الطلاب</p>
              </div>

              <button
                onClick={() => setShowAddAppModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>حجز موعد جديد</span>
              </button>
            </div>

            {showAddAppModal && (
              <form onSubmit={handleCreateAppointment} className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-brand-200 dark:border-brand-800 space-y-3 animate-in fade-in-50">
                <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">حجز جلسة تقييم وموعد تشخيصي جديد:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم الأخصائي:</label>
                    <input
                      type="text"
                      value={appSpecialist}
                      onChange={(e) => setAppSpecialist(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">التخصص / نوع الجلسة:</label>
                    <input
                      type="text"
                      value={appSpecialization}
                      onChange={(e) => setAppSpecialization(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ الموعد:</label>
                    <input
                      type="date"
                      value={appDate}
                      onChange={(e) => setAppDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الفترة الزمنية:</label>
                    <select
                      value={appTimeSlot}
                      onChange={(e) => setAppTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                    >
                      <option value="08:30 ص - 09:30 ص">08:30 ص - 09:30 ص</option>
                      <option value="09:30 ص - 10:30 ص">09:30 ص - 10:30 ص</option>
                      <option value="10:30 ص - 11:30 ص">10:30 ص - 11:30 ص</option>
                      <option value="11:30 ص - 12:30 م">11:30 ص - 12:30 م</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddAppModal(false)}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-xl font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-600 text-white rounded-xl font-bold shadow"
                  >
                    تأكيد الحجز
                  </button>
                </div>
              </form>
            )}

            {/* Cancel Appointment Reason Dialog */}
            {cancelModalAppId && (
              <form onSubmit={handleCancelAppointmentSubmit} className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl space-y-3 animate-in fade-in-50">
                <h5 className="font-bold text-xs text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>تأكيد إلغاء الموعد وتسجيل السبب:</span>
                </h5>
                <input
                  type="text"
                  placeholder="أدخل سبب إلغاء الجلسة (مثال: ظرف طارئ لولي الأمر)..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCancelModalAppId(null)}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-xl font-semibold"
                  >
                    تراجع
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-rose-600 text-white font-bold rounded-xl shadow"
                  >
                    تأكيد الإلغاء
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {request.appointments.length > 0 ? (
                request.appointments.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span>{app.specialistName} ({app.specialization})</span>
                      </div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        تاريخ الموعد: <strong>{app.date}</strong> | الفترة: <strong>{app.timeSlot}</strong>
                      </div>
                      {app.cancellationReason && (
                        <div className="text-rose-600 text-[11px] font-medium pt-0.5">
                          سبب الإلغاء: {app.cancellationReason}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`font-bold px-3 py-1 rounded-full text-[11px] ${
                        app.status === 'ATTENDED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : app.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {app.status === 'ATTENDED' ? 'حضر الجلسة' : app.status === 'CANCELLED' ? 'ملغي' : 'مجدول'}
                      </span>

                      {app.status === 'SCHEDULED' && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(app.id, 'ATTENDED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                          >
                            تسجيل الحضور
                          </button>
                          <button
                            onClick={() => setCancelModalAppId(app.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-[11px]"
                          >
                            إلغاء الموعد
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500">لا توجد مواعيد مجدولة لهذا الطلب بعد.</div>
              )}
            </div>
          </div>
        )}

        {/* ASSESSMENTS TAB */}
        {activeTab === 'ASSESSMENTS' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  نتائج المقاييس المعيارية والتقييم الإكلينيكي
                </h4>
                <p className="text-[11px] text-slate-500">سجل نتائج اختبارات الذكاء والسلوك التكيفي والنمو اللغوي</p>
              </div>

              <Link
                href={`/diagnostic-workspace/${request.id}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md shadow-purple-600/20"
              >
                <Stethoscope className="w-4 h-4" />
                <span>فتح مساحة العمل التشخيصية</span>
              </Link>
            </div>

            <div className="space-y-3">
              {request.assessments.length > 0 ? (
                request.assessments.map((ass) => (
                  <div key={ass.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{ass.testUsed}</span>
                        <div className="text-slate-500 text-[11px]">الأخصائي: {ass.specialistName} ({ass.specialization})</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {ass.standardScore && (
                          <span className="font-mono font-extrabold px-3 py-1 rounded-xl bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                            الدرجة المعيارية: {ass.standardScore}
                          </span>
                        )}
                        {ass.percentileRank && (
                          <span className="font-mono font-extrabold px-3 py-1 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            الرتبة المئينية: {ass.percentileRank}%
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{ass.clinicalSummary}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-1">
                        <span className="font-bold text-emerald-900 dark:text-emerald-200 block">نقاط القوة النمائية:</span>
                        <ul className="list-disc list-inside text-emerald-800 dark:text-emerald-300 space-y-0.5 text-[11px]">
                          {ass.strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl space-y-1">
                        <span className="font-bold text-amber-900 dark:text-amber-200 block">احتياجات الدعم والتأهيل:</span>
                        <ul className="list-disc list-inside text-amber-800 dark:text-amber-300 space-y-0.5 text-[11px]">
                          {ass.needs.map((n, idx) => (
                            <li key={idx}>{n}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {ass.dsmCode && (
                      <div className="text-[11px] font-mono text-slate-500 pt-1">
                        التصنيف الإكلينيكي: <strong>{ass.dsmCode}</strong>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500">لا توجد تقييمات مسجلة بعد. استخدم زر "مساحة العمل التشخيصية" لإجراء المقياس.</div>
              )}
            </div>
          </div>
        )}

        {/* RECOMMENDATIONS TAB */}
        {activeTab === 'RECOMMENDATIONS' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  التوصيات التربوية الفردية (IEP Accommodations)
                </h4>
                <p className="text-[11px] text-slate-500">مواءمات البيئة الصفية، التقنيات المساعدة، وخطط التدخل السلوكي</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/iep/${request.id}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200 font-bold rounded-xl transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>باني الخطة الفردية (IEP Hub)</span>
                </Link>
                <button
                  onClick={() => generateAIRecommendations(request.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 hover:bg-purple-200 font-bold rounded-xl transition-all"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>توليد بالذكاء الاصطناعي</span>
                </button>
                <button
                  onClick={() => setShowAddRecModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة توصية مخصصة</span>
                </button>
              </div>
            </div>

            {showAddRecModal && (
              <form onSubmit={handleCreateRecommendation} className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-brand-200 dark:border-brand-800 space-y-3 animate-in fade-in-50">
                <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">إضافة توصية تربوية جديدة للخطة الفردية:</h5>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">عنوان التوصية:</label>
                  <input
                    type="text"
                    placeholder="مثال: زيادة وقت الاختبارات التحريرية بنسبة 50%"
                    value={recTitle}
                    onChange={(e) => setRecTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">التفاصيل والتطبيق الصفي:</label>
                  <textarea
                    rows={2}
                    placeholder="شرح آلية التنفيذ للمعلم والمرشد..."
                    value={recDesc}
                    onChange={(e) => setRecDesc(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddRecModal(false)}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-xl font-semibold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-600 text-white rounded-xl font-bold shadow"
                  >
                    حفظ التوصية
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {request.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">{rec.title}</span>
                      {rec.isAISuggested && (
                        <span className="text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          مقترح AI
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        rec.isApprovedByTeam
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {rec.isApprovedByTeam ? 'معتمد من الفريق' : 'قيد المراجعة'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{rec.description}</p>
                    <div className="text-[11px] text-slate-500 font-medium">اقترحها: {rec.suggestedBy}</div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleApproveRecommendation(request.id, rec.id)}
                      className={`p-1.5 rounded-xl border font-bold transition-all ${
                        rec.isApprovedByTeam
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                      title={rec.isApprovedByTeam ? 'إلغاء الاعتماد' : 'اعتماد التوصية'}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteRecommendation(request.id, rec.id)}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 dark:bg-slate-800 transition-all"
                      title="حذف التوصية"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APPROVALS TAB */}
        {activeTab === 'APPROVALS' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  سلسلة الاعتمادات الرقمية والختم المعتمد
                </h4>
                <p className="text-[11px] text-slate-500">مصادقة رئيس الفريق واعتماد المدير العام للتقرير الرسمي</p>
              </div>
            </div>

            {request.status !== 'APPROVED' ? (
              <div className="p-5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-2xl space-y-3">
                <p className="text-amber-900 dark:text-amber-200 font-bold leading-relaxed">
                  الطلب حالياً في مرحلة [{statusMeta.arabicName}]. يشترط اكتمال نتائج المقاييس والتوصيات قبل الاعتماد النهائي وإصدار الشهادة الرقمية المعتمدة.
                </p>
                {(currentUser.role === 'SUPERVISOR' || currentUser.role === 'SYSTEM_ADMIN' || currentUser.role === 'TEAM_LEADER') && (
                  <button
                    onClick={() => approveReport(request.id)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold shadow-md hover:bg-emerald-700 transition-all shadow-emerald-600/30"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>اعتماد وتوقيع التقرير رسمياً (Digital Stamp & QR Code)</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <span>تم اعتماد وتوقيع التقرير التشخيصي رسمياً بالختم الرقمي!</span>
                  </div>
                  <Link
                    href={`/reports/${request.id}/preview`}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-sm"
                  >
                    معاينة الوثيقة الرسمية
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-emerald-950 dark:text-emerald-100 font-mono text-[11px] pt-2 border-t border-emerald-200 dark:border-emerald-800">
                  <div>رمز التحقق الوطني: <strong>{request.reportVerificationToken}</strong></div>
                  <div>بصمة التوقيع الرقمي (SHA-256): <strong className="text-[10px]">e3b0c442...855</strong></div>
                </div>
              </div>
            )}

            {/* Approval History Chain */}
            <div className="space-y-3 pt-2">
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">سجل التوقيعات والمصادقات:</h5>
              {request.approvals.map((appr) => (
                <div key={appr.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{appr.approverName} ({appr.approverRole})</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">{appr.notes}</p>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">{appr.signatureTimestamp?.split('T')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUDIT TAB */}
        {activeTab === 'AUDIT' && (
          <div className="space-y-4 text-xs">
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <History className="w-4 h-4 text-brand-600" />
                <span>سجل التدقيق وتاريخ تغير الحالات (Audit Trail)</span>
              </h4>
              <p className="text-[11px] text-slate-500">التتبع الزمني الدقيق لجميع الإجراءات والانتقالات وأوقات التوقف والتشغيل</p>
            </div>

            <div className="relative border-r-2 border-slate-200 dark:border-slate-700 mr-3 space-y-6 pr-6 py-2">
              {request.statusHistory.map((hist, idx) => {
                const toMeta = REQUEST_STATES[hist.toStatus];
                return (
                  <div key={hist.id || idx} className="relative space-y-1">
                    {/* Timeline Node Dot */}
                    <div className="absolute -right-[31px] top-1 w-3.5 h-3.5 rounded-full bg-brand-600 border-2 border-white dark:border-slate-900 ring-2 ring-brand-200" />

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                        <span>انتقال إلى:</span>
                        <span className={`px-2 py-0.5 rounded-md font-extrabold text-[11px] border ${toMeta.badgeClass}`}>
                          {toMeta.arabicName}
                        </span>
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {new Date(hist.timestamp).toLocaleString('ar-SA')}
                      </span>
                    </div>

                    <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                      المنفذ: <strong>{hist.actorName}</strong> ({hist.actorRole})
                    </div>

                    {hist.notes && (
                      <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-medium">
                        "{hist.notes}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
