'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  if (pathname === '/' || pathname === '/login') return null;

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Register service worker if supported
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service Worker registration failed:', err);
      });
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert('لتثبيت التطبيق على جهازك: اضغط على خيارات المتصفح ثم اختر "إضافة إلى الشاشة الرئيسية (Add to Home Screen)"');
      setIsVisible(false);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-brand-700 to-indigo-900 text-white p-3 px-6 flex items-center justify-between text-xs shadow-md z-40 relative print:hidden">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
          <Smartphone className="w-4 h-4 text-amber-300" />
        </div>
        <div>
          <span className="font-extrabold block">تطبيق «شخّصني» الميداني متاح للتثبيت</span>
          <span className="text-[11px] text-brand-100">
            ثبّت التطبيق على جهازك للوصول الفوري والتقييم الإكلينيكي الميداني السريع
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-brand-900 font-bold rounded-xl shadow hover:bg-brand-50 transition-all text-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>تثبيت التطبيق الآن</span>
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-lg text-brand-200 hover:text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
