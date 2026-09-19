import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Book, 
  UserLibraryItem, 
  UserProfile, 
  ReaderSettings, 
  ActiveModal, 
  CategoryId 
} from '../types';
import { BOOKS_DATA } from '../data/books';
import { loadStorage, saveStorage } from '../utils/storage';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

interface LibraryContextType {
  books: Book[];
  user: UserProfile;
  userLibrary: Record<string, UserLibraryItem>;
  activeReaderBook: Book | null;
  activeReaderChapterIndex: number;
  activeReaderPage: number;
  readerSettings: ReaderSettings;
  activeModal: ActiveModal;
  activeCategoryFilter: CategoryId | 'all';
  searchQuery: string;
  toasts: ToastMessage[];
  
  // Navigation & Modals
  openBookDetails: (bookId: string) => void;
  openCheckout: (bookId: string) => void;
  openReader: (book: Book, chapterIndex?: number, page?: number) => void;
  closeReader: () => void;
  openSearch: () => void;
  openAuth: (initialMode?: 'login' | 'signup') => void;
  closeModal: () => void;
  
  // Reading & Library Actions
  setReaderChapterIndex: (index: number) => void;
  setReaderPage: (page: number) => void;
  updateReaderSettings: (settings: Partial<ReaderSettings>) => void;
  unlockBook: (bookId: string) => void;
  toggleSaveBook: (bookId: string) => void;
  toggleBookmark: (bookId: string, page: number, chapterTitle: string) => void;
  updateProgress: (bookId: string, chapterId: string, page: number, totalPages: number) => void;
  isBookUnlocked: (bookId: string) => boolean;
  isBookSaved: (bookId: string) => boolean;
  
  // Filtering & Search
  setActiveCategoryFilter: (cat: CategoryId | 'all') => void;
  setSearchQuery: (query: string) => void;
  
  // Notifications
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  
  // User Authentication Simulation
  loginDemoUser: (role: 'reader' | 'librarian') => void;
  logout: () => void;
  
  // Admin functions
  adminUpdateBookPrice: (bookId: string, price: number) => void;
  adminAddNewBook: (book: Book) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_demo_101',
  name: 'Arjun Mehta',
  email: 'arjun.reader@libris.library',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  role: 'reader',
  tier: 'Digital Patron',
  unlockedBookIds: ['frankenstein', 'sherlock-holmes', 'pride-and-prejudice', 'meditations-marcus-aurelius'],
  readingStreakDays: 14,
  totalBooksRead: 19,
  totalReadingMinutes: 840
};

const DEFAULT_USER_LIBRARY: Record<string, UserLibraryItem> = {
  'frankenstein': {
    bookId: 'frankenstein',
    addedAt: '2026-09-10',
    status: 'reading',
    currentPage: 42,
    currentChapterId: 'ch-2',
    progressPercent: 68,
    lastReadAt: '2 hours ago',
    bookmarks: [{ page: 42, chapterTitle: 'Chapter I - Genevese Origins', date: '2 hours ago' }]
  },
  'sicp': {
    bookId: 'sicp',
    addedAt: '2026-09-12',
    status: 'reading',
    currentPage: 21,
    currentChapterId: 'sicp-1',
    progressPercent: 32,
    lastReadAt: 'Yesterday',
    bookmarks: []
  },
  'the-great-gatsby': {
    bookId: 'the-great-gatsby',
    addedAt: '2026-09-14',
    status: 'saved',
    currentPage: 1,
    currentChapterId: 'gg-1',
    progressPercent: 5,
    lastReadAt: '3 days ago',
    bookmarks: []
  },
  'meditations-marcus-aurelius': {
    bookId: 'meditations-marcus-aurelius',
    addedAt: '2026-08-20',
    status: 'completed',
    currentPage: 220,
    currentChapterId: 'med-1',
    progressPercent: 100,
    lastReadAt: '5 days ago',
    bookmarks: []
  }
};

