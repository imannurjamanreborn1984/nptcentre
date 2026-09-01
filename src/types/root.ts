export type RootElement =
  | 'Api'
  | 'Air'
  | 'Tanah'
  | 'Udara'
  | 'Eter'
  | 'Cahaya'
  | 'Kesadaran'
  | 'Kosmik'
  | (string & {});

export interface SainsEpigenetikaEntry {
  id: string;
  title: string;
  field:
    | 'Epigenetika'
    | 'Neurobiologi'
    | 'Psikologi Somatik'
    | 'Fisika Kuantum'
    | 'Sains Kognitif'
    | (string & {});
  summary: string;
  mechanism?: string;
  sourceCitation?: string;
  tags?: string[];
}

export interface KitabKearifanEntry {
  id: string;
  title: string;
  source: string; // Misal: Ihya Ulumuddin, Upanishad, Tao Te Ching, Serat Centhini, Al-Quran/Hadits
  quote?: string;
  commentary: string;
  tradition:
    | 'Tasawuf / Islam'
    | 'Nusantara / Kejawen'
    | 'Veda / Timur'
    | 'Hermetisisme'
    | 'Filsafat Universal'
    | (string & {});
}

export interface PopCultureFolkloreEntry {
  id: string;
  title: string;
  type: 'film' | 'folklore' | 'novel' | 'figur' | 'anime' | 'simbol';
  characterOrSymbol: string;
  referenceTitle: string;
  analysis: string;
  quoteOrScene?: string;
}

export interface PanduanLatihanRoot {
  dynamicMeditation: {
    title: string;
    objective: string;
    steps: string[];
    somaticFocus: string;
  };
  khalwat: {
    title: string;
    promptContemplation: string;
    solitudePractice: string;
    durationRecommended: string;
  };
  afirmasiHarian: string[];
}

export interface SpiritualRoot {
  id: string;
  number: number;
  slug: string;
  name: string;
  alias: string;
  element: RootElement;
  archetype: string;
  colorTheme: {
    primary: string;
    secondary: string;
    badgeBg: string;
    badgeBorder: string;
    textAccent: string;
    gradient: string;
  };
  summary: string;
  coreKeywords: string[];
  
  lightAspect: {
    title: string;
    description: string;
    traits: string[];
  };
  
  shadowAspect: {
    title: string;
    description: string;
    pitfalls: string[];
  };

  // 3 Multi-Perspektif Dinamis
  sainsEpigenetika: SainsEpigenetikaEntry[];
  kitabKearifan: KitabKearifanEntry[];
  popCultureFolklore: PopCultureFolkloreEntry[];

  panduanLatihan: PanduanLatihanRoot;
  completenessScore: number; // 0 - 100
  updatedAt: string;
}

export type PerspectiveTab = 'overview' | 'sains' | 'kitab' | 'popculture' | 'latihan';
