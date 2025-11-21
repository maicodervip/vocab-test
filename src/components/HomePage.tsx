import { useState, useRef, useEffect } from 'react';
import { VocabUnit } from '../types';
import { parseExcelFile } from '../utils';
import { Upload, BookOpen, Sparkles, Trash2, LogOut, User } from 'lucide-react';
import { getUnitsForCurrentUser, saveUnitsForCurrentUser, deleteUnitForCurrentUser, getCurrentUser, logoutUser } from '../services/storage';
import './HomePage.css';

interface HomePageProps {
  onStartQuiz: (unit: VocabUnit) => void;
  onLogout: () => void;
}

export default function HomePage({ onStartQuiz, onLogout }: HomePageProps) {
  const [units, setUnits] = useState<VocabUnit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = getCurrentUser();

  // Load units from localStorage on mount
  useEffect(() => {
    const savedUnits = getUnitsForCurrentUser();
    setUnits(savedUnits);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    const newUnits: VocabUnit[] = [];

    for (let i = 0; i < files.length; i++) {
      const unit = await parseExcelFile(files[i]);
      if (unit && unit.items.length > 0) {
        newUnits.push(unit);
      }
    }

    const updatedUnits = [...units, ...newUnits];
    setUnits(updatedUnits);
    saveUnitsForCurrentUser(updatedUnits);
    setIsLoading(false);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteUnit = (fileName: string) => {
    if (confirm('Bạn có chắc muốn xóa unit này?')) {
      deleteUnitForCurrentUser(fileName);
      const updatedUnits = units.filter(unit => unit.fileName !== fileName);
      setUnits(updatedUnits);
    }
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      logoutUser();
      onLogout();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="user-info-bar">
            <div className="user-badge">
              <User size={18} />
              <span>{currentUser}</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
          
          <h1 className="hero-title">
            <Sparkles className="sparkle-icon" />
            <span className="gradient-text">Vocab Tester</span>
            <Sparkles className="sparkle-icon" />
          </h1>
          <p className="hero-subtitle">Học từ vựng tiếng Nhật một cách thông minh và hiệu quả</p>
        </div>
      </div>

      <div className="main-content">
        <div className="upload-section card">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button 
            className="upload-button"
            onClick={handleUploadClick}
            disabled={isLoading}
          >
            <Upload size={20} />
            {isLoading ? 'Đang tải...' : 'Tải file Excel'}
          </button>
          <p className="upload-hint">
            Định dạng: Cột 1 - Ngôn ngữ | Cột 2 - Đáp án 2 (optional) | Cột 3 - Tiếng Việt
          </p>
        </div>

        {units.length > 0 && (
          <div className="units-section">
            <h2 className="section-title">
              <BookOpen size={24} />
              Danh sách Units ({units.length})
            </h2>
            <div className="units-grid">
              {units.map((unit, index) => (
                <div key={index} className="unit-card card">
                  <div className="unit-header">
                    <h3 className="unit-name">{unit.name}</h3>
                    <span className="vocab-count">{unit.items.length} từ</span>
                  </div>
                  <div className="unit-actions">
                    <button 
                      className="start-button"
                      onClick={() => onStartQuiz(unit)}
                    >
                      Bắt đầu học
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteUnit(unit.fileName)}
                      title="Xóa unit"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {units.length === 0 && !isLoading && (
          <div className="empty-state card">
            <BookOpen size={48} className="empty-icon" />
            <p className="empty-text">Chưa có unit nào</p>
            <p className="empty-hint">Hãy tải lên file Excel để bắt đầu học!</p>
          </div>
        )}
      </div>
    </div>
  );
}
