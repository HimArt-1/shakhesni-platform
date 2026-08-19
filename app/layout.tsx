import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { StoreProvider } from '@/lib/store-context';
import { RoleSwitcherBar } from '@/components/role-switcher';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { PWAInstallBanner } from '@/components/pwa-install-banner';

export const metadata: Metadata = {
  title: 'شخّصني | منصة تشخيص الطلاب ذوي الإعاقة المتكاملة',
  description: 'نظام مؤسسي ذكي لإدارة رحلة طلبات تشخيص وتقييم الطلاب ذوي الإعاقة، وإعداد الخطة التربوية الفردية والمعاينة المعتمدة.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <StoreProvider>
            <div className="flex flex-col min-h-screen">
              {/* PWA Install Notification Bar */}
              <PWAInstallBanner />

              {/* Persona Switcher Top Bar */}
              <RoleSwitcherBar />

              {/* Main Application Layout */}
              <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                  <Header />
                  <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                  </main>
                </div>
              </div>
            </div>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
