'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  Award,
  BookOpen,
  Target,
  Users,
  Calendar,
  Save,
  Sliders,
} from 'lucide-react';
import { IEPGoal } from '@/types/database';

const DOMAIN_OPTIONS: { id: IEPGoal['domain']; label: string; color: string }[] = [
  { id: 'ACADEMIC', label: 'الأهداف الأكاديمية وصعوبات التعلم', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950 border-blue-200' },
  { id: 'BEHAVIORAL', label: 'السلوك التكيفي وتعديل السلوك', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950 border-amber-200' },
  { id: 'SPEECH', label: 'النطق والتواصل واللغة', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950 border-purple-200' },
  { id: 'OCCUPATIONAL', label: 'العلاج الوظيفي والتكامل الحسي', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 border-emerald-200' },
  { id: 'LIFE_SKILLS', label: 'المهارات الاستقلالية والعناية الذاتية', color: 'text-teal-600 bg-teal-50 dark:bg-teal-950 border-teal-200' },
  { id: 'SOCIAL', label: 'التفاعل والدمج الاجتماعي مع الأقران', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950 border-rose-200' },
];

export default function IEPBuilderPage() {
  const params = useParams();
  const reqId = params.id as string;
  const { requests, saveIEPPlan, updateIEPGoalProgress, currentUser } = useStore();
  const request = requests.find((r) => r.id === reqId || r.studentId === reqId) || requests[0];

  if (!request) {
    return <div className="p-8 text-center text-sm text-slate-500">الطلب غير موجود.</div>;
  }

  const existingPlan = request.iepPlan;

  // Local state for IEP Plan
  const [academicYear, setAcademicYear] = useState(existingPlan?.academicYear || '1447 / 1448 هـ');
  const [semester, setSemester] = useState(existingPlan?.semester || 'الفصل الدراسي الأول');
  const [parentNotes, setParentNotes] = useState(
    existingPlan?.parentInvolvementNotes || 'موافقة وتوقيع ولي الأمر على خطة التعزيز السلوكي والتدريب المنزلي اليومي'
  );
  const [reviewDate, setReviewDate] = useState(existingPlan?.reviewDate || '2026-12-20');

  // Goals
  const initialGoals: IEPGoal[] = existingPlan?.goals?.length
    ? existingPlan.goals
    : [
        {
          id: 'goal-1',
          domain: 'ACADEMIC',
          domainArabic: 'الأهداف الأكاديمية وصعوبات التعلم',
          title: 'تمييز الحروف المتشابهة بصرياً وصوتياً وقراءتها بطلاقة',
          description: 'أن يقرأ الطالب 20 كلمة ثلاثية تتضمن الحروف المتشابهة بدقة 85% خلال 3 محاولات متتالية.',
          targetDate: '2026-11-15',
          status: 'IN_PROGRESS',
          progressPercentage: 60,
          criteria: 'دقة 85% في 3 جلسات تقييم مستمرة',
          assignedSpecialist: 'أ. عبد الله الشهري (معلم صعوبات التعلم)',
        },
        {
          id: 'goal-2',
          domain: 'SPEECH',
          domainArabic: 'النطق والتواصل واللغة',
          title: 'استخدام جمل ثنائية وثلاثية للتعبير عن الاحتياجات الأساسية',
          description: 'أن يوظف الطالب البطاقات المصورة أو النطق المباشر لطلب المساعدة أو النشاط المفضل بنسبة 90%.',
          targetDate: '2026-11-30',
          status: 'IN_PROGRESS',
          progressPercentage: 45,
          criteria: 'استجابة صحيحة في 9 من أصل 10 فرص يومية',
          assignedSpecialist: 'أ. سارة الحربي (أخصائي تخاطب)',
        },
        {
          id: 'goal-3',
          domain: 'BEHAVIORAL',
          domainArabic: 'السلوك التكيفي وتعديل السلوك',
          title: 'زيادة مدة الجلوس والتركيز في النشاط الصفي الفردي',
          description: 'أن يبقى الطالب منتبهاً ومشاركاً في النشاط التعليمي لمدة 15 دقيقة متصلة دون مغادرة المقعد.',
          targetDate: '2026-10-30',
          status: 'MASTERED',
          progressPercentage: 100,
          criteria: 'الجلوس المستمر لـ 15 دقيقة مع تعزيز إيجابي متقطع',
          assignedSpecialist: 'د. خالد الغامدي (أخصائي نفسي)',
        },
      ];

  const [goals, setGoals] = useState<IEPGoal[]>(initialGoals);

  // New Goal Form State
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalDomain, setNewGoalDomain] = useState<IEPGoal['domain']>('ACADEMIC');
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalCriteria, setNewGoalCriteria] = useState('إتقان بنسبة 80% في 3 محاولات متتالية');
  const [newGoalTargetDate, setNewGoalTargetDate] = useState('2026-12-15');
  const [newGoalSpecialist, setNewGoalSpecialist] = useState(currentUser.name);

  const [savedAlert, setSavedAlert] = useState(false);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const domainMeta = DOMAIN_OPTIONS.find((d) => d.id === newGoalDomain);
    const newGoal: IEPGoal = {
      id: `goal-${Date.now()}`,
      domain: newGoalDomain,
      domainArabic: domainMeta?.label || 'أكاديمي',
      title: newGoalTitle,
      description: newGoalDesc,
      targetDate: newGoalTargetDate,
      status: 'NOT_STARTED',
      progressPercentage: 0,
      criteria: newGoalCriteria,
      assignedSpecialist: newGoalSpecialist,
    };

    setGoals([...goals, newGoal]);
    setNewGoalTitle('');
    setNewGoalDesc('');
    setShowAddGoalModal(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter((g) => g.id !== goalId));
  };

  const handleSaveFullPlan = () => {
    saveIEPPlan(request.id, {
      academicYear,
      semester,
      parentInvolvementNotes: parentNotes,
      reviewDate,
      goals,
      isPublished: true,
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  // Stats calculation
  const totalGoals = goals.length;
  const masteredCount = goals.filter((g) => g.status === 'MASTERED').length;
  const inProgressCount = goals.filter((g) => g.status === 'IN_PROGRESS').length;
  const overallMastery = totalGoals > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progressPercentage, 0) / totalGoals) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <Link
            href={`/requests/${request.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 mb-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لملف الطلب ({request.requestNumber})</span>
          </Link>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-brand-600" />
            <span>باني الخطة التربوية الفردية التفاعلي (IEP Hub & Progress Tracker)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            صياغة وتتبع أهداف SMART السلوكية والأكاديمية للطالب: <strong>{request.student.fullName}</strong> • الصف: <strong>{request.student.grade}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الوثيقة الرسمية</span>
          </button>
          <button
            onClick={handleSaveFullPlan}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>حفظ واعتماد الخطة</span>
          </button>
        </div>
      </div>

      {savedAlert && (
        <div className="p-4 bg-emerald-50 text-emerald-900 font-bold text-xs rounded-2xl border border-emerald-300 flex items-center gap-2 animate-in fade-in-50 print:hidden">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>تم حفظ الخطة التربوية الفردية (IEP) بنجاح وتحديث نسب الإنجاز والمؤشرات!</span>
        </div>
      )}

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 print:hidden">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-xs space-y-1">
          <span className="text-slate-500 font-bold">إجمالي الأهداف الفردية</span>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">{totalGoals}</div>
          <span className="text-[11px] text-slate-400">أهداف SMART محددة</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-xs space-y-1">
          <span className="text-slate-500 font-bold">متوسط نسبة الإتقان الكلية</span>
          <div className="text-2xl font-black font-mono text-brand-600">%{overallMastery}</div>
          <span className="text-[11px] text-slate-400">معدل الإنجاز التراكمي</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-xs space-y-1">
          <span className="text-slate-500 font-bold">أهداف تم إتقانها</span>
          <div className="text-2xl font-black font-mono text-emerald-600">{masteredCount}</div>
          <span className="text-[11px] text-slate-400">محصلة نهائية مكتملة</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-xs space-y-1">
          <span className="text-slate-500 font-bold">أهداف قيد التدريب</span>
          <div className="text-2xl font-black font-mono text-amber-600">{inProgressCount}</div>
          <span className="text-[11px] text-slate-400">جلسات تأهيل مستمرة</span>
        </div>
      </div>

      {/* Main IEP Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Printable Official Header */}
        <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-slate-100">المملكة العربية السعودية • وزارة التعليم</h1>
            <h2 className="text-xs font-bold text-slate-600 dark:text-slate-400">إدارة التربية الخاصة - الخطة التربوية الفردية (IEP)</h2>
          </div>
          <div className="text-left font-mono text-xs">
            <div>رقم الملف: <strong>{request.requestNumber}</strong></div>
            <div className="text-[11px] text-slate-500">تاريخ المراجعة الدورية: {reviewDate}</div>
          </div>
        </div>

        {/* Metadata Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">العام الدراسي:</label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الفصل الدراسي:</label>
            <input
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ المراجعة النصفية:</label>
            <input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
            />
          </div>
        </div>

        {/* Goals Management Header */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-600" />
              <span>أهداف الخطة التربوية الفردية المقاسة (SMART Goals)</span>
            </h3>
            <p className="text-[11px] text-slate-500">أهداف قابلة للقياس والتقويم مع تحديد نسب الإنجاز والمحكات المرجعية</p>
          </div>

          <button
            onClick={() => setShowAddGoalModal(true)}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm print:hidden"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة هدف تربوي جديد</span>
          </button>
        </div>

        {/* Add Goal Modal / Form */}
        {showAddGoalModal && (
          <form onSubmit={handleAddGoal} className="p-5 bg-slate-50 dark:bg-slate-800/80 border border-brand-200 dark:border-brand-800 rounded-2xl space-y-4 text-xs animate-in fade-in-50 print:hidden">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">إضافة هدف تربوي سلوكي جديد:</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">مجال الهدف التربوي:</label>
                <select
                  value={newGoalDomain}
                  onChange={(e: any) => setNewGoalDomain(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                >
                  {DOMAIN_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الأخصائي / المعلم المسؤول:</label>
                <input
                  type="text"
                  value={newGoalSpecialist}
                  onChange={(e) => setNewGoalSpecialist(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">عنوان الهدف السلوكي:</label>
                <input
                  type="text"
                  placeholder="مثال: مطابقة الحروف الهجائية مع أصواتها المقابلة بدقة 80%"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">وصف الهدف وإجراءات التنفيذ:</label>
                <textarea
                  rows={2}
                  placeholder="وصف تفصيلي للبيئة التعليمية، الوسائل المساعدة، وخطوات التدريب..."
                  value={newGoalDesc}
                  onChange={(e) => setNewGoalDesc(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">محك الإتقان والمعيار (Mastery Criteria):</label>
                <input
                  type="text"
                  value={newGoalCriteria}
                  onChange={(e) => setNewGoalCriteria(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ التحقق المستهدف:</label>
                <input
                  type="date"
                  value={newGoalTargetDate}
                  onChange={(e) => setNewGoalTargetDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddGoalModal(false)}
                className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-xl font-semibold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-brand-600 text-white rounded-xl font-bold shadow"
              >
                إضافة الهدف للخطة
              </button>
            </div>
          </form>
        )}

        {/* Goals List with Live Progress Sliders */}
        <div className="space-y-4">
          {goals.map((goal, idx) => {
            const domainMeta = DOMAIN_OPTIONS.find((d) => d.id === goal.domain);
            return (
              <div
                key={goal.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 transition-all hover:border-slate-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${domainMeta?.color || ''}`}>
                      {goal.domainArabic}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{goal.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                        goal.status === 'MASTERED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : goal.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {goal.status === 'MASTERED' ? 'تم الإتقان ✓' : goal.status === 'IN_PROGRESS' ? 'قيد التدريب' : 'لم يبدأ'}
                    </span>

                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 print:hidden"
                      title="حذف الهدف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{goal.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium pt-1">
                  <div>محك ومعيار الإتقان: <strong className="text-slate-700 dark:text-slate-300">{goal.criteria}</strong></div>
                  <div>المسؤول: <strong className="text-slate-700 dark:text-slate-300">{goal.assignedSpecialist}</strong> • التاريخ المستهدف: <span className="font-mono">{goal.targetDate}</span></div>
                </div>

                {/* Interactive Progress Slider */}
                <div className="pt-2 space-y-1.5 print:hidden border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Sliders className="w-3.5 h-3.5" />
                      تحديث نسبة إتقان الهدف:
                    </span>
                    <span className="font-mono text-brand-600">%{goal.progressPercentage}</span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={goal.progressPercentage}
                    onChange={(e) => {
                      const newPct = Number(e.target.value);
                      const newStatus = newPct === 100 ? 'MASTERED' : newPct > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
                      setGoals(
                        goals.map((g) => (g.id === goal.id ? { ...g, progressPercentage: newPct, status: newStatus } : g))
                      );
                    }}
                    className="w-full accent-brand-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Parent Involvement Notes */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <label className="block font-bold text-slate-800 dark:text-slate-200">
            ملاحظات وإسهام الأسرة في الخطة الفردية (Home-School Collaboration):
          </label>
          <textarea
            rows={2}
            value={parentNotes}
            onChange={(e) => setParentNotes(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl leading-relaxed"
          />
        </div>

        {/* Multi-Disciplinary Team Signatures Block */}
        <div className="pt-6 border-t-2 border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100">معلم التربية الخاصة:</div>
            <div className="text-slate-600 dark:text-slate-400 font-medium">{currentUser.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">التوقيع الرقمي: معتمد وموثق</div>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100">الأخصائي النفسي / التخاطب:</div>
            <div className="text-slate-600 dark:text-slate-400 font-medium">أ. سارة الحربي</div>
            <div className="text-[10px] text-slate-400 font-mono">التوقيع الرقمي: معتمد وموثق</div>
          </div>

          <div className="space-y-1 text-left">
            <div className="font-bold text-slate-900 dark:text-slate-100">موافقة وتوقيع ولي الأمر:</div>
            <div className="text-slate-600 dark:text-slate-400 font-medium">{request.student.parentName}</div>
            <div className="text-[10px] text-emerald-600 font-bold">تمت المصادقة عبر بوابة النفاذ</div>
          </div>
        </div>
      </div>
    </div>
  );
}
