import React from 'react';
import { BookOpen, ShieldCheck, Heart, Sparkles, Compass, HelpCircle } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { CategoryId } from '../../types';

interface FooterProps {
  onSelectCategory: (cat: CategoryId) => void;
  onNavigateTab: (tab: 'home' | 'library' | 'my-library' | 'pricing' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onNavigateTab }) => {
  return (
    <footer className="bg-[#080B12] border-t border-slate-800/80 text-slate-400 text-sm mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <BookOpen className="w-5 h-5 text-slate-950 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-sans">
                Libris
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              The Digital Public Library. Bringing the timeless sanctuary of physical libraries into the modern browser. Access public-domain treasures, academic literature, and human knowledge anytime, anywhere from ₹5.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Public Domain & Open License Compliant
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" />
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigateTab('library')} className="hover:text-amber-400 transition-colors">
                  Digital Catalogue (30+ Works)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('my-library')} className="hover:text-amber-400 transition-colors">
                  My Library & Progress
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('pricing')} className="hover:text-amber-400 transition-colors">
                  Micro-Access Pricing (from ₹5)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('admin')} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>Library Management (Admin)</span>
                  <span className="px-1 py-0.2 text-[9px] bg-slate-800 text-amber-400 rounded">Demo</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Popular Genres
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onNavigateTab('library');
                    }}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Standards & Philosophy */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Ethics & Standards
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p>
                All featured classics are in the worldwide public domain or published under verified open-knowledge licenses.
              </p>
              <p className="text-[11px] text-slate-400">
                Sample statistics, simulated payment gateways, and demo accounts are prepared specifically for competition evaluation.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Libris Digital Public Library Project. Designed for competition excellence.</p>
          <div className="flex items-center gap-2">
            <span>Built with precision</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for lifelong readers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
