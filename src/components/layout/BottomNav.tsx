import React from 'react';
import { BookOpen, Compass, PlusCircle, Sparkles } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'roots' | 'journal' | 'add' | 'assessment';
  onNavigate: (tab: 'roots' | 'journal' | 'add' | 'assessment') => void;
  journalCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onNavigate,
  journalCount = 0,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 safe-area-pb">
      <div className="grid grid-cols-4 items-center justify-around">
        <button
          onClick={() => onNavigate('roots')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'roots'
              ? 'text-rose-600 dark:text-rose-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'roots' ? 'scale-110' : ''} transition-transform`} />
          <span className="text-[10px] mt-1">14 Akar</span>
        </button>

        <button
          onClick={() => onNavigate('journal')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl relative transition-all ${
            activeTab === 'journal'
              ? 'text-rose-600 dark:text-rose-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'journal' ? 'scale-110' : ''} transition-transform`} />
          <span className="text-[10px] mt-1">Jurnal</span>
          {journalCount > 0 && (
            <span className="absolute top-0.5 right-4 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {journalCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onNavigate('add')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'add'
              ? 'text-rose-600 dark:text-rose-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <PlusCircle className={`w-5 h-5 ${activeTab === 'add' ? 'scale-110 text-rose-500' : ''} transition-transform`} />
          <span className="text-[10px] mt-1">Bahan Baru</span>
        </button>

        <button
          onClick={() => onNavigate('assessment')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'assessment'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${activeTab === 'assessment' ? 'scale-110' : ''} transition-transform`} />
          <span className="text-[10px] mt-1">Pemetaan</span>
        </button>
      </div>
    </div>
  );
};
