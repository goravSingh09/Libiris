import { Router, Response } from 'express';
import { UserLibrary } from '../models/UserLibrary.js';
import { User } from '../models/User.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { isDBConnected } from '../config/db.js';
import { memLibrary, memUsers } from '../config/memoryStore.js';

const router = Router();

router.use(authenticate);

// GET /api/library - Retrieve all user library entries
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user._id || req.user.id).toString();

    if (isDBConnected()) {
      const items = await UserLibrary.find({ userId }).sort({ updatedAt: -1 });

      const libraryMap: Record<string, any> = {};
      items.forEach((item) => {
        libraryMap[item.bookId] = {
          bookId: item.bookId,
          addedAt: item.createdAt ? item.createdAt.toISOString().split('T')[0] : '2026-09-10',
          status: item.status,
          currentPage: item.currentPage,
          currentChapterId: item.currentChapterId,
          progressPercent: item.progressPercent,
          lastReadAt: item.lastReadAt,
          bookmarks: item.bookmarks
        };
      });

      res.json({ items, libraryMap });
    } else {
      const libraryMap: Record<string, any> = {};
      const userItems = Object.values(memLibrary).filter((item: any) => item.userId === userId);

      userItems.forEach((item: any) => {
        libraryMap[item.bookId] = item;
      });

      res.json({ items: userItems, libraryMap });
    }
  } catch (error: any) {
    console.error('Fetch Library Error:', error);
    res.status(500).json({ error: 'Failed to fetch user library.' });
  }
});

// POST /api/library/save/:bookId - Toggle save book to library
router.post('/save/:bookId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user._id || req.user.id).toString();
    const { bookId } = req.params;

    if (isDBConnected()) {
      const existing = await UserLibrary.findOne({ userId, bookId });
      if (existing) {
        await UserLibrary.deleteOne({ _id: existing._id });
        res.json({ saved: false, message: 'Removed from library.' });
      } else {
        const newItem = new UserLibrary({
          userId,
          bookId,
          status: 'saved',
          currentPage: 1,
          currentChapterId: 'ch-1',
          progressPercent: 0,
          lastReadAt: 'Just added',
          bookmarks: []
        });
        await newItem.save();
        res.json({ saved: true, message: 'Saved to library.', item: newItem });
      }
    } else {
      const key = `${userId}_${bookId}`;
      if (memLibrary[key]) {
        delete memLibrary[key];
        res.json({ saved: false, message: 'Removed from library.' });
      } else {
        const newItem = {
          userId,
          bookId,
          addedAt: new Date().toISOString().split('T')[0],
          status: 'saved',
          currentPage: 1,
          currentChapterId: 'ch-1',
          progressPercent: 0,
          lastReadAt: 'Just added',
          bookmarks: []
        };
        memLibrary[key] = newItem;
        res.json({ saved: true, message: 'Saved to library.', item: newItem });
      }
    }
  } catch (error: any) {
    console.error('Toggle Save Book Error:', error);
    res.status(500).json({ error: 'Failed to update library item.' });
  }
});

// POST /api/library/progress - Sync reading progress
router.post('/progress', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user._id || req.user.id).toString();
    const { bookId, chapterId, page, totalPages } = req.body;

    if (!bookId) {
      res.status(400).json({ error: 'Book ID is required.' });
      return;
    }

    const validTotal = Math.max(1, totalPages || 100);
    const validPage = Math.max(1, page || 1);
    const percent = Math.min(100, Math.round((validPage / validTotal) * 100));
    const status = percent >= 100 ? 'completed' : 'reading';

    if (isDBConnected()) {
      const item = await UserLibrary.findOneAndUpdate(
        { userId, bookId },
        {
          $set: {
            currentPage: validPage,
            currentChapterId: chapterId || 'ch-1',
            progressPercent: percent,
            status,
            lastReadAt: 'Just now'
          }
        },
        { upsert: true, new: true }
      );

      await User.findByIdAndUpdate(userId, {
        $inc: { totalReadingMinutes: 2 },
        ...(status === 'completed' ? { $inc: { totalBooksRead: 1 } } : {})
      });

      res.json({ message: 'Progress saved.', item });
    } else {
      const key = `${userId}_${bookId}`;
      const existing = memLibrary[key] || {
        userId,
        bookId,
        addedAt: new Date().toISOString().split('T')[0],
        bookmarks: []
      };

      const updated = {
        ...existing,
        currentPage: validPage,
        currentChapterId: chapterId || 'ch-1',
        progressPercent: percent,
        status,
        lastReadAt: 'Just now'
      };

      memLibrary[key] = updated;

      const user = memUsers.find((u) => u._id === userId);
      if (user) {
        user.totalReadingMinutes = (user.totalReadingMinutes || 0) + 2;
        if (status === 'completed') user.totalBooksRead = (user.totalBooksRead || 0) + 1;
      }

      res.json({ message: 'Progress saved.', item: updated });
    }
  } catch (error: any) {
    console.error('Update Progress Error:', error);
    res.status(500).json({ error: 'Failed to record reading progress.' });
  }
});

// POST /api/library/bookmark - Toggle bookmark
router.post('/bookmark', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user._id || req.user.id).toString();
    const { bookId, page, chapterTitle, note } = req.body;

    if (!bookId || page === undefined) {
      res.status(400).json({ error: 'Book ID and page are required.' });
      return;
    }

    if (isDBConnected()) {
      let item = await UserLibrary.findOne({ userId, bookId });
      if (!item) {
        item = new UserLibrary({
          userId,
          bookId,
          status: 'reading',
          currentPage: page,
          currentChapterId: 'ch-1',
          progressPercent: 5,
          lastReadAt: 'Just now',
          bookmarks: []
        });
      }

      const bookmarkIndex = item.bookmarks.findIndex((b) => b.page === page);
      let bookmarked = false;

      if (bookmarkIndex > -1) {
        item.bookmarks.splice(bookmarkIndex, 1);
        bookmarked = false;
      } else {
        item.bookmarks.push({
          page,
          chapterTitle: chapterTitle || 'Chapter',
          note: note || '',
          date: 'Just now'
        });
        bookmarked = true;
      }

      await item.save();

      res.json({
        bookmarked,
        message: bookmarked ? `Bookmarked page ${page}` : `Removed bookmark on page ${page}`,
        bookmarks: item.bookmarks
      });
    } else {
      const key = `${userId}_${bookId}`;
      let item = memLibrary[key];
      if (!item) {
        item = {
          userId,
          bookId,
          status: 'reading',
          currentPage: page,
          currentChapterId: 'ch-1',
          progressPercent: 5,
          lastReadAt: 'Just now',
          bookmarks: []
        };
        memLibrary[key] = item;
      }

      const bookmarkIndex = item.bookmarks.findIndex((b: any) => b.page === page);
      let bookmarked = false;

      if (bookmarkIndex > -1) {
        item.bookmarks.splice(bookmarkIndex, 1);
        bookmarked = false;
      } else {
        item.bookmarks.push({
          page,
          chapterTitle: chapterTitle || 'Chapter',
          note: note || '',
          date: 'Just now'
        });
        bookmarked = true;
      }

      res.json({
        bookmarked,
        message: bookmarked ? `Bookmarked page ${page}` : `Removed bookmark on page ${page}`,
        bookmarks: item.bookmarks
      });
    }
  } catch (error: any) {
    console.error('Bookmark Error:', error);
    res.status(500).json({ error: 'Failed to save bookmark.' });
  }
});

export default router;
