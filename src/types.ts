export type Language = 'japanese' | 'chinese' | 'english';

export interface VocabItem {
  japanese?: string;
  japaneseAlt?: string;
  chinese?: string;
  english?: string;
  vietnamese: string;
}

export interface VocabUnit {
  name: string;
  fileName: string;
  language: Language;
  items: VocabItem[];
}

export interface Workspace {
  id: string;
  language: Language;
  name: string;
  createdAt: string;
}

export type QuizMode = 'foreign-to-vn' | 'vn-to-foreign';
