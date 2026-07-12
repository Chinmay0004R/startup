import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStethoscope, FaUser } from 'react-icons/fa';

const RoleSetup = ({ setCurrentRole }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedRole) {
      alert('Please select your role');
      return;
    }

    localStorage.setItem('currentRole', selectedRole);
    setCurrentRole(selectedRole);

    // If doctor, go to professional setup
    if (selectedRole === 'doctor') {
      navigate('/doctor-setup');
    } else {
      // If user, go directly to dashboard
      navigate('/dashboard');
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
    maxWidth: '500px',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
  };

  const titleStyle = {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '0.5rem',
    textAlign: 'center',
  };

  const subtitleStyle = {
    color: '#718096',
    fontSize: '0.95rem',
    textAlign: 'center',
    marginBottom: '2rem',
  };

  const optionsGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const cardOptionStyle = (isSelected) => ({
    padding: '2rem',
    border: isSelected ? 'none' : '2px solid #e2e8f0',
    borderRadius: '1rem',
    background: isSelected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f7fafc',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    boxShadow: isSelected ? '0 10px 30px rgba(102, 126, 234, 0.3)' : 'none',
  });

  const iconStyle = (isSelected) => ({
    fontSize: '3.5rem',
    marginBottom: '1rem',
    color: isSelected ? 'white' : '#667eea',
  });

  const labelStyle = (isSelected) => ({
    fontSize: '1.25rem',
    fontWeight: '700',
    color: isSelected ? 'white' : '#1a202c',
  });

  const descriptionStyle = (isSelected) => ({
    fontSize: '0.85rem',
    color: isSelected ? 'rgba(255,255,255,0.8)' : '#718096',
    marginTop: '0.5rem',
  });

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
    opacity: selectedRole ? 1 : 0.5,
    pointerEvents: selectedRole ? 'auto' : 'none',
  };

  const backButtonStyle = {
    width: '100%',
    padding: '0.75rem 1.5rem',
    background: 'transparent',
    color: '#667eea',
    fontWeight: '600',
    border: '2px solid #667eea',
    borderRadius: '0.75rem',
    fontSize: '0.95rem',
    cursor: 'pointer',
    marginBottom: '1rem',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={bgStyle}>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Choose Your Role</h1>
          <p style={subtitleStyle}>
            Let us know who you are so we can customize your experience
          </p>

          <div style={optionsGridStyle}>
            {/* User Option */}
            <div
              onClick={() => setSelectedRole('patient')}
              style={cardOptionStyle(selectedRole === 'patient')}
            >
              <div style={iconStyle(selectedRole === 'patient')}>
                <FaUser />
              </div>
              <div style={labelStyle(selectedRole === 'patient')}>User</div>
              <div style={descriptionStyle(selectedRole === 'patient')}>
                Find doctors & share health updates
              </div>
            </div>

            {/* Doctor Option */}
            <div
              onClick={() => setSelectedRole('doctor')}
              style={cardOptionStyle(selectedRole === 'doctor')}
            >
              <div style={iconStyle(selectedRole === 'doctor')}>
                <FaStethoscope />
              </div>
              <div style={labelStyle(selectedRole === 'doctor')}>Doctor</div>
              <div style={descriptionStyle(selectedRole === 'doctor')}>
                Share credentials & expertise
              </div>
            </div>
          </div>

          <button onClick={handleContinue} style={buttonStyle}>
            Continue
          </button>

          <button
            onClick={() => window.history.back()}
            style={backButtonStyle}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSetup;
