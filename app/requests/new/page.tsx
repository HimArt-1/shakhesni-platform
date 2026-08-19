'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { useRouter } from 'next/navigation';
import {
  FileText,
  User,
  School as SchoolIcon,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function NewRequestWizardPage() {
  const router = useRouter();
  const { createNewRequest, currentUser } = useStore();
  const [step, setStep] = useState(1);

  // Form State
  const [nationalId, setNationalId] = useState('1098237465');
  const [studentName, setStudentName] = useState('خالد سلمان الشهري');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [birthDate, setBirthDate] = useState('2018-05-15');
  const [grade, setGrade] = useState('الصف الثاني الابتدائي');

  const [schoolName, setSchoolName] = useState('مدرسة الأمل النموذجية الابتدائية');
  const [counselorPhone, setCounselorPhone] = useState('0508901234');
  const [parentName, setParentName] = useState('سلمان بن محمد الشهري');
  const [parentPhone, setParentPhone] = useState('0501239876');

  const [category, setCategory] = useState<'AUTISM' | 'LEARNING_DISABILITY' | 'ADHD' | 'INTELLECTUAL' | 'SPEECH_LANGUAGE'>('AUTISM');
  const [priority, setPriority] = useState<'EMERGENT' | 'HIGH' | 'NORMAL' | 'LOW'>('HIGH');
  const [medicalNotes, setMedicalNotes] = useState('ملاحظة تأخر لغوي ملحوظ وفرط حركة مع تشتت في البيئة المدرسية');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryArabicMap = {
      AUTISM: 'اشتباه اضطراب طيف التوحد',
      LEARNING_DISABILITY: 'صعوبات التعلم',
      ADHD: 'فرط الحركة وتشتت الانتباه',
      INTELLECTUAL: 'الإعاقة الفكرية',
      SPEECH_LANGUAGE: 'اضطرابات النطق والتواصل',
    };

    const newReq = createNewRequest({
      student: {
        id: `std-${Date.now()}`,
        nationalId,
        fullName: studentName,
        gender,
        birthDate,
        ageYears: 8,
        grade,
        schoolId: 'school-1',
        schoolName,
        parentId: currentUser.id,
        parentName,
        parentPhone,
        parentEmail: 'parent@shakhesni.sa',
        medicalConditions: medicalNotes,
      },
      schoolId: 'school-1',
      schoolName,
      primaryCategory: category,
      primaryCategoryArabic: categoryArabicMap[category],
      priority,
      documents: [
        {
          id: `doc-${Date.now()}`,
          requestId: '',
          title: 'التقرير الطبي الأولي وصورة الهوية',
          category: 'MEDICAL_REPORT',
          fileUrl: '/docs/sample_medical.pdf',
          fileName: 'initial_medical_report.pdf',
          fileSize: '2.4 MB',
          uploadedBy: currentUser.name,
          uploadedAt: new Date().toISOString(),
          isVerified: false,
        },
      ],
    });

    router.push(`/requests/${newReq.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FileText className="w-6 h-6 text-brand-600" />
          <span>معالج تقديم طلب تشخيص جديد (New Diagnosis Wizard)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          قم بتعبئة بيانات الطالب وولي الأمر وإرفاق المستندات للبدء في مراجعة الطلب وحساب الـ SLA
        </p>
      </div>

      {/* Stepper Progress Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center justify-between text-xs font-bold">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-brand-600' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center font-bold">1</span>
          <span>بيانات الطالب</span>
        </div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-brand-600' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center font-bold">2</span>
          <span>المدرسة وولي الأمر</span>
        </div>
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-brand-600' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center font-bold">3</span>
          <span>فئة التشخيص والأولوية</span>
        </div>
        <div className={`flex items-center gap-2 ${step >= 4 ? 'text-brand-600' : 'text-slate-400'}`}>
          <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center font-bold">4</span>
          <span>إرفاق المستندات</span>
        </div>
      </div>

      {/* Wizard Form Body */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Student Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                الخطوة 1: البيانات الأساسية للطالب
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رقم الهوية الوطنية / الإقامة *
                  </label>
                  <input
                    type="text"
                    required
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الاسم الرباعي للطالب *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الجنس *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="MALE">ذكر</option>
                    <option value="FEMALE">أنثى</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ الميلاد *</label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الصف الدراسي *</label>
                  <input
                    type="text"
                    required
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: School & Parent */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                الخطوة 2: معلومات المدرسة وولي الأمر
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المدرسة *</label>
                  <input
                    type="text"
                    required
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">هاتف المرشد الطلابي *</label>
                  <input
                    type="text"
                    required
                    value={counselorPhone}
                    onChange={(e) => setCounselorPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اسم ولي الأمر الثلاثي *</label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الجوال لتلقي التنبيهات (SMS) *</label>
                  <input
                    type="text"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Diagnostic Category & Priority */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                الخطوة 3: تحديد نوع التشخيص المبدئي ومستوى الأولوية
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">فئة الإعاقة أو الاضطراب المشتبه *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="AUTISM">اشتباه اضطراب طيف التوحد</option>
                    <option value="LEARNING_DISABILITY">صعوبات التعلم المحددة</option>
                    <option value="ADHD">فرط الحركة وتشتت الانتباه</option>
                    <option value="INTELLECTUAL">الإعاقة الفكرية النمائية</option>
                    <option value="SPEECH_LANGUAGE">اضطرابات النطق والتواصل</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">درجة الأولوية (SLA) *</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="EMERGENT">عاجل جداً (48 ساعة - التدخل السريع)</option>
                    <option value="HIGH">عالي (5 أيام)</option>
                    <option value="NORMAL">عادي (10 أيام)</option>
                    <option value="LOW">منخفض (15 يوم)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الملاحظات الطبية والسلوكية الأولية</label>
                  <textarea
                    rows={3}
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Attachments Upload */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                الخطوة 4: إرفاق المستندات والوثائق المطلوبة
              </h3>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-800/20 space-y-3">
                <Upload className="w-10 h-10 text-brand-500 mx-auto" />
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  قم بسحب وإسقاط ملفات PDF أو الصور الطبية هنا
                </h4>
                <p className="text-[11px] text-slate-500">
                  تشمل: صورة الهوية الوطنية، التقرير الطبي للسمع والبصر، نموذج تحويل المرشد الطلابي
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم إرفاق: initial_medical_report.pdf (2.4 MB)</span>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Controls Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                <span>الخطوة السابقة</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/30"
              >
                <span>الخطوة التالية</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>إرسال الطلب واعتماده بمحرك الحالات</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
