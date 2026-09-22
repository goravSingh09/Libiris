import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Flame, 
  User as UserIcon, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  BookmarkCheck
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

interface NavbarProps {
  currentTab: 'home' | 'library' | 'my-library' | 'pricing' | 'admin';
  setCurrentTab: (tab: 'home' | 'library' | 'my-library' | 'pricing' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, userLibrary, openSearch, openAuth } = useLibrary();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const savedCount = Object.keys(userLibrary).length;

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20' 
          : 'bg-[#0B0F19]/70 backdrop-blur-sm border-b border-slate-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <a 
            href="/"
            onClick={(e) => { e.preventDefault(); setCurrentTab('home'); }}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-white font-sans">
                  Libiris
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Digital
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                The Digital Public Library
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); setCurrentTab('home'); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentTab === 'home'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Discover
            </a>
            <a
              href="/catalogue"
              onClick={(e) => { e.preventDefault(); setCurrentTab('library'); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentTab === 'library'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Catalogue
            </a>
            <a
              href="/pricing"
              onClick={(e) => { e.preventDefault(); setCurrentTab('pricing'); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentTab === 'pricing'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Access & Pricing
            </a>
            <button
              onClick={() => setCurrentTab('my-library')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'my-library'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>My Library</span>
              {savedCount > 0 && (
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  currentTab === 'my-library' 
                    ? 'bg-slate-950 text-amber-400' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {savedCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-3 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-1 text-slate-400 hover:text-slate-200 ${
                currentTab === 'admin' ? 'text-amber-400 bg-slate-800' : ''
              }`}
              title="Admin Portal Demo"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Quick Search Button & Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={openSearch}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-all w-52 justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Search library...</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Reading Streak Indicator */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-semibold cursor-help"
              title={`${user.readingStreakDays}-day daily reading streak active!`}
            >
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{user.readingStreakDays}d streak</span>
            </div>

            {/* Profile Button */}
            <button
              onClick={() => openAuth('login')}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all text-left group"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover border border-amber-500/30 group-hover:border-amber-400 transition-colors"
              />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-200 leading-tight flex items-center gap-1">
                  {user.name.split(' ')[0]}
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                </span>
                <span className="text-[10px] text-amber-400/90 font-mono">
                  {user.tier}
                </span>
              </div>
            </button>
          </div>

          {/* Mobile menu trigger button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={openSearch}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-amber-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0B0F19]/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between py-2 border-b border-slate-800/80 mb-2">
            <div className="flex items-center gap-2.5">
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-lg object-cover" />
              <div>
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-amber-400">{user.tier}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{user.readingStreakDays}d streak</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left text-sm font-medium ${
                currentTab === 'home' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-200'
              }`}
            >
              Discover Home
            </button>
            <button
              onClick={() => { setCurrentTab('library'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left text-sm font-medium ${
                currentTab === 'library' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-200'
              }`}
            >
              Catalogue
            </button>
            <button
              onClick={() => { setCurrentTab('my-library'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left text-sm font-medium flex items-center justify-between ${
                currentTab === 'my-library' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-200'
              }`}
            >
              <span>My Library</span>
              <span className="text-xs bg-slate-800/80 px-2 py-0.5 rounded-full text-amber-300">
                {savedCount}
              </span>
            </button>
            <button
              onClick={() => { setCurrentTab('pricing'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left text-sm font-medium ${
                currentTab === 'pricing' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-200'
              }`}
            >
              Pricing (from ₹5)
            </button>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => { setCurrentTab('admin'); setMobileMenuOpen(false); }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Management</span>
            </button>
            <button
              onClick={() => { openAuth('login'); setMobileMenuOpen(false); }}
              className="py-2.5 px-4 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <UserIcon className="w-4 h-4" />
              <span>Switch Account</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
