import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ 
  children, 
  authToken, 
  currentRole, 
  allowedRole = null 
}) => {
  // Redirect to login if no auth token
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to role setup if authenticated but no role selected yet
  if (!currentRole) {
    return <Navigate to="/role-setup" replace />;
  }

  // Check allowed role if specified
  if (allowedRole && currentRole !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

