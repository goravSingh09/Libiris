import React from 'react';
import { 
  BookOpen, 
  Atom, 
  Cpu, 
  Landmark, 
  Binary, 
  TrendingUp, 
  Brain, 
  Sparkles, 
  Feather, 
  Terminal, 
  Smile, 
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES, CategoryInfo } from '../../data/categories';
import { CategoryId } from '../../types';

interface CategoryGridProps {
  onSelectCategory: (categoryId: CategoryId) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-6 h-6" />,
  Atom: <Atom className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  Landmark: <Landmark className="w-6 h-6" />,
  Binary: <Binary className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Feather: <Feather className="w-6 h-6" />,
  Terminal: <Terminal className="w-6 h-6" />,
  Smile: <Smile className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-16 border-t border-slate-800/60 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Extensive Curated Collections</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore the Library
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              From foundational Greek philosophy to cutting-edge computer science and competitive exam syllabi.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Click any discipline to filter the full catalogue
          </div>
        </div>

        {/* 12-Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat: CategoryInfo) => {
            const icon = ICON_MAP[cat.iconName] || <BookOpen className="w-6 h-6" />;

            return (
              <a
                key={cat.id}
                href={`/category/${cat.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCategory(cat.id);
                }}
                className="group relative flex flex-col p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/5 cursor-pointer block"
              >
                {/* Category Icon */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 shadow-inner"
                  style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                >
                  {icon}
                </div>

                {/* Category Name */}
                <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors leading-tight">
                  {cat.name}
                </h3>

                {/* Book Count */}
                <span className="text-[11px] text-slate-400 mt-1 font-mono">
                  {cat.bookCount.toLocaleString()}+ titles
                </span>

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center text-[10px] text-amber-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Browse</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};
