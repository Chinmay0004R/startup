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
import SOS from './pages/SOS';
import Search from './pages/Search';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [authToken, setAuthToken] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedRole = localStorage.getItem('currentRole');
      const storedEmail = localStorage.getItem('currentUserEmail');

      if (storedToken) {
        setAuthToken(storedToken);

        if (storedEmail) {
          setCurrentUserEmail(storedEmail);
        }

        if (storedRole) {
          setCurrentRole(storedRole);
        } else {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/auth/me`, {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              const role = String(data?.role || '').toLowerCase();
              if (role) {
                localStorage.setItem('currentRole', role);
                setCurrentRole(role);
              }
            } else if (response.status === 401) {
              localStorage.removeItem('authToken');
              localStorage.removeItem('currentRole');
              localStorage.removeItem('currentUserEmail');
              localStorage.removeItem('userName');
              localStorage.removeItem('userId');
              setAuthToken(null);
              setCurrentRole(null);
            }
          } catch (error) {
            console.error('Failed to restore auth role', error);
          }
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentRole');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    setAuthToken(null);
    setCurrentRole(null);
    setCurrentUserEmail(null);
  };

  if (isLoading) {
    return (
      <div className="app-loading page-wrapper">
        <div className="app-loading-inner">
          <div className="loading-icon">⏳</div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <div className="page-container">
          <Routes>
            <Route
              path="/"
              element={
                authToken ? (
                  currentRole && currentRole !== 'pending' ? <Navigate to="/dashboard" /> : <Navigate to="/role-setup" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/login"
              element={
                authToken ? (
                  currentRole && currentRole !== 'pending' ? <Navigate to="/dashboard" /> : <Navigate to="/role-setup" />
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
                  currentRole && currentRole !== 'pending' ? <Navigate to="/dashboard" /> : <Navigate to="/role-setup" />
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
            <Route
              path="/sos"
              element={
                <ProtectedRoute authToken={authToken} currentRole={currentRole}>
                  <SOS />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute authToken={authToken} currentRole={currentRole}>
                  <Search 
                    currentRole={currentRole}
                    currentUserEmail={currentUserEmail}
                    authToken={authToken}
                    onLogout={handleLogout}
                  />
                </ProtectedRoute>
              }
            />
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
                  <UserProfile authToken={authToken} onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

