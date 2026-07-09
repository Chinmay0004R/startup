import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole, currentRole }) => {
  if (!currentRole) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
