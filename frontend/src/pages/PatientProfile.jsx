import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaUserCircle, FaPencilAlt } from 'react-icons/fa';
import DangerZone from '../components/DangerZone';

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
    setStatus('Saving your user profile...');

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
      <main className="page-panel" style={{ maxWidth: '900px' }}>
        <section className="hero-panel">
          <div className="card-header-inline">
            <div>
              <p className="text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>User Profile</p>
              <h1 className="hero-title">Edit your user details</h1>
              <p className="text-muted">Keep your contact and medical information current so providers can deliver better care.</p>
            </div>
            <FaUserCircle className="hero-icon" style={{ fontSize: '3rem' }} />
          </div>
        </section>

        {status && (
          <div className="status-banner">
            {status}
          </div>
        )}

        <form onSubmit={handleSave} className="form-grid">
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
            className="textarea-block"
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
            className="button-full button-primary"
          >
            {isSaving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
        <DangerZone />
      </main>
      <Footer />
    </div>
  );
};

export default PatientProfile;
