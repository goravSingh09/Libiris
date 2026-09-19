import { Book } from '../models/Book.js';
import { Category } from '../models/Category.js';
import { User } from '../models/User.js';
import { UserLibrary } from '../models/UserLibrary.js';
import { Purchase } from '../models/Purchase.js';
import { BOOKS_DATA } from './booksData.js';
import { CATEGORIES_DATA } from './categoriesData.js';
import { isDBConnected } from '../config/db.js';

export const autoSeedDatabase = async (): Promise<{ success: boolean; message: string }> => {
  if (!isDBConnected()) {
    return { success: false, message: 'Database is not connected.' };
  }

  try {
    console.log('🌱 Starting Auto-Seed on MongoDB...');

    // 1. Seed Categories
    for (const cat of CATEGORIES_DATA) {
      await Category.findOneAndUpdate({ id: cat.id }, cat, { upsert: true, new: true });
    }
    console.log(`✅ Seeded ${CATEGORIES_DATA.length} categories.`);

    // 2. Seed Books
    for (const b of BOOKS_DATA) {
      await Book.findOneAndUpdate({ id: b.id }, b, { upsert: true, new: true });
    }
    console.log(`✅ Seeded ${BOOKS_DATA.length} curated books.`);

    // 3. Seed Demo Reader
    let demoReader = await User.findOne({
      $or: [{ email: 'reader@libris.library' }, { email: 'reader@libiris.com' }]
    });
    if (!demoReader) {
      demoReader = new User({
        name: 'Arjun Mehta',
        email: 'reader@libris.library',
        password: 'reader123',
        role: 'reader',
        tier: 'Digital Patron',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        unlockedBookIds: ['frankenstein', 'sherlock-holmes', 'pride-and-prejudice', 'meditations-marcus-aurelius'],
        readingStreakDays: 14,
        totalBooksRead: 19,
        totalReadingMinutes: 840
      });
      await demoReader.save();
    }

    // 4. Seed Demo Admin (both email formats)
    let demoAdmin = await User.findOne({ email: 'admin@libris.library' });
    if (!demoAdmin) {
      demoAdmin = new User({
        name: 'Chief Librarian Sarah',
        email: 'admin@libris.library',
        password: 'admin123',
        role: 'librarian',
        tier: 'Digital Patron',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        unlockedBookIds: ['frankenstein', 'sherlock-holmes', 'sicp', 'the-art-of-war'],
        readingStreakDays: 28,
        totalBooksRead: 45,
        totalReadingMinutes: 1920
      });
      await demoAdmin.save();
    }

    let demoAdminAlias = await User.findOne({ email: 'admin@libiris.com' });
    if (!demoAdminAlias) {
      demoAdminAlias = new User({
        name: 'Chief Librarian Sarah',
        email: 'admin@libiris.com',
        password: 'Password123!',
        role: 'librarian',
        tier: 'Digital Patron',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        unlockedBookIds: ['frankenstein', 'sherlock-holmes', 'sicp', 'the-art-of-war'],
        readingStreakDays: 28,
        totalBooksRead: 45,
        totalReadingMinutes: 1920
      });
      await demoAdminAlias.save();
    }

    // 5. Seed Initial User Library
    if (demoReader) {
      const readerId = demoReader._id.toString();
      await UserLibrary.findOneAndUpdate(
        { userId: readerId, bookId: 'frankenstein' },
        {
          userId: readerId,
          bookId: 'frankenstein',
          status: 'reading',
          currentPage: 42,
          currentChapterId: 'ch-2',
          progressPercent: 68,
          lastReadAt: '2 hours ago',
          bookmarks: [{ page: 42, chapterTitle: 'Chapter I - Genevese Origins', date: '2 hours ago' }]
        },
        { upsert: true }
      );
    }

    return {
      success: true,
      message: `Database seeded successfully with ${BOOKS_DATA.length} books and ${CATEGORIES_DATA.length} categories.`
    };
  } catch (error: any) {
    console.error('AutoSeed Error:', error);
    return { success: false, message: error.message || 'AutoSeed failed.' };
  }
};
