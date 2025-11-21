export interface VocabItem {
  japanese: string;
  japaneseAlt?: string; // Đáp án thay thế (optional)
  vietnamese: string;
}

export interface VocabUnit {
  name: string;
  fileName: string;
  items: VocabItem[];
}

export type QuizMode = 'jp-to-vn' | 'vn-to-jp';

export type Language = 'japanese' | 'chinese' | 'english';

export interface Workspace {
  id: string;
  language: Language;
  name: string;
  createdAt: string;
}
