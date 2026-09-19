import { Router, Request, Response } from 'express';
import { Category } from '../models/Category.js';
import { isDBConnected } from '../config/db.js';
import { memCategories } from '../config/memoryStore.js';

const router = Router();

// GET /api/categories
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    if (isDBConnected()) {
      const categories = await Category.find().sort({ bookCount: -1 });
      res.json(categories);
    } else {
      res.json(memCategories);
    }
  } catch (error: any) {
    console.error('Fetch Categories Error:', error);
    res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
});

export default router;
