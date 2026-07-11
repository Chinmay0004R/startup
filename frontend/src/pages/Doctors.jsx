import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorCard from '../components/DoctorCard';
import {
  fetchDoctors,
  createDoctor,
  fetchPosts,
  createPost,
  likePost,
  createSafetyAlert,
} from '../services/api';
import {
  FaUserMd,
  FaCheckCircle,
  FaSpinner,
  FaNetworkWired,
  FaPencilAlt,
  FaHeart,
  FaExclamationTriangle,
} from 'react-icons/fa';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [profile, setProfile] = useState({
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
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [status, setStatus] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyStatus, setEmergencyStatus] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorData, postData] = await Promise.all([fetchDoctors(), fetchPosts()]);
        setDoctors(doctorData);
        setPosts(postData);
      } catch (error) {
        setStatus('Unable to load dashboard data right now.');
      }
    };

    loadData();
  }, []);

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setIsSavingProfile(true);
    setStatus('Saving profile...');

    try {
      const payload = {
        ...profile,
        years_experience: Number(profile.years_experience),
      };
      const savedDoctor = await createDoctor(payload);
      setDoctors((current) => {
        const exists = current.some((doctor) => doctor.email === savedDoctor.email && savedDoctor.email);
        return exists ? current : [savedDoctor, ...current];
      });
      setStatus('Profile saved successfully.');
    } catch (error) {
      setStatus('Unable to save profile right now.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    if (!postContent.trim()) {
      setStatus('Please write something before posting.');
      return;
    }

    setIsPosting(true);
    setStatus('Publishing your post...');

    try {
      const newPost = await createPost({
        author_name: profile.name || 'Doctor',
        content: postContent.trim(),
      });
      setPosts((current) => [newPost, ...current]);
      setPostContent('');
      setStatus('Post published successfully.');
    } catch (error) {
      setStatus('Unable to publish post.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (postId) => {
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
        doctor_name: profile.name || 'Doctor',
        location: profile.hospital || profile.clinic_address || 'Clinic location',
        details: 'Emergency assistance requested by doctor.',
      });
      setEmergencyStatus('Emergency alert sent successfully.');
    } catch (error) {
      setEmergencyStatus('Failed to send emergency alert.');
    } finally {
      setIsEmergency(false);
    }
  };

  const mainStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
  };

  const headerBoxStyle = {
    borderRadius: '1.875rem',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    background: 'linear-gradient(to bottom right, rgba(7, 89, 133, 0.4), rgba(2, 6, 23, 1))',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
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

  const badgeStyle = {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
    color: '#60a5fa',
  };

  const sectionCardStyle = {
    borderRadius: '1rem',
    border: '1px solid rgba(71, 85, 105, 0.3)',
    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.6))',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    marginBottom: '1.5rem',
  };

  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  };

  const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'white',
    margin: 0,
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
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
    gridColumn: '1 / -1',
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

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1.3fr 0.9fr',
    gap: '1.5rem',
  };

  const postStyle = {
    padding: '1rem',
    borderRadius: '1rem',
    border: '1px solid rgba(71, 85, 105, 0.3)',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    marginBottom: '1rem',
  };

  const statusBarStyle = {
    marginBottom: '1.5rem',
    padding: '1rem',
    borderRadius: '0.75rem',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(71, 85, 105, 0.4)',
    color: '#cbd5e1',
  };

  return (
    <div>
      <Navbar />
      <main style={mainStyle}>
        <section style={headerBoxStyle}>
          <div style={cardHeaderStyle}>
            <div>
              <span style={badgeStyle}>Doctor Dashboard</span>
              <h2 style={headerTitleStyle}>Manage your profile, network, and safety</h2>
            </div>
            <FaUserMd style={{ fontSize: '2rem', color: '#60a5fa' }} />
          </div>
          <p style={headerDescriptionStyle}>
            Update your doctor profile, connect with other doctors, publish updates, and trigger emergency support when needed.
          </p>
        </section>

        {status && <div style={statusBarStyle}>{status}</div>}

        <div style={gridContainerStyle}>
          <div>
            <div style={sectionCardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={sectionTitleStyle}>Profile editor</h3>
                <FaPencilAlt style={{ color: '#60a5fa' }} />
              </div>
              <form onSubmit={handleSaveProfile}>
                <div style={formGridStyle}>
                  <input
                    style={inputStyle}
                    placeholder="Full name"
                    value={profile.name}
                    onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                    required
                  />
                  <input
                    style={inputStyle}
                    placeholder="Specialty"
                    value={profile.specialty}
                    onChange={(event) => setProfile({ ...profile, specialty: event.target.value })}
                    required
                  />
                </div>
                <div style={formGridStyle}>
                  <input
                    style={inputStyle}
                    type="email"
                    placeholder="Email address"
                    value={profile.email}
                    onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                    required
                  />
                  <input
                    style={inputStyle}
                    placeholder="Registration number"
                    value={profile.registration_number}
                    onChange={(event) => setProfile({ ...profile, registration_number: event.target.value })}
                  />
                </div>
                <div style={formGridStyle}>
                  <input
                    style={inputStyle}
                    placeholder="Hospital / Clinic"
                    value={profile.hospital}
                    onChange={(event) => setProfile({ ...profile, hospital: event.target.value })}
                  />
                  <input
                    style={inputStyle}
                    placeholder="Clinic address"
                    value={profile.clinic_address}
                    onChange={(event) => setProfile({ ...profile, clinic_address: event.target.value })}
                  />
                </div>
                <div style={formGridStyle}>
                  <input
                    style={inputStyle}
                    type="number"
                    placeholder="Years of experience"
                    value={profile.years_experience}
                    onChange={(event) => setProfile({ ...profile, years_experience: event.target.value })}
                  />
                  <input
                    style={inputStyle}
                    placeholder="Certification / license"
                    value={profile.certification}
                    onChange={(event) => setProfile({ ...profile, certification: event.target.value })}
                  />
                </div>
                <textarea
                  style={textareaStyle}
                  placeholder="Professional biography"
                  value={profile.bio}
                  onChange={(event) => setProfile({ ...profile, bio: event.target.value })}
                />
                <input
                  style={{ ...inputStyle, marginTop: '1rem' }}
                  placeholder="Availability"
                  value={profile.availability}
                  onChange={(event) => setProfile({ ...profile, availability: event.target.value })}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={profile.verified}
                    onChange={(event) => setProfile({ ...profile, verified: event.target.checked })}
                    style={{ width: '1rem', height: '1rem' }}
                  />
                  <span style={{ color: '#cbd5e1' }}>Mark as verified doctor</span>
                </label>
                <button style={buttonStyle} type="submit" disabled={isSavingProfile}>
                  {isSavingProfile ? 'Saving profile...' : 'Save profile'}
                </button>
              </form>
            </div>

            <div style={sectionCardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={sectionTitleStyle}>Doctor posts</h3>
                <FaPencilAlt style={{ color: '#60a5fa' }} />
              </div>
              <form onSubmit={handleCreatePost}>
                <textarea
                  style={textareaStyle}
                  placeholder="Share an update with your network..."
                  value={postContent}
                  onChange={(event) => setPostContent(event.target.value)}
                />
                <button style={buttonStyle} type="submit" disabled={isPosting}>
                  {isPosting ? 'Posting...' : 'Post update'}
                </button>
              </form>
              {posts.length === 0 ? (
                <p style={{ color: '#94a3b8', marginTop: '1rem' }}>No posts yet. Start by sharing an update.</p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} style={postStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div>
                        <p style={{ color: '#f1f5f9', fontWeight: 700, margin: 0 }}>{post.author_name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleLikePost(post.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          border: 'none',
                          background: 'transparent',
                          color: '#60a5fa',
                          cursor: 'pointer',
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
          </div>

          <div>
            <div style={sectionCardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={sectionTitleStyle}>Connected doctors</h3>
                <FaNetworkWired style={{ color: '#60a5fa' }} />
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {doctors.length === 0 ? (
                  <p style={{ color: '#94a3b8' }}>No doctor connections yet.</p>
                ) : (
                  doctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      name={doctor.name}
                      specialty={doctor.specialty}
                      hospital={doctor.hospital}
                      verified={doctor.verified}
                      yearsExperience={doctor.years_experience}
                      registration_number={doctor.registration_number}
                    />
                  ))
                )}
              </div>
            </div>

            <div style={sectionCardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={sectionTitleStyle}>Emergency SOS</h3>
                <FaExclamationTriangle style={{ color: '#f97316' }} />
              </div>
              <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
                Send an emergency alert to your safety network and local support team.
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
                {isEmergency ? 'Sending alert...' : 'Trigger emergency alert'}
              </button>
              {emergencyStatus && <p style={{ color: '#cbd5e1', marginTop: '1rem' }}>{emergencyStatus}</p>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Doctors;
