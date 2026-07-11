import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorCard from '../components/DoctorCard';
import { fetchDoctorById, fetchPosts, likePost, createSafetyAlert } from '../services/api';
import { FaUserMd, FaHeart, FaExclamationTriangle } from 'react-icons/fa';

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyStatus, setEmergencyStatus] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [doctorData, postData] = await Promise.all([
          fetchDoctorById(Number(doctorId)),
          fetchPosts(Number(doctorId)),
        ]);
        setDoctor(doctorData);
        setPosts(postData);
      } catch (error) {
        setStatus('Unable to load doctor profile right now.');
      }
    };

    loadProfile();
  }, [doctorId]);

  const handleLike = async (postId) => {
    try {
      const updated = await likePost(postId);
      setPosts((current) => current.map((post) => (post.id === postId ? updated : post)));
    } catch (error) {
      setStatus('Unable to like this post.');
    }
  };

  const handleEmergency = async () => {
    setIsEmergency(true);
    setEmergencyStatus('Sending emergency alert...');

    try {
      await createSafetyAlert({
        doctor_name: doctor?.name || 'Doctor',
        location: doctor?.hospital || 'Clinic',
        details: 'Doctor emergency assistance needed.',
      });
      setEmergencyStatus('Emergency alert sent successfully.');
    } catch (error) {
      setEmergencyStatus('Unable to send emergency alert.');
    } finally {
      setIsEmergency(false);
    }
  };

  if (!doctor) {
    return (
      <div>
        <Navbar />
        <main style={{ padding: '3rem', color: '#f1f5f9' }}>
          <p>Loading doctor profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
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
              }}>Doctor Profile</p>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'white', margin: 0 }}>{doctor.name}</h1>
              <p style={{ color: '#cbd5e1', marginTop: '1rem' }}>{doctor.specialty} at {doctor.hospital || 'Not specified'}</p>
            </div>
            <FaUserMd style={{ fontSize: '3rem', color: '#60a5fa' }} />
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '1.5rem' }}>
          <section style={sectionCardStyle}>
            <h2 style={sectionTitleStyle}>About</h2>
            <p style={{ color: '#cbd5e1', margin: '1rem 0' }}>{doctor.bio || 'No doctor biography available.'}</p>
            <div style={infoRowStyle}>
              <span>Experience</span>
              <span>{doctor.years_experience || 0} years</span>
            </div>
            <div style={infoRowStyle}>
              <span>Certification</span>
              <span>{doctor.certification || 'Not uploaded'}</span>
            </div>
            <div style={infoRowStyle}>
              <span>Registration</span>
              <span>{doctor.registration_number || 'Not provided'}</span>
            </div>
            <div style={infoRowStyle}>
              <span>Availability</span>
              <span>{doctor.availability || 'Not set'}</span>
            </div>
          </section>

          <aside style={sectionCardStyle}>
            <h2 style={sectionTitleStyle}>Actions</h2>
            <button
              type="button"
              onClick={handleEmergency}
              disabled={isEmergency}
              style={{
                ...buttonStyle,
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                marginBottom: '1rem',
              }}
            >
              {isEmergency ? 'Sending alert...' : 'Trigger SOS alert'}
            </button>
            {emergencyStatus && <p style={{ color: '#cbd5e1', marginTop: '1rem' }}>{emergencyStatus}</p>}
          </aside>
        </div>

        <section style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={sectionTitleStyle}>Posts by {doctor.name}</h2>
          </div>
          {posts.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No posts have been published yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} style={{ ...postStyle, marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{post.author_name}</span>
                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#60a5fa',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <FaHeart /> {post.likes}
                  </button>
                </div>
                <p style={{ color: '#cbd5e1', margin: 0 }}>{post.content}</p>
              </div>
            ))
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

const buttonStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.75rem',
  border: 'none',
  color: 'white',
  fontWeight: '600',
  cursor: 'pointer',
};

const sectionCardStyle = {
  borderRadius: '1rem',
  border: '1px solid rgba(71, 85, 105, 0.3)',
  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.6))',
  backdropFilter: 'blur(10px)',
  padding: '1.75rem',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
};

const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  color: 'white',
  margin: 0,
};

const infoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  color: '#cbd5e1',
  padding: '0.75rem 0',
  borderBottom: '1px solid rgba(71, 85, 105, 0.2)',
};

const postStyle = {
  padding: '1rem',
  borderRadius: '1rem',
  border: '1px solid rgba(71, 85, 105, 0.3)',
  backgroundColor: 'rgba(15, 23, 42, 0.8)',
};

export default DoctorProfile;
