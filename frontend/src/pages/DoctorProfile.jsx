import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { fetchDoctorById, fetchFollowers, fetchPosts, likePost, createSafetyAlert, uploadUserProfileImage } from '../services/api';
import {
  FaUserMd,
  FaHeart,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUsers,
  FaUserPlus,
  FaChartLine,
  FaCertificate,
  FaBriefcase,
  FaGraduationCap,
  FaTools,
  FaCalendarAlt,
  FaUserFriends,
  FaFileAlt,
  FaAward,
  FaClinicMedical,
  FaStar,
  FaComment,
  FaShare,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyStatus, setEmergencyStatus] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const [doctorData, postData] = await Promise.all([
          fetchDoctorById(Number(doctorId)),
          fetchPosts(token, Number(doctorId)),
        ]);
        setDoctor(doctorData);
        setPosts(postData);
      } catch (error) {
        setStatus('Unable to load doctor profile right now.');
      }
    };

    const storedEmail = localStorage.getItem('currentUserEmail') || '';
    setCurrentUserEmail(storedEmail);
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

  const handleFollow = () => {
    setIsFollowing((current) => !current);
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setToast({ message: 'Unsupported image format. Use jpg, jpeg, png, or webp.', type: 'error' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setToast({ message: 'Image must be 10 MB or smaller.', type: 'error' });
      return;
    }

    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('file', file);

    setUploadStatus('Uploading profile image...');
    setUploadProgress(0);
    setToast({ message: '', type: '' });

    try {
      const updatedDoctor = await uploadUserProfileImage(formData, token, setUploadProgress);
      setDoctor((current) => ({ ...current, profile_image: updatedDoctor?.profile_image || current.profile_image }));
      setUploadStatus('Upload complete.');
      setToast({ message: 'Profile image uploaded successfully.', type: 'success' });
    } catch (error) {
      setUploadStatus('Upload failed.');
      setToast({ message: error.message || 'Profile upload failed.', type: 'error' });
    } finally {
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  if (!doctor) {
    return (
      <div className="page-shell">
        <Navbar />
        <main className="page-panel">
          <p>Loading doctor profile...</p>
          <DangerZone />
      </main>
        <Footer />
      </div>
    );
  }

  const baseFollowerCount = Number(doctor?.followers_count || 0);
  const followerCount = (isFollowing ? baseFollowerCount + 1 : baseFollowerCount).toLocaleString();
  const isOwner = Boolean(
    doctor?.email && currentUserEmail && doctor.email.toLowerCase() === currentUserEmail.toLowerCase()
  );

  const aboutSections = [
    {
      title: 'Introduction',
      content: doctor?.bio || '',
    },
    {
      title: 'Experience',
      content: doctor?.years_experience
        ? `${doctor.years_experience} years of clinical experience in specialist care.`
        : '',
    },
    {
      title: 'Research',
      content: doctor?.research || '',
    },
    {
      title: 'Interests',
      content: doctor?.interests || '',
    },
    {
      title: 'Mission',
      content: doctor?.mission || '',
    },
  ].filter((item) => item.content);

  const followList = Array.isArray(doctor?.followers) ? doctor.followers : [];

  // load followers when doctor changes
  useEffect(() => {
    let mounted = true;
    const loadFollowers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const users = await fetchFollowers(doctor?.user_id || doctor?.id, token);
        if (mounted) setDoctor((d) => ({ ...d, followers: users }));
      } catch (e) {
        // ignore
      }
    };
    if (doctor) loadFollowers();
    return () => { mounted = false; };
  }, [doctor]);

  const experienceItems = Array.isArray(doctor?.experience) ? doctor.experience : [];
  const educationItems = Array.isArray(doctor?.education) ? doctor.education : [];
  const skillsList = Array.isArray(doctor?.skills) ? doctor.skills : [];
  const verificationTimeline = Array.isArray(doctor?.verification_timeline) ? doctor.verification_timeline : [];
  const peerReviews = Array.isArray(doctor?.peer_reviews) ? doctor.peer_reviews : [];
  const publications = Array.isArray(doctor?.publications) ? doctor.publications : [];
  const achievements = Array.isArray(doctor?.achievements) ? doctor.achievements : [];
  const contactInfo = {
    hospital: doctor?.hospital || '',
    phone: doctor?.phone || '',
    email: doctor?.email || '',
    address: doctor?.address || '',
    hours: doctor?.clinic_hours || '',
  };
  const activityItems = Array.isArray(posts) ? posts : [];
  const verificationStatusKey = (doctor?.verification_status || 'not_submitted').toLowerCase();
  const verificationDetails = {
    not_submitted: {
      label: 'Not Submitted',
      description: 'Verification documents have not been submitted yet.',
      tone: 'neutral',
    },
    pending_verification: {
      label: 'Pending Verification',
      description: 'Your documents are being reviewed by the verification team.',
      tone: 'pending',
    },
    verified: {
      label: 'Verified',
      description: 'This doctor has completed verification.',
      tone: 'success',
    },
    rejected: {
      label: 'Rejected',
      description: doctor?.rejection_reason || 'Verification was rejected. Please review the submitted documents.',
      tone: 'error',
    },
  };
  const verificationState = verificationDetails[verificationStatusKey] || verificationDetails.not_submitted;

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-panel">
        <section className="hero-panel">
          <div className="page-grid-2 align-center">
            <div className="stacked-layout">
              <div className="horizontal-layout align-center">
                <div className="feature-icon-box blue large">
                  <FaUserMd />
                </div>
                <div>
                  <h1 className="hero-title">{doctor.name}</h1>
                  <p className="text-muted no-margin">{doctor.qualifications || 'MBBS | MD'} · {doctor.specialty || 'Specialist'}</p>
                  <p className="text-muted no-margin">{doctor.hospital || 'Apollo Hospital'} • {doctor.city || 'Mumbai'}</p>
                </div>
              </div>

              {isOwner && (
                <label className="button-secondary button-full button-upload">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleProfileImageChange}
                    className="visually-hidden"
                  />
                  Change profile image
                </label>
              )}

              {uploadStatus && <p className="text-muted no-margin">{uploadStatus}</p>}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="status-banner">
                  <div className="status-bar" style={{ '--progress': `${uploadProgress}%` }} />
                </div>
              )}

              {toast.message && (
                <div className={toast.type === 'success' ? 'message-box success' : 'message-box error'}>
                  {toast.message}
                </div>
              )}

              <div className="card-panel card-panel-row">
                <div className="feature-icon-box green">
                  {verificationState.tone === 'success' ? <FaCheckCircle /> : verificationState.tone === 'error' ? <FaExclamationTriangle /> : verificationState.tone === 'pending' ? <FaCertificate /> : <FaUserMd />}
                </div>
                <div>
                  <p className="section-title no-margin">{verificationState.label}</p>
                  <p className="text-muted no-margin">{verificationState.description}</p>
                </div>
              </div>

              <div className="page-grid-2">
                <span className="button-secondary space-between"><FaStar /> 4.9</span>
                <span className="button-secondary space-between"><FaUsers /> {followerCount} followers</span>
              </div>
            </div>

            <div className="page-grid-1">
              <button
                type="button"
                className={`button-full button-primary ${isFollowing ? 'button-following' : ''}`}
                onClick={handleFollow}
              >
                <FaUserPlus /> {isFollowing ? 'Following' : 'Follow'}
              </button>
              <a href={`mailto:${doctor.email}`} className="button-full button-secondary button-link">
                <FaEnvelope /> Contact
              </a>
              <a href={`mailto:${doctor.email}`} className="button-full button-secondary button-link">
                Message
              </a>
            </div>
          </div>
        </section>

        <div className="page-grid-3">
          <div>
            {isOwner && (
              <section className="section-card-dark">
                <div className="section-header-inline">
                  <FaChartLine className="section-icon" />
                  <h2 className="section-title no-margin">Analytics</h2>
                </div>
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <p className="analytics-label">Posts</p>
                    <p className="analytics-value">{posts.length}</p>
                  </div>
                  <div className="analytics-card">
                    <p className="analytics-label">Followers</p>
                    <p className="analytics-value">{followerCount}</p>
                  </div>
                  <div className="analytics-card">
                    <p className="analytics-label">Verification</p>
                    <p className="analytics-value">{verificationState.label}</p>
                  </div>
                </div>
              </section>
            )}

            <section className="section-card-dark">
              <div className="section-header-inline">
                <FaUserMd className="section-icon" />
                <h2 className="section-title no-margin">About</h2>
              </div>
              {aboutSections.length === 0 ? (
                <p className="empty-state-text">No profile details have been added yet.</p>
              ) : aboutSections.map((item) => (
                <div key={item.title} className="info-row">
                  <span className="info-label">{item.title}</span>
                  <p className="info-text">{item.content}</p>
                </div>
              ))}
            </section>

            <section className="section-card-dark">
              <div className="section-header-inline">
                <FaHeart className="section-icon" />
                <h2 className="section-title no-margin">Activity</h2>
              </div>
              {activityItems.length === 0 ? (
                <p className="empty-state-text">No activity posted yet.</p>
              ) : activityItems.map((item) => (
                <div key={item.id} className="post-card">
                  <div className="post-header">
                    <div>
                      <strong className="post-title">{item.title}</strong>
                      <p className="post-meta">{item.time}</p>
                    </div>
                  </div>
                  <p className="post-content">{item.content}</p>
                  <div className="post-actions">
                    <span className="post-action-item"><FaHeart /> {item.likes}</span>
                    <span className="post-action-item"><FaComment /> {item.comments}</span>
                    <span className="post-action-item"><FaShare /> Share</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="section-card-dark">
              <div className="section-header-inline">
                <FaBriefcase className="section-icon" />
                <h2 className="section-title no-margin">Experience</h2>
              </div>
              <div className="timeline-list">
                {experienceItems.length === 0 ? (
                  <p className="empty-state-text">No experience details added yet.</p>
                ) : experienceItems.map((exp) => (
                  <div key={exp.id} className="timeline-item">
                    <strong className="timeline-title">{exp.title}</strong>
                    <p className="timeline-meta">{exp.organisation} · {exp.period}</p>
                    <p className="timeline-text">{exp.details}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="section-card-dark">
              <div className="section-header-inline">
                <FaGraduationCap className="section-icon" />
                <h2 className="section-title no-margin">Education</h2>
              </div>
              <div className="timeline-list">
                {educationItems.length === 0 ? (
                  <p className="empty-state-text">No education details added yet.</p>
                ) : educationItems.map((edu) => (
                  <div key={edu.id} className="timeline-item">
                    <strong className="timeline-title">{edu.degree}</strong>
                    <p className="timeline-meta">{edu.school}</p>
                    <p className="timeline-year">{edu.year}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="section-card-dark">
              <div className="section-header-inline">
                <FaTools className="section-icon" />
                <h2 className="section-title no-margin">Skills</h2>
              </div>
              <div className="skill-list">
                {skillsList.length === 0 ? (
                  <p className="empty-state-text">No skills listed yet.</p>
                ) : skillsList.map((s, idx) => (
                  <span key={idx} className="skill-chip">{s}</span>
                ))}
              </div>
            </section>

            <section className="section-card-dark">
              <div className="section-header-inline">
                <FaUserFriends className="section-icon" />
                <h2 className="section-title no-margin">Patient Reviews</h2>
              </div>
              <div className="timeline-list">
                {peerReviews.length === 0 ? (
                  <p className="empty-state-text">No patient reviews yet.</p>
                ) : peerReviews.map((r) => (
                  <div key={r.id} className="timeline-item">
                    <strong className="timeline-title">{r.reviewer}</strong>
                    <p className="timeline-text">{r.content}</p>
                    <p className="timeline-meta">{new Date(r.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="section-card-dark">
              <div className="section-header-inline">
                <FaFileAlt className="section-icon" />
                <h2 className="section-title no-margin">Research & Publications</h2>
              </div>
              <div className="timeline-list">
                {publications.length === 0 ? (
                  <p className="empty-state-text">No publications shared yet.</p>
                ) : publications.map((p) => (
                  <div key={p.id} className="timeline-item">
                    <strong className="timeline-title">{p.title}</strong>
                    <p className="timeline-meta">{p.journal} · {p.year}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="sidebar-column">
            <section className="section-card-dark">
              <div className="section-header-inline">
                <FaUsers className="section-icon" />
                <h2 className="section-title no-margin">Followers</h2>
              </div>
              <div className="followers-list">
                {followList.length === 0 ? (
                  <p className="empty-state-text">No followers yet.</p>
                ) : followList.map((follower) => (
                  <div key={follower.id} className="follower-row">
                    <div>
                      <strong className="follower-name">{follower.name}</strong>
                      <p className="follower-role">{follower.role}</p>
                    </div>
                    <FaUserMd className="section-icon" />
                  </div>
                ))}
              </div>
            </section>

            <section className="section-card-dark">
              <div className="section-header-inline">
                <FaCalendarAlt className="section-icon" />
                <h2 className="section-title no-margin">Verification Status</h2>
              </div>
              <div className="verification-status">
                {verificationTimeline.length === 0 ? (
                  <p className="empty-state-text">Verification details will appear here once available.</p>
                ) : verificationTimeline.map((v) => (
                  <div key={v.id} className="verification-status-item">
                    <p className="verification-event">{v.event}</p>
                    <span className={`badge ${v.status === 'Verified' ? 'success' : v.status === 'Rejected' ? 'error' : 'pending'}`}>{v.status}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="section-card-dark">
              <div className="section-header-inline">
                <FaAward className="section-icon" />
                <h2 className="section-title no-margin">Achievements</h2>
              </div>
              <div className="timeline-list">
                {achievements.length === 0 ? (
                  <p className="empty-state-text">No achievements shared yet.</p>
                ) : achievements.map((a) => (
                  <div key={a.id} className="timeline-item">
                    <strong className="timeline-title">{a.title}</strong>
                    <p className="timeline-meta">{a.issuer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="section-card-dark">
              <div className="section-header-inline">
                <FaClinicMedical className="section-icon" />
                <h2 className="section-title no-margin">Contact & Clinic</h2>
              </div>
              {contactInfo.hospital || contactInfo.phone || contactInfo.email || contactInfo.address || contactInfo.hours ? (
                <div className="contact-info">
                  {contactInfo.hospital && (
                    <div className="contact-row">
                      <span className="contact-label">Hospital</span>
                      <span className="contact-value">{contactInfo.hospital}</span>
                    </div>
                  )}
                  {contactInfo.phone && (
                    <div className="contact-row">
                      <span className="contact-label">Phone</span>
                      <a href={`tel:${contactInfo.phone}`} className="contact-link">{contactInfo.phone}</a>
                    </div>
                  )}
                  {contactInfo.email && (
                    <div className="contact-row">
                      <span className="contact-label">Email</span>
                      <a href={`mailto:${contactInfo.email}`} className="contact-link">{contactInfo.email}</a>
                    </div>
                  )}
                  {contactInfo.address && (
                    <div className="contact-row">
                      <span className="contact-label">Address</span>
                      <span className="contact-value">{contactInfo.address}</span>
                    </div>
                  )}
                  {contactInfo.hours && (
                    <div className="contact-row">
                      <span className="contact-label">Hours</span>
                      <span className="contact-value">{contactInfo.hours}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="empty-state-text">No clinic contact details available yet.</p>
              )}
            </section>
          </aside>
        </div>

        {status && <p className="status-message">{status}</p>}
        <DangerZone />
      </main>
      <Footer />
    </div>
  );
};

export default DoctorProfile;
