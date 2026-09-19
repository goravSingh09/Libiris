import React from 'react';
import { Check, X, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';

interface ComparisonSectionProps {
  onOpenLibrary: () => void;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ onOpenLibrary }) => {
  const comparisonData = [
    {
      feature: 'Geographic Access',
      traditional: 'Physical commute required; limited by neighbourhood branch location',
      digital: 'Read anywhere globally on phone, tablet, laptop, or desktop browser',
      isDigitalAdvantage: true
    },
    {
      feature: 'Operating Hours',
      traditional: 'Fixed schedule (typically 9 AM – 6 PM, closed on holidays)',
      digital: 'Available 24 hours a day, 7 days a week, 365 days a year',
      isDigitalAdvantage: true
    },
    {
      feature: 'Copy Availability & Holds',
      traditional: 'Limited physical inventory; popular books involve multi-week queues',
      digital: 'Instant simultaneous access for thousands of simultaneous readers',
      isDigitalAdvantage: true
    },
    {
      feature: 'Search & Discovery',
      traditional: 'Manual catalog cards or terminal lookups followed by shelf navigation',
      digital: 'Full-text instantaneous search with automated genre & author filtering',
      isDigitalAdvantage: true
    },
    {
      feature: 'Cost & Accessibility Model',
      traditional: 'Annual subscription fee, security deposits, and late return penalties',
      digital: 'Zero deposit, 100% free public domain titles, or ₹5–₹20 pay-per-book',
      isDigitalAdvantage: true
    }
  ];

  return (
    <section className="py-20 bg-slate-950/70 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Factual Comparative Analysis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Traditional Library vs. Libris Digital
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            While we honor physical libraries as civil institutions, digital accessibility dissolves barriers of physical distance, restricted hours, and shelf limits.
          </p>
        </div>

        {/* Comparison Table / Card Matrix */}
        <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl">
          
          {/* Header row */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-900/90 border-b border-slate-800 p-5 text-sm font-bold">
            <div className="md:col-span-4 text-slate-400">Library Capability</div>
            <div className="md:col-span-4 text-slate-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span>Traditional Physical Library</span>
            </div>
            <div className="md:col-span-4 text-amber-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Libris Digital Library</span>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-800/60 text-xs sm:text-sm">
            {comparisonData.map((row, idx) => (
              <div 
                key={idx} 
                className="grid grid-cols-1 md:grid-cols-12 p-5 gap-4 items-center hover:bg-slate-800/30 transition-colors"
              >
                <div className="md:col-span-4 font-semibold text-white">
                  {row.feature}
                </div>
                <div className="md:col-span-4 text-slate-400 flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{row.traditional}</span>
                </div>
                <div className="md:col-span-4 text-slate-200 font-medium flex items-start gap-2.5 bg-amber-500/5 -my-2 py-2 px-3 rounded-xl border border-amber-500/20">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{row.digital}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Strong Final CTA Card */}
        <div className="mt-16 max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-amber-500/20 via-indigo-600/10 to-amber-500/10 border border-amber-500/40 p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Open the Library
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Begin exploring over thirty curated foundational classics, science manuals, and programming treatises right inside your browser today.
          </p>

          <button
            onClick={onOpenLibrary}
            className="px-9 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base transition-all shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-5 h-5 stroke-[2.5]" />
            <span>Enter the Full Catalogue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};
