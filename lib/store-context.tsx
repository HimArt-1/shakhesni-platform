'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  DiagnosisRequest,
  RequestStatus,
  PriorityLevel,
  DocumentRecord,
  Appointment,
  DiagnosticAssessment,
  IEPRecommendation,
  ApprovalEntry,
  AuditLogEntry,
  Notification,
  IEPPlan,
  IEPGoal,
  ParentMessage,
} from '@/types/database';
import {
  INITIAL_USERS,
  INITIAL_REQUESTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from './mock-data';
import { canTransitionState, REQUEST_STATES } from './state-machine';

interface StoreContextType {
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  requests: DiagnosisRequest[];
  auditLogs: AuditLogEntry[];
  notifications: Notification[];
  activeRequest: DiagnosisRequest | null;
  setActiveRequest: (req: DiagnosisRequest | null) => void;
  
  // Actions
  createNewRequest: (newReq: Partial<DiagnosisRequest>) => DiagnosisRequest;
  transitionRequestStatus: (
    requestId: string,
    newStatus: RequestStatus,
    notes?: string
  ) => { success: boolean; message: string };
  updateRequestPriority: (requestId: string, priority: PriorityLevel) => void;
  assignTeam: (requestId: string, teamLeaderId: string, specialistNames: string[]) => void;
  addDocument: (requestId: string, doc: Partial<DocumentRecord>) => void;
  verifyDocument: (requestId: string, docId: string) => void;
  scheduleAppointment: (appointment: Partial<Appointment>) => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  addAssessment: (requestId: string, assessment: Partial<DiagnosticAssessment>) => void;
  addRecommendation: (requestId: string, rec: Partial<IEPRecommendation>) => void;
  deleteRecommendation: (requestId: string, recId: string) => void;
  toggleApproveRecommendation: (requestId: string, recId: string) => void;
  cancelAppointment: (appointmentId: string, reason: string) => void;
  approveReport: (requestId: string, notes?: string) => void;
  saveIEPPlan: (requestId: string, plan: Partial<IEPPlan>) => void;
  updateIEPGoalProgress: (requestId: string, goalId: string, progress: number, status: IEPGoal['status']) => void;
  sendParentMessage: (msg: Omit<ParentMessage, 'id' | 'sentAt' | 'status'>) => void;
  runAIAuditOnDocument: (requestId: string, docId: string) => void;
  generateAIRecommendations: (requestId: string) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationRead: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default: System Admin
  const [requests, setRequests] = useState<DiagnosisRequest[]>(INITIAL_REQUESTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeRequest, setActiveRequest] = useState<DiagnosisRequest | null>(INITIAL_REQUESTS[0]);

  // Auto-sync activeRequest with the latest data from requests array
  useEffect(() => {
    if (activeRequest) {
      const updated = requests.find((r) => r.id === activeRequest.id);
      if (updated && updated !== activeRequest) {
        setActiveRequest(updated);
      }
    }
  }, [requests, activeRequest]);

  // Role Switching helper for Personas
  const switchRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      addAuditLog(`تم التبديل إلى دور: (${found.roleArabic})`, found.name, found.role);
    }
  };

  // Helper to log security audit trail
  const addAuditLog = (action: string, actorName = currentUser.name, actorRole = currentUser.role, reqId?: string) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      requestId: reqId,
      actorName,
      actorRole,
      action,
      ipAddress: '192.168.1.100',
      timestamp: new Date().toISOString(),
      details: `تم تنفيذ الإجراء بواسطة ${actorName} (${actorRole})`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Create new Diagnosis Request
  const createNewRequest = (newReqData: Partial<DiagnosisRequest>): DiagnosisRequest => {
    const reqId = `req-${Date.now()}`;
    const reqNumber = `SHK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdReq: DiagnosisRequest = {
      id: reqId,
      requestNumber: reqNumber,
      studentId: newReqData.studentId || `std-${Date.now()}`,
      student: newReqData.student ? newReqData.student : {
        id: `std-${Date.now()}`,
        nationalId: '1029384756',
        fullName: 'طالب جديد',
        gender: 'MALE',
        birthDate: '2018-01-01',
        ageYears: 8,
        grade: 'الصف الأول الابتدائي',
        schoolId: newReqData.schoolId || 'school-1',
        schoolName: newReqData.schoolName || 'مدرسة الأمل النموذجية الابتدائية',
        parentId: currentUser.id,
        parentName: currentUser.name,
        parentPhone: currentUser.phone,
        parentEmail: currentUser.email,
      },
      schoolId: newReqData.schoolId || 'school-1',
      schoolName: newReqData.schoolName || 'مدرسة الأمل النموذجية الابتدائية',
      referredCenterId: 'center-1',
      referredCenterName: 'مركز التشخيص والتدخل المبكر الموحد - الرياض',
      primaryCategory: newReqData.primaryCategory || 'AUTISM',
      primaryCategoryArabic: newReqData.primaryCategoryArabic || 'اشتباه اضطراب طيف التوحد',
      priority: newReqData.priority || 'NORMAL',
      status: 'SUBMITTED',
      statusArabic: REQUEST_STATES['SUBMITTED'].arabicName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaDaysTotal: 10,
      slaDaysRemaining: 10,
      isSlaPaused: false,
      slaBreached: false,
      documents: newReqData.documents || [],
      statusHistory: [
        {
          id: `h-${Date.now()}`,
          requestId: reqId,
          fromStatus: 'DRAFT',
          toStatus: 'SUBMITTED',
          actorId: currentUser.id,
          actorName: currentUser.name,
          actorRole: currentUser.role,
          timestamp: new Date().toISOString(),
          notes: 'تم إنشاء الطلب وتقديمه بنجاح عبر البوابة الرقمية',
        },
      ],
      appointments: [],
      assessments: [],
      recommendations: [],
      approvals: [],
      assignedSpecialists: [],
    };

    setRequests((prev) => [createdReq, ...prev]);
    addAuditLog(`إنشاء طلب تشخيص جديد رقم (${createdReq.requestNumber})`, currentUser.name, currentUser.role, createdReq.requestNumber);
    return createdReq;
  };

  // State Machine transition handler
  const transitionRequestStatus = (
    requestId: string,
    newStatus: RequestStatus,
    notes?: string
  ): { success: boolean; message: string } => {
    const reqIndex = requests.findIndex((r) => r.id === requestId || r.requestNumber === requestId);
    if (reqIndex === -1) return { success: false, message: 'الطلب غير موجود' };

    const req = requests[reqIndex];
    const check = canTransitionState(req.status, newStatus, currentUser.role);

    if (!check.allowed) {
      return { success: false, message: check.reason || 'الانتقال غير مسموح به' };
    }

    const nextStateMeta = REQUEST_STATES[newStatus];
    const isPaused = nextStateMeta.pausesSLA;

    const historyEntry = {
      id: `h-${Date.now()}`,
      requestId: req.id,
      fromStatus: req.status,
      toStatus: newStatus,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      timestamp: new Date().toISOString(),
      notes: notes || `تغيير الحالة إلى ${nextStateMeta.arabicName}`,
    };

    const updatedReq: DiagnosisRequest = {
      ...req,
      status: newStatus,
      statusArabic: nextStateMeta.arabicName,
      isSlaPaused: isPaused,
      updatedAt: new Date().toISOString(),
      statusHistory: [historyEntry, ...req.statusHistory],
    };

    const updatedList = [...requests];
    updatedList[reqIndex] = updatedReq;
    setRequests(updatedList);

    if (activeRequest?.id === req.id) {
      setActiveRequest(updatedReq);
    }

    addAuditLog(
      `تحديث حالة الطلب (${req.requestNumber}) من [${REQUEST_STATES[req.status].arabicName}] إلى [${nextStateMeta.arabicName}]`,
      currentUser.name,
      currentUser.role,
      req.requestNumber
    );

    // If documents incomplete notification logic
    if (newStatus === 'DOCS_INCOMPLETE') {
      const notif: Notification = {
        id: `notif-${Date.now()}`,
        userId: req.student.parentId,
        role: 'PARENT',
        title: 'مستندات ناقصة مطلوبة للطلب',
        message: `يرجى استكمال المستندات للطلب رقم (${req.requestNumber}). تنبيه: تم وقف عداد SLA مؤقتاً لحين استكمال الملف.`,
        type: 'DOCUMENT_MISSING',
        timestamp: new Date().toISOString(),
        isRead: false,
        linkUrl: `/requests/${req.id}`,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    return { success: true, message: `تم تحديث الحالة بنجاح إلى: ${nextStateMeta.arabicName}` };
  };

  const updateRequestPriority = (requestId: string, priority: PriorityLevel) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, priority } : r))
    );
    addAuditLog(`تعديل أولوية الطلب (${requestId}) إلى ${priority}`);
  };

  const assignTeam = (requestId: string, teamLeaderId: string, specialistNames: string[]) => {
    const leader = users.find((u) => u.id === teamLeaderId);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              assignedTeamLeaderId: teamLeaderId,
              assignedTeamLeaderName: leader?.name || 'د. عبد العزيز العتيبي',
              assignedSpecialists: specialistNames,
              status: 'TEAM_ASSIGNED',
              statusArabic: REQUEST_STATES['TEAM_ASSIGNED'].arabicName,
            }
          : r
      )
    );
    addAuditLog(`تعيين الفريق التشخيصي للطلب (${requestId})`);
  };

  const addDocument = (requestId: string, docData: Partial<DocumentRecord>) => {
    const newDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      requestId,
      title: docData.title || 'مستند مرفق جديد',
      category: docData.category || 'OTHER',
      fileUrl: docData.fileUrl || '/docs/sample.pdf',
      fileName: docData.fileName || 'file.pdf',
      fileSize: docData.fileSize || '1.5 MB',
      uploadedBy: currentUser.name,
      uploadedAt: new Date().toISOString(),
      isVerified: false,
    };

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, documents: [...r.documents, newDoc], updatedAt: new Date().toISOString() }
          : r
      )
    );
    addAuditLog(`إرفاق مستند جديد (${newDoc.title}) للطلب (${requestId})`);
  };

  const verifyDocument = (requestId: string, docId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              documents: r.documents.map((d) => (d.id === docId ? { ...d, isVerified: true } : d)),
            }
          : r
      )
    );
    addAuditLog(`التحقق والاعتماد للمستند (${docId})`);
  };

  const scheduleAppointment = (appData: Partial<Appointment>) => {
    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      requestId: appData.requestId || 'req-101',
      studentName: appData.studentName || 'طالب',
      centerId: 'center-1',
      centerName: 'مركز التشخيص والتدخل المبكر الموحد - الرياض',
      specialistId: appData.specialistId || 'usr-specialist-1',
      specialistName: appData.specialistName || 'د. منيرة آل سعود',
      specialization: appData.specialization || 'تقييم نفسي',
      date: appData.date || '2026-08-05',
      timeSlot: appData.timeSlot || '09:00 ص - 10:30 ص',
      status: 'SCHEDULED',
      notes: appData.notes,
    };

    setRequests((prev) =>
      prev.map((r) =>
        r.id === newApp.requestId
          ? { ...r, appointments: [...r.appointments, newApp] }
          : r
      )
    );
    addAuditLog(`جدولة موعد تشخيصي جديد بتاريخ ${newApp.date} للأخصائي ${newApp.specialistName}`);
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    setRequests((prev) =>
      prev.map((r) => ({
        ...r,
        appointments: r.appointments.map((a) => (a.id === appointmentId ? { ...a, status } : a)),
      }))
    );
    addAuditLog(`تحديث حالة الموعد (${appointmentId}) إلى ${status}`);
  };

  const cancelAppointment = (appointmentId: string, reason: string) => {
    setRequests((prev) =>
      prev.map((r) => ({
        ...r,
        appointments: r.appointments.map((a) =>
          a.id === appointmentId
            ? { ...a, status: 'CANCELLED', cancellationReason: reason }
            : a
        ),
      }))
    );
    addAuditLog(`إلغاء الموعد (${appointmentId}) للسبب: ${reason}`);
  };

  const addAssessment = (requestId: string, assessmentData: Partial<DiagnosticAssessment>) => {
    const newAss: DiagnosticAssessment = {
      id: `ass-${Date.now()}`,
      requestId,
      specialistId: currentUser.id,
      specialistName: currentUser.name,
      specialization: assessmentData.specialization || currentUser.specialization || 'تقييم تشخيصي',
      assessmentDate: new Date().toISOString().split('T')[0],
      testUsed: assessmentData.testUsed || 'مقياس معاري معتمد',
      rawScore: assessmentData.rawScore || 80,
      standardScore: assessmentData.standardScore || 90,
      percentileRank: assessmentData.percentileRank || 25,
      clinicalSummary: assessmentData.clinicalSummary || 'خلاصة نتائج الجلسة التشخيصية والمؤشرات السلوكية',
      strengths: assessmentData.strengths || ['نقاط القوة النمائية'],
      needs: assessmentData.needs || ['احتياجات الدعم والتدخل'],
      dsmCode: assessmentData.dsmCode || 'DSM-5 / ICD-11',
    };

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, assessments: [...r.assessments, newAss], status: 'DRAFT_REPORT', statusArabic: REQUEST_STATES['DRAFT_REPORT'].arabicName }
          : r
      )
    );
    addAuditLog(`إضافة تقييم تشخيصي جديد للطلب (${requestId}) بواسطة ${currentUser.name}`);
  };

  const addRecommendation = (requestId: string, recData: Partial<IEPRecommendation>) => {
    const newRec: IEPRecommendation = {
      id: `rec-${Date.now()}`,
      requestId,
      category: recData.category || 'CLASSROOM_ACCOMMODATION',
      title: recData.title || 'توصية تربوية مخصصة',
      description: recData.description || 'تفاصيل التوصية المخصصة للطالب',
      suggestedBy: currentUser.name,
      isApprovedByTeam: true,
    };

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, recommendations: [...r.recommendations, newRec] }
          : r
      )
    );
    addAuditLog(`إضافة توصية تربوية جديدة للطلب (${requestId})`);
  };

  const deleteRecommendation = (requestId: string, recId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, recommendations: r.recommendations.filter((rec) => rec.id !== recId) }
          : r
      )
    );
    addAuditLog(`حذف التوصية التربوية (${recId}) من الطلب (${requestId})`);
  };

  const toggleApproveRecommendation = (requestId: string, recId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              recommendations: r.recommendations.map((rec) =>
                rec.id === recId ? { ...rec, isApprovedByTeam: !rec.isApprovedByTeam } : rec
              ),
            }
          : r
      )
    );
    addAuditLog(`تحديث حالة اعتماد التوصية (${recId})`);
  };

  const approveReport = (requestId: string, notes?: string) => {
    const vrfToken = `VRF-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}-SA`;
    const qrUrl = `https://shakhesni.sa/verify/${requestId}`;

    const newApproval: ApprovalEntry = {
      id: `appr-${Date.now()}`,
      requestId,
      approverRole: (currentUser.role === 'SYSTEM_ADMIN' ? 'SUPERVISOR' : currentUser.role) as 'SUPERVISOR' | 'TEAM_LEADER',
      approverName: currentUser.name,
      status: 'APPROVED',
      signatureTimestamp: new Date().toISOString(),
      signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      notes: notes || 'تمت المصادقة والاعتماد الرقمي للتقرير التشخيصي',
    };

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'APPROVED',
              statusArabic: REQUEST_STATES['APPROVED'].arabicName,
              qrCodeUrl: qrUrl,
              reportVerificationToken: vrfToken,
              approvals: [...r.approvals, newApproval],
            }
          : r
      )
    );
    addAuditLog(`اعتماد وتوقيع التقرير رقم (${requestId}) وتوليد رمز QR الموثق`, currentUser.name, currentUser.role, requestId);
  };

  // AI Assistant Action Simulators
  const runAIAuditOnDocument = (requestId: string, docId: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r;
        return {
          ...r,
          documents: r.documents.map((d) => {
            if (d.id !== docId) return d;
            return {
              ...d,
              isVerified: true,
              aiAuditResult: {
                status: 'COMPLETE',
                summary: 'قام مساعد الذكاء الاصطناعي بفحص المستند والتحقق من صحة الأختام والبيانات ومطابقة الاسم ورقم الهوية الوطنية بنسبة 99.4%',
              },
            };
          }),
        };
      })
    );
    addAuditLog(`تشغيل فحص الذكاء الاصطناعي الذكي للمستند (${docId})`);
  };

  const generateAIRecommendations = (requestId: string) => {
    const aiRecs: IEPRecommendation[] = [
      {
        id: `rec-ai-1-${Date.now()}`,
        requestId,
        category: 'CLASSROOM_ACCOMMODATION',
        title: 'استخدام الاستجابة البصرية الموجهة بدلاً من التعليمات الشفهية المطولة',
        description: 'اقتراح الذكاء الاصطناعي: الاعتماد على بطاقات الأنشطة المصورة وتقسيم الحصة إلى فترات عمل 15 دقيقة.',
        suggestedBy: 'مساعد الذكاء الاصطناعي (AI Assistant)',
        isAISuggested: true,
        priorityRank: 1,
        isApprovedByTeam: false,
      },
      {
        id: `rec-ai-2-${Date.now()}`,
        requestId,
        category: 'ASSISTIVE_TECH',
        title: 'تخصيص لوحة مفاتيح معززة بالرموز والتواصل الصوتي',
        description: 'اقتراح الذكاء الاصطناعي: دمج التقنيات المساعدة لتحسين سرعة التعبير والكتابة التكيفية.',
        suggestedBy: 'مساعد الذكاء الاصطناعي (AI Assistant)',
        isAISuggested: true,
        priorityRank: 2,
        isApprovedByTeam: false,
      },
    ];

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, recommendations: [...r.recommendations, ...aiRecs] }
          : r
      )
    );
    addAuditLog(`توليد مسودة التوصيات التربوية بواسطة مساعد الذكاء الاصطناعي للطلب (${requestId})`);
  };

  // IEP Plan Management
  const saveIEPPlan = (requestId: string, planData: Partial<IEPPlan>) => {
    const targetReq = requests.find((r) => r.id === requestId);
    const existingPlan = targetReq?.iepPlan;

    const updatedPlan: IEPPlan = {
      id: existingPlan?.id || `iep-${Date.now()}`,
      requestId,
      studentId: targetReq?.studentId || 'std-1',
      studentName: targetReq?.student.fullName || 'طالب',
      academicYear: planData.academicYear || existingPlan?.academicYear || '1447 / 1448 هـ',
      semester: planData.semester || existingPlan?.semester || 'الفصل الدراسي الأول',
      generalObjectives: planData.generalObjectives || existingPlan?.generalObjectives || [
        'تنمية مهارات التواصل الوظيفي والاستجابة للتعليمات الصفية',
        'تعزيز مهارات القراءة والكتابة التكيفية وفق قدرات الطالب'
      ],
      goals: planData.goals || existingPlan?.goals || [],
      teamMembers: planData.teamMembers || existingPlan?.teamMembers || [
        { name: currentUser.name, role: currentUser.roleArabic || 'معلم تربية خاصة' },
        { name: 'أ. سارة', role: 'أخصائية نطق وتخاطب' },
        { name: 'د. عبد الله', role: 'أخصائي نفسي' }
      ],
      parentInvolvementNotes: planData.parentInvolvementNotes || existingPlan?.parentInvolvementNotes || 'موافقة الأسرة على خطة التدريب المنزلي المعزز',
      reviewDate: planData.reviewDate || existingPlan?.reviewDate || '2026-12-15',
      isPublished: planData.isPublished !== undefined ? planData.isPublished : (existingPlan?.isPublished || false),
      createdAt: existingPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, iepPlan: updatedPlan } : r))
    );
    addAuditLog(`تحديث الخطة التربوية الفردية (IEP) للطلب (${requestId}) بواسطة ${currentUser.name}`);
  };

  const updateIEPGoalProgress = (
    requestId: string,
    goalId: string,
    progressPercentage: number,
    status: IEPGoal['status']
  ) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId || !r.iepPlan) return r;
        return {
          ...r,
          iepPlan: {
            ...r.iepPlan,
            updatedAt: new Date().toISOString(),
            goals: r.iepPlan.goals.map((g) =>
              g.id === goalId ? { ...g, progressPercentage, status } : g
            ),
          },
        };
      })
    );
    addAuditLog(`تحديث نسبة إنجاز الهدف التربوي (${goalId}) إلى ${progressPercentage}%`);
  };

  // Parent Multi-Channel Messaging
  const sendParentMessage = (msg: Omit<ParentMessage, 'id' | 'sentAt' | 'status'>) => {
    const newMessage: ParentMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      sentAt: new Date().toISOString(),
      status: 'DELIVERED',
    };

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== msg.requestId) return r;
        return {
          ...r,
          parentMessages: [newMessage, ...(r.parentMessages || [])],
        };
      })
    );

    addAuditLog(`إرسال رسالة ${msg.channel} لولي أمر الطالب (${msg.studentName}) - عنوان: ${msg.title}`);
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUser,
        switchRole,
        requests,
        auditLogs,
        notifications,
        activeRequest,
        setActiveRequest,
        createNewRequest,
        transitionRequestStatus,
        updateRequestPriority,
        assignTeam,
        addDocument,
        verifyDocument,
        scheduleAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        addAssessment,
        addRecommendation,
        deleteRecommendation,
        toggleApproveRecommendation,
        approveReport,
        saveIEPPlan,
        updateIEPGoalProgress,
        sendParentMessage,
        runAIAuditOnDocument,
        generateAIRecommendations,
        addNotification,
        markNotificationRead,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
