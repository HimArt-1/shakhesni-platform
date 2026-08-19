-- PostgreSQL / Supabase Schema Definition for Shakhesni Platform
-- منصة شخّصني - مخطط قاعدة البيانات والأمان على مستوى السطر (RLS)

-- Enums
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

CREATE TYPE priority_level AS ENUM ('EMERGENT', 'HIGH', 'NORMAL', 'LOW');

CREATE TYPE request_status AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'DOC_REVIEW',
  'DOCS_INCOMPLETE',
  'DOCS_COMPLETE',
  'PRIORITY_TRIAGE',
  'REFERRED_TO_CENTER',
  'ACCEPTED_BY_CENTER',
  'TEAM_ASSIGNED',
  'APPOINTMENT_SCHEDULED',
  'APPOINTMENT_CONFIRMED',
  'ATTENDED',
  'NO_SHOW',
  'UNDER_EVALUATION',
  'DRAFT_REPORT',
  'TEAM_LEADER_REVIEW',
  'ADMIN_REVIEW',
  'APPROVED',
  'DELIVERED',
  'CLOSED',
  'CANCELLED'
);

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role user_role NOT NULL,
  specialization TEXT,
  center_id UUID,
  school_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Schools Table
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  educational_stage TEXT NOT NULL,
  principal_name TEXT NOT NULL,
  counselor_name TEXT NOT NULL,
  counselor_phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Diagnostic Centers Table
CREATE TABLE diagnostic_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  capacity_per_day INT DEFAULT 10,
  director_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Students Table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  national_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('MALE', 'FEMALE')),
  birth_date DATE NOT NULL,
  school_id UUID REFERENCES schools(id),
  parent_id UUID REFERENCES users(id),
  medical_conditions TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Diagnosis Requests Table
CREATE TABLE diagnosis_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number TEXT UNIQUE NOT NULL,
  student_id UUID REFERENCES students(id) NOT NULL,
  school_id UUID REFERENCES schools(id) NOT NULL,
  referred_center_id UUID REFERENCES diagnostic_centers(id),
  primary_category TEXT NOT NULL,
  priority priority_level DEFAULT 'NORMAL',
  status request_status DEFAULT 'DRAFT',
  assigned_team_leader_id UUID REFERENCES users(id),
  receptionist_id UUID REFERENCES users(id),
  sla_days_total INT DEFAULT 10,
  is_sla_paused BOOLEAN DEFAULT FALSE,
  sla_breached BOOLEAN DEFAULT FALSE,
  qr_code_url TEXT,
  report_verification_token TEXT UNIQUE,
  diagnosis_summary TEXT,
  final_diagnosis_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Document Records Table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES diagnosis_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id),
  is_verified BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Status History Table (State Machine Audit)
CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES diagnosis_requests(id) ON DELETE CASCADE,
  from_status request_status NOT NULL,
  to_status request_status NOT NULL,
  actor_id UUID REFERENCES users(id) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now(),
  notes TEXT
);

-- Appointments Table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES diagnosis_requests(id) ON DELETE CASCADE,
  center_id UUID REFERENCES diagnostic_centers(id) NOT NULL,
  specialist_id UUID REFERENCES users(id) NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT DEFAULT 'SCHEDULED',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Diagnostic Assessments Table
CREATE TABLE diagnostic_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES diagnosis_requests(id) ON DELETE CASCADE,
  specialist_id UUID REFERENCES users(id) NOT NULL,
  specialization TEXT NOT NULL,
  assessment_date DATE NOT NULL,
  test_used TEXT NOT NULL,
  raw_score NUMERIC,
  standard_score NUMERIC,
  percentile_rank NUMERIC,
  clinical_summary TEXT NOT NULL,
  dsm_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- IEP Recommendations Table
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES diagnosis_requests(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  suggested_by TEXT NOT NULL,
  is_approved_by_team BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Approvals Table
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES diagnosis_requests(id) ON DELETE CASCADE,
  approver_role user_role NOT NULL,
  approver_id UUID REFERENCES users(id) NOT NULL,
  status TEXT DEFAULT 'PENDING',
  signature_hash TEXT,
  timestamp TIMESTAMPTZ DEFAULT now(),
  notes TEXT
);

-- Immutable Audit Log Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES diagnosis_requests(id),
  actor_id UUID REFERENCES users(id),
  actor_role user_role NOT NULL,
  action TEXT NOT NULL,
  ip_address TEXT,
  details JSONB,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostic_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Sample RLS Policy: Admins see everything, Parents see only their own children/requests
CREATE POLICY "Admins have full access" ON diagnosis_requests
  FOR ALL USING (auth.jwt() ->> 'role' = 'SYSTEM_ADMIN');

CREATE POLICY "Parents see their own requests" ON diagnosis_requests
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM students WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "Center staff see requests assigned to their center" ON diagnosis_requests
  FOR SELECT USING (
    referred_center_id IN (
      SELECT center_id FROM users WHERE id = auth.uid()
    )
  );
