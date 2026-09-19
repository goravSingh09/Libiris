import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Shield, 
  Users, 
  Layers, 
  Coins, 
  Star,
  Shuffle
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

interface HeroProps {
  onExplore: () => void;
  onReadFeatured: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onReadFeatured }) => {
  const { books, openReader, openSearch, setSearchQuery } = useLibrary();
  const [localSearch, setLocalSearch] = useState('');

  const featuredBook = books.find((b) => b.id === 'frankenstein') || books[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      onExplore();
    } else {
      openSearch();
    }
  };

  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * books.length);
    const randomBook = books[randomIndex];
    openReader(randomBook);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-indigo-600/10 to-teal-500/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -top-10 right-10 w-72 h-72 bg-amber-500/5 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines, Search, CTAs & Demo Stats */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>A Complete Digital Replacement for Physical Libraries</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-sans">
                Your Library, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                  Anywhere.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover, borrow, and read books online at a fraction of the cost of a traditional library. Public-domain treasures, academic texts, and timeless literature at your fingertips from ₹5.
              </p>
            </div>

            {/* Interactive Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0">
              <div className="relative flex items-center p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl focus-within:border-amber-500/80 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
                <div className="pl-3.5 pr-2 text-slate-400">
                  <Search className="w-5 h-5 text-amber-400" />
                </div>
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search 50,000+ books, authors, or topics (e.g., Python, Einstein)..."
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none py-2"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-amber-500/25 shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-400 justify-center lg:justify-start">
                <span className="text-slate-400">Popular:</span>
                {['Sherlock Holmes', 'Science', 'Stoicism', 'Python'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setLocalSearch(term);
                      setSearchQuery(term);
                      onExplore();
                    }}
                    className="hover:text-amber-400 underline decoration-slate-600 underline-offset-2 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExplore}
                className="px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base transition-all duration-200 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
                <span>Explore Catalogue</span>
              </button>

              <button
                onClick={onReadFeatured}
                className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-base border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Start Reading (Demo)</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={handleSurpriseMe}
                className="px-4 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 text-amber-400 font-semibold text-sm border border-amber-500/20 hover:border-amber-500/50 transition-all flex items-center gap-2"
                title="Open a random classic in the reader"
              >
                <Shuffle className="w-4 h-4" />
                <span>Surprise Me</span>
              </button>
            </div>

            {/* Trust and Usage Statistics (Clearly marked demo data) */}
            <div className="pt-6 border-t border-slate-800/80">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
                  <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xl sm:text-2xl font-black text-white">50,000+</span>
                  </div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Digital Books</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
                  <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xl sm:text-2xl font-black text-white">10,000+</span>
                  </div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Active Readers</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
                  <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                    <Layers className="w-4 h-4" />
                    <span className="text-xl sm:text-2xl font-black text-white">100+</span>
                  </div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Categories</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
                  <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                    <Coins className="w-4 h-4" />
                    <span className="text-xl sm:text-2xl font-black text-white">From ₹5</span>
                  </div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Micro-Access</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center lg:text-left">
                * Sample catalog & community metrics displayed for competition demonstration.
              </p>
            </div>

          </div>

          {/* Right Column: Visual Showcase (Interactive Book Stage & Reader Teaser) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Ambient Backing Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-indigo-600/20 blur-2xl rounded-3xl" />

            {/* Central Showcase Card */}
            <div className="relative w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-700/80 p-6 shadow-2xl backdrop-blur-xl">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Book of the Day
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Public Domain Classic
                </span>
              </div>

              {/* Book Presentation with 3D Spine and Cover */}
              <div className="pt-6 flex gap-5 items-center">
                <div className="relative w-36 sm:w-44 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/80 shrink-0 border border-slate-700/60 group">
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />
                  <img
                    src={featuredBook.coverUrl}
                    alt={featuredBook.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-center">
                    <span className="text-[10px] text-amber-300 font-semibold px-1.5 py-0.5 bg-black/60 rounded">
                      {featuredBook.pageCount} Pages
                    </span>
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{featuredBook.rating}</span>
                    <span className="text-slate-400">({featuredBook.reviewCount})</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                    {featuredBook.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    by <span className="text-slate-200 font-medium">{featuredBook.author}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                    "{featuredBook.excerpt}"
                  </p>
                  
                  <div className="pt-2">
                    <button
                      onClick={() => openReader(featuredBook)}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read Online Now</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Floating Micro-Reviews Badge */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Instant browser access</span>
                </div>
                <div className="text-amber-400 font-semibold">
                  Zero waitlists
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
