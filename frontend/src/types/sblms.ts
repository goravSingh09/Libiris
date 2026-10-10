export interface Admin {
  id: number;
  full_name: string;
  username: string;
  email: string | null;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at?: string;
}

export interface Student {
  id: number;
  student_id: string;
  full_name: string;
  father_name: string;
  mother_name: string;
  mobile: string;
  email: string;
  whatsapp: string;
  emergency_contact: string;
  aadhaar_number: string;
  dob: string;
  gender: string;
  address: string;
  preparing_for: string;
  has_photo: boolean;
  has_aadhaar: boolean;
  has_password?: boolean;
  seat_number: string | null;
  monthly_fee: number;
  fee_status: 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue';
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'Archived';
  joining_date: string | null;
  created_at?: string;
}

export interface Seat {
  id: number;
  seat_number: string;
  status: 'Available' | 'Occupied' | 'Maintenance';
  assigned_student_id: number | null;
  assigned_student_name?: string | null;
  assigned_student_uid?: string | null;
  notes?: string | null;
  updated_at?: string;
}

export interface SeatMetrics {
  total: number;
  occupied: number;
  available: number;
  maintenance: number;
  occupancy_rate: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  student_id: number;
  student_uid?: string;
  student_name?: string;
  billing_month: string;
  due_date: string;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  status: 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue';
  created_at?: string;
}

export interface Payment {
  id: number;
  receipt_number: string;
  invoice_id: number;
  student_id: number;
  student_uid?: string;
  student_name?: string;
  billing_month?: string;
  admin_id: number | null;
  recorded_by?: string;
  amount: number;
  payment_method: 'Cash';
  payment_date: string;
  notes?: string | null;
  is_reversal: boolean;
  created_at?: string;
}

export interface AttendanceRecord {
  id: number;
  student_id: number;
  student_uid?: string;
  student_name?: string;
  date: string;
  status: 'Present' | 'Absent' | 'Leave';
  check_in_time?: string | null;
  marked_by_name?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface DailyAttendanceSummary {
  date: string;
  total_approved: number;
  present: number;
  absent: number;
  leave: number;
  unmarked: number;
  attendance_rate: number;
  students: {
    student_id: number;
    student_uid: string;
    full_name: string;
    seat_number: string | null;
    status: 'Present' | 'Absent' | 'Leave' | 'Unmarked';
    check_in_time?: string | null;
    notes?: string | null;
  }[];
}

export interface AdminDashboardData {
  metrics: {
    total_students: number;
    approved_students: number;
    pending_admissions: number;
    rejected_admissions: number;
    total_seats: number;
    occupied_seats: number;
    available_seats: number;
    seat_occupancy_rate: number;
    today_attendance_present: number;
    today_attendance_rate: number;
    cash_collected_this_month: number;
    outstanding_fees: number;
    overdue_invoices_count: number;
  };
  charts: {
    collection_trend: { month: string; collected: number }[];
    fee_breakdown: { name: string; count: number; color: string }[];
    attendance_trend: { date: string; present: number; absent: number }[];
  };
  recent_admissions: Student[];
  recent_receipts: Payment[];
}

export interface StudentDashboardData {
  student: Student;
  seat: {
    seat_number: string | null;
    status: string;
  };
  fee_summary: {
    monthly_fee: number;
    total_outstanding: number;
    fee_status: string;
    current_month_invoice?: Invoice;
  };
  attendance_summary: {
    today_status: string;
    attendance_rate: number;
    total_days: number;
    present_days: number;
  };
  recent_receipts: Payment[];
}

export interface AuthState {
  token: string | null;
  userType: 'admin' | 'student' | null;
  user: Admin | Student | null;
}
