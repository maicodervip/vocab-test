import * as XLSX from 'xlsx';
import { VocabUnit, VocabItem, Language } from './types';

export async function loadVocabUnits(): Promise<VocabUnit[]> {
  const units: VocabUnit[] = [];
  
  try {
    // In a real app, you'd list files from the vocab_file directory
    // For now, we'll provide a way to upload Excel files
    const files = await getExcelFiles();
    
    for (const file of files) {
      const unit = await parseExcelFile(file);
      if (unit) {
        units.push(unit);
      }
    }
  } catch (error) {
    console.error('Error loading vocab units:', error);
  }
  
  return units;
}

async function getExcelFiles(): Promise<File[]> {
  // This will be populated by user file selection
  // or by reading from the vocab_file directory
  return [];
}

export async function parseExcelFile(file: File, language: Language = 'japanese'): Promise<VocabUnit | null> {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    
    const items: VocabItem[] = [];
    
    // Skip header row if exists, start from row 1
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      
      if (language === 'japanese') {
        // Tiếng Nhật: Cột 1 - Hiragana (bắt buộc) | Cột 2 - Hán tự (optional) | Cột 3 - Tiếng Việt (bắt buộc)
        if (row[0] && row[2]) {
          const item: VocabItem = {
            foreign: String(row[0]).trim(), // Hiragana
            vietnamese: String(row[2]).trim(),
          };
          
          // Thêm Hán tự làm đáp án thay thế nếu có
          if (row[1] && String(row[1]).trim()) {
            item.foreignAlt = String(row[1]).trim(); // Hán tự
          }
          
          items.push(item);
        }
      } else if (language === 'chinese') {
        // Tiếng Trung: Cột 1 - Hán tự (bắt buộc) | Cột 2 - Pinyin (optional) | Cột 3 - Tiếng Việt (bắt buộc)
        if (row[0] && row[2]) {
          const item: VocabItem = {
            foreign: String(row[0]).trim(), // Hán tự
            vietnamese: String(row[2]).trim(),
          };
          
          // Thêm Pinyin làm đáp án thay thế nếu có
          if (row[1] && String(row[1]).trim()) {
            item.foreignAlt = String(row[1]).trim(); // Pinyin
          }
          
          items.push(item);
        }
      } else if (language === 'english') {
        // Tiếng Anh: Cột 1 - English (bắt buộc) | Cột 2 - Tiếng Việt (bắt buộc)
        if (row[0] && row[1]) {
          const item: VocabItem = {
            foreign: String(row[0]).trim(), // English
            vietnamese: String(row[1]).trim(),
          };
          
          items.push(item);
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
