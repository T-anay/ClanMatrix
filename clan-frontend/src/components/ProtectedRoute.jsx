import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * allowedRoles: ['ADMIN'] | ['USER'] | ['ADMIN', 'USER']
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/matrix'} replace />;
  }

  return children;
}
