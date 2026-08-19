'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import {
  Search,
  FileText,
  Calendar,
  BarChart3,
  Building2,
  GraduationCap,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Command,
  X,
  User,
} from 'lucide-react';

interface CommandItem {
  id: string;
  category: 'صفحات النظام' | 'طلبات التشخيص' | 'إجراءات سريعة';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onOpenAI: () => void;
  onOpenComms: () => void;
}> = ({ isOpen, onClose, onOpenAI, onOpenComms }) => {
  const router = useRouter();
  const { requests } = useStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // System pages
  const pageCommands: CommandItem[] = [
    {
      id: 'p-home',
      category: 'صفحات النظام',
      title: 'لوحة التحكم الرئيسية',
      subtitle: 'نظرة عامة على الإحصائيات وسير العمل',
      icon: <BarChart3 className="w-4 h-4 text-brand-600" />,
      action: () => {
        router.push('/dashboard');
        onClose();
      },
    },
    {
      id: 'p-requests',
      category: 'صفحات النظام',
      title: 'سجل طلبات التشخيص الموحدة',
      subtitle: 'عرض وفلترة وتصدير جميع الطلبات',
      icon: <FileText className="w-4 h-4 text-brand-600" />,
      action: () => {
        router.push('/requests');
        onClose();
      },
    },
    {
      id: 'p-new-req',
      category: 'صفحات النظام',
      title: 'تقديم طلب تشخيص جديد',
      subtitle: 'معالج تقديم الطلب من المدرسة أو ولي الأمر',
      icon: <FileText className="w-4 h-4 text-emerald-600" />,
      action: () => {
        router.push('/requests/new');
        onClose();
      },
    },
    {
      id: 'p-appointments',
      category: 'صفحات النظام',
      title: 'جدول المواعيد ومصفوفة الحضور',
      subtitle: 'حجز جلسات التقييم ومنع التعارض',
      icon: <Calendar className="w-4 h-4 text-purple-600" />,
      action: () => {
        router.push('/appointments');
        onClose();
      },
    },
    {
      id: 'p-analytics',
      category: 'صفحات النظام',
      title: 'اللوحات التحليلية ومؤشرات SLA',
      subtitle: 'مؤشرات الأداء المؤسسي وتوزيع الإعاقات',
      icon: <BarChart3 className="w-4 h-4 text-amber-600" />,
      action: () => {
        router.push('/analytics');
        onClose();
      },
    },
    {
      id: 'p-centers',
      category: 'صفحات النظام',
      title: 'دليل مراكز التشخيص المعتمدة',
      subtitle: 'المراكز المعتمدة والقدرة الاستيعابية',
      icon: <Building2 className="w-4 h-4 text-blue-600" />,
      action: () => {
        router.push('/centers');
        onClose();
      },
    },
  ];

  // Quick Action Commands
  const actionCommands: CommandItem[] = [
    {
      id: 'act-ai',
      category: 'إجراءات سريعة',
      title: 'مساعد الذكاء الاصطناعي المساند (AI Copilot)',
      subtitle: 'فحص OCR للمستندات، اكتشاف التناقضات، واقتراح التوصيات',
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      action: () => {
        onClose();
        onOpenAI();
      },
    },
    {
      id: 'act-comms',
      category: 'إجراءات سريعة',
      title: 'مركز مراسلات أولياء الأمور (SMS & WhatsApp)',
      subtitle: 'إشعار ولي الأمر بالمواعيد والتقارير المعتمدة',
      icon: <MessageSquare className="w-4 h-4 text-emerald-600" />,
      action: () => {
        onClose();
        onOpenComms();
      },
    },
  ];

  // Request Commands
  const requestCommands: CommandItem[] = requests.map((r) => ({
    id: `req-${r.id}`,
    category: 'طلبات التشخيص',
    title: `${r.student.fullName} (${r.requestNumber})`,
    subtitle: `${r.primaryCategoryArabic} • ${r.schoolName} • [${r.statusArabic}]`,
    icon: <User className="w-4 h-4 text-brand-600" />,
    action: () => {
      router.push(`/requests/${r.id}`);
      onClose();
    },
  }));

  const allCommands = [...pageCommands, ...actionCommands, ...requestCommands];

  const filteredCommands = query.trim()
    ? allCommands.filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(query.toLowerCase()) ||
          cmd.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث عن صفحة، طالب، رقم طلب، أو إجراء سريع..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Items List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 text-xs">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.id}
                onClick={cmd.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-colors ${
                  selectedIndex === idx
                    ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-900 dark:text-brand-100'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">{cmd.icon}</div>
                  <div>
                    <div className="font-bold">{cmd.title}</div>
                    {cmd.subtitle && <div className="text-[11px] text-slate-400">{cmd.subtitle}</div>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                    {cmd.category}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">لا توجد نتائج مطابقة لـ "{query}"</div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>استخدم الأسهم <strong>↑</strong> <strong>↓</strong> للتنقل</span>
            <span>•</span>
            <span>اضغط <strong>Enter</strong> للاختيار</span>
            <span>•</span>
            <span>اضغط <strong>Esc</strong> للإغلاق</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>
    </div>
  );
};
