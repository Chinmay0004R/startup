import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorCard from '../components/DoctorCard';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import {
  fetchDoctors,
  createDoctor,
  fetchPosts,
  createPost,
  likePost,
  createSafetyAlert,
  createFollow,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    registrationNumber: '',
    hospital: '',
    city: '',
    state: '',
    specialization: '',
    verifiedOnly: false,
    minExperience: '',
    maxExperience: '',
  });
  const [connectedDoctorIds, setConnectedDoctorIds] = useState([]);
  const [status, setStatus] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isConnectingDoctor, setIsConnectingDoctor] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyStatus, setEmergencyStatus] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const [postData] = await Promise.all([fetchPosts(token)]);
        setPosts(postData);
      } catch (error) {
        setStatus('Unable to load dashboard data right now.');
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        const doctorData = await fetchDoctors(searchTerm, filters);
        setDoctors(doctorData);
      } catch (error) {
        setStatus('Unable to load doctor profiles right now.');
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    const timer = window.setTimeout(loadDoctors, 250);
    return () => window.clearTimeout(timer);
  }, [searchTerm, filters.name, filters.registrationNumber, filters.hospital, filters.city, filters.state, filters.specialization, filters.verifiedOnly, filters.minExperience, filters.maxExperience]);

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
      const token = localStorage.getItem('authToken');
      const newPost = await createPost({
        author_name: profile.name || 'Doctor',
        content: postContent.trim(),
      }, token);
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
    border: '1px solid var(--color-charcoal-ink)',
    background: 'var(--color-frost-white)',
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
    color: 'var(--color-pencil-gray)',
  };

  const badgeStyle = {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
    color: 'var(--color-sky-crayon)',
  };

  const sectionCardStyle = {
    borderRadius: '1rem',
    border: '1px solid var(--color-charcoal-ink)',
    background: 'var(--color-frost-white)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    boxShadow: 'var(--shadow-hard)',
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
    border: '1px solid var(--color-charcoal-ink)',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--color-frost-white)',
    color: 'var(--color-charcoal-ink)',
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
    background: 'var(--color-sky-crayon)',
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
    border: '1px solid var(--color-charcoal-ink)',
    backgroundColor: 'var(--color-frost-white)',
    marginBottom: '1rem',
  };

  const statusBarStyle = {
    marginBottom: '1.5rem',
    padding: '1rem',
    borderRadius: '0.75rem',
    backgroundColor: 'var(--color-frost-white)',
    border: '1px solid rgba(71, 85, 105, 0.4)',
    color: 'var(--color-pencil-gray)',
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
            <FaUserMd style={{ fontSize: '2rem', color: 'var(--color-sky-crayon)' }} />
          </div>
          <p style={headerDescriptionStyle}>
            Update your doctor profile, connect with other doctors, publish updates, and trigger emergency alerts when needed.
          </p>
        </section>

        {status && <div style={statusBarStyle}>{status}</div>}

        <div style={gridContainerStyle}>
          <div>
            <div style={sectionCardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={sectionTitleStyle}>Profile editor</h3>
                <FaPencilAlt style={{ color: 'var(--color-sky-crayon)' }} />
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
                  <span style={{ color: 'var(--color-pencil-gray)' }}>Mark as verified doctor</span>
                </label>
                <button style={buttonStyle} type="submit" disabled={isSavingProfile}>
                  {isSavingProfile ? 'Saving profile...' : 'Save profile'}
                </button>
              </form>
            </div>

            <div style={sectionCardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={sectionTitleStyle}>Doctor posts</h3>
                <FaPencilAlt style={{ color: 'var(--color-sky-crayon)' }} />
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
                <p style={{ color: 'var(--color-pencil-gray)', marginTop: '1rem' }}>No posts yet. Start by sharing an update.</p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} style={postStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div>
                        <p style={{ color: 'var(--color-charcoal-ink)', fontWeight: 700, margin: 0 }}>{post.author_name}</p>
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
                          color: 'var(--color-sky-crayon)',
                          cursor: 'pointer',
                        }}
                      >
                        <FaHeart /> {post.likes}
                      </button>
                    </div>
                    <p style={{ color: 'var(--color-pencil-gray)', margin: 0 }}>{post.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div style={sectionCardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={sectionTitleStyle}>Find doctors</h3>
                <FaNetworkWired style={{ color: 'var(--color-sky-crayon)' }} />
              </div>
              <input
                style={{ ...inputStyle, marginBottom: '0.75rem' }}
                placeholder="Search by name, specialty, hospital, or registration"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    style={inputStyle}
                    placeholder="Doctor name"
                    value={filters.name}
                    onChange={(event) => setFilters((current) => ({ ...current, name: event.target.value }))}
                  />
                  <input
                    style={inputStyle}
                    placeholder="Registration number"
                    value={filters.registrationNumber}
                    onChange={(event) => setFilters((current) => ({ ...current, registrationNumber: event.target.value }))}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    style={inputStyle}
                    placeholder="Hospital"
                    value={filters.hospital}
                    onChange={(event) => setFilters((current) => ({ ...current, hospital: event.target.value }))}
                  />
                  <input
                    style={inputStyle}
                    placeholder="Specialization"
                    value={filters.specialization}
                    onChange={(event) => setFilters((current) => ({ ...current, specialization: event.target.value }))}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    style={inputStyle}
                    placeholder="City"
                    value={filters.city}
                    onChange={(event) => setFilters((current) => ({ ...current, city: event.target.value }))}
                  />
                  <input
                    style={inputStyle}
                    placeholder="State"
                    value={filters.state}
                    onChange={(event) => setFilters((current) => ({ ...current, state: event.target.value }))}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    style={inputStyle}
                    type="number"
                    placeholder="Min experience"
                    value={filters.minExperience}
                    onChange={(event) => setFilters((current) => ({ ...current, minExperience: event.target.value }))}
                  />
                  <input
                    style={inputStyle}
                    type="number"
                    placeholder="Max experience"
                    value={filters.maxExperience}
                    onChange={(event) => setFilters((current) => ({ ...current, maxExperience: event.target.value }))}
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-pencil-gray)' }}>
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(event) => setFilters((current) => ({ ...current, verifiedOnly: event.target.checked }))}
                  />
                  Verified doctors only
                </label>
                <button
                  type="button"
                  onClick={() => setFilters({
                    name: '',
                    registrationNumber: '',
                    hospital: '',
                    city: '',
                    state: '',
                    specialization: '',
                    verifiedOnly: false,
                    minExperience: '',
                    maxExperience: '',
                  })}
                  style={{ ...buttonStyle, padding: '0.6rem 0.9rem', background: 'rgba(59,130,246,0.18)', color: '#bfdbfe' }}
                >
                  Reset filters
                </button>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {isLoadingDoctors ? (
                  <>
                    {Array(6).fill(0).map((_, idx) => (
                      <Skeleton key={idx} type="card" />
                    ))}
                  </>
                ) : doctors.length === 0 ? (
                  <EmptyState
                    type="default"
                    title="No doctors found"
                    description="Try adjusting your search criteria or check back later."
                  />
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
                      onConnect={() => handleConnectDoctor(doctor)}
                      isConnected={connectedDoctorIds.includes(doctor.id)}
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
              <p style={{ color: 'var(--color-pencil-gray)', marginBottom: '1rem' }}>
                Send an emergency alert to your safety network and local response team.
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
                {isEmergency ? 'Sending alert...' : 'Trigger emergency alert'}
              </button>
              {emergencyStatus && <p style={{ color: 'var(--color-pencil-gray)', marginTop: '1rem' }}>{emergencyStatus}</p>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Doctors;
