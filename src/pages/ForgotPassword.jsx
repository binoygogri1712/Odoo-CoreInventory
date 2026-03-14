import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';
import './Auth.css';

const API_URL = 'http://localhost:8000/api/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || 'Failed to process request');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setMessage(data.message);
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
            <span className="auth-panel__feature-icon">🔒</span>
            Secure password recovery
          </div>
          <div className="auth-panel__feature">
            <span className="auth-panel__feature-icon">✉️</span>
            Email verification
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form__header">
            <h2 className="auth-form__title">Forgot Password</h2>
            <p className="auth-form__desc">Enter your email to receive a reset link</p>
          </div>

          {error && (
            <div className="auth-alert auth-alert--error">
              <HiOutlineXCircle /> {error}
            </div>
          )}
          
          {success && message && (
            <div className="auth-alert auth-alert--success">
              <HiOutlineCheckCircle /> {message}
            </div>
          )}

          {!success ? (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address <span>*</span></label>
                <div className="form-input-wrap">
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  />
                  <HiOutlineMail className="form-input-icon" />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading && <span className="auth-spinner"></span>}
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="auth-success-state" style={{ textAlign: 'center', margin: '2rem 0' }}>
              <p style={{ color: '#6b7185', marginBottom: '20px' }}>
                Please check your inbox for the password reset link. The link is valid for 15 minutes.
              </p>
            </div>
          )}

          <div className="auth-footer" style={{ marginTop: '30px' }}>
            Remember your password? <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
