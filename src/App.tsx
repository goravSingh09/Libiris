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

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'library' | 'my-library' | 'pricing' | 'admin'>('home');
  const { 
    books, 
    openReader, 
    openSearch, 
    setActiveCategoryFilter, 
    activeReaderBook 
  } = useLibrary();

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

  const handleSelectCategoryFromHome = (catId: CategoryId) => {
    setActiveCategoryFilter(catId);
    setCurrentTab('library');
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
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <Hero 
              onExplore={() => {
                setCurrentTab('library');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onReadFeatured={handleStartFeaturedReading}
            />
            <CategoryGrid onSelectCategory={handleSelectCategoryFromHome} />
            <TrendingSection onViewAll={() => {
              setCurrentTab('library');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
            <WhyDigital />
            <HowItWorks onStartReading={handleStartFeaturedReading} />
            <ComparisonSection onOpenLibrary={() => {
              setCurrentTab('library');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          </>
        )}

        {currentTab === 'library' && (
          <LibraryCatalogue />
        )}

        {currentTab === 'my-library' && (
          <MyLibrary onExploreCatalog={() => {
            setCurrentTab('library');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        )}

        {currentTab === 'pricing' && (
          <PricingSection onExploreCatalog={() => {
            setCurrentTab('library');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Global Footer */}
      <Footer 
        onSelectCategory={handleSelectCategoryFromHome}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
