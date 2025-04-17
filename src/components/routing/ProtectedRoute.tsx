
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gtalk-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log("User not authenticated, redirecting to /auth");
    // Redirect to the auth page but save the location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
