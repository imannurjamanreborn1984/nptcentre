export type PracticeType = 'dynamic_meditation' | 'khalwat' | 'refleksi_harian' | 'observasi_akar';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  practiceType: PracticeType;
  targetRootId?: string;
  targetRootName?: string;
  durationMinutes: number;
  energyLevelBefore: number; // 1 - 5
  energyLevelAfter: number; // 1 - 5
  somaticSensations: string[]; // e.g. "Dada hangat", "Pikiran tenang", "Punggung rileks"
  notes: string;
  breakthroughInsights?: string;
  createdAt: number;
}
