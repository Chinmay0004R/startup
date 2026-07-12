import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaStethoscope, FaEye, FaEyeSlash } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const Login = ({ setCurrentRole, setCurrentUserEmail, setAuthToken }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const showNotification = (msg, type = 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
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
      
      // Redirect to role setup for profile completion
      setTimeout(() => navigate('/role-setup'), 500);
    } catch (error) {
      showNotification('Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
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
    boxShadow: 'none',
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
    marginTop: '0.5rem',
    opacity: isLoading ? 0.7 : 1,
    pointerEvents: isLoading ? 'none' : 'auto',
  };

  const toggleLinkStyle = {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#718096',
    fontSize: '0.95rem',
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
            <p style={subtitleStyle}>Connect, Share, Heal Together</p>
          </div>

          {/* Message */}
          {message && <div style={messageStyle}>{message}</div>}

          {/* Role Selection - only show in register mode */}
          {isRegistering && !showVerification && (
            <>
              <p style={{ color: '#4a5568', marginBottom: '0.75rem', fontWeight: '500' }}>I am a:</p>
              <div style={roleButtonsStyle}>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  style={roleButtonStyle(role === 'doctor')}
                >
                  <FaStethoscope /> Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  style={roleButtonStyle(role === 'patient')}
                >
                  <FaUser /> Patient
                </button>
              </div>
            </>
          )}

          {/* Forms */}
          {showVerification ? (
            // OTP Verification Form
            <form onSubmit={handleVerifyOtp}>
              <h2 style={{ ...titleStyle, fontSize: '1.5rem', marginBottom: '1rem' }}>Verify Email</h2>
              <p style={{ color: '#718096', marginBottom: '1.5rem' }}>Enter the code sent to {form.email}</p>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Verification Code</label>
                <input
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleInputChange}
                  placeholder="000000"
                  maxLength="6"
                  style={inputStyle}
                />
              </div>

              <button type="submit" style={buttonStyle} disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </button>

              <div style={toggleLinkStyle}>
                <button
                  type="button"
                  onClick={() => setShowVerification(false)}
                  style={toggleButtonStyle}
                >
                  Back
                </button>
              </div>
            </form>
          ) : isRegistering ? (
            // Register Form
            <form onSubmit={handleRegister}>
              <h2 style={{ ...titleStyle, fontSize: '1.5rem', marginBottom: '1rem' }}>Create Account</h2>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Dr. John Doe"
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
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
                    placeholder="Confirm your password"
                    style={inputStyle}
                  />
                </div>
              </div>

              <button type="submit" style={buttonStyle} disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div style={toggleLinkStyle}>
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
            // Login Form
            <form onSubmit={handleLogin}>
              <h2 style={{ ...titleStyle, fontSize: '1.5rem', marginBottom: '1rem' }}>Welcome Back</h2>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
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
                    placeholder="Enter your password"
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

              <button type="submit" style={buttonStyle} disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              <div style={toggleLinkStyle}>
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
