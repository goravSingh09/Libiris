import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { Book } from '../models/Book.js';
import { Category } from '../models/Category.js';
import { User } from '../models/User.js';
import { UserLibrary } from '../models/UserLibrary.js';
import { Purchase } from '../models/Purchase.js';
import { BOOKS_DATA } from './booksData.js';
import { CATEGORIES_DATA } from './categoriesData.js';

dotenv.config();

const runSeed = async () => {
  console.log('🌱 Starting Libris Database Seed Script...\n');

  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Cannot run seed script without an active database connection.');
    console.log('👉 Please set DATABASE_URL in backend/.env with your MongoDB Atlas or local MongoDB URI.');
    process.exit(1);
  }

  try {
    // 1. Seed Categories
    console.log(`📦 Seeding ${CATEGORIES_DATA.length} Categories...`);
    for (const cat of CATEGORIES_DATA) {
      await Category.findOneAndUpdate({ id: cat.id }, cat, { upsert: true, new: true });
    }
    console.log('✅ Categories successfully seeded.');

    // 2. Seed Books
    console.log(`📚 Seeding ${BOOKS_DATA.length} Curated Books...`);
    for (const b of BOOKS_DATA) {
      await Book.findOneAndUpdate({ id: b.id }, b, { upsert: true, new: true });
    }
    console.log('✅ All 32 books and chapters successfully seeded.');

    // 3. Seed Default Demo Users
    console.log('👤 Seeding Demo Users...');
    
    // Demo Reader
    let demoReader = await User.findOne({ email: 'reader@libris.library' });
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
      console.log('   ✓ Created demo reader: reader@libris.library (password: reader123)');
    }

    // Demo Admin
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
      console.log('   ✓ Created demo admin: admin@libris.library (password: admin123)');
    }

    // 4. Seed User Library Items for Demo Reader
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

      await UserLibrary.findOneAndUpdate(
        { userId: readerId, bookId: 'sicp' },
        {
          userId: readerId,
          bookId: 'sicp',
          status: 'reading',
          currentPage: 21,
          currentChapterId: 'sicp-1',
          progressPercent: 32,
          lastReadAt: 'Yesterday',
          bookmarks: []
        },
        { upsert: true }
      );
    }

    // 5. Seed Purchases for Demo Reader
    if (demoReader) {
      const readerId = demoReader._id.toString();
      const existingPurchase = await Purchase.findOne({ userId: readerId, bookId: 'sicp' });
      if (!existingPurchase) {
        await Purchase.create({
          userId: readerId,
          userEmail: demoReader.email,
          bookId: 'sicp',
          bookTitle: 'Structure and Interpretation of Computer Programs',
          amount: 15,
          paymentMethod: 'upi',
          status: 'completed',
          transactionId: 'TXN_INIT_SICP_101',
          isDemo: true
        });
      }
    }

    console.log('\n🎉 Database Seed Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed Script Error:', err);
    process.exit(1);
  }
};

runSeed();
