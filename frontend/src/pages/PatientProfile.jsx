import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaUserCircle, FaPencilAlt } from 'react-icons/fa';

const PatientProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    medical_history: '',
    emergency_contact: '',
  });
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('currentUserEmail');
    if (storedEmail) {
      setProfile((current) => ({ ...current, email: storedEmail }));
    }
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatus('Saving your patient profile...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStatus('Your profile has been updated.');
    } catch (error) {
      setStatus('Unable to update your profile right now.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <section style={{
          borderRadius: '1.875rem',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          background: 'linear-gradient(to bottom right, rgba(7, 89, 133, 0.4), rgba(2, 6, 23, 1))',
          padding: '2rem',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div>
              <p style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#60a5fa',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}>Patient Profile</p>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'white', margin: 0 }}>Edit your patient details</h1>
              <p style={{ color: '#cbd5e1', marginTop: '1rem' }}>
                Keep your contact and medical information current so providers can deliver better care.
              </p>
            </div>
            <FaUserCircle style={{ fontSize: '3rem', color: '#60a5fa' }} />
          </div>
        </section>

        {status && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: '1rem',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            color: '#cbd5e1',
          }}>
            {status}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'grid', gap: '1rem' }}>
          <input
            value={profile.name}
            onChange={(event) => setProfile({ ...profile, name: event.target.value })}
            placeholder="Full name"
            className="input-field"
            required
          />
          <input
            type="email"
            value={profile.email}
            onChange={(event) => setProfile({ ...profile, email: event.target.value })}
            placeholder="Email address"
            className="input-field"
            required
          />
          <input
            value={profile.contact}
            onChange={(event) => setProfile({ ...profile, contact: event.target.value })}
            placeholder="Contact phone"
            className="input-field"
          />
          <input
            value={profile.address}
            onChange={(event) => setProfile({ ...profile, address: event.target.value })}
            placeholder="Home address"
            className="input-field"
          />
          <textarea
            value={profile.medical_history}
            onChange={(event) => setProfile({ ...profile, medical_history: event.target.value })}
            placeholder="Medical history"
            className="textarea-field"
            rows={5}
          />
          <input
            value={profile.emergency_contact}
            onChange={(event) => setProfile({ ...profile, emergency_contact: event.target.value })}
            placeholder="Emergency contact"
            className="input-field"
          />
          <button
            type="submit"
            disabled={isSaving}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: 'white',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {isSaving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default PatientProfile;
