import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  FileText,
  User,
  Phone,
  Mail,
  Home,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  ArrowRight
} from 'lucide-react';

export const AdmissionPage: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    father_name: '',
    mother_name: '',
    mobile: '',
    email: '',
    password: '',
    whatsapp: '',
    emergency_contact: '',
    aadhaar_number: '',
    dob: '',
    gender: 'Male',
    address: '',
    preparing_for: 'UPSC',
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ student_id: string; full_name: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.full_name || !formData.father_name || !formData.mother_name || !formData.mobile || !formData.email || !formData.aadhaar_number || !formData.dob || !formData.address) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      setError('Mobile number must be exactly 10 digits.');
      return;
    }

    const cleanAadhaar = formData.aadhaar_number.replace(/\s+/g, '').replace(/-/g, '');
    if (cleanAadhaar.length !== 12 || !/^\d+$/.test(cleanAadhaar)) {
      setError('Aadhaar number must be exactly 12 digits.');
      return;
    }

    if (!photoFile) {
      setError('Please select and upload your passport photograph.');
      return;
    }

    if (!aadhaarFile) {
      setError('Please select and upload your Aadhaar document.');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, val);
      });
      data.append('photo', photoFile);
      data.append('aadhaar_photo', aadhaarFile);

      const res = await api.submitAdmission(data);
      if (res.success) {
        setSuccessData({
          student_id: res.student_id,
          full_name: formData.full_name
        });
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please check inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Application Submitted
            </span>
            <h2 className="text-2xl font-black text-navy-950 mt-3">
              Admission Received!
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Congratulations <b>{successData.full_name}</b>, your admission request has been queued for administration desk approval.
            </p>
          </div>

          <div className="bg-navy-950 text-white rounded-2xl p-6 border border-navy-800 text-left space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400 border-b border-navy-800 pb-2">
              <span>Generated Student ID</span>
              <span className="text-gold-400 font-bold uppercase">Save this ID</span>
            </div>
            <div className="text-3xl font-black text-gold-400 tracking-wider">
              {successData.student_id}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              • Status: <b className="text-amber-400">Pending Approval</b><br />
              • Please visit the library desk with your Student ID to confirm your seat allocation and pay your first monthly fee in cash.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/student/login"
              className="flex-1 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold py-3 rounded-xl transition text-sm flex items-center justify-center space-x-2"
            >
              <span>Go to Student Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition text-sm"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Banner */}
        <div className="bg-navy-950 text-white rounded-t-3xl p-8 border-b border-navy-800 shadow-md">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-full border border-gold-500 overflow-hidden bg-navy-900 shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Student Admission Registration
              </h1>
              <p className="text-xs text-gold-400 font-medium">Shree Bala Ji Adhyayan Kendra Library</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Fill in the details accurately. Upload valid documents for identity verification. Once submitted, the admin will approve your application and assign your designated seat number.
          </p>
        </div>

        {/* Admission Form Card */}
        <div className="bg-white rounded-b-3xl p-6 sm:p-10 border border-t-0 border-slate-200 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Personal Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider border-b pb-2 flex items-center space-x-2">
                <User className="w-4 h-4 text-gold-600" />
                <span>1. Personal & Family Information</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Father's Name *
                  </label>
                  <input
                    type="text"
                    name="father_name"
                    required
                    value={formData.father_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mother's Name *
                  </label>
                  <input
                    type="text"
                    name="mother_name"
                    required
                    value={formData.mother_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Sunita Sharma"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Exam / Goal *
                  </label>
                  <select
                    name="preparing_for"
                    value={formData.preparing_for}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  >
                    <option value="UPSC">UPSC Civil Services</option>
                    <option value="RAS">RAS / State PSC</option>
                    <option value="SSC">SSC CGL / CHSL</option>
                    <option value="Banking">Banking (IBPS/SBI)</option>
                    <option value="Railway">Railway Recruitment</option>
                    <option value="NEET">NEET Medical</option>
                    <option value="JEE">JEE Engineering</option>
                    <option value="College">College Degree / Postgrad</option>
                    <option value="Other">Other Competitive Exam</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Contact & Identity */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider border-b pb-2 flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold-600" />
                <span>2. Contact & Identity Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    maxLength={10}
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="Optional (defaults to mobile)"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emergency Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="emergency_contact"
                    required
                    maxLength={10}
                    value={formData.emergency_contact}
                    onChange={handleInputChange}
                    placeholder="Parent / Guardian phone"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    12-Digit Aadhaar Number *
                  </label>
                  <input
                    type="text"
                    name="aadhaar_number"
                    required
                    maxLength={12}
                    value={formData.aadhaar_number}
                    onChange={handleInputChange}
                    placeholder="123456789012"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Residential Address *
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street, Area, City, Pin Code"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-900 focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Portal Login Password (Min 6 Characters) *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create password for student portal login"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Section 3: Document Uploads */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider border-b pb-2 flex items-center space-x-2">
                <Upload className="w-4 h-4 text-gold-600" />
                <span>3. Confidential Documents (Stored in Private Storage)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition">
                  <label className="block text-xs font-bold text-slate-800 mb-1 cursor-pointer">
                    Student Photograph *
                  </label>
                  <p className="text-[11px] text-slate-500 mb-3">JPG, JPEG, or PNG (Max 10 MB)</p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    required
                    onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-navy-900 file:text-white hover:file:bg-navy-800 cursor-pointer"
                  />
                  {photoFile && (
                    <p className="text-xs text-emerald-600 font-semibold mt-2">Selected: {photoFile.name}</p>
                  )}
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition">
                  <label className="block text-xs font-bold text-slate-800 mb-1 cursor-pointer">
                    Aadhaar Card Document *
                  </label>
                  <p className="text-[11px] text-slate-500 mb-3">PDF, JPG, or PNG (Max 10 MB)</p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    required
                    onChange={(e) => setAadhaarFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-navy-900 file:text-white hover:file:bg-navy-800 cursor-pointer"
                  />
                  {aadhaarFile && (
                    <p className="text-xs text-emerald-600 font-semibold mt-2">Selected: {aadhaarFile.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold py-4 rounded-xl text-base shadow-lg transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Submit Admission Application</span>
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-500 mt-3">
                By submitting, you agree to adhere to the discipline, silence rules, and cash fee terms of Shree Bala Ji Library.
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
