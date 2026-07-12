import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorProfile from './pages/DoctorProfile';
import UserProfile from './pages/PatientProfile';
import Login from './pages/LoginNew';
import RoleSetup from './pages/RoleSetup';
import DoctorSetup from './pages/DoctorSetup';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [authToken, setAuthToken] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('currentRole');
    const storedEmail = localStorage.getItem('currentUserEmail');
    
    if (storedToken) setAuthToken(storedToken);
    if (storedRole) setCurrentRole(storedRole);
    if (storedEmail) setCurrentUserEmail(storedEmail);
    
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentRole');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('userName');
    setAuthToken(null);
    setCurrentRole(null);
    setCurrentUserEmail(null);
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ fontSize: '1.2rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div style={{
        minHeight: '100vh',
        background: '#f5f7fa',
        color: '#1a202c',
        fontFamily: "'Inter', system-ui, sans-serif"
      }}>
        <Routes>
          <Route
            path="/"
            element={
              authToken ? (
                currentRole ? <Navigate to="/dashboard" /> : <Navigate to="/role-setup" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              authToken ? (
                currentRole ? <Navigate to="/dashboard" /> : <Navigate to="/role-setup" />
              ) : (
                <Login
                  mode="login"
                  setCurrentRole={setCurrentRole}
                  setCurrentUserEmail={setCurrentUserEmail}
                  setAuthToken={setAuthToken}
                />
              )
            }
          />
          <Route
            path="/register"
            element={
              authToken ? (
                currentRole ? <Navigate to="/dashboard" /> : <Navigate to="/role-setup" />
              ) : (
                <Login
                  mode="register"
                  setCurrentRole={setCurrentRole}
                  setCurrentUserEmail={setCurrentUserEmail}
                  setAuthToken={setAuthToken}
                />
              )
            }
          />

          {/* Role Setup Route */}
          <Route
            path="/role-setup"
            element={
              authToken ? (
                currentRole ? <Navigate to="/dashboard" /> : <RoleSetup setCurrentRole={setCurrentRole} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Doctor Setup Route */}
          <Route
            path="/doctor-setup"
            element={
              authToken ? (
                currentRole === 'doctor' ? <DoctorSetup setCurrentRole={setCurrentRole} /> : <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute authToken={authToken} currentRole={currentRole}>
                <Dashboard 
                  currentRole={currentRole}
                  currentUserEmail={currentUserEmail}
                  authToken={authToken}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />

          {/* Legacy routes - kept for backward compatibility */}
          <Route
            path="/doctors"
            element={
              <ProtectedRoute authToken={authToken} currentRole={currentRole} allowedRole="doctor">
                <DoctorDashboard 
                  currentEmail={currentUserEmail}
                  authToken={authToken}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors/edit"
            element={
              <ProtectedRoute authToken={authToken} currentRole={currentRole} allowedRole="doctor">
                <Doctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors/:doctorId"
            element={
              <ProtectedRoute authToken={authToken} currentRole={currentRole} allowedRole="doctor">
                <DoctorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute authToken={authToken} currentRole={currentRole} allowedRole="patient">
                <UserProfile 
                  authToken={authToken}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          {/* 404 Not Found */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

