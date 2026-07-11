import { FaStethoscope, FaHospital, FaCalendar, FaCheckCircle } from 'react-icons/fa';

const DoctorCard = ({ name, specialty, hospital, verified, yearsExperience, registrationNumber, registration_number, onViewProfile }) => {
  return (
    <div className="card-hover" style={{ padding: '1.5rem' }}>
      {/* Header with icon */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '0.75rem',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(29, 78, 216, 0.1))',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.3s ease'
        }}>
          <FaStethoscope style={{ color: '#60a5fa', fontSize: '1.125rem' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1.125rem', margin: '0 0 0.25rem 0' }}>
            {name}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#60a5fa', fontWeight: 500, margin: 0 }}>
            {specialty}
          </p>
        </div>
      </div>

      {/* Verified badge */}
      {verified && (
        <div className="badge badge-success" style={{ marginBottom: '1rem', width: 'fit-content' }}>
          <FaCheckCircle style={{ fontSize: '0.75rem' }} />
          Verified
        </div>
      )}

      {/* Hospital info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b' }}>
          <FaHospital style={{ flexShrink: 0, color: '#475569' }} />
          <span style={{ transition: 'color 0.3s ease' }}>
            {hospital || 'Pending verification'}
          </span>
        </div>
        {(registrationNumber || registration_number) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b' }}>
            <span style={{ transition: 'color 0.3s ease' }}>
              Reg. no: {registrationNumber || registration_number}
            </span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b' }}>
          <FaCalendar style={{ flexShrink: 0, color: '#475569' }} />
          <span style={{ transition: 'color 0.3s ease' }}>
            {yearsExperience}+ years experience
          </span>
        </div>
      </div>

      {/* Hover action */}
      <button
        type="button"
        onClick={onViewProfile}
        style={{
          marginTop: '1rem',
          width: '100%',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          backgroundColor: onViewProfile ? 'rgba(59, 130, 246, 0.1)' : 'rgba(71, 85, 105, 0.2)',
          color: '#93c5fd',
          fontSize: '0.9rem',
          fontWeight: 500,
          cursor: onViewProfile ? 'pointer' : 'default',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => {
          if (!onViewProfile) return;
          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
        }}
        onMouseLeave={e => {
          if (!onViewProfile) return;
          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
        }}
      >
        View Profile
      </button>
    </div>
  );
};

export default DoctorCard;
