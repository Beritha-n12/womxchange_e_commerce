import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SessionGuardProps {
  children: React.ReactNode;
}

const SessionGuard: React.FC<SessionGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // User is not authenticated, redirect to home
      const publicRoutes = [
        '/',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/products',
        '/categories',
        '/about',
        '/contact',
        '/terms',
        '/store',
        '/cart',
        '/checkout'
      ];

      const isPublicRoute = publicRoutes.some(route => 
        location.pathname === route || 
        location.pathname.startsWith('/reset-password/') ||
        location.pathname.startsWith('/products/')
      );

      if (!isPublicRoute) {
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SessionGuard;