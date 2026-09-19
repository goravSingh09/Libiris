import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Grid3X3, 
  List, 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  BookOpen
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { CATEGORIES } from '../../data/categories';
import { CategoryId, Book } from '../../types';
import { BookCard } from './BookCard';

export const LibraryCatalogue: React.FC = () => {
  const { 
    books, 
    activeCategoryFilter, 
    setActiveCategoryFilter, 
    searchQuery, 
    setSearchQuery,
    openBookDetails,
    openReader,
    openCheckout,
    isBookUnlocked
  } = useLibrary();

  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'under10' | 'under20'>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'newest' | 'priceLow'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const booksPerPage = 12;

  // Extract unique authors and languages
  const allAuthors = useMemo(() => {
    const list = Array.from(new Set(books.map((b) => b.author))).sort();
    return list;
  }, [books]);

  const allLanguages = useMemo(() => {
    const list = Array.from(new Set(books.map((b) => b.language))).sort();
    return list;
  }, [books]);

  // Filter & sort pipeline
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Category filter
        if (activeCategoryFilter !== 'all' && book.category !== activeCategoryFilter) {
          return false;
        }

        // Author filter
        if (authorFilter !== 'all' && book.author !== authorFilter) {
          return false;
        }

        // Language filter
        if (languageFilter !== 'all' && book.language !== languageFilter) {
          return false;
        }

        // Price filter
        if (priceFilter === 'free' && book.price !== 0) return false;
        if (priceFilter === 'under10' && book.price > 10) return false;
        if (priceFilter === 'under20' && book.price > 20) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchCategory = book.categoryLabel.toLowerCase().includes(q);
          const matchSynopsis = book.synopsis.toLowerCase().includes(q);
          const matchTags = book.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchAuthor && !matchCategory && !matchSynopsis && !matchTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popularity') return b.readsCount - a.readsCount;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.publishedYear - a.publishedYear;
        if (sortBy === 'priceLow') return a.price - b.price;
        return 0;
      });
  }, [books, activeCategoryFilter, authorFilter, languageFilter, priceFilter, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage) || 1;
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * booksPerPage;
    return filteredBooks.slice(start, start + booksPerPage);
  }, [filteredBooks, currentPage]);

  const resetFilters = () => {
    setActiveCategoryFilter('all');
    setAuthorFilter('all');
    setLanguageFilter('all');
    setPriceFilter('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters = 
    activeCategoryFilter !== 'all' || 
    authorFilter !== 'all' || 
    languageFilter !== 'all' || 
    priceFilter !== 'all' || 
    searchQuery.trim() !== '';

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Digital Repository</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Library Catalogue
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Showing <span className="text-white font-semibold">{filteredBooks.length}</span> verified titles across science, literature, history, and computing.
          </p>
        </div>

        {/* View Mode & Reset */}
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl space-y-4">
        
        {/* Top search & sorting row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Live Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, author, topics, or ISBN..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/80 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-500/80 cursor-pointer"
              >
                <option value="popularity">Sort by: Popularity (Reads)</option>
                <option value="rating">Sort by: Highest Rated</option>
                <option value="newest">Sort by: Newest Edition</option>
                <option value="priceLow">Sort by: Price (Low to High)</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="md:col-span-3">
            <select
              value={priceFilter}
              onChange={(e) => {
                setPriceFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-500/80 cursor-pointer"
            >
              <option value="all">Price: All Tiers</option>
              <option value="free">Price: 100% Free Public Domain</option>
              <option value="under10">Price: Under ₹10 Micro-Pass</option>
              <option value="under20">Price: Under ₹20 Reference</option>
            </select>
          </div>

        </div>

        {/* Secondary Filters: Author, Language, Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 pt-2 border-t border-slate-800/60 items-center">
          
          {/* Category Dropdown or quick pill selector */}
          <div className="md:col-span-4">
            <select
              value={activeCategoryFilter}
              onChange={(e) => {
                setActiveCategoryFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full pl-3.5 pr-8 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-amber-500/80 cursor-pointer"
            >
              <option value="all">Category: All Disciplines ({books.length})</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Author filter */}
          <div className="md:col-span-4">
            <select
              value={authorFilter}
              onChange={(e) => {
                setAuthorFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-3.5 pr-8 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-amber-500/80 cursor-pointer"
            >
              <option value="all">Author: All Authors ({allAuthors.length})</option>
              {allAuthors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="md:col-span-4">
            <select
              value={languageFilter}
              onChange={(e) => {
                setLanguageFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-3.5 pr-8 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-amber-500/80 cursor-pointer"
            >
              <option value="all">Language: All Languages</option>
              {allLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Book Results Grid or List */}
      {paginatedBooks.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedBooks.map((book) => {
                const unlocked = isBookUnlocked(book.id);
                return (
                  <div
                    key={book.id}
                    onClick={() => openBookDetails(book.id)}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900/90 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between cursor-pointer"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-16 h-22 object-cover rounded-lg shadow-md border border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {book.categoryLabel}
                          </span>
                          <span className="text-xs text-slate-400">
                            ★ {book.rating.toFixed(1)} ({book.reviewCount})
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white leading-tight">
                          {book.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                          by <span className="text-slate-300">{book.author}</span> • {book.pageCount} pages • {book.publishedYear > 0 ? book.publishedYear : `${Math.abs(book.publishedYear)} BC`}
                        </p>
                        <p className="text-xs text-slate-400/90 mt-1 line-clamp-1 max-w-xl">
                          {book.synopsis}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-sm font-bold text-amber-400">
                        {book.price === 0 ? 'Free' : `₹${book.price}`}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (unlocked) {
                            openReader(book);
                          } else {
                            openCheckout(book.id);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          unlocked
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                            : 'bg-slate-800 text-slate-200 hover:bg-amber-500 hover:text-slate-950'
                        }`}
                      >
                        {unlocked ? 'Read Now' : 'Unlock'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setCurrentPage(p);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      currentPage === p
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 max-w-lg mx-auto">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Matching Volumes Found</h3>
          <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
            We couldn't find any books matching your filter criteria. Try resetting your query or exploring other categories.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
          >
            Clear All Active Filters
          </button>
        </div>
      )}

    </div>
  );
};
