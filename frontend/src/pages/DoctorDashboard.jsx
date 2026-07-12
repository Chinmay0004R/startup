import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorCard from '../components/DoctorCard';
import { fetchDoctors, fetchPosts, createPost, likePost, createSafetyAlert, createFollow } from '../services/api';
import { FaUserMd, FaNetworkWired, FaPencilAlt, FaHeart, FaExclamationTriangle } from 'react-icons/fa';

const DoctorDashboard = ({ currentEmail }) => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [connectedDoctorIds, setConnectedDoctorIds] = useState([]);
  const [status, setStatus] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isConnectingDoctor, setIsConnectingDoctor] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyStatus, setEmergencyStatus] = useState('');

  const currentDoctorId = doctors.find((doctor) => doctor.email === currentEmail)?.id;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postData] = await Promise.all([fetchPosts()]);
        setPosts(postData);
      } catch (error) {
        setStatus('Unable to load dashboard information right now.');
      }
    };

    loadData();
  }, [currentEmail]);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorData = await fetchDoctors(searchTerm);
        setDoctors(doctorData);
      } catch (error) {
        setStatus('Unable to load doctor profiles right now.');
      }
    };

    const timer = window.setTimeout(loadDoctors, 250);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const handlePost = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      setStatus('Please enter a message before posting.');
      return;
    }

    setIsPosting(true);
    setStatus('Posting your update...');

    try {
      const authorDoctor = doctors.find((doctor) => doctor.email === currentEmail);
      const newPost = await createPost({
        author_name: authorDoctor?.name || currentEmail || 'Doctor',
        author_id: authorDoctor?.id,
        content: content.trim(),
      });
      setPosts((current) => [newPost, ...current]);
      setContent('');
      setStatus('Your update has been posted.');
    } catch (error) {
      setStatus('Unable to publish your update right now.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const updated = await likePost(postId);
      setPosts((current) => current.map((post) => (post.id === postId ? updated : post)));
    } catch (error) {
      setStatus('Unable to like the post.');
    }
  };

  const handleConnectDoctor = async (doctor) => {
    const token = localStorage.getItem('authToken');
    const userId = Number(localStorage.getItem('userId'));

    if (!token || !userId) {
      setStatus('Please sign in to connect with doctors.');
      return;
    }

    setIsConnectingDoctor(doctor.id);
    try {
      await createFollow({ follower_id: userId, following_id: doctor.id }, token);
      setConnectedDoctorIds((current) => (current.includes(doctor.id) ? current : [...current, doctor.id]));
      setStatus(`You are now connected with ${doctor.name}.`);
    } catch (error) {
      setStatus('Unable to connect with this doctor right now.');
    } finally {
      setIsConnectingDoctor(null);
    }
  };

  const handleEmergency = async () => {
    setIsEmergency(true);
    setEmergencyStatus('Sending emergency alert...');

    try {
      await createSafetyAlert({
        doctor_name: 'Doctor',
        location: 'Clinic',
        details: 'Doctor emergency assistance needed.',
      });
      setEmergencyStatus('Emergency alert sent successfully.');
    } catch (error) {
      setEmergencyStatus('Unable to send emergency alert.');
    } finally {
      setIsEmergency(false);
    }
  };

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
              }}>Doctor Dashboard</p>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'white', margin: 0 }}>Welcome to your personal doctor page</h1>
              <p style={{ color: '#cbd5e1', marginTop: '1rem' }}>
                Manage posts, view doctor connections, and trigger emergency assistance when needed.
              </p>
              {currentDoctorId ? (
                <button
                  type="button"
                  onClick={() => navigate(`/doctors/${currentDoctorId}`)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  View my profile
                </button>
              ) : (
                <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Your profile is not available yet. Save your doctor profile first.</p>
              )}
            </div>
            <FaUserMd style={{ fontSize: '3rem', color: '#60a5fa' }} />
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

        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '1.5rem' }}>
          <section style={sectionCardStyle}>
            <div style={cardHeaderStyle}>
              <h2 style={sectionTitleStyle}>Create an update</h2>
              <FaPencilAlt style={{ color: '#60a5fa' }} />
            </div>
            <form onSubmit={handlePost}>
              <textarea
                style={{
                  width: '100%',
                  borderRadius: '1rem',
                  border: '1px solid #475569',
                  backgroundColor: '#0f172a',
                  color: '#f8fafc',
                  padding: '1rem',
                  minHeight: '140px',
                  marginBottom: '1rem',
                }}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Share news, experience, or advice with your peers..."
              />
              <button type="submit" disabled={isPosting} style={buttonStyle}>
                {isPosting ? 'Posting...' : 'Publish update'}
              </button>
            </form>

            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Recent posts</h3>
              {posts.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>No posts yet.</p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} style={{ ...postStyle, marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ color: '#f1f5f9', fontWeight: 700, cursor: 'pointer' }} onClick={() => {
                        const doctor = doctors.find((item) => item.name === post.author_name);
                        if (doctor) {
                          navigate(`/doctors/${doctor.id}`);
                        }
                      }}>{post.author_name}</span>
                      <button
                        type="button"
                        onClick={() => handleLike(post.id)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#f97316',
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
            </div>
          </section>

          <aside>
            <section style={sectionCardStyle}>
              <div style={cardHeaderStyle}>
                <h2 style={sectionTitleStyle}>Connected doctors</h2>
                <FaNetworkWired style={{ color: '#60a5fa' }} />
              </div>
              <input
                style={{
                  width: '100%',
                  borderRadius: '0.75rem',
                  border: '1px solid #475569',
                  backgroundColor: '#0f172a',
                  color: '#f8fafc',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                }}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search doctors by name, specialty, hospital, or registration"
              />
              {doctors.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>No doctors found. Try another search.</p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {doctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      name={doctor.name}
                      specialty={doctor.specialty}
                      hospital={doctor.hospital}
                      verified={doctor.verified}
                      yearsExperience={doctor.years_experience}
                      registration_number={doctor.registration_number}
                      onViewProfile={() => navigate(`/doctors/${doctor.id}`)}
                      onConnect={() => handleConnectDoctor(doctor)}
                      isConnected={connectedDoctorIds.includes(doctor.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            <section style={sectionCardStyle}>
              <div style={cardHeaderStyle}>
                <h2 style={sectionTitleStyle}>Emergency SOS</h2>
                <FaExclamationTriangle style={{ color: '#f97316' }} />
              </div>
              <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
                Use this button to notify your safety network immediately.
              </p>
              <button
                type="button"
                onClick={handleEmergency}
                disabled={isEmergency}
                style={{
                  ...buttonStyle,
                  background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                }}
              >
                {isEmergency ? 'Sending alert...' : 'Trigger SOS alert'}
              </button>
              {emergencyStatus && <p style={{ color: '#cbd5e1', marginTop: '1rem' }}>{emergencyStatus}</p>}
            </section>
          </aside>
        </div>
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
  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
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

const cardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1rem',
};

const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: 'white',
  margin: 0,
};

const postStyle = {
  padding: '1rem',
  borderRadius: '1rem',
  border: '1px solid rgba(71, 85, 105, 0.3)',
  backgroundColor: 'rgba(15, 23, 42, 0.8)',
};

export default DoctorDashboard;
