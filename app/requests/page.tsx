'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { REQUEST_STATES } from '@/lib/state-machine';
import { calculateSLA } from '@/lib/sla-calculator';
import { RequestStatus, PriorityLevel } from '@/types/database';
import {
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpLeft,
  Calendar,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function RequestListPage() {
  const { requests, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Filter Logic
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.student.fullName.includes(searchTerm) ||
      r.student.nationalId.includes(searchTerm) ||
      r.requestNumber.includes(searchTerm) ||
      r.schoolName.includes(searchTerm);

    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    const matchesPriority = selectedPriority === 'ALL' || r.priority === selectedPriority;
    const matchesCategory = selectedCategory === 'ALL' || r.primaryCategory === selectedCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const exportExcelSimulator = () => {
    const clean = (val: any) => `"${String(val || '').replace(/"/g, '""')}"`;
    const headers = ['رقم الطلب', 'اسم الطالب', 'الهوية الوطنية', 'المدرسة', 'نوع التشخيص', 'الحالة', 'الأولوية', 'تاريخ التقديم'];
    
    const rows = filteredRequests.map((r) => [
      clean(r.requestNumber),
      clean(r.student.fullName),
      clean(r.student.nationalId),
      clean(r.schoolName),
      clean(r.primaryCategoryArabic),
      clean(r.statusArabic),
      clean(r.priority),
      clean(r.createdAt),
    ].join(','));

    const csvContent = '\uFEFF' + headers.map(clean).join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `shakhesni_requests_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            <span>إدارة ومتابعة طلبات التشخيص الموحدة</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            سجل شامل ومباشر لجميع الحالات ومحرك الحالات التشغيلية ومستوى الـ SLA
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportExcelSimulator}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>تصدير البيانات Excel (CSV)</span>
          </button>

          <Link
            href="/requests/new"
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-all shadow-md shadow-brand-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>تقديم طلب جديد</span>
          </Link>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>أدوات الفلترة والبحث المتقدم:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث بالاسم، الهوية، الطلب أو المدرسة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="ALL">جميع الحالات (19 حالة)</option>
              <option value="SUBMITTED">مُقدّم (جديد)</option>
              <option value="DOC_REVIEW">مراجعة المستندات</option>
              <option value="DOCS_INCOMPLETE">مستندات ناقصة (SLA متوقف)</option>
              <option value="TEAM_ASSIGNED">تعيين الفريق</option>
              <option value="UNDER_EVALUATION">تحت التقييم والتشخيص</option>
              <option value="TEAM_LEADER_REVIEW">مراجعة رئيس الفريق</option>
              <option value="APPROVED">معتمد رسمياً</option>
              <option value="DELIVERED">تم التسليم</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="ALL">جميع مستويات الأولوية</option>
              <option value="EMERGENT">عاجل جداً (Emergent - 48 ساعة)</option>
              <option value="HIGH">عالي (High - 5 أيام)</option>
              <option value="NORMAL">عادي (Normal - 10 أيام)</option>
              <option value="LOW">منخفض (Low - 15 يوم)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 font-medium"
            >
              <option value="ALL">جميع فئات الإعاقة والتشخيص</option>
              <option value="AUTISM">اشتباه اضطراب طيف التوحد</option>
              <option value="LEARNING_DISABILITY">صعوبات التعلم</option>
              <option value="ADHD">فرط الحركة وتشتت الانتباه</option>
              <option value="INTELLECTUAL">الإعاقة الفكرية</option>
              <option value="SPEECH_LANGUAGE">اضطرابات النطق والتواصل</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 select-none">
              <tr>
                <th className="p-4">رقم الطلب والتاريخ</th>
                <th className="p-4">اسم الطالب والهوية</th>
                <th className="p-4">المدرسة والمنطقة</th>
                <th className="p-4">فئة التشخيص</th>
                <th className="p-4">حالة الطلب</th>
                <th className="p-4">الأولوية والـ SLA</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((r) => {
                  const sla = calculateSLA(r.createdAt, r.priority, r.status, r.statusHistory);
                  const meta = REQUEST_STATES[r.status];

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-extrabold text-brand-600 dark:text-brand-400 block text-xs">
                          {r.requestNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {new Date(r.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 block">
                          {r.student.fullName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          هوية: {r.student.nationalId}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {r.schoolName}
                        </span>
                        <span className="text-[10px] text-slate-500">{r.student.grade}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          {r.primaryCategoryArabic}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${meta.badgeClass}`}>
                          {meta.arabicName}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 block">
                            أولوية: {r.priority === 'EMERGENT' ? 'عاجل جداً' : r.priority === 'HIGH' ? 'عالي' : 'عادي'}
                          </span>
                          <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                sla.isPaused
                                  ? 'bg-amber-400'
                                  : sla.isBreached
                                  ? 'bg-rose-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${sla.percentageUsed}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {sla.isPaused ? 'SLA متوقف' : `متبقي ${sla.daysRemaining}d`}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <Link
                          href={`/requests/${r.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 hover:bg-brand-600 hover:text-white font-bold transition-all text-xs border border-brand-200 dark:border-brand-800"
                        >
                          <span>عرض وتحديث</span>
                          <ArrowUpLeft className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    لا توجد طلبات مطابقة لمعايير البحث المحددة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
