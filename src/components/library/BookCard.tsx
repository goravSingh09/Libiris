import React from 'react';
import { Star, BookOpen, Bookmark, Check, Sparkles, Lock } from 'lucide-react';
import { Book } from '../../types';
import { useLibrary } from '../../context/LibraryContext';

interface BookCardProps {
  book: Book;
  compact?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, compact = false }) => {
  const { 
    openBookDetails, 
    openReader, 
    openCheckout,
    toggleSaveBook, 
    isBookUnlocked, 
    isBookSaved,
    userLibrary
  } = useLibrary();

  const unlocked = isBookUnlocked(book.id);
  const saved = isBookSaved(book.id);
  const userProgress = userLibrary[book.id];

  const handleReadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unlocked) {
      openReader(book);
    } else {
      openCheckout(book.id);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveBook(book.id);
  };

  return (
    <div 
      onClick={() => openBookDetails(book.id)}
      className="group relative flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/50 hover:bg-slate-900/90 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer overflow-hidden"
    >
      {/* Top badges & Cover Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950 p-3 pb-0">
        
        {/* Realistic Book Spine Shadow effect */}
        <div className="absolute top-3 bottom-0 left-3 w-3 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10 pointer-events-none rounded-l" />

        {/* Book Cover Image */}
        <div className="relative w-full h-full rounded-t-lg overflow-hidden shadow-book group-hover:shadow-book-hover transition-transform duration-500 group-hover:scale-[1.02]">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
        </div>

        {/* Price / Free Badge */}
        <div className="absolute top-5 left-5 z-20">
          {book.price === 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-white shadow-md backdrop-blur-md">
              <Sparkles className="w-3 h-3" />
              Free
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-slate-950 shadow-md backdrop-blur-md">
              ₹{book.price}
            </span>
          )}
        </div>

        {/* Bookmark quick button */}
        <button
          onClick={handleSaveClick}
          aria-label={saved ? 'Remove from saved books' : 'Save book to my library'}
          className={`absolute top-5 right-5 z-20 p-2 rounded-full backdrop-blur-md transition-all ${
            saved
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-black/50 text-white/80 hover:bg-black/80 hover:text-white'
          }`}
        >
          {saved ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>

        {/* Public Domain tag if applicable */}
        {book.isPublicDomain && (
          <div className="absolute bottom-2 left-5 z-20">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700/60 backdrop-blur-sm">
              Public Domain
            </span>
          </div>
        )}
      </div>

      {/* Book Metadata & Action Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="font-medium text-amber-400/90 tracking-wide uppercase">
              {book.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-slate-300 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="font-bold text-white text-base leading-snug group-hover:text-amber-400 transition-colors line-clamp-1">
            {book.title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
            by <span className="text-slate-300">{book.author}</span>
          </p>

          {!compact && (
            <p className="text-xs text-slate-400/90 mt-2 line-clamp-2 leading-relaxed">
              {book.synopsis}
            </p>
          )}
        </div>

        {/* Reading progress bar if user already started */}
        {userProgress && userProgress.progressPercent > 0 && (
          <div className="mt-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>Reading progress</span>
              <span className="font-bold text-amber-400">{userProgress.progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500" 
                style={{ width: `${userProgress.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Bottom CTA bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-400">
            <span>{book.pageCount} pages</span>
          </div>

          <button
            onClick={handleReadClick}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              unlocked
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 hover:shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-amber-500'
            }`}
          >
            {unlocked ? (
              <>
                <BookOpen className="w-3.5 h-3.5" />
                <span>{userProgress && userProgress.progressPercent > 0 ? 'Resume' : 'Read Now'}</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Unlock (₹{book.price})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
