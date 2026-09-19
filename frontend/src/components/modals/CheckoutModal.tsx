import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Sparkles, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLibrary } from '../../context/LibraryContext';

export const CheckoutModal: React.FC = () => {
  const { activeModal, closeModal, books, unlockBook, openReader } = useLibrary();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const bookId = activeModal.type === 'checkout' ? activeModal.bookId : null;
  const book = books.find((b) => b.id === bookId);

  if (!book) return null;

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback gracefully
      }
    }, 900);
  };

  const handleFinishAndRead = async () => {
    await unlockBook(book.id, paymentMethod);
    openReader(book);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-[#0F1422] border border-slate-700/80 shadow-2xl overflow-hidden text-slate-200 p-6 sm:p-8"
      >
        {/* Close Button */}
        {!isSuccess && (
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {isSuccess ? (
          /* Polished Success State */
          <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Transaction Completed
              </span>
              <h3 className="text-2xl font-black text-white">
                Book Added to Your Library
              </h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto pt-1">
                You now have permanent digital access to <span className="text-amber-300 font-semibold">"{book.title}"</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left flex items-center gap-3">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-12 h-16 object-cover rounded-lg shadow-sm border border-slate-700 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">{book.title}</p>
                <p className="text-xs text-slate-400 truncate">by {book.author}</p>
                <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">
                  ✓ Ready in Online Reader
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleFinishAndRead}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Start Reading Now</span>
              </button>
              <button
                onClick={async () => {
                  await unlockBook(book.id, paymentMethod);
                  closeModal();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Done (Keep Browsing)
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Formulation State */
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-bold mb-2 border border-amber-500/20">
                <Sparkles className="w-3 h-3" />
                <span>Micro-Access Checkout</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Unlock This Book for ₹{book.price}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Low-cost micro-contribution for permanent browser reading privileges.
              </p>
            </div>

            {/* Book Item Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-12 h-16 object-cover rounded-lg border border-slate-700 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">{book.title}</h4>
                <p className="text-xs text-slate-400 truncate">by {book.author}</p>
                <div className="flex items-center justify-between mt-1 text-xs">
                  <span className="text-slate-400">{book.pageCount} pages</span>
                  <span className="font-extrabold text-amber-400">₹{book.price}</span>
                </div>
              </div>
            </div>

            {/* Simulated Payment Methods */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 block">
                Select Simulated Payment Instrument:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: <Smartphone className="w-4 h-4" /> },
                  { id: 'card', label: 'Card', icon: <CreditCard className="w-4 h-4" /> },
                  { id: 'wallet', label: 'Wallet', icon: <ShieldCheck className="w-4 h-4" /> }
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === method.id
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {method.icon}
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Total breakdown */}
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Book Access Contribution</span>
                <span>₹{book.price}.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Library Digitization Fee</span>
                <span className="text-emerald-400">₹0.00 (Waived)</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white text-sm">
                <span>Total Amount</span>
                <span className="text-amber-400">₹{book.price}.00</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Simulated demo transaction. No real billing required.</span>
            </div>

            {/* Action Buttons: Cancel vs Continue */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="inline-block animate-spin">⏳ Processing...</span>
                ) : (
                  <>
                    <span>Continue (₹{book.price})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
