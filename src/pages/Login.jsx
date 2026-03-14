import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineXCircle,
  HiOutlineCheckCircle,
} from 'react-icons/hi';
import './Auth.css';

const API_URL = 'http://localhost:8000/api/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.registered;

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoLogin = () => {
    sessionStorage.setItem('traceflow_token', 'demo-mock-token');
    sessionStorage.setItem('traceflow_user', JSON.stringify({ name: 'Demo User', email: 'demo@coreinventory.dev' }));
    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || 'Invalid credentials');
        setLoading(false);
        return;
      }

      // Store token
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('traceflow_token', data.access_token);
      storage.setItem('traceflow_user', JSON.stringify(data.user));

      // Redirect to dashboard
      navigate('/');
    } catch {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      {/* Left Brand Panel */}
      <div className="auth-panel">
        <div className="auth-panel__logo">TF</div>
        <h1 className="auth-panel__title">TraceFlow</h1>
        <p className="auth-panel__subtitle">
          Streamline your inventory. Track, manage, and optimize stock in real-time.
        </p>
        <div className="auth-panel__features">
          <div className="auth-panel__feature">
            <span className="auth-panel__feature-icon">📦</span>
            Real-time stock tracking
          </div>
          <div className="auth-panel__feature">
            <span className="auth-panel__feature-icon">🏢</span>
            Multi-warehouse support
          </div>
          <div className="auth-panel__feature">
            <span className="auth-panel__feature-icon">📊</span>
            Smart analytics dashboard
          </div>
          <div className="auth-panel__feature">
            <span className="auth-panel__feature-icon">🔔</span>
            Low stock alerts
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form__header">
            <h2 className="auth-form__title">Welcome Back</h2>
            <p className="auth-form__desc">Sign in to your TraceFlow account</p>
          </div>

          {justRegistered && (
            <div className="auth-alert auth-alert--success">
              <HiOutlineCheckCircle /> Account created successfully! Please sign in.
            </div>
          )}

          {error && (
            <div className="auth-alert auth-alert--error" style={{ marginTop: justRegistered ? '10px' : '0' }}>
              <HiOutlineXCircle /> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email or Login ID <span>*</span></label>
              <div className="form-input-wrap">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter email or login ID"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                />
                <HiOutlineUser className="form-input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password <span>*</span></label>
              <div className="form-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                />
                <HiOutlineLockClosed className="form-input-icon" />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a href="#" className="auth-forgot">Forgot Password?</a>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading && <span className="auth-spinner"></span>}
              Sign In
            </button>

            <div className="auth-divider"><span>or</span></div>

            <button type="button" className="auth-demo-btn" onClick={handleDemoLogin}>
              Demo Login (no backend needed)
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
