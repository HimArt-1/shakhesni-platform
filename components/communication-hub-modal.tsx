'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import {
  MessageSquare,
  Send,
  X,
  Phone,
  CheckCheck,
  Sparkles,
  Calendar,
  FileCheck,
  AlertCircle,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { ParentMessage } from '@/types/database';

interface TemplateOption {
  type: ParentMessage['templateType'];
  label: string;
  title: string;
  generateText: (studentName: string, reqNumber: string, centerName: string) => string;
}

const TEMPLATES: TemplateOption[] = [
  {
    type: 'APPOINTMENT_REMINDER',
    label: 'تأكيد وحجز موعد جلسة تشخيصية',
    title: 'تأكيد موعد التقييم التشخيصي',
    generateText: (student, reqNum, center) =>
      `عزيزي ولي أمر الطالب/ة (${student})، نفيدكم بجدولة جلسة التشخيص والتقييم لطلبكم رقم (${reqNum}) في (${center}) يوم الأحد القادم الساعة 09:00 صباحاً. نرجو الحضور قبل الموعد بـ 15 دقيقة مع إحضار أصل الهوية الوطنية. منصة شخّصني.`,
  },
  {
    type: 'REPORT_READY',
    label: 'صدور التقرير التشخيصي المعتمد',
    title: 'صدور التقرير التشخيصي المعتمد',
    generateText: (student, reqNum) =>
      `عزيزي ولي أمر الطالب/ة (${student})، يسرنا إشعاركم بصدور التقرير التشخيصي المعتمد رسمياً لطلبكم رقم (${reqNum}). يمكنكم الاطلاع على التقرير وتحميله أو التحقق من صحته عبر الرابط المعتمد: https://shakhesni.sa/verify/${reqNum} - منصة شخّصني.`,
  },
  {
    type: 'DOCUMENT_REQUEST',
    label: 'طلب استكمال مستندات أو تقارير طبية',
    title: 'مطلوب استكمال وثائق تشخيصية',
    generateText: (student, reqNum) =>
      `عزيزي ولي أمر الطالب/ة (${student})، لمتابعة دراسة طلب التشخيص رقم (${reqNum})، نرجو التكرم برفع التقرير الطبي الحديث أو تقرير السمع والبصر عبر بوابة ولي الأمر لاستكمال الإجراءات وتحديد الموعد. منصة شخّصني.`,
  },
  {
    type: 'STATUS_UPDATE',
    label: 'تحديث حالة دراسة الطلب',
    title: 'تحديث دراسة الحالة',
    generateText: (student, reqNum) =>
      `عزيزي ولي أمر الطالب/ة (${student})، تم استكمال دراسة التقييمات الإكلينيكية لطلبكم رقم (${reqNum}) وجاري إعداد مسودة الخطة الفردية تمهيداً للاعتماد النهائي. منصة شخّصني.`,
  },
];

