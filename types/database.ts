export type UserRole = 
  | 'SYSTEM_ADMIN'            // مدير النظام
  | 'RECEPTIONIST'            // موظفة الاستقبال
  | 'CENTER_COORDINATOR'      // منسق مركز التشخيص
  | 'DIAGNOSTIC_MEMBER'       // عضو فريق التشخيص (أخصائي)
  | 'TEAM_LEADER'             // رئيس الفريق
  | 'SUPERVISOR'              // المشرف / المدير
  | 'SCHOOL_REP'              // ممثل المدرسة
  | 'PARENT';                 // ولي الأمر

export interface User {
  id: string;
  nationalId?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  roleArabic: string;
  avatarUrl?: string;
  specialization?: string; // للأخصائيين (نفسي، نطق وتواصل، علاج وظيفي، سلوك)
  centerId?: string;
  schoolId?: string;
}

export type PriorityLevel = 'EMERGENT' | 'HIGH' | 'NORMAL' | 'LOW';

export type RequestStatus = 
  | 'DRAFT'                   // مسودة
  | 'SUBMITTED'               // مقدم
  | 'DOC_REVIEW'              // مراجعة المستندات
  | 'DOCS_INCOMPLETE'         // مستندات ناقصة (يتوقف SLA)
  | 'DOCS_COMPLETE'           // مستندات مكتملة
  | 'PRIORITY_TRIAGE'         // فرز الأولوية
  | 'REFERRED_TO_CENTER'      // محال للمركز
  | 'ACCEPTED_BY_CENTER'      // مقبول بالمركز
  | 'TEAM_ASSIGNED'           // تعيين الفريق
  | 'APPOINTMENT_SCHEDULED'   // تحديد الموعد
  | 'APPOINTMENT_CONFIRMED'   // تأكيد الموعد
  | 'ATTENDED'                // حضر
  | 'NO_SHOW'                 // لم يحضر
  | 'UNDER_EVALUATION'        // تحت التقييم والتشخيص
  | 'DRAFT_REPORT'            // مسودة التقرير
  | 'TEAM_LEADER_REVIEW'      // مراجعة رئيس الفريق
  | 'ADMIN_REVIEW'            // مراجعة الإدارة / المشرف
  | 'APPROVED'                // معتمد
  | 'DELIVERED'               // تم التسليم
  | 'CLOSED'                  // مغلق
  | 'CANCELLED';              // ملغي

export interface Student {
  id: string;
  nationalId: string;         // رقم الهوية / الإقامة
  fullName: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  ageYears: number;
  grade: string;
  schoolId: string;
  schoolName: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  medicalConditions?: string;
  notes?: string;
}

export interface School {
  id: string;
  code: string;
  name: string;
  city: string;
  district: string;
  educationalStage: string;
  principalName: string;
  counselorName: string;
  counselorPhone: string;
  activeRequestsCount: number;
}

export interface DiagnosticCenter {
  id: string;
  code: string;
  name: string;
  city: string;
  district: string;
  capacityPerDay: number;
  activeTeamCount: number;
  specializations: string[];
  directorName: string;
  phone: string;
}

export interface DocumentRecord {
  id: string;
  requestId: string;
  title: string;
  category: 'MEDICAL_REPORT' | 'SCHOOL_REPORT' | 'NATIONAL_ID' | 'PREVIOUS_DIAGNOSIS' | 'OTHER';
  fileUrl: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  isVerified: boolean;
  notes?: string;
  aiAuditResult?: {
    status: 'COMPLETE' | 'INCOMPLETE' | 'SUSPICIOUS';
    summary: string;
    missingFields?: string[];
  };
}

export interface Appointment {
  id: string;
  requestId: string;
  studentName: string;
  centerId?: string;
  centerName?: string;
  specialistId?: string;
  specialistName: string;
  specialization: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. 09:00 AM - 10:30 AM
  status: 'SCHEDULED' | 'CONFIRMED' | 'ATTENDED' | 'NO_SHOW' | 'CANCELLED';
  notes?: string;
  cancellationReason?: string;
}

export interface DiagnosticAssessment {
  id: string;
  requestId: string;
  specialistId?: string;
  specialistName: string;
  specialization: string; // نفسي / نطق وتواصل / علاج وظيفي / تربوي
  assessmentDate: string;
  testUsed: string; // e.g. مقياس وكسلر للذكاء - الطبعة الخامسة / مقياس فينلاند للسلوك التكيفي
  rawScore?: number;
  standardScore?: number;
  percentileRank?: number;
  domainScores?: Record<string, number>; // درجات المجالات الفرعية
  clinicalSummary: string;
  strengths: string[];
  needs: string[];
  dsmCode?: string; // ICD-11 / DSM-5 classification
}

