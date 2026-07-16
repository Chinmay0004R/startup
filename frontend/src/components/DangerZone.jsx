import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '../services/api';

const DangerZone = ({ isGoogleAuth = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    if (deleteConfirmation !== 'DELETE') {
      setError('You must type DELETE to confirm.');
      return;
    }
    
    // For non-Google users, we require a password.
    // If we can't reliably pass isGoogleAuth from the parent, we can just send the password,
    // and let the backend decide if it's required.
    
    setIsDeleting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('authToken');
      await deleteAccount({ password: password || '' }, token);
      
      // Clear session
      localStorage.clear();
      
      // Navigate to login
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="danger-zone-container" style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #ff4d4f', borderRadius: '8px', backgroundColor: '#fff1f0' }}>
      <h3 style={{ color: '#ff4d4f', marginTop: 0, marginBottom: '0.5rem' }}>Danger Zone</h3>
      <p style={{ color: '#cf1322', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Once you delete your account, there is no going back. Please be certain.
      </p>
      
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Delete Account
        </button>
      ) : (
        <form onSubmit={handleDelete} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <p style={{ fontWeight: 'bold', color: '#ff4d4f', margin: 0 }}>
            This action is irreversible. All your data will be permanently removed.
          </p>
          
          {error && <div style={{ color: 'red', fontSize: '0.9rem' }}>{error}</div>}
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Type <strong>DELETE</strong> to confirm:</label>
            <input 
              type="text" 
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d9d9d9' }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Confirm your password:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d9d9d9' }}
              required={!isGoogleAuth}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button 
              type="submit" 
              disabled={isDeleting || deleteConfirmation !== 'DELETE'}
              style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: (isDeleting || deleteConfirmation !== 'DELETE') ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: (isDeleting || deleteConfirmation !== 'DELETE') ? 0.5 : 1 }}
            >
              {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
            </button>
            <button 
              type="button" 
              onClick={() => { setIsOpen(false); setError(''); setDeleteConfirmation(''); setPassword(''); }}
              style={{ backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #d9d9d9', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
              disabled={isDeleting}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DangerZone;
