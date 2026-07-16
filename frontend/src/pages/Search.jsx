import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaSearch, FaUser } from 'react-icons/fa';

const Search = ({ currentRole, currentUserEmail, onLogout, authToken }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
    
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/users/`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(Array.isArray(data) ? data : []);
        } else if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentRole');
          localStorage.removeItem('currentUserEmail');
          localStorage.removeItem('userName');
          localStorage.removeItem('userId');
          window.location.href = '/login';
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (authToken) {
      fetchUsers();
    }
  }, [authToken]);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Navbar 
        userName={userName}
        onLogout={onLogout}
        currentRole={currentRole}
      />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: 'var(--shadow-hard)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--color-charcoal-ink)' }}>Search Users</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-pencil-gray)' }} />
              <input
                type="text"
                placeholder="Search by name, role, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '1px solid var(--color-charcoal-ink)',
                  borderRadius: '0.75rem',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading users...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '1rem' }}>
                <p style={{ color: 'var(--color-pencil-gray)' }}>No users found matching "{searchTerm}"</p>
              </div>
            ) : (
              filteredUsers.map(user => (
                <div key={user.id} style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  boxShadow: 'var(--shadow-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'var(--color-sky-crayon)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-charcoal-ink)' }}>{user.name}</h3>
                    <p style={{ margin: '0', color: 'var(--color-pencil-gray)', fontSize: '0.9rem' }}>
                      <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{user.role}</span> • {user.email}
                    </p>
                    {user.role === 'doctor' && user.specialization && (
                      <p style={{ margin: '0.5rem 0 0 0', color: '#667eea', fontSize: '0.85rem' }}>
                        {user.specialization} {user.hospital ? `at ${user.hospital}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
