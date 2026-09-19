import { Router, Response } from 'express';
import { Purchase } from '../models/Purchase.js';
import { Book } from '../models/Book.js';
import { User } from '../models/User.js';
import { UserLibrary } from '../models/UserLibrary.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { isDBConnected } from '../config/db.js';
import { memPurchases, memBooks, memUsers, memLibrary } from '../config/memoryStore.js';

const router = Router();

router.use(authenticate);

// POST /api/purchases/checkout - Unlock free or micro-pass book
router.post('/checkout', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user._id || req.user.id).toString();
    const userEmail = req.user.email;
    const { bookId, paymentMethod = 'upi', isDemo = true } = req.body;

    if (!bookId) {
      res.status(400).json({ error: 'Book ID is required.' });
      return;
    }

    if (isDBConnected()) {
      const book = await Book.findOne({ id: bookId });
      if (!book) {
        res.status(404).json({ error: 'Book record not found.' });
        return;
      }

      const amount = book.price || 0;
      const isFree = amount === 0 || book.isPublicDomain;
      const method = isFree ? 'free_claim' : paymentMethod;
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const purchase = new Purchase({
        userId,
        userEmail,
        bookId: book.id,
        bookTitle: book.title,
        amount,
        paymentMethod: method,
        status: 'completed',
        transactionId,
        isDemo
      });
      await purchase.save();

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { unlockedBookIds: book.id } },
        { new: true }
      );

      await UserLibrary.findOneAndUpdate(
        { userId, bookId: book.id },
        {
          $setOnInsert: {
            status: 'reading',
            currentPage: 1,
            currentChapterId: book.chapters[0]?.id || 'ch-1',
            progressPercent: 0,
            lastReadAt: 'Just unlocked',
            bookmarks: []
          }
        },
        { upsert: true, new: true }
      );

      res.status(201).json({
        message: isFree
          ? `"${book.title}" added to your library for free.`
          : `"${book.title}" unlocked successfully for ₹${amount}.`,
        purchase,
        unlockedBookIds: updatedUser?.unlockedBookIds || [book.id]
      });
    } else {
      const book = memBooks.find((b) => b.id === bookId);
      if (!book) {
        res.status(404).json({ error: 'Book record not found.' });
        return;
      }

      const amount = book.price || 0;
      const isFree = amount === 0 || book.isPublicDomain;
      const method = isFree ? 'free_claim' : paymentMethod;
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const purchase = {
        _id: `pur_${Date.now()}`,
        userId,
        userEmail,
        bookId: book.id,
        bookTitle: book.title,
        amount,
        paymentMethod: method,
        status: 'completed',
        transactionId,
        isDemo,
        createdAt: new Date()
      };
      memPurchases.unshift(purchase);

      const user = memUsers.find((u) => u._id === userId);
      if (user && !user.unlockedBookIds.includes(book.id)) {
        user.unlockedBookIds.push(book.id);
      }

      const key = `${userId}_${book.id}`;
      if (!memLibrary[key]) {
        memLibrary[key] = {
          userId,
          bookId: book.id,
          addedAt: new Date().toISOString().split('T')[0],
          status: 'reading',
          currentPage: 1,
          currentChapterId: 'ch-1',
          progressPercent: 0,
          lastReadAt: 'Just unlocked',
          bookmarks: []
        };
      }

      res.status(201).json({
        message: isFree
          ? `"${book.title}" added to your library for free.`
          : `"${book.title}" unlocked successfully for ₹${amount}.`,
        purchase,
        unlockedBookIds: user?.unlockedBookIds || [book.id]
      });
    }
  } catch (error: any) {
    console.error('Checkout Error:', error);
    res.status(500).json({ error: 'Failed to complete checkout transaction.' });
  }
});

// GET /api/purchases/my - Order history
router.get('/my', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user._id || req.user.id).toString();

    if (isDBConnected()) {
      const purchases = await Purchase.find({ userId }).sort({ createdAt: -1 });
      res.json(purchases);
    } else {
      const userPurchases = memPurchases.filter((p) => p.userId === userId);
      res.json(userPurchases);
    }
  } catch (error: any) {
    console.error('Fetch Purchases Error:', error);
    res.status(500).json({ error: 'Failed to load purchase history.' });
  }
});

export default router;
