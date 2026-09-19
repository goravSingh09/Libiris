import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  name: string;
  description: string;
  iconName: string;
  bookCount: number;
  gradient: string;
  color: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    iconName: { type: String, required: true },
    bookCount: { type: Number, default: 0 },
    gradient: { type: String, default: 'from-amber-500/20 to-orange-500/20' },
    color: { type: String, default: '#F59E0B' }
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
