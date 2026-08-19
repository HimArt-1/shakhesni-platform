'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { useParams, useRouter } from 'next/navigation';
import { Stethoscope, CheckCircle2, Save, FileText, Sparkles, Brain, AlertCircle, ArrowRight, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ScalePreset {
  name: string;
  category: string;
  defaultDsm: string;
  defaultSummary: string;
  defaultStrengths: string[];
  defaultNeeds: string[];
}

const SCALE_PRESETS: ScalePreset[] = [
  {
    name: 'مقياس وكسلر لذكاء الأطفال (WISC-V) - الطبعة الخامسة',
    category: 'التقييم النفسي والمعرفي',
    defaultDsm: 'F84.0 - Autism Spectrum Disorder (Level 1)',
    defaultSummary: 'أظهر الفحص تفاوتاً بين القدرات البصرية المكانية والقدرات اللفظية، مع وجود نقاط قوة ملحوظة في معالجة الأنماط.',
    defaultStrengths: ['الذاكرة البصرية المكانية المتقدمة', 'التعرف على الأنماط والتفاصيل الدقيقة', 'التفكير المنطقي غير اللفظي'],
    defaultNeeds: ['تنمية مهارات التعبير اللفظي التواصلي', 'برامج الدمج التفاعلي مع الأقران', 'تخفيف التشتت الحسي في البيئة الصفية']
  },
  {
    name: 'مقياس ستانفورد بينيه للذكاء - الصورة الخامسة (SB-5)',
    category: 'القدرات العقلية والذكاء',
    defaultDsm: 'F70 - Mild Intellectual Disability',
    defaultSummary: 'الدرجة المعيارية الكلية تشير إلى أداء يقع ضمن النطاق الحدي إلى البسيط مع حاجة لبرامج تدريب المهارات التكيفية.',
    defaultStrengths: ['الاستجابة الجيدة للتعزيز الإيجابي الفوري', 'القدرة على التعلم من خلال النمذجة الحسية'],
    defaultNeeds: ['تبسيط المفاهيم المجردة', 'استخدام الوسائل المحسوسة في الحساب والقراءة', 'تكرار التعليمات بخطوات متسلسلة']
  },
  {
    name: 'مقياس جيليام لتقدير التوحد - الإصدار الثالث (GARS-3)',
    category: 'طيف التوحد والنمو',
    defaultDsm: 'F84.0 - Autism Spectrum Disorder (Level 2)',
    defaultSummary: 'مؤشر التوحد يقع ضمن المستوى الدال على احتمالية عالية جداً لاضطراب طيف التوحد مع نمطية في الاستجابات والسلوك المقيد.',
    defaultStrengths: ['الالتزام الدقيق بالجداول الروتينية المصورة', 'المطابقة البصرية والتركيب'],
    defaultNeeds: ['التدخل السلوكي التطبيقي (ABA)', 'جلسات نطق وتخاطب مكثفة', 'العلاج الوظيفي للتكامل الحسي']
  },
  {
    name: 'مقياس فينلاند للسلوك التكيفي (Vineland-3)',
    category: 'السلوك التكيفي والمهارات الحياتية',
    defaultDsm: 'F84.0 - Autism Spectrum Disorder (Level 1)',
    defaultSummary: 'أظهر مقياس السلوك التكيفي حاجة ماسة لتعزيز مهارات التنشئة الاجتماعية والتواصل اليومي المستقل.',
    defaultStrengths: ['الاستقلالية في مهارات العناية الذاتية الأساسية', 'استخدام الأدوات التقنية المساعدة'],
    defaultNeeds: ['تدريب على فهم التعبيرات الاجتماعية ولغة الجسد', 'مهارات السلامة الشخصية والمجتمعية']
  },
  {
    name: 'مقياس كونرز لتقدير فرط الحركة وتشتت الانتباه (Conners-3)',
    category: 'فرط الحركة والانتباه',
    defaultDsm: 'F90.2 - ADHD Combined Presentation',
    defaultSummary: 'تظهر النتائج مؤشرات دالة على فرط نشاط حركي ملحوظ واندفاعية عالية مع تشتت في المهام الأكاديمية الطويلة.',
    defaultStrengths: ['الطاقة العالية والمشاركة الحماسية في الأنشطة الحركية', 'سرعة البديهة في الاستجابات السريعة'],
    defaultNeeds: ['تقسيم المهام الأكاديمية إلى فترات قصيرة (15 دقيقة)', 'جلوس الطالب في الصفوف الأولى بعيداً عن المشتتات', 'إعطاء مهام حركية هادفة خلال اليوم الدراسي']
  },
  {
    name: 'بطارية تقييم صعوبات التعلم الأكاديمية (المايكل بست)',
    category: 'صعوبات التعلم',
    defaultDsm: 'F81.0 - Specific Learning Disorder with impairment in reading',
    defaultSummary: 'وجود فجوة ملحوظة بين القدرة العقلية العامة والتحصيل الأكاديمي في القراءة والكتابة والحساب.',
    defaultStrengths: ['مستوى ذكاء عام طبيعي ومتفوق', 'القدرة على الفهم والاستيعاب الشفهي عند القراءة له'],
    defaultNeeds: ['برنامج معالجة الوعي الصوتي والقراءة المتدرجة', 'استخدام الخطوط الكبيرة والمسافات الواسعة في الاختبارات', 'منح وقت إضافي 50% في الاختبارات التحريرية']
  }
];

export default function DiagnosticWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { requests, addAssessment, currentUser } = useStore();
  const reqId = params.id as string;
  const request = requests.find((r) => r.id === reqId);

  if (!request) {
    return <div className="p-8 text-center text-sm text-slate-500">الطلب غير موجود أو تم حذفه.</div>;
  }

  const [selectedPreset, setSelectedPreset] = useState<ScalePreset>(SCALE_PRESETS[0]);
  const [testUsed, setTestUsed] = useState(SCALE_PRESETS[0].name);
  const [rawScore, setRawScore] = useState(85);
  const [standardScore, setStandardScore] = useState(92);
  const [percentileRank, setPercentileRank] = useState(30);
  const [clinicalSummary, setClinicalSummary] = useState(SCALE_PRESETS[0].defaultSummary);
  const [dsmCode, setDsmCode] = useState(SCALE_PRESETS[0].defaultDsm);
  
  // Domain Scores
  const [verbalScore, setVerbalScore] = useState(88);
  const [nonVerbalScore, setNonVerbalScore] = useState(96);
  const [workingMemoryScore, setWorkingMemoryScore] = useState(84);
  const [processingSpeedScore, setProcessingSpeedScore] = useState(90);

  // Strengths & Needs
  const [strengths, setStrengths] = useState<string[]>(SCALE_PRESETS[0].defaultStrengths);
  const [needs, setNeeds] = useState<string[]>(SCALE_PRESETS[0].defaultNeeds);
  const [newStrength, setNewStrength] = useState('');
  const [newNeed, setNewNeed] = useState('');

  const [successMsg, setSuccessMsg] = useState(false);

  const handleSelectPreset = (preset: ScalePreset) => {
    setSelectedPreset(preset);
    setTestUsed(preset.name);
    setClinicalSummary(preset.defaultSummary);
    setDsmCode(preset.defaultDsm);
    setStrengths(preset.defaultStrengths);
    setNeeds(preset.defaultNeeds);
  };

  const handleStandardScoreChange = (score: number) => {
    setStandardScore(score);
    // Simple Gaussian percentile approximation for IQ (mean 100, sd 15)
    let approxPercentile = 50;
    if (score <= 70) approxPercentile = 2;
    else if (score <= 75) approxPercentile = 5;
    else if (score <= 80) approxPercentile = 9;
    else if (score <= 85) approxPercentile = 16;
    else if (score <= 90) approxPercentile = 25;
    else if (score <= 95) approxPercentile = 37;
    else if (score <= 100) approxPercentile = 50;
    else if (score <= 105) approxPercentile = 63;
    else if (score <= 110) approxPercentile = 75;
    else if (score <= 115) approxPercentile = 84;
    else if (score <= 120) approxPercentile = 91;
    else if (score <= 125) approxPercentile = 95;
    else approxPercentile = 99;
    setPercentileRank(approxPercentile);
  };

  const handleAddStrength = () => {
    if (!newStrength.trim()) return;
    setStrengths([...strengths, newStrength.trim()]);
    setNewStrength('');
  };

  const handleAddNeed = () => {
    if (!newNeed.trim()) return;
    setNeeds([...needs, newNeed.trim()]);
    setNewNeed('');
  };

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    addAssessment(request.id, {
      specialization: currentUser.specialization || selectedPreset.category || 'التقييم النفسي المعرفي',
      testUsed,
      rawScore,
      standardScore,
      percentileRank,
      domainScores: {
        'القدرة اللفظية': verbalScore,
        'القدرة البصرية المكانية': nonVerbalScore,
        'الذاكرة العاملة': workingMemoryScore,
        'سرعة المعالجة': processingSpeedScore,
      },
      clinicalSummary,
      dsmCode,
      strengths,
      needs,
    });

    setSuccessMsg(true);
    setTimeout(() => {
      router.push(`/requests/${request.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href={`/requests/${request.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 mb-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لملف الطلب ({request.requestNumber})</span>
          </Link>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-purple-600" />
            <span>مساحة التقييم والتشخيص الإكلينيكي (Diagnostic Workspace)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إدخال وتوثيق نتائج المقاييس المعتمدة للطالب: <strong>{request.student.fullName}</strong> • الصف: <strong>{request.student.grade}</strong>
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 px-4 py-2 rounded-2xl text-xs font-mono font-bold text-purple-800 dark:text-purple-300">
          الأخصائي الفاحص: {currentUser.name}
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-900 font-bold text-xs rounded-2xl border border-emerald-300 flex items-center gap-2 animate-in fade-in-50">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>تم حفظ نتائج الجلسة التشخيصية وتحديث حالة الطلب إلى (مسودة التقرير)! جاري التحويل لملف الطلب...</span>
        </div>
      )}

      {/* Quick Tool Selector Presets */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-3">
        <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-600" />
          <span>اختر المقياس المعياري المطبق (مكتبة المقاييس المعتمدة):</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {SCALE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`p-3 rounded-2xl text-right text-xs transition-all border ${
                testUsed === preset.name
                  ? 'border-purple-600 bg-purple-50/80 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 shadow-sm font-bold'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40 font-medium'
              }`}
            >
              <div className="font-bold">{preset.name}</div>
              <span className="text-[10px] text-slate-500 block mt-1">{preset.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Assessment Input Form */}
      <form onSubmit={handleSaveAssessment} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-5 text-xs">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <FileText className="w-4 h-4 text-brand-600" />
            <span>بيانات المقياس والدرجات المعيارية المحسوبة</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المقياس / الأداة التشخيصية *</label>
              <input
                type="text"
                required
                value={testUsed}
                onChange={(e) => setTestUsed(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الدرجة الخام (Raw Score):</label>
              <input
                type="number"
                value={rawScore}
                onChange={(e) => setRawScore(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الدرجة المعيارية الكلية (Standard Score):</label>
              <input
                type="number"
                value={standardScore}
                onChange={(e) => handleStandardScoreChange(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الرتبة المئينية التقديرية (Percentile Rank):</label>
              <div className="px-3.5 py-2.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl font-mono font-extrabold text-purple-700 dark:text-purple-300 text-sm">
                %{percentileRank}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تصنيف DSM-5 / ICD-11 المعياري *</label>
              <select
                value={dsmCode}
                onChange={(e) => setDsmCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:ring-2 focus:ring-purple-500"
              >
                <option value="F84.0 - Autism Spectrum Disorder (Level 1)">F84.0 - اضطراب طيف التوحد (المستوى الأول - يحتاج دعم)</option>
                <option value="F84.0 - Autism Spectrum Disorder (Level 2)">F84.0 - اضطراب طيف التوحد (المستوى الثاني - يحتاج دعم مكثف)</option>
                <option value="F81.0 - Specific Learning Disorder with impairment in reading">F81.0 - صعوبة تعلم محددة في القراءة (Dyslexia)</option>
                <option value="F81.2 - Specific Learning Disorder with impairment in mathematics">F81.2 - صعوبة تعلم محددة في الحساب (Dyscalculia)</option>
                <option value="F90.2 - ADHD Combined Presentation">F90.2 - فرط الحركة وتشتت الانتباه (النمط المشترك)</option>
                <option value="F70 - Mild Intellectual Disability">F70 - إعاقة فكرية بسيطة</option>
                <option value="F80.1 - Expressive Language Disorder">F80.1 - اضطراب اللغة التعبيرية والتواصل</option>
                <option value="Z03.89 - Gifted and Talented Identification">Z03.89 - تشخيص الموهبة والتفوق العقلي</option>
              </select>
            </div>
          </div>

          {/* Subdomain composite scores */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">درجات المؤشرات والمجالات الفرعية (Sub-Indices):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">القدرة اللفظية:</label>
                <input
                  type="number"
                  value={verbalScore}
                  onChange={(e) => setVerbalScore(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">القدرة البصرية المكانية:</label>
                <input
                  type="number"
                  value={nonVerbalScore}
                  onChange={(e) => setNonVerbalScore(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">الذاكرة العاملة:</label>
                <input
                  type="number"
                  value={workingMemoryScore}
                  onChange={(e) => setWorkingMemoryScore(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">سرعة المعالجة:</label>
                <input
                  type="number"
                  value={processingSpeedScore}
                  onChange={(e) => setProcessingSpeedScore(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الخلاصة الإكلينيكية والتشخيصية للجلسة *</label>
            <textarea
              rows={4}
              required
              value={clinicalSummary}
              onChange={(e) => setClinicalSummary(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 leading-relaxed font-medium"
            />
          </div>

          {/* Strengths and Needs Manager */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Strengths */}
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-2xl space-y-2">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 block">نقاط القوة النمائية والأكاديمية:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="أضف نقطة قوة..."
                  value={newStrength}
                  onChange={(e) => setNewStrength(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddStrength}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1.5 pt-1">
                {strengths.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-900 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <span className="text-emerald-950 dark:text-emerald-200">{s}</span>
                    <button
                      type="button"
                      onClick={() => setStrengths(strengths.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs */}
            <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl space-y-2">
              <span className="font-bold text-amber-900 dark:text-amber-200 block">احتياجات الدعم والتأهيل:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="أضف احتياج تأهيلي..."
                  value={newNeed}
                  onChange={(e) => setNewNeed(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddNeed}
                  className="px-3 py-1.5 bg-amber-600 text-white rounded-xl font-bold shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1.5 pt-1">
                {needs.map((n, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] bg-white dark:bg-slate-900 p-2 rounded-xl border border-amber-200 dark:border-amber-800">
                    <span className="text-amber-950 dark:text-amber-200">{n}</span>
                    <button
                      type="button"
                      onClick={() => setNeeds(needs.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href={`/requests/${request.id}`}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>حفظ نتائج الجلسة والتحويل لمسودة التقرير</span>
          </button>
        </div>
      </form>
    </div>
  );
}
