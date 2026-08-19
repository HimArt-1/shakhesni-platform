'use client';

import React from 'react';
import { RequestStatus, StatusHistoryEntry } from '@/types/database';
import { REQUEST_STATES } from '@/lib/state-machine';
import { CheckCircle2, Clock, PauseCircle, AlertCircle, Circle } from 'lucide-react';

const MAIN_PIPELINE_STEPS: RequestStatus[] = [
  'SUBMITTED',
  'DOC_REVIEW',
  'DOCS_COMPLETE',
  'PRIORITY_TRIAGE',
  'REFERRED_TO_CENTER',
  'ACCEPTED_BY_CENTER',
  'TEAM_ASSIGNED',
  'APPOINTMENT_SCHEDULED',
  'ATTENDED',
  'UNDER_EVALUATION',
  'DRAFT_REPORT',
  'TEAM_LEADER_REVIEW',
  'ADMIN_REVIEW',
  'APPROVED',
  'DELIVERED',
  'CLOSED',
];

export const RequestStepper: React.FC<{
  currentStatus: RequestStatus;
  statusHistory: StatusHistoryEntry[];
  isSlaPaused?: boolean;
}> = ({ currentStatus, statusHistory, isSlaPaused }) => {
  const currentIndex = MAIN_PIPELINE_STEPS.indexOf(currentStatus);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>مسار رحلة الطلب ومحرك الحالات التشغيلية</span>
        </h3>
        {isSlaPaused && (
          <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-800 animate-pulse">
            <PauseCircle className="w-3.5 h-3.5" />
            عدّاد SLA متوقف مؤقتاً (مستندات ناقصة)
          </span>
        )}
      </div>

      {/* Stepper horizontal line */}
      <div className="overflow-x-auto pb-4 pt-2 scrollbar-thin">
        <div className="flex items-center min-w-[900px] justify-between px-2 relative">
          {MAIN_PIPELINE_STEPS.map((statusKey, idx) => {
            const stepMeta = REQUEST_STATES[statusKey];
            const isCompleted = idx < currentIndex;
            const isCurrent = currentStatus === statusKey;
            const historyEntry = statusHistory.find((h) => h.toStatus === statusKey);

            return (
              <div key={statusKey} className="flex flex-col items-center relative z-10 group">
                {/* Connecting Line */}
                {idx < MAIN_PIPELINE_STEPS.length - 1 && (
                  <div
                    className={`absolute top-4 right-1/2 left-0 -translate-y-1/2 h-1 w-full -z-10 transition-all ${
                      idx < currentIndex
                        ? 'bg-emerald-500'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                    style={{ width: '100%', right: '50%' }}
                  />
                )}

                {/* Node Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-brand-600 text-white shadow-lg ring-4 ring-brand-100 dark:ring-brand-950/80 scale-110'
                      : isCompleted
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  ) : (
                    <Circle className="w-3 h-3" />
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center max-w-[85px]">
                  <span
                    className={`text-[10px] block leading-tight ${
                      isCurrent
                        ? 'font-bold text-brand-700 dark:text-brand-300'
                        : isCompleted
                        ? 'font-medium text-slate-700 dark:text-slate-300'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {stepMeta.arabicName}
                  </span>
                  {historyEntry && (
                    <span className="text-[8px] text-slate-400 font-mono block mt-0.5">
                      {new Date(historyEntry.timestamp).toLocaleDateString('ar-SA', { month: 'numeric', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
