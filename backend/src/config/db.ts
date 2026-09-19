import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  if (isConnected) return true;

  const mongoUri = process.env.DATABASE_URL;

  if (!mongoUri || mongoUri.trim() === '') {
    console.warn(
      '\n⚠️ [Database Notice]: DATABASE_URL is not set in backend/.env.\n' +
      'Please add your MongoDB Atlas connection string (or local MongoDB URL) in backend/.env to connect to your live database.\n' +
      'For now, server will initialize in offline/in-memory mode for routes.\n'
    );
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ [MongoDB Connection Error]:', error);
    console.warn('⚠️ Server will continue in resilient offline fallback mode.');
    return false;
  }
};

export const isDBConnected = () => isConnected;
