export type CategoryId = 
  | 'fiction'
  | 'science'
  | 'technology'
  | 'history'
  | 'mathematics'
  | 'business'
  | 'psychology'
  | 'self-development'
  | 'literature'
  | 'programming'
  | 'children'
  | 'competitive-exams';

export interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string[]; // paragraph strings for rich page rendering
  estimatedMinutes?: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  badge?: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  authorBio: string;
  coverUrl: string;
  spineColor?: string;
  category: CategoryId;
  categoryLabel: string;
  subcategories: string[];
  rating: number;
  reviewCount: number;
  pageCount: number;
  publishedYear: number;
  language: string;
  isbn: string;
  price: number; // 0 for free public domain, 5, 10, 15, 20
  isPublicDomain: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  synopsis: string;
  excerpt: string;
  chapters: Chapter[];
  reviews: Review[];
  tags: string[];
  readsCount: number;
}

export interface UserLibraryItem {
  bookId: string;
  addedAt: string;
  status: 'reading' | 'saved' | 'completed';
  currentPage: number;
  currentChapterId: string;
  progressPercent: number;
  lastReadAt: string;
  bookmarks: { page: number; chapterTitle: string; note?: string; date: string }[];
}

export type ReaderTheme = 'light' | 'sepia' | 'dark' | 'night';
export type ReaderFont = 'serif' | 'sans' | 'mono' | 'dyslexic';
export type ReaderFontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ReaderMargin = 'compact' | 'standard' | 'generous';

export interface ReaderSettings {
  theme: ReaderTheme;
  font: ReaderFont;
  fontSize: ReaderFontSize;
  lineHeight: 'normal' | 'relaxed' | 'loose';
  margin?: ReaderMargin;
  soundEnabled?: boolean;
  isSpeechActive: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'reader' | 'librarian';
  tier: 'Free Member' | 'Digital Patron' | 'Student Scholar';
  unlockedBookIds: string[];
  readingStreakDays: number;
  totalBooksRead: number;
  totalReadingMinutes: number;
}

export type ActiveModal = 
  | { type: 'none' }
  | { type: 'book_details'; bookId: string }
  | { type: 'checkout'; bookId: string }
  | { type: 'auth'; initialMode?: 'login' | 'signup' }
  | { type: 'search' };
