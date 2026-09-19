import React from 'react';
import { 
  Globe, 
  Coins, 
  Library, 
  Search, 
  Bookmark, 
  RotateCcw,
  Sparkles 
} from 'lucide-react';

export const WhyDigital: React.FC = () => {
  const features = [
    {
      icon: <Globe className="w-6 h-6 text-amber-400" />,
      title: 'Read Anywhere',
      description: 'Your entire library travels with you on your phone, tablet, or laptop. No heavy backpacks or overdue physical loans.',
      badge: '24/7 Access'
    },
    {
      icon: <Coins className="w-6 h-6 text-emerald-400" />,
      title: 'Affordable Access',
      description: 'Access complete books for ₹5 to ₹20 without buying expensive physical hardcovers or paying monthly subscription traps.',
      badge: 'From ₹5'
    },
    {
      icon: <Library className="w-6 h-6 text-indigo-400" />,
      title: 'Huge Curated Collection',
      description: 'Thousands of public-domain literary masterpieces, foundational science papers, computer science texts, and exam guides.',
      badge: '50,000+ Titles'
    },
    {
      icon: <Search className="w-6 h-6 text-cyan-400" />,
      title: 'Search Instantly',
      description: 'No wandering between library aisles or checking missing book cards. Search topics, authors, or keywords in milliseconds.',
      badge: 'Instant Results'
    },
    {
      icon: <Bookmark className="w-6 h-6 text-rose-400" />,
      title: 'Save Your Books',
      description: 'Build your personal digital bookshelves. Highlight favorite passages, bookmark chapters, and organize your learning.',
      badge: 'Syncs Locally'
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-purple-400" />,
      title: 'Continue Reading',
      description: 'Never lose your page again. Automatic progress tracking resumes right where you stopped across any browser session.',
      badge: 'Seamless State'
    }
  ];

  return (
    <section className="py-20 bg-slate-950/60 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modernizing the Public Library</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Choose a Digital Library?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Physical libraries have served humanity for millennia. Libris brings that sacred democratic mission into the modern era—democratizing access for every student, researcher, and reader on Earth.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center text-xs text-slate-400 font-medium group-hover:text-amber-400 transition-colors">
                <span>Built for modern learning</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
