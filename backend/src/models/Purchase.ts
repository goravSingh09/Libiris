import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchase extends Document {
  userId: string;
  userEmail: string;
  bookId: string;
  bookTitle: string;
  amount: number;
  paymentMethod: 'free_claim' | 'upi' | 'card' | 'wallet';
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
  isDemo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    bookId: { type: String, required: true, index: true },
    bookTitle: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { 
      type: String, 
      enum: ['free_claim', 'upi', 'card', 'wallet'], 
      default: 'upi' 
    },
    status: { 
      type: String, 
      enum: ['completed', 'pending', 'failed'], 
      default: 'completed' 
    },
    transactionId: { type: String, required: true, unique: true },
    isDemo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Purchase = mongoose.model<IPurchase>('Purchase', PurchaseSchema);
