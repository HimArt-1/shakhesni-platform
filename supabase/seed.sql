-- ============================================================================
-- منصة شخّصني لتشخيص الطلاب ذوي الإعاقة (Shakhesni Special Ed Platform)
-- Enterprise Seed Data (بيانات التهيئة الواقعية للمنظومة)
-- ============================================================================

-- 1. SEED USERS
INSERT INTO users (id, national_id, email, full_name, role, role_arabic, specialization, phone, organization_name)
VALUES
  ('11111111-1111-1111-1111-111111111111', '1011223344', 'admin@shakhesni.sa', 'م. فيصل الغامدي', 'SYSTEM_ADMIN', 'مدير النظام', 'هندسة النظم وأمن المعلومات', '0501122334', 'الإدارة العامة للتحول الرقمي'),
  ('22222222-2222-2222-2222-222222222222', '1022334455', 'reception@shakhesni.sa', 'نورة الدوسري', 'RECEPTIONIST', 'موظفة الاستقبال', 'إدارة وتنسيق الحالات', '0502233445', 'مركز التشخيص والتدخل المبكر - الرياض'),
  ('33333333-3333-3333-3333-333333333333', '1033445566', 'coordinator@shakhesni.sa', 'أ. خالد المطيري', 'CENTER_COORDINATOR', 'منسق مركز التشخيص', 'تخطيط وتقييم الخدمات المساندة', '0503344556', 'مركز التشخيص والتدخل المبكر - الرياض'),
  ('44444444-4444-4444-4444-444444444444', '1044556677', 'psychologist@shakhesni.sa', 'د. منيرة آل سعود', 'DIAGNOSTIC_MEMBER', 'أخصائي نفسي إكلينيكي', 'التقييم النفسي والمعرفي WISC-V', '0504455667', 'مركز التشخيص والتدخل المبكر - الرياض'),
  ('55555555-5555-5555-5555-555555555555', '1055667788', 'teamlead@shakhesni.sa', 'د. عبد العزيز العتيبي', 'TEAM_LEADER', 'رئيس الفريق التشخيصي', 'استشاري تشخيص اضطرابات النمو والتوحد', '0505566778', 'مركز التشخيص والتدخل المبكر - الرياض'),
  ('66666666-6666-6666-6666-666666666666', '1066778899', 'supervisor@shakhesni.sa', 'د. هدى التميمي', 'SUPERVISOR', 'المشرف العام والمدير', 'الإدارة والإشراف التربوي المعتمد', '0506677889', 'الإدارة العامة للتربية الخاصة'),
  ('77777777-7777-7777-7777-777777777777', '1077889900', 'school@shakhesni.sa', 'أ. طارق الشمري', 'SCHOOL_REP', 'ممثل المدرسة (المرشد)', 'التوجيه والإرشاد الطلابي', '0507788990', 'مدرسة الرواد الابتدائية للبنين'),
  ('88888888-8888-8888-8888-888888888888', '1088990011', 'parent@shakhesni.sa', 'سلطان بن إبراهيم الحازمي', 'PARENT', 'ولي الأمر', 'ولي أمر الطالب محمد', '0551234567', 'قطاع الأفراد / أولياء الأمور')
ON CONFLICT (national_id) DO NOTHING;

-- 2. SEED STUDENTS
INSERT INTO students (id, national_id, full_name, birth_date, gender, grade, school_name, parent_name, parent_phone, parent_national_id)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '1182390123', 'محمد سلطان الحازمي', '2017-05-14', 'ذكر', 'الصف الثالث الابتدائي', 'مدرسة الرواد الابتدائية للبنين', 'سلطان بن إبراهيم الحازمي', '0551234567', '1088990011'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '1193401234', 'سارة عبد الله الشهري', '2018-09-22', 'أنثى', 'الصف الثاني الابتدائي', 'مدرسة دار العلوم الأهلية', 'عبد الله بن خالد الشهري', '0509876543', '1099887766'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '1204512345', 'راكان فهد القحطاني', '2016-02-10', 'ذكر', 'الصف الرابع الابتدائي', 'مدرسة الأندلس النموذجية', 'فهد بن مبارك القحطاني', '0543219876', '1077665544')
ON CONFLICT (national_id) DO NOTHING;

