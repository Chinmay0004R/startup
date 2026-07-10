import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createDoctor, fetchDoctors } from '../services/api';
import { FaUserMd, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    name: '',
    specialty: '',
    email: '',
    hospital: '',
    registration_number: '',
    clinic_address: '',
    years_experience: 0,
    certification: '',
    bio: '',
    availability: '',
    verified: false,
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (error) {
      setStatus('Unable to load doctors right now.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        years_experience: Number(form.years_experience),
      };
      const created = await createDoctor(payload);
      setDoctors((current) => [created, ...current]);
      setStatus(`Doctor registered: ${created.name}`);
      setForm({
        name: '',
        specialty: '',
        email: '',
        hospital: '',
        registration_number: '',
        clinic_address: '',
        years_experience: 0,
        certification: '',
        bio: '',
        availability: '',
        verified: false,
      });
    } catch (error) {
      setStatus('Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mainStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
  };

  const headerSectionStyle = {
    marginBottom: '3rem',
    animation: 'fadeInUp 0.6s ease-out',
  };

  const headerBoxStyle = {
    borderRadius: '1.875rem',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    background: 'linear-gradient(to bottom right, rgba(7, 89, 133, 0.4), rgba(2, 6, 23, 1))',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
  };

  const headerHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  };

  const badgeStyle = {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
    color: '#60a5fa',
  };

  const headerTitleStyle = {
    fontSize: 'clamp(2rem, 4vw, 2.25rem)',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '0.75rem',
  };

  const headerDescriptionStyle = {
    color: '#cbd5e1',
  };

  const statusBarStyle = (isSuccess) => ({
    marginBottom: '1.5rem',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: `1px solid rgba(${isSuccess ? '16, 185, 129' : '251, 146, 60'}, 0.3)`,
    backgroundColor: `rgba(${isSuccess ? '16, 185, 129' : '251, 146, 60'}, 0.1)`,
    color: isSuccess ? '#86efac' : '#fed7aa',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  });

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '1.5rem',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  };

  const formCardStyle = {
    borderRadius: '1rem',
    border: '1px solid rgba(71, 85, 105, 0.3)',
    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.6))',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  };

  const formTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1.5rem',
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #475569',
    borderRadius: '0.5rem',
    backgroundColor: '#1a2941',
    color: '#f1f5f9',
    fontFamily: 'inherit',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '100px',
    gridColumn: '1 / -1',
  };

  const checkboxLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    border: '1px solid rgba(71, 85, 105, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '0.5rem',
  };

  const checkboxStyle = {
    width: '1rem',
    height: '1rem',
    borderRadius: '0.25rem',
    border: '1px solid #475569',
    backgroundColor: '#1a2941',
    cursor: 'pointer',
    accentColor: '#2563eb',
  };

  const checkboxLabelTextStyle = {
    fontSize: '0.875rem',
    color: '#cbd5e1',
  };

  const submitButtonStyle = {
    width: '100%',
    marginTop: '1.5rem',
    padding: '0.625rem 1.5rem',
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)',
  };

  const doctorsListCardStyle = {
    ...formCardStyle,
  };

  const listTitleStyle = {
    ...formTitleStyle,
  };

  const doctorItemStyle = {
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(71, 85, 105, 0.3)',
    backgroundColor: 'rgba(30, 41, 59, 0.2)',
    transition: 'all 0.2s ease',
    marginBottom: '0.75rem',
  };

  const doctorNameStyle = {
    fontWeight: '600',
    color: 'white',
    marginBottom: '0.25rem',
  };

  const specialtyStyle = {
    fontSize: '0.75rem',
    color: '#60a5fa',
  };

  const hospitalStyle = {
    fontSize: '0.75rem',
    color: '#64748b',
    marginTop: '0.25rem',
  };

  const verifiedBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    borderRadius: '9999px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#86efac',
  };

  const emptyMessageStyle = {
    textAlign: 'center',
    paddingTop: '2rem',
    paddingBottom: '2rem',
    color: '#64748b',
    fontSize: '0.875rem',
  };

  const scrollableListStyle = {
    maxHeight: '24rem',
    overflowY: 'auto',
  };

  return (
    <div>
      <Navbar />
      <main style={mainStyle}>
        {/* Header */}
        <section style={headerSectionStyle}>
          <div style={headerBoxStyle}>
            <div style={headerHeaderStyle}>
              <FaUserMd style={{ fontSize: '1.5rem', color: '#60a5fa' }} />
              <span style={badgeStyle}>Doctor Portal</span>
            </div>
            <h2 style={headerTitleStyle}>Doctor Registration</h2>
            <p style={headerDescriptionStyle}>Create a verified profile and build trust with patients and peers in our network.</p>
          </div>
        </section>

        {/* Status messages */}
        {status && (
          <div style={statusBarStyle(status.includes('registered'))}>
            {status.includes('registered') ? (
              <FaCheckCircle />
            ) : (
              <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
            )}
            {status}
          </div>
        )}

        {/* Form and List */}
        <div style={gridContainerStyle}>
          {/* Registration Form */}
          <form onSubmit={handleSubmit} style={formCardStyle}>
            <h3 style={formTitleStyle}>Register as Doctor</h3>

            <div style={formGridStyle}>
              <input
                style={inputStyle}
                placeholder="Full name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
              <input
                style={inputStyle}
                placeholder="Specialty"
                value={form.specialty}
                onChange={(event) => setForm({ ...form, specialty: event.target.value })}
                required
              />
            </div>

            <div style={formGridStyle}>
              <input
                style={inputStyle}
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
              <input
                style={inputStyle}
                placeholder="Registration number"
                value={form.registration_number}
                onChange={(event) => setForm({ ...form, registration_number: event.target.value })}
              />
            </div>

            <div style={formGridStyle}>
              <input
                style={inputStyle}
                placeholder="Hospital / Clinic"
                value={form.hospital}
                onChange={(event) => setForm({ ...form, hospital: event.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Clinic address"
                value={form.clinic_address}
                onChange={(event) => setForm({ ...form, clinic_address: event.target.value })}
              />
            </div>

            <div style={formGridStyle}>
              <input
                style={inputStyle}
                type="number"
                placeholder="Years of experience"
                value={form.years_experience}
                onChange={(event) => setForm({ ...form, years_experience: event.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Medical certification / license"
                value={form.certification}
                onChange={(event) => setForm({ ...form, certification: event.target.value })}
              />
            </div>

            <textarea
              style={textareaStyle}
              placeholder="Professional biography"
              rows="3"
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
            />

            <input
              style={{ ...inputStyle, gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '1rem' }}
              placeholder="Availability (e.g. Mon-Fri, 9am-5pm)"
              value={form.availability}
              onChange={(event) => setForm({ ...form, availability: event.target.value })}
            />

            <label style={checkboxLabelStyle}>
              <input
                type="checkbox"
                checked={form.verified}
                onChange={(event) => setForm({ ...form, verified: event.target.checked })}
                style={checkboxStyle}
              />
              <span style={checkboxLabelTextStyle}>Mark as verified doctor</span>
            </label>

            <button
              style={submitButtonStyle}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating profile...' : 'Create Doctor Profile'}
            </button>
          </form>

          {/* Doctors List */}
          <div style={doctorsListCardStyle}>
            <h3 style={listTitleStyle}>Registered Doctors</h3>
            <div style={scrollableListStyle}>
              {doctors.length === 0 ? (
                <p style={emptyMessageStyle}>No doctors registered yet</p>
              ) : (
                doctors.map((doctor) => (
                  <div key={doctor.id} style={doctorItemStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <p style={doctorNameStyle}>{doctor.name}</p>
                        <p style={specialtyStyle}>{doctor.specialty}</p>
                      </div>
                      {doctor.verified && <span style={verifiedBadgeStyle}>
                        <FaCheckCircle style={{ fontSize: '0.75rem' }} />
                        Verified
                      </span>}
                    </div>
                    <p style={hospitalStyle}>{doctor.hospital || 'Pending verification'}</p>
                    {doctor.registration_number && <p style={{ ...hospitalStyle, marginTop: '0.25rem' }}>Reg. no: {doctor.registration_number}</p>}
                    {doctor.certification && <p style={{ ...hospitalStyle, marginTop: '0.25rem' }}>Cert: {doctor.certification}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </main>
      <Footer />
    </div>
  );
};

export default Doctors;
