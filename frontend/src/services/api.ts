import {
  AdminDashboardData,
  DailyAttendanceSummary,
  Invoice,
  Payment,
  SeatMetrics,
  Student,
  StudentDashboardData
} from '../types/sblms';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeaders(isFormData = false): HeadersInit {
  const token = localStorage.getItem('sblms_token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    // If token invalid/expired, clear and optionally redirect
    localStorage.removeItem('sblms_token');
    localStorage.removeItem('sblms_user_type');
    localStorage.removeItem('sblms_user');
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'An error occurred with the request');
    }
    return data;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res as unknown as T;
}

export const api = {
  // --- AUTHENTICATION ---
  async adminLogin(credentials: { username: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/v1/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse<{ success: boolean; token: string; user: any }>(res);
  },

  async studentLogin(credentials: { identifier: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/v1/auth/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse<{ success: boolean; token: string; user: any }>(res);
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE_URL}/v1/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; type: 'admin' | 'student'; user: any }>(res);
  },

  async changePassword(data: { old_password: string; new_password: string }) {
    const res = await fetch(`${API_BASE_URL}/v1/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  async forgotPassword(identifier: string) {
    const res = await fetch(`${API_BASE_URL}/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier })
    });
    return handleResponse<{ success: boolean; message: string; reset_token?: string }>(res);
  },

  async resetPassword(data: { token: string; new_password: string }) {
    const res = await fetch(`${API_BASE_URL}/v1/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  async activateStudent(data: { student_id: string; mobile: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/v1/auth/student/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // --- STUDENTS & ADMISSION ---
  async getStudents(params?: { search?: string; status?: string; seat_status?: string; page?: number }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.seat_status) query.set('seat_status', params.seat_status);
    if (params?.page) query.set('page', params.page.toString());

    const res = await fetch(`${API_BASE_URL}/v1/students?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; students: Student[]; pagination: any }>(res);
  },

  async submitAdmission(formData: FormData) {
    const res = await fetch(`${API_BASE_URL}/v1/students/admission`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: formData
    });
    return handleResponse<{ success: boolean; message: string; student_id: string; student: Student }>(res);
  },

  async getStudent(id: number) {
    const res = await fetch(`${API_BASE_URL}/v1/students/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; student: Student }>(res);
  },

  async updateStudent(id: number, data: Partial<Student>) {
    const res = await fetch(`${API_BASE_URL}/v1/students/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; message: string; student: Student }>(res);
  },

  async approveStudent(id: number, data?: { seat_number?: string; monthly_fee?: number }) {
    const res = await fetch(`${API_BASE_URL}/v1/students/${id}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data || {})
    });
    return handleResponse<{ success: boolean; message: string; student: Student }>(res);
  },

  async rejectStudent(id: number, reason?: string) {
    const res = await fetch(`${API_BASE_URL}/v1/students/${id}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return handleResponse<{ success: boolean; message: string; student: Student }>(res);
  },

  async deleteStudent(id: number) {
    const res = await fetch(`${API_BASE_URL}/v1/students/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // --- SEAT MANAGEMENT ---
  async getSeats() {
    const res = await fetch(`${API_BASE_URL}/v1/seats`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; data: { seats: any[]; metrics: SeatMetrics } }>(res);
  },

  async assignSeat(seatNumber: string, studentId: number, notes?: string) {
    const res = await fetch(`${API_BASE_URL}/v1/seats/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ seat_number: seatNumber, student_id: studentId, notes })
    });
    return handleResponse<{ success: boolean; message: string; seat: any }>(res);
  },

  async releaseSeat(seatNumber: string) {
    const res = await fetch(`${API_BASE_URL}/v1/seats/release`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ seat_number: seatNumber })
    });
    return handleResponse<{ success: boolean; message: string; seat: any }>(res);
  },

  // --- CASH FEE MANAGEMENT ---
  async getInvoices(params?: { student_id?: number; status?: string; month?: string }) {
    const query = new URLSearchParams();
    if (params?.student_id) query.set('student_id', params.student_id.toString());
    if (params?.status) query.set('status', params.status);
    if (params?.month) query.set('month', params.month);

    const res = await fetch(`${API_BASE_URL}/v1/fees/invoices?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; invoices: Invoice[] }>(res);
  },

  async generateInvoices(month?: string, dueDate?: string) {
    const res = await fetch(`${API_BASE_URL}/v1/fees/invoices/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ billing_month: month, due_date: dueDate })
    });
    return handleResponse<{ success: boolean; message: string; count: number }>(res);
  },

  async recordCashPayment(data: { invoice_id: number; amount: number; payment_date?: string; notes?: string }) {
    const res = await fetch(`${API_BASE_URL}/v1/fees/payments/cash`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; message: string; payment: Payment; receipt_number: string }>(res);
  },

  async reversePayment(paymentId: number, reason: string) {
    const res = await fetch(`${API_BASE_URL}/v1/fees/payments/reverse`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ payment_id: paymentId, reason })
    });
    return handleResponse<{ success: boolean; message: string; payment: Payment }>(res);
  },

  async getPayments(params?: { student_id?: number }) {
    const query = new URLSearchParams();
    if (params?.student_id) query.set('student_id', params.student_id.toString());
    const res = await fetch(`${API_BASE_URL}/v1/fees/payments?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; payments: Payment[] }>(res);
  },

  async getStudentFeeLedger(studentId: number) {
    const res = await fetch(`${API_BASE_URL}/v1/fees/student/${studentId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{
      success: boolean;
      student_id: number;
      student_uid: string;
      full_name: string;
      seat_number: string | null;
      monthly_fee: number;
      fee_status: string;
      total_billed: number;
      total_paid: number;
      total_outstanding: number;
      invoices: Invoice[];
      payments: Payment[];
    }>(res);
  },

  // --- RECEIPTS (PDF) ---
  getReceiptPdfUrl(receiptNumber: string) {
    return `${API_BASE_URL}/v1/receipts/${receiptNumber}/pdf`;
  },

  async downloadReceiptPdf(receiptNumber: string) {
    const res = await fetch(this.getReceiptPdfUrl(receiptNumber), {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to download receipt');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${receiptNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // --- ATTENDANCE ---
  async getDailyAttendance(date?: string) {
    const query = date ? `?date=${date}` : '';
    const res = await fetch(`${API_BASE_URL}/v1/attendance${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; data: DailyAttendanceSummary }>(res);
  },

  async markAttendance(data: { student_id: number; status: string; check_in_time?: string; notes?: string; date?: string }) {
    const res = await fetch(`${API_BASE_URL}/v1/attendance/mark`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; message: string; attendance: any }>(res);
  },

  async bulkMarkAttendance(entries: { student_id: number; status: string; check_in_time?: string }[], date?: string) {
    const res = await fetch(`${API_BASE_URL}/v1/attendance/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ entries, date })
    });
    return handleResponse<{ success: boolean; message: string; count: number }>(res);
  },

  async getStudentAttendance(studentId: number) {
    const res = await fetch(`${API_BASE_URL}/v1/attendance/student/${studentId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; data: any }>(res);
  },

  // --- REPORTS & EXPORTS ---
  async downloadReport(type: 'students' | 'cash-collections' | 'dues' | 'attendance', params?: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v1/reports/export/${type}${query ? `?${query}` : ''}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Report export failed');
    const blob = await res.blob();
    const link = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = link;
    a.download = `sblms_${type}_report.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(link);
    document.body.removeChild(a);
  },

  async getAuditLogs(limit = 100) {
    const res = await fetch(`${API_BASE_URL}/v1/reports/audit-logs?limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; logs: any[] }>(res);
  },

  // --- DASHBOARDS ---
  async getAdminDashboard() {
    const res = await fetch(`${API_BASE_URL}/v1/dashboard/admin`, {
      headers: getAuthHeaders()
    });
    return handleResponse<AdminDashboardData & { success: boolean }>(res);
  },

  async getStudentDashboard() {
    const res = await fetch(`${API_BASE_URL}/v1/dashboard/student`, {
      headers: getAuthHeaders()
    });
    return handleResponse<StudentDashboardData & { success: boolean }>(res);
  },

  // --- PRIVATE DOCUMENTS ---
  getDocumentUrl(studentId: number, docType: 'photo' | 'aadhaar') {
    return `${API_BASE_URL}/v1/students/${studentId}/documents/${docType}`;
  },

  async fetchDocumentBlob(studentId: number, docType: 'photo' | 'aadhaar') {
    const res = await fetch(this.getDocumentUrl(studentId, docType), {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to retrieve private document');
    return res.blob();
  },

  // --- HEALTH CHECK ---
  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return handleResponse<{ status: string; service: string; database: string; timestamp: string }>(res);
  }
};
