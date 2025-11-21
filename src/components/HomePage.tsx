import { useState, useRef, useEffect } from 'react';
import { VocabUnit, Workspace } from '../types';
import { parseExcelFile } from '../utils';
import { Upload, BookOpen, Sparkles, Trash2, LogOut, User, ArrowLeft } from 'lucide-react';
import { 
  getUnitsForWorkspace,
  saveUnitToWorkspace,
  deleteUnitFromWorkspace,
  getCurrentWorkspace,
  setCurrentWorkspace,
  getUserWorkspaces,
  logoutUser,
  clearCurrentWorkspace,
  getCurrentUsername
} from '../services/firebaseService';
import WorkspaceSelector from './WorkspaceSelector';
import './HomePage.css';

interface HomePageProps {
  onStartQuiz: (unit: VocabUnit) => void;
  onLogout: () => void;
}

export default function HomePage({ onStartQuiz, onLogout }: HomePageProps) {
  const [units, setUnits] = useState<VocabUnit[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState<string>('User');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load workspaces and units on mount
  useEffect(() => {
    loadUsername();
    loadWorkspaces();
    
    const workspaceId = getCurrentWorkspace();
    if (workspaceId) {
      loadWorkspaceById(workspaceId);
    }
  }, []);

  const loadUsername = async () => {
    try {
      const name = await getCurrentUsername();
      if (name) setUsername(name);
    } catch (error) {
      console.error('Error loading username:', error);
    }
  };

  const loadWorkspaces = async () => {
    try {
      const ws = await getUserWorkspaces();
      setWorkspaces(ws);
    } catch (error) {
      console.error('Error loading workspaces:', error);
      setWorkspaces([]);
    }
  };

  const loadWorkspaceById = async (workspaceId: string) => {
    try {
      const ws = await getUserWorkspaces();
      const workspace = ws.find(w => w.id === workspaceId);
      if (workspace) {
        setCurrentWorkspaceState(workspace);
        loadUnits(workspaceId);
      } else {
        clearCurrentWorkspace();
        setCurrentWorkspaceState(null);
      }
    } catch (error) {
      console.error('Error loading workspace:', error);
      clearCurrentWorkspace();
      setCurrentWorkspaceState(null);
    }
  };

  const loadUnits = async (workspaceId: string) => {
    try {
      const savedUnits = await getUnitsForWorkspace(workspaceId);
      setUnits(savedUnits);
    } catch (error) {
      console.error('Error loading units:', error);
      setUnits([]);
    }
  };

  const handleSelectWorkspace = async (workspace: Workspace) => {
    setCurrentWorkspace(workspace.id);
    setCurrentWorkspaceState(workspace);
    const workspaceUnits = await getUnitsForWorkspace(workspace.id);
    setUnits(workspaceUnits);
  };

  const handleBackToWorkspaces = () => {
    clearCurrentWorkspace();
    setCurrentWorkspaceState(null);
    setUnits([]);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !currentWorkspace) return;

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
    
    // Save each unit to Firebase
    for (const unit of newUnits) {
      await saveUnitToWorkspace(currentWorkspace.id, unit);
    }
    
    setIsLoading(false);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteUnit = async (fileName: string) => {
    if (confirm('Bạn có chắc muốn xóa unit này?')) {
      if (currentWorkspace) {
        await deleteUnitFromWorkspace(currentWorkspace.id, fileName);
        const updatedUnits = units.filter(unit => unit.fileName !== fileName);
        setUnits(updatedUnits);
      }
    }
  };

  const handleLogout = async () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      await logoutUser();
      onLogout();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getLanguageFormatHint = () => {
    if (!currentWorkspace) return '';
    switch (currentWorkspace.language) {
      case 'english':
        return 'Cột 1 - English | Cột 2 - Tiếng Việt';
      case 'chinese':
        return 'Cột 1 - 中文 | Cột 2 - Tiếng Việt';
      case 'japanese':
        return 'Cột 1 - 日本語 | Cột 2 - Đáp án 2 (optional) | Cột 3 - Tiếng Việt';
    }
  };

  // Show workspace selector if no workspace selected
  if (!currentWorkspace) {
    return (
      <div className="home-page">
        <div className="hero-section">
          <div className="hero-content">
            <div className="user-info-bar">
              <div className="user-badge">
                <User size={18} />
                <span>{username}</span>
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
            <p className="hero-subtitle">Học từ vựng đa ngôn ngữ một cách thông minh và hiệu quả</p>
          </div>
        </div>

        <div className="main-content">
          <WorkspaceSelector 
            workspaces={workspaces}
            onSelectWorkspace={handleSelectWorkspace}
            onWorkspacesChange={loadWorkspaces}
          />
        </div>
      </div>
    );
  }

  // Show units for selected workspace
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="user-info-bar">
            <button className="back-button" onClick={handleBackToWorkspaces}>
              <ArrowLeft size={18} />
              Quay lại
            </button>
            <div className="user-badge">
              <User size={18} />
              <span>{username}</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
          
          <h1 className="hero-title">
            <span className="workspace-lang">{currentWorkspace.name}</span>
          </h1>
          <p className="hero-subtitle">Không gian học tập {currentWorkspace.name}</p>
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
            {getLanguageFormatHint()}
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
