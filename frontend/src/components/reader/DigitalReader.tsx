import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Check, 
  Menu, 
  Volume2, 
  VolumeX, 
  Type, 
  Maximize2, 
  Minimize2,
  Clock,
  BookOpen,
  Search,
  Sliders,
  Share2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Volume1,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLibrary } from '../../context/LibraryContext';
import { ReaderTheme, ReaderFont, ReaderFontSize, ReaderMargin, Chapter } from '../../types';
import { soundEffects } from '../../utils/soundEffects';
import { getBookContent } from '../../data/fullBooks/index';

// Virtual Page types for complete book structure
export type PageType = 
  | 'cover'
  | 'half_title'
  | 'title'
  | 'copyright'
  | 'toc'
  | 'chapter_content'
  | 'colophon';

export interface VirtualPage {
  pageNumber: number; // 1-indexed overall virtual page
  type: PageType;
  chapterIndex?: number;
  chapterTitle?: string;
  chapterNumber?: number;
  heading?: string;
  subheading?: string;
  paragraphs?: string[];
  isChapterStart?: boolean;
}

export const DigitalReader: React.FC = () => {
  const { 
    activeReaderBook, 
    activeReaderPage, 
    readerSettings, 
    closeReader, 
    setReaderPage, 
    updateReaderSettings, 
    toggleBookmark, 
    updateProgress,
    userLibrary,
    showToast 
  } = useLibrary();

  // Sidebar / Drawers state
  const [sidebarTab, setSidebarTab] = useState<'none' | 'toc' | 'bookmarks' | 'search' | 'settings'>('none');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => readerSettings.soundEnabled ?? true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchHighlight, setActiveSearchHighlight] = useState<string | null>(null);

  // Bookmark note modal state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [bookmarkNoteInput, setBookmarkNoteInput] = useState('');

  // Page flipping 3D animation state
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  // Responsive layout state (Desktop 2-page spread vs Mobile single-page)
  const [isDesktopSpread, setIsDesktopSpread] = useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  // Touch gesture tracking for mobile swipe
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const book = activeReaderBook;
  if (!book) return null;

  // Resolve content status & legal compliance
  const contentInfo = useMemo(() => getBookContent(book), [book]);
  const chapters: Chapter[] = contentInfo.chapters;

  // Track window resize for 2-page vs 1-page layout
  useEffect(() => {
    const handleResize = () => {
      setIsDesktopSpread(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync sound effects mute status
  useEffect(() => {
    soundEffects.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Construct complete virtual book pages: Cover -> Half-Title -> Title -> Copyright -> ToC -> Chapters -> Colophon
  const virtualPages = useMemo<VirtualPage[]>(() => {
    const pages: VirtualPage[] = [];
    let pNum = 1;

    // 1. Cover Page
    pages.push({
      pageNumber: pNum++,
      type: 'cover',
      heading: book.title,
      subheading: book.subtitle || book.author
    });

    // 2. Half-Title Page
    pages.push({
      pageNumber: pNum++,
      type: 'half_title',
      heading: book.title
    });

    // 3. Title Page
    pages.push({
      pageNumber: pNum++,
      type: 'title',
      heading: book.title,
      subheading: book.subtitle
    });

    // 4. Copyright & Edition Information Page
    pages.push({
      pageNumber: pNum++,
      type: 'copyright',
      heading: 'Edition & License Information'
    });

    // 5. Table of Contents Page
    pages.push({
      pageNumber: pNum++,
      type: 'toc',
      heading: 'Table of Contents'
    });

    // 6. Chapter Content Pages
    chapters.forEach((ch, chIdx) => {
      const paragraphs = ch.content || [];
      // Calculate realistic paragraph chunking: 2 paragraphs per page (or 3 if short)
      const paragraphsPerPage = 2;
      const chunks: string[][] = [];
      for (let i = 0; i < paragraphs.length; i += paragraphsPerPage) {
        chunks.push(paragraphs.slice(i, i + paragraphsPerPage));
      }
      if (chunks.length === 0) chunks.push(['This section is intentionally blank in this digital edition.']);

      chunks.forEach((chunk, chunkIdx) => {
        pages.push({
          pageNumber: pNum++,
          type: 'chapter_content',
          chapterIndex: chIdx,
          chapterTitle: ch.title,
          chapterNumber: ch.number,
          heading: chunkIdx === 0 ? ch.title : undefined,
          paragraphs: chunk,
          isChapterStart: chunkIdx === 0
        });
      });
    });

    // 7. Final Colophon Page
    pages.push({
      pageNumber: pNum++,
      type: 'colophon',
      heading: 'Finis'
    });

    return pages;
  }, [book, chapters]);

  const totalVirtualPages = virtualPages.length;

  // Active page clamp
  const safeCurrentPage = Math.max(1, Math.min(activeReaderPage || 1, totalVirtualPages));

  // Determine pages for Two-Page Spread on Desktop
  // In a real book, Page 1 (Cover) is on the right or centered.
  // For interior pages: Even page is on Left (Verso), Odd page is on Right (Recto).
  const { leftPage, rightPage } = useMemo(() => {
    if (!isDesktopSpread) {
      // Mobile / Single page mode: left page is current, right page null
      return {
        leftPage: virtualPages[safeCurrentPage - 1] || virtualPages[0],
        rightPage: null
      };
    }

    if (safeCurrentPage === 1) {
      // Cover page shown centered or right-aligned
      return {
        leftPage: null,
        rightPage: virtualPages[0]
      };
    }

    // Inside the book: Even page on left, Odd page on right
    const leftIndex = safeCurrentPage % 2 === 0 ? safeCurrentPage - 1 : safeCurrentPage - 2;
    const rightIndex = leftIndex + 1;

    return {
      leftPage: virtualPages[leftIndex] || null,
      rightPage: virtualPages[rightIndex] || null
    };
  }, [isDesktopSpread, safeCurrentPage, virtualPages]);

  // Overall book reading progress percent
  const overallProgressPercent = Math.min(
    100,
    Math.round((safeCurrentPage / Math.max(1, totalVirtualPages)) * 100)
  );

  // Active chapter lookup
  const activeChapterIndex = useMemo(() => {
    const activeP = leftPage?.chapterIndex !== undefined ? leftPage : rightPage;
    return activeP?.chapterIndex !== undefined ? activeP.chapterIndex : 0;
  }, [leftPage, rightPage]);

  // Bookmarks from user library
  const libraryItem = userLibrary[book.id];
  const isCurrentPageBookmarked = Boolean(
    libraryItem?.bookmarks?.some(
      (b) => b.page === safeCurrentPage || (leftPage && b.page === leftPage.pageNumber) || (rightPage && b.page === rightPage.pageNumber)
    )
  );

  // Sync progress to backend & local storage
  const syncProgressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (syncProgressTimerRef.current) clearTimeout(syncProgressTimerRef.current);
    syncProgressTimerRef.current = setTimeout(() => {
      const activeChId = chapters[activeChapterIndex]?.id || 'ch-1';
      updateProgress(book.id, activeChId, safeCurrentPage, totalVirtualPages);
    }, 400);

    return () => {
      if (syncProgressTimerRef.current) clearTimeout(syncProgressTimerRef.current);
    };
  }, [safeCurrentPage, activeChapterIndex, book.id, totalVirtualPages, updateProgress, chapters]);

  // Trigger celebration confetti when reaching the final Colophon page
  const hasTriggeredConfettiRef = useRef(false);
  useEffect(() => {
    if (safeCurrentPage === totalVirtualPages && !hasTriggeredConfettiRef.current) {
      hasTriggeredConfettiRef.current = true;
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [safeCurrentPage, totalVirtualPages]);

  // Navigation handlers with 3D animation & sound
  const turnNextPage = useCallback(() => {
    if (isFlipping) return;
    if (isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const step = isDesktopSpread ? (safeCurrentPage === 1 ? 1 : 2) : 1;
    const targetPage = safeCurrentPage + step;

    if (targetPage <= totalVirtualPages) {
      setFlipDirection('forward');
      setIsFlipping(true);
      if (soundEnabled) soundEffects.playPageTurn();

      setTimeout(() => {
        setReaderPage(targetPage);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 300);
    } else {
      showToast('You have reached the final colophon page!', 'info');
    }
  }, [isFlipping, isSpeaking, isDesktopSpread, safeCurrentPage, totalVirtualPages, soundEnabled, setReaderPage, showToast]);

  const turnPrevPage = useCallback(() => {
    if (isFlipping) return;
    if (isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const step = isDesktopSpread ? 2 : 1;
    const targetPage = Math.max(1, safeCurrentPage - step);

    if (safeCurrentPage > 1) {
      setFlipDirection('backward');
      setIsFlipping(true);
      if (soundEnabled) soundEffects.playPageTurn();

      setTimeout(() => {
        setReaderPage(targetPage);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 300);
    }
  }, [isFlipping, isSpeaking, isDesktopSpread, safeCurrentPage, soundEnabled, setReaderPage]);

  // Jump directly to a page or chapter start
  const jumpToPage = (pageNum: number) => {
    const clamped = Math.max(1, Math.min(pageNum, totalVirtualPages));
    setReaderPage(clamped);
    setSidebarTab('none');
    if (soundEnabled) soundEffects.playPageTurn();
  };

  const jumpToChapter = (chIdx: number) => {
    const foundPage = virtualPages.find((p) => p.chapterIndex === chIdx);
    if (foundPage) {
      jumpToPage(foundPage.pageNumber);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in search or note input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        turnNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault();
        turnPrevPage();
      } else if (e.key === 'Escape') {
        if (sidebarTab !== 'none') setSidebarTab('none');
        else if (isNoteModalOpen) setIsNoteModalOpen(false);
        else closeReader();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreenMode();
      } else if (e.key.toLowerCase() === 'b') {
        handleQuickBookmark();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [turnNextPage, turnPrevPage, sidebarTab, isNoteModalOpen, closeReader]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;

    // Only swipe if horizontal movement is dominant and > 50px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        turnNextPage(); // Swiped left -> next page
      } else {
        turnPrevPage(); // Swiped right -> prev page
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Fullscreen toggle using HTML5 API
  const toggleFullscreenMode = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Bookmark actions
  const handleQuickBookmark = () => {
    const chapterTitle = chapters[activeChapterIndex]?.title || 'Chapter';
    toggleBookmark(book.id, safeCurrentPage, chapterTitle);
  };

  const handleSaveNoteBookmark = () => {
    const chapterTitle = chapters[activeChapterIndex]?.title || 'Chapter';
    toggleBookmark(book.id, safeCurrentPage, chapterTitle, bookmarkNoteInput.trim());
    setIsNoteModalOpen(false);
    setBookmarkNoteInput('');
  };

  // In-book search matches
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];
    const query = searchQuery.toLowerCase().trim();
    const results: { pageNumber: number; chapterTitle: string; snippet: string }[] = [];

    virtualPages.forEach((page) => {
      if (page.paragraphs) {
        page.paragraphs.forEach((p) => {
          const lowerP = p.toLowerCase();
          const matchIndex = lowerP.indexOf(query);
          if (matchIndex !== -1) {
            const start = Math.max(0, matchIndex - 35);
            const end = Math.min(p.length, matchIndex + query.length + 35);
            const snippet = (start > 0 ? '...' : '') + p.substring(start, end) + (end < p.length ? '...' : '');
            results.push({
              pageNumber: page.pageNumber,
              chapterTitle: page.chapterTitle || 'Chapter',
              snippet
            });
          }
        });
      }
    });

    return results;
  }, [searchQuery, virtualPages]);

  // Audio narration Text-To-Speech
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-Speech is not supported in this browser', 'warning');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      showToast('Audio narration paused', 'info');
    } else {
      window.speechSynthesis.cancel();
      const textToRead = [
        ...(leftPage?.paragraphs || []),
        ...(rightPage?.paragraphs || [])
      ].join(' ');

      if (!textToRead.trim()) {
        showToast('No readable text on this page spread', 'info');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        setIsSpeaking(false);
        // Automatically turn to next page when reading finishes!
        turnNextPage();
      };
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      showToast('Audio narration playing...', 'info');
    }
  };

  const handleExitReader = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    closeReader();
  };

  // Reading Theme styles
  const themeClasses: Record<ReaderTheme, {
    outerBg: string;
    bookCasing: string;
    pageBg: string;
    text: string;
    headerBg: string;
    border: string;
    spineShadow: string;
    pageEdgeShadow: string;
    pageNumberColor: string;
    dropCapColor: string;
    mutedText: string;
  }> = {
    light: {
      outerBg: 'bg-[#EAEAEA]',
      bookCasing: 'bg-[#DCD8CF] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]',
      pageBg: 'bg-[#FCFCFC]',
      text: 'text-[#1A1A1A]',
      headerBg: 'bg-white/95 border-zinc-200 text-zinc-800',
      border: 'border-zinc-300',
      spineShadow: 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 40%, transparent 100%)',
      pageEdgeShadow: 'shadow-[-6px_0_12px_rgba(0,0,0,0.08)]',
      pageNumberColor: 'text-zinc-400',
      dropCapColor: 'text-amber-800',
      mutedText: 'text-zinc-500'
    },
    sepia: {
      outerBg: 'bg-[#211A14]',
      bookCasing: 'bg-[#2C231C] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7)]',
      pageBg: 'bg-[#F6EFE2]',
      text: 'text-[#382B1D]',
      headerBg: 'bg-[#1E1712]/95 border-[#3E3228] text-[#E8DCC9]',
      border: 'border-[#E0D3C0]',
      spineShadow: 'linear-gradient(to right, rgba(45,30,15,0.25) 0%, rgba(45,30,15,0.08) 40%, transparent 100%)',
      pageEdgeShadow: 'shadow-[-6px_0_15px_rgba(45,30,15,0.15)]',
      pageNumberColor: 'text-[#8C7A65]',
      dropCapColor: 'text-amber-900',
      mutedText: 'text-[#7D6B58]'
    },
    dark: {
      outerBg: 'bg-[#0B0D13]',
      bookCasing: 'bg-[#161B24] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)]',
      pageBg: 'bg-[#181D27]',
      text: 'text-slate-200',
      headerBg: 'bg-[#0F131C]/95 border-slate-800 text-slate-200',
      border: 'border-slate-800',
      spineShadow: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 40%, transparent 100%)',
      pageEdgeShadow: 'shadow-[-6px_0_15px_rgba(0,0,0,0.3)]',
      pageNumberColor: 'text-slate-500',
      dropCapColor: 'text-amber-400',
      mutedText: 'text-slate-400'
    },
    night: {
      outerBg: 'bg-[#030406]',
      bookCasing: 'bg-[#080A0E] shadow-[0_30px_80px_-15px_rgba(0,0,0,1)]',
      pageBg: 'bg-[#0A0D12]',
      text: 'text-slate-300',
      headerBg: 'bg-[#050608]/95 border-slate-900 text-slate-300',
      border: 'border-slate-900',
      spineShadow: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)',
      pageEdgeShadow: 'shadow-[-6px_0_15px_rgba(0,0,0,0.6)]',
      pageNumberColor: 'text-slate-600',
      dropCapColor: 'text-amber-500',
      mutedText: 'text-slate-500'
    }
  };

  const fontClasses: Record<ReaderFont, string> = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono',
    dyslexic: 'font-sans tracking-wide'
  };

  const fontSizeClasses: Record<ReaderFontSize, string> = {
    xs: 'text-sm leading-relaxed',
    sm: 'text-base leading-relaxed',
    md: 'text-lg leading-loose',
    lg: 'text-xl leading-loose',
    xl: 'text-2xl leading-loose'
  };

  const marginClasses: Record<ReaderMargin, string> = {
    compact: 'px-6 py-8 sm:px-8 sm:py-10',
    standard: 'px-8 py-10 sm:px-12 sm:py-14',
    generous: 'px-10 py-12 sm:px-16 sm:py-16'
  };

  const activeTheme = themeClasses[readerSettings.theme] || themeClasses.sepia;
  const activeMargin = marginClasses[readerSettings.margin || 'standard'];

  // Helper to render individual page content
  const renderPageContent = (page: VirtualPage, isLeft: boolean) => {
    switch (page.type) {
      case 'cover':
        return (
          <div className="h-full flex flex-col justify-between items-center text-center p-8 bg-gradient-to-b from-amber-950/20 via-black/10 to-black/30 rounded-2xl border border-amber-900/30 select-none">
            <div className="space-y-2 pt-4">
              <span className="text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 font-bold border border-amber-500/30">
                {contentInfo.isCompleteUnabridged ? 'Full Unabridged Edition' : 'Curated Preview Edition'}
              </span>
              <p className="text-xs uppercase font-serif tracking-widest opacity-70">
                Libiris Digital Public Library
              </p>
            </div>

            <div className="space-y-4 max-w-sm">
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40">
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight leading-tight">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="text-sm font-medium italic opacity-80">
                  {book.subtitle}
                </p>
              )}
              <div className="w-16 h-0.5 bg-amber-500/40 mx-auto" />
              <p className="text-sm font-semibold tracking-wide">
                by {book.author}
              </p>
            </div>

            <div className="space-y-3 pb-2 w-full max-w-xs">
              <button
                onClick={turnNextPage}
                className="w-full py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Digital Book</span>
              </button>
              <p className="text-[11px] opacity-60">
                Published {book.publishedYear} • {book.pageCount} Pages
              </p>
            </div>
          </div>
        );

      case 'half_title':
        return (
          <div className="h-full flex flex-col justify-center items-center text-center p-8 select-none">
            <div className="space-y-4 max-w-xs">
              <p className="text-xs uppercase font-mono tracking-widest opacity-50">Volume I</p>
              <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wide">
                {book.title}
              </h2>
              <div className="w-12 h-0.5 bg-black/20 mx-auto" />
            </div>
          </div>
        );

      case 'title':
        return (
          <div className="h-full flex flex-col justify-between items-center text-center p-8 select-none">
            <div className="pt-6">
              <p className="text-[11px] uppercase font-mono tracking-widest opacity-60">
                Libiris Classical Library Series
              </p>
            </div>

            <div className="space-y-4 max-w-sm">
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold leading-tight">
                {book.title}
              </h2>
              {book.subtitle && (
                <p className="text-xs sm:text-sm italic opacity-80">
                  {book.subtitle}
                </p>
              )}
              <div className="w-16 h-0.5 bg-amber-500/60 mx-auto my-3" />
              <p className="text-sm font-semibold">
                {book.author}
              </p>
            </div>

            <div className="pb-6 space-y-1 text-xs opacity-70">
              <p className="font-semibold">LIBIRIS DIGITAL PRESS</p>
              <p className="text-[10px]">Open Public Digital Heritage Collection</p>
              <p className="text-[10px] font-mono">Verified Digital Ingest: 2026</p>
            </div>
          </div>
        );

      case 'copyright':
        return (
          <div className="h-full flex flex-col justify-center text-left text-xs leading-relaxed p-8 space-y-4 max-w-md mx-auto select-none opacity-90">
            <div className="pb-4 border-b border-black/10">
              <h3 className="font-serif font-bold text-sm uppercase tracking-wider mb-1">
                Edition Information
              </h3>
              <p className="text-[11px] opacity-70">
                Preserved and rendered by the Libiris Digital Public Library.
              </p>
            </div>

            <div className="space-y-2 text-[11px]">
              <p><span className="font-semibold">Title:</span> {book.title}</p>
              <p><span className="font-semibold">Author:</span> {book.author}</p>
              <p><span className="font-semibold">Original Publication:</span> {book.publishedYear}</p>
              <p><span className="font-semibold">Catalog Category:</span> {book.categoryLabel}</p>
              <p><span className="font-semibold">Digital Edition Source:</span> {contentInfo.sourceCredit}</p>
            </div>

            {contentInfo.notice && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] space-y-1">
                <span className="font-bold text-amber-600 block">Copyright & Fair Use Notice:</span>
                <p>{contentInfo.notice}</p>
              </div>
            )}

            <div className="pt-4 border-t border-black/10 text-[10px] opacity-60">
              <p>Typeset in algorithmic page-spread mode with digital spine modeling. Distributed for digital scholarship and cultural preservation.</p>
            </div>
          </div>
        );

      case 'toc':
        return (
          <div className="h-full flex flex-col p-6 sm:p-8">
            <div className="text-center pb-4 border-b border-black/10 mb-6">
              <h3 className="font-serif font-bold text-xl sm:text-2xl">
                Table of Contents
              </h3>
              <p className="text-xs opacity-60 mt-1">Complete Chapter Index</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {chapters.map((ch, idx) => {
                const targetPage = virtualPages.find((p) => p.chapterIndex === idx)?.pageNumber || 1;
                return (
                  <button
                    key={ch.id}
                    onClick={() => jumpToChapter(idx)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-black/5 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="font-mono text-xs text-amber-500 font-bold shrink-0">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.
                      </span>
                      <span className="text-xs sm:text-sm font-medium truncate group-hover:text-amber-600">
                        {ch.title}
                      </span>
                    </div>
                    <span className="text-xs font-mono opacity-50 shrink-0 ml-2">
                      p. {targetPage}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'chapter_content':
        return (
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-4">
              {page.isChapterStart && (
                <div className="text-center pb-6 border-b border-black/10 mb-6 space-y-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-amber-600 font-bold block">
                    Chapter {page.chapterNumber || (page.chapterIndex !== undefined ? page.chapterIndex + 1 : 1)}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-extrabold tracking-tight">
                    {page.heading}
                  </h2>
                  <div className="text-[10px] opacity-60 flex items-center justify-center gap-1.5 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>Est. {chapters[page.chapterIndex || 0]?.estimatedMinutes || 6} min read</span>
                  </div>
                </div>
              )}

              <div className={`space-y-5 text-justify ${fontClasses[readerSettings.font]} ${fontSizeClasses[readerSettings.fontSize]}`}>
                {page.paragraphs?.map((para, pIdx) => {
                  const isFirstPara = page.isChapterStart && pIdx === 0;
                  return (
                    <p 
                      key={pIdx} 
                      className={`leading-relaxed ${
                        isFirstPara 
                          ? `first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none ${activeTheme.dropCapColor}` 
                          : 'indent-5'
                      }`}
                    >
                      {para}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Subtle ornate chapter ornament if last page of chapter */}
            <div className="pt-4 text-center select-none opacity-30 text-xs">
              ❦
            </div>
          </div>
        );

      case 'colophon':
        return (
          <div className="h-full flex flex-col justify-between items-center text-center p-8 select-none">
            <div className="pt-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 flex items-center gap-1.5 mx-auto w-fit">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Reading Goal Completed</span>
              </span>
            </div>

            <div className="space-y-4 max-w-sm">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-wide">
                Finis
              </h2>
              <p className="text-sm font-medium italic opacity-80">
                You have reached the conclusion of {book.title}.
              </p>
              <div className="w-16 h-0.5 bg-amber-500/40 mx-auto" />
              <p className="text-xs opacity-70">
                Thank you for reading in the Libiris Digital Public Library. Your progress has been saved to your digital patron profile.
              </p>
            </div>

            <div className="space-y-3 pb-4 w-full max-w-xs">
              <button
                onClick={() => jumpToPage(1)}
                className="w-full py-2.5 px-4 rounded-xl border border-black/20 hover:bg-black/5 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Read From Beginning</span>
              </button>
              <button
                onClick={handleExitReader}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
              >
                Return to Library Catalogue
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col ${activeTheme.outerBg} transition-colors duration-300 select-text overflow-hidden`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Top Application Bar */}
      <header className={`h-16 px-4 sm:px-8 border-b ${activeTheme.headerBg} backdrop-blur-md flex items-center justify-between z-30 shrink-0 shadow-sm`}>
        
        {/* Left: Table of Contents & Title */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            onClick={() => setSidebarTab(sidebarTab === 'toc' ? 'none' : 'toc')}
            className={`p-2 rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${
              sidebarTab === 'toc' ? 'bg-amber-500 text-slate-950 shadow-md' : 'hover:bg-black/10'
            }`}
            title="Table of Contents"
          >
            <Menu className="w-5 h-5 shrink-0" />
            <span className="hidden md:inline">Contents</span>
          </button>

          <button
            onClick={() => setSidebarTab(sidebarTab === 'search' ? 'none' : 'search')}
            className={`p-2 rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${
              sidebarTab === 'search' ? 'bg-amber-500 text-slate-950 shadow-md' : 'hover:bg-black/10'
            }`}
            title="In-Book Search"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">Search</span>
          </button>

          <div className="flex flex-col min-w-0 ml-1">
            <h1 className="text-xs sm:text-sm font-bold truncate max-w-[140px] sm:max-w-xs md:max-w-md">
              {book.title}
            </h1>
            <span className={`text-[10px] sm:text-[11px] truncate ${activeTheme.mutedText}`}>
              {contentInfo.isCompleteUnabridged ? 'Complete Public Domain Text' : 'Curated Preview Edition'}
            </span>
          </div>
        </div>

        {/* Center: Progress & Page Counter */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <span className="font-mono font-bold text-amber-500">
            {overallProgressPercent}%
          </span>
          <div className="w-28 h-2 bg-black/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
          <span className="font-mono opacity-70">
            {isDesktopSpread && leftPage && rightPage
              ? `Pages ${leftPage.pageNumber}-${rightPage.pageNumber} of ${totalVirtualPages}`
              : `Page ${safeCurrentPage} of ${totalVirtualPages}`}
          </span>
        </div>

        {/* Right Controls: Audio, Sound, Bookmark, Settings, Fullscreen, Close */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* TTS Audio Narration */}
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

          {/* Paper Sound Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              updateReaderSettings({ soundEnabled: next });
              showToast(next ? 'Page turn sounds enabled' : 'Page turn sounds muted', 'info');
            }}
            className={`hidden sm:flex p-2 rounded-xl transition-all ${
              soundEnabled ? 'hover:bg-black/10' : 'opacity-40 hover:bg-black/10'
            }`}
            title={soundEnabled ? 'Page turn sound enabled' : 'Page turn sound muted'}
          >
            <Volume1 className="w-4 h-4" />
          </button>

          {/* Bookmark & Note Button */}
          <div className="relative flex items-center">
            <button
              onClick={handleQuickBookmark}
              className={`p-2 rounded-xl transition-all ${
                isCurrentPageBookmarked
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'hover:bg-black/10'
              }`}
              title={isCurrentPageBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
            >
              {isCurrentPageBookmarked ? <Check className="w-4 h-4 stroke-[3]" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsNoteModalOpen(true)}
              className="p-1 rounded-lg hover:bg-black/10 -ml-1 text-[10px]"
              title="Add study note to bookmark"
            >
              <MessageSquare className="w-3 h-3 opacity-70" />
            </button>
          </div>

          {/* Typography & Theme Preferences */}
          <button
            onClick={() => setSidebarTab(sidebarTab === 'settings' ? 'none' : 'settings')}
            className={`p-2 rounded-xl transition-all ${
              sidebarTab === 'settings' ? 'bg-amber-500 text-slate-950 shadow-md' : 'hover:bg-black/10'
            }`}
            title="Reader Preferences (Fonts, Themes, Margins)"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreenMode}
            className="hidden sm:flex p-2 rounded-xl hover:bg-black/10 transition-colors"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Exit Reader */}
          <button
            onClick={handleExitReader}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600 transition-colors ml-1"
            title="Exit Reader (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </header>

      {/* Reader Main Stage */}
      <div className="relative flex-1 flex overflow-hidden justify-center items-center p-2 sm:p-6 md:p-8">
        
        {/* Slide-out Sidebar Drawer: ToC, Search, Bookmarks, Settings */}
        {sidebarTab !== 'none' && (
          <aside className={`absolute left-0 top-0 bottom-0 w-80 sm:w-96 z-40 border-r ${activeTheme.border} ${activeTheme.pageBg} ${activeTheme.text} shadow-2xl flex flex-col animate-in slide-in-from-left duration-200`}>
            
            {/* Drawer Tabs Bar */}
            <div className="flex items-center justify-between p-4 border-b border-black/10 shrink-0">
              <div className="flex items-center gap-1 text-xs font-bold">
                <button
                  onClick={() => setSidebarTab('toc')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${sidebarTab === 'toc' ? 'bg-amber-500 text-slate-950' : 'hover:bg-black/5'}`}
                >
                  Contents
                </button>
                <button
                  onClick={() => setSidebarTab('search')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${sidebarTab === 'search' ? 'bg-amber-500 text-slate-950' : 'hover:bg-black/5'}`}
                >
                  Search
                </button>
                <button
                  onClick={() => setSidebarTab('bookmarks')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${sidebarTab === 'bookmarks' ? 'bg-amber-500 text-slate-950' : 'hover:bg-black/5'}`}
                >
                  Bookmarks
                </button>
              </div>

              <button onClick={() => setSidebarTab('none')} className="p-1.5 rounded-lg hover:bg-black/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Body: Table of Contents */}
            {sidebarTab === 'toc' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar text-xs">
                <div className="mb-3 px-2 py-1 text-[11px] uppercase font-bold text-amber-500 tracking-wider">
                  Book Sections
                </div>
                {virtualPages.filter((p) => p.type !== 'chapter_content' || p.isChapterStart).map((p) => {
                  const isActive = p.chapterIndex === activeChapterIndex;
                  return (
                    <button
                      key={p.pageNumber}
                      onClick={() => jumpToPage(p.pageNumber)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-3 ${
                        isActive ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'hover:bg-black/5 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex flex-col truncate">
                        <span className="leading-snug truncate">
                          {p.type === 'cover' ? 'Book Cover' :
                           p.type === 'title' ? 'Title Page' :
                           p.type === 'copyright' ? 'Edition & License' :
                           p.type === 'toc' ? 'Table of Contents' :
                           p.type === 'colophon' ? 'Colophon / The End' :
                           p.heading || p.chapterTitle}
                        </span>
                        {p.chapterNumber && (
                          <span className="text-[10px] opacity-70">
                            Chapter {p.chapterNumber}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[11px] opacity-60 shrink-0">
                        p.{p.pageNumber}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab Body: In-Book Search */}
            {sidebarTab === 'search' && (
              <div className="flex-1 flex flex-col p-4 overflow-hidden text-xs">
                <div className="relative mb-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search inside this book..."
                    className="w-full py-2.5 pl-9 pr-4 rounded-xl border border-black/15 bg-black/5 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    autoFocus
                  />
                  <Search className="w-4 h-4 absolute left-3 top-3 opacity-50" />
                </div>

                <div className="text-[11px] opacity-60 mb-2 px-1">
                  {searchQuery ? `${searchResults.length} occurrences found` : 'Enter a word or phrase to search'}
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {searchResults.map((res, i) => (
                    <div
                      key={i}
                      onClick={() => jumpToPage(res.pageNumber)}
                      className="p-3 rounded-xl bg-black/5 hover:bg-black/10 cursor-pointer transition-all space-y-1 border border-black/5 hover:border-amber-500/40"
                    >
                      <div className="flex items-center justify-between font-bold text-[11px] text-amber-600">
                        <span>{res.chapterTitle}</span>
                        <span className="font-mono text-[10px]">p.{res.pageNumber}</span>
                      </div>
                      <p className="text-[11px] opacity-80 leading-relaxed">
                        {res.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Body: Bookmarks & Study Notes */}
            {sidebarTab === 'bookmarks' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs custom-scrollbar">
                <div className="mb-2 text-[11px] uppercase font-bold text-amber-500 tracking-wider">
                  Saved Bookmarks ({libraryItem?.bookmarks?.length || 0})
                </div>

                {libraryItem?.bookmarks && libraryItem.bookmarks.length > 0 ? (
                  libraryItem.bookmarks.map((bm, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-black/5 hover:bg-black/10 transition-all flex flex-col gap-2 border border-black/5"
                    >
                      <div 
                        onClick={() => jumpToPage(bm.page)}
                        className="cursor-pointer flex items-center justify-between font-bold"
                      >
                        <span className="truncate max-w-[200px]">{bm.chapterTitle}</span>
                        <span className="font-mono text-amber-500 font-bold">p.{bm.page}</span>
                      </div>
                      {bm.note && (
                        <p className="text-[11px] italic opacity-80 bg-black/5 p-2 rounded-lg">
                          "{bm.note}"
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[10px] opacity-50 pt-1 border-t border-black/5">
                        <span>{bm.date}</span>
                        <button
                          onClick={() => toggleBookmark(book.id, bm.page, bm.chapterTitle)}
                          className="text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 opacity-60 space-y-2">
                    <Bookmark className="w-8 h-8 mx-auto stroke-1" />
                    <p>No bookmarks saved in this book yet.</p>
                    <p className="text-[10px]">Tap the bookmark icon or press 'B' while reading to add one.</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab Body: Reading Preferences (Themes, Typography) */}
            {sidebarTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs custom-scrollbar">
                <div className="space-y-2">
                  <label className="font-bold uppercase tracking-wider block opacity-70">
                    Reading Theme
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'sepia', label: 'Vintage Sepia', desc: 'Warm parchment', bg: 'bg-[#F6EFE2] text-[#382B1D] border-[#E0D3C0]' },
                      { id: 'light', label: 'Archival Light', desc: 'Crisp paper', bg: 'bg-[#FCFCFC] text-zinc-900 border-zinc-300' },
                      { id: 'dark', label: 'Slate Charcoal', desc: 'Low glare', bg: 'bg-[#181D27] text-slate-100 border-slate-700' },
                      { id: 'night', label: 'Midnight OLED', desc: 'Pitch black', bg: 'bg-[#0A0D12] text-slate-300 border-slate-800' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => updateReaderSettings({ theme: t.id as ReaderTheme })}
                        className={`p-3 rounded-xl border text-left transition-all ${t.bg} ${
                          readerSettings.theme === t.id ? 'ring-2 ring-amber-500 shadow-md scale-102 font-bold' : 'opacity-80'
                        }`}
                      >
                        <div className="font-bold">{t.label}</div>
                        <div className="text-[10px] opacity-60">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold uppercase tracking-wider block opacity-70">
                    Typography Family
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'serif', label: 'Classic Serif', font: 'font-serif' },
                      { id: 'sans', label: 'Modern Sans', font: 'font-sans' },
                      { id: 'mono', label: 'Technical Mono', font: 'font-mono' },
                      { id: 'dyslexic', label: 'Reader Accessible', font: 'font-sans tracking-wide' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => updateReaderSettings({ font: f.id as ReaderFont })}
                        className={`py-2.5 px-3 rounded-xl border border-black/10 text-xs font-semibold transition-all ${f.font} ${
                          readerSettings.font === f.id ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'hover:bg-black/5'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold uppercase tracking-wider block opacity-70">
                    Text Scale
                  </label>
                  <div className="flex items-center gap-1.5 bg-black/5 p-1 rounded-xl">
                    {(['xs', 'sm', 'md', 'lg', 'xl'] as ReaderFontSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => updateReaderSettings({ fontSize: size })}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                          readerSettings.fontSize === size
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'hover:bg-black/5 opacity-70'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold uppercase tracking-wider block opacity-70">
                    Margins & Layout
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-black/5 p-1 rounded-xl">
                    {(['compact', 'standard', 'generous'] as ReaderMargin[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => updateReaderSettings({ margin: m })}
                        className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                          (readerSettings.margin || 'standard') === m
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'hover:bg-black/5 opacity-70'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </aside>
        )}

        {/* Realistic Book Stage Display */}
        <div 
          className={`relative max-w-6xl w-full h-[82vh] sm:h-[84vh] rounded-3xl ${activeTheme.bookCasing} p-2 sm:p-4 flex items-stretch justify-center transition-all duration-300`}
          style={{ perspective: '2200px' }}
        >

          {/* Hardcover Outer Leather Frame Layer */}
          <div className="relative w-full h-full flex rounded-2xl overflow-hidden shadow-2xl border border-black/20">

            {/* DESKTOP TWO-PAGE SPREAD */}
            {isDesktopSpread ? (
              <div className="w-full h-full flex divide-x divide-black/10 relative">

                {/* Left Page (Verso - Even Page) */}
                <div 
                  className={`flex-1 h-full ${activeTheme.pageBg} ${activeTheme.text} ${activeMargin} flex flex-col justify-between relative overflow-hidden transition-all duration-300 select-text`}
                >
                  {/* Left Page Running Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-black/5 text-[10px] uppercase font-serif tracking-widest opacity-60 select-none">
                    <span className="truncate max-w-[200px]">{book.title}</span>
                    <span>{book.author}</span>
                  </div>

                  {/* Left Page Body Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar my-4">
                    {leftPage ? (
                      renderPageContent(leftPage, true)
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs opacity-40 italic select-none">
                        (Inside front cover)
                      </div>
                    )}
                  </div>

                  {/* Left Page Running Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-black/5 text-xs font-mono opacity-50 select-none">
                    <span>{leftPage ? `p. ${leftPage.pageNumber}` : ''}</span>
                    <span className="text-[10px] opacity-60">Libiris Digital</span>
                  </div>

                  {/* Center Spine Crease Gradient Shadow (Right edge of Left Page) */}
                  <div 
                    className="absolute top-0 bottom-0 right-0 w-8 pointer-events-none z-10"
                    style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.04) 40%, transparent 100%)' }}
                  />

                  {/* Left Margin Click Zone to turn page backward */}
                  <div 
                    onClick={turnPrevPage}
                    className="absolute left-0 top-12 bottom-12 w-12 hover:bg-black/5 cursor-pointer transition-colors flex items-center justify-start pl-2 opacity-0 hover:opacity-100 z-10"
                    title="Turn to previous page (←)"
                  >
                    <ChevronLeft className="w-6 h-6 opacity-60" />
                  </div>
                </div>

                {/* Right Page (Recto - Odd Page) */}
                <div 
                  className={`flex-1 h-full ${activeTheme.pageBg} ${activeTheme.text} ${activeMargin} flex flex-col justify-between relative overflow-hidden transition-all duration-300 select-text`}
                >
                  {/* Right Page Running Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-black/5 text-[10px] uppercase font-serif tracking-widest opacity-60 select-none">
                    <span className="truncate max-w-[200px]">
                      {rightPage?.chapterTitle || book.title}
                    </span>
                    <span className="font-mono">{overallProgressPercent}%</span>
                  </div>

                  {/* Right Page Body Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar my-4">
                    {rightPage ? (
                      renderPageContent(rightPage, false)
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs opacity-40 italic select-none">
                        (End of digital volume)
                      </div>
                    )}
                  </div>

                  {/* Right Page Running Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-black/5 text-xs font-mono opacity-50 select-none">
                    <span className="text-[10px] opacity-60">Classical Heritage</span>
                    <span>{rightPage ? `p. ${rightPage.pageNumber}` : ''}</span>
                  </div>

                  {/* Center Spine Crease Gradient Shadow (Left edge of Right Page) */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 w-8 pointer-events-none z-10"
                    style={{ background: activeTheme.spineShadow }}
                  />

                  {/* Right Margin Click Zone to turn page forward */}
                  <div 
                    onClick={turnNextPage}
                    className="absolute right-0 top-12 bottom-12 w-12 hover:bg-black/5 cursor-pointer transition-colors flex items-center justify-end pr-2 opacity-0 hover:opacity-100 z-10"
                    title="Turn to next page (→)"
                  >
                    <ChevronRight className="w-6 h-6 opacity-60" />
                  </div>
                </div>

              </div>
            ) : (
              /* MOBILE SINGLE-PAGE RESPONSIVE VIEW */
              <div 
                className={`w-full h-full ${activeTheme.pageBg} ${activeTheme.text} px-4 py-6 sm:px-8 sm:py-8 flex flex-col justify-between relative overflow-hidden select-text`}
              >
                {/* Mobile Running Header */}
                <div className="flex items-center justify-between pb-2 border-b border-black/5 text-[10px] uppercase font-serif tracking-widest opacity-60 select-none">
                  <span className="truncate max-w-[180px]">{book.title}</span>
                  <span className="font-mono text-amber-500 font-bold">{overallProgressPercent}%</span>
                </div>

                {/* Mobile Page Body Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar my-3">
                  {leftPage && renderPageContent(leftPage, false)}
                </div>

                {/* Mobile Running Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-black/5 text-xs font-mono opacity-60 select-none">
                  <button 
                    onClick={turnPrevPage}
                    disabled={safeCurrentPage <= 1}
                    className="p-1 rounded disabled:opacity-20 flex items-center gap-1 text-[11px]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>

                  <span className="font-bold">
                    Page {safeCurrentPage} of {totalVirtualPages}
                  </span>

                  <button 
                    onClick={turnNextPage}
                    disabled={safeCurrentPage >= totalVirtualPages}
                    className="p-1 rounded disabled:opacity-20 flex items-center gap-1 text-[11px] text-amber-600 font-bold"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Reader Bottom Navigation & Page Scrubber Bar */}
      <footer className={`h-16 px-4 sm:px-8 border-t ${activeTheme.headerBg} backdrop-blur-md flex items-center justify-between z-30 shrink-0 shadow-lg`}>
        
        {/* Previous Page CTA */}
        <button
          onClick={turnPrevPage}
          disabled={safeCurrentPage <= 1}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            safeCurrentPage <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/10 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Previous Page</span>
        </button>

        {/* Central Range Scrubber */}
        <div className="flex-1 max-w-md mx-4 flex items-center gap-3">
          <span className="text-xs font-mono font-bold shrink-0">
            {safeCurrentPage}
          </span>
          <input
            type="range"
            min="1"
            max={totalVirtualPages}
            value={safeCurrentPage}
            onChange={(e) => jumpToPage(parseInt(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-black/10 rounded-lg"
          />
          <span className="text-xs font-mono opacity-60 shrink-0">
            {totalVirtualPages}
          </span>
        </div>

        {/* Next Page CTA */}
        <button
          onClick={turnNextPage}
          disabled={safeCurrentPage >= totalVirtualPages}
          className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md"
        >
          <span className="hidden sm:inline">Next Page</span>
          <ChevronRight className="w-5 h-5" />
        </button>

      </footer>

      {/* Bookmark Study Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl p-6 ${activeTheme.pageBg} ${activeTheme.text} shadow-2xl border border-black/15 space-y-4 animate-in zoom-in-95 duration-150`}>
            <div className="flex items-center justify-between pb-2 border-b border-black/10">
              <h4 className="font-serif font-bold text-sm flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Bookmark Page {safeCurrentPage}</span>
              </h4>
              <button onClick={() => setIsNoteModalOpen(false)} className="p-1 rounded-lg hover:bg-black/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs opacity-70">
              Add a personal study note, memorable quote, or research citation for this page:
            </p>

            <textarea
              value={bookmarkNoteInput}
              onChange={(e) => setBookmarkNoteInput(e.target.value)}
              placeholder="e.g. Critical passage on moral philosophy..."
              rows={3}
              className="w-full p-3 rounded-xl border border-black/15 bg-black/5 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs resize-none"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-black/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNoteBookmark}
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 shadow-md"
              >
                Save Bookmark & Note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
