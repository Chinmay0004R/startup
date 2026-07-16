import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import DoctorCard from '../components/DoctorCard';
import Footer from '../components/Footer';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { fetchDoctors } from '../services/api';
import { FaShieldAlt, FaCheckDouble, FaPhone, FaExclamationTriangle, FaHeartbeat, FaLightbulb, FaRocket, FaArrowRight } from 'react-icons/fa';

const Home = ({ health }) => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDoctors = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDoctors();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load doctors:', error);
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(loadDoctors, 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return [doctor.name, doctor.specialty, doctor.hospital, doctor.registration_number, doctor.registrationNumber]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  const hasSearchQuery = Boolean(searchTerm.trim());

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-content">
        <section className="hero-section hero-panel">
          <div className="hero-header">
            <FaShieldAlt className="hero-icon" />
            <span className="hero-badge">Secure Healthcare Network</span>
          </div>

          <h1 className="hero-title">Connect with verified medical professionals</h1>
          <p className="hero-description">
            Access a trusted network of verified doctors, request emergency assistance instantly, and report concerns securely. Your health and safety are our priority.
          </p>

          <div className="hero-tags">
            <div className="feature-pill green">
              <FaCheckDouble /> Verified profiles
            </div>
            <div className="feature-pill orange">
              <FaPhone /> Emergency SOS
            </div>
            <div className="feature-pill blue">
              <FaExclamationTriangle /> Safe reporting
            </div>
          </div>

          <p className="status-line">
            <span className="status-dot" />
            System status: <span className="status-keyword">{health || 'Checking...'}</span>
          </p>
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Find a Doctor</h2>
            <p className="section-description">Browse verified medical professionals in our network</p>
          </div>

          <SearchBar value={searchTerm} onChange={setSearchTerm} />

          {isLoading ? (
            <div className="grid-wide">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} type="card" />
              ))}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <EmptyState
              type={hasSearchQuery ? 'search' : 'default'}
              title={hasSearchQuery ? 'No doctors found' : 'No doctors available yet'}
              description={hasSearchQuery ? 'Try adjusting your search criteria.' : 'Check back soon as verified doctors are added.'}
            />
          ) : (
            <div className="grid-wide">
              {filteredDoctors.map((doctor, idx) => (
                <div key={`${doctor.name}-${doctor.registration_number || idx}`} className="animate-fadeInUp">
                  <DoctorCard {...doctor} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-description">Comprehensive healthcare solutions designed for safety and trust</p>
          </div>

          <div className="feature-grid">
            <div className="feature-card blue">
              <div className="feature-icon-box blue">
                <FaHeartbeat />
              </div>
              <h3 className="feature-card-title">Verified Professionals</h3>
              <p className="feature-card-text">All doctors in our network are verified and registered, ensuring you connect with qualified medical professionals.</p>
            </div>

            <div className="feature-card green">
              <div className="feature-icon-box green">
                <FaRocket />
              </div>
              <h3 className="feature-card-title">Instant Emergency Response</h3>
              <p className="feature-card-text">Trigger emergency alerts instantly. Our SOS network connects you with available responders in seconds.</p>
            </div>

            <div className="feature-card orange">
              <div className="feature-icon-box orange">
                <FaLightbulb />
              </div>
              <h3 className="feature-card-title">Safe Complaint System</h3>
              <p className="feature-card-text">Report concerns confidentially. All complaints are reviewed and routed to appropriate authorities only when verified.</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-panel">
            <h2 className="section-title">Ready to get started?</h2>
            <p className="section-description">Join thousands of users already benefiting from our secure healthcare network.</p>
            <button type="button" className="cta-button">
              Explore Now
              <FaArrowRight />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
