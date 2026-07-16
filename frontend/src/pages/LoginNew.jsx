import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaStethoscope, FaEye, FaEyeSlash } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const Login = ({ mode = 'login', setCurrentRole, setCurrentUserEmail, setAuthToken }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [isRegistering, setIsRegistering] = useState(mode === 'register');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationOtp, setVerificationOtp] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || '';

  useEffect(() => {
    setIsRegistering(mode === 'register');
    setShowVerification(false);
  }, [mode]);

  const showNotification = (msg, type = 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const persistAuthSession = (token, user) => {
    const role = String(user?.role || '').toLowerCase();

    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUserEmail', user.email);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userId', user.id || user.email);

    if (role && role !== 'pending') {
      localStorage.setItem('currentRole', role);
      setCurrentRole(role);
    } else {
      localStorage.removeItem('currentRole');
      setCurrentRole(null);
    }

    setAuthToken(token);
    setCurrentUserEmail(user.email);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentRole(null);

    if (!validateEmail(form.email)) {
      showNotification('Please enter a valid email', 'error');
      setIsLoading(false);
      return;
    }

    if (!form.password) {
      showNotification('Please enter your password', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        showNotification(data.detail || 'Login failed', 'error');
        setIsLoading(false);
        return;
      }

      persistAuthSession(data.access_token, data.user);
      showNotification('Welcome back!', 'success');
    } catch (error) {
      showNotification('Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!form.name.trim()) {
      showNotification('Please enter your name', 'error');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(form.email)) {
      showNotification('Please enter a valid email', 'error');
      setIsLoading(false);
      return;
    }

    if (form.password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      setIsLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: 'pending',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        showNotification(data.detail || 'Registration failed', 'error');
        setIsLoading(false);
        return;
      }

      setVerificationOtp(data.otp || null);
      setShowVerification(true);
      showNotification('Verification code sent to your email. Please enter it below.', 'success');
    } catch (error) {
      showNotification('Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!form.otp.trim()) {
      showNotification('Please enter the verification code', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          otp: form.otp,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        showNotification(data.detail || 'Verification failed', 'error');
        setIsLoading(false);
        return;
      }

      showNotification('Email verified successfully. You can now log in.', 'success');
      setIsRegistering(false);
      setShowVerification(false);
      setForm({ name: '', email: form.email, password: '', confirmPassword: '', otp: '' });
    } catch (error) {
      showNotification('Verification failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    if (!response?.credential) {
      showNotification('Google sign-in was cancelled.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const googleResponse = await fetch(`${API_BASE_URL}/api/v1/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await googleResponse.json();
      if (!googleResponse.ok) {
        showNotification(data.detail || 'Google sign-in failed', 'error');
        setIsLoading(false);
        return;
      }

      persistAuthSession(data.access_token, data.user);
      showNotification('Welcome! Your Google account is connected.', 'success');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (error) {
      showNotification('Google sign-in failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    showNotification('Google sign-in could not be started. Please try again.', 'error');
  };

  const handleGoogleLogin = () => {
    if (!googleClientId) {
      showNotification('Google login is not configured yet. Set VITE_GOOGLE_CLIENT_ID to enable it.', 'error');
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-badge">
              <FaStethoscope />
            </div>
            <h1 className="auth-title">Healthcare Hub</h1>
            <p className="auth-subtitle">Connect & Share Health Updates</p>
          </div>

          {message && <div className={`message-box ${messageType}`}>{message}</div>}

          {showVerification ? (
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label className="form-label">Verification Code</label>
                <input
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleInputChange}
                  placeholder="Enter code"
                  className="form-input"
                />
              </div>

              {verificationOtp && (
                <div className="auth-helpers">Test OTP: <strong>{verificationOtp}</strong></div>
              )}

              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </button>

              <div className="auth-helpers">
                <button type="button" className="link-button" onClick={() => {
                  setShowVerification(false);
                  setForm((prev) => ({ ...prev, otp: '' }));
                }}>
                  Back to Registration
                </button>
              </div>
            </form>
          ) : isRegistering ? (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder="At least 6 characters"
                    className="form-input"
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>

              <div className="divider-with-text"><span>or</span></div>

              <div>
                {googleClientId ? (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    text="continue_with"
                    shape="rectangular"
                    width="100%"
                  />
                ) : (
                  <button type="button" className="auth-button" disabled>
                    Google login unavailable
                  </button>
                )}
              </div>

              <div className="auth-helpers">
                Already have an account?
                <button type="button" className="link-button" onClick={() => {
                  setIsRegistering(false);
                  setForm({ name: '', email: '', password: '', confirmPassword: '', otp: '' });
                }}>
                  Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">
                  <FaEnvelope style={{ marginRight: '0.5rem' }} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaLock style={{ marginRight: '0.5rem' }} />
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="form-input"
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              <div className="divider-with-text"><span>or</span></div>

              <div>
                {googleClientId ? (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    text="continue_with"
                    shape="rectangular"
                    width="100%"
                  />
                ) : (
                  <button type="button" className="auth-button" disabled>
                    Google login unavailable
                  </button>
                )}
              </div>

              <div className="auth-helpers">
                Don't have an account?
                <button type="button" className="link-button" onClick={() => {
                  setIsRegistering(true);
                  setForm({ name: '', email: '', password: '', confirmPassword: '', otp: '' });
                }}>
                  Register
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
