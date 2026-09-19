import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { isDBConnected } from '../config/db.js';
import { memUsers } from '../config/memoryStore.js';

const router = Router();

const generateToken = (userId: string, email: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_libris_key_2026';
  return jwt.sign({ id: userId, email, role }, secret, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', async (req, res): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Please provide name, email, and password.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isDBConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        res.status(409).json({ error: 'An account with this email already exists.' });
        return;
      }

      const newUser = new User({
        name: name.trim(),
        email: cleanEmail,
        password,
        role: 'reader',
        tier: 'Free Member',
        unlockedBookIds: ['frankenstein', 'sherlock-holmes', 'pride-and-prejudice', 'meditations-marcus-aurelius']
      });

      await newUser.save();
      const token = generateToken(newUser._id.toString(), newUser.email, newUser.role);

      res.status(201).json({
        message: 'Account created successfully.',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          tier: newUser.tier,
          avatar: newUser.avatar,
          unlockedBookIds: newUser.unlockedBookIds,
          readingStreakDays: newUser.readingStreakDays,
          totalReadingMinutes: newUser.totalReadingMinutes,
          totalBooksRead: newUser.totalBooksRead
        }
      });
    } else {
      const existing = memUsers.find((u) => u.email === cleanEmail);
      if (existing) {
        res.status(409).json({ error: 'An account with this email already exists.' });
        return;
      }

      const newId = `usr_${Date.now()}`;
      const newUser = {
        _id: newId,
        name: name.trim(),
        email: cleanEmail,
        passwordHash: bcrypt.hashSync(password, 10),
        role: 'reader' as const,
        tier: 'Free Member' as const,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        unlockedBookIds: ['frankenstein', 'sherlock-holmes', 'pride-and-prejudice', 'meditations-marcus-aurelius'],
        readingStreakDays: 1,
        totalReadingMinutes: 0,
        totalBooksRead: 0
      };

      memUsers.push(newUser);
      const token = generateToken(newId, cleanEmail, 'reader');

      res.status(201).json({
        message: 'Account created successfully.',
        token,
        user: {
          id: newId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          tier: newUser.tier,
          avatar: newUser.avatar,
          unlockedBookIds: newUser.unlockedBookIds,
          readingStreakDays: newUser.readingStreakDays,
          totalReadingMinutes: newUser.totalReadingMinutes,
          totalBooksRead: newUser.totalBooksRead
        }
      });
    }
  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Failed to register account. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Please provide both email and password.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isDBConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }

      const token = generateToken(user._id.toString(), user.email, user.role);

      res.json({
        message: 'Logged in successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          tier: user.tier,
          avatar: user.avatar,
          unlockedBookIds: user.unlockedBookIds,
          readingStreakDays: user.readingStreakDays,
          totalReadingMinutes: user.totalReadingMinutes,
          totalBooksRead: user.totalBooksRead
        }
      });
    } else {
      const user = memUsers.find((u) => u.email === cleanEmail);
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }

      const isMatch = bcrypt.compareSync(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid email or password.' });
        return;
      }

      const token = generateToken(user._id, user.email, user.role);

      res.json({
        message: 'Logged in successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          tier: user.tier,
          avatar: user.avatar,
          unlockedBookIds: user.unlockedBookIds,
          readingStreakDays: user.readingStreakDays,
          totalReadingMinutes: user.totalReadingMinutes,
          totalBooksRead: user.totalBooksRead
        }
      });
    }
  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const u = req.user;
  res.json({
    user: {
      id: u._id || u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      tier: u.tier,
      avatar: u.avatar,
      unlockedBookIds: u.unlockedBookIds || [],
      readingStreakDays: u.readingStreakDays || 1,
      totalReadingMinutes: u.totalReadingMinutes || 0,
      totalBooksRead: u.totalBooksRead || 0
    }
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

export default router;
