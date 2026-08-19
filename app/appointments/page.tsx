'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, PlusCircle } from 'lucide-react';

export default function AppointmentsPage() {
  const { requests, scheduleAppointment, updateAppointmentStatus } = useStore();
  const [selectedStudentReqId, setSelectedStudentReqId] = useState(requests[0]?.id || '');
  const [specialistName, setSpecialistName] = useState('أ. سارة (أخصائية نفسية)');
  const [date, setDate] = useState('2026-08-05');
  const [timeSlot, setTimeSlot] = useState('09:00 ص - 10:30 ص');
  const [notes, setNotes] = useState('جلسة تطبيق مقياس وكسلر لذكاء الأطفال WISC-V');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Extract all scheduled appointments across requests
  const allAppointments = requests.flatMap((r) => r.appointments || []);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const targetReq = requests.find((r) => r.id === selectedStudentReqId);

    // Anti-conflict check
    const hasConflict = allAppointments.some(
      (a) => a.date === date && a.timeSlot === timeSlot && a.specialistName === specialistName
    );

    if (hasConflict) {
      setFeedback('⚠️ تعارض في الموعد! الأخصائي المختار لديه جلسة أخرى محجوزة في نفس التوقيت والتاريخ.');
      return;
    }

    scheduleAppointment({
      requestId: selectedStudentReqId,
      studentName: targetReq?.student.fullName || 'طالب',
      specialistName,
      specialization: 'التقييم التشخيصي الشامل',
      date,
      timeSlot,
      notes,
    });

    setFeedback('✅ تم حجز الموعد وتأكيده بنجاح دون أي تعارض زمني!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Title Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-brand-600" />
            <span>إدارة المواعيد والتقويم ومنع التعارض</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            جدولة جلسات التشخيص والتقييم، تخصيص القاعات والأخصائيين، وتسجيل مصفوفة الحضور (Attended / No-Show)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Booking Form */}
        <form onSubmit={handleBooking} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4 text-xs">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <PlusCircle className="w-4 h-4 text-brand-600" />
            <span>حجز موعد تشخيصي جديد</span>
          </h3>

          {feedback && (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[11px] animate-in fade-in">
              {feedback}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الطالب / رقم الطلب *</label>
              <select
                value={selectedStudentReqId}
                onChange={(e) => setSelectedStudentReqId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              >
                {requests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.student.fullName} ({r.requestNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الأخصائي المعين *</label>
              <select
                value={specialistName}
                onChange={(e) => setSpecialistName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              >
                <option value="أ. سارة (أخصائية نفسية)">أ. سارة (أخصائية نفسية)</option>
                <option value="أ. محمد (نطق)">أ. محمد (أخصائي نطق وتواصل)</option>
                <option value="د. عبد الله (استشاري)">د. عبد الله (استشاري تشخيص)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ الجلسة *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الفترة الزمنية *</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              >
                <option value="09:00 ص - 10:30 ص">09:00 ص - 10:30 ص</option>
                <option value="10:30 ص - 12:00 م">10:30 ص - 12:00 م</option>
                <option value="01:00 م - 02:30 م">01:00 م - 02:30 م</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-all"
          >
            تثبيت وحجز الموعد
          </button>
        </form>

        {/* Scheduled Appointments List & Attendance Matrix */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>جدول المواعيد ومصفوفة تسجيل الحضور ({allAppointments.length})</span>
            </span>
          </h3>

          <div className="space-y-3">
            {allAppointments.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>{app.studentName}</span>
                    <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                      {app.date} | {app.timeSlot}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    الأخصائي: <strong>{app.specialistName}</strong> ({app.specialization})
                  </div>
                  {app.notes && <div className="text-slate-400 italic text-[11px]">{app.notes}</div>}
                </div>

                <div className="flex items-center gap-2">
                  {app.status === 'ATTENDED' ? (
                    <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1.5 rounded-xl font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      حـضـر الجلسة
                    </span>
                  ) : app.status === 'NO_SHOW' ? (
                    <span className="flex items-center gap-1 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-3 py-1.5 rounded-xl font-bold">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      لم يحضر (غائب)
                    </span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateAppointmentStatus(app.id, 'ATTENDED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                      >
                        تسجيل حضور
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(app.id, 'NO_SHOW')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors"
                      >
                        لم يحضر
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
