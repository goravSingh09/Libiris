import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'reader' | 'librarian';
  tier: 'Free Member' | 'Digital Patron' | 'Student Scholar';
  avatar: string;
  unlockedBookIds: string[];
  readingStreakDays: number;
  totalReadingMinutes: number;
  totalBooksRead: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['reader', 'librarian'], default: 'reader' },
    tier: { 
      type: String, 
      enum: ['Free Member', 'Digital Patron', 'Student Scholar'], 
      default: 'Free Member' 
    },
    avatar: { 
      type: String, 
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' 
    },
    unlockedBookIds: { type: [String], default: [] },
    readingStreakDays: { type: Number, default: 1 },
    totalReadingMinutes: { type: Number, default: 0 },
    totalBooksRead: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
