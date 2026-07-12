import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchDoctorById, fetchPosts, likePost, createSafetyAlert } from '../services/api';
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

  if (!doctor) {
    return (
      <div>
        <Navbar />
        <main style={{ padding: '3rem', color: '#0f172a' }}>
          <p>Loading doctor profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const baseFollowerCount = Number(doctor?.followers_count || 1254);
  const followerCount = (isFollowing ? baseFollowerCount + 1 : baseFollowerCount).toLocaleString();
  const isOwner = Boolean(
    doctor?.email && currentUserEmail && doctor.email.toLowerCase() === currentUserEmail.toLowerCase()
  );

  const aboutSections = [
    {
      title: 'Introduction',
      content: doctor?.bio || 'Consultant physician focused on ethical care, clear communication, and long-term wellness.',
    },
    {
      title: 'Experience',
      content: doctor?.years_experience
        ? `${doctor.years_experience} years of clinical experience in specialist care.`
        : 'Experienced clinician with a strong record of safe, evidence-based treatment.',
    },
    {
      title: 'Research',
      content: doctor?.research || 'Actively keeping up with medical advances and contributing to patient education initiatives.',
    },
    {
      title: 'Interests',
      content: doctor?.interests || 'Preventive care, cardiology, advanced diagnostics, and transparent patient guidance.',
    },
    {
      title: 'Mission',
      content: doctor?.mission || 'Committed to compassionate care, clinical excellence, and building lasting trust with every patient.',
    },
  ];

  const followList = doctor?.followers || [
    { id: 1, name: 'Dr. Amit', role: 'Cardiologist' },
    { id: 2, name: 'Sneha Patil', role: 'Patient' },
    { id: 3, name: 'Dr. Rakesh', role: 'Neurologist' },
    { id: 4, name: 'Rahul', role: 'Parent' },
  ];

  const certs = doctor?.certifications || [
    { id: 1, name: 'MBBS', issuer: 'Mumbai University', status: 'Verified' },
    { id: 2, name: 'MD Cardiology', issuer: 'AIIMS Delhi', status: 'Verified' },
    { id: 3, name: 'NMC Registration', issuer: 'National Medical Commission', status: 'Active' },
    { id: 4, name: 'Fellowship', issuer: 'American College of Cardiology', status: 'Pending' },
  ];

  const experienceItems = doctor?.experience || [
    {
      id: 1,
      title: 'Senior Consultant',
      organisation: doctor?.hospital || 'Apollo Hospital',
      period: '2018 - Present',
      details: 'Worked in interventional cardiology and complex procedures.',
    },
  ];

  const educationItems = doctor?.education || [
    { id: 1, degree: 'MBBS', school: 'Grant Medical College', year: '2008' },
    { id: 2, degree: 'MD Cardiology', school: 'AIIMS Delhi', year: '2014' },
  ];

  const skillsList = doctor?.skills || ['Cardiology', 'Angioplasty', 'Heart Failure', 'ECG Interpretation'];

  const verificationTimeline = doctor?.verification_timeline || [
    { id: 1, event: 'Medical License Verified', date: '2021-06-12', status: 'Verified' },
    { id: 2, event: 'Hospital Affiliation Verified', date: '2022-03-01', status: 'Verified' },
    { id: 3, event: 'Degree Verified', date: '2020-11-20', status: 'Verified' },
  ];

  const peerReviews = doctor?.peer_reviews || [
    { id: 1, reviewer: 'Dr. Sharma', content: 'Excellent clinical judgement and clear communicator.', date: '2024-02-10' },
    { id: 2, reviewer: 'Dr. Kapoor', content: 'Collaborative and reliable in high-pressure situations.', date: '2023-08-22' },
  ];

  const publications = doctor?.publications || [
    { id: 1, title: 'Heart Disease in Young Adults', journal: 'Indian Journal of Cardiology', year: '2022' },
    { id: 2, title: 'Prevention Strategies for Heart Failure', journal: 'Cardiac Care Review', year: '2021' },
  ];

  const achievements = doctor?.achievements || [
    { id: 1, title: 'Best Cardiologist 2025', issuer: 'National Medical Awards' },
    { id: 2, title: 'Research Excellence Award', issuer: 'Indian Cardiology Society' },
  ];

  const contactInfo = doctor?.contact || {
    hospital: doctor?.hospital || 'Apollo Hospital',
    phone: doctor?.phone || '+91-22-1234-5678',
    email: doctor?.email || 'clinic@example.com',
    address: doctor?.address || 'Mumbai, India',
    hours: doctor?.clinic_hours || 'Mon-Fri 9:00 - 17:00',
  };

  const activityItems = posts.length > 0 ? posts : [
    {
      id: 101,
      title: 'Health awareness post',
      content: 'Early screening saves lives. Regular checkups help detect risks before symptoms appear.',
      likes: 84,
      comments: 12,
      time: '2h ago',
    },
    {
      id: 102,
      title: 'Certificate shared',
      content: 'Updated recent training certificate and continuing medical education milestone.',
      likes: 57,
      comments: 5,
      time: 'Yesterday',
    },
  ];

  return (
    <div>
      <Navbar />
      <main style={mainStyle}>
        <section style={heroCoverStyle}>
          <div style={heroOverlayStyle} />
          <div style={heroContentStyle}>
            <div style={heroInnerStyle}>
              <div style={heroLeftStyle}>
                <div style={profilePhotoStyle}>
                  <FaUserMd style={profileIconStyle} />
                </div>
                <div>
                  <div style={heroTitleRowStyle}>
                    <h1 style={heroNameStyle}>{doctor.name}</h1>
                    {doctor.verified && <FaCheckCircle style={verifiedIconStyle} />}
                  </div>
                  <p style={heroMetaStyle}>{doctor.qualifications || 'MBBS | MD'} · {doctor.specialty || 'Specialist'}</p>
                  <p style={heroMetaStyle}>{doctor.hospital || 'Apollo Hospital'} • {doctor.city || 'Mumbai'}</p>
                  <div style={heroStatsRowStyle}>
                    <span style={heroStatBadgeStyle}><FaStar /> 4.9</span>
                    <span style={heroStatBadgeStyle}><FaUsers /> {followerCount} followers</span>
                  </div>
                </div>
              </div>
              <div style={heroActionsStyle}>
                <button type="button" onClick={handleFollow} style={{ ...heroButtonStyle, background: isFollowing ? '#0f766e' : 'linear-gradient(135deg, #2563eb, #38bdf8)' }}>
                  <FaUserPlus /> {isFollowing ? 'Following' : 'Follow'}
                </button>
                <a href={`mailto:${doctor.email}`} style={{ ...heroButtonStyle, background: 'rgba(255,255,255,0.12)', textDecoration: 'none' }}>
                  <FaEnvelope /> Contact
                </a>
                <a href={`mailto:${doctor.email}`} style={{ ...heroButtonStyle, background: 'rgba(255,255,255,0.12)', textDecoration: 'none' }}>
                  Message
                </a>
              </div>
            </div>
          </div>
        </section>

        <div style={pageGridStyle}>
          <div style={leftColumnStyle}>
            {isOwner && (
              <section style={sectionCardStyle}>
                <div style={sectionHeaderStyle}>
                  <FaChartLine style={sectionIconStyle} />
                  <h2 style={sectionTitleStyle}>Analytics</h2>
                </div>
                <div style={analyticsGridStyle}>
                  <div style={analyticsCardStyle}>
                    <p style={analyticsLabelStyle}>Profile views</p>
                    <p style={analyticsValueStyle}>245</p>
                  </div>
                  <div style={analyticsCardStyle}>
                    <p style={analyticsLabelStyle}>Post impressions</p>
                    <p style={analyticsValueStyle}>8,412</p>
                  </div>
                  <div style={analyticsCardStyle}>
                    <p style={analyticsLabelStyle}>Followers</p>
                    <p style={analyticsValueStyle}>{followerCount}</p>
                  </div>
                  <div style={analyticsCardStyle}>
                    <p style={analyticsLabelStyle}>Search appearance</p>
                    <p style={analyticsValueStyle}>82</p>
                  </div>
                </div>
              </section>
            )}

            <section style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <FaUserMd style={sectionIconStyle} />
                <h2 style={sectionTitleStyle}>About</h2>
              </div>
              {aboutSections.map((item) => (
                <div key={item.title} style={infoRowStyle}>
                  <span style={infoLabelStyle}>{item.title}</span>
                  <p style={infoTextStyle}>{item.content}</p>
                </div>
              ))}
            </section>

            <section style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <FaHeart style={sectionIconStyle} />
                <h2 style={sectionTitleStyle}>Activity</h2>
              </div>
              {activityItems.map((item) => (
                <div key={item.id} style={postStyle}>
                  <div style={postHeaderStyle}>
                    <div>
                      <strong style={postTitleStyle}>{item.title}</strong>
                      <p style={postMetaStyle}>{item.time}</p>
                    </div>
                  </div>
                  <p style={postContentStyle}>{item.content}</p>
                  <div style={postActionsStyle}>
                    <span style={postActionItemStyle}><FaHeart /> {item.likes}</span>
                    <span style={postActionItemStyle}><FaComment /> {item.comments}</span>
                    <span style={postActionItemStyle}><FaShare /> Share</span>
                  </div>
                </div>
              ))}
            </section>

            <section style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <FaBriefcase style={sectionIconStyle} />
                <h2 style={sectionTitleStyle}>Experience</h2>
              </div>
              <div style={timelineListStyle}>
                {experienceItems.map((exp) => (
                  <div key={exp.id} style={timelineItemStyle}>
                    <strong style={timelineItemTitle}>{exp.title}</strong>
                    <p style={timelineItemMeta}>{exp.organisation} · {exp.period}</p>
                    <p style={timelineItemText}>{exp.details}</p>
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <FaGraduationCap style={sectionIconStyle} />
                <h2 style={sectionTitleStyle}>Education</h2>
              </div>
              <div style={timelineListStyle}>
                {educationItems.map((edu) => (
                  <div key={edu.id} style={timelineItemStyle}>
                    <strong style={timelineItemTitle}>{edu.degree}</strong>
                    <p style={timelineItemMeta}>{edu.school}</p>
                    <p style={timelineYearStyle}>{edu.year}</p>
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <FaTools style={sectionIconStyle} />
                <h2 style={sectionTitleStyle}>Skills</h2>
              </div>
              <div style={skillListStyle}>
                {skillsList.map((s, idx) => (
                  <span key={idx} style={skillChipStyle}>{s}</span>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <FaUserFriends style={sectionIconStyle} />
                <h2 style={sectionTitleStyle}>Patient Reviews</h2>
              </div>
              <div style={timelineListStyle}>
                {peerReviews.map((r) => (
                  <div key={r.id} style={timelineItemStyle}>
                    <strong style={timelineItemTitle}>{r.reviewer}</strong>
                    <p style={timelineItemText}>{r.content}</p>
                    <p style={timelineMetaText}>{new Date(r.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <FaFileAlt style={sectionIconStyle} />
                <h2 style={sectionTitleStyle}>Research & Publications</h2>
              </div>
              <div style={timelineListStyle}>
                {publications.map((p) => (
                  <div key={p.id} style={timelineItemStyle}>
                    <strong style={timelineItemTitle}>{p.title}</strong>
                    <p style={timelineItemMeta}>{p.journal} · {p.year}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside style={rightColumnStyle}>
            <section style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <FaUsers style={sectionIconStyle} />
                <h2 style={sectionTitleStyle}>Followers</h2>
              </div>
              <div style={followersListStyle}>
                {followList.map((follower) => (
                  <div key={follower.id} style={followerItemStyle}>
                    <div>
                      <strong style={followerNameStyle}>{follower.name}</strong>
                      <p style={followerRoleStyle}>{follower.role}</p>
                    </div>
                    <FaUserMd style={{ color: '#38bdf8' }} />
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <FaCalendarAlt style={sectionIconStyle} />
                <h2 style={sectionTitleStyle}>Verification Status</h2>
              </div>
              <div style={verificationStatusStyle}>
                {verificationTimeline.map((v) => (
                  <div key={v.id} style={verificationStatusItemStyle}>
                    <p style={verificationEventStyle}>{v.event}</p>
                    <span style={{ ...badgeStyle, background: v.status === 'Verified' ? 'rgba(16,185,129,0.18)' : 'rgba(248,219,116,0.12)' }}>{v.status}</span>
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <FaAward style={sectionIconStyle} />
                <h2 style={sectionTitleStyle}>Achievements</h2>
              </div>
              <div style={timelineListStyle}>
                {achievements.map((a) => (
                  <div key={a.id} style={timelineItemStyle}>
                    <strong style={timelineItemTitle}>{a.title}</strong>
                    <p style={timelineItemMeta}>{a.issuer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCardStyle}>
              <div style={sectionHeaderStyle}>
                <FaClinicMedical style={sectionIconStyle} />
                <h2 style={sectionTitleStyle}>Contact & Clinic</h2>
              </div>
              <div style={contactInfoStyle}>
                <div style={contactRowStyle}>
                  <span style={contactLabelStyle}>Hospital</span>
                  <span style={contactValueStyle}>{contactInfo.hospital}</span>
                </div>
                <div style={contactRowStyle}>
                  <span style={contactLabelStyle}>Phone</span>
                  <a href={`tel:${contactInfo.phone}`} style={contactLinkStyle}>{contactInfo.phone}</a>
                </div>
                <div style={contactRowStyle}>
                  <span style={contactLabelStyle}>Email</span>
                  <a href={`mailto:${contactInfo.email}`} style={contactLinkStyle}>{contactInfo.email}</a>
                </div>
                <div style={contactRowStyle}>
                  <span style={contactLabelStyle}>Address</span>
                  <span style={contactValueStyle}>{contactInfo.address}</span>
                </div>
                <div style={contactRowStyle}>
                  <span style={contactLabelStyle}>Hours</span>
                  <span style={contactValueStyle}>{contactInfo.hours}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {status && <p style={{ marginTop: '1.5rem', color: '#fca5a5' }}>{status}</p>}
      </main>
      <Footer />
    </div>
  );
};

const mainStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '3rem 1.5rem',
  color: '#e2e8f0',
};

const heroCoverStyle = {
  position: 'relative',
  minHeight: '340px',
  borderRadius: '1.75rem',
  overflow: 'hidden',
  backgroundImage: 'linear-gradient(135deg, rgba(14,116,144,0.9), rgba(15,23,42,0.85)), url(https://images.unsplash.com/photo-1580281657520-21b60f3f80d1?auto=format&fit=crop&w=1600&q=80)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxShadow: '0 25px 45px rgba(15, 23, 42, 0.24)',
  marginBottom: '2rem',
};

const heroOverlayStyle = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, rgba(15,23,42,0.45), rgba(15,23,42,0.85))',
};

const heroContentStyle = {
  position: 'relative',
  zIndex: 1,
  minHeight: '340px',
  display: 'flex',
  alignItems: 'center',
  padding: '2rem',
};

const heroInnerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  gap: '1.5rem',
  width: '100%',
  flexWrap: 'wrap',
};

const heroLeftStyle = {
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'center',
  minWidth: '320px',
};

const profilePhotoStyle = {
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(56,189,248,0.8), rgba(37,99,235,0.9))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 18px 35px rgba(15,23,42,0.25)',
};

const profileIconStyle = {
  fontSize: '3rem',
  color: 'white',
};

const heroTitleRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  flexWrap: 'wrap',
};

const heroNameStyle = {
  fontSize: 'clamp(2rem, 2.8vw, 3rem)',
  margin: 0,
  color: 'white',
};

const verifiedIconStyle = {
  color: '#22c55e',
  fontSize: '1.3rem',
};

const heroMetaStyle = {
  margin: '0.4rem 0',
  color: '#cbd5e1',
  fontSize: '0.95rem',
};

const heroStatsRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  marginTop: '1rem',
};

const heroStatBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  background: 'rgba(255,255,255,0.12)',
  padding: '0.6rem 0.9rem',
  borderRadius: '999px',
  color: 'white',
  fontWeight: 600,
};

const heroActionsStyle = {
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
  marginTop: '1rem',
};

const heroButtonStyle = {
  padding: '0.9rem 1.4rem',
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.18)',
  color: 'white',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
};

const pageGridStyle = {
  display: 'grid',
  gridTemplateColumns: '72% 28%',
  gap: '1.5rem',
  alignItems: 'flex-start',
};

const leftColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const rightColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const sectionHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '1rem',
};

const sectionIconStyle = {
  color: '#38bdf8',
  fontSize: '1.1rem',
};

const analyticsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '1rem',
};

const analyticsCardStyle = {
  background: 'rgba(15,23,42,0.8)',
  borderRadius: '1rem',
  padding: '1rem',
  border: '1px solid rgba(71,85,105,0.2)',
};

const analyticsLabelStyle = {
  margin: 0,
  color: '#94a3b8',
  fontSize: '0.9rem',
};

const analyticsValueStyle = {
  margin: '0.75rem 0 0',
  color: '#f8fafc',
  fontSize: '1.6rem',
  fontWeight: 700,
};

const infoLabelStyle = {
  color: '#94a3b8',
  width: '170px',
  fontWeight: 600,
};

const infoTextStyle = {
  color: '#f8fafc',
  margin: 0,
  maxWidth: 'calc(100% - 170px)',
  textAlign: 'right',
};

const timelineListStyle = {
  display: 'grid',
  gap: '0.75rem',
};

const timelineItemStyle = {
  padding: '0.85rem 1rem',
  borderRadius: '1rem',
  background: 'rgba(15,23,42,0.76)',
  border: '1px solid rgba(71,85,105,0.16)',
};

const timelineItemTitle = {
  color: '#f8fafc',
  margin: 0,
};

const timelineItemMeta = {
  color: '#94a3b8',
  margin: '0.35rem 0 0',
};

const timelineYearStyle = {
  color: '#94a3b8',
  margin: '0.35rem 0 0',
};

const timelineItemText = {
  color: '#cbd5e1',
  margin: '0.5rem 0 0',
};

const timelineMetaText = {
  color: '#6b7280',
  margin: '0.5rem 0 0',
  fontSize: '0.85rem',
};

const skillListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
};

const skillChipStyle = {
  padding: '0.6rem 0.9rem',
  borderRadius: '999px',
  background: 'rgba(56,189,248,0.12)',
  color: '#e6f7ff',
  fontWeight: 600,
};

const followersListStyle = {
  display: 'grid',
  gap: '0.85rem',
};

const followerItemStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.9rem 0',
  borderBottom: '1px solid rgba(71,85,105,0.16)',
};

const followerNameStyle = {
  margin: 0,
  color: '#f8fafc',
  fontWeight: 600,
};

const followerRoleStyle = {
  margin: '0.2rem 0 0',
  color: '#94a3b8',
  fontSize: '0.9rem',
};

const verificationStatusStyle = {
  display: 'grid',
  gap: '0.7rem',
};

const verificationStatusItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  borderRadius: '0.9rem',
  background: 'rgba(15,23,42,0.76)',
  border: '1px solid rgba(71,85,105,0.14)',
};

const verificationEventStyle = {
  margin: 0,
  color: '#f8fafc',
  fontSize: '0.95rem',
};

const contactInfoStyle = {
  display: 'grid',
  gap: '0.7rem',
};

const contactRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const contactLabelStyle = {
  color: '#94a3b8',
  fontSize: '0.95rem',
};

const contactValueStyle = {
  color: '#f8fafc',
  textAlign: 'right',
};

const contactLinkStyle = {
  color: '#f8fafc',
  textDecoration: 'none',
};

const postTitleStyle = {
  color: '#f8fafc',
  margin: 0,
};

const postMetaStyle = {
  color: '#94a3b8',
  margin: '0.3rem 0 0',
  fontSize: '0.9rem',
};

const postContentStyle = {
  margin: '1rem 0 0',
  color: '#cbd5e1',
  lineHeight: 1.7,
};

const postActionsStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',
  flexWrap: 'wrap',
  color: '#38bdf8',
};

const postActionItemStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
};

const postHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  flexWrap: 'wrap',
};

const sectionCardStyle = {
  borderRadius: '1rem',
  border: '1px solid rgba(71, 85, 105, 0.3)',
  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.92), rgba(15, 23, 42, 0.78))',
  backdropFilter: 'blur(10px)',
  padding: '1.5rem',
  boxShadow: '0 20px 35px rgba(2, 8, 23, 0.24)',
};

const sectionTitleStyle = {
  fontSize: '1.15rem',
  fontWeight: '700',
  color: 'white',
  margin: 0,
};

const infoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
  alignItems: 'flex-start',
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

const certCardStyle = {
  padding: '0.8rem 1rem',
  borderRadius: '0.9rem',
  border: '1px solid rgba(56, 189, 248, 0.16)',
  background: 'rgba(15, 23, 42, 0.76)',
};

const badgeStyle = {
  padding: '0.35rem 0.65rem',
  borderRadius: '999px',
  color: '#f8fafc',
  fontSize: '0.8rem',
  fontWeight: 700,
};

export default DoctorProfile;
