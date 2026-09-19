import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, isDBConnected } from './config/db.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import booksRoutes from './routes/books.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import libraryRoutes from './routes/library.routes.js';
import purchasesRoutes from './routes/purchases.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: (origin, callback) => {
    // Allow all vercel domains, localhost, clientUrl, and tool requests
    if (!origin || origin.includes('vercel.app') || origin.includes('localhost') || origin === clientUrl) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// API Root & Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Libris Digital Library Backend API',
    databaseConnected: isDBConnected(),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/admin', adminRoutes);

// 404 Not Found Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API endpoint not found: ${req.originalUrl}` });
});

// Central Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error occurred.'
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  
  const server = app.listen(PORT, () => {
    console.log(`\n🚀 [Libris Backend Server Running]: http://localhost:${PORT}`);
    console.log(`📡 [CORS Enabled for]: ${clientUrl}`);
    console.log(`🔍 [Health Check]: http://localhost:${PORT}/api/health\n`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${PORT} is busy, attempting port ${Number(PORT) + 1}...`);
      app.listen(Number(PORT) + 1, () => {
        console.log(`\n🚀 [Libris Backend Server Running]: http://localhost:${Number(PORT) + 1}`);
      });
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer();

export default app;
