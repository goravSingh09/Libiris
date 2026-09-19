import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit3, 
  BarChart3, 
  Search, 
  Check, 
  Sparkles,
  Layers,
  Database
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { Book, CategoryId } from '../../types';
import { CATEGORIES } from '../../data/categories';

export const AdminDashboard: React.FC = () => {
  const { books, adminUpdateBookPrice, adminAddNewBook, showToast } = useLibrary();
  const [adminTab, setAdminTab] = useState<'books' | 'categories' | 'analytics' | 'users'>('books');
  const [filterQuery, setFilterQuery] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPriceVal, setNewPriceVal] = useState<number>(10);

  // New book quick form state
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryId>('science');
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newPages, setNewPages] = useState<number>(200);

  // Stats calculations
  const totalBooks = books.length;
  const totalReads = books.reduce((acc, b) => acc + b.readsCount, 0);
  const freeBooksCount = books.filter((b) => b.price === 0).length;
  const simulatedRevenue = books.reduce((acc, b) => acc + (b.readsCount * 0.08 * b.price), 0);

  const filteredBooks = books.filter((b) => 
    b.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(filterQuery.toLowerCase()) ||
    b.categoryLabel.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleSavePrice = (bookId: string) => {
    adminUpdateBookPrice(bookId, Number(newPriceVal));
    setEditingPriceId(null);
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) return;

    const newBookRecord: Book = {
      id: `book_${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      authorBio: `${newAuthor.trim()} is an author and educator.`,
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
      category: newCategory,
      categoryLabel: CATEGORIES.find((c) => c.id === newCategory)?.name || 'General',
      subcategories: ['Reference', 'Curated Library Edition'],
      rating: 4.8,
      reviewCount: 1,
      pageCount: Number(newPages),
      publishedYear: 2026,
      language: 'English',
      isbn: `978-019${Math.floor(100000 + Math.random() * 900000)}`,
      price: Number(newPrice),
      isPublicDomain: Number(newPrice) === 0,
      readsCount: 120,
      synopsis: `A curated volume on ${newTitle.trim()}, catalogued for digital reading on the Libris platform.`,
      excerpt: 'The true university of these days is a collection of books.',
      tags: ['curated', 'library-edition', newCategory],
      chapters: [
        {
          id: 'ch-new-1',
          number: 1,
          title: 'Chapter 1 - Foundations and Principles',
          content: [
            `Welcome to the digital edition of ${newTitle.trim()}.`,
            'This text has been ingested into the Libris repository to facilitate accessible and affordable lifelong reading.',
            'Continuous study transforms curiosity into lasting wisdom.'
          ]
        }
      ],
      reviews: []
    };

    adminAddNewBook(newBookRecord);
    setIsAddingBook(false);
    setNewTitle('');
    setNewAuthor('');
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Library Infrastructure & Ingestion</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Library Administration & Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Scalable management console demonstrating catalogue ingestion, pricing rules, and community analytics.
          </p>
        </div>

        <button
          onClick={() => setIsAddingBook(true)}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest New Book</span>
        </button>
      </div>

      {/* 4 Analytics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Catalogue Volume</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalBooks}</p>
          <span className="text-[11px] text-emerald-400 font-medium mt-1 block">
            {freeBooksCount} Open Public Domain
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Digital Reads</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {totalReads.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            Across 12 disciplines
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Simulated Micro-Yield</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white">
            ₹{Math.round(simulatedRevenue).toLocaleString()}
          </p>
          <span className="text-[11px] text-amber-400 font-medium mt-1 block">
            Average ₹8.50 per unlock
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Active Readers</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">10,480</p>
          <span className="text-[11px] text-emerald-400 font-medium mt-1 block">
            99.98% System Uptime
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
        <button
          onClick={() => setAdminTab('books')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'books'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Book Inventory ({books.length})
        </button>
        <button
          onClick={() => setAdminTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'categories'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Discipline Taxonomies ({CATEGORIES.length})
        </button>
        <button
          onClick={() => setAdminTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            adminTab === 'analytics'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Reader Activity Log
        </button>
      </div>

      {/* Modal / Inline Add Book Form */}
      {isAddingBook && (
        <form 
          onSubmit={handleCreateBook}
          className="p-6 rounded-3xl bg-slate-900/90 border-2 border-amber-500/50 mb-8 space-y-4 animate-in fade-in shadow-2xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Ingest New Book Record</span>
            </h3>
            <button 
              type="button" 
              onClick={() => setIsAddingBook(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Book Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Principles of Quantum Computing"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Author Name</label>
              <input
                type="text"
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="e.g. Dr. Richard Feynman"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as CategoryId)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Access Price (₹)</label>
              <select
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              >
                <option value={0}>Free (₹0 Public Domain)</option>
                <option value={5}>₹5 Micro-Pass</option>
                <option value={10}>₹10 Reference Pass</option>
                <option value={15}>₹15 Textbook Pass</option>
                <option value={20}>₹20 Masterclass Pass</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Add to Live Catalogue
            </button>
          </div>
        </form>
      )}

      {/* Tab 1: Book Inventory Table */}
      {adminTab === 'books' && (
        <div className="space-y-4">
          
          {/* Table search filter */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter by title, author, or genre..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="text-xs text-slate-400">
              Showing {filteredBooks.length} of {books.length} volumes
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Book Title & Details</th>
                  <th className="p-4">Discipline</th>
                  <th className="p-4">Total Reads</th>
                  <th className="p-4">Access Fee</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-8 h-11 object-cover rounded shadow-sm border border-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{book.title}</p>
                          <p className="text-[11px] text-slate-400">by {book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
                        {book.categoryLabel}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-medium text-slate-200">
                      {book.readsCount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      {editingPriceId === book.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={newPriceVal}
                            onChange={(e) => setNewPriceVal(Number(e.target.value))}
                            className="bg-slate-950 border border-amber-500 rounded p-1 text-white text-xs"
                          >
                            <option value={0}>Free</option>
                            <option value={5}>₹5</option>
                            <option value={10}>₹10</option>
                            <option value={15}>₹15</option>
                            <option value={20}>₹20</option>
                          </select>
                          <button
                            onClick={() => handleSavePrice(book.id)}
                            className="p-1 rounded bg-amber-500 text-slate-950 hover:bg-amber-400"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className={`font-bold ${book.price === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {book.price === 0 ? 'Free' : `₹${book.price}`}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setEditingPriceId(book.id);
                          setNewPriceVal(book.price);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Adjust Price"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Tab 2: Category Taxonomies */}
      {adminTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                <span className="text-[11px] text-amber-400 font-mono mt-2 block font-medium">
                  {cat.bookCount.toLocaleString()} Titles in Master Index
                </span>
              </div>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ml-3"
                style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
              >
                <Layers className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Reader Activity Logs */}
      {adminTab === 'analytics' && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Real-time Decentralized Reading Sessions</span>
          </h3>
          <div className="space-y-2 text-xs font-mono">
            {[
              { time: '19:44:12', user: 'reader_492 (Delhi)', event: 'Unlocked "The Great Gatsby" for ₹5' },
              { time: '19:43:08', user: 'reader_108 (Bengaluru)', event: 'Read 14 pages of "Frankenstein" in Sepia mode' },
              { time: '19:41:55', user: 'reader_881 (Mumbai)', event: 'Added 2 bookmarks in "Structure & Interpretation of Computer Programs"' },
              { time: '19:40:22', user: 'reader_320 (Kolkata)', event: 'Completed "The Art of War" by Sun Tzu' }
            ].map((log, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-850 flex items-center justify-between">
                <span className="text-amber-400">{log.time}</span>
                <span className="text-slate-300">{log.user}</span>
                <span className="text-emerald-400">{log.event}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
