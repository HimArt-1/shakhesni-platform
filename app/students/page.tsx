'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { INITIAL_STUDENTS } from '@/lib/mock-data';
import { Users, Search, UserCheck, Phone, Mail, GraduationCap, FileText } from 'lucide-react';
import Link from 'next/link';

export default function StudentsPage() {
  const { requests } = useStore();
  const [search, setSearch] = useState('');

  const students = INITIAL_STUDENTS.filter(
    (s) => s.fullName.includes(search) || s.nationalId.includes(search) || s.parentName.includes(search)
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            <span>السجل الموحد للطلاب وأولياء الأمور</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            متابعة الملفات الشخصية والتعليمية للطلاب والتاريخ الطبي لطلبات التشخيص المرفقة
          </p>
        </div>

        <div className="relative w-full sm:w-72 text-xs">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="البحث باسم الطالب، الهوية أو ولي الأمر..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
          />
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((std) => {
          const studentReqs = requests.filter((r) => r.studentId === std.id || r.student.fullName === std.fullName);

          return (
            <div
              key={std.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${std.fullName}&backgroundColor=b6e3f4,ffd5dc,c0aede`}
                      alt={std.fullName}
                      className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                    <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      {std.fullName}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                    {std.gender === 'MALE' ? 'ذكر' : 'أنثى'} • {std.ageYears} سنوات
                  </span>
                </div>

                <div className="space-y-1 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>الصف: <strong>{std.grade}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>ولي الأمر: <strong>{std.parentName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>الهاتف: {std.parentPhone}</span>
                  </div>
                </div>

                {std.medicalConditions && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                    <strong>الحالة الطبية:</strong> {std.medicalConditions}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">الطلبات المسجلة: ({studentReqs.length})</span>
                {studentReqs[0] && (
                  <Link
                    href={`/requests/${studentReqs[0].id}`}
                    className="text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    <span>معاينة الطلب النشط</span>
                    <FileText className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
