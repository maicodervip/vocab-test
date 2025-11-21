import { useState } from 'react';
import { UserPlus, LogIn, Users, Eye, EyeOff } from 'lucide-react';
import { createUser, loginUser, userExists, getAllUsernames } from '../services/storage';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showExistingUsers, setShowExistingUsers] = useState(false);
  const [error, setError] = useState('');
  const existingUsers = getAllUsernames();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const trimmedUsername = username.trim();
    
    if (trimmedUsername.length < 2) {
      setError('Tên người dùng phải có ít nhất 2 ký tự');
      return;
    }

    if (password.length < 4) {
      setError('Mật khẩu phải có ít nhất 4 ký tự');
      return;
    }

    try {
      if (isRegistering) {
        // Register new user
        if (userExists(trimmedUsername)) {
          setError('Tên người dùng đã tồn tại');
          return;
        }
        createUser(trimmedUsername, password);
        onLogin(trimmedUsername);
      } else {
        // Login existing user
        const user = loginUser(trimmedUsername, password);
        if (!user) {
          setError('Tên người dùng hoặc mật khẩu không đúng');
          return;
        }
        onLogin(trimmedUsername);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    }
  };

  const handleSelectUser = (user: string) => {
    setUsername(user);
    setPassword('');
    setIsRegistering(false);
    setShowExistingUsers(false);
  };

  return (
    <div className="login-page">
      <div className="login-container card">
        <div className="login-header">
          <h1 className="login-title gradient-text">Vocab Tester</h1>
          <p className="login-subtitle">
            {isRegistering ? 'Tạo tài khoản mới' : 'Đăng nhập vào tài khoản'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên người dùng"
              className="login-input"
              autoFocus
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="login-input"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <button type="submit" className="login-button">
            {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
            {isRegistering ? 'Đăng ký' : 'Đăng nhập'}
          </button>

          <button
            type="button"
            className="switch-mode-button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
          >
            {isRegistering ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
          </button>
        </form>

        {existingUsers.length > 0 && !isRegistering && (
          <div className="existing-users-section">
            <button 
              className="toggle-users-button"
              onClick={() => setShowExistingUsers(!showExistingUsers)}
              type="button"
            >
              <Users size={18} />
              {showExistingUsers ? 'Ẩn' : 'Hiện'} tài khoản đã có ({existingUsers.length})
            </button>

            {showExistingUsers && (
              <div className="users-list">
                {existingUsers.map((user) => (
                  <button
                    key={user}
                    className="user-item"
                    onClick={() => handleSelectUser(user)}
                    type="button"
                  >
                    <LogIn size={16} />
                    {user}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
