import React, { useState, useEffect } from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/layout/ToastContainer';
import { Hero } from './components/home/Hero';
import { CategoryGrid } from './components/home/CategoryGrid';
import { TrendingSection } from './components/home/TrendingSection';
import { WhyDigital } from './components/home/WhyDigital';
import { HowItWorks } from './components/home/HowItWorks';
import { ComparisonSection } from './components/home/ComparisonSection';
import { LibraryCatalogue } from './components/library/LibraryCatalogue';
import { MyLibrary } from './components/dashboard/MyLibrary';
import { PricingSection } from './components/pricing/PricingSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DigitalReader } from './components/reader/DigitalReader';
import { BookDetailsModal } from './components/modals/BookDetailsModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { AuthModal } from './components/modals/AuthModal';
import { CategoryId } from './types';
import { updateSEO } from './utils/seo';
import { CATEGORIES } from './data/categories';

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'library' | 'my-library' | 'pricing' | 'admin'>('home');
  const { 
    books, 
    openReader, 
    openSearch, 
    openBookDetails,
    activeModal,
    setActiveCategoryFilter, 
    activeReaderBook 
  } = useLibrary();

  // Sync route on popstate and initial page load
  useEffect(() => {
    const syncRouteFromLocation = () => {
      const pathname = window.location.pathname;

      if (pathname === '/catalogue' || pathname === '/library') {
        setCurrentTab('library');
        updateSEO({
          title: 'Book Catalogue - Libiris Online Digital Library',
          description: 'Browse and search digital public books, academic texts, and classic literature on Libiris online digital library.',
          canonicalUrl: 'https://libiris-digital.vercel.app/catalogue',
        });
      } else if (pathname === '/pricing') {
        setCurrentTab('pricing');
        updateSEO({
          title: 'Pricing & Micro-Access - Libiris Online Digital Library',
          description: 'Read public classics for free, and unlock curated reference editions starting from ₹5 on Libiris digital library.',
          canonicalUrl: 'https://libiris-digital.vercel.app/pricing',
        });
      } else if (pathname.startsWith('/category/')) {
        const catId = pathname.replace('/category/', '').trim() as CategoryId;
        const catInfo = CATEGORIES.find((c) => c.id === catId);
        if (catInfo) {
          setActiveCategoryFilter(catId);
          setCurrentTab('library');
          updateSEO({
            title: `${catInfo.name} Books - Libiris Online Digital Library`,
            description: `Explore curated ${catInfo.name} books and classics on Libiris online digital library. ${catInfo.description}.`,
            canonicalUrl: `https://libiris-digital.vercel.app/category/${catId}`,
          });
        }
      } else if (pathname.startsWith('/books/')) {
        const bookId = pathname.replace('/books/', '').trim();
        const book = books.find((b) => b.id === bookId);
        if (book) {
          openBookDetails(book.id);
        }
      } else if (pathname === '/' || pathname === '') {
        setCurrentTab('home');
        updateSEO();
      }
    };

    syncRouteFromLocation();
    window.addEventListener('popstate', syncRouteFromLocation);
    return () => window.removeEventListener('popstate', syncRouteFromLocation);
  }, [books, openBookDetails, setActiveCategoryFilter]);

  // Sync SEO metadata whenever book details modal is active
  useEffect(() => {
    if (activeModal.type === 'book_details' && activeModal.bookId) {
      const book = books.find((b) => b.id === activeModal.bookId);
      if (book) {
        updateSEO({
          title: `${book.title} by ${book.author} - Libiris Online Digital Library`,
          description: `${book.title} by ${book.author}. ${book.synopsis}`,
          canonicalUrl: `https://libiris-digital.vercel.app/books/${book.id}`,
          ogType: 'book',
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: book.title,
            author: {
              '@type': 'Person',
              name: book.author,
            },
            description: book.synopsis,
            isbn: book.isbn,
            numberOfPages: book.pageCount,
            inLanguage: book.language,
            isAccessibleForFree: book.isPublicDomain || book.price === 0,
            url: `https://libiris-digital.vercel.app/books/${book.id}`,
          },
        });
      }
    }
  }, [activeModal, books]);

  // Global keyboard shortcut: Ctrl+K or Cmd+K to open Search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [openSearch]);

  const handleTabChange = (tab: 'home' | 'library' | 'my-library' | 'pricing' | 'admin') => {
    setCurrentTab(tab);
    if (tab === 'home') {
      window.history.pushState(null, '', '/');
      updateSEO();
    } else if (tab === 'library') {
      window.history.pushState(null, '', '/catalogue');
      updateSEO({
        title: 'Book Catalogue - Libiris Online Digital Library',
        description: 'Browse and search digital public books, academic texts, and classic literature on Libiris online digital library.',
        canonicalUrl: 'https://libiris-digital.vercel.app/catalogue',
      });
    } else if (tab === 'pricing') {
      window.history.pushState(null, '', '/pricing');
      updateSEO({
        title: 'Pricing & Micro-Access - Libiris Online Digital Library',
        description: 'Read public classics for free, and unlock curated reference editions starting from ₹5 on Libiris digital library.',
        canonicalUrl: 'https://libiris-digital.vercel.app/pricing',
      });
    } else if (tab === 'my-library') {
      window.history.pushState(null, '', '/my-library');
    } else if (tab === 'admin') {
      window.history.pushState(null, '', '/admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromHome = (catId: CategoryId) => {
    setActiveCategoryFilter(catId);
    setCurrentTab('library');
    window.history.pushState(null, '', `/category/${catId}`);
    const catInfo = CATEGORIES.find((c) => c.id === catId);
    if (catInfo) {
      updateSEO({
        title: `${catInfo.name} Books - Libiris Online Digital Library`,
        description: `Explore curated ${catInfo.name} books and classics on Libiris online digital library. ${catInfo.description}.`,
        canonicalUrl: `https://libiris-digital.vercel.app/category/${catId}`,
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartFeaturedReading = () => {
    const defaultBook = books.find((b) => b.id === 'frankenstein') || books[0];
    if (defaultBook) {
      openReader(defaultBook);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Navbar */}
      <Navbar currentTab={currentTab} setCurrentTab={handleTabChange} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <Hero 
              onExplore={() => handleTabChange('library')}
              onReadFeatured={handleStartFeaturedReading}
            />
            <CategoryGrid onSelectCategory={handleSelectCategoryFromHome} />
            <TrendingSection onViewAll={() => handleTabChange('library')} />
            <WhyDigital />
            <HowItWorks onStartReading={handleStartFeaturedReading} />
            <ComparisonSection onOpenLibrary={() => handleTabChange('library')} />
          </>
        )}

        {currentTab === 'library' && (
          <LibraryCatalogue />
        )}

        {currentTab === 'my-library' && (
          <MyLibrary onExploreCatalog={() => handleTabChange('library')} />
        )}

        {currentTab === 'pricing' && (
          <PricingSection onExploreCatalog={() => handleTabChange('library')} />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Global Footer */}
      <Footer 
        onSelectCategory={handleSelectCategoryFromHome}
        onNavigateTab={handleTabChange}
      />

      {/* Modals & Overlays */}
      <BookDetailsModal />
      <CheckoutModal />
      <GlobalSearchModal />
      <AuthModal />

      {/* Standout Distraction-Free Digital Reader */}
      {activeReaderBook && <DigitalReader />}

      {/* Toast Feedback */}
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <MainAppContent />
    </LibraryProvider>
  );
}
