import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function RequireAuth({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="p-8 text-center text-slate-500 dark:text-slate-400">Restoring your secure session…</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default RequireAuth;
