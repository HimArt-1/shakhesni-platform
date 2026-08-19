-- ============================================================================
-- منصة شخّصني لتشخيص الطلاب ذوي الإعاقة (Shakhesni Special Ed Platform)
-- PostgreSQL / Supabase Migration Schema v1.0.0
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM (
    'SYSTEM_ADMIN',
    'RECEPTIONIST',
    'CENTER_COORDINATOR',
    'DIAGNOSTIC_MEMBER',
    'TEAM_LEADER',
    'SUPERVISOR',
    'SCHOOL_REP',
    'PARENT'
);

CREATE TYPE request_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'DOC_REVIEW',
    'DOC_INCOMPLETE',
    'PRIORITY_TRIAGE',
    'APPOINTMENT_SCHEDULED',
    'UNDER_EVALUATION',
    'DRAFT_REPORT',
    'TEAM_LEADER_REVIEW',
    'APPROVED',
    'DELIVERED',
    'CLOSED',
    'CANCELLED'
);

CREATE TYPE priority_level AS ENUM (
    'CRITICAL',
    'URGENT',
    'STANDARD',
    'ROUTINE'
);

CREATE TYPE disability_category AS ENUM (
    'AUTISM',
    'INTELLECTUAL',
    'LEARNING_DISABILITY',
    'SPEECH_LANGUAGE',
    'ADHD',
    'GIFTED_TALENTED',
    'OTHER'
);

CREATE TYPE appointment_status AS ENUM (
    'SCHEDULED',
    'CONFIRMED',
    'ATTENDED',
    'NO_SHOW',
    'CANCELLED',
    'RESCHEDULED'
);

CREATE TYPE message_channel AS ENUM (
    'SMS',
    'WHATSAPP'
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    national_id VARCHAR(10) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'PARENT',
    role_arabic VARCHAR(100) NOT NULL,
    specialization VARCHAR(150),
    phone VARCHAR(20),
    organization_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    national_id VARCHAR(10) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    parent_national_id VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. DIAGNOSIS REQUESTS TABLE
CREATE TABLE IF NOT EXISTS diagnosis_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number VARCHAR(50) UNIQUE NOT NULL,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    school_name VARCHAR(255) NOT NULL,
    referred_center_name VARCHAR(255) NOT NULL DEFAULT 'مركز التشخيص الموحد - الرياض',
    primary_category disability_category NOT NULL DEFAULT 'AUTISM',
    primary_category_arabic VARCHAR(100) NOT NULL,
    priority priority_level NOT NULL DEFAULT 'STANDARD',
    status request_status NOT NULL DEFAULT 'SUBMITTED',
    status_arabic VARCHAR(100) NOT NULL,
    assigned_team_leader_name VARCHAR(255),
    receptionist_name VARCHAR(255),
    sla_days_total INT DEFAULT 10,
    sla_days_remaining INT DEFAULT 10,
    is_sla_paused BOOLEAN DEFAULT FALSE,
    sla_breached BOOLEAN DEFAULT FALSE,
    report_verification_token VARCHAR(100),
    qr_code_url TEXT,
    diagnosis_summary TEXT,
    final_diagnosis_code VARCHAR(100),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES diagnosis_requests(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size VARCHAR(50),
    file_url TEXT NOT NULL,
    uploaded_by VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    ai_audit_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES diagnosis_requests(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    specialist_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(150) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(100) NOT NULL,
    status appointment_status NOT NULL DEFAULT 'SCHEDULED',
    notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. DIAGNOSTIC ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS diagnostic_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES diagnosis_requests(id) ON DELETE CASCADE,
    specialist_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(150) NOT NULL,
    assessment_date DATE NOT NULL,
    test_used VARCHAR(255) NOT NULL,
    raw_score NUMERIC,
    standard_score NUMERIC,
    percentile_rank NUMERIC,
    domain_scores JSONB DEFAULT '{}'::jsonb,
    clinical_summary TEXT NOT NULL,
    strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
    needs TEXT[] DEFAULT ARRAY[]::TEXT[],
    dsm_code VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. IEP PLANS & GOALS TABLE
CREATE TABLE IF NOT EXISTS iep_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES diagnosis_requests(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    semester VARCHAR(100) NOT NULL,
    general_objectives TEXT[] DEFAULT ARRAY[]::TEXT[],
    team_members JSONB DEFAULT '[]'::jsonb,
    parent_involvement_notes TEXT,
    review_date DATE,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS iep_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES iep_plans(id) ON DELETE CASCADE,
    domain VARCHAR(50) NOT NULL,
    domain_arabic VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    target_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NOT_STARTED',
    progress_percentage INT DEFAULT 0,
    criteria TEXT,
    assigned_specialist VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. PARENT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS parent_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES diagnosis_requests(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    channel message_channel NOT NULL DEFAULT 'WHATSAPP',
    template_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DELIVERED',
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id VARCHAR(100),
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(100) NOT NULL,
    action VARCHAR(255) NOT NULL,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    details TEXT,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    link_url TEXT,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ============================================================================
CREATE INDEX idx_requests_request_number ON diagnosis_requests(request_number);
CREATE INDEX idx_requests_student_id ON diagnosis_requests(student_id);
CREATE INDEX idx_requests_status ON diagnosis_requests(status);
CREATE INDEX idx_students_national_id ON students(national_id);
CREATE INDEX idx_documents_request_id ON documents(request_id);
CREATE INDEX idx_appointments_request_id ON appointments(request_id);
CREATE INDEX idx_assessments_request_id ON diagnostic_assessments(request_id);
CREATE INDEX idx_iep_goals_plan_id ON iep_goals(plan_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE iep_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE iep_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Admins and Supervisors can view and manage all records
CREATE POLICY "Admin Full Access" ON diagnosis_requests FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Students" ON students FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Docs" ON documents FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Apps" ON appointments FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Assessments" ON diagnostic_assessments FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access IEP" ON iep_plans FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Logs" ON audit_logs FOR ALL TO authenticated USING (true);

-- End of schema
