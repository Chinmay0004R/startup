import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { fetchPosts, createPost, likePost, fetchUserStatistics, fetchUserFollowingDoctors, fetchUserComplaintHistory } from '../services/api';
import { FaEllipsisH, FaThumbsUp, FaComment, FaShare, FaBookmark, FaHistory, FaUserMd, FaTimes } from 'react-icons/fa';

const Dashboard = ({ currentRole, currentUserEmail, authToken, onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [followingDoctors, setFollowingDoctors] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  const token = localStorage.getItem('authToken');
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    const userImage = localStorage.getItem('userProfileImage');
    
    if (userName) {
      setUser({
        name: userName,
        email: currentUserEmail,
        role: currentRole,
        profileImage: userImage || '',
        bio: '',
        city: '',
        followers: 0,
        following: 0,
        posts: 0,
      });
    }

    // Load posts from backend
    const load = async () => {
      setIsLoadingPosts(true);
      try {
        const data = await fetchPosts(token);
        // backend returns array of posts (or null)
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load posts', err);
        setPosts([]);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    load();
  }, [currentUserEmail, currentRole]);

  // Load user statistics
  useEffect(() => {
    const loadStats = async () => {
      if (!userId || !token) return;
      
      setIsLoadingStats(true);
      try {
        const [stats, doctors, complaintHistory] = await Promise.all([
          fetchUserStatistics(userId, token),
          fetchUserFollowingDoctors(userId, token),
          fetchUserComplaintHistory(userId, token),
        ]);
        
        setUserStats(stats);
        setFollowingDoctors(Array.isArray(doctors) ? doctors : []);
        setComplaints(Array.isArray(complaintHistory) ? complaintHistory : []);
        
        // Update user with real stats
        if (stats) {
          setUser(prev => prev ? {
            ...prev,
            followers: stats.followers || 0,
            following: stats.following || 0,
            posts: stats.posts || 0,
          } : null);
        }
      } catch (error) {
        console.error('Failed to load user statistics:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, [userId, token]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setIsLoadingPosts(true);
    try {
      const payload = { author_name: user?.name || 'Anonymous', content: newPost };
      const created = await createPost(payload, authToken);
      if (created) {
        setPosts((p) => [created, ...(p || [])]);
      }
      setNewPost('');
    } catch (err) {
      console.error('Create post failed', err);
      alert('Failed to publish post');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleEditProfile = () => {
    if (currentRole === 'doctor') {
      navigate('/doctor-setup');
    } else {
      navigate('/user-profile');
    }
  };

  const handleViewProfile = () => {
    if (currentRole === 'doctor') {
      navigate('/doctors');
    } else {
      navigate('/user-profile');
    }
  };

  const dashboardStyle = {
    display: 'grid',
    gridTemplateColumns: '300px 1fr 320px',
    gap: '1.5rem',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1rem',
  };

  const sidebarStyle = {
    position: 'sticky',
    top: '80px',
    height: 'fit-content',
  };

  const cardStyle = {
    background: 'var(--color-frost-white)',
    borderRadius: '1rem',
    border: '1px solid var(--color-charcoal-ink)',
    padding: '1.5rem',
    boxShadow: 'var(--shadow-hard)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  };

  const profileCardStyle = {
    ...cardStyle,
    textAlign: 'center',
  };

  const profileImageStyle = {
    width: '88px',
    height: '88px',
    borderRadius: '1rem',
    background: 'var(--color-sky-crayon)',
    margin: '0 auto 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '2.25rem',
    fontWeight: '700',
    boxShadow: 'var(--shadow-hard)',
  };

  const profileNameStyle = {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--color-charcoal-ink)',
    marginBottom: '0.25rem',
  };

  const profileRoleStyle = {
    fontSize: '0.9rem',
    color: 'var(--color-pencil-gray)',
    marginBottom: '0.75rem',
    textTransform: 'capitalize',
    fontWeight: '500',
  };

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '1.25rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid rgba(148, 163, 184, 0.35)',
  };

  const statStyle = {
    textAlign: 'center',
  };

  const statNumberStyle = {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: 'var(--color-sky-crayon)',
  };

  const statLabelStyle = {
    fontSize: '0.8rem',
    color: 'var(--color-pencil-gray)',
    marginTop: '0.25rem',
    fontWeight: '600',
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    marginTop: '1rem',
    background: 'var(--color-sky-crayon)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: 'var(--shadow-hard)',
  };

  const feedContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const createPostStyle = {
    ...cardStyle,
  };

  const createPostInputStyle = {
    width: '100%',
    padding: '1rem',
    border: '1px solid var(--color-charcoal-ink)',
    borderRadius: '0.75rem',
    backgroundColor: 'var(--color-frost-white)',
    fontSize: '1rem',
    fontFamily: 'inherit',
    color: 'var(--color-charcoal-ink)',
    resize: 'vertical',
    minHeight: '100px',
    transition: 'all 0.3s ease',
  };

  const postStyle = {
    ...cardStyle,
  };

  const postHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  };

  const postAuthorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const postAvatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '0.75rem',
    background: 'var(--color-sky-crayon)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '0.9rem',
  };

  const postNameStyle = {
    fontWeight: '700',
    color: 'var(--color-charcoal-ink)',
    fontSize: '0.95rem',
  };

  const postMetaStyle = {
    fontSize: '0.85rem',
    color: 'var(--color-pencil-gray)',
  };

  const postContentStyle = {
    marginBottom: '1rem',
    color: 'var(--color-pencil-gray)',
    lineHeight: '1.7',
    fontSize: '0.95rem',
  };

  const postActionsStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(148, 163, 184, 0.35)',
  };

  const actionButtonStyle = {
    flex: 1,
    padding: '0.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: 'var(--color-pencil-gray)',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
    borderRadius: '0.5rem',
  };

  const newsContainerStyle = {
    ...cardStyle,
  };

  const newsTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: 'var(--color-charcoal-ink)',
    marginBottom: '1rem',
  };

  const newsItemStyle = {
    paddingBottom: '1rem',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(148, 163, 184, 0.35)',
  };

  const newsItemLastStyle = {
    paddingBottom: 0,
    marginBottom: 0,
    borderBottom: 'none',
  };

  const newsHeadlineStyle = {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '0.25rem',
    cursor: 'pointer',
  };

  const newsSourceStyle = {
    fontSize: '0.8rem',
    color: '#718096',
  };

  const responsiveDashboardStyle = window.innerWidth < 1024
    ? {
        ...dashboardStyle,
        gridTemplateColumns: '1fr',
      }
    : dashboardStyle;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Navbar 
        userName={user?.name}
        onLogout={onLogout}
        currentRole={currentRole}
      />

      <div style={responsiveDashboardStyle}>
        {/* Left Sidebar - Profile Card */}
        <div style={sidebarStyle}>
          <div style={profileCardStyle}>
            <div style={profileImageStyle}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={profileNameStyle}>{user?.name}</div>
            <div style={profileRoleStyle}>{currentRole}</div>
            {user?.bio ? (
              <p style={{ color: '#718096', fontSize: '0.9rem' }}>{user?.bio}</p>
            ) : (
              <p style={{ color: 'var(--color-pencil-gray)', fontSize: '0.9rem' }}>Add more details in your profile.</p>
            )}
            
            <div style={statsStyle}>
              <div style={statStyle}>
                <div style={statNumberStyle}>{user?.followers || 0}</div>
                <div style={statLabelStyle}>Followers</div>
              </div>
              <div style={statStyle}>
                <div style={statNumberStyle}>{user?.following || 0}</div>
                <div style={statLabelStyle}>Following</div>
              </div>
            </div>

            <button style={buttonStyle} onClick={handleEditProfile}>Edit Profile</button>
            <button style={{...buttonStyle, background: '#e2e8f0', color: '#4a5568', marginTop: '0.5rem'}} onClick={handleViewProfile}>
              View Profile
            </button>
          </div>
        </div>

        {/* Center - Social Feed */}
        <div style={feedContainerStyle}>
          {/* Create Post */}
          <div style={createPostStyle}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#667eea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                flexShrink: 0,
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <textarea
                style={createPostInputStyle}
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button style={{...buttonStyle, width: 'auto', marginTop: 0, padding: '0.5rem 1.5rem'}} onClick={handleCreatePost} disabled={isLoadingPosts}>
                {isLoadingPosts ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          {isLoadingPosts && !posts.length ? (
            <div style={postStyle}>Loading posts...</div>
          ) : posts.length === 0 ? (
            <div style={postStyle}>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>What's on your mind?</div>
              <p style={{ color: 'var(--color-pencil-gray)' }}>(No posts yet)</p>
              <p style={{ color: '#718096', marginTop: '0.5rem' }}>Be the first to share something.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} style={postStyle}>
              <div style={postHeaderStyle}>
                <div style={postAuthorStyle}>
                  <div style={postAvatarStyle}>
                    {(post.author_name || post.author || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={postNameStyle}>{post.author_name || post.author}</div>
                    <div style={postMetaStyle}>{post.role || ''} • {post.created_at ? new Date(post.created_at).toLocaleString() : post.time || ''}</div>
                  </div>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                  <FaEllipsisH color="#718096" />
                </button>
              </div>

              <div style={postContentStyle}>{post.content}</div>

              <div style={postActionsStyle}>
                <button style={actionButtonStyle} onClick={async () => {
                  try {
                    const updated = await likePost(post.id, authToken);
                    setPosts((prev) => prev.map(p => p.id === post.id ? updated : p));
                  } catch (e) {
                    console.error('Like failed', e);
                  }
                }}>
                  <FaThumbsUp /> {post.likes || 0}
                </button>
                <button style={actionButtonStyle}>
                  <FaComment /> {post.comments || 0}
                </button>
                <button style={actionButtonStyle}>
                  <FaShare /> Share
                </button>
                <button style={actionButtonStyle}>
                  <FaBookmark />
                </button>
              </div>
              </div>
            ))
          )}
        </div>

        {/* Right Sidebar - User Statistics */}
        <div style={sidebarStyle}>
          {/* Statistics Card */}
          <div style={cardStyle}>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a202c', marginBottom: '1rem' }}>Your Activity</div>
            {isLoadingStats ? (
              <p style={{ color: 'var(--color-pencil-gray)' }}>Loading...</p>
            ) : userStats ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#f0f4ff', borderRadius: '0.5rem' }}>
                  <p style={{ color: '#718096', margin: '0 0 0.25rem 0', fontSize: '0.8rem' }}>Complaints</p>
                  <p style={{ color: '#667eea', margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>{userStats.complaints_submitted}</p>
                </div>
                <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem' }}>
                  <p style={{ color: '#718096', margin: '0 0 0.25rem 0', fontSize: '0.8rem' }}>Following</p>
                  <p style={{ color: 'var(--color-sky-crayon)', margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>{userStats.following_doctors}</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Saved Doctors Section */}
          {followingDoctors.length > 0 && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <FaUserMd style={{ color: '#667eea' }} />
                <div style={newsTitleStyle}>Followed Doctors</div>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {followingDoctors.slice(0, 5).map((doctor) => (
                  <div key={doctor.id} style={{
                    padding: '0.75rem',
                    backgroundColor: '#f7fafc',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    borderLeft: '3px solid #667eea'
                  }} onClick={() => navigate(`/doctors/${doctor.id}`)}>
                    <p style={{ color: '#1a202c', margin: '0 0 0.25rem 0', fontWeight: '600', fontSize: '0.9rem' }}>{doctor.name}</p>
                    <p style={{ color: '#718096', margin: 0, fontSize: '0.8rem' }}>{doctor.specialization}</p>
                  </div>
                ))}
              </div>
              {followingDoctors.length > 5 && (
                <p style={{ color: '#667eea', margin: '0.75rem 0 0 0', fontSize: '0.85rem', cursor: 'pointer' }}>
                  +{followingDoctors.length - 5} more doctors
                </p>
              )}
            </div>
          )}

          {/* Complaint History Section */}
          {complaints.length > 0 && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <FaHistory style={{ color: '#667eea' }} />
                <div style={newsTitleStyle}>Recent Complaints</div>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {complaints.slice(0, 3).map((complaint) => (
                  <div key={complaint.id} style={{
                    padding: '0.75rem',
                    backgroundColor: '#f7fafc',
                    borderRadius: '0.5rem',
                    borderLeft: '3px solid #ef4444'
                  }}>
                    <p style={{ color: '#1a202c', margin: '0 0 0.25rem 0', fontWeight: '600', fontSize: '0.9rem' }}>{complaint.category}</p>
                    <p style={{ color: '#718096', margin: '0 0 0.25rem 0', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {complaint.details}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-pencil-gray)' }}>
                        {complaint.status}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-pencil-gray)' }}>
                        {new Date(complaint.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News Card - Fallback if no data */}
          {!userStats && (
            <div style={newsContainerStyle}>
              <div style={newsTitleStyle}>Doctor News</div>
              <p style={{ color: 'var(--color-pencil-gray)', margin: 0 }}>No updates are available yet.</p>
              <p style={{ color: '#718096', marginTop: '0.5rem', fontSize: '0.9rem' }}>New medical updates will appear here when they are available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

