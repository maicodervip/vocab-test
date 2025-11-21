import * as XLSX from 'xlsx';
import { VocabUnit, VocabItem, Language } from './types';

export async function parseExcelFile(file: File, language: Language): Promise<VocabUnit | null> {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    
    const items: VocabItem[] = [];
    
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      
      if (language === 'english') {
        // English: Cột 1 - English, Cột 2 - Vietnamese
        if (row[0] && row[1]) {
          items.push({
            english: String(row[0]).trim(),
            vietnamese: String(row[1]).trim(),
          });
        }
      } else if (language === 'japanese') {
        // Japanese: Cột 1 - Japanese, Cột 2 - Japanese Alt (optional), Cột 3 - Vietnamese
        if (row[0] && row[2]) {
          const item: VocabItem = {
            japanese: String(row[0]).trim(),
            vietnamese: String(row[2]).trim(),
          };
          
          if (row[1] && String(row[1]).trim()) {
            item.japaneseAlt = String(row[1]).trim();
          }
          
          items.push(item);
        }
      } else if (language === 'chinese') {
        // Chinese: Cột 1 - Chinese, Cột 2 - Vietnamese
        if (row[0] && row[1]) {
          items.push({
            chinese: String(row[0]).trim(),
            vietnamese: String(row[1]).trim(),
          });
        }
      }
    }
    
    return {
      name: file.name.replace(/\.(xlsx?|csv)$/i, ''),
      fileName: file.name,
      language,
      items,
    };
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    return null;
  }
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
