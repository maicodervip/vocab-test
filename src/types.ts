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
