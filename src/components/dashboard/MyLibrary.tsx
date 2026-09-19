import React, { useState } from 'react';
import { 
  BookOpen, 
  Bookmark, 
  Flame, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  Sparkles,
  Library,
  Trash2
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { BookCard } from '../library/BookCard';

interface MyLibraryProps {
  onExploreCatalog: () => void;
}

export const MyLibrary: React.FC<MyLibraryProps> = ({ onExploreCatalog }) => {
  const { 
    user, 
    userLibrary, 
    books, 
    openReader, 
    openBookDetails, 
    toggleSaveBook,
    toggleBookmark 
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'reading' | 'saved' | 'completed' | 'bookmarks'>('reading');

  // Map library items with book records
  const libraryEntries = Object.values(userLibrary).map((item) => {
    const book = books.find((b) => b.id === item.bookId);
    return { item, book };
  }).filter((entry): entry is { item: typeof entry.item; book: NonNullable<typeof entry.book> } => Boolean(entry.book));

  const continueReadingList = libraryEntries.filter((e) => e.item.status === 'reading' && e.item.progressPercent < 100);
  const savedList = libraryEntries.filter((e) => e.item.status === 'saved');
  const completedList = libraryEntries.filter((e) => e.item.status === 'completed' || e.item.progressPercent === 100);

  // All bookmarks across all books
  const allBookmarks = libraryEntries.flatMap((e) => 
    e.item.bookmarks.map((bm) => ({
      ...bm,
      bookId: e.book.id,
      bookTitle: e.book.title,
      coverUrl: e.book.coverUrl,
      book: e.book
    }))
  );

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Dashboard Top Header & Reader Stats */}
      <div className="mb-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Digital Study</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Library
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Welcome back, <span className="text-white font-semibold">{user.name}</span>. Your reading progress and notes are synchronized.
            </p>
          </div>

          <button
            onClick={onExploreCatalog}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-slate-200 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Discover More Books</span>
          </button>
        </div>

        {/* 4 Reading Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6 fill-amber-400 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{user.readingStreakDays} Days</span>
              <span className="text-[11px] text-slate-400 block font-medium">Daily Streak</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{continueReadingList.length}</span>
              <span className="text-[11px] text-slate-400 block font-medium">In Progress</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{completedList.length + 18}</span>
              <span className="text-[11px] text-slate-400 block font-medium">Books Finished</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{user.totalReadingMinutes}m</span>
              <span className="text-[11px] text-slate-400 block font-medium">Reading Time</span>
            </div>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('reading')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'reading'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Continue Reading ({continueReadingList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'saved'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Books ({savedList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'bookmarks'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Bookmarks & Notes ({allBookmarks.length})</span>
        </button>
      </div>

      {/* Tab 1: Continue Reading with explicit Progress Bars */}
      {activeTab === 'reading' && (
        <div className="space-y-6">
          {continueReadingList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {continueReadingList.map(({ item, book }) => (
                <div
                  key={book.id}
                  className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between group shadow-xl"
                >
                  <div className="flex gap-4 items-center w-full sm:w-auto">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-20 h-28 object-cover rounded-xl shadow-lg border border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {book.categoryLabel}
                      </span>
                      <h3 className="text-base font-bold text-white leading-tight truncate">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">
                        by {book.author}
                      </p>

                      {/* Progress bar */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-400 text-[11px]">Progress</span>
                          <span className="font-bold text-amber-400 text-xs">
                            {item.progressPercent}% complete
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500" 
                            style={{ width: `${item.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Last read {item.lastReadAt} • Page {item.currentPage} of {book.pageCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                    <button
                      onClick={() => openReader(book, 0, item.currentPage)}
                      className="flex-1 sm:flex-none w-full px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Resume</span>
                    </button>
                    <button
                      onClick={() => openBookDetails(book.id)}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                      title="View book details"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 max-w-md mx-auto">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Active Reading Sessions</h3>
              <p className="text-slate-400 text-xs mb-5">
                Select any book from the catalogue to start your digital reading session.
              </p>
              <button
                onClick={onExploreCatalog}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-md"
              >
                Browse Books Catalogue
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Books Shelf */}
      {activeTab === 'saved' && (
        <div>
          {savedList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {savedList.map(({ book }) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 max-w-md mx-auto">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Your Saved Shelf is Empty</h3>
              <p className="text-slate-400 text-xs mb-5">
                Click the bookmark button on any book card to save it for reading later.
              </p>
              <button
                onClick={onExploreCatalog}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-md"
              >
                Browse Books
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Completed Books */}
      {activeTab === 'completed' && (
        <div>
          {completedList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {completedList.map(({ book }) => (
                <div key={book.id} className="relative">
                  <BookCard book={book} />
                  <div className="absolute top-4 left-4 z-30 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 shadow-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 max-w-md mx-auto">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Completed Books Yet</h3>
              <p className="text-slate-400 text-xs mb-5">
                Read through a volume to completion to track your accomplishments here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Bookmarks & Annotations */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          {allBookmarks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allBookmarks.map((bm, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={bm.coverUrl}
                      alt={bm.bookTitle}
                      className="w-12 h-16 object-cover rounded-lg shadow-sm border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{bm.bookTitle}</h4>
                      <p className="text-xs text-slate-400 truncate">{bm.chapterTitle}</p>
                      <span className="text-[11px] font-mono text-amber-400 font-semibold block mt-0.5">
                        Page {bm.page}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openReader(bm.book, 0, bm.page)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-all shadow-sm"
                    >
                      Jump to Page
                    </button>
                    <button
                      onClick={() => toggleBookmark(bm.bookId, bm.page, bm.chapterTitle)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 max-w-md mx-auto">
              <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Bookmarks Saved</h3>
              <p className="text-slate-400 text-xs mb-5">
                Click the bookmark icon while reading any page in the reader to store your spot.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
