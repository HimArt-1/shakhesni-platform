import { UserRole, RequestStatus } from '@/types/database';

export interface RoleConfig {
  role: UserRole;
  titleArabic: string;
  description: string;
  canCreateRequest: boolean;
  canEditMedicalAssessments: boolean;
  canApproveReport: boolean;
  canAssignTeam: boolean;
  canScheduleAppointments: boolean;
  allowedNavItems: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, RoleConfig> = {
  SYSTEM_ADMIN: {
    role: 'SYSTEM_ADMIN',
    titleArabic: 'مدير النظام',
    description: 'تحكم كامل بجميع خصائص المنصة والمستخدمين والإعدادات وسجل التدقيق',
    canCreateRequest: true,
    canEditMedicalAssessments: true,
    canApproveReport: true,
    canAssignTeam: true,
    canScheduleAppointments: true,
    allowedNavItems: ['dashboard', 'requests', 'new-request', 'appointments', 'workspace', 'iep', 'students', 'centers', 'analytics', 'audit-log', 'settings'],
  },
  RECEPTIONIST: {
    role: 'RECEPTIONIST',
    titleArabic: 'موظفة الاستقبال',
    description: 'مراجعة المستندات الأولية، التواصل مع المتقدمين، وتأكيد المواعيد والحضور',
    canCreateRequest: true,
    canEditMedicalAssessments: false,
    canApproveReport: false,
    canAssignTeam: false,
    canScheduleAppointments: true,
    allowedNavItems: ['dashboard', 'requests', 'new-request', 'appointments', 'students', 'centers'],
  },
  CENTER_COORDINATOR: {
    role: 'CENTER_COORDINATOR',
    titleArabic: 'منسق مركز التشخيص',
    description: 'إدارة فرز وتوزيع الحالات بالمركز وتحديد الفرق التشخيصية والمواعيد',
    canCreateRequest: true,
    canEditMedicalAssessments: false,
    canApproveReport: false,
    canAssignTeam: true,
    canScheduleAppointments: true,
    allowedNavItems: ['dashboard', 'requests', 'appointments', 'iep', 'students', 'centers', 'analytics'],
  },
  DIAGNOSTIC_MEMBER: {
    role: 'DIAGNOSTIC_MEMBER',
    titleArabic: 'عضو الفريق التشخيصي (أخصائي)',
    description: 'إجراء المقاييس والتقييمات الطبية والتربوية وإدخال التوصيات ومسودات التقارير',
    canCreateRequest: false,
    canEditMedicalAssessments: true,
    canApproveReport: false,
    canAssignTeam: false,
    canScheduleAppointments: false,
    allowedNavItems: ['dashboard', 'requests', 'workspace', 'iep', 'appointments'],
  },
  TEAM_LEADER: {
    role: 'TEAM_LEADER',
    titleArabic: 'رئيس الفريق التشخيصي',
    description: 'توجيه الفريق التشخيصي، اعتماد مسودات التقارير الأولية والمصادقة الفنية',
    canCreateRequest: false,
    canEditMedicalAssessments: true,
    canApproveReport: true,
    canAssignTeam: true,
    canScheduleAppointments: true,
    allowedNavItems: ['dashboard', 'requests', 'workspace', 'iep', 'appointments', 'analytics'],
  },
  SUPERVISOR: {
    role: 'SUPERVISOR',
    titleArabic: 'المشرف / المدير',
    description: 'مراجعة وتقييم أداء المركز والاعتماد النهائي للتقارير والختم الرقمي',
    canCreateRequest: true,
    canEditMedicalAssessments: false,
    canApproveReport: true,
    canAssignTeam: true,
    canScheduleAppointments: false,
    allowedNavItems: ['dashboard', 'requests', 'appointments', 'iep', 'centers', 'analytics', 'audit-log', 'settings'],
  },
  SCHOOL_REP: {
    role: 'SCHOOL_REP',
    titleArabic: 'ممثل المدرسة (المرشد)',
    description: 'تقديم طلبات التشخيص للطلاب الموهوبين أو ذوي الاحتياجات ومتابعة سير الطلبات',
    canCreateRequest: true,
    canEditMedicalAssessments: false,
    canApproveReport: false,
    canAssignTeam: false,
    canScheduleAppointments: false,
    allowedNavItems: ['dashboard', 'requests', 'new-request', 'students', 'iep', 'appointments'],
  },
  PARENT: {
    role: 'PARENT',
    titleArabic: 'ولي الأمر',
    description: 'تقديم طلب تشخيص للأبناء، رفع الوثائق المطلوبة، تأكيد المواعيد واستلام التقرير المعتمد',
    canCreateRequest: true,
    canEditMedicalAssessments: false,
    canApproveReport: false,
    canAssignTeam: false,
    canScheduleAppointments: false,
    allowedNavItems: ['dashboard', 'requests', 'new-request', 'iep', 'appointments'],
  },
};
