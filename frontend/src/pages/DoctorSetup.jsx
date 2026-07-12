import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStethoscope, FaUpload, FaCheckCircle, FaUsers, FaShieldAlt, FaAward } from 'react-icons/fa';

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

  const sectionTitleStyle = {
    margin: 0,
    fontSize: '1rem',
    color: '#1a202c',
    fontWeight: 700,
  };

  const messageStyle = {
    marginBottom: '1.5rem',
    padding: '1rem 1.25rem',
    borderRadius: '1rem',
    background: messageType === 'success' ? '#ecfdf5' : '#fef2f2',
    color: messageType === 'success' ? '#065f46' : '#991b1b',
    border: `1px solid ${messageType === 'success' ? '#a7f3d0' : '#fecaca'}`,
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

  const followers = [
    { id: 1, name: 'Dr. Amit Patel', role: 'Cardiologist', since: '2d ago' },
    { id: 2, name: 'Sneha Kumar', role: 'Patient', since: '4d ago' },
    { id: 3, name: 'Dr. Anjali Mehta', role: 'Oncologist', since: '1w ago' },
    { id: 4, name: 'Rohit Sharma', role: 'Patient', since: '1w ago' },
    { id: 5, name: 'Dr. Neha Roy', role: 'Pediatrician', since: '2w ago' },
  ];

  const verificationStatus = [
    { id: 1, label: 'Identity Verified', active: true },
    { id: 2, label: 'NMC Verified', active: true },
    { id: 3, label: 'Degree Verified', active: true },
    { id: 4, label: 'Hospital Verified', active: false },
  ];

  const achievements = [
    { id: 1, title: 'Top Doctor 2025' },
    { id: 2, title: 'Patient Care Excellence' },
    { id: 3, title: 'Medical Innovation Award' },
  ];

  const pageContainerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1.5rem',
  };

  const contentStyle = {
    width: '100%',
    maxWidth: '1200px',
  };

  const layoutStyle = {
    display: 'grid',
    gridTemplateColumns: '72% 28%',
    gap: '1.5rem',
  };

  const setupCardStyle = {
    background: 'rgba(255, 255, 255, 0.96)',
    borderRadius: '1.5rem',
    padding: '2rem',
    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.18)',
    border: '1px solid rgba(255,255,255,0.35)',
  };

  const rightCardStyle = {
    display: 'grid',
    gap: '1.5rem',
  };

  const sidebarCardStyle = {
    background: 'rgba(255, 255, 255, 0.94)',
    borderRadius: '1.4rem',
    padding: '1.5rem',
    boxShadow: '0 18px 40px rgba(0, 0, 0, 0.14)',
    border: '1px solid rgba(229, 231, 235, 0.6)',
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    marginBottom: '1rem',
  };

  const sectionSubtitleStyle = {
    margin: 0,
    color: '#4a5568',
    fontSize: '0.95rem',
  };

  const followersListStyle = {
    display: 'grid',
    gap: '0.85rem',
  };

  const followerRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.9rem 1rem',
    borderRadius: '1rem',
    background: '#f8fafc',
    border: '1px solid rgba(226,232,240,0.8)',
  };

  const followerNameStyle = {
    margin: 0,
    fontWeight: 700,
    color: '#1a202c',
  };

  const followerRoleStyle = {
    margin: '0.25rem 0 0',
    color: '#718096',
    fontSize: '0.9rem',
  };

  const followerSinceStyle = {
    color: '#4a5568',
    fontSize: '0.88rem',
  };

  const viewAllButtonStyle = {
    width: '100%',
    padding: '0.95rem 1rem',
    borderRadius: '0.95rem',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '1rem',
  };

  const statusRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.85rem 1rem',
    borderRadius: '1rem',
    background: '#f7fafc',
    border: '1px solid rgba(226,232,240,0.8)',
  };

  const statusLabelStyle = {
    color: '#1a202c',
    fontWeight: 600,
  };

  const pillStyle = {
    padding: '0.3rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.78rem',
    fontWeight: 700,
  };

  const achievementRowStyle = {
    padding: '0.9rem 1rem',
    borderRadius: '1rem',
    background: '#f8fafc',
    border: '1px solid rgba(226,232,240,0.8)',
  };

  const achievementTitleStyle = {
    margin: 0,
    color: '#1a202c',
    fontWeight: 700,
  };

  return (
    <div style={pageContainerStyle}>
      <div style={contentStyle}>
        <div style={layoutStyle}>
          <section style={setupCardStyle}>
            <div style={sectionHeaderStyle}>
              <FaStethoscope style={{ color: '#667eea', fontSize: '1.25rem' }} />
              <div>
                <h1 style={titleStyle}>Professional Profile</h1>
                <p style={subtitleStyle}>Add your professional credentials to complete your doctor profile</p>
              </div>
            </div>

            {message && <div style={messageStyle}>{message}</div>}

            <form onSubmit={handleSubmit}>
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

              <div style={buttonGroupStyle}>
                <button type="submit" disabled={isLoading} style={submitButtonStyle}>
                  {isLoading ? 'Saving...' : '✓ Complete'}
                </button>
                <button type="button" onClick={handleSkip} style={skipButtonStyle}>
                  Skip for Now
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#718096', textAlign: 'center', marginTop: '1rem' }}>
                You can update this information later in your profile settings
              </p>
            </form>
          </section>

          <aside style={rightCardStyle}>
            <section style={sidebarCardStyle}>
              <div style={sectionHeaderStyle}>
                <FaUsers style={{ color: '#667eea', fontSize: '1.1rem' }} />
                <div>
                  <h2 style={sectionTitleStyle}>Followers</h2>
                  <p style={sectionSubtitleStyle}>Recent followers on your profile</p>
                </div>
              </div>
              <div style={followersListStyle}>
                {followers.map((follower) => (
                  <div key={follower.id} style={followerRowStyle}>
                    <div>
                      <p style={followerNameStyle}>{follower.name}</p>
                      <p style={followerRoleStyle}>{follower.role}</p>
                    </div>
                    <span style={followerSinceStyle}>{follower.since}</span>
                  </div>
                ))}
              </div>
              <button type="button" style={viewAllButtonStyle}>
                View all followers
              </button>
            </section>

            <section style={sidebarCardStyle}>
              <div style={sectionHeaderStyle}>
                <FaShieldAlt style={{ color: '#667eea', fontSize: '1.1rem' }} />
                <div>
                  <h2 style={sectionTitleStyle}>Verification Status</h2>
                  <p style={sectionSubtitleStyle}>Keep your profile trusted and complete</p>
                </div>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {verificationStatus.map((status) => (
                  <div key={status.id} style={statusRowStyle}>
                    <span style={statusLabelStyle}>{status.label}</span>
                    <span style={{
                      ...pillStyle,
                      background: status.active ? '#d1fae5' : '#fef3c7',
                      color: status.active ? '#166534' : '#92400e',
                    }}>
                      {status.active ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section style={sidebarCardStyle}>
              <div style={sectionHeaderStyle}>
                <FaAward style={{ color: '#667eea', fontSize: '1.1rem' }} />
                <div>
                  <h2 style={sectionTitleStyle}>Achievements</h2>
                  <p style={sectionSubtitleStyle}>Milestones and recognition</p>
                </div>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {achievements.map((achievement) => (
                  <div key={achievement.id} style={achievementRowStyle}>
                    <p style={achievementTitleStyle}>{achievement.title}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DoctorSetup;
