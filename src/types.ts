export interface VocabItem {
  foreign: string; // Từ nước ngoài (Japanese/Chinese/English)
  foreignAlt?: string; // Đáp án thay thế (optional)
  vietnamese: string;
}

export interface VocabUnit {
  name: string;
  fileName: string;
  language: Language;
  items: VocabItem[];
}

export type QuizMode = 'foreign-to-vn' | 'vn-to-foreign';

export type Language = 'japanese' | 'chinese' | 'english';

export interface Workspace {
  id: string;
  language: Language;
  name: string;
  createdAt: string;
}
