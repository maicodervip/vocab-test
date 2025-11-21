import { useState } from 'react';
import { Workspace, Language } from '../types';
import { Globe, Plus, Trash2, BookOpen } from 'lucide-react';
import { createWorkspace, deleteWorkspace } from '../services/firebaseService';
import './WorkspaceSelector.css';

interface WorkspaceSelectorProps {
  workspaces: Workspace[];
  onSelectWorkspace: (workspace: Workspace) => void;
  onWorkspacesChange: () => void;
}

const LANGUAGE_INFO: { [key in Language]: { name: string; flag: string; description: string } } = {
  japanese: { name: '日本語', flag: '🇯🇵', description: 'Tiếng Nhật' },
  chinese: { name: '中文', flag: '🇨🇳', description: 'Tiếng Trung' },
  english: { name: 'English', flag: '🇬🇧', description: 'Tiếng Anh' },
};

export default function WorkspaceSelector({ workspaces, onSelectWorkspace, onWorkspacesChange }: WorkspaceSelectorProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const availableLanguages = (['japanese', 'chinese', 'english'] as Language[]).filter(
    lang => !workspaces.some(w => w.language === lang)
  );

  const handleCreateWorkspace = async () => {
    if (!selectedLanguage) {
      setError('Vui lòng chọn ngôn ngữ');
      return;
    }

    setLoading(true);
    try {
      await createWorkspace(selectedLanguage);
      await onWorkspacesChange();
      setShowCreateModal(false);
      setSelectedLanguage(null);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa không gian học tập này? Tất cả dữ liệu sẽ bị mất.')) {
      setLoading(true);
      try {
        await deleteWorkspace(workspaceId);
        await onWorkspacesChange();
      } catch (err) {
        alert('Lỗi khi xóa workspace: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="workspace-selector">
      <div className="workspace-header">
        <h2 className="section-title">
          <Globe size={24} />
          Không gian học tập ({workspaces.length}/3)
        </h2>
        {workspaces.length < 3 && (
          <button className="create-workspace-button" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            Tạo không gian mới
          </button>
        )}
      </div>

      <div className="workspaces-grid">
        {workspaces.map((workspace) => {
          const langInfo = LANGUAGE_INFO[workspace.language];
          return (
            <div 
              key={workspace.id} 
              className="workspace-card card"
              onClick={() => onSelectWorkspace(workspace)}
            >
              <div className="workspace-icon">{langInfo.flag}</div>
              <div className="workspace-info">
                <h3 className="workspace-name">{langInfo.name}</h3>
                <p className="workspace-desc">{langInfo.description}</p>
              </div>
              <button
                className="delete-workspace-button"
                onClick={(e) => handleDeleteWorkspace(workspace.id, e)}
                title="Xóa không gian"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {workspaces.length === 0 && (
        <div className="empty-state card">
          <BookOpen size={48} className="empty-icon" />
          <p className="empty-text">Chưa có không gian học tập nào</p>
          <p className="empty-hint">Hãy tạo không gian học tập đầu tiên!</p>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Tạo không gian học tập mới</h3>
            
            {error && <div className="error-message">{error}</div>}

            <div className="language-selection">
              {availableLanguages.map((lang) => {
                const langInfo = LANGUAGE_INFO[lang];
                return (
                  <button
                    key={lang}
                    className={`language-option ${selectedLanguage === lang ? 'selected' : ''}`}
                    onClick={() => setSelectedLanguage(lang)}
                  >
                    <span className="language-flag">{langInfo.flag}</span>
                    <span className="language-name">{langInfo.name}</span>
                    <span className="language-desc">{langInfo.description}</span>
                  </button>
                );
              })}
            </div>

            {availableLanguages.length === 0 && (
              <p className="no-languages">Bạn đã tạo đủ 3 không gian học tập!</p>
            )}

            <div className="modal-actions">
              <button 
                className="cancel-button" 
                onClick={() => setShowCreateModal(false)}
                disabled={loading}
              >
                Hủy
              </button>
              <button 
                className="confirm-button" 
                onClick={handleCreateWorkspace}
                disabled={!selectedLanguage || loading}
              >
                <Plus size={18} />
                {loading ? 'Đang tạo...' : 'Tạo không gian'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
