import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, BookOpen, ArrowRight, Clock, Flame, Star, Tag } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { CATEGORIES } from '../../data/categories';
import { loadStorage, saveStorage } from '../../utils/storage';

export const GlobalSearchModal: React.FC = () => {
  const { 
    activeModal, 
    closeModal, 
    books, 
    openBookDetails, 
    openReader, 
    openCheckout, 
    isBookUnlocked,
    setActiveCategoryFilter 
  } = useLibrary();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => 
    loadStorage('recent_searches', ['Sherlock Holmes', 'Science', 'Python', 'Stoicism'])
  );

  const isOpen = activeModal.type === 'search';

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  const handleSelectSearch = (term: string) => {
    setQuery(term);
    const updated = [term, ...recentSearches.filter((t) => t !== term)].slice(0, 6);
    setRecentSearches(updated);
    saveStorage('recent_searches', updated);
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
    saveStorage('recent_searches', []);
  };

  // Matched categories when user types e.g. "science" or "programming"
  const matchingCategories = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return CATEGORIES.filter((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  }, [query]);

  // Matching books
  const matchingBooks = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return books.filter((b) => {
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.categoryLabel.toLowerCase().includes(q) ||
        b.synopsis.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }).slice(0, 8);
  }, [books, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl bg-[#0F1422] border border-slate-700/80 shadow-2xl overflow-hidden text-slate-200"
      >
        {/* Search Input Header */}
        <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, authors, categories (try 'python', 'science')..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeModal}
            className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-mono"
          >
            ESC
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-6 custom-scrollbar">
          
          {query.trim() === '' ? (
            /* Default screen with Popular & Recent queries */
            <div className="space-y-6 text-xs">
              
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-slate-400 font-semibold mb-2.5">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Recent Searches
                    </span>
                    <button 
                      onClick={handleClearHistory}
                      className="hover:text-slate-200 transition-colors text-[10px]"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSelectSearch(term)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                      >
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-slate-400 font-semibold mb-2.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Popular in Library
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Frankenstein',
                    'Sherlock Holmes',
                    'Albert Einstein',
                    'Marcus Aurelius',
                    'Python Programming',
                    'Competitive Exams'
                  ].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSelectSearch(term)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse Categories Directly */}
              <div>
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-slate-400 font-semibold mb-2.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  Quick Discipline Jump
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.slice(0, 6).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveCategoryFilter(c.id);
                        closeModal();
                      }}
                      className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left hover:border-amber-500/30 transition-all flex items-center justify-between group"
                    >
                      <span className="font-semibold text-slate-200 group-hover:text-amber-400">
                        {c.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Search Results */
            <div className="space-y-6">
              
              {/* Matching Categories preview */}
              {matchingCategories.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Matched Categories
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {matchingCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategoryFilter(cat.id);
                          closeModal();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 hover:bg-amber-500/20"
                      >
                        <span>Filter by {cat.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Books list */}
              {matchingBooks.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Matching Books ({matchingBooks.length})
                  </span>
                  <div className="divide-y divide-slate-800/80 rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
                    {matchingBooks.map((book) => {
                      const unlocked = isBookUnlocked(book.id);
                      return (
                        <div
                          key={book.id}
                          onClick={() => {
                            closeModal();
                            openBookDetails(book.id);
                          }}
                          className="p-3.5 flex items-center justify-between hover:bg-slate-800/50 transition-colors cursor-pointer gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={book.coverUrl}
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded shadow-sm border border-slate-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-white truncate">
                                {book.title}
                              </h4>
                              <p className="text-xs text-slate-400 truncate">
                                by {book.author} • {book.categoryLabel}
                              </p>
                              <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold mt-0.5">
                                <Star className="w-3 h-3 fill-amber-400" />
                                <span>{book.rating.toFixed(1)}</span>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-300">
                                  {book.price === 0 ? 'Free' : `₹${book.price}`}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              closeModal();
                              if (unlocked) {
                                openReader(book);
                              } else {
                                openCheckout(book.id);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shrink-0 transition-all"
                          >
                            {unlocked ? 'Read' : 'Unlock'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* No Results */
                <div className="py-12 text-center text-xs space-y-2">
                  <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="font-bold text-white text-sm">No volumes found for "{query}"</p>
                  <p className="text-slate-400 max-w-sm mx-auto">
                    Try searching for authors like "Mary Shelley", "Einstein", or subjects like "Science" and "Literature".
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