export const CommunicationHubModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { requests, sendParentMessage } = useStore();
  const [selectedReqId, setSelectedReqId] = useState(requests[0]?.id || '');
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS'>('WHATSAPP');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption>(TEMPLATES[0]);

  const activeReq = requests.find((r) => r.id === selectedReqId) || requests[0];
  const studentName = activeReq?.student.fullName || 'طالب';
  const reqNum = activeReq?.requestNumber || 'SHK-2026';
  const centerName = activeReq?.referredCenterName || 'مركز التشخيص الموحد';

  const [messageTitle, setMessageTitle] = useState(selectedTemplate.title);
  const [messageContent, setMessageContent] = useState(
    selectedTemplate.generateText(studentName, reqNum, centerName)
  );
  const [parentPhone, setParentPhone] = useState(activeReq?.student.parentPhone || '0551234567');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSelectTemplate = (tmpl: TemplateOption) => {
    setSelectedTemplate(tmpl);
    setMessageTitle(tmpl.title);
    setMessageContent(tmpl.generateText(studentName, reqNum, centerName));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      sendParentMessage({
        requestId: activeReq.id,
        studentName,
        parentPhone,
        channel,
        templateType: selectedTemplate.type,
        title: messageTitle,
        content: messageContent,
      });

      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3500);
    }, 1000);
  };

  const existingMessages = activeReq?.parentMessages || [];

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base flex items-center gap-2">
                مركز إشعارات ومراسلات أولياء الأمور (SMS & WhatsApp Hub)
              </h3>
              <p className="text-xs text-emerald-200">إشعار ولي الأمر آلياً بالمواعيد، الوثائق، والتقارير المعتمدة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-emerald-200 hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {sentSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold rounded-2xl border border-emerald-300 flex items-center gap-2 animate-in fade-in-50">
              <CheckCheck className="w-5 h-5 text-emerald-600" />
              <span>تم إرسال الرسالة وتسليمها بنجاح لهاتف ولي الأمر ({parentPhone}) عبر قناة ({channel === 'WHATSAPP' ? 'الواتساب' : 'SMS'})!</span>
            </div>
          )}

          {/* Student Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">اختر الطلب / الطالب المستهدف:</label>
              <select
                value={selectedReqId}
                onChange={(e) => {
                  setSelectedReqId(e.target.value);
                  const req = requests.find((r) => r.id === e.target.value);
                  if (req) {
                    setParentPhone(req.student.parentPhone);
                    setMessageContent(selectedTemplate.generateText(req.student.fullName, req.requestNumber, req.referredCenterName || ''));
                  }
                }}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
              >
                {requests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.student.fullName} ({r.requestNumber}) - ولي الأمر: {r.student.parentName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رقم جوال ولي الأمر المسجل:</label>
              <input
                type="text"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left/Main: Template Selector & Message Composer */}
            <div className="lg:col-span-2 space-y-4">
              {/* Channel Picker */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">قناة الإرسال:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setChannel('WHATSAPP')}
                    className={`p-3 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      channel === 'WHATSAPP'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>الواتساب الرسمي (WhatsApp Verified)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('SMS')}
                    className={`p-3 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      channel === 'SMS'
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-brand-600" />
                    <span>الرسائل النصية القصيرة (Gov SMS Gateway)</span>
                  </button>
                </div>
              </div>

              {/* Template Buttons */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                  نماذج الإشعارات المعتمدة:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.type}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`p-2.5 text-right rounded-xl border transition-all ${
                        selectedTemplate.type === tmpl.type
                          ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <div>{tmpl.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Composer Form */}
              <form onSubmit={handleSend} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">عنوان الإشعار:</label>
                  <input
                    type="text"
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">نص الرسالة:</label>
                  <textarea
                    rows={4}
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl leading-relaxed font-medium"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl font-semibold"
                  >
                    إغلاق
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSending ? 'جاري الإرسال والتسليم...' : 'إرسال الرسالة لولي الأمر'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Live Mobile Simulator Preview */}
            <div className="bg-slate-900 text-white rounded-3xl p-4 flex flex-col justify-between border-4 border-slate-800 shadow-xl min-h-[380px]">
              <div className="space-y-3">
                {/* Simulated Phone Top Bar */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                  <span>9:41 AM</span>
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Sender Title */}
                <div className="text-center pb-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto text-xs">
                    ش
                  </div>
                  <div className="font-bold text-xs mt-1">منصة شخّصني (Shakhesni)</div>
                  <div className="text-[10px] text-slate-400">حساب موثق لدى وزارة التعليم</div>
                </div>

                {/* Message Bubble */}
                <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 rounded-2xl space-y-1.5 text-[11px] leading-relaxed shadow-sm">
                  <div className="font-bold text-emerald-300 text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{messageTitle}</span>
                  </div>
                  <p className="text-slate-200">{messageContent}</p>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 font-mono pt-1">
                    <span>الآن</span>
                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-500 pt-3 border-t border-slate-800">
                محاكاة مباشرة لقناة ({channel === 'WHATSAPP' ? 'الواتساب الرسمي' : 'رسائل SMS'})
              </div>
            </div>
          </div>

          {/* Past Communication History */}
          {existingMessages.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">سجل الرسائل السابقة لهذا الطالب:</h4>
              <div className="space-y-2">
                {existingMessages.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{m.title}</span>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{m.content}</p>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">
                      {new Date(m.sentAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
