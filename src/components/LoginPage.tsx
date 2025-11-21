import { useState } from 'react';
import { UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { registerUser, loginUser } from '../services/firebaseService';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: (user: FirebaseUser) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const trimmedUsername = username.trim();
    
    if (trimmedUsername.length < 3) {
      setError('Tên người dùng phải có ít nhất 3 ký tự');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setLoading(false);
      return;
    }

    try {
      let user: FirebaseUser;
      if (isRegistering) {
        // Register new user
        user = await registerUser(trimmedUsername, password);
      } else {
        // Login existing user
        user = await loginUser(trimmedUsername, password);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu (tối thiểu 6 ký tự)"
              className="login-input"
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              '...'
            ) : (
              <>
                {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
                {isRegistering ? 'Đăng ký' : 'Đăng nhập'}
              </>
            )}
          </button>

          <button
            type="button"
            className="switch-mode-button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            disabled={loading}
          >
            {isRegistering ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
          </button>
        </form>
      </div>
    </div>
  );
}
