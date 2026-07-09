import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Support from './pages/Support';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [currentRole, setCurrentRole] = useState(null);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Routes>
          <Route path="/" element={<Login setCurrentRole={setCurrentRole} currentRole={currentRole} />} />
          <Route path="/login" element={<Login setCurrentRole={setCurrentRole} currentRole={currentRole} />} />
          <Route
            path="/doctors"
            element={
              <ProtectedRoute allowedRole="doctor" currentRole={currentRole}>
                <Doctors />
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
