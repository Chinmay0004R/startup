import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorCard from '../components/DoctorCard';
import { fetchDoctors, fetchPosts, createPost, likePost, createSafetyAlert, createFollow, fetchDoctorStatistics, fetchDoctorProfileByUserId } from '../services/api';
import { FaUserMd, FaNetworkWired, FaPencilAlt, FaHeart, FaExclamationTriangle, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa';

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
  const [doctorStats, setDoctorStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [visiblePostsCount, setVisiblePostsCount] = useState(5);
  const [visibleDoctorsCount, setVisibleDoctorsCount] = useState(5);

  const currentDoctorId = doctors.find((doctor) => doctor.email === currentEmail)?.id;
  const token = localStorage.getItem('authToken');
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postData] = await Promise.all([fetchPosts(token)]);
        setPosts(postData);
      } catch (error) {
        setStatus('Unable to load dashboard information right now.');
      }
    };

    loadData();
  }, [currentEmail]);

  // Load doctor profile statistics
  useEffect(() => {
    const loadStats = async () => {
      if (!currentEmail || !userId || !token) return;
      
      setIsLoadingStats(true);
      try {
        // Get the doctor profile for this user
        const profile = await fetchDoctorProfileByUserId(userId);
        if (profile) {
          const stats = await fetchDoctorStatistics(profile.id, token);
          setDoctorStats(stats);
        }
      } catch (error) {
        console.error('Failed to load doctor statistics:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, [currentEmail, userId, token]);

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
      }, token);
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
    <div className="page-shell">
      <Navbar />
      <main className="page-panel">
        <section className="hero-panel">
          <div className="card-header-inline">
            <div>
              <p className="text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Doctor Dashboard</p>
              <h1 className="hero-title">Welcome to your personal doctor page</h1>
              <p className="text-muted">Manage posts, view doctor connections, and trigger emergency assistance when needed.</p>
              {currentDoctorId ? (
                <button
                  type="button"
                  className="button-full button-primary mt-1"
                  onClick={() => navigate(`/doctors/${currentDoctorId}`)}
                >
                  View my profile
                </button>
              ) : (
                <p className="text-muted mt-1">Your profile is not available yet. Save your doctor profile first.</p>
              )}
            </div>
            <FaUserMd className="hero-icon" style={{ fontSize: '3rem' }} />
          </div>
        </section>

        {status && (
          <div className="status-banner">
            {status}
          </div>
        )}

        <div className="page-grid-2">
          <section className="card-panel card-panel-large">
            <div className="card-header-inline">
              <h2 className="section-title">Create an update</h2>
              <FaPencilAlt className="feature-icon-box blue" />
            </div>
            <form onSubmit={handlePost} className="form-grid">
              <textarea
                className="textarea-block"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Share news, experience, or advice with your peers..."
              />
              <button type="submit" disabled={isPosting} className="button-full button-primary">
                {isPosting ? 'Posting...' : 'Publish update'}
              </button>
            </form>

            <div className="mt-1">
              <h3 className="section-title">Recent posts</h3>
              {posts.length === 0 ? (
                <p className="text-muted">No posts yet.</p>
              ) : (
                <>
                  {posts.slice(0, visiblePostsCount).map((post) => (
                    <div key={post.id} className="card-panel mt-1">
                      <div className="card-header-inline">
                        <span className="section-title" style={{ fontSize: '1rem', cursor: 'pointer' }} onClick={() => {
                          const doctor = doctors.find((item) => item.name === post.author_name);
                          if (doctor) {
                            navigate(`/doctors/${doctor.id}`);
                          }
                        }}>{post.author_name}</span>
                        <button
                          type="button"
                          onClick={() => handleLike(post.id)}
                          className="button-ghost"
                          style={{ color: '#f97316', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <FaHeart /> {post.likes}
                        </button>
                      </div>
                      <p className="text-muted">{post.content}</p>
                    </div>
                  ))}
                  {posts.length > visiblePostsCount && (
                    <button 
                      type="button" 
                      className="button-full button-secondary mt-1" 
                      onClick={() => setVisiblePostsCount(prev => prev + 5)}
                    >
                      Load more posts
                    </button>
                  )}
                </>
              )}
            </div>
          </section>

          <aside className="page-grid-1">
            <section className="card-panel card-panel-large">
              <div className="card-header-inline">
                <h2 className="section-title">Discover doctors</h2>
                <FaNetworkWired className="feature-icon-box blue" />
              </div>

              <input
                className="input-block"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search doctors by name, specialty, hospital, or registration"
              />
              {doctors.filter(doc => doc.email !== currentEmail).length === 0 ? (
                <p className="text-muted">No other doctors found on the platform yet.</p>
              ) : (
                <div className="page-grid-1">
                  {doctors
                    .filter(doc => doc.email !== currentEmail)
                    .slice(0, visibleDoctorsCount)
                    .map((doctor) => (
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
                  {doctors.filter(doc => doc.email !== currentEmail).length > visibleDoctorsCount && (
                    <button 
                      type="button" 
                      className="button-full button-secondary mt-1" 
                      onClick={() => setVisibleDoctorsCount(prev => prev + 5)}
                    >
                      Load more doctors
                    </button>
                  )}
                </div>
              )}
            </section>

            <section className="card-panel card-panel-large">
              <div className="card-header-inline">
                <h2 className="section-title">Profile Statistics</h2>
                <FaUserMd className="feature-icon-box blue" />
              </div>
              {isLoadingStats ? (
                <p style={{ color: 'var(--color-pencil-gray)' }}>Loading statistics...</p>
              ) : doctorStats ? (
                <div className="page-grid-2" style={{ gap: '1rem' }}>
                  <div className="card-panel" style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '0.75rem' }}>
                    <p style={{ color: 'var(--color-pencil-gray)', margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>Posts</p>
                    <p style={{ color: '#86efac', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{doctorStats.posts}</p>
                  </div>
                  <div className="card-panel" style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: 'rgba(249, 115, 22, 0.1)', borderRadius: '0.75rem' }}>
                    <p style={{ color: 'var(--color-pencil-gray)', margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>Reviews</p>
                    <p style={{ color: '#fed7aa', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{doctorStats.reviews}</p>
                  </div>
                  <div className="card-panel" style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: 'rgba(168, 85, 247, 0.1)', borderRadius: '0.75rem' }}>
                    <p style={{ color: 'var(--color-pencil-gray)', margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>Certificates</p>
                    <p style={{ color: '#d8b4fe', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{doctorStats.certificates}</p>
                  </div>
                  <div className="card-panel" style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.75rem' }}>
                    <p style={{ color: 'var(--color-pencil-gray)', margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>SOS History</p>
                    <p style={{ color: '#fca5a5', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{doctorStats.sos_history}</p>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--color-pencil-gray)' }}>No statistics available yet.</p>
              )}
            </section>

            <section style={sectionCardStyle}>
              <div style={cardHeaderStyle}>
                <h2 style={sectionTitleStyle}>Emergency SOS</h2>
                <FaExclamationTriangle style={{ color: '#f97316' }} />
              </div>
              <p style={{ color: 'var(--color-pencil-gray)', marginBottom: '1rem' }}>
                Use this button to notify your safety network immediately.
              </p>
              <button
                type="button"
                onClick={handleEmergency}
                disabled={isEmergency}
                style={{
                  ...buttonStyle,
                  background: 'var(--color-duck-bill-orange)',
                }}
              >
                {isEmergency ? 'Sending alert...' : 'Trigger SOS alert'}
              </button>
              {emergencyStatus && <p style={{ color: 'var(--color-pencil-gray)', marginTop: '1rem' }}>{emergencyStatus}</p>}
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
  background: 'var(--color-sky-crayon)',
  color: 'white',
  fontWeight: '600',
  cursor: 'pointer',
};

const sectionCardStyle = {
  borderRadius: '1rem',
  border: '1px solid var(--color-charcoal-ink)',
  background: 'var(--color-frost-white)',
  backdropFilter: 'blur(10px)',
  padding: '1.75rem',
  boxShadow: 'var(--shadow-hard)',
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
  border: '1px solid var(--color-charcoal-ink)',
  backgroundColor: 'var(--color-frost-white)',
};

export default DoctorDashboard;
