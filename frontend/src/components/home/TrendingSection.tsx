import React, { useState } from 'react';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { BookCard } from '../library/BookCard';

interface TrendingSectionProps {
  onViewAll: () => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ onViewAll }) => {
  const { books } = useLibrary();
  const [filter, setFilter] = useState<'all' | 'free' | 'micro'>('all');

  const trendingBooks = books.filter((b) => b.isTrending || b.rating >= 4.8);

  const displayedBooks = trendingBooks.filter((book) => {
    if (filter === 'free') return book.price === 0;
    if (filter === 'micro') return book.price > 0;
    return true;
  }).slice(0, 8);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Subheading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Read from ₹5 • Zero Library Borrowing Cards Required</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trending This Week
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              The most read, bookmarked, and studied volumes across literature, computing, and historical wisdom.
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Popular
            </button>
            <button
              onClick={() => setFilter('free')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'free'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Free Classics
            </button>
            <button
              onClick={() => setFilter('micro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'micro'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ₹5 - ₹15 Micro-Pass
            </button>
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <a
            href="/catalogue"
            onClick={(e) => {
              e.preventDefault();
              onViewAll();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-amber-500/10"
          >
            <span>Explore Entire 30+ Volume Library Catalogue</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </a>
        </div>

      </div>
    </section>
  );
};