const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'sepia',
  font: 'serif',
  fontSize: 'md',
  lineHeight: 'relaxed',
  isSpeechActive: false
};

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(() => loadStorage('books_list', BOOKS_DATA));
  const [user, setUser] = useState<UserProfile>(() => loadStorage('user_profile', DEFAULT_USER));
  const [userLibrary, setUserLibrary] = useState<Record<string, UserLibraryItem>>(() => 
    loadStorage('user_library', DEFAULT_USER_LIBRARY)
  );
  
  const [activeReaderBook, setActiveReaderBook] = useState<Book | null>(null);
  const [activeReaderChapterIndex, setActiveReaderChapterIndex] = useState<number>(0);
  const [activeReaderPage, setActiveReaderPage] = useState<number>(1);
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>(() => 
    loadStorage('reader_settings', DEFAULT_SETTINGS)
  );

  const [activeModal, setActiveModal] = useState<ActiveModal>({ type: 'none' });
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    saveStorage('books_list', books);
  }, [books]);

  useEffect(() => {
    saveStorage('user_profile', user);
  }, [user]);

  useEffect(() => {
    saveStorage('user_library', userLibrary);
  }, [userLibrary]);

  useEffect(() => {
    saveStorage('reader_settings', readerSettings);
  }, [readerSettings]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isBookUnlocked = (bookId: string): boolean => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return false;
    if (book.price === 0 || book.isPublicDomain) return true;
    return user.unlockedBookIds.includes(bookId);
  };

  const isBookSaved = (bookId: string): boolean => {
    return Boolean(userLibrary[bookId]);
  };

  const openBookDetails = (bookId: string) => {
    setActiveModal({ type: 'book_details', bookId });
  };

  const openCheckout = (bookId: string) => {
    setActiveModal({ type: 'checkout', bookId });
  };

  const openSearch = () => {
    setActiveModal({ type: 'search' });
  };

  const openAuth = (initialMode: 'login' | 'signup' = 'login') => {
    setActiveModal({ type: 'auth', initialMode });
  };

  const closeModal = () => {
    setActiveModal({ type: 'none' });
  };

  const openReader = (book: Book, chapterIndex = 0, page = 1) => {
    // If book is locked, prompt checkout modal
    if (!isBookUnlocked(book.id)) {
      openCheckout(book.id);
      return;
    }

    // Load last saved page if available
    const existing = userLibrary[book.id];
    const initialPage = existing?.currentPage || page;
    const initialChapterIndex = chapterIndex || 0;

    setActiveReaderBook(book);
    setActiveReaderChapterIndex(initialChapterIndex);
    setActiveReaderPage(initialPage);
    closeModal();
    showToast(`Opened "${book.title}" in digital reader`, 'info');
  };

  const closeReader = () => {
    setActiveReaderBook(null);
  };

  const updateReaderSettings = (settings: Partial<ReaderSettings>) => {
    setReaderSettings((prev) => ({ ...prev, ...settings }));
  };

  const unlockBook = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    setUser((prev) => ({
      ...prev,
      unlockedBookIds: Array.from(new Set([...prev.unlockedBookIds, bookId]))
    }));

    setUserLibrary((prev) => ({
      ...prev,
      [bookId]: prev[bookId] || {
        bookId,
        addedAt: new Date().toISOString().split('T')[0],
        status: 'reading',
        currentPage: 1,
        currentChapterId: book.chapters[0]?.id || 'ch-1',
        progressPercent: 0,
        lastReadAt: 'Just now',
        bookmarks: []
      }
    }));

    closeModal();
    showToast(`"${book.title}" unlocked and added to your library!`, 'success');
  };

  const toggleSaveBook = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    setUserLibrary((prev) => {
      const copy = { ...prev };
      if (copy[bookId]) {
        delete copy[bookId];
        showToast(`Removed "${book.title}" from My Library`, 'info');
      } else {
        copy[bookId] = {
          bookId,
          addedAt: new Date().toISOString().split('T')[0],
          status: 'saved',
          currentPage: 1,
          currentChapterId: book.chapters[0]?.id || 'ch-1',
          progressPercent: 0,
          lastReadAt: 'Just added',
          bookmarks: []
        };
        showToast(`Saved "${book.title}" to My Library`, 'success');
      }
      return copy;
    });
  };

  const toggleBookmark = (bookId: string, page: number, chapterTitle: string) => {
    setUserLibrary((prev) => {
      const item = prev[bookId] || {
        bookId,
        addedAt: new Date().toISOString().split('T')[0],
        status: 'reading',
        currentPage: page,
        currentChapterId: 'ch-1',
        progressPercent: 10,
        lastReadAt: 'Just now',
        bookmarks: []
      };

      const hasBookmark = item.bookmarks.some((b) => b.page === page);
      const updatedBookmarks = hasBookmark
        ? item.bookmarks.filter((b) => b.page !== page)
        : [...item.bookmarks, { page, chapterTitle, date: 'Just now' }];

      showToast(
        hasBookmark ? `Removed bookmark on page ${page}` : `Saved bookmark on page ${page}`,
        hasBookmark ? 'info' : 'success'
      );

      return {
        ...prev,
        [bookId]: {
          ...item,
          bookmarks: updatedBookmarks
        }
      };
    });
  };

  const updateProgress = (bookId: string, chapterId: string, page: number, totalPages: number) => {
    const percent = Math.min(100, Math.round((page / Math.max(1, totalPages)) * 100));
    setUserLibrary((prev) => {
      const existing = prev[bookId] || {
        bookId,
        addedAt: new Date().toISOString().split('T')[0],
        status: 'reading',
        currentPage: page,
        currentChapterId: chapterId,
        progressPercent: percent,
        lastReadAt: 'Just now',
        bookmarks: []
      };

      return {
        ...prev,
        [bookId]: {
          ...existing,
          currentPage: page,
          currentChapterId: chapterId,
          progressPercent: percent,
          status: percent >= 100 ? 'completed' : 'reading',
          lastReadAt: 'Just now'
        }
      };
    });
  };

  const loginDemoUser = (role: 'reader' | 'librarian') => {
    setUser((prev) => ({
      ...prev,
      role,
      name: role === 'librarian' ? 'Chief Librarian Sarah' : 'Arjun Mehta',
      tier: role === 'librarian' ? 'Digital Patron' : 'Student Scholar'
    }));
    closeModal();
    showToast(`Logged in as ${role === 'librarian' ? 'Library Administrator' : 'Arjun Mehta'}`, 'success');
  };

  const logout = () => {
    showToast('Logged out of demo session', 'info');
  };

  const adminUpdateBookPrice = (bookId: string, price: number) => {
    setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, price } : b)));
    showToast(`Updated price for book to ₹${price}`, 'success');
  };

  const adminAddNewBook = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
    showToast(`Added "${newBook.title}" to library catalogue!`, 'success');
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        user,
        userLibrary,
        activeReaderBook,
        activeReaderChapterIndex,
        activeReaderPage,
        readerSettings,
        activeModal,
        activeCategoryFilter,
        searchQuery,
        toasts,
        openBookDetails,
        openCheckout,
        openReader,
        closeReader,
        openSearch,
        openAuth,
        closeModal,
        setReaderChapterIndex: setActiveReaderChapterIndex,
        setReaderPage: setActiveReaderPage,
        updateReaderSettings,
        unlockBook,
        toggleSaveBook,
        toggleBookmark,
        updateProgress,
        isBookUnlocked,
        isBookSaved,
        setActiveCategoryFilter,
        setSearchQuery,
        showToast,
        removeToast,
        loginDemoUser,
        logout,
        adminUpdateBookPrice,
        adminAddNewBook
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
