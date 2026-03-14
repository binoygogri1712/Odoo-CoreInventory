import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineShieldCheck,
} from 'react-icons/hi';
import './Auth.css';

const API_URL = 'http://localhost:8000/api/auth';

const passwordRules = [
  { label: '8+ characters', test: (p) => p.length >= 8 },
  { label: '1 uppercase', test: (p) => /[A-Z]/.test(p) },
  { label: '1 lowercase', test: (p) => /[a-z]/.test(p) },
  { label: '1 number', test: (p) => /[0-9]/.test(p) },
  { label: '1 special char', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Details, 2: Password, 3: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const otpRefs = useRef([]);

  const [form, setForm] = useState({
    login_id: '',
    email: '',
    mobile: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  // ─── STEP 1: DETAILS ─────────────
  const handleStep1 = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.login_id || !form.email || !form.mobile || !form.gender) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Check login_id availability
      const idRes = await fetch(`${API_URL}/check-login-id/${form.login_id}`);
      const idData = await idRes.json();
      if (!idData.available) {
        setError('Login ID is already taken');
        setLoading(false);
        return;
      }

      // Check email availability
      const emailRes = await fetch(`${API_URL}/check-email/${form.email}`);
      const emailData = await emailRes.json();
      if (!emailData.available) {
        setError('Email is already registered');
        setLoading(false);
        return;
      }

      setStep(2);
    } catch {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  // ─── STEP 2: PASSWORD ────────────
  const allPasswordRulesPassed = passwordRules.every((r) => r.test(form.password));
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword !== '';

  const handleStep2 = async (e) => {
    e.preventDefault();
    setError('');

    if (!allPasswordRulesPassed) {
      setError('Password does not meet all requirements');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Register user
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login_id: form.login_id,
          email: form.email,
          password: form.password,
          mobile: form.mobile,
          gender: form.gender,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Registration failed');
        setLoading(false);
        return;
      }

      // Send OTP
      const otpRes = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      const otpData = await otpRes.json();
      if (!otpRes.ok) {
        setError(otpData.detail || 'Failed to send OTP');
        setLoading(false);
        return;
      }

      setStep(3);
    } catch {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  // ─── STEP 3: OTP VERIFY ──────────
  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp_code: otpCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || 'Invalid OTP');
        setLoading(false);
        return;
      }

      // Success — redirect to login
      navigate('/login', { state: { registered: true } });
    } catch {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
    } catch {}
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
          {/* Step Indicator */}
          <div className="steps-indicator">
            <div className={`step-dot ${step === 1 ? 'step-dot--active' : step > 1 ? 'step-dot--done' : ''}`}></div>
            <div className={`step-dot ${step === 2 ? 'step-dot--active' : step > 2 ? 'step-dot--done' : ''}`}></div>
            <div className={`step-dot ${step === 3 ? 'step-dot--active' : ''}`}></div>
          </div>

          {/* ═══ STEP 1: DETAILS ═══ */}
          {step === 1 && (
            <>
              <div className="auth-form__header">
                <h2 className="auth-form__title">Create Account</h2>
                <p className="auth-form__desc">Enter your details to get started</p>
              </div>

              {error && <div className="auth-alert auth-alert--error"><HiOutlineXCircle /> {error}</div>}

              <form className="auth-form" onSubmit={handleStep1}>
                <div className="form-group">
                  <label className="form-label">Login ID <span>*</span></label>
                  <div className="form-input-wrap">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Choose a unique login ID"
                      value={form.login_id}
                      onChange={(e) => updateForm('login_id', e.target.value)}
                    />
                    <HiOutlineUser className="form-input-icon" />
                  </div>
                  <span className="form-hint">Letters, numbers, and underscores only</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address <span>*</span></label>
                  <div className="form-input-wrap">
                    <input
                      type="email"
                      className="form-input"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                    />
                    <HiOutlineMail className="form-input-icon" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Mobile No. <span>*</span></label>
                    <div className="form-input-wrap">
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+91 XXXXX XXXXX"
                        value={form.mobile}
                        onChange={(e) => updateForm('mobile', e.target.value)}
                      />
                      <HiOutlinePhone className="form-input-icon" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender <span>*</span></label>
                    <div className="form-input-wrap">
                      <select
                        className="form-select"
                        value={form.gender}
                        onChange={(e) => updateForm('gender', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <HiOutlineUser className="form-input-icon" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading && <span className="auth-spinner"></span>}
                  Continue →
                </button>
              </form>

              <div className="auth-footer">
                Already have an account? <Link to="/login">Sign In</Link>
              </div>
            </>
          )}

          {/* ═══ STEP 2: PASSWORD ═══ */}
          {step === 2 && (
            <>
              <div className="auth-form__header">
                <h2 className="auth-form__title">Set Password</h2>
                <p className="auth-form__desc">Create a strong password for your account</p>
              </div>

              {error && <div className="auth-alert auth-alert--error"><HiOutlineXCircle /> {error}</div>}

              <form className="auth-form" onSubmit={handleStep2}>
                <div className="form-group">
                  <label className="form-label">Password <span>*</span></label>
                  <div className="form-input-wrap">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => updateForm('password', e.target.value)}
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

                  {/* Password Rules */}
                  <div className="password-rules">
                    {passwordRules.map((rule, i) => (
                      <span
                        key={i}
                        className={`password-rule ${rule.test(form.password) ? 'password-rule--pass' : ''}`}
                      >
                        <span className="password-rule__icon">
                          {rule.test(form.password) ? <HiOutlineCheckCircle /> : <HiOutlineXCircle />}
                        </span>
                        {rule.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password <span>*</span></label>
                  <div className="form-input-wrap">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      className={`form-input ${
                        form.confirmPassword
                          ? passwordsMatch
                            ? 'form-input--success'
                            : 'form-input--error'
                          : ''
                      }`}
                      placeholder="Re-enter your password"
                      value={form.confirmPassword}
                      onChange={(e) => updateForm('confirmPassword', e.target.value)}
                    />
                    <HiOutlineLockClosed className="form-input-icon" />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                    </button>
                  </div>
                  {form.confirmPassword && !passwordsMatch && (
                    <span className="form-error">Passwords do not match</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    className="auth-submit-btn"
                    style={{ background: 'rgba(0,0,0,0.06)', color: 'var(--text-primary)', boxShadow: 'none', flex: '0 0 auto', width: 'auto', padding: '14px 28px' }}
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </button>
                  <button type="submit" className="auth-submit-btn" disabled={loading || !allPasswordRulesPassed || !passwordsMatch}>
                    {loading && <span className="auth-spinner"></span>}
                    Create Account
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ═══ STEP 3: OTP ═══ */}
          {step === 3 && (
            <>
              <div className="auth-form__header" style={{ textAlign: 'center' }}>
                <HiOutlineShieldCheck style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '12px' }} />
                <h2 className="auth-form__title">Verify Your Email</h2>
                <p className="auth-form__desc">
                  We've sent a 6-digit code to <strong>{form.email}</strong>
                </p>
              </div>

              {error && <div className="auth-alert auth-alert--error"><HiOutlineXCircle /> {error}</div>}

              <form className="auth-form" onSubmit={handleVerifyOtp}>
                <div className="otp-container">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="otp-input"
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading && <span className="auth-spinner"></span>}
                  Verify & Complete
                </button>

                <div className="otp-resend">
                  Didn't receive the code?{' '}
                  <button type="button" onClick={handleResendOtp} disabled={loading}>
                    Resend OTP
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
