import React from 'react';
import { Menu, BookOpen, Moon, Sun, Bell, PlusCircle } from 'lucide-react';
import type { ColorTheme } from '../../services/dataService';

interface HeaderProps {
  onToggleSidebar: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenQuickAdd: () => void;
  onOpenApprovalCenter: () => void;
  pendingApprovalsCount: number;
  activeAccount: { id: string; name: string; role: 'Super Admin' | 'Reviewer VIP' | 'Anggota' };
  colorTheme: ColorTheme;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  darkMode,
  onToggleTheme,
  onOpenQuickAdd,
  onOpenApprovalCenter,
  pendingApprovalsCount,
  activeAccount,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left: Hamburger & Clean Brand */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          <button
            onClick={onToggleSidebar}
            title="Buka Menu & Navigasi"
            className="p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all border border-slate-200/60 dark:border-slate-800 cursor-pointer"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={onToggleSidebar}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-rose-700 flex items-center justify-center text-white shadow-sm shadow-rose-600/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base tracking-tight leading-none">
                  Hakikat Cinta
                </span>
                <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-md border border-rose-500/20">
                  🔴⚪ NPT
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-1 hidden xs:block">
                Buku Saku 14 Akar Spiritual
              </p>
            </div>
          </div>
        </div>

        {/* Right: Notification, Quick Add, & VIP Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Input Button */}
          <button
            onClick={onOpenQuickAdd}
            title="Tambah Bahan Materi / Riset Baru"
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-xs shadow-rose-600/30 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tambah Bahan</span>
          </button>

          {/* Pending Approval / Notification Bell */}
          <button
            onClick={onOpenApprovalCenter}
            title="Ruang Approval & Notifikasi"
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {pendingApprovalsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Account Profile Badge */}
          <button
            onClick={onToggleSidebar}
            title={`Akun: ${activeAccount.name}`}
            className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
              {activeAccount.name.charAt(0)}
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 hidden md:inline">
              {activeAccount.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