export interface IEPRecommendation {
  id: string;
  requestId: string;
  category: 'CLASSROOM_ACCOMMODATION' | 'ASSISTIVE_TECH' | 'SPECIAL_ED_CLASS' | 'SPEECH_THERAPY' | 'BEHAVIORAL_PLAN';
  title: string;
  description: string;
  suggestedBy: string; // AI or Specialist Name
  isAISuggested?: boolean;
  priorityRank?: number;
  isApprovedByTeam: boolean;
}

export interface ApprovalEntry {
  id: string;
  requestId: string;
  approverRole: 'TEAM_LEADER' | 'SUPERVISOR' | 'SYSTEM_ADMIN';
  approverName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  signatureTimestamp?: string;
  signatureHash?: string;
  notes?: string;
}

export interface StatusHistoryEntry {
  id: string;
  requestId: string;
  fromStatus: RequestStatus;
  toStatus: RequestStatus;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  timestamp: string;
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  requestId?: string;
  actorName: string;
  actorRole: UserRole;
  action: string; // e.g., "عرض الملف الطبي", "تغيير حالة الطلب", "تنزيل التقرير"
  ipAddress: string;
  timestamp: string;
  details: string;
}

export interface Notification {
  id: string;
  userId: string;
  role: UserRole;
  title: string;
  message: string;
  type: 'INFO' | 'SLA_WARNING' | 'ACTION_REQUIRED' | 'DOCUMENT_MISSING' | 'APPROVAL';
  timestamp: string;
  isRead: boolean;
  linkUrl?: string;
}

export interface IEPGoal {
  id: string;
  domain: 'ACADEMIC' | 'BEHAVIORAL' | 'SPEECH' | 'OCCUPATIONAL' | 'LIFE_SKILLS' | 'SOCIAL';
  domainArabic: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'MASTERED';
  progressPercentage: number;
  criteria: string;
  assignedSpecialist: string;
}

export interface IEPPlan {
  id: string;
  requestId: string;
  studentId: string;
  studentName: string;
  academicYear: string;
  semester: string;
  generalObjectives: string[];
  goals: IEPGoal[];
  teamMembers: { name: string; role: string }[];
  parentInvolvementNotes?: string;
  reviewDate: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParentMessage {
  id: string;
  requestId: string;
  studentName: string;
  parentPhone: string;
  channel: 'SMS' | 'WHATSAPP';
  templateType: 'APPOINTMENT_REMINDER' | 'DOCUMENT_REQUEST' | 'REPORT_READY' | 'STATUS_UPDATE' | 'CUSTOM';
  title: string;
  content: string;
  sentAt: string;
  status: 'DELIVERED' | 'SENT' | 'FAILED';
}

export interface DiagnosisRequest {
  id: string;
  requestNumber: string; // e.g. SHK-2026-0891
  studentId: string;
  student: Student;
  schoolId: string;
  schoolName: string;
  referredCenterId?: string;
  referredCenterName?: string;
  primaryCategory: 'AUTISM' | 'INTELLECTUAL' | 'LEARNING_DISABILITY' | 'SPEECH_LANGUAGE' | 'ADHD' | 'OTHER';
  primaryCategoryArabic: string;
  priority: PriorityLevel;
  status: RequestStatus;
  statusArabic: string;
  assignedTeamLeaderId?: string;
  assignedTeamLeaderName?: string;
  assignedSpecialists: string[]; // List of specialist names
  receptionistId?: string;
  receptionistName?: string;
  createdAt: string;
  updatedAt: string;
  slaDaysTotal: number;
  slaDaysRemaining: number;
  isSlaPaused: boolean;
  slaBreached: boolean;
  qrCodeUrl?: string;
  reportVerificationToken?: string;
  documents: DocumentRecord[];
  statusHistory: StatusHistoryEntry[];
  appointments: Appointment[];
  assessments: DiagnosticAssessment[];
  recommendations: IEPRecommendation[];
  approvals: ApprovalEntry[];
  diagnosisSummary?: string;
  finalDiagnosisCode?: string;
  cancellationReason?: string;
  iepPlan?: IEPPlan;
  parentMessages?: ParentMessage[];
}
