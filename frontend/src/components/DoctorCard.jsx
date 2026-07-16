import { FaStethoscope, FaHospital, FaCalendar, FaCheckCircle, FaUserPlus } from 'react-icons/fa';

const DoctorCard = ({
  name,
  specialty,
  hospital,
  verified,
  yearsExperience,
  registrationNumber,
  registration_number,
  onViewProfile,
  onConnect,
  isConnected,
}) => {
  const regNum = registrationNumber || registration_number;

  return (
    <div className="doctor-card">
      {/* Header with icon and verified badge */}
      <div className="doctor-card-header">
        <div className="doctor-card-icon-wrapper">
          <FaStethoscope className="doctor-card-icon" />
          {verified && (
            <div className="doctor-card-verified-badge">
              <FaCheckCircle />
            </div>
          )}
        </div>
        <div className="doctor-card-meta">
          <h3 className="doctor-card-title">{name}</h3>
          <p className="doctor-card-subtitle">{specialty || 'Medical Professional'}</p>
        </div>
      </div>

      {/* Info section */}
      <div className="doctor-card-info">
        {hospital && (
          <div className="doctor-card-info-item">
            <FaHospital className="doctor-card-info-icon" />
            <span className="doctor-card-info-text">{hospital}</span>
          </div>
        )}

        {regNum && (
          <div className="doctor-card-info-item doctor-card-info-compact">
            <span className="doctor-card-info-label">Reg#:</span>
            <span className="doctor-card-info-text doctor-card-info-monospace">{regNum}</span>
          </div>
        )}

        {yearsExperience && (
          <div className="doctor-card-info-item">
            <FaCalendar className="doctor-card-info-icon" />
            <span className="doctor-card-info-text">{yearsExperience}+ years experience</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="doctor-card-divider" />

      {/* Action buttons */}
      <div className="doctor-card-actions">
        {onViewProfile && (
          <button type="button" className="doctor-card-button doctor-card-button-primary" onClick={onViewProfile}>
            View Profile
          </button>
        )}
        {onConnect && (
          <button
            type="button"
            className={`doctor-card-button ${isConnected ? 'doctor-card-button-connected' : 'doctor-card-button-secondary'}`}
            onClick={onConnect}
          >
            <FaUserPlus className="doctor-card-button-icon" />
            {isConnected ? 'Connected' : 'Connect'}
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;

