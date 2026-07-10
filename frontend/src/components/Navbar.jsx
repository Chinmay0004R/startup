import { NavLink } from 'react-router-dom';
import { FaStethoscope, FaHome, FaUsers, FaLifeRing, FaSignInAlt } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid rgba(71, 85, 105, 0.3)',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Logo */}
        <NavLink to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          color: 'inherit'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '0.5rem',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)'
          }}>
            <FaStethoscope style={{ color: 'white', fontSize: '1.125rem' }} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              DoctorTrust
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Medical Network</p>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#cbd5e1'
        }}>
          <NavLink to="/" style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            textDecoration: 'none',
            color: isActive ? '#93c5fd' : '#cbd5e1',
            backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
            border: `1px solid ${isActive ? 'rgba(37, 99, 235, 0.3)' : 'transparent'}`,
            transition: 'all 0.3s ease'
          })}>
            <FaHome /> Home
          </NavLink>
          <NavLink to="/doctors" style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            textDecoration: 'none',
            color: isActive ? '#93c5fd' : '#cbd5e1',
            backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
            border: `1px solid ${isActive ? 'rgba(37, 99, 235, 0.3)' : 'transparent'}`,
            transition: 'all 0.3s ease'
          })}>
            <FaUsers /> Doctors
          </NavLink>
          <NavLink to="/support" style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            textDecoration: 'none',
            color: isActive ? '#93c5fd' : '#cbd5e1',
            backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
            border: `1px solid ${isActive ? 'rgba(37, 99, 235, 0.3)' : 'transparent'}`,
            transition: 'all 0.3s ease'
          })}>
            <FaLifeRing /> Support
          </NavLink>
          <NavLink to="/login" style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            textDecoration: 'none',
            color: isActive ? '#93c5fd' : '#cbd5e1',
            backgroundColor: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
            border: `1px solid ${isActive ? 'rgba(37, 99, 235, 0.3)' : 'transparent'}`,
            transition: 'all 0.3s ease'
          })}>
            <FaSignInAlt /> Login
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
