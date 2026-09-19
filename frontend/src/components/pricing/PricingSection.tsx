import React from 'react';
import { Check, Sparkles, HelpCircle, ShieldCheck, ArrowRight, Heart } from 'lucide-react';

interface PricingSectionProps {
  onExploreCatalog: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onExploreCatalog }) => {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-4 border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Democratic Knowledge Model</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Access Knowledge Without the Cost of Ownership
        </h1>
        <p className="text-slate-400 text-base sm:text-lg mt-3 leading-relaxed">
          Physical libraries have always operated as communal goods. Libris extends this spirit: read public classics for free, and unlock curated reference editions starting from ₹5.
        </p>
      </div>

      {/* 3 Pricing Tier Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
        
        {/* Tier 1: Free Public Domain */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-4 border border-emerald-500/20">
              FREE FOREVER
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Public Domain Classics</h3>
            <p className="text-xs text-slate-400 mb-6">
              Complete open access to human civilization's literary and philosophical heritage.
            </p>

            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">₹0</span>
              <span className="text-xs text-slate-400 font-medium">/ forever</span>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              {[
                'Unlimited access to all public domain titles',
                'Distraction-free reading engine with Sepia & Dark modes',
                'Personal library with synchronized reading progress',
                'Page bookmarks & personal annotation memory',
                'Standard text-to-speech audio reader'
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-800/80">
            <button
              onClick={onExploreCatalog}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              Start Reading Free Titles
            </button>
          </div>
        </div>

        {/* Tier 2: Pay-Per-Book Micro Access (Highlighted) */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500 p-8 flex flex-col justify-between shadow-2xl shadow-amber-500/10 scale-105 z-10">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-md">
            Most Popular & Affordable
          </div>

          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-4 border border-amber-500/20">
              MICRO-ACCESS PASS
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Pay-Per-Book</h3>
            <p className="text-xs text-slate-400 mb-6">
              Unlock specific reference books, programming textbooks, or exam manuals for a cup of tea's cost.
            </p>

            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-black text-amber-400">₹5 - ₹20</span>
              <span className="text-xs text-slate-400 font-medium">/ book (one-time)</span>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
              {[
                'Permanent unlimited reading access to unlocked book',
                'Zero recurring charges or tricky monthly auto-renewals',
                'Cloud-synced page progress & bookmarks',
                'High-performance reader with typography scaling',
                'Simulated instant checkout for seamless testing'
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-800/80">
            <button
              onClick={onExploreCatalog}
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-xl shadow-amber-500/25 cursor-pointer"
            >
              Browse ₹5 Micro-Pass Books
            </button>
          </div>
        </div>

        {/* Tier 3: Digital Patron Membership */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-4 border border-indigo-500/20">
              OPTIONAL MEMBERSHIP
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Digital Patron Pass</h3>
            <p className="text-xs text-slate-400 mb-6">
              For voracious students, competitive exam aspirants, and lifelong researchers.
            </p>

            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">₹199</span>
              <span className="text-xs text-slate-400 font-medium">/ month (concept)</span>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              {[
                'Unlimited access across the entire 50,000+ volume collection',
                'Early access to newly digitized historical archives',
                'Digital Patron profile badge in community reviews',
                'Supports ongoing digitization of public libraries',
                'Offline cache reading privileges'
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-800/80">
            <button
              onClick={onExploreCatalog}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              Explore Patron Benefits
            </button>
          </div>
        </div>

      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900/50 border border-slate-800 p-8 sm:p-10 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>Frequently Asked Questions About Access & Pricing</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-300">
          <div className="space-y-2">
            <h4 className="font-bold text-white">Why charge ₹5 to ₹10 for digital access?</h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              Physical libraries require tax funding or membership fees to maintain premises, shelf space, and staff. A nominal ₹5 contribution enables high-speed cloud hosting, optical text digitization, and continuous platform maintenance without intrusive ads.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white">Do unlocked books ever expire?</h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              No! Once you unlock a book on Libris, it remains permanently accessible in your personal library with all your saved notes and bookmarks.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white">Can I read on multiple devices?</h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              Yes. Libris operates entirely in the browser with responsive typography, seamlessly functioning across smartphones, tablets, Chromebooks, and desktops.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white">How does the competition demo payment work?</h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              In accordance with evaluation rules, all micro-payments are completely simulated on the client side. Clicking "Confirm Unlock" safely adds the book to your account instantly without requesting real credit cards.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
