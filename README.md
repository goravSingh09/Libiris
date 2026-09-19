# 📚 Libris — The Digital Public Library

> **"Your Library, Anywhere. Millions of Pages. One Library."**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

Libris is an online library platform built to revolutionize access to literature, academic knowledge, and research. Rather than being bound by physical library locations, opening hours, or inventory hold lists, readers can discover, borrow, and read complete volumes digitally at a fraction of the cost—starting from **₹5**.

---

## 🌟 Key Highlights & Features

### 1. 📖 Distraction-Free Digital Reader
- **Multi-Theme Engine**: Read in **Day** (White), **Warm Sepia** (Parchment), **Slate Dark**, or **OLED Night**.
- **Typography Controls**: Choose between Editorial Serif (*Merriweather*), Modern Sans (*Inter*), or Technical Monospace (*JetBrains Mono*), with four text-scaling levels (`sm`, `md`, `lg`, `xl`).
- **Text-to-Speech (TTS) Narration**: Built-in speech synthesis engine to listen to book chapters hands-free.
- **Keyboard Shortcuts**:
  - `←` / `→` arrow keys: Turn pages backward and forward.
  - `Spacebar`: Flip page forward.
  - `Esc`: Exit reader.
- **Bookmarks & Chapter Jump**: Drawer table of contents and persistent page bookmarks saved per book.

### 2. 🏛️ Comprehensive Catalogue (30+ Curated Books)
- **12 Disciplines**: Fiction, Science, Technology, History, Mathematics, Business, Psychology, Self Development, Literature, Programming, Children's Books, and Competitive Exams.
- **Multi-Dimensional Filters**: Search by query, filter by discipline, author, language, or price (Free / Under ₹10 / Under ₹20).
- **Sorting & View Toggle**: Sort by popularity (reads), ratings, publication year, or price, with Grid and List view options.

### 3. 💳 Democratic Micro-Access Model
- **Public-Domain Classics**: 100% Free forever (Frankenstein, Sherlock Holmes, Pride & Prejudice, Meditations, etc.).
- **Pay-Per-Book**: Nominal ₹5 to ₹20 micro-contributions for permanent access.
- **Simulated Checkout**: Client-side instant UPI/Card simulated payment with celebratory confetti burst.

### 4. 📊 "My Library" Reader Dashboard
- **Continue Reading**: Direct resume cards with active progress bars (e.g. *Atomic Habits* 68%, *SICP* 32%).
- **Reading Streak**: Daily streak tracker (e.g. 🔥 14-day streak).
- **Saved Shelves**: Bookmarks repository with instant jumps back to saved pages and personal wishlist.

### 5. 🔍 Universal Search (`Ctrl+K` / `Cmd+K`)
- Command palette popup with recent search history and popular recommendations.
- Instant search across titles, authors, synopsis, and tags.

### 6. 🛡️ Library Administration Portal
- Scalable admin dashboard to ingest new book records, edit book prices live, and monitor real-time reading sessions and metrics.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Bundler & Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, Tailwind transitions
- **State & Storage**: React Context API with LocalStorage synchronization

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended; tested on v24)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/libris-digital-library.git
   cd libris-digital-library
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 📂 Project Structure

```text
webbuild/
├── index.html                  # Entry HTML with web fonts
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Custom theme and typography
├── postcss.config.js           # PostCSS configuration
└── src/
    ├── main.tsx                # Application mount point
    ├── App.tsx                 # Core page routing & modal orchestration
    ├── index.css               # Base Tailwind layers and custom scrollbar
    ├── types/
    │   └── index.ts            # Data models (Book, Chapter, User, Settings)
    ├── data/
    │   ├── books.ts            # 32 curated volumes with full chapter texts
    │   └── categories.ts       # 12 library disciplines & metadata
    ├── context/
    │   └── LibraryContext.tsx  # Central state, reader management & persistence
    ├── utils/
    │   └── storage.ts          # Safe LocalStorage persistence helper
    └── components/
        ├── layout/             # Navbar, Footer, ToastContainer
        ├── home/               # Hero, CategoryGrid, Trending, WhyDigital, HowItWorks, Comparison
        ├── library/            # LibraryCatalogue, BookCard
        ├── reader/             # DigitalReader (Themes, Audio, Controls)
        ├── dashboard/          # MyLibrary (Progress, Bookmarks, Streaks)
        ├── pricing/            # PricingSection (Free, Pay-per-book, Patron)
        ├── admin/              # AdminDashboard (Ingestion, Live price edits, Stats)
        └── modals/             # BookDetailsModal, CheckoutModal, GlobalSearchModal, AuthModal
```

---

## 📜 Compliance & Ethics

All literature featured in the demo consists of authentic public-domain works or open-access materials. Demo transactions and user profiles are simulated locally for exhibition and competition evaluation.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
