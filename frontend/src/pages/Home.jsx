import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import DoctorCard from '../components/DoctorCard';
import Footer from '../components/Footer';
import { fetchDoctors } from '../services/api';
import { FaShieldAlt, FaCheckDouble, FaPhone, FaExclamationTriangle } from 'react-icons/fa';

const Home = ({ health }) => {
  const featuredDoctors = [
    {
      name: 'Dr. Sara Khan',
      specialty: 'Cardiology',
      hospital: 'City General Hospital',
      verified: true,
      yearsExperience: 12,
    },
    {
      name: 'Dr. Ali Hassan',
      specialty: 'Emergency Medicine',
      hospital: 'SafeCare Clinic',
      verified: true,
      yearsExperience: 15,
    },
    {
      name: 'Dr. Ayesha Malik',
      specialty: 'Pediatrics',
      hospital: 'Bright Children Hospital',
      verified: true,
      yearsExperience: 9,
    },
  ];

  const [doctors, setDoctors] = useState(featuredDoctors);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await fetchDoctors();
        if (Array.isArray(data) && data.length > 0) {
          setDoctors(data);
        }
      } catch (error) {
        setDoctors(featuredDoctors);
      }
    };

    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return [doctor.name, doctor.specialty, doctor.hospital, doctor.registration_number, doctor.registrationNumber]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  const mainStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
  };

  const heroSectionStyle = {
    marginBottom: '4rem',
    animation: 'fadeInUp 0.6s ease-out',
  };

  const heroBoxStyle = {
    borderRadius: '1.875rem',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    background: 'linear-gradient(to bottom right, rgba(7, 89, 133, 0.4), rgba(2, 6, 23, 1))',
    padding: '2rem',
    boxShadow: '0 25px 50px rgba(7, 89, 133, 0.2)',
    backdropFilter: 'blur(10px)',
  };

  const heroHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  };

  const badgeStyle = {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
    color: '#60a5fa',
  };

  const heroTitleStyle = {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '1rem',
    lineHeight: '1.3',
  };

  const heroDescriptionStyle = {
    fontSize: '1.125rem',
    color: '#cbd5e1',
    maxWidth: '48rem',
    marginBottom: '2rem',
  };

  const featureBadgesStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  };

  const featureBadgeStyle = (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: '9999px',
    border: `1px solid rgba(${color}, 0.4)`,
    backgroundColor: `rgba(${color}, 0.1)`,
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: `rgb(${color})`,
  });

  const statusStyle = {
    marginTop: '2rem',
    fontSize: '0.875rem',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const statusDotStyle = {
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  };

  const statusTextStyle = {
    fontWeight: '600',
    color: '#34d399',
  };

  const doctorsSectionStyle = {
    marginBottom: '4rem',
  };

  const sectionHeaderStyle = {
    marginBottom: '2rem',
  };

  const sectionTitleStyle = {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '0.5rem',
  };

  const sectionDescriptionStyle = {
    color: '#94a3b8',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  };

  const featuresSectionStyle = {
    marginBottom: '4rem',
  };

  const featuresGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem',
  };

  const featureCardStyle = (hoverColor) => ({
    borderRadius: '1rem',
    border: `1px solid rgba(71, 85, 105, 0.3)`,
    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.6))',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  });

  const iconBoxStyle = (bgColor) => ({
    width: '3rem',
    height: '3rem',
    borderRadius: '0.75rem',
    backgroundColor: `rgba(${bgColor}, 0.1)`,
    border: `1px solid rgba(${bgColor}, 0.2)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    color: `rgb(${bgColor})`,
    fontSize: '1.125rem',
  });

  const featureTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '0.5rem',
  };

  const featureDescriptionStyle = {
    color: '#94a3b8',
  };

  const cardAnimationStyle = (idx) => ({
    animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
  });

  return (
    <div>
      <Navbar />
      <main style={mainStyle}>
        {/* Hero Section */}
        <section style={heroSectionStyle}>
          <div style={heroBoxStyle}>
            <div style={heroHeaderStyle}>
              <FaShieldAlt style={{ fontSize: '1.5rem', color: '#60a5fa' }} />
              <span style={badgeStyle}>Secure Healthcare Network</span>
            </div>
            <h2 style={heroTitleStyle}>
              Verified care for doctors,<br />users, and communities
            </h2>
            <p style={heroDescriptionStyle}>
              Connect with verified medical professionals, request emergency support, and report misconduct safely through one trusted platform.
            </p>
            <div style={featureBadgesStyle}>
              <div style={featureBadgeStyle('16, 185, 129')}>
                <FaCheckDouble style={{ fontSize: '0.875rem' }} />
                Verified doctor profiles
              </div>
              <div style={featureBadgeStyle('251, 146, 60')}>
                <FaPhone style={{ fontSize: '0.875rem' }} />
                SOS support network
              </div>
              <div style={featureBadgeStyle('147, 51, 234')}>
                <FaExclamationTriangle style={{ fontSize: '0.875rem' }} />
                Complaint review workflow
              </div>
            </div>
            <p style={statusStyle}>
              <span style={statusDotStyle}></span>
              Backend status: <span style={statusTextStyle}>{health || 'Checking connection...'}</span>
            </p>
          </div>
        </section>

        {/* Featured Doctors Section */}
        <section style={doctorsSectionStyle}>
          <div style={sectionHeaderStyle}>
            <h3 style={sectionTitleStyle}>Find a Verified Doctor</h3>
            <p style={sectionDescriptionStyle}>Browse our network of trusted medical professionals</p>
          </div>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <div style={gridStyle}>
            {filteredDoctors.map((doctor, idx) => (
              <div key={`${doctor.name}-${doctor.registration_number || doctor.registrationNumber || idx}`} style={cardAnimationStyle(idx)}>
                <DoctorCard {...doctor} />
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section style={featuresSectionStyle}>
          <div style={featuresGridStyle}>
            <div style={featureCardStyle()}>
              <div style={iconBoxStyle('59, 130, 246')}>
                <FaPhone />
              </div>
              <h3 style={featureTitleStyle}>Emergency Response</h3>
              <p style={featureDescriptionStyle}>Doctors can trigger an SOS alert and receive rapid support from retired police officers and local authorities.</p>
            </div>
            <div style={featureCardStyle()}>
              <div style={iconBoxStyle('147, 51, 234')}>
                <FaExclamationTriangle />
              </div>
              <h3 style={featureTitleStyle}>Complaint Review</h3>
              <p style={featureDescriptionStyle}>Reports are collected, verified, and routed to the appropriate authorities only after review.</p>
            </div>
          </div>
        </section>

        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
