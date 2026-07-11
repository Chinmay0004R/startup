import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaStethoscope, FaUser } from 'react-icons/fa';
import { registerUser, verifyUser, loginUser } from '../services/api';

const Login = ({ setCurrentRole, currentRole }) => {
  const [role, setRole] = useState('doctor');
  const [form, setForm] = useState({ name: '', email: '', password: '', otp: '' });
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const resolveLoginRole = (emailValue, selectedRole) => {
    const normalizedEmail = (emailValue || '').toLowerCase().trim();

    if (selectedRole === 'doctor') {
      return 'doctor';
    }

    if (normalizedEmail.includes('doctor') || normalizedEmail.endsWith('@doctor.com') || normalizedEmail.endsWith('@doctortrust.com')) {
      return 'doctor';
    }

    return 'user';
  };

  const decodeJwtPayload = (token) => {
    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = decodeURIComponent(
        atob(base64)
          .split('')
          .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join('')
      );

      return JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to decode Google credential payload:', error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setMessage('Please enter both email and password.');
      return;
    }

    if (isRegistering) {
      if (!form.name) {
        setMessage('Please enter your name.');
        return;
      }

      try {
        const response = await registerUser({ name: form.name, email: form.email, password: form.password });
        setOtpSent(true);
        setMessage(`Verification code sent to ${form.email}. Please enter the OTP below.`);
        console.log('OTP:', response.otp);
      } catch (error) {
        setMessage(error.message || 'Registration failed.');
      }
      return;
    }

    try {
      const response = await loginUser({ email: form.email, password: form.password });
      const normalizedRole = resolveLoginRole(form.email, role);
      setCurrentRole(normalizedRole);
      setMessage(response.message || `${normalizedRole === 'doctor' ? 'Doctor' : 'User'} login successful.`);

      if (normalizedRole === 'doctor') {
        navigate('/doctors');
      } else {
        navigate('/support');
      }
    } catch (error) {
      setMessage(error.message || 'Login failed.');
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    if (!form.email || !form.otp) {
      setMessage('Please enter your email and OTP.');
      return;
    }

    try {
      const response = await verifyUser({ email: form.email, otp: form.otp });
      setIsRegistering(false);
      setOtpSent(false);
      setMessage(response.message || 'Email verified successfully. You can now log in.');
    } catch (error) {
      setMessage(error.message || 'Verification failed.');
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const token = credentialResponse?.credential;
    const payload = decodeJwtPayload(token);
    const email = payload?.email || '';
    const normalizedRole = resolveLoginRole(email, role);

    setCurrentRole(normalizedRole);
    setMessage(
      normalizedRole === 'doctor'
        ? 'Google doctor sign-in successful. Redirecting to the doctor portal.'
        : 'Google sign-in successful. Redirecting to the patient portal.'
    );

    if (normalizedRole === 'doctor') {
      navigate('/doctors');
    } else {
      navigate('/support');
    }
  };

  const handleGoogleError = () => {
    setMessage('Google sign-in failed. Please try again.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }} className="animate-fadeInUp">
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '1rem',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(37, 99, 235, 0.3)',
              color: 'white'
            }}>
              <FaStethoscope style={{ fontSize: '2rem' }} />
            </div>
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            DoctorTrust
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Secure medical network platform</p>
        </div>

        {/* Login Card */}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: '0.5rem'
          }}>
            Register now
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Create your account and verify your email to continue.
          </p>

          {/* Role Toggle */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            padding: '0.25rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(71, 85, 105, 0.4)',
            backgroundColor: 'rgba(15, 23, 42, 0.5)'
          }}>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                backgroundColor: role === 'doctor' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'transparent',
                background: role === 'doctor' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'transparent',
                color: role === 'doctor' ? 'white' : '#64748b'
              }}
            >
              <FaStethoscope /> Doctor
            </button>
            <button
              type="button"
              onClick={() => setRole('user')}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                backgroundColor: role === 'user' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'transparent',
                background: role === 'user' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'transparent',
                color: role === 'user' ? 'white' : '#64748b'
              }}
            >
              <FaUser /> Patient
            </button>
          </div>

          {/* Form */}
          <form onSubmit={isRegistering && otpSent ? handleVerifyOtp : handleSubmit} style={{ marginBottom: '1rem' }}>
            {isRegistering && !otpSent && (
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <FaUser style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '0.75rem',
                  color: '#64748b',
                  zIndex: 1
                }} />
                <input
                  className="input-field"
                  placeholder="Full name"
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            )}

            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <FaEnvelope style={{
                position: 'absolute',
                left: '0.75rem',
                top: '0.75rem',
                color: '#64748b',
                zIndex: 1
              }} />
              <input
                className="input-field"
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <FaLock style={{
                position: 'absolute',
                left: '0.75rem',
                top: '0.75rem',
                color: '#64748b',
                zIndex: 1
              }} />
              <input
                className="input-field"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {(isRegistering && otpSent) && (
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <FaLock style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '0.75rem',
                  color: '#64748b',
                  zIndex: 1
                }} />
                <input
                  className="input-field"
                  placeholder="Enter verification OTP"
                  type="text"
                  value={form.otp}
                  onChange={(event) => setForm({ ...form, otp: event.target.value })}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            )}

            <button 
              className="btn btn-primary" 
              type="submit"
              style={{ width: '100%', marginBottom: '0.75rem' }}
            >
              {isRegistering ? (otpSent ? 'Verify OTP' : 'Register') : 'Sign in'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setIsRegistering((prev) => !prev);
              setOtpSent(false);
              setMessage('');
            }}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(71, 85, 105, 0.4)',
              background: 'transparent',
              color: '#cbd5e1',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            {isRegistering ? 'Switch to Login' : 'Switch to Register'}
          </button>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(71, 85, 105, 0.4)' }} />
              <span style={{ color: '#64748b', fontSize: '0.8rem' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(71, 85, 105, 0.4)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="pill"
              />
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 500,
              marginBottom: '1rem',
              backgroundColor: message.includes('successful') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 146, 60, 0.1)',
              border: `1px solid ${message.includes('successful') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(251, 146, 60, 0.3)'}`,
              color: message.includes('successful') ? '#86efac' : '#fed7aa'
            }}>
              {message}
            </div>
          )}

          <p style={{
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#64748b'
          }}>
            <span style={{ fontWeight: 600 }}>Session:</span> {currentRole ? `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} logged in` : 'Not signed in'}
          </p>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#475569'
        }}>
          Only verified email accounts can log in. Use a valid email address to register and verify it first.
        </p>
      </div>
    </div>
  );
};

export default Login;
