import { Router, Request, Response } from 'express';
import { Book } from '../models/Book.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { isDBConnected } from '../config/db.js';
import { memBooks } from '../config/memoryStore.js';

const router = Router();

// GET /api/books - Search, filter, sort, paginate
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, category, author, language, price, sort = 'popularity', page = '1', limit = '50' } = req.query;

    if (isDBConnected()) {
      const queryObj: any = {};

      if (category && category !== 'all') queryObj.category = category;
      if (author && author !== 'all') queryObj.author = author;
      if (language && language !== 'all') queryObj.language = language;

      if (price === 'free') {
        queryObj.price = 0;
      } else if (price === 'under10') {
        queryObj.price = { $lte: 10 };
      } else if (price === 'under20') {
        queryObj.price = { $lte: 20 };
      }

      if (q && typeof q === 'string' && q.trim()) {
        const searchRegex = new RegExp(q.trim(), 'i');
        queryObj.$or = [
          { title: searchRegex },
          { author: searchRegex },
          { categoryLabel: searchRegex },
          { synopsis: searchRegex },
          { tags: searchRegex }
        ];
      }

      let sortObj: any = { readsCount: -1 };
      if (sort === 'rating') sortObj = { rating: -1 };
      if (sort === 'newest') sortObj = { publishedYear: -1 };
      if (sort === 'priceLow') sortObj = { price: 1 };
      if (sort === 'popularity') sortObj = { readsCount: -1 };

      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit as string) || 50));
      const skip = (pageNum - 1) * limitNum;

      const [books, total] = await Promise.all([
        Book.find(queryObj).sort(sortObj).skip(skip).limit(limitNum),
        Book.countDocuments(queryObj)
      ]);

      res.json({
        books,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1
        }
      });
    } else {
      // In-Memory search, filter, and sort
      let filtered = [...memBooks];

      if (category && category !== 'all') {
        filtered = filtered.filter((b) => b.category === category);
      }
      if (author && author !== 'all') {
        filtered = filtered.filter((b) => b.author === author);
      }
      if (language && language !== 'all') {
        filtered = filtered.filter((b) => b.language === language);
      }
      if (price === 'free') {
        filtered = filtered.filter((b) => b.price === 0);
      } else if (price === 'under10') {
        filtered = filtered.filter((b) => b.price <= 10);
      } else if (price === 'under20') {
        filtered = filtered.filter((b) => b.price <= 20);
      }

      if (q && typeof q === 'string' && q.trim()) {
        const queryLower = q.toLowerCase().trim();
        filtered = filtered.filter((b) => 
          b.title.toLowerCase().includes(queryLower) ||
          b.author.toLowerCase().includes(queryLower) ||
          b.categoryLabel.toLowerCase().includes(queryLower) ||
          b.synopsis.toLowerCase().includes(queryLower) ||
          b.tags.some((t: string) => t.toLowerCase().includes(queryLower))
        );
      }

      if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
      else if (sort === 'newest') filtered.sort((a, b) => b.publishedYear - a.publishedYear);
      else if (sort === 'priceLow') filtered.sort((a, b) => a.price - b.price);
      else filtered.sort((a, b) => b.readsCount - a.readsCount);

      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit as string) || 50));
      const start = (pageNum - 1) * limitNum;
      const paginated = filtered.slice(start, start + limitNum);

      res.json({
        books: paginated,
        pagination: {
          total: filtered.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(filtered.length / limitNum) || 1
        }
      });
    }
  } catch (error: any) {
    console.error('Fetch Books Error:', error);
    res.status(500).json({ error: 'Failed to retrieve book catalogue.' });
  }
});

// GET /api/books/:id - Get single book details
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    if (isDBConnected()) {
      const book = await Book.findOne({ id: req.params.id });
      if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }
      await Book.updateOne({ id: req.params.id }, { $inc: { readsCount: 1 } });
      res.json(book);
    } else {
      const book = memBooks.find((b) => b.id === req.params.id);
      if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }
      book.readsCount = (book.readsCount || 0) + 1;
      res.json(book);
    }
  } catch (error: any) {
    console.error('Fetch Single Book Error:', error);
    res.status(500).json({ error: 'Failed to load book record.' });
  }
});

// POST /api/books - Admin Create New Book
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookData = req.body;

    if (!bookData.title || !bookData.author || !bookData.category) {
      res.status(400).json({ error: 'Title, Author, and Category are required.' });
      return;
    }

    const id = bookData.id || `book_${Date.now()}`;
    const newBook = {
      ...bookData,
      id,
      readsCount: bookData.readsCount || 100,
      rating: bookData.rating || 4.8,
      reviewCount: bookData.reviewCount || 1,
      chapters: bookData.chapters || [
        {
          id: 'ch-1',
          number: 1,
          title: 'Chapter 1 - Introduction',
          content: ['Welcome to the digital edition on Libris.']
        }
      ],
      reviews: []
    };

    if (isDBConnected()) {
      const doc = new Book(newBook);
      await doc.save();
      res.status(201).json({ message: 'Book created successfully.', book: doc });
    } else {
      memBooks.unshift(newBook);
      res.status(201).json({ message: 'Book created successfully.', book: newBook });
    }
  } catch (error: any) {
    console.error('Admin Create Book Error:', error);
    res.status(500).json({ error: 'Failed to create book record.' });
  }
});

// PUT /api/books/:id - Admin Update Book / Price
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isDBConnected()) {
      const updated = await Book.findOneAndUpdate(
        { id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      if (!updated) {
        res.status(404).json({ error: 'Book not found to update.' });
        return;
      }
      res.json({ message: 'Book updated successfully.', book: updated });
    } else {
      const idx = memBooks.findIndex((b) => b.id === req.params.id);
      if (idx === -1) {
        res.status(404).json({ error: 'Book not found to update.' });
        return;
      }
      memBooks[idx] = { ...memBooks[idx], ...req.body };
      res.json({ message: 'Book updated successfully.', book: memBooks[idx] });
    }
  } catch (error: any) {
    console.error('Admin Update Book Error:', error);
    res.status(500).json({ error: 'Failed to update book record.' });
  }
});

// DELETE /api/books/:id - Admin Delete Book
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isDBConnected()) {
      const deleted = await Book.findOneAndDelete({ id: req.params.id });
      if (!deleted) {
        res.status(404).json({ error: 'Book not found to delete.' });
        return;
      }
      res.json({ message: 'Book deleted successfully.' });
    } else {
      const idx = memBooks.findIndex((b) => b.id === req.params.id);
      if (idx === -1) {
        res.status(404).json({ error: 'Book not found to delete.' });
        return;
      }
      memBooks.splice(idx, 1);
      res.json({ message: 'Book deleted successfully.' });
    }
  } catch (error: any) {
    console.error('Admin Delete Book Error:', error);
    res.status(500).json({ error: 'Failed to delete book.' });
  }
});

export default router;
