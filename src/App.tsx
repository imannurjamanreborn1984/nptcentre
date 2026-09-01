import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { JournalPage } from './pages/JournalPage';
import { AssessmentPreview } from './pages/AssessmentPreview';
import { MultiPerspectiveView } from './components/root/MultiPerspectiveView';
import { QuickAddModal } from './components/admin/QuickAddModal';
import { DataManagementModal } from './components/admin/DataManagementModal';
import { ApprovalCenterModal } from './components/admin/ApprovalCenterModal';
import { DataService, type ColorTheme } from './services/dataService';
import type { SpiritualRoot } from './types/root';
import type { JournalEntry, PracticeType } from './types/journal';

export function App() {
  const [roots, setRoots] = useState<SpiritualRoot[]>([]);
  const [selectedRoot, setSelectedRoot] = useState<SpiritualRoot | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'roots' | 'journal' | 'add' | 'assessment'>('roots');

  // Sidebar & Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddRootId, setQuickAddRootId] = useState<string | undefined>(undefined);
  const [quickAddCategory, setQuickAddCategory] = useState<'sains' | 'kitab' | 'popculture'>('sains');
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isApprovalCenterOpen, setIsApprovalCenterOpen] = useState(false);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);

  // Account & Color Theme
  const [activeAccount, setActiveAccount] = useState(() => DataService.getActiveAccount());
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => DataService.getColorTheme());

  // Journal practice pre-fills
  const [practiceRoot, setPracticeRoot] = useState<SpiritualRoot | undefined>(undefined);
  const [practiceType, setPracticeType] = useState<PracticeType>('dynamic_meditation');

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('buku_saku_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('buku_saku_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('buku_saku_theme', 'light');
    }
  }, [darkMode]);

  // Load initial data
  const loadAllData = () => {
    const loadedRoots = DataService.getRoots();
    setRoots(loadedRoots);
    setBookmarks(DataService.getBookmarks());
    setJournals(DataService.getJournals());
    setPendingApprovalsCount(
      DataService.getApprovalItems().filter((i) => i.status === 'pending').length
    );

    // Update selected root if still open
    if (selectedRoot) {
      const refreshed = loadedRoots.find((r) => r.id === selectedRoot.id);
      if (refreshed) setSelectedRoot(refreshed);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSelectTheme = (newTheme: ColorTheme) => {
    setColorTheme(newTheme);
    DataService.setColorTheme(newTheme);
  };

  const handleSwitchAccount = (acc: { id: string; name: string; role: 'Super Admin' | 'Reviewer VIP' | 'Anggota' }) => {
    setActiveAccount(acc);
    DataService.setActiveAccount(acc);
  };

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    DataService.toggleBookmark(id);
    setBookmarks(DataService.getBookmarks());
  };

  const handleOpenQuickAdd = (rootId?: string, defaultCategory: 'sains' | 'kitab' | 'popculture' = 'sains') => {
    setQuickAddRootId(rootId || roots[0]?.id);
    setQuickAddCategory(defaultCategory);
    setIsQuickAddOpen(true);
  };

  const handleSaveQuickAdd = (rootId: string, category: any, entry: any) => {
    DataService.addPerspectiveToRoot(rootId, category, entry);
    loadAllData();
  };

  const handleSaveJournal = (entryData: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    DataService.saveJournal(entryData);
    setJournals(DataService.getJournals());
  };

  const handleDeleteJournal = (id: string) => {
    DataService.deleteJournal(id);
    setJournals(DataService.getJournals());
  };

  const handleStartPractice = (root: SpiritualRoot, type: 'dynamic_meditation' | 'khalwat') => {
    setPracticeRoot(root);
    setPracticeType(type);
    setSelectedRoot(null);
    setActiveTab('journal');
  };

  const handleNavigate = (tab: 'roots' | 'journal' | 'add' | 'assessment') => {
    if (tab === 'add') {
      handleOpenQuickAdd();
      return;
    }
    setSelectedRoot(null);
    setActiveTab(tab);
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 theme-${colorTheme}`}>
      {/* Top Header - Spacious & Clean */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenQuickAdd={() => handleOpenQuickAdd()}
        onOpenApprovalCenter={() => setIsApprovalCenterOpen(true)}
        pendingApprovalsCount={pendingApprovalsCount}
        activeAccount={activeAccount}
        colorTheme={colorTheme}
      />

      {/* Responsive Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={selectedRoot ? 'roots' : activeTab}
        onNavigate={handleNavigate}
        colorTheme={colorTheme}
        onSelectTheme={handleSelectTheme}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenApprovalCenter={() => setIsApprovalCenterOpen(true)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onOpenQuickAdd={() => handleOpenQuickAdd()}
        pendingApprovalsCount={pendingApprovalsCount}
        activeAccount={activeAccount}
        onSwitchAccount={handleSwitchAccount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-20 md:pb-8">
        {selectedRoot ? (
          <MultiPerspectiveView
            root={selectedRoot}
            onBack={() => setSelectedRoot(null)}
            onOpenQuickAdd={(rootId, cat) => handleOpenQuickAdd(rootId, cat)}
            onStartPractice={handleStartPractice}
            isBookmarked={bookmarks.includes(selectedRoot.id)}
            onToggleBookmark={handleToggleBookmark}
          />
        ) : activeTab === 'roots' ? (
          <HomePage
            roots={roots}
            onSelectRoot={(r) => setSelectedRoot(r)}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onOpenQuickAdd={() => handleOpenQuickAdd()}
            onNavigateToJournal={() => setActiveTab('journal')}
          />
        ) : activeTab === 'journal' ? (
          <JournalPage
            roots={roots}
            journals={journals}
            onSaveJournal={handleSaveJournal}
            onDeleteJournal={handleDeleteJournal}
            initialSelectedRoot={practiceRoot}
            initialPracticeType={practiceType}
          />
        ) : (
          <AssessmentPreview
            roots={roots}
            onNavigateToRoot={(r) => {
              setSelectedRoot(r);
            }}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={selectedRoot ? 'roots' : activeTab}
        onNavigate={handleNavigate}
        journalCount={journals.length}
      />

      {/* Quick Add Modal */}
      {isQuickAddOpen && (
        <QuickAddModal
          roots={roots}
          defaultRootId={quickAddRootId}
          defaultCategory={quickAddCategory}
          onClose={() => setIsQuickAddOpen(false)}
          onSave={handleSaveQuickAdd}
        />
      )}

      {/* Data Management & Sync Modal */}
      {isDataModalOpen && (
        <DataManagementModal
          onClose={() => setIsDataModalOpen(false)}
          onDataChanged={loadAllData}
        />
      )}

      {/* Isolated Approval Center Modal */}
      {isApprovalCenterOpen && (
        <ApprovalCenterModal
          onClose={() => setIsApprovalCenterOpen(false)}
          activeAccount={activeAccount}
          onApprovalsChanged={loadAllData}
        />
      )}
    </div>
  );
}

export default App;
