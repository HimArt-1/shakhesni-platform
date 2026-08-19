'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store-context';
import { useTheme } from 'next-themes';
import {
  Bell,
  Search,
  Moon,
  Sun,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  MessageSquare,
  Command,
  X,
} from 'lucide-react';
import { AIAssistantModal } from '../ai-assistant-modal';
import { CommunicationHubModal } from '../communication-hub-modal';
import { CommandPalette } from '../command-palette';

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { notifications, markNotificationRead, currentUser, requests } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showCommsModal, setShowCommsModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Listen for Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between gap-4 sticky top-0 z-40 shadow-sm transition-colors print:hidden">
        {/* Quick Global Search Trigger for Command Palette */}
        <div className="relative flex-1 max-w-md">
          <button
            type="button"
            onClick={() => setShowCommandPalette(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-400 transition-all text-right"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>ابحث عن طالب، رقم طلب (SHK-...)، أو إجراء سريع...</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] bg-white dark:bg-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-600 font-bold">
              <span>⌘</span>
              <span>K</span>
            </div>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Parent Communication Hub Trigger */}
          <button
            onClick={() => setShowCommsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-xs font-bold shadow-sm hover:bg-emerald-100 transition-all"
            title="مركز مراسلات أولياء الأمور (SMS & WhatsApp)"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">مركز المراسلات</span>
          </button>

          {/* AI Assistant Quick Trigger */}
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-sm hover:shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">مساعد الذكاء الاصطناعي</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="تبديل الوضع الداكن/الفاتح"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotifications && (
              <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-brand-500" />
                    مركز الإشعارات والتنبيهات
                  </h4>
                  <span className="text-[10px] bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} غير مقروء
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        n.isRead
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          : 'bg-brand-50/70 dark:bg-brand-950/40 border-brand-200 dark:border-brand-800/60 text-slate-900 dark:text-slate-100 font-medium shadow-sm'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between text-slate-800 dark:text-slate-200 mb-0.5">
                        <span>{n.title}</span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(n.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      {showAIModal && <AIAssistantModal onClose={() => setShowAIModal(false)} />}
      {showCommsModal && <CommunicationHubModal onClose={() => setShowCommsModal(false)} />}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onOpenAI={() => setShowAIModal(true)}
        onOpenComms={() => setShowCommsModal(true)}
      />
    </>
  );
};
