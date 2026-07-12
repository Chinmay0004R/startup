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

      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('currentUserEmail', data.user.email);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userId', data.user.id || data.user.email);

      setAuthToken(data.access_token);
      setCurrentUserEmail(data.user.email);
      showNotification('Welcome! Your Google account is connected.', 'success');
      setTimeout(() => navigate('/role-setup'), 500);
    } catch (error) {
      showNotification('Google sign-in failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsRegistering(mode === 'register');
    setShowVerification(false);
  }, [mode]);

  const showNotification = (msg, type = 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleGoogleError = () => {
    showNotification('Google sign-in could not be started. Please try again.', 'error');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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

      // Store auth data temporarily
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('currentUserEmail', data.user.email);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userId', data.user.id || data.user.email);

      setAuthToken(data.access_token);
      setCurrentUserEmail(data.user.email);

      showNotification(`Welcome back!`, 'success');
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
          role: 'patient',
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

  const handleGoogleLogin = () => {
    if (!googleClientId) {
      showNotification('Google login is not configured yet. Set VITE_GOOGLE_CLIENT_ID to enable it.', 'error');
      return;
    }
  };

  const bgStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1rem',
  };

  const containerStyle = {
    width: '100%',
    maxWidth: '400px',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
  };

  const logoStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
  };

  const logoBadgeStyle = {
    width: '70px',
    height: '70px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
    fontSize: '2rem',
    color: 'white',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
  };

  const titleStyle = {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '0.5rem',
  };

  const subtitleStyle = {
    color: '#718096',
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
  };

  const formGroupStyle = {
    marginBottom: '1.25rem',
  };

  const labelStyle = {
    display: 'block',
    color: '#2d3748',
    fontWeight: '600',
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  };

  const passwordWrapperStyle = {
    position: 'relative',
  };

  const togglePasswordStyle = {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#718096',
    fontSize: '1.1rem',
  };

  const toggleButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#667eea',
    fontWeight: '600',
    cursor: 'pointer',
    marginLeft: '0.25rem',
    textDecoration: 'underline',
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.875rem 1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontWeight: '600',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    opacity: isLoading ? 0.7 : 1,
    pointerEvents: isLoading ? 'none' : 'auto',
  };

  const messageStyle = {
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem',
    fontSize: '0.95rem',
    backgroundColor: messageType === 'error' ? '#fed7d7' : messageType === 'success' ? '#c6f6d5' : '#bee3f8',
    color: messageType === 'error' ? '#c53030' : messageType === 'success' ? '#22543d' : '#2c5aa0',
    border: `1px solid ${messageType === 'error' ? '#fc8181' : messageType === 'success' ? '#9ae6b4' : '#63b3ed'}`,
  };

  return (
    <div style={bgStyle}>
      <div style={containerStyle}>
        <div style={cardStyle}>
          {/* Logo */}
          <div style={logoStyle}>
            <div style={logoBadgeStyle}>
              <FaStethoscope />
            </div>
            <h1 style={titleStyle}>Healthcare Hub</h1>
            <p style={subtitleStyle}>Connect & Share Health Updates</p>
          </div>

          {/* Message */}
          {message && <div style={messageStyle}>{message}</div>}

          {showVerification ? (
            <form onSubmit={handleVerifyOtp}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Verification Code</label>
                <input
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleInputChange}
                  placeholder="Enter code"
                  style={inputStyle}
                />
              </div>

              {verificationOtp && (
                <div style={{ marginBottom: '1rem', color: '#4a5568' }}>
                  Test OTP: <strong>{verificationOtp}</strong>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                style={buttonStyle}
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </button>

              <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#718096', fontSize: '0.9rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowVerification(false);
                    setForm((prev) => ({ ...prev, otp: '' }));
                  }}
                  style={{ ...toggleButtonStyle, padding: 0 }}
                >
                  Back to Registration
                </button>
              </div>
            </form>
          ) : isRegistering ? (
            <form onSubmit={handleRegister}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Password</label>
                <div style={passwordWrapperStyle}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder="At least 6 characters"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={togglePasswordStyle}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Confirm Password</label>
                <div style={passwordWrapperStyle}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    style={inputStyle}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={buttonStyle}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>

              <div style={{ margin: '1rem 0', borderTop: '1px solid #e2e8f0', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-0.7rem', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '0 0.75rem', color: '#718096', fontSize: '0.85rem' }}>
                  or
                </span>
              </div>

              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
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
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1.5rem',
                      background: '#ffffff',
                      color: '#1f2937',
                      fontWeight: '600',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      cursor: 'not-allowed',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Google login unavailable
                  </button>
                )}
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#718096', fontSize: '0.9rem' }}>
                Already have an account?
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setForm({ name: '', email: '', password: '', confirmPassword: '', otp: '' });
                  }}
                  style={toggleButtonStyle}
                >
                  Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>
                  <FaEnvelope style={{ marginRight: '0.5rem' }} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>
                  <FaLock style={{ marginRight: '0.5rem' }} />
                  Password
                </label>
                <div style={passwordWrapperStyle}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={togglePasswordStyle}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={buttonStyle}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              <div style={{ margin: '1rem 0', borderTop: '1px solid #e2e8f0', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-0.7rem', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '0 0.75rem', color: '#718096', fontSize: '0.85rem' }}>
                  or
                </span>
              </div>

              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
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
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1.5rem',
                      background: '#ffffff',
                      color: '#1f2937',
                      fontWeight: '600',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      cursor: 'not-allowed',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Google login unavailable
                  </button>
                )}
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#718096', fontSize: '0.9rem' }}>
                Don't have an account?
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setForm({ name: '', email: '', password: '', confirmPassword: '', otp: '' });
                  }}
                  style={toggleButtonStyle}
                >
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
