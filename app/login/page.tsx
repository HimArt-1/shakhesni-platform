'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import {
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Lock,
  Building2,
  UserCheck,
  ChevronLeft,
} from 'lucide-react';

export default function NafathLoginPage() {
  const router = useRouter();
  const { users, currentUser, setCurrentUser } = useStore();

  const [step, setStep] = useState<'ENTER_ID' | 'NAFATH_PROMPT' | 'SUCCESS'>('ENTER_ID');
  const [nationalId, setNationalId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [randomVerificationCode, setRandomVerificationCode] = useState(42);
  const [countdown, setCountdown] = useState(60);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'APP_PROMPT' | 'SMS_OTP'>('APP_PROMPT');
  const [smsOtp, setSmsOtp] = useState('');

  // Generate random 2-digit verification code
  const generateRandomCode = () => {
    return Math.floor(Math.random() * 89) + 10;
  };

  // Handle entering ID
  const handleProceedToNafath = (idToUse?: string) => {
    const targetId = idToUse || nationalId.trim();
    if (!targetId || targetId.length !== 10) {
      setErrorMsg('يرجى إدخال رقم هوية وطنية أو إقامة صحيح مكون من 10 أرقام');
      return;
    }

    const matchedUser = users.find((u) => u.nationalId === targetId);
    if (!matchedUser) {
      setErrorMsg('رقم الهوية غير مسجل في منظومة شخّصني. يرجى اختيار أحد الحسابات المعتمدة أدناه.');
      return;
    }

    setSelectedUser(matchedUser);
    setErrorMsg('');
    setRandomVerificationCode(generateRandomCode());
    setCountdown(60);
    setStep('NAFATH_PROMPT');
  };

  // Quick Persona Select
  const handleQuickSelect = (user: any) => {
    setNationalId(user.nationalId || '');
    handleProceedToNafath(user.nationalId);
  };

  // Timer countdown
  useEffect(() => {
    let timer: any;
    if (step === 'NAFATH_PROMPT' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && step === 'NAFATH_PROMPT') {
      setErrorMsg('انتهت مهلة الطلب، يرجى إعادة المحاولة.');
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Complete Authentication
  const handleApproveAuth = () => {
    if (selectedUser) {
      setCurrentUser(selectedUser);
      setStep('SUCCESS');
      setTimeout(() => {
        router.push('/requests');
      }, 1500);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-8 px-4 sm:px-6">
      {/* Background Glow */}
      <div className="absolute top-1/4 -z-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-xl">
        {/* Nafath Official Brand Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 text-center relative">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20 shadow-inner">
              <ShieldCheck className="w-9 h-9 text-emerald-300" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">بوابة النفاذ الوطني الموحد (نفاذ)</h1>
            <p className="text-xs text-emerald-100 mt-1 font-medium">
              تسجيل الدخول الرقمي الموحد لمنصة شخّصني لتشخيص الطلاب ذوي الإعاقة
            </p>
            <div className="absolute top-4 left-4 text-[10px] bg-emerald-950/60 border border-emerald-400/30 px-2.5 py-1 rounded-full text-emerald-200 font-mono">
              Gov SSO 2.0
            </div>
          </div>

          {/* Body content based on step */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* STEP 1: Enter National ID */}
            {step === 'ENTER_ID' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    رقم الهوية الوطنية / الإقامة
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={10}
                      value={nationalId}
                      onChange={(e) => {
                        setNationalId(e.target.value.replace(/\D/g, ''));
                        setErrorMsg('');
                      }}
                      placeholder="أدخل رقم الهوية المكون من 10 أرقام (مثال: 1011223344)"
                      className="w-full px-4 py-3.5 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-mono text-base font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <KeyRound className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                  {errorMsg && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mt-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleProceedToNafath()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-lg shadow-emerald-600/25"
                >
                  <span>تسجيل الدخول عبر نفاذ</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Quick Persona Selector for Testing */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>اختيار سريع لحسابات النظام التجريبية:</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">اضغط للدخول المباشر</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleQuickSelect(u)}
                        className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 rounded-xl text-right transition-all flex items-center gap-2.5 group"
                      >
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700"
                        />
                        <div className="overflow-hidden flex-1">
                          <div className="font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 truncate">
                            {u.name}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">{u.roleArabic}</div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          {u.nationalId?.slice(-4)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Nafath App Prompt Verification */}
            {step === 'NAFATH_PROMPT' && (
              <div className="space-y-6 text-center">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full inline-block">
                    طلب مصادقة نفاذ قيد المعالجة
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 pt-2">
                    الرجاء فتح تطبيق نفاذ وتأكيد الرقم
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    تم إرسال إشعار فوري إلى هاتفك المحمول المسجل. افتح تطبيق نفاذ واختر الرقم أدناه لإتمام الدخول:
                  </p>
                </div>

                {/* Big 2-Digit Verification Display */}
                <div className="py-6 flex flex-col items-center justify-center">
                  <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border-4 border-emerald-500 shadow-xl shadow-emerald-500/20 animate-pulse">
                    <span className="text-6xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tighter">
                      {randomVerificationCode}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <ClockIcon className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span>متبقي على انتهاء الصلاحية: </span>
                    <strong className="font-mono text-emerald-600 font-bold">{countdown} ثانية</strong>
                  </div>
                </div>

                {/* Simulated Persona Target info */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs flex items-center justify-between text-right">
                  <div className="flex items-center gap-2">
                    <img src={selectedUser?.avatarUrl} alt="" className="w-8 h-8 rounded-lg" />
                    <div>
                      <div className="font-extrabold text-slate-800 dark:text-slate-200">{selectedUser?.name}</div>
                      <div className="text-[10px] text-slate-500">{selectedUser?.roleArabic}</div>
                    </div>
                  </div>
                  <div className="text-left font-mono text-[11px] text-slate-500">
                    <div>الهوية: {selectedUser?.nationalId}</div>
                  </div>
                </div>

                {/* Simulation Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleApproveAuth}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all shadow-lg shadow-emerald-600/30"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>محاكاة قبول وتأكيد الطلب في تطبيق نفاذ</span>
                  </button>

                  <button
                    onClick={() => setStep('ENTER_ID')}
                    className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    إلغاء والعودة لشاشة رقم الهوية
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Success Screen */}
            {step === 'SUCCESS' && (
              <div className="py-10 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 border-4 border-emerald-500 animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">تم التحقق والمصادقة بنجاح!</h3>
                  <p className="text-xs text-slate-500">
                    مرحباً بك <strong>{selectedUser?.name}</strong> ({selectedUser?.roleArabic}). جاري توجيهك للمنصة...
                  </p>
                </div>
                <div className="w-32 h-1.5 bg-emerald-200 dark:bg-emerald-900 rounded-full mx-auto overflow-hidden">
                  <div className="h-full bg-emerald-600 animate-pulse w-full" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Trust Badges */}
        <div className="mt-6 text-center text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-center gap-4 text-[11px] font-medium">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>تشفير 256-bit آمن</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>هيئة الحكومة الرقمية (DGA)</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>النفاذ الوطني الموحد</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
