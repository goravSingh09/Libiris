import { BOOKS_DATA } from '../seed/booksData.js';
import { CATEGORIES_DATA } from '../seed/categoriesData.js';
import bcrypt from 'bcryptjs';

export interface MemUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'reader' | 'librarian';
  tier: 'Free Member' | 'Digital Patron' | 'Student Scholar';
  avatar: string;
  unlockedBookIds: string[];
  readingStreakDays: number;
  totalReadingMinutes: number;
  totalBooksRead: number;
}

export const memBooks: any[] = [...BOOKS_DATA];
export const memCategories: any[] = [...CATEGORIES_DATA];

export const memUsers: MemUser[] = [
  {
    _id: 'usr_demo_reader_01',
    name: 'Arjun Mehta',
    email: 'reader@libris.library',
    passwordHash: bcrypt.hashSync('reader123', 10),
    role: 'reader',
    tier: 'Digital Patron',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    unlockedBookIds: ['frankenstein', 'sherlock-holmes', 'pride-and-prejudice', 'meditations-marcus-aurelius'],
    readingStreakDays: 14,
    totalReadingMinutes: 840,
    totalBooksRead: 19
  },
  {
    _id: 'usr_demo_admin_02',
    name: 'Chief Librarian Sarah',
    email: 'admin@libris.library',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'librarian',
    tier: 'Digital Patron',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    unlockedBookIds: ['frankenstein', 'sherlock-holmes', 'sicp', 'the-art-of-war'],
    readingStreakDays: 28,
    totalReadingMinutes: 1920,
    totalBooksRead: 45
  }
];

export const memLibrary: Record<string, any> = {
  'usr_demo_reader_01_frankenstein': {
    userId: 'usr_demo_reader_01',
    bookId: 'frankenstein',
    status: 'reading',
    currentPage: 42,
    currentChapterId: 'ch-2',
    progressPercent: 68,
    lastReadAt: '2 hours ago',
    bookmarks: [{ page: 42, chapterTitle: 'Chapter I - Genevese Origins', date: '2 hours ago' }]
  },
  'usr_demo_reader_01_sicp': {
    userId: 'usr_demo_reader_01',
    bookId: 'sicp',
    status: 'reading',
    currentPage: 21,
    currentChapterId: 'sicp-1',
    progressPercent: 32,
    lastReadAt: 'Yesterday',
    bookmarks: []
  }
};

export const memPurchases: any[] = [
  {
    _id: 'pur_init_01',
    userId: 'usr_demo_reader_01',
    userEmail: 'reader@libris.library',
    bookId: 'sicp',
    bookTitle: 'Structure and Interpretation of Computer Programs',
    amount: 15,
    paymentMethod: 'upi',
    status: 'completed',
    transactionId: 'TXN_INIT_SICP_101',
    isDemo: true,
    createdAt: new Date()
  }
];
