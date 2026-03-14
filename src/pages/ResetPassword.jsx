import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineXCircle, HiOutlineCheckCircle } from 'react-icons/hi';
import './Auth.css';

const API_URL = 'http://localhost:8000/api/auth';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing password reset token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!token) {
      setError('Invalid or missing password reset token.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || 'Failed to reset password. The link might be expired.');
        setLoading(false);
        return;
      }

      setSuccess(data.message);
      
      // Navigate to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { state: { registered: false } });
      }, 3000);
      
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
          Securely reset your password to regain access to your TraceFlow account.
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form__header">
            <h2 className="auth-form__title">Reset Password</h2>
            <p className="auth-form__desc">Create a new secure password</p>
          </div>

          {error && (
            <div className="auth-alert auth-alert--error">
              <HiOutlineXCircle /> {error}
            </div>
          )}
          
          {success && (
            <div className="auth-alert auth-alert--success">
              <HiOutlineCheckCircle /> {success}
              <p style={{ marginTop: '8px', fontSize: '13px' }}>Redirecting to login...</p>
            </div>
          )}

          {!success && (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">New Password <span>*</span></label>
                <div className="form-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    disabled={!token}
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
                <div className="password-hint" style={{ fontSize: '12px', color: '#6b7185', marginTop: '6px' }}>
                  Must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '20px' }}>
                <label className="form-label">Confirm New Password <span>*</span></label>
                <div className="form-input-wrap">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    disabled={!token}
                  />
                  <HiOutlineLockClosed className="form-input-icon" />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading || !token}>
                {loading && <span className="auth-spinner"></span>}
                Update Password
              </button>
            </form>
          )}

          <div className="auth-footer" style={{ marginTop: '30px' }}>
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