-- 3. SEED DIAGNOSIS REQUESTS
INSERT INTO diagnosis_requests (
    id,
    request_number,
    student_id,
    school_name,
    referred_center_name,
    primary_category,
    primary_category_arabic,
    priority,
    status,
    status_arabic,
    assigned_team_leader_name,
    receptionist_name,
    sla_days_total,
    sla_days_remaining,
    is_sla_paused,
    report_verification_token,
    diagnosis_summary,
    final_diagnosis_code
)
VALUES
  (
    '10110110-1011-1011-1011-101101101101',
    'SHK-2026-0891',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'مدرسة الرواد الابتدائية للبنين',
    'مركز التشخيص والتدخل المبكر - الرياض',
    'AUTISM',
    'اشتباه اضطراب طيف التوحد (Autism)',
    'URGENT',
    'UNDER_EVALUATION',
    'جلسات التقييم والفحص',
    'د. عبد العزيز العتيبي',
    'نورة الدوسري',
    10,
    7,
    FALSE,
    'VRF-8841-SA',
    'يظهر الطالب استجابات بصرية متقدمة مع حاجة ملحة لتعزيز مهارات التواصل اللفظي والتفاعل الصفي المستقل.',
    'F84.0 - Autism Spectrum Disorder (Level 1)'
  ),
  (
    '20220220-2022-2022-2022-202202202202',
    'SHK-2026-0892',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'مدرسة دار العلوم الأهلية',
    'مركز التشخيص الشامل - شمال الرياض',
    'LEARNING_DISABILITY',
    'صعوبات التعلم الأكاديمية (Dyslexia)',
    'STANDARD',
    'APPROVED',
    'معتمد رسمياً',
    'د. عبد العزيز العتيبي',
    'نورة الدوسري',
    10,
    9,
    FALSE,
    'VRF-9921-SA',
    'وجود فجوة ملحوظة في مهارات القراءة والاستيعاب مع مستوى ذكاء عام طبيعي ومتفوق.',
    'F81.0 - Specific Learning Disorder with reading impairment'
  )
ON CONFLICT (request_number) DO NOTHING;

-- 4. SEED APPOINTMENTS
INSERT INTO appointments (
    id,
    request_id,
    student_name,
    specialist_name,
    specialization,
    appointment_date,
    time_slot,
    status,
    notes
)
VALUES
  (
    'aaaaaaaa-1111-aaaa-1111-aaaaaaaaaaaa',
    '10110110-1011-1011-1011-101101101101',
    'محمد سلطان الحازمي',
    'د. منيرة آل سعود',
    'التقييم النفسي والمعرفي',
    '2026-08-25',
    '09:00 ص - 10:30 ص',
    'ATTENDED',
    'تم تطبيق مقياس وكسلر الخامس بنجاح مع تجاوب جيد من الطالب'
  );

-- 5. SEED IEP PLANS & GOALS
INSERT INTO iep_plans (
    id,
    request_id,
    student_id,
    student_name,
    academic_year,
    semester,
    general_objectives,
    is_published
)
VALUES
  (
    'ee111111-1111-1111-1111-111111111111',
    '10110110-1011-1011-1011-101101101101',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'محمد سلطان الحازمي',
    '1447 / 1448 هـ',
    'الفصل الدراسي الأول',
    ARRAY['تنمية مهارات التواصل الوظيفي والاستجابة للتعليمات الصفية', 'تعزيز التركيز والانتباه في المهام الفردية'],
    TRUE
  );

INSERT INTO iep_goals (
    id,
    plan_id,
    domain,
    domain_arabic,
    title,
    description,
    target_date,
    status,
    progress_percentage,
    criteria,
    assigned_specialist
)
VALUES
  (
    '00a11111-1111-1111-1111-111111111111',
    'ee111111-1111-1111-1111-111111111111',
    'ACADEMIC',
    'الأهداف الأكاديمية وصعوبات التعلم',
    'مطابقة الحروف الهجائية وتمييزها بصرياً وصوتياً',
    'أن يقرأ الطالب 20 كلمة ثلاثية تتضمن الحروف المتشابهة بدقة 85% خلال 3 محاولات.',
    '2026-11-15',
    'IN_PROGRESS',
    65,
    'دقة 85% في 3 جلسات متتالية',
    'أ. طارق الشمري'
  );

-- End of Seed Data
