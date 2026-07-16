import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  createSafetyAlert,
  fetchSafetyAlerts,
  fetchSafetyAlertById,
  updateSafetyAlert,
} from '../services/api';
import {
  FaExclamationTriangle,
  FaPhone,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaPlayCircle,
  FaTimesCircle,
  FaArrowLeft,
} from 'react-icons/fa';

const SOS = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState('home'); // home, confirm, success, history
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({
    doctor_name: localStorage.getItem('currentUserName') || '',
    location: '',
    details: '',
    latitude: null,
    longitude: null,
  });
  const [currentIncident, setCurrentIncident] = useState(null);

  const token = localStorage.getItem('authToken');
  const userEmail = localStorage.getItem('currentUserEmail');

  // Load incidents on mount
  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const data = await fetchSafetyAlerts(token);
        setIncidents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load incidents:', error);
      }
    };

    if (token) loadIncidents();
  }, [token]);

  const getLocationStatus = () => {
    if (formData.latitude && formData.longitude) {
      return `📍 ${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}`;
    }
    return 'Not captured';
  };

  const captureCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setStatus('Accessing location...');

    if (!navigator.geolocation) {
      setStatus('Geolocation not supported by this browser.');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((current) => ({
          ...current,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          location: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
        }));
        setStatus('Location captured successfully.');
        setIsLoadingLocation(false);
      },
      (error) => {
        setStatus(`Location access denied: ${error.message}`);
        setIsLoadingLocation(false);
      }
    );
  };

  const handleConfirmAlert = async () => {
    if (!formData.doctor_name.trim()) {
      setStatus('Doctor name is required.');
      return;
    }

    setIsSubmitting(true);
    setStatus('Submitting emergency alert...');

    try {
      const payload = {
        doctor_name: formData.doctor_name,
        location: formData.location || 'Location not provided',
        details: formData.details || 'No incident details provided',
      };

      const incident = await createSafetyAlert(payload, token);
      setCurrentIncident(incident);
      setStage('success');
      setStatus('');
    } catch (error) {
      setStatus(`Failed to submit alert: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'received':
        return <FaClock style={{ color: '#fbbf24' }} />;
      case 'acknowledged':
        return <FaHourglassHalf style={{ color: 'var(--color-sky-crayon)' }} />;
      case 'in_progress':
        return <FaPlayCircle style={{ color: 'rgba(16, 185, 129, 1)' }} />;
      case 'closed':
        return <FaCheckCircle style={{ color: 'rgba(16, 185, 129, 1)' }} />;
      default:
        return <FaClock style={{ color: '#6b7280' }} />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      received: 'Submitted',
      acknowledged: 'Acknowledged',
      in_progress: 'In Progress',
      closed: 'Closed',
    };
    return labels[status] || status;
  };

  const mainStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
    minHeight: '100vh',
  };

  const containerStyle = {
    borderRadius: '1rem',
    border: '1px solid var(--color-charcoal-ink)',
    background: 'var(--color-frost-white)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    boxShadow: 'var(--shadow-hard)',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    border: 'none',
    backgroundColor: 'var(--color-sky-crayon)',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  const emergencyButtonStyle = {
    width: '100%',
    padding: '3rem',
    borderRadius: '1.5rem',
    border: '4px solid #dc2626',
    backgroundColor: '#ef4444',
    color: 'white',
    fontWeight: '700',
    fontSize: '2rem',
    cursor: 'pointer',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(220, 38, 38, 0.4)',
    transition: 'all 0.3s ease',
    marginBottom: '2rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--color-charcoal-ink)',
    backgroundColor: 'var(--color-frost-white)',
    color: 'var(--color-charcoal-ink)',
    fontFamily: 'inherit',
    fontSize: '1rem',
    marginBottom: '1rem',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical',
  };

  const timelineStyle = {
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid var(--color-charcoal-ink)',
    backgroundColor: 'var(--color-frost-white)',
    marginBottom: '1rem',
  };

  const statusBadgeStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--color-ice-wash)',
    color: '#bfdbfe',
    marginBottom: '1rem',
  };

  // Stage: Home - Initial view with emergency button
  if (stage === 'home') {
    return (
      <div>
        <Navbar />
        <main style={mainStyle}>
          <div style={containerStyle}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <FaExclamationTriangle style={{ fontSize: '3rem', color: '#fbbf24', marginBottom: '1rem' }} />
              <h1 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '2rem' }}>Emergency SOS</h1>
              <p style={{ color: 'var(--color-pencil-gray)' }}>Trigger an emergency alert to your safety network and local authorities.</p>
            </div>

            <button
              type="button"
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#dc2626')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#ef4444')}
              onClick={() => setStage('confirm')}
              style={emergencyButtonStyle}
            >
              🚨 TRIGGER SOS ALERT
            </button>

            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Recent Incidents</h3>
              {incidents.length === 0 ? (
                <p style={{ color: 'var(--color-pencil-gray)' }}>No incident history yet.</p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {incidents.slice(-5).reverse().map((incident) => (
                    <div
                      key={incident.id}
                      style={timelineStyle}
                      onClick={() => {
                        setCurrentIncident(incident);
                        setStage('history');
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ color: 'var(--color-charcoal-ink)', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                            {incident.doctor_name || 'Unknown'}
                          </p>
                          <p style={{ color: 'var(--color-pencil-gray)', margin: 0, fontSize: '0.9rem' }}>
                            {incident.location || 'Location not provided'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {getStatusIcon(incident.status)}
                          <span style={{ color: 'var(--color-pencil-gray)', fontSize: '0.9rem' }}>
                            {getStatusLabel(incident.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {incidents.length > 5 && (
              <button
                type="button"
                onClick={() => setStage('history')}
                style={{ ...buttonStyle, marginTop: '1rem', width: '100%' }}
              >
                View Full Incident History
              </button>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Stage: Confirm - Alert details and submission
  if (stage === 'confirm') {
    return (
      <div>
        <Navbar />
        <main style={mainStyle}>
          <div style={containerStyle}>
            <button
              type="button"
              onClick={() => setStage('home')}
              style={{
                ...buttonStyle,
                background: 'transparent',
                color: 'var(--color-sky-crayon)',
                padding: '0.5rem 1rem',
                marginBottom: '1.5rem',
              }}
            >
              <FaArrowLeft /> Back
            </button>

            <h2 style={{ color: 'white', marginBottom: '1.5rem' }}>Confirm Emergency Alert</h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: 'var(--color-pencil-gray)', display: 'block', marginBottom: '0.5rem' }}>Doctor Name</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Your full name"
                value={formData.doctor_name}
                onChange={(e) => setFormData((current) => ({ ...current, doctor_name: e.target.value }))}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: 'var(--color-pencil-gray)', display: 'block', marginBottom: '0.5rem' }}>Current Location</label>
              <div style={statusBadgeStyle}>
                <FaMapMarkerAlt /> {getLocationStatus()}
              </div>
              <button
                type="button"
                onClick={captureCurrentLocation}
                disabled={isLoadingLocation}
                style={{ ...buttonStyle, marginBottom: '1rem', width: '100%' }}
              >
                {isLoadingLocation ? 'Accessing location...' : '📍 Capture My Location'}
              </button>
              <input
                style={inputStyle}
                type="text"
                placeholder="Or enter location manually"
                value={formData.location}
                onChange={(e) => setFormData((current) => ({ ...current, location: e.target.value }))}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: 'var(--color-pencil-gray)', display: 'block', marginBottom: '0.5rem' }}>Incident Details</label>
              <textarea
                style={textareaStyle}
                placeholder="Describe the emergency situation (optional)"
                value={formData.details}
                onChange={(e) => setFormData((current) => ({ ...current, details: e.target.value }))}
              />
            </div>

            {status && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgba(220, 38, 38, 0.18)',
                  color: '#fecaca',
                  marginBottom: '1rem',
                }}
              >
                {status}
              </div>
            )}

            <button
              type="button"
              onClick={handleConfirmAlert}
              disabled={isSubmitting}
              style={{
                ...emergencyButtonStyle,
                marginBottom: '1rem',
                padding: '1.5rem',
                fontSize: '1.2rem',
              }}
            >
              {isSubmitting ? '📤 SUBMITTING...' : '✓ CONFIRM & SUBMIT SOS'}
            </button>

            <button
              type="button"
              onClick={() => setStage('home')}
              style={{
                ...buttonStyle,
                background: 'var(--color-chalk-gray)',
                width: '100%',
              }}
            >
              Cancel
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Stage: Success - Alert submitted successfully
  if (stage === 'success') {
    return (
      <div>
        <Navbar />
        <main style={mainStyle}>
          <div style={containerStyle}>
            <div style={{ textAlign: 'center' }}>
              <FaCheckCircle style={{ fontSize: '4rem', color: 'rgba(16, 185, 129, 1)', marginBottom: '1.5rem' }} />
              <h1 style={{ color: 'white', marginBottom: '1rem', fontSize: '2rem' }}>SOS Alert Submitted</h1>
              <p style={{ color: 'var(--color-pencil-gray)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                Your emergency alert has been successfully submitted. Responders have been notified and will be en route shortly.
              </p>

              {currentIncident && (
                <div style={{ ...timelineStyle, textAlign: 'left', marginBottom: '2rem' }}>
                  <p style={{ color: 'var(--color-charcoal-ink)', fontWeight: '600', marginBottom: '0.5rem' }}>Incident #ID-{currentIncident.id}</p>
                  <p style={{ color: 'var(--color-pencil-gray)', margin: '0.25rem 0' }}>
                    <strong>Doctor:</strong> {currentIncident.doctor_name}
                  </p>
                  <p style={{ color: 'var(--color-pencil-gray)', margin: '0.25rem 0' }}>
                    <strong>Location:</strong> {currentIncident.location}
                  </p>
                  <p style={{ color: 'var(--color-pencil-gray)', margin: '0.25rem 0' }}>
                    <strong>Status:</strong> {getStatusLabel(currentIncident.status)}
                  </p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setStage('home');
                    setCurrentIncident(null);
                  }}
                  style={buttonStyle}
                >
                  ← Back to Home
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStage('history');
                  }}
                  style={{ ...buttonStyle, background: '#0891b2' }}
                >
                  View Details →
                </button>
              </div>

              <div
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.18)',
                  color: '#a7f3d0',
                  textAlign: 'center',
                }}
              >
                <p style={{ margin: 0 }}>
                  <FaPhone /> If you need additional help, call emergency services: <strong>911</strong>
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Stage: History - Incident history and details
  if (stage === 'history') {
    return (
      <div>
        <Navbar />
        <main style={mainStyle}>
          <div style={containerStyle}>
            <button
              type="button"
              onClick={() => setStage('home')}
              style={{
                ...buttonStyle,
                background: 'transparent',
                color: 'var(--color-sky-crayon)',
                padding: '0.5rem 1rem',
                marginBottom: '1.5rem',
              }}
            >
              <FaArrowLeft /> Back to Home
            </button>

            <h2 style={{ color: 'white', marginBottom: '2rem' }}>Incident History</h2>

            {incidents.length === 0 ? (
              <p style={{ color: 'var(--color-pencil-gray)' }}>No incidents recorded.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {incidents.slice().reverse().map((incident) => (
                  <div key={incident.id} style={timelineStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <p style={{ color: 'var(--color-charcoal-ink)', fontWeight: '700', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                          Incident #{incident.id}
                        </p>
                        <p style={{ color: 'var(--color-pencil-gray)', margin: '0.25rem 0' }}>
                          <strong>Doctor:</strong> {incident.doctor_name || 'Unknown'}
                        </p>
                        <p style={{ color: 'var(--color-pencil-gray)', margin: '0.25rem 0' }}>
                          <strong>Location:</strong> {incident.location || 'Not provided'}
                        </p>
                        {incident.details && (
                          <p style={{ color: 'var(--color-pencil-gray)', margin: '0.25rem 0' }}>
                            <strong>Details:</strong> {incident.details}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          {getStatusIcon(incident.status)}
                          <span style={{ color: 'var(--color-pencil-gray)', fontWeight: '600' }}>
                            {getStatusLabel(incident.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Timeline */}
                    <div style={{ marginTop: '1rem', borderLeft: '2px solid rgba(148, 163, 184, 0.45)', paddingLeft: '1rem' }}>
                      {['received', 'acknowledged', 'in_progress', 'closed'].map((status) => {
                        const isActive =
                          status === 'received' ||
                          (status === 'acknowledged' &&
                            ['acknowledged', 'in_progress', 'closed'].includes(incident.status)) ||
                          (status === 'in_progress' &&
                            ['in_progress', 'closed'].includes(incident.status)) ||
                          (status === 'closed' && incident.status === 'closed');

                        return (
                          <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div
                              style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: isActive ? 'rgba(16, 185, 129, 1)' : 'rgba(148, 163, 184, 0.65)',
                                marginLeft: '-1.5rem',
                              }}
                            />
                            <span style={{ color: isActive ? 'rgba(16, 185, 129, 1)' : 'var(--color-pencil-gray)', fontSize: '0.9rem' }}>
                              {getStatusLabel(status)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return null;
};

export default SOS;
