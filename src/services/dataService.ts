import type { SpiritualRoot, SainsEpigenetikaEntry, KitabKearifanEntry, PopCultureFolkloreEntry } from '../types/root';
import type { JournalEntry } from '../types/journal';
import { INITIAL_ROOTS_DATA } from '../data/rootsData';
import { DEFAULT_JOURNALS } from '../data/defaultJournals';

export type ColorTheme = 'merah-putih' | 'emas-hikmah' | 'emerald-hikam' | 'indigo-kosmik';

export interface ApprovalItem {
  id: string;
  rootId?: string;
  category: 'sains' | 'kitab' | 'popculture' | 'draf_ai' | 'transkripsi';
  title: string;
  summary: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  dataPayload?: any;
}

const STORAGE_KEYS = {
  CUSTOM_ROOTS: 'buku_saku_custom_roots_v1',
  BOOKMARKS: 'buku_saku_bookmarks_v1',
  JOURNALS: 'buku_saku_journals_v1',
  USER_NOTES: 'buku_saku_user_notes_v1',
  THEME_COLOR: 'buku_saku_color_theme_v1',
  APPROVALS: 'buku_saku_approvals_v1',
  ACTIVE_ACCOUNT: 'buku_saku_active_account_v1',
};

const DEFAULT_APPROVAL_ITEMS: ApprovalItem[] = [
  {
    id: 'appr-01',
    rootId: 'root-01',
    category: 'sains',
    title: 'Epigenetika & Resiliensi Kortisol saat Dzikir Khusyuk',
    summary: 'Riset klinis penurunan hormon stres kortisol dan aktivasi telomerase pasca meditasi hening Al-Hikam.',
    submittedBy: 'dr. Farhan (Divisi Sains NPT)',
    submittedAt: '2026-08-30T10:15:00Z',
    status: 'pending',
  },
  {
    id: 'appr-02',
    rootId: 'root-03',
    category: 'kitab',
    title: 'Syarah Al-Hikam Hikmah 33: Penyerahan Total Kekuatan Semata',
    summary: 'Penjelasan matan: "Tidak akan terhenti suatu permintaan yang semata engkau sandarkan kepada karunia Tuhanmu".',
    submittedBy: 'Ustadz Ahmad (Tim Hikmah)',
    submittedAt: '2026-08-31T20:30:00Z',
    status: 'pending',
  },
  {
    id: 'appr-03',
    rootId: 'root-02',
    category: 'draf_ai',
    title: 'Draf Bab 3: Menghancurkan Pondasi Ilusi Keakuan',
    summary: 'Hasil rangkuman live kajian 31 Agustus 2026 oleh AI Studio Hakikat Cinta untuk dimasukkan ke Buku Saku Digital.',
    submittedBy: 'AI Studio Assistant',
    submittedAt: '2026-09-01T01:00:00Z',
    status: 'pending',
  },
];

