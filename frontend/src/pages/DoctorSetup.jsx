import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStethoscope, FaUpload, FaCheckCircle } from 'react-icons/fa';

const DoctorSetup = ({ setCurrentRole }) => {
  const [form, setForm] = useState({
    specialization: '',
    hospital: '',
    yearsOfExperience: '',
    medicalLicense: '',
    certificate: null,
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

  const handleFileChange = (e) => {
    setForm(prev => ({ ...prev, certificate: e.target.files[0] }));
  };

  const handleSkip = () => {
    // Skip professional setup and go directly to dashboard
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!form.specialization.trim()) {
      showNotification('Please enter your specialization', 'error');
      setIsLoading(false);
      return;
    }

    if (!form.hospital.trim()) {
      showNotification('Please enter your hospital/clinic name', 'error');
      setIsLoading(false);
      return;
    }

    if (!form.yearsOfExperience) {
      showNotification('Please enter your years of experience', 'error');
      setIsLoading(false);
      return;
    }

    if (!form.medicalLicense.trim()) {
      showNotification('Please enter your medical license number', 'error');
      setIsLoading(false);
      return;
    }

    if (!form.certificate) {
      showNotification('Please upload your medical certificate', 'error');
      setIsLoading(false);
      return;
    }

    try {
      // For now, just store the data in localStorage
      // In a real app, you would upload the file and save to backend
      const certificateName = form.certificate.name;
      const fileSize = (form.certificate.size / (1024 * 1024)).toFixed(2); // Size in MB

      // Store doctor info
      const doctorInfo = {
        specialization: form.specialization,
        hospital: form.hospital,
        yearsOfExperience: parseInt(form.yearsOfExperience),
        medicalLicense: form.medicalLicense,
        certificateName: certificateName,
        certificateSize: fileSize,
        uploadedAt: new Date().toISOString(),
      };

      localStorage.setItem('doctorInfo', JSON.stringify(doctorInfo));
      localStorage.setItem('currentRole', 'doctor');
      setCurrentRole('doctor');

      showNotification('Professional profile saved successfully!', 'success');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      showNotification('Error saving professional info. Please try again.', 'error');
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
    maxWidth: '550px',
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
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const subtitleStyle = {
    color: '#718096',
    fontSize: '0.95rem',
    marginBottom: '2rem',
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

  const fileInputStyle = {
    display: 'block',
    width: '100%',
    padding: '1rem',
    border: '2px dashed #e2e8f0',
    borderRadius: '0.75rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: '#f7fafc',
  };

  const buttonGroupStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '2rem',
  };

  const submitButtonStyle = {
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

  const skipButtonStyle = {
    padding: '0.875rem 1.5rem',
    background: 'transparent',
    color: '#667eea',
    fontWeight: '600',
    border: '2px solid #667eea',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
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
          {/* Header */}
          <h1 style={titleStyle}>
            <FaStethoscope /> Professional Profile
          </h1>
          <p style={subtitleStyle}>
            Add your professional credentials to complete your doctor profile
          </p>

          {/* Message */}
          {message && <div style={messageStyle}>{message}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Specialization */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Medical Specialization *</label>
              <input
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={handleInputChange}
                placeholder="e.g., Cardiology, Pediatrics, Orthopedics"
                style={inputStyle}
              />
            </div>

            {/* Hospital */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Hospital / Clinic Name *</label>
              <input
                type="text"
                name="hospital"
                value={form.hospital}
                onChange={handleInputChange}
                placeholder="e.g., City Medical Center"
                style={inputStyle}
              />
            </div>

            {/* Years of Experience */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Years of Experience *</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={form.yearsOfExperience}
                onChange={handleInputChange}
                placeholder="5"
                min="0"
                max="70"
                style={inputStyle}
              />
            </div>

            {/* Medical License */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Medical License Number *</label>
              <input
                type="text"
                name="medicalLicense"
                value={form.medicalLicense}
                onChange={handleInputChange}
                placeholder="e.g., DMC/2024/001234"
                style={inputStyle}
              />
            </div>

            {/* Certificate Upload */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Medical Certificate / Degree *</label>
              <label style={fileInputStyle}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  style={{ display: 'none' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <FaUpload style={{ fontSize: '1.5rem', color: '#667eea' }} />
                  <span style={{ color: '#667eea', fontWeight: '600' }}>
                    {form.certificate ? form.certificate.name : 'Click to upload certificate'}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#718096' }}>
                    PDF, JPG, PNG, DOC up to 10MB
                  </span>
                </div>
              </label>
            </div>

            {/* Buttons */}
            <div style={buttonGroupStyle}>
              <button
                type="submit"
                disabled={isLoading}
                style={submitButtonStyle}
              >
                {isLoading ? 'Saving...' : '✓ Complete'}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                style={skipButtonStyle}
              >
                Skip for Now
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#718096', textAlign: 'center', marginTop: '1rem' }}>
              You can update this information later in your profile settings
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorSetup;
