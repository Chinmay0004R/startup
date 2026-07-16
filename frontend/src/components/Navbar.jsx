import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStethoscope, FaHome, FaUsers, FaUser, FaSignOutAlt, FaBars, FaTimes, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const Navbar = ({ userName, onLogout, currentRole }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    setShowProfileMenu(false);
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <div className="brand-badge">
            <FaStethoscope />
          </div>
          <div className="brand-copy">
            <span className="brand-name">DoctorTrust</span>
            <span className="brand-tag">Care network</span>
          </div>
        </div>

        <div className="navbar-center desktop-only">
          <button className="nav-link" onClick={() => navigate('/dashboard')}>
            <FaHome /> Home
          </button>
          <button className="nav-link" onClick={() => navigate('/search')}>
            <FaSearch /> Search
          </button>
          <button className="nav-link" onClick={() => navigate('/doctors')}>
            <FaUsers /> Doctors
          </button>
          <button className="nav-link nav-sos-link" onClick={() => navigate('/sos')}>
            <FaExclamationTriangle /> SOS
          </button>
        </div>

        <div className="navbar-actions">
          <button className="nav-sos-btn" onClick={() => navigate('/sos')}>
            <FaExclamationTriangle /> SOS
          </button>

          <div className="profile-menu-anchor">
            <button className="profile-button" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </button>
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <p>{userName || 'User'}</p>
                  <span>{currentRole || 'guest'}</span>
                </div>
                <button className="profile-menu-item" onClick={() => { setShowProfileMenu(false); navigate('/dashboard'); }}>
                  <FaUser /> Dashboard
                </button>
                <button className="profile-menu-item" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>

          <button className="mobile-only nav-link" onClick={() => setShowMobileMenu((prev) => !prev)}>
            {showMobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="mobile-nav">
          <button className="nav-link" onClick={() => { setShowMobileMenu(false); navigate('/dashboard'); }}>
            <FaHome /> Home
          </button>
          <button className="nav-link" onClick={() => { setShowMobileMenu(false); navigate('/search'); }}>
            <FaSearch /> Search
          </button>
          <button className="nav-link" onClick={() => { setShowMobileMenu(false); navigate('/doctors'); }}>
            <FaUsers /> Doctors
          </button>
          <button className="nav-link nav-sos-link" onClick={() => { setShowMobileMenu(false); navigate('/sos'); }}>
            <FaExclamationTriangle /> SOS
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

