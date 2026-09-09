import React from 'react';
import {
  BookOpen,
  Compass,
  Sparkles,
  ShieldCheck,
  Palette,
  Download,
  X,
  Check,
  ChevronRight,
  Sun,
  Moon,
  Users
} from 'lucide-react';
import type { ColorTheme } from '../../services/dataService';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onNavigate: (tab: 'roots' | 'journal' | 'add' | 'assessment') => void;
  colorTheme: ColorTheme;
  onSelectTheme: (theme: ColorTheme) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenApprovalCenter: () => void;
  onOpenDataModal: () => void;
  onOpenQuickAdd: () => void;
  pendingApprovalsCount: number;
  activeAccount: { id: string; name: string; role: 'Super Admin' | 'Reviewer VIP' | 'Anggota' };
  onSwitchAccount: (acc: { id: string; name: string; role: 'Super Admin' | 'Reviewer VIP' | 'Anggota' }) => void;
}

const THEME_OPTIONS: Array<{
  id: ColorTheme;
  name: string;
  badge: string;
  bgGrad: string;
  desc: string;
}> = [
  {
    id: 'merah-putih',
    name: 'Merah Putih NPT',
    badge: '🔴⚪ Utama',
    bgGrad: 'from-rose-600 to-red-500',
    desc: 'Identitas Suci Hakikat Cinta & NPT',
  },
  {
    id: 'emas-hikmah',
    name: 'Emas Sufistik',
    badge: '🟡✨ Hikmah',
    bgGrad: 'from-amber-500 to-yellow-600',
    desc: 'Nuansa Maqamat & Kearifan Klasik',
  },
  {
    id: 'emerald-hikam',
    name: 'Emerald Al-Hikam',
    badge: '🟢🌱 Hening',
    bgGrad: 'from-emerald-600 to-teal-500',
    desc: 'Ketenteraman Batin & Kedamaian',
  },
  {
    id: 'indigo-kosmik',
    name: 'Indigo Sains',
    badge: '🔵🌌 Kosmik',
    bgGrad: 'from-indigo-600 to-blue-500',
    desc: 'Riset Epigenetika & Integrasi Modern',
  },
];

const AVAILABLE_ACCOUNTS = [
  { id: 'acc-admin-1', name: 'Admin Utama NPT', role: 'Super Admin' as const },
  { id: 'acc-vip-2', name: 'Khadim Kajian (VIP)', role: 'Reviewer VIP' as const },
  { id: 'acc-member-3', name: 'Santri Peneliti', role: 'Anggota' as const },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onNavigate,
  colorTheme,
  onSelectTheme,
  darkMode,
  onToggleTheme,
  onOpenApprovalCenter,
  onOpenDataModal,
  pendingApprovalsCount,
  activeAccount,
  onSwitchAccount,
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        />
      )}

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Drawer Header with Brand */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-500 to-rose-700 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-slate-100 text-base leading-tight tracking-tight">
                Hakikat Cinta
              </h2>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                Buku Saku 14 Akar Spiritual
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
          {/* Active Account / Profile Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center text-xs border border-rose-500/20">
                  {activeAccount.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {activeAccount.name}
                    </span>
                  </div>
                  <span className="inline-block text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                    {activeAccount.role === 'Super Admin' ? '👑 ' : '⭐ '}
                    {activeAccount.role}
                  </span>
                </div>
              </div>

              <div className="relative group">
                <button
                  title="Ganti Akun/Role Uji Coba"
                  className="text-[10px] px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                >
                  <Users className="w-3 h-3" />
                  <span>Ganti</span>
                </button>

                {/* Dropdown switch account */}
                <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 w-44 z-20">
                  <div className="text-[9px] font-bold text-slate-400 px-2 py-1 uppercase">Pilih Akun:</div>
                  {AVAILABLE_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => onSwitchAccount(acc)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                        activeAccount.id === acc.id
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{acc.name}</span>
                      {activeAccount.id === acc.id && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 px-3 py-1">
              Modul Utama
            </div>

            <button
              onClick={() => {
                onNavigate('roots');
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'roots'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                <span>14 Akar Spiritual</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => {
                onNavigate('journal');
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'journal'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4" />
                <span>Jurnal & Praktik Meditasi</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => {
                onNavigate('assessment');
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'assessment'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4" />
                <span>Pemetaan Diri (Roadmap)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>

          {/* Admin & Ruang Approval Area */}
          {activeAccount.role === 'Super Admin' && (
            <div className="space-y-1">
              <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 px-3 py-1">
                Admin & Kurasi Konten
              </div>

              <button
                onClick={() => {
                  onOpenApprovalCenter();
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Ruang Approval NPT</span>
                </div>
                {pendingApprovalsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse">
                    {pendingApprovalsCount} Baru
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  onOpenDataModal();
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Backup & Sinkronisasi JSON</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          )}

          {/* Color Themes Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Palette className="w-3 h-3" />
                <span>Tema Warna</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Bisa Pilih Sendiri</span>
            </div>

            <div className="grid grid-cols-2 gap-2 px-1">
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelectTheme(t.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    colorTheme === t.id
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-tr ${t.bgGrad}`} />
                    {colorTheme === t.id && (
                      <Check className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {t.name}
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {t.badge}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer / Dark Mode Toggle */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
              <span>{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
            </button>
          </div>

          <span className="text-[10px] text-slate-400 font-mono">
            NPT v1.1
          </span>
        </div>
      </aside>
    </>
  );
};
