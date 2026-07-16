import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStethoscope, FaUser } from 'react-icons/fa';
import { setUserRole } from '../services/api';

const RoleSetup = ({ setCurrentRole }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) {
      alert('Please select your role');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await setUserRole(selectedRole, token);
      
      if (response && response.access_token) {
        localStorage.setItem('authToken', response.access_token);
        localStorage.setItem('currentRole', selectedRole);
        setCurrentRole(selectedRole);

        if (selectedRole === 'doctor') {
          navigate('/doctor-setup');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert('Failed to set role. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to set role. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="setup-bg">
      <div className="setup-wrapper">
        <div className="setup-card">
          <h1 className="setup-title">Choose Your Role</h1>
          <p className="setup-subtitle">Let us know who you are so we can customize your experience</p>

          <div className="role-options">
            <button
              type="button"
              className={`role-card ${selectedRole === 'patient' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('patient')}
            >
              <FaUser className="role-card-icon" />
              <div className="role-card-title">User</div>
              <div className="role-card-desc">Find doctors & share health updates</div>
            </button>

            <button
              type="button"
              className={`role-card ${selectedRole === 'doctor' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('doctor')}
            >
              <FaStethoscope className="role-card-icon" />
              <div className="role-card-title">Doctor</div>
              <div className="role-card-desc">Share credentials & expertise</div>
            </button>
          </div>

          <button
            type="button"
            className="auth-button"
            disabled={!selectedRole || isSubmitting}
            onClick={handleContinue}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => window.history.back()}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSetup;
