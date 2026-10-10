import React from 'react';
import { Link } from 'react-router-dom';
import {
  Armchair,
  Wifi,
  Snowflake,
  ShieldCheck,
  Car,
  Droplets,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  FileText,
  AlertCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const facilities = [
    { icon: Armchair, title: "120 Dedicated Seats", desc: "Ergonomic study chairs with comfortable partitioned wooden desks." },
    { icon: Snowflake, title: "Fully Air Conditioned", desc: "Climate-controlled halls ensuring maximum focus during intense study hours." },
    { icon: Wifi, title: "High-Speed Wi-Fi", desc: "Reliable fiber internet for video lectures, mock tests, and research." },
    { icon: ShieldCheck, title: "24/7 CCTV Security", desc: "Round-the-clock camera monitoring ensuring complete student safety." },
    { icon: Droplets, title: "RO Drinking Water", desc: "Clean chilled and normal purified drinking water available at all times." },
    { icon: Car, title: "Dedicated Parking", desc: "Safe two-wheeler and vehicle parking area right in front of the premises." },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 text-white py-16 lg:py-24 border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                <span>Empowering Minds Since 2022 • Nagaur</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Shree Bala Ji <br />
                <span className="text-gold-400">Adhyayan Kendra Library</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                A disciplined, peaceful, fully air-conditioned self-study reading hall designed for competitive exam aspirants. Dedicated desks, silent environment, and verified seat allocations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/admission"
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-7 py-3.5 rounded-xl shadow-lg transition duration-200 flex items-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Apply for Admission</span>
                </Link>
                <Link
                  to="/student/login"
                  className="bg-navy-800/80 hover:bg-navy-700 text-slate-100 font-semibold px-6 py-3.5 rounded-xl border border-slate-700 transition duration-200 flex items-center space-x-2"
                >
                  <span>Student Portal Login</span>
                </Link>
              </div>

              {/* Strict Cash Fee Notice */}
              <div className="bg-navy-950/60 border border-gold-500/20 rounded-xl p-4 flex items-start space-x-3 text-xs text-slate-300 max-w-xl">
                <AlertCircle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gold-300">Desk Cash Fee Policy:</strong> Monthly library fees are received strictly in <b>Cash</b> at the library administration desk. Official receipts are issued instantly in printed/PDF format with verified receipt numbers. No online gateway payments are collected.
                </div>
              </div>
            </div>

            {/* Right Column: Library Banner */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden border-2 border-gold-500/40 shadow-2xl bg-navy-950 max-w-md w-full">
                <img
                  src="/banner.png"
                  alt="Shree Bala Ji Library Hall"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent p-4 text-center">
                  <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest">
                    Quiet Study Space • Open 7 Days
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-bold text-teal-600 tracking-widest mb-2">
            Modern Reading Hall
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Everything You Need For Uninterrupted Preparation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center shrink-0 border border-navy-100">
                  <Icon className="w-6 h-6 text-navy-700" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-950 text-base mb-1">{fac.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{fac.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timings & Fee Structure */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* Timings Card */}
            <div className="bg-navy-900 text-white rounded-2xl p-8 border border-navy-800 shadow-lg space-y-5">
              <div className="flex items-center space-x-3 text-gold-400">
                <Clock className="w-6 h-6" />
                <h3 className="text-lg font-bold">Library Study Timings</h3>
              </div>
              <p className="text-slate-300 text-sm">
                We are open 7 days a week, 365 days a year to support your daily preparation schedule.
              </p>
              <div className="bg-navy-950/80 rounded-xl p-5 border border-navy-800 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 font-medium">Monday – Sunday</span>
                  <span className="font-bold text-gold-400">5:00 AM – 10:00 PM</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-navy-800">
                  <span>Operating Schedule</span>
                  <span className="text-emerald-400 font-semibold">Open All 7 Days</span>
                </div>
              </div>
            </div>

            {/* Fee & Admission Info */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-navy-900">Affordable Monthly Study Fees</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Standard monthly study fee starting from <b>Rs. 500 / month</b>. Every admission receives an assigned seat number, student identification card, and manual monthly fee ledger.
              </p>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>Fixed, numbered desk allocation (Seats 1 to 120)</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>Official printed and PDF cash receipts for all payments</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>Daily attendance tracking and self-service student portal</span>
                </li>
              </ul>
              <div>
                <Link
                  to="/admission"
                  className="inline-flex items-center space-x-2 bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 py-3 rounded-xl transition"
                >
                  <span>Register Online Now</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-4">Visit Us or Inquire</h2>
              <p className="text-slate-600 text-sm mb-6">
                Feel free to visit the library premises during study hours to inspect available seats and complete your verification.
              </p>
              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Address:</strong> Opp. Mali Samaj, Hari Om Market, Didwana Road, Nagaur (Rajasthan)
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gold-600 shrink-0" />
                  <div>
                    <strong>Phone:</strong> +91 9413402116 / +91 8290167664
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gold-600 shrink-0" />
                  <div>
                    <strong>Email:</strong> shreebalajilibrary2116@gmail.com
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold-500/10 text-gold-600 flex items-center justify-center mx-auto">
                <Armchair className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-navy-900 text-lg">Check Available Seats</h3>
              <p className="text-xs text-slate-500">
                Admission is subject to seat availability out of our 120 total capacity.
              </p>
              <Link
                to="/admission"
                className="block w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold py-3 rounded-xl transition text-sm"
              >
                Submit Admission Form
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 text-slate-400 py-10 border-t border-navy-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="text-slate-300 font-semibold text-sm">
            Shree Bala Ji Adhyayan Kendra Library • Nagaur (Rajasthan)
          </p>
          <p>
            Self Study Reading Room • Library Management System (SBLMS) • Cash-Only Fee Ledger
          </p>
        </div>
      </footer>
    </div>
  );
};
