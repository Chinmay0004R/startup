import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaStethoscope, FaUser } from 'react-icons/fa';

const Login = ({ setCurrentRole, currentRole }) => {
  const [role, setRole] = useState('doctor');
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setMessage('Please enter both email and password.');
      return;
    }

    const normalizedRole = role === 'doctor' ? 'doctor' : 'user';
    setCurrentRole(normalizedRole);
    setMessage(`${normalizedRole === 'doctor' ? 'Doctor' : 'User'} login successful.`);

    if (normalizedRole === 'doctor') {
      navigate('/doctors');
    } else {
      navigate('/support');
    }
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
            Welcome back
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Sign in as a doctor or patient user
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
          <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
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
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <button 
              className="btn btn-primary" 
              type="submit"
              style={{ width: '100%' }}
            >
              Sign in as {role === 'doctor' ? 'Doctor' : 'Patient'}
            </button>
          </form>

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
          Demo credentials: Any email and password
        </p>
      </div>
    </div>
  );
};

export default Login;
