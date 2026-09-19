import React, { useEffect, useState } from 'react';
import { 
  X, 
  Star, 
  BookOpen, 
  Bookmark, 
  Check, 
  Lock, 
  Share2, 
  Sparkles, 
  Calendar, 
  Languages, 
  FileText, 
  ShieldCheck,
  Send,
  User
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { BookCard } from '../library/BookCard';

export const BookDetailsModal: React.FC = () => {
  const { 
    activeModal, 
    closeModal, 
    books, 
    openReader, 
    openCheckout, 
    toggleSaveBook, 
    isBookUnlocked, 
    isBookSaved,
    showToast
  } = useLibrary();

  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  const bookId = activeModal.type === 'book_details' ? activeModal.bookId : null;
  const book = books.find((b) => b.id === bookId);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  if (!book) return null;

  const unlocked = isBookUnlocked(book.id);
  const saved = isBookSaved(book.id);

  // Related books from same category or same tag
  const relatedBooks = books
    .filter((b) => b.id !== book.id && (b.category === book.category || b.tags.some(t => book.tags.includes(t))))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Book link copied to clipboard!', 'success');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    book.reviews.unshift({
      id: `rev_${Date.now()}`,
      userName: 'Arjun Mehta',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
      badge: 'Reader Review'
    });
    setNewReviewComment('');
    showToast('Your review was added successfully!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-3xl bg-[#0F1422] border border-slate-700/80 shadow-2xl overflow-hidden text-slate-200 my-8 max-h-[92vh] flex flex-col"
      >
        {/* Sticky Header with Close and Share */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0F1422]/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {book.categoryLabel}
            </span>
            {book.isPublicDomain && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Public Domain
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Share book"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeModal}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* Main Book Presentation Hero */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Book Cover with 3D spine and shadow */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-52 sm:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/90 border border-slate-700">
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-lg">
                    {book.price === 0 ? 'Free Classic' : `₹${book.price} Access`}
                  </span>
                </div>
              </div>
            </div>

            {/* Book Details and Actions */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {book.title}
                </h2>
                {book.subtitle && (
                  <p className="text-sm sm:text-base text-amber-300/90 font-medium mt-1">
                    {book.subtitle}
                  </p>
                )}
                <p className="text-sm text-slate-300 mt-2">
                  Author: <span className="text-white font-semibold">{book.author}</span>
                </p>
              </div>

              {/* Rating & Reads summary */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white text-sm">{book.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({book.reviewCount} reviews)</span>
                </div>
                <div className="text-slate-400">
                  <span className="text-white font-semibold">{book.readsCount.toLocaleString()}</span> readers
                </div>
              </div>

              {/* Metadata Badges */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <FileText className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-white block">{book.pageCount}</span>
                  <span className="text-[10px] text-slate-400">Pages</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <Calendar className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-white block">
                    {book.publishedYear > 0 ? book.publishedYear : `${Math.abs(book.publishedYear)} BC`}
                  </span>
                  <span className="text-[10px] text-slate-400">Published</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <Languages className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-white block">{book.language}</span>
                  <span className="text-[10px] text-slate-400">Language</span>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                {unlocked ? (
                  <button
                    onClick={() => openReader(book)}
                    className="flex-1 py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Read in Online Reader</span>
                  </button>
                ) : (
                  <button
                    onClick={() => openCheckout(book.id)}
                    className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Unlock Digital Access (₹{book.price})</span>
                  </button>
                )}

                <button
                  onClick={() => toggleSaveBook(book.id)}
                  className={`py-3 px-5 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2 ${
                    saved
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {saved ? <Check className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4" />}
                  <span>{saved ? 'In My Library' : 'Save to Library'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero loan waiting queues • Instant cloud sync to browser storage</span>
              </div>
            </div>

          </div>

          {/* Synopsis & Excerpt Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Synopsis & Overview</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {book.synopsis}
            </p>

            {book.excerpt && (
              <blockquote className="p-4 rounded-2xl bg-slate-900/60 border-l-4 border-amber-500 text-sm italic text-amber-200/90 font-serif leading-relaxed">
                "{book.excerpt}"
              </blockquote>
            )}
          </div>

          {/* About the Author */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <h3 className="text-base font-bold text-white">About the Author</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {book.authorBio}
            </p>
          </div>

          {/* Table of Contents Preview */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-base font-bold text-white">
              Table of Contents ({book.chapters.length} Chapters in Demo)
            </h3>
            <div className="divide-y divide-slate-800/80 rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden text-xs">
              {book.chapters.map((ch, idx) => (
                <div 
                  key={ch.id} 
                  className="p-3 flex items-center justify-between hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => openReader(book, idx, 1)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-amber-400 font-bold">0{idx + 1}</span>
                    <span className="font-medium text-slate-200">{ch.title}</span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-semibold">Read Chapter →</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reader Reviews & Interactive Submission */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Reader Community Reviews ({book.reviews.length})
              </h3>
              <div className="flex items-center gap-1 text-xs text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold">{book.rating.toFixed(1)} / 5.0</span>
              </div>
            </div>

            {/* Existing Reviews */}
            <div className="space-y-3">
              {book.reviews.length > 0 ? (
                book.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-amber-400 border border-slate-700">
                          {rev.userName[0]}
                        </div>
                        <span className="text-xs font-bold text-white">{rev.userName}</span>
                        {rev.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-500/20">
                            {rev.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-700'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {rev.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No community reviews submitted yet. Be the first to share your notes!</p>
              )}
            </div>

            {/* Review Input Box */}
            <form onSubmit={handleAddReview} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Add Your Reading Notes:</span>
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`w-4 h-4 ${star <= newReviewRating ? 'fill-amber-400' : 'text-slate-700'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <textarea
                  rows={2}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="What did you learn from this work? Write your thoughts..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500/80 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newReviewComment.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Review</span>
                </button>
              </div>
            </form>
          </div>

          {/* Related Recommendations Carousel */}
          {relatedBooks.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <h3 className="text-base font-bold text-white">
                Related Volumes in {book.categoryLabel}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedBooks.map((relBook) => (
                  <BookCard key={relBook.id} book={relBook} compact />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
