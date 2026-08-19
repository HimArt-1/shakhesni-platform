import { RequestStatus, UserRole } from '@/types/database';

export interface StateMetadata {
  status: RequestStatus;
  arabicName: string;
  badgeClass: string;
  description: string;
  pausesSLA: boolean;
}

export const REQUEST_STATES: Record<RequestStatus, StateMetadata> = {
  DRAFT: {
    status: 'DRAFT',
    arabicName: 'مسودة',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
    description: 'تم إنشاء مسودة الطلب ولم يتم تقديمها بعد',
    pausesSLA: true,
  },
  SUBMITTED: {
    status: 'SUBMITTED',
    arabicName: 'مُقـدَّم',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
    description: 'تم تقديم الطلب بنجاح وهو في انتظار بدء مراجعة الوثائق',
    pausesSLA: false,
  },
  DOC_REVIEW: {
    status: 'DOC_REVIEW',
    arabicName: 'مراجعة المستندات',
    badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300',
    description: 'تقوم موظفة الاستقبال بمراجعة الوثائق والمستندات المرفقة',
    pausesSLA: false,
  },
  DOCS_INCOMPLETE: {
    status: 'DOCS_INCOMPLETE',
    arabicName: 'مستندات ناقصة',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-400 font-semibold',
    description: 'هناك مستندات مفقودة أو غير صالحة. تم إيقاف SLA في انتظار ولي الأمر/المدرسة',
    pausesSLA: true,
  },
  DOCS_COMPLETE: {
    status: 'DOCS_COMPLETE',
    arabicName: 'مستندات مكتملة',
    badgeClass: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border-teal-300',
    description: 'تم التثبت من سلامة وكفاية جميع المستندات المطلوبة',
    pausesSLA: false,
  },
  PRIORITY_TRIAGE: {
    status: 'PRIORITY_TRIAGE',
    arabicName: 'فرز الأولوية',
    badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-300',
    description: 'تحديد درجة الأولوية والحالة الطبية والتربوية للطلب',
    pausesSLA: false,
  },
  REFERRED_TO_CENTER: {
    status: 'REFERRED_TO_CENTER',
    arabicName: 'محال للمركز',
    badgeClass: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300',
    description: 'تم تحويل الطلب إلى مركز التشخيص المناسب وبانتظار الموافقة',
    pausesSLA: false,
  },
  ACCEPTED_BY_CENTER: {
    status: 'ACCEPTED_BY_CENTER',
    arabicName: 'مقبول بالمركز',
    badgeClass: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-300',
    description: 'تم قبول الحالة رسمياً في مركز التشخيص وبانتظار تشكيل الفريق',
    pausesSLA: false,
  },
  TEAM_ASSIGNED: {
    status: 'TEAM_ASSIGNED',
    arabicName: 'تعيين الفريق',
    badgeClass: 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300 border-violet-300',
    description: 'تم تخصيص رئيس الفريق والأخصائيين المعنيين بالتشخيص',
    pausesSLA: false,
  },
  APPOINTMENT_SCHEDULED: {
    status: 'APPOINTMENT_SCHEDULED',
    arabicName: 'تحديد الموعد',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-400',
    description: 'تم حجز موعد جلسة التقييم التشخيصي',
    pausesSLA: false,
  },
  APPOINTMENT_CONFIRMED: {
    status: 'APPOINTMENT_CONFIRMED',
    arabicName: 'تأكيد الموعد',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
    description: 'تم تأكيد الحضور من قبل ولي الأمر',
    pausesSLA: false,
  },
  ATTENDED: {
    status: 'ATTENDED',
    arabicName: 'حـضــر',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-400 font-semibold',
    description: 'حضر الطالب لمركز التشخيص وبدأت الجلسات المقررة',
    pausesSLA: false,
  },
  NO_SHOW: {
    status: 'NO_SHOW',
    arabicName: 'لم يحضر',
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-400',
    description: 'تخلف الطالب عن الموعد المحدد دون عذر متقدم',
    pausesSLA: true,
  },
  UNDER_EVALUATION: {
    status: 'UNDER_EVALUATION',
    arabicName: 'تحت التقييم والتشخيص',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
    description: 'يقوم فريق التشخيص بتطبيق الاختبارات والمعايير التشخيصية',
    pausesSLA: false,
  },
  DRAFT_REPORT: {
    status: 'DRAFT_REPORT',
    arabicName: 'مسودة التقرير',
    badgeClass: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-300',
    description: 'تم صياغة مسودة التقرير التشخيصي والتوصيات التربوية',
    pausesSLA: false,
  },
  TEAM_LEADER_REVIEW: {
    status: 'TEAM_LEADER_REVIEW',
    arabicName: 'مراجعة رئيس الفريق',
    badgeClass: 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300 border-fuchsia-300',
    description: 'التقرير تحت مراجعة ودراسة رئيس فريق التشخيص',
    pausesSLA: false,
  },
  ADMIN_REVIEW: {
    status: 'ADMIN_REVIEW',
    arabicName: 'مراجعة الإدارة والمشرف',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-400',
    description: 'التقرير في انتظار الاعتماد النهائى من مشرف/مدير المركز',
    pausesSLA: false,
  },
  APPROVED: {
    status: 'APPROVED',
    arabicName: 'معتمــد رسمياً',
    badgeClass: 'bg-emerald-600 text-white dark:bg-emerald-700 font-bold border-emerald-600 shadow-sm',
    description: 'تم اعتماد التقرير وتوقيعه رقمياً مع توليد رمز الـ QR',
    pausesSLA: false,
  },
  DELIVERED: {
    status: 'DELIVERED',
    arabicName: 'تم التسليم',
    badgeClass: 'bg-teal-600 text-white dark:bg-teal-700 font-bold border-teal-600',
    description: 'تم إرسال وتسليم التقرير لولي الأمر والمدرسة',
    pausesSLA: false,
  },
  CLOSED: {
    status: 'CLOSED',
    arabicName: 'مُغلــــق',
    badgeClass: 'bg-zinc-700 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-600',
    description: 'تم إغلاق ملف الطلب وأرشفته بالنظام',
    pausesSLA: true,
  },
  CANCELLED: {
    status: 'CANCELLED',
    arabicName: 'ملغــــى',
    badgeClass: 'bg-rose-600 text-white dark:bg-rose-800 font-semibold border-rose-600',
    description: 'تم إلغاء الطلب بناءً على طلب ولي الأمر أو المدرسة',
    pausesSLA: true,
  },
};

