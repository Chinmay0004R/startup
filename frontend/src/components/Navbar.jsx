import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStethoscope, FaHome, FaUsers, FaBell, FaUser, FaSignOutAlt, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ userName, onLogout, currentRole }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navbarStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
  };

  const logoBadgeStyle = {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.1rem',
  };

  const logoTextStyle = {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#1a202c',
  };

  const searchBarStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '2rem',
    padding: '0.5rem 1rem',
    width: '250px',
    margin: '0 2rem',
  };

  const searchInputStyle = {
    background: 'none',
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
  };

  const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const navLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    color: '#4a5568',
    textDecoration: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: 'none',
    border: 'none',
    fontSize: '0.95rem',
  };

  const navLinkHoverStyle = {
    color: '#667eea',
    backgroundColor: '#f0f4ff',
  };

  const profileMenuStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    marginTop: '0.5rem',
    minWidth: '200px',
    zIndex: 50,
  };

  const profileMenuItemStyle = {
    padding: '0.75rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#4a5568',
    textDecoration: 'none',
    cursor: 'pointer',
    borderBottom: '1px solid #e2e8f0',
    transition: 'all 0.2s',
  };

  const profileMenuItemLastStyle = {
    borderBottom: 'none',
  };

  const mobileMenuStyle = {
    display: 'none',
  };

  const mobileMenuButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.5rem',
    color: '#4a5568',
  };

  const userInitialStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    cursor: 'pointer',
  };

  return (
    <nav style={navbarStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <div style={logoStyle} onClick={() => navigate('/dashboard')}>
          <div style={logoBadgeStyle}>
            <FaStethoscope />
          </div>
          <div style={logoTextStyle}>
            <span>Healthcare</span>
            <span style={{ fontSize: '0.7rem', color: '#718096' }}>Hub</span>
          </div>
        </div>

        {/* Search Bar - Hidden on Mobile */}
        <div style={{...searchBarStyle, display: 'none', '@media (min-width: 768px)': { display: 'flex' } }}>
          <FaSearch color="#718096" />
          <input
            type="text"
            placeholder="Search doctors, posts..."
            style={searchInputStyle}
          />
        </div>

        {/* Desktop Nav Links */}
        <div style={{...navLinksStyle, display: 'none', '@media (min-width: 768px)': { display: 'flex' } }}>
          <button 
            style={navLinkStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, navLinkHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, navLinkStyle)}
            onClick={() => navigate('/dashboard')}
          >
            <FaHome /> Home
          </button>
          <button 
            style={navLinkStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, navLinkHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, navLinkStyle)}
            onClick={() => navigate('/dashboard')}
          >
            <FaUsers /> Doctors
          </button>
          <button 
            style={navLinkStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, navLinkHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, navLinkStyle)}
            onClick={() => navigate('/dashboard')}
          >
            <FaBell /> Messages
          </button>
          <button 
            style={navLinkStyle}
            onMouseEnter={(e) => Object.assign(e.target.style, navLinkHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, navLinkStyle)}
            onClick={() => navigate('/dashboard')}
          >
            <FaBell /> Notifications
          </button>
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Profile Menu */}
          <div style={{ position: 'relative' }}>
            <div
              style={userInitialStyle}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>

            {showProfileMenu && (
              <div style={profileMenuStyle}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1a202c' }}>{userName}</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#718096', textTransform: 'capitalize' }}>{currentRole}</p>
                </div>
                <a href="/dashboard" style={profileMenuItemStyle}>
                  <FaUser /> View Profile
                </a>
                <button
                  style={{...profileMenuItemStyle, ...profileMenuItemLastStyle, background: 'none', border: 'none', width: '100%', justifyContent: 'flex-start'}}
                  onClick={handleLogout}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#fff5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            style={{...mobileMenuButtonStyle, display: 'none', '@media (max-width: 767px)': { display: 'block' } }}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div style={{
          background: 'white',
          borderTop: '1px solid #e2e8f0',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          <button style={{...navLinkStyle, justifyContent: 'flex-start'}} onClick={() => navigate('/dashboard')}>
            <FaHome /> Home
          </button>
          <button style={{...navLinkStyle, justifyContent: 'flex-start'}} onClick={() => navigate('/dashboard')}>
            <FaUsers /> Doctors
          </button>
          <button style={{...navLinkStyle, justifyContent: 'flex-start'}} onClick={() => navigate('/dashboard')}>
            <FaBell /> Messages
          </button>
          <button style={{...navLinkStyle, justifyContent: 'flex-start'}} onClick={() => navigate('/dashboard')}>
            <FaBell /> Notifications
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

