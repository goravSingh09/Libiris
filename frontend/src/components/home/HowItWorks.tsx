import React from 'react';
import { Search, Unlock, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

interface HowItWorksProps {
  onStartReading: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartReading }) => {
  const steps = [
    {
      number: '01',
      icon: <Search className="w-6 h-6 text-amber-400" />,
      title: 'Find a Book',
      description: 'Search our 50,000+ title archive by title, author, keyword, or browse by 12 curated disciplines from classical literature to competitive exams.'
    },
    {
      number: '02',
      icon: <Unlock className="w-6 h-6 text-emerald-400" />,
      title: 'Unlock Access',
      description: 'Public-domain classics are 100% free forever. Contemporary reference titles unlock for a nominal ₹5 to ₹20 micro-contribution.'
    },
    {
      number: '03',
      icon: <BookOpen className="w-6 h-6 text-indigo-400" />,
      title: 'Start Reading',
      description: 'Enjoy a beautiful distraction-free digital reading suite with Sepia/Dark modes, instant page bookmarks, and automatic cloud-synced progress.'
    }
  ];

  return (
    <section className="py-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simplicity By Design</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Libiris Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            No registration friction, no multi-week waiting lists, and no cumbersome physical checkouts.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-amber-500/30 via-emerald-500/30 to-indigo-500/30 -translate-y-6 z-0" />

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative z-10 flex flex-col items-center text-center p-8 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all duration-300 shadow-xl group"
            >
              {/* Step number badge */}
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:border-amber-500/50 transition-all">
                {step.icon}
              </div>

              <span className="text-xs font-mono font-bold text-amber-400 tracking-wider mb-2">
                STEP {step.number}
              </span>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                {step.title}
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Start reading CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={onStartReading}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-amber-500/20 hover:scale-105"
          >
            <span>Open Reader Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
