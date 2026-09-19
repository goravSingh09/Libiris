import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { isDBConnected } from '../config/db.js';
import { memUsers } from '../config/memoryStore.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access denied. No authentication token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_libris_key_2026';

    const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string; role: string };

    if (isDBConnected()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401).json({ error: 'Invalid authentication session. User not found.' });
        return;
      }
      req.user = user;
    } else {
      const user = memUsers.find((u) => u._id === decoded.id || u.email === decoded.email);
      if (!user) {
        res.status(401).json({ error: 'Invalid authentication session. User not found.' });
        return;
      }
      req.user = user;
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user || req.user.role !== 'librarian') {
    res.status(403).json({ error: 'Forbidden. Administrator privileges required.' });
    return Promise.resolve();
  }
  next();
  return Promise.resolve();
};
