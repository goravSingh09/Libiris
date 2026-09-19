import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter {
  id: string;
  number: number;
  title: string;
  content: string[];
  estimatedMinutes?: number;
}

export interface IReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  badge?: string;
}

export interface IBook extends Document {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  authorBio: string;
  coverUrl: string;
  spineColor?: string;
  category: string;
  categoryLabel: string;
  subcategories: string[];
  rating: number;
  reviewCount: number;
  pageCount: number;
  publishedYear: number;
  language: string;
  isbn: string;
  price: number;
  isPublicDomain: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  synopsis: string;
  excerpt: string;
  readsCount: number;
  tags: string[];
  chapters: IChapter[];
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema<IChapter>(
  {
    id: { type: String, required: true },
    number: { type: Number, required: true },
    title: { type: String, required: true },
    content: { type: [String], required: true },
    estimatedMinutes: { type: Number, default: 4 }
  },
  { _id: false }
);

const ReviewSchema = new Schema<IReview>(
  {
    id: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: String, default: 'Recent' },
    comment: { type: String, required: true },
    badge: { type: String }
  },
  { _id: false }
);

const BookSchema = new Schema<IBook>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    subtitle: { type: String },
    author: { type: String, required: true, index: true },
    authorBio: { type: String, default: '' },
    coverUrl: { type: String, required: true },
    spineColor: { type: String, default: '#1e293b' },
    category: { type: String, required: true, index: true },
    categoryLabel: { type: String, required: true },
    subcategories: { type: [String], default: [] },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
    pageCount: { type: Number, required: true },
    publishedYear: { type: Number, required: true },
    language: { type: String, default: 'English', index: true },
    isbn: { type: String, required: true },
    price: { type: Number, required: true, default: 0, index: true },
    isPublicDomain: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    synopsis: { type: String, required: true },
    excerpt: { type: String, default: '' },
    readsCount: { type: Number, default: 100 },
    tags: { type: [String], default: [] },
    chapters: { type: [ChapterSchema], default: [] },
    reviews: { type: [ReviewSchema], default: [] }
  },
  { timestamps: true }
);

export const Book = mongoose.model<IBook>('Book', BookSchema);
