import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorProfile from './pages/DoctorProfile';
import PatientProfile from './pages/PatientProfile';
import Support from './pages/Support';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [currentRole, setCurrentRole] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('currentRole');
    const storedEmail = localStorage.getItem('currentUserEmail');
    if (storedRole) setCurrentRole(storedRole);
    if (storedEmail) setCurrentUserEmail(storedEmail);
  }, []);

  useEffect(() => {
    if (currentRole) {
      localStorage.setItem('currentRole', currentRole);
    }
    if (currentUserEmail) {
      localStorage.setItem('currentUserEmail', currentUserEmail);
    }
  }, [currentRole, currentUserEmail]);

  return (
    <BrowserRouter>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #0f172a, #1a2941, #0f172a)',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, sans-serif"
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setCurrentRole={setCurrentRole} setCurrentUserEmail={setCurrentUserEmail} currentRole={currentRole} />} />
          <Route
            path="/doctors"
            element={
              <ProtectedRoute allowedRole="doctor" currentRole={currentRole}>
                <DoctorDashboard currentEmail={currentUserEmail} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors/edit"
            element={
              <ProtectedRoute allowedRole="doctor" currentRole={currentRole}>
                <Doctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors/:doctorId"
            element={
              <ProtectedRoute allowedRole="doctor" currentRole={currentRole}>
                <DoctorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-profile"
            element={
              <ProtectedRoute allowedRole="user" currentRole={currentRole}>
                <PatientProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute allowedRole="user" currentRole={currentRole}>
                <Support />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
