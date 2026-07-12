import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaEllipsisH, FaThumbsUp, FaComment, FaShare, FaBookmark } from 'react-icons/fa';

const Dashboard = ({ currentRole, currentUserEmail, authToken, onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    const userImage = localStorage.getItem('userProfileImage');
    
    if (userName) {
      setUser({
        name: userName,
        email: currentUserEmail,
        role: currentRole,
        profileImage: userImage || 'https://via.placeholder.com/64',
        bio: 'Welcome to Healthcare Hub',
        city: 'Your City',
        followers: 0,
        following: 0,
        posts: 0,
      });
    }

    // Load sample posts
    setPosts([
      {
        id: 1,
        author: 'Dr. Rahul Sharma',
        role: 'Cardiologist',
        time: '2 hours ago',
        content: 'Just completed a successful cardiac surgery. Grateful for my amazing team!',
        likes: 124,
        comments: 18,
        image: null,
      },
      {
        id: 2,
        author: 'Dr. Priya Singh',
        role: 'Pediatrician',
        time: '5 hours ago',
        content: 'New research on childhood immunization shows promising results...',
        likes: 89,
        comments: 24,
        image: null,
      },
    ]);
  }, [currentUserEmail, currentRole]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setIsLoadingPosts(true);
    // Simulating post creation
    setTimeout(() => {
      const post = {
        id: posts.length + 1,
        author: user?.name || 'Anonymous',
        role: currentRole,
        time: 'now',
        content: newPost,
        likes: 0,
        comments: 0,
        image: null,
      };
      setPosts([post, ...posts]);
      setNewPost('');
      setIsLoadingPosts(false);
    }, 500);
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
    background: 'white',
    borderRadius: '1rem',
    border: '1px solid #e2e8f0',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const profileCardStyle = {
    ...cardStyle,
    textAlign: 'center',
  };

  const profileImageStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#667eea',
    margin: '0 auto 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '2rem',
  };

  const profileNameStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '0.25rem',
  };

  const profileRoleStyle = {
    fontSize: '0.9rem',
    color: '#718096',
    marginBottom: '0.75rem',
  };

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e2e8f0',
  };

  const statStyle = {
    textAlign: 'center',
  };

  const statNumberStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#667eea',
  };

  const statLabelStyle = {
    fontSize: '0.8rem',
    color: '#718096',
    marginTop: '0.25rem',
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    marginTop: '1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
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
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem',
    backgroundColor: '#f7fafc',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '80px',
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
    borderRadius: '50%',
    backgroundColor: '#667eea',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
  };

  const postNameStyle = {
    fontWeight: '600',
    color: '#1a202c',
  };

  const postMetaStyle = {
    fontSize: '0.85rem',
    color: '#718096',
  };

  const postContentStyle = {
    marginBottom: '1rem',
    color: '#2d3748',
    lineHeight: '1.6',
  };

  const postActionsStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: '1rem',
    borderTop: '1px solid #e2e8f0',
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
    color: '#718096',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  };

  const newsContainerStyle = {
    ...cardStyle,
  };

  const newsTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '1rem',
  };

  const newsItemStyle = {
    paddingBottom: '1rem',
    marginBottom: '1rem',
    borderBottom: '1px solid #e2e8f0',
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
            <p style={{ color: '#718096', fontSize: '0.9rem' }}>{user?.bio}</p>
            
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
          {posts.map((post) => (
            <div key={post.id} style={postStyle}>
              <div style={postHeaderStyle}>
                <div style={postAuthorStyle}>
                  <div style={postAvatarStyle}>
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={postNameStyle}>{post.author}</div>
                    <div style={postMetaStyle}>{post.role} • {post.time}</div>
                  </div>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                  <FaEllipsisH color="#718096" />
                </button>
              </div>

              <div style={postContentStyle}>{post.content}</div>

              <div style={postActionsStyle}>
                <button style={actionButtonStyle}>
                  <FaThumbsUp /> {post.likes}
                </button>
                <button style={actionButtonStyle}>
                  <FaComment /> {post.comments}
                </button>
                <button style={actionButtonStyle}>
                  <FaShare /> Share
                </button>
                <button style={actionButtonStyle}>
                  <FaBookmark />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar - Doctor News */}
        <div style={sidebarStyle}>
          <div style={newsContainerStyle}>
            <div style={newsTitleStyle}>Doctor News</div>

            <div style={newsItemStyle}>
              <div style={newsHeadlineStyle}>New WHO Guidelines Released</div>
              <div style={newsSourceStyle}>WHO • 2 hours ago</div>
            </div>

            <div style={newsItemStyle}>
              <div style={newsHeadlineStyle}>AI Detects Cancer 40% Earlier</div>
              <div style={newsSourceStyle}>Medical Research • 4 hours ago</div>
            </div>

            <div style={newsItemStyle}>
              <div style={newsHeadlineStyle}>Diabetes Treatment Breakthrough</div>
              <div style={newsSourceStyle}>Healthcare News • 6 hours ago</div>
            </div>

            <div style={newsItemStyle}>
              <div style={newsHeadlineStyle}>New Vaccine Approved</div>
              <div style={newsSourceStyle}>FDA Updates • 8 hours ago</div>
            </div>

            <div style={newsItemLastStyle}>
              <div style={newsHeadlineStyle}>Medical Conference 2024</div>
              <div style={newsSourceStyle}>Events • 10 hours ago</div>
            </div>

            <button style={{...buttonStyle, width: '100%', marginTop: '1rem'}}>
              See More News
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

