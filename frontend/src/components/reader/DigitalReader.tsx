import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Check, 
  Menu, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Type, 
  Maximize2, 
  Minimize2,
  Clock,
  BookOpen,
  ListOrdered
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { ReaderTheme, ReaderFont, ReaderFontSize } from '../../types';

export const DigitalReader: React.FC = () => {
  const { 
    activeReaderBook, 
    activeReaderChapterIndex, 
    activeReaderPage, 
    readerSettings, 
    closeReader, 
    setReaderChapterIndex, 
    setReaderPage, 
    updateReaderSettings, 
    toggleBookmark, 
    updateProgress,
    userLibrary,
    showToast 
  } = useLibrary();

  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const book = activeReaderBook;
  if (!book) return null;

  const currentChapter = book.chapters[activeReaderChapterIndex] || book.chapters[0];
  const totalChapters = book.chapters.length;
  
  // Calculate synthetic page count for realistic page flipping inside chapter
  // Each paragraph is treated as rich content, or 2 paragraphs per virtual page
  const paragraphs = currentChapter ? currentChapter.content : [];
  const paragraphsPerPage = 2;
  const totalPagesInChapter = Math.max(1, Math.ceil(paragraphs.length / paragraphsPerPage));
  const currentPageInChapter = Math.min(activeReaderPage, totalPagesInChapter);

  // Content for the active page
  const visibleParagraphs = paragraphs.slice(
    (currentPageInChapter - 1) * paragraphsPerPage,
    currentPageInChapter * paragraphsPerPage
  );

  // Overall book percentage calculation
  const overallProgressPercent = Math.min(
    100,
    Math.round(
      ((activeReaderChapterIndex * totalPagesInChapter + currentPageInChapter) /
        (totalChapters * totalPagesInChapter)) *
        100
    )
  );

  // Check if current page is bookmarked
  const libraryItem = userLibrary[book.id];
  const isBookmarked = Boolean(
    libraryItem?.bookmarks?.some(
      (b) => b.page === currentPageInChapter && b.chapterTitle === currentChapter.title
    )
  );

  // Update progress on page changes
  useEffect(() => {
    if (book && currentChapter) {
      updateProgress(book.id, currentChapter.id, currentPageInChapter, book.pageCount);
    }
  }, [activeReaderChapterIndex, currentPageInChapter, book, currentChapter]);

  // Keyboard navigation shortcuts: Left, Right, Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'Escape') {
        if (isTocOpen) setIsTocOpen(false);
        else if (isSettingsOpen) setIsSettingsOpen(false);
        else closeReader();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReaderChapterIndex, currentPageInChapter, isTocOpen, isSettingsOpen]);

  // Text-to-Speech audio narration
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-Speech is not supported in this browser', 'warning');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      showToast('Narration stopped', 'info');
    } else {
      window.speechSynthesis.cancel();
      const textToRead = visibleParagraphs.join(' ');
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      showToast('Audio narration playing...', 'info');
    }
  };

  // Stop speech when closing
  const handleExitReader = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    closeReader();
  };

  // Navigation handlers
  const handleNextPage = () => {
    if ('speechSynthesis' in window && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (currentPageInChapter < totalPagesInChapter) {
      setReaderPage(currentPageInChapter + 1);
      scrollToTop();
    } else if (activeReaderChapterIndex < totalChapters - 1) {
      setReaderChapterIndex(activeReaderChapterIndex + 1);
      setReaderPage(1);
      scrollToTop();
      showToast(`Advancing to Chapter ${activeReaderChapterIndex + 2}`, 'info');
    } else {
      showToast('You have completed all chapters in this preview!', 'success');
    }
  };

  const handlePrevPage = () => {
    if ('speechSynthesis' in window && isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (currentPageInChapter > 1) {
      setReaderPage(currentPageInChapter - 1);
      scrollToTop();
    } else if (activeReaderChapterIndex > 0) {
      setReaderChapterIndex(activeReaderChapterIndex - 1);
      setReaderPage(totalPagesInChapter);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleFullscreenMode = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Theme styling configurations
  const themeClasses: Record<ReaderTheme, { bg: string; text: string; headerBg: string; border: string; muted: string }> = {
    light: {
      bg: 'bg-white',
      text: 'text-zinc-900',
      headerBg: 'bg-white/95 border-zinc-200 text-zinc-800',
      border: 'border-zinc-200',
      muted: 'text-zinc-500'
    },
    sepia: {
      bg: 'bg-[#F7F1E3]',
      text: 'text-[#3D2F1D]',
      headerBg: 'bg-[#F7F1E3]/95 border-[#E2D5BE] text-[#3D2F1D]',
      border: 'border-[#E2D5BE]',
      muted: 'text-[#7D6A53]'
    },
    dark: {
      bg: 'bg-[#151922]',
      text: 'text-slate-100',
      headerBg: 'bg-[#151922]/95 border-slate-800 text-slate-200',
      border: 'border-slate-800',
      muted: 'text-slate-400'
    },
    night: {
      bg: 'bg-[#090B10]',
      text: 'text-slate-300',
      headerBg: 'bg-[#090B10]/95 border-slate-900 text-slate-300',
      border: 'border-slate-900',
      muted: 'text-slate-500'
    }
  };

  const fontClasses: Record<ReaderFont, string> = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono'
  };

  const fontSizeClasses: Record<ReaderFontSize, string> = {
    sm: 'text-base leading-relaxed',
    md: 'text-lg sm:text-xl leading-loose',
    lg: 'text-xl sm:text-2xl leading-loose',
    xl: 'text-2xl sm:text-3xl leading-loose'
  };

  const activeThemeStyle = themeClasses[readerSettings.theme] || themeClasses.sepia;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${activeThemeStyle.bg} ${activeThemeStyle.text} transition-colors duration-300 select-text`}>
      
      {/* Reader Top Header Bar */}
      <header className={`h-16 px-4 sm:px-8 border-b ${activeThemeStyle.headerBg} backdrop-blur-md flex items-center justify-between z-30 shrink-0`}>
        
        {/* Left: Table of Contents & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className={`p-2 rounded-xl hover:bg-black/10 transition-colors flex items-center gap-2 text-xs font-semibold`}
            title="Table of contents"
          >
            <Menu className="w-5 h-5 shrink-0" />
            <span className="hidden sm:inline">Contents</span>
          </button>

          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-bold truncate max-w-xs sm:max-w-md">
              {book.title}
            </h1>
            <span className={`text-[11px] truncate ${activeThemeStyle.muted}`}>
              {currentChapter.title}
            </span>
          </div>
        </div>

        {/* Center: Reading Progress Indicator */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-medium">
              Ch {activeReaderChapterIndex + 1}/{totalChapters}
            </span>
            <span>•</span>
            <span className="font-mono">
              Page {currentPageInChapter} of {totalPagesInChapter}
            </span>
          </div>
          <div className="w-24 h-1.5 bg-black/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
          <span className="font-bold text-amber-500 text-[11px]">
            {overallProgressPercent}%
          </span>
        </div>

        {/* Right Controls: Narration, Bookmark, Appearance, Fullscreen, Exit */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Text-To-Speech Audio Narration */}
          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-xl transition-all ${
              isSpeaking
                ? 'bg-amber-500 text-slate-950 shadow-md animate-pulse'
                : 'hover:bg-black/10'
            }`}
            title={isSpeaking ? 'Pause audio narration' : 'Listen with text-to-speech audio reader'}
          >
            {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(book.id, currentPageInChapter, currentChapter.title)}
            className={`p-2 rounded-xl transition-all ${
              isBookmarked
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'hover:bg-black/10'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
          >
            {isBookmarked ? <Check className="w-4 h-4 stroke-[3]" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* Typography & Theme Settings Toggle */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-2 rounded-xl transition-all ${
              isSettingsOpen ? 'bg-amber-500 text-slate-950' : 'hover:bg-black/10'
            }`}
            title="Reading settings (Fonts, Themes, Size)"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreenMode}
            className="hidden sm:flex p-2 rounded-xl hover:bg-black/10 transition-colors"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Exit Reader (Esc) */}
          <button
            onClick={handleExitReader}
            className="p-2 rounded-xl bg-black/10 hover:bg-black/20 text-red-500 hover:text-red-600 transition-colors ml-2"
            title="Exit reader (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </header>

      {/* Reader Body Area */}
      <div className="relative flex-1 flex overflow-hidden">
        
        {/* Table of Contents Drawer */}
        {isTocOpen && (
          <aside className={`w-80 border-r ${activeThemeStyle.border} ${activeThemeStyle.bg} overflow-y-auto p-6 z-20 shadow-2xl animate-in slide-in-from-left duration-200 shrink-0`}>
            <div className="flex items-center justify-between pb-4 border-b border-black/10 mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-amber-500" />
                <span>Table of Contents</span>
              </h3>
              <button
                onClick={() => setIsTocOpen(false)}
                className="p-1 rounded-lg hover:bg-black/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              {book.chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setReaderChapterIndex(idx);
                    setReaderPage(1);
                    setIsTocOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                    idx === activeReaderChapterIndex
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'hover:bg-black/5 opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className="font-mono text-[11px] shrink-0 mt-0.5">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.
                  </span>
                  <div className="flex flex-col">
                    <span className="leading-snug">{ch.title}</span>
                    <span className="text-[10px] opacity-70 mt-0.5">
                      {ch.content.length} sections
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Saved bookmarks list in this book */}
            {libraryItem?.bookmarks && libraryItem.bookmarks.length > 0 && (
              <div className="mt-8 pt-4 border-t border-black/10">
                <h4 className="text-xs font-bold text-amber-500 mb-2 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 fill-amber-500" />
                  <span>Your Bookmarks</span>
                </h4>
                <div className="space-y-1.5 text-xs">
                  {libraryItem.bookmarks.map((bm, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setReaderPage(bm.page);
                        setIsTocOpen(false);
                      }}
                      className="p-2 rounded-lg bg-black/5 hover:bg-black/10 cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate max-w-[170px]">{bm.chapterTitle}</span>
                      <span className="font-mono font-bold text-amber-500">P.{bm.page}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Reader Settings Drawer (Fonts, Themes, Sizes) */}
        {isSettingsOpen && (
          <div className={`absolute top-4 right-4 w-80 rounded-2xl border ${activeThemeStyle.border} ${activeThemeStyle.bg} shadow-2xl p-5 z-40 animate-in fade-in zoom-in-95 duration-150`}>
            <div className="flex items-center justify-between pb-3 border-b border-black/10 mb-4">
              <h4 className="font-bold text-xs uppercase tracking-wider">Reading Preferences</h4>
              <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-lg hover:bg-black/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Theme Selectors */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-semibold block opacity-80">Reading Theme</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'light', label: 'Day', bg: 'bg-white text-zinc-900 border-zinc-300' },
                  { id: 'sepia', label: 'Sepia', bg: 'bg-[#F7F1E3] text-[#3D2F1D] border-[#E2D5BE]' },
                  { id: 'dark', label: 'Slate', bg: 'bg-[#151922] text-slate-100 border-slate-700' },
                  { id: 'night', label: 'OLED', bg: 'bg-[#090B10] text-slate-300 border-slate-800' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => updateReaderSettings({ theme: t.id as ReaderTheme })}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${t.bg} ${
                      readerSettings.theme === t.id ? 'ring-2 ring-amber-500 scale-105 shadow-md' : 'opacity-80'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family Selector */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-semibold block opacity-80">Typography</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'serif', label: 'Editorial', font: 'font-serif' },
                  { id: 'sans', label: 'Modern', font: 'font-sans' },
                  { id: 'mono', label: 'Technical', font: 'font-mono' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => updateReaderSettings({ font: f.id as ReaderFont })}
                    className={`py-2 rounded-xl text-xs font-bold border border-black/10 transition-all ${f.font} ${
                      readerSettings.font === f.id ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' : 'hover:bg-black/5'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Adjuster */}
            <div className="space-y-2">
              <label className="text-xs font-semibold block opacity-80">Text Scaling</label>
              <div className="flex items-center justify-between gap-2 bg-black/5 p-1 rounded-xl">
                {(['sm', 'md', 'lg', 'xl'] as ReaderFontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateReaderSettings({ fontSize: size })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                      readerSettings.fontSize === size
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'hover:bg-black/5'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Central Book Page Document */}
        <main 
          ref={contentRef}
          className="flex-1 overflow-y-auto px-6 py-8 sm:px-12 sm:py-12 md:px-24 flex justify-center custom-scrollbar"
        >
          <article className="max-w-2xl w-full mx-auto space-y-6">
            
            {/* Chapter Header */}
            {currentPageInChapter === 1 && (
              <div className="text-center pb-8 border-b border-black/10 space-y-2 mb-8">
                <span className="text-xs uppercase tracking-widest font-mono text-amber-500 font-bold block">
                  Chapter {currentChapter.number}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {currentChapter.title}
                </h2>
                <div className="text-xs opacity-60 flex items-center justify-center gap-2 pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Est. {currentChapter.estimatedMinutes || 4} min read</span>
                </div>
              </div>
            )}

            {/* Reading Content Paragraphs */}
            <div 
              className={`space-y-6 ${fontClasses[readerSettings.font]} ${fontSizeClasses[readerSettings.fontSize]} transition-all`}
            >
              {visibleParagraphs.map((para, pIdx) => (
                <p 
                  key={pIdx} 
                  className="first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:leading-none text-justify"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* End of chapter indicator */}
            {currentPageInChapter === totalPagesInChapter && (
              <div className="mt-12 pt-8 border-t border-black/10 text-center text-xs opacity-60 space-y-1">
                <BookOpen className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                <p>End of Chapter {activeReaderChapterIndex + 1}</p>
                {activeReaderChapterIndex < totalChapters - 1 ? (
                  <p className="text-amber-500 font-semibold cursor-pointer" onClick={handleNextPage}>
                    Turn page to continue to Chapter {activeReaderChapterIndex + 2} →
                  </p>
                ) : (
                  <p className="text-emerald-500 font-semibold">
                    You have finished reading this curated edition!
                  </p>
                )}
              </div>
            )}

          </article>
        </main>

      </div>

      {/* Reader Bottom Navigation & Pagination Bar */}
      <footer className={`h-16 px-4 sm:px-8 border-t ${activeThemeStyle.headerBg} backdrop-blur-md flex items-center justify-between z-30 shrink-0`}>
        
        {/* Previous Page Button */}
        <button
          onClick={handlePrevPage}
          disabled={currentPageInChapter === 1 && activeReaderChapterIndex === 0}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            currentPageInChapter === 1 && activeReaderChapterIndex === 0
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-black/10 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Previous (←)</span>
        </button>

        {/* Central Page Counter and Keyboard Indicator */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold font-mono">
            Page {currentPageInChapter} of {totalPagesInChapter}
          </span>
          <span className="text-[10px] opacity-60 hidden sm:inline">
            Use Left/Right arrow keys or Spacebar to flip
          </span>
        </div>

        {/* Next Page Button */}
        <button
          onClick={handleNextPage}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md"
        >
          <span className="hidden sm:inline">Next (→)</span>
          <ChevronRight className="w-5 h-5" />
        </button>

      </footer>

    </div>
  );
};
