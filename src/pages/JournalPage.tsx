import React, { useState } from 'react';
import type { SpiritualRoot } from '../types/root';
import type { JournalEntry, PracticeType } from '../types/journal';
import { JournalForm } from '../components/journal/JournalForm';
import { JournalList } from '../components/journal/JournalList';
import { MeditationTimer } from '../components/journal/MeditationTimer';
import { Compass, PenTool, Timer, History, Plus } from 'lucide-react';

interface JournalPageProps {
  roots: SpiritualRoot[];
  journals: JournalEntry[];
  onSaveJournal: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  onDeleteJournal: (id: string) => void;
  initialSelectedRoot?: SpiritualRoot;
  initialPracticeType?: PracticeType;
}

export const JournalPage: React.FC<JournalPageProps> = ({
  roots,
  journals,
  onSaveJournal,
  onDeleteJournal,
  initialSelectedRoot,
  initialPracticeType = 'dynamic_meditation',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'timer' | 'list'>(
    initialSelectedRoot ? 'form' : 'list'
  );
  const [completedDuration, setCompletedDuration] = useState<number>(15);

  const handleTimerComplete = (mins: number) => {
    setCompletedDuration(mins);
    setActiveSubTab('form');
  };

  const handleSave = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    onSaveJournal(entry);
    setActiveSubTab('list');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Jurnal Latihan Spiritual & Khalwat
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Catatan harian untuk melatih 14 akar spiritual melalui gerak dinamis somatik dan keheningan.
          </p>
        </div>

        {/* SubTab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'list'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat ({journals.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('form')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'form'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Tulis Jurnal</span>
          </button>

          <button
            onClick={() => setActiveSubTab('timer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'timer'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Timer Hening</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: TIMER */}
      {activeSubTab === 'timer' && (
        <div className="max-w-xl mx-auto space-y-4 animate-in fade-in duration-200">
          <MeditationTimer
            defaultDurationMinutes={completedDuration}
            onCompleteSession={handleTimerComplete}
          />
          <p className="text-center text-xs text-slate-400">
            Setelah timer selesai atau saat kamu selesai hening, kamu bisa langsung mencatat hasilnya ke formulir jurnal.
          </p>
        </div>
      )}

      {/* SUBTAB 2: FORM */}
      {activeSubTab === 'form' && (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-200">
          <JournalForm
            roots={roots}
            selectedRoot={initialSelectedRoot}
            initialPracticeType={initialPracticeType}
            initialDuration={completedDuration}
            onSave={handleSave}
            onCancel={() => setActiveSubTab('list')}
          />
        </div>
      )}

      {/* SUBTAB 3: LIST */}
      {activeSubTab === 'list' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total {journals.length} Sesi Terdata
            </span>
            <button
              onClick={() => setActiveSubTab('form')}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Sesi Baru</span>
            </button>
          </div>

          <JournalList journals={journals} onDeleteJournal={onDeleteJournal} />
        </div>
      )}
    </div>
  );
};