// Strict state transition mapping
export const ALLOWED_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['DOC_REVIEW', 'CANCELLED'],
  DOC_REVIEW: ['DOCS_INCOMPLETE', 'DOCS_COMPLETE', 'CANCELLED'],
  DOCS_INCOMPLETE: ['DOC_REVIEW', 'CANCELLED'], // Resumes review upon document upload
  DOCS_COMPLETE: ['PRIORITY_TRIAGE', 'CANCELLED'],
  PRIORITY_TRIAGE: ['REFERRED_TO_CENTER', 'CANCELLED'],
  REFERRED_TO_CENTER: ['ACCEPTED_BY_CENTER', 'CANCELLED'],
  ACCEPTED_BY_CENTER: ['TEAM_ASSIGNED', 'CANCELLED'],
  TEAM_ASSIGNED: ['APPOINTMENT_SCHEDULED', 'CANCELLED'],
  APPOINTMENT_SCHEDULED: ['APPOINTMENT_CONFIRMED', 'CANCELLED'],
  APPOINTMENT_CONFIRMED: ['ATTENDED', 'NO_SHOW', 'CANCELLED'],
  NO_SHOW: ['APPOINTMENT_SCHEDULED', 'CANCELLED'],
  ATTENDED: ['UNDER_EVALUATION', 'CANCELLED'],
  UNDER_EVALUATION: ['DRAFT_REPORT', 'CANCELLED'],
  DRAFT_REPORT: ['TEAM_LEADER_REVIEW', 'CANCELLED'],
  TEAM_LEADER_REVIEW: ['ADMIN_REVIEW', 'UNDER_EVALUATION', 'CANCELLED'],
  ADMIN_REVIEW: ['APPROVED', 'TEAM_LEADER_REVIEW', 'CANCELLED'],
  APPROVED: ['DELIVERED'],
  DELIVERED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: [],
};

