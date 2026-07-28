import { Navigate } from 'react-router-dom';

/**
 * Protects admin routes by checking for a valid admin session in localStorage.
 * If no admin is logged in, redirects to /login.
 */
export function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: 'super-admin' | 'employee' }) {
  const adminData = localStorage.getItem('currentAdmin');

  if (!adminData) {
    return <Navigate to="/login" replace />;
  }

  try {
    const admin = JSON.parse(adminData);
    if (!admin || !admin.id) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && admin.role !== requiredRole) {
      if (admin.role === 'employee') {
        return <Navigate to="/properties" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
