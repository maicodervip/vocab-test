import { useState } from 'react';
import { UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';
import { registerUser, loginUser } from '../services/firebaseService';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        // Register new user
        await registerUser(trimmedEmail, password);
        onLogin(trimmedEmail);
      } else {
        // Login existing user
        await loginUser(trimmedEmail, password);
        onLogin(trimmedEmail);
      }
    } catch (err: any) {
      if (err.message.includes('email-already-in-use')) {
        setError('Email này đã được sử dụng');
      } else if (err.message.includes('weak-password')) {
        setError('Mật khẩu quá yếu');
      } else if (err.message.includes('invalid-email')) {
        setError('Email không hợp lệ');
      } else {
        setError(err.message || 'Đã có lỗi xảy ra');
      }
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Địa chỉ email"
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
