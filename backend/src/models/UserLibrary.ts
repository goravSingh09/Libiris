import mongoose, { Schema, Document } from 'mongoose';

export interface IBookmark {
  page: number;
  chapterTitle: string;
  note?: string;
  date: string;
}

export interface IUserLibrary extends Document {
  userId: string;
  bookId: string;
  status: 'reading' | 'saved' | 'completed';
  currentPage: number;
  currentChapterId: string;
  progressPercent: number;
  lastReadAt: string;
  bookmarks: IBookmark[];
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    page: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    note: { type: String },
    date: { type: String, default: 'Just now' }
  },
  { _id: false }
);

const UserLibrarySchema = new Schema<IUserLibrary>(
  {
    userId: { type: String, required: true, index: true },
    bookId: { type: String, required: true, index: true },
    status: { 
      type: String, 
      enum: ['reading', 'saved', 'completed'], 
      default: 'saved' 
    },
    currentPage: { type: Number, default: 1 },
    currentChapterId: { type: String, default: 'ch-1' },
    progressPercent: { type: Number, default: 0 },
    lastReadAt: { type: String, default: 'Just now' },
    bookmarks: { type: [BookmarkSchema], default: [] }
  },
  { timestamps: true }
);

UserLibrarySchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const UserLibrary = mongoose.model<IUserLibrary>('UserLibrary', UserLibrarySchema);