// Allowed roles for transitioning out of each state
export const ROLE_TRANSITION_PERMISSIONS: Record<RequestStatus, UserRole[]> = {
  DRAFT: ['SCHOOL_REP', 'PARENT', 'SYSTEM_ADMIN'],
  SUBMITTED: ['RECEPTIONIST', 'SCHOOL_REP', 'PARENT', 'SYSTEM_ADMIN'],
  DOC_REVIEW: ['RECEPTIONIST', 'SYSTEM_ADMIN'],
  DOCS_INCOMPLETE: ['RECEPTIONIST', 'SCHOOL_REP', 'PARENT', 'SYSTEM_ADMIN'],
  DOCS_COMPLETE: ['RECEPTIONIST', 'CENTER_COORDINATOR', 'SYSTEM_ADMIN'],
  PRIORITY_TRIAGE: ['CENTER_COORDINATOR', 'SYSTEM_ADMIN'],
  REFERRED_TO_CENTER: ['CENTER_COORDINATOR', 'SUPERVISOR', 'SYSTEM_ADMIN'],
  ACCEPTED_BY_CENTER: ['CENTER_COORDINATOR', 'TEAM_LEADER', 'SYSTEM_ADMIN'],
  TEAM_ASSIGNED: ['TEAM_LEADER', 'SYSTEM_ADMIN'],
  APPOINTMENT_SCHEDULED: ['RECEPTIONIST', 'CENTER_COORDINATOR', 'SYSTEM_ADMIN'],
  APPOINTMENT_CONFIRMED: ['RECEPTIONIST', 'PARENT', 'SYSTEM_ADMIN'],
  NO_SHOW: ['RECEPTIONIST', 'CENTER_COORDINATOR', 'SYSTEM_ADMIN'],
  ATTENDED: ['RECEPTIONIST', 'DIAGNOSTIC_MEMBER', 'TEAM_LEADER', 'SYSTEM_ADMIN'],
  UNDER_EVALUATION: ['DIAGNOSTIC_MEMBER', 'TEAM_LEADER', 'SYSTEM_ADMIN'],
  DRAFT_REPORT: ['DIAGNOSTIC_MEMBER', 'TEAM_LEADER', 'SYSTEM_ADMIN'],
  TEAM_LEADER_REVIEW: ['TEAM_LEADER', 'SYSTEM_ADMIN'],
  ADMIN_REVIEW: ['SUPERVISOR', 'SYSTEM_ADMIN'],
  APPROVED: ['RECEPTIONIST', 'CENTER_COORDINATOR', 'SUPERVISOR', 'SYSTEM_ADMIN'],
  DELIVERED: ['RECEPTIONIST', 'SUPERVISOR', 'SYSTEM_ADMIN'],
  CLOSED: ['SYSTEM_ADMIN'],
  CANCELLED: ['SYSTEM_ADMIN'],
};

export function canTransitionState(
  from: RequestStatus,
  to: RequestStatus,
  userRole: UserRole
): { allowed: boolean; reason?: string } {
  // Allow system admin full control for override
  if (userRole === 'SYSTEM_ADMIN') {
    return { allowed: true };
  }

  const validNextStates = ALLOWED_TRANSITIONS[from] || [];
  if (!validNextStates.includes(to)) {
    return {
      allowed: false,
      reason: `الانتقال المباشر من حالة "${REQUEST_STATES[from].arabicName}" إلى "${REQUEST_STATES[to].arabicName}" غير مسموح به حسب نموذج محرك الحالات.`,
    };
  }

  const allowedRoles = ROLE_TRANSITION_PERMISSIONS[from] || [];
  if (!allowedRoles.includes(userRole)) {
    return {
      allowed: false,
      reason: `دورك الحالي ليس لديه الصلاحية لاتخاذ هذا الإجراء على حالة "${REQUEST_STATES[from].arabicName}".`,
    };
  }

  return { allowed: true };
}
