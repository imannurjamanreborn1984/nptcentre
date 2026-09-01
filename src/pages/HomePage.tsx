import React, { useState, useMemo } from 'react';
import type { SpiritualRoot } from '../types/root';
import { RootCard } from '../components/root/RootCard';
import { Search, Bookmark, Sparkles, Layers } from 'lucide-react';

interface HomePageProps {
  roots: SpiritualRoot[];
  onSelectRoot: (root: SpiritualRoot) => void;
  bookmarks: string[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onOpenQuickAdd: () => void;
  onNavigateToJournal: () => void;
}

const ELEMENTS: Array<{ id: string; label: string; icon?: string }> = [
  { id: 'ALL', label: 'Semua Elemen' },
  { id: 'Api', label: '🔥 Api' },
  { id: 'Air', label: '💧 Air' },
  { id: 'Tanah', label: '🌱 Tanah' },
  { id: 'Udara', label: '💨 Udara' },
  { id: 'Cahaya', label: '✨ Cahaya' },
  { id: 'Eter', label: '🌌 Eter' },
  { id: 'Kesadaran', label: '👁️ Kesadaran' },
  { id: 'Kosmik', label: '🪐 Kosmik' },
];

export const HomePage: React.FC<HomePageProps> = ({
  roots,
  onSelectRoot,
  bookmarks,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState('ALL');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Filter logic
  const filteredRoots = useMemo(() => {
    return roots.filter((root) => {
      // Bookmarks filter
      if (showBookmarksOnly && !bookmarks.includes(root.id)) {
        return false;
      }

      // Element filter
      if (selectedElement !== 'ALL' && root.element !== selectedElement) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = root.name.toLowerCase().includes(query);
        const matchAlias = root.alias.toLowerCase().includes(query);
        const matchSummary = root.summary.toLowerCase().includes(query);
        const matchArchetype = root.archetype.toLowerCase().includes(query);
        const matchKeywords = root.coreKeywords.some((k) => k.toLowerCase().includes(query));
        const matchSains = root.sainsEpigenetika?.some((s) => s.title.toLowerCase().includes(query) || s.summary.toLowerCase().includes(query));
        const matchKitab = root.kitabKearifan?.some((k) => k.title.toLowerCase().includes(query) || k.source.toLowerCase().includes(query));
        const matchPop = root.popCultureFolklore?.some((p) => p.title.toLowerCase().includes(query) || p.referenceTitle.toLowerCase().includes(query));

        return matchName || matchAlias || matchSummary || matchArchetype || matchKeywords || matchSains || matchKitab || matchPop;
      }

      return true;
    });
  }, [roots, searchQuery, selectedElement, showBookmarksOnly, bookmarks]);

  const totalSains = roots.reduce((acc, r) => acc + (r.sainsEpigenetika?.length || 0), 0);
  const totalKitab = roots.reduce((acc, r) => acc + (r.kitabKearifan?.length || 0), 0);
  const totalPop = roots.reduce((acc, r) => acc + (r.popCultureFolklore?.length || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner Saku */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-900 dark:via-purple-950 dark:to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-rose-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pusat Riset & Praktik Spiritual NPT</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Peta 14 Akar Spiritual & Integrasi Multi-Perspektif
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            Wadah dinamis untuk memetakan arketipe batin, menghubungkan temuan sains modern, teks hikmah klasik, dan analogi budaya secara modular.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 pt-2 text-center max-w-lg">
            <div className="p-2.5 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <span className="block text-base sm:text-lg font-extrabold text-white">14</span>
              <span className="text-[10px] text-slate-400 font-medium">Akar Utama</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <span className="block text-base sm:text-lg font-extrabold text-blue-400">{totalSains}</span>
              <span className="text-[10px] text-slate-400 font-medium">Riset Sains</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <span className="block text-base sm:text-lg font-extrabold text-amber-400">{totalKitab}</span>
              <span className="text-[10px] text-slate-400 font-medium">Kitab Hikmah</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10">
              <span className="block text-base sm:text-lg font-extrabold text-purple-400">{totalPop}</span>
              <span className="text-[10px] text-slate-400 font-medium">Pop Culture</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama akar, keyword (vitalitas, fokus), sains (mitokondria), atau film (matrix)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm shadow-xs focus:ring-2 focus:ring-rose-500 focus:outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Bookmarks Toggle */}
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              showBookmarksOnly
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/30'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-current' : ''}`} />
            <span>Tersimpan ({bookmarks.length})</span>
          </button>
        </div>

        {/* Element Filter Pills */}
        <div className="flex overflow-x-auto gap-1.5 pb-1 scrollbar-none">
          {ELEMENTS.map((el) => (
            <button
              key={el.id}
              onClick={() => setSelectedElement(el.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedElement === el.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {el.label}
            </button>
          ))}
        </div>
      </div>

      {/* Roots Grid */}
      {filteredRoots.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center space-y-3">
          <Layers className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Tidak ditemukan akar yang sesuai
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau reset filter elemen untuk melihat seluruh 14 akar spiritual.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedElement('ALL');
              setShowBookmarksOnly(false);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white shadow-xs cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoots.map((root) => (
            <RootCard
              key={root.id}
              root={root}
              isBookmarked={bookmarks.includes(root.id)}
              onToggleBookmark={onToggleBookmark}
              onSelectRoot={onSelectRoot}
            />
          ))}
        </div>
      )}
    </div>
  );
};
