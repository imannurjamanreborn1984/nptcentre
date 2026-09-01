import type { JournalEntry } from '../types/journal';

export const DEFAULT_JOURNALS: JournalEntry[] = [
  {
    id: 'journal-1',
    date: new Date().toISOString().split('T')[0],
    practiceType: 'dynamic_meditation',
    targetRootId: 'root-1',
    targetRootName: 'Akar Hayah (Vitalitas Murni)',
    durationMinutes: 15,
    energyLevelBefore: 2,
    energyLevelAfter: 5,
    somaticSensations: ['Dada terasa hangat', 'Nafas terasa lebih lapang', 'Kaki berakar kuat ke tanah'],
    notes: 'Melakukan latihan dynamic breathwork 3 siklus. Di awal kepala terasa agak pening dan letih, namun setelah siklus kedua energi mengalir deras ke seluruh sel tubuh.',
    breakthroughInsights: 'Kelelahan selama ini bukan karena kekurangan tidur, melainkan karena pola nafas yang pendek dan menahan beban yang belum terjadi.',
    createdAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'journal-2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    practiceType: 'khalwat',
    targetRootId: 'root-9',
    targetRootName: 'Akar Salam (Kedamaian Titik Hening)',
    durationMinutes: 25,
    energyLevelBefore: 3,
    energyLevelAfter: 4,
    somaticSensations: ['Detak jantung melambat', 'Bahu turun rileks', 'Pikiran hening'],
    notes: 'Duduk hening di sudut kamar tanpa gawai. Mengamati kekhawatiran yang bermunculan lalu menyerahkannya satu per satu ke titik nol.',
    breakthroughInsights: 'Kedamaian bukan berarti tidak ada masalah di luar, tapi ketiadaan perlawanan terhadap realitas saat ini.',
    createdAt: Date.now() - 86400000,
  }
];