export const DataService = {
  // --- COLOR THEME MANAGEMENT ---
  getColorTheme(): ColorTheme {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME_COLOR);
      if (stored && ['merah-putih', 'emas-hikmah', 'emerald-hikam', 'indigo-kosmik'].includes(stored)) {
        return stored as ColorTheme;
      }
      return 'merah-putih'; // Default signature NPT & Hakikat Cinta
    } catch {
      return 'merah-putih';
    }
  },

  setColorTheme(theme: ColorTheme): void {
    localStorage.setItem(STORAGE_KEYS.THEME_COLOR, theme);
  },

  // --- ACCOUNT CONTEXT ---
  getActiveAccount(): { id: string; name: string; role: 'Super Admin' | 'Reviewer VIP' | 'Anggota' } {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_ACCOUNT);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return { id: 'acc-admin-1', name: 'Admin Utama NPT', role: 'Super Admin' };
  },

  setActiveAccount(account: { id: string; name: string; role: 'Super Admin' | 'Reviewer VIP' | 'Anggota' }): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ACCOUNT, JSON.stringify(account));
  },

  // --- APPROVAL SYSTEM (ISOLATED PER-ITEM & PER-ACCOUNT) ---
  getApprovalItems(): ApprovalItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPROVALS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(DEFAULT_APPROVAL_ITEMS));
        return DEFAULT_APPROVAL_ITEMS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading approvals:', e);
      return DEFAULT_APPROVAL_ITEMS;
    }
  },

  /**
   * Strictly isolates approval per item ID and per admin account
   */
  updateApprovalStatus(
    itemId: string,
    status: 'approved' | 'rejected',
    accountName: string,
    rejectionReason?: string
  ): boolean {
    try {
      const items = this.getApprovalItems();
      const targetIndex = items.findIndex((item) => item.id === itemId);
      if (targetIndex === -1) return false;

      // Only update the targeted item, preserve other items immutably
      const updated = items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            status,
            approvedBy: accountName,
            approvedAt: new Date().toISOString(),
            rejectionReason: status === 'rejected' ? rejectionReason : undefined,
          };
        }
        return item;
      });

      localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error('Error updating approval status:', e);
      return false;
    }
  },

  addApprovalItem(item: Omit<ApprovalItem, 'id' | 'submittedAt' | 'status'>): ApprovalItem {
    const items = this.getApprovalItems();
    const newItem: ApprovalItem = {
      ...item,
      id: `appr-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    const updated = [newItem, ...items];
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(updated));
    return newItem;
  },

  // --- ROOTS MANAGEMENT ---
  getRoots(): SpiritualRoot[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_ROOTS);
      if (!stored) {
        return INITIAL_ROOTS_DATA;
      }
      const customOverrides: Record<string, Partial<SpiritualRoot>> = JSON.parse(stored);
      
      // Merge initial with custom overrides
      return INITIAL_ROOTS_DATA.map((root) => {
        if (customOverrides[root.id]) {
          return {
            ...root,
            ...customOverrides[root.id],
            sainsEpigenetika: [
              ...root.sainsEpigenetika,
              ...(customOverrides[root.id].sainsEpigenetika || []).filter(
                (c) => !root.sainsEpigenetika.some((o) => o.id === c.id)
              ),
            ],
            kitabKearifan: [
              ...root.kitabKearifan,
              ...(customOverrides[root.id].kitabKearifan || []).filter(
                (c) => !root.kitabKearifan.some((o) => o.id === c.id)
              ),
            ],
            popCultureFolklore: [
              ...root.popCultureFolklore,
              ...(customOverrides[root.id].popCultureFolklore || []).filter(
                (c) => !root.popCultureFolklore.some((o) => o.id === c.id)
              ),
            ],
          };
        }
        return root;
      });
    } catch (e) {
      console.error('Error fetching roots from storage:', e);
      return INITIAL_ROOTS_DATA;
    }
  },

  getRootById(id: string): SpiritualRoot | undefined {
    const all = this.getRoots();
    return all.find((r) => r.id === id || r.slug === id);
  },

  addPerspectiveToRoot(
    rootId: string,
    category: 'sains' | 'kitab' | 'popculture',
    entry: SainsEpigenetikaEntry | KitabKearifanEntry | PopCultureFolkloreEntry
  ): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_ROOTS);
      const customOverrides: Record<string, any> = stored ? JSON.parse(stored) : {};
      
      if (!customOverrides[rootId]) {
        customOverrides[rootId] = {
          sainsEpigenetika: [],
          kitabKearifan: [],
          popCultureFolklore: [],
        };
      }

      if (category === 'sains') {
        customOverrides[rootId].sainsEpigenetika = [
          ...(customOverrides[rootId].sainsEpigenetika || []),
          entry,
        ];
      } else if (category === 'kitab') {
        customOverrides[rootId].kitabKearifan = [
          ...(customOverrides[rootId].kitabKearifan || []),
          entry,
        ];
      } else if (category === 'popculture') {
        customOverrides[rootId].popCultureFolklore = [
          ...(customOverrides[rootId].popCultureFolklore || []),
          entry,
        ];
      }

      localStorage.setItem(STORAGE_KEYS.CUSTOM_ROOTS, JSON.stringify(customOverrides));
      return true;
    } catch (e) {
      console.error('Error adding perspective to root:', e);
      return false;
    }
  },

  resetRootsToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_ROOTS);
  },

  // --- BOOKMARKS ---
  getBookmarks(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(rootId: string): boolean {
    const bookmarks = this.getBookmarks();
    let updated: string[];
    let isBookmarkedNow = false;

    if (bookmarks.includes(rootId)) {
      updated = bookmarks.filter((id) => id !== rootId);
      isBookmarkedNow = false;
    } else {
      updated = [...bookmarks, rootId];
      isBookmarkedNow = true;
    }

    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return isBookmarkedNow;
  },

  isBookmarked(rootId: string): boolean {
    return this.getBookmarks().includes(rootId);
  },

  // --- JOURNALS ---
  getJournals(): JournalEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.JOURNALS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(DEFAULT_JOURNALS));
        return DEFAULT_JOURNALS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading journals:', e);
      return DEFAULT_JOURNALS;
    }
  },

  saveJournal(entry: Omit<JournalEntry, 'id' | 'createdAt'> & { id?: string }): JournalEntry {
    const journals = this.getJournals();
    const newId = entry.id || `journal-${Date.now()}`;
    const newEntry: JournalEntry = {
      ...entry,
      id: newId,
      createdAt: Date.now(),
    };

    const existingIndex = journals.findIndex((j) => j.id === newId);
    let updated: JournalEntry[];

    if (existingIndex >= 0) {
      updated = journals.map((j) => (j.id === newId ? newEntry : j));
    } else {
      updated = [newEntry, ...journals];
    }

    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(updated));
    return newEntry;
  },

  deleteJournal(id: string): void {
    const journals = this.getJournals();
    const updated = journals.filter((j) => j.id !== id);
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(updated));
  },

  exportAllDataJSON(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      theme: this.getColorTheme(),
      activeAccount: this.getActiveAccount(),
      approvals: this.getApprovalItems(),
      customRoots: localStorage.getItem(STORAGE_KEYS.CUSTOM_ROOTS)
        ? JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_ROOTS)!)
        : {},
      journals: this.getJournals(),
      bookmarks: this.getBookmarks(),
    };
    return JSON.stringify(data, null, 2);
  },

  importDataJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.theme) {
        this.setColorTheme(parsed.theme);
      }
      if (parsed.approvals && Array.isArray(parsed.approvals)) {
        localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(parsed.approvals));
      }
      if (parsed.customRoots) {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_ROOTS, JSON.stringify(parsed.customRoots));
      }
      if (parsed.journals && Array.isArray(parsed.journals)) {
        localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(parsed.journals));
      }
      if (parsed.bookmarks && Array.isArray(parsed.bookmarks)) {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(parsed.bookmarks));
      }
      return true;
    } catch (e) {
      console.error('Failed to import data JSON:', e);
      return false;
    }
  },
};
