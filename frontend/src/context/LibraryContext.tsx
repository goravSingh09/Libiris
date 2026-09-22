import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { api } from '../services/api';

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
  isBackendConnected: boolean;
  
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
  unlockBook: (bookId: string, paymentMethod?: string) => Promise<void>;
  toggleSaveBook: (bookId: string) => Promise<void>;
  toggleBookmark: (bookId: string, page: number, chapterTitle: string) => Promise<void>;
  updateProgress: (bookId: string, chapterId: string, page: number, totalPages: number) => Promise<void>;
  isBookUnlocked: (bookId: string) => boolean;
  isBookSaved: (bookId: string) => boolean;
  
  // Filtering & Search
  setActiveCategoryFilter: (cat: CategoryId | 'all') => void;
  setSearchQuery: (query: string) => void;
  
  // Notifications
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  
  // User Authentication
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  loginDemoUser: (role: 'reader' | 'librarian') => Promise<void>;
  logout: () => void;
  
  // Admin functions
  adminUpdateBookPrice: (bookId: string, price: number) => Promise<void>;
  adminAddNewBook: (book: Book) => Promise<void>;
  adminDeleteBook: (bookId: string) => Promise<void>;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_demo_101',
  name: 'Arjun Mehta',
  email: 'reader@libris.library',
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
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

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

  // Fetch initial books & current user session from backend API
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch books from backend
        const booksRes = await api.getBooks({ limit: 100 });
        if (booksRes.books && booksRes.books.length > 0) {
          setBooks(booksRes.books);
          setIsBackendConnected(true);
        }

        // Fetch user profile if token is stored
        const userRes = await api.getMe();
        if (userRes.user) {
          setUser(userRes.user);
          setIsBackendConnected(true);

          // Fetch user library
          const libRes = await api.getLibrary();
          if (libRes.libraryMap) {
            setUserLibrary(libRes.libraryMap);
          }
        }
      } catch (e) {
        // Graceful fallback to cached/default data when offline
        console.info('Operating with local resilient cache:', e);
      }
    };

    initializeData();
  }, []);

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
    if (typeof window !== 'undefined' && window.location.pathname !== `/books/${bookId}`) {
      window.history.pushState({ modal: 'book_details', bookId }, '', `/books/${bookId}`);
    }
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
    if (typeof window !== 'undefined' && activeModal.type === 'book_details' && window.location.pathname.startsWith('/books/')) {
      window.history.pushState(null, '', '/catalogue');
    }
    setActiveModal({ type: 'none' });
  };

  const openReader = (book: Book, chapterIndex = 0, page = 1) => {
    if (!isBookUnlocked(book.id)) {
      openCheckout(book.id);
      return;
    }

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

  // Real or simulated unlock with backend order storage
  const unlockBook = async (bookId: string, paymentMethod: string = 'upi') => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    try {
      const res = await api.checkout(bookId, paymentMethod, true);
      if (res.unlockedBookIds) {
        setUser((prev) => ({ ...prev, unlockedBookIds: res.unlockedBookIds }));
      }
    } catch {
      // Offline fallback
      setUser((prev) => ({
        ...prev,
        unlockedBookIds: Array.from(new Set([...prev.unlockedBookIds, bookId]))
      }));
    }

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

  const toggleSaveBook = async (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    // Optimistic local update
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

    try {
      await api.saveBook(bookId);
    } catch {
      // Handled locally
    }
  };

  const toggleBookmark = async (bookId: string, page: number, chapterTitle: string) => {
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

    try {
      await api.toggleBookmark({ bookId, page, chapterTitle });
    } catch {
      // Local fallback
    }
  };

  const updateProgress = async (bookId: string, chapterId: string, page: number, totalPages: number) => {
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

    try {
      await api.syncProgress({ bookId, chapterId, page, totalPages });
    } catch {
      // Local fallback
    }
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.login(email, password);
      api.setToken(res.token);
      setUser(res.user);
      
      const libRes = await api.getLibrary();
      if (libRes.libraryMap) {
        setUserLibrary(libRes.libraryMap);
      }

      closeModal();
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'warning');
      return false;
    }
  };

  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.register(name, email, password);
      api.setToken(res.token);
      setUser(res.user);
      closeModal();
      showToast(`Welcome to Libris, ${res.user.name}!`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'warning');
      return false;
    }
  };

  const loginDemoUser = async (role: 'reader' | 'librarian') => {
    const demoEmail = role === 'librarian' ? 'admin@libris.library' : 'reader@libris.library';
    const demoPassword = role === 'librarian' ? 'admin123' : 'reader123';

    try {
      const success = await loginUser(demoEmail, demoPassword);
      if (success) return;
    } catch {
      // Fallback to local profile switch
    }

    setUser((prev) => ({
      ...prev,
      role,
      name: role === 'librarian' ? 'Chief Librarian Sarah' : 'Arjun Mehta',
      tier: role === 'librarian' ? 'Digital Patron' : 'Student Scholar'
    }));
    closeModal();
    showToast(`Logged in as ${role === 'librarian' ? 'Library Administrator' : 'Arjun Mehta'}`, 'success');
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {}
    api.setToken(null);
    setUser(DEFAULT_USER);
    showToast('Logged out of session', 'info');
  };

  const adminUpdateBookPrice = async (bookId: string, price: number) => {
    setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, price } : b)));
    try {
      await api.adminUpdateBook(bookId, { price });
    } catch {}
    showToast(`Updated price for book to ₹${price}`, 'success');
  };

  const adminAddNewBook = async (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
    try {
      await api.adminCreateBook(newBook);
    } catch {}
    showToast(`Added "${newBook.title}" to library catalogue!`, 'success');
  };

  const adminDeleteBook = async (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    try {
      await api.adminDeleteBook(bookId);
    } catch {}
    showToast('Book removed from catalogue.', 'info');
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
        isBackendConnected,
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
        loginUser,
        registerUser,
        loginDemoUser,
        logout,
        adminUpdateBookPrice,
        adminAddNewBook,
        adminDeleteBook
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
