import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createComplaint, fetchComplaints, fetchDoctors } from '../services/api';
import { FaSearch, FaStethoscope, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const Support = () => {
  const [doctors, setDoctors] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [complaintForm, setComplaintForm] = useState({ reporter_name: '', category: '', details: '' });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [doctorData, complaintData] = await Promise.all([fetchDoctors(), fetchComplaints()]);
      setDoctors(doctorData);
      setComplaints(complaintData);
    } catch (error) {
      setMessage('Unable to load doctor information right now.');
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;

    const searchableText = [
      doctor.name,
      doctor.specialty,
      doctor.hospital,
      doctor.clinic_address,
      doctor.certification,
      doctor.bio,
      doctor.availability,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(query);
  });

  const handleComplaintSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await createComplaint(complaintForm);
      setComplaints((current) => [created, ...current]);
      setMessage('Complaint submitted successfully for review.');
      setComplaintForm({ reporter_name: '', category: '', details: '' });
    } catch (error) {
      setMessage('Complaint submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionStyle = {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: '1fr 0.9fr',
    marginBottom: '3rem',
  };

  const infoCardStyle = {
    padding: '2rem',
    marginBottom: '0.5rem',
  };

  const headerStyle = {
    padding: '2rem',
    borderRadius: '2rem',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    background: 'linear-gradient(135deg, rgba(15, 38, 90, 0.75), rgba(7, 20, 45, 0.95))',
    backdropFilter: 'blur(14px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    marginBottom: '2rem',
  };

  const cardBodyStyle = {
    display: 'grid',
    gap: '1rem',
    maxHeight: '24rem',
    overflowY: 'auto',
  };

  const selectionButtonStyle = (isSelected) => ({
    width: '100%',
    textAlign: 'left',
    padding: '1rem',
    borderRadius: '1rem',
    border: '1px solid rgba(71, 85, 105, 0.3)',
    transition: 'all 0.2s ease',
    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(15, 23, 42, 0.8)',
    borderColor: isSelected ? 'rgba(59, 130, 246, 0.5)' : 'rgba(71, 85, 105, 0.3)',
    color: '#f8fafc',
    cursor: 'pointer',
  });

  const highlightStyle = {
    color: '#93c5fd',
  };

  const clampStyle = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <section style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <FaStethoscope style={{ fontSize: '1.5rem', color: '#60a5fa' }} />
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: '#93c5fd' }}>
              User Portal
            </span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
            Find & Review Doctors
          </h2>
          <p style={{ color: '#cbd5e1' }}>
            Discover verified medical professionals, view their credentials, and submit feedback securely.
          </p>
        </section>

        {message && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: '0.9rem',
            border: `1px solid ${message.includes('successfully') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(251, 146, 60, 0.3)'}`,
            backgroundColor: message.includes('successfully') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 146, 60, 0.12)',
            color: message.includes('successfully') ? '#86efac' : '#fed7aa',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            {message.includes('successfully') ? <FaCheckCircle /> : <FaExclamationTriangle />}
            {message}
          </div>
        )}

        <section style={sectionStyle}>
          <div className="card" style={{ ...infoCardStyle, padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FaSearch style={{ color: '#60a5fa' }} /> Find a Doctor
            </h3>
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <FaSearch style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#64748b' }} />
              <input
                className="input-field"
                style={{ paddingLeft: '3rem' }}
                placeholder="Search by name, specialty, clinic, or certificate..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div style={cardBodyStyle}>
              {filteredDoctors.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8', fontSize: '0.95rem' }}>
                  No doctors found matching your search
                </p>
              ) : (
                filteredDoctors.map((doctor) => (
                  <button
                    type="button"
                    key={doctor.id}
                    style={selectionButtonStyle(selectedDoctor?.id === doctor.id)}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                      <p style={{ margin: 0, fontWeight: 600, color: '#f8fafc' }}>{doctor.name}</p>
                      {doctor.verified ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(16, 185, 129, 0.12)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          padding: '0.25rem 0.6rem',
                          fontSize: '0.75rem',
                          color: '#86efac',
                        }}>
                          <FaCheckCircle style={{ fontSize: '0.75rem' }} /> Verified
                        </span>
                      ) : null}
                    </div>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#93c5fd', fontSize: '0.95rem' }}>{doctor.specialty}</p>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>{doctor.hospital || 'Pending verification'}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="card" style={{ ...infoCardStyle, padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.5rem' }}>Doctor Profile</h3>
            {selectedDoctor ? (
              <div style={{ display: 'grid', gap: '1rem', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(71, 85, 105, 0.3)' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '1rem',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <FaStethoscope style={{ color: '#60a5fa' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#f8fafc' }}>{selectedDoctor.name}</p>
                    <p style={{ margin: 0, color: '#93c5fd', fontSize: '0.8rem' }}>{selectedDoctor.specialty}</p>
                  </div>
                </div>

                <div>
                  <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Hospital</p>
                  <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.95rem' }}>{selectedDoctor.hospital || 'Pending verification'}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Experience</p>
                    <p style={{ margin: 0, color: '#cbd5e1' }}>{selectedDoctor.years_experience || 0} years</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Status</p>
                    <p style={{ margin: 0, color: selectedDoctor.verified ? '#86efac' : '#fbbf24' }}>{selectedDoctor.verified ? 'Verified' : 'Pending'}</p>
                  </div>
                </div>

                <div>
                  <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>License</p>
                  <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem' }}>{selectedDoctor.certification || 'Not uploaded'}</p>
                </div>

                <div>
                  <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>About</p>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{selectedDoctor.bio || 'Profile details pending'}</p>
                </div>

                <div>
                  <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Availability</p>
                  <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.9rem' }}>{selectedDoctor.availability || 'To be confirmed'}</p>
                </div>
              </div>
            ) : (
              <p style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8', fontSize: '0.95rem' }}>
                Select a doctor to view their complete profile
              </p>
            )}
          </div>
        </section>

        <section style={sectionStyle}>
          <div className="card" style={{ ...infoCardStyle, padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FaExclamationTriangle style={{ color: '#fbbf24' }} /> Submit Feedback
            </h3>
            <form onSubmit={handleComplaintSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <input
                className="input-field"
                placeholder="Your name"
                value={complaintForm.reporter_name}
                onChange={(event) => setComplaintForm({ ...complaintForm, reporter_name: event.target.value })}
                required
              />
              <input
                className="input-field"
                placeholder="Category (e.g., Safety, Service, Other)"
                value={complaintForm.category}
                onChange={(event) => setComplaintForm({ ...complaintForm, category: event.target.value })}
                required
              />
              <textarea
                className="textarea-field"
                placeholder="Describe your concern or feedback..."
                rows="4"
                value={complaintForm.details}
                onChange={(event) => setComplaintForm({ ...complaintForm, details: event.target.value })}
                required
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting}
                style={{ width: '100%' }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>

          <div className="card" style={{ ...infoCardStyle, padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.5rem' }}>
              Recent Feedback
            </h3>
            <div style={{ display: 'grid', gap: '1rem', maxHeight: '20rem', overflowY: 'auto' }}>
              {complaints.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem 0', color: '#94a3b8', fontSize: '0.95rem' }}>
                  No feedback submitted yet
                </p>
              ) : (
                complaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    style={{
                      padding: '1rem',
                      borderRadius: '1rem',
                      border: '1px solid rgba(71, 85, 105, 0.3)',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                      <p style={{ margin: 0, fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>{complaint.reporter_name}</p>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(251, 146, 60, 0.12)',
                        border: '1px solid rgba(251, 146, 60, 0.3)',
                        color: '#fbbf24',
                      }}>
                        {complaint.category}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, ...clampStyle }}>
                      {complaint.details}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
