import React, { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface AdminOnlyGuardProps {
  children: React.ReactNode;
}

export const AdminOnlyGuard: React.FC<AdminOnlyGuardProps> = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const userRole = user?.role?.toLowerCase();
  const isAdmin = userRole === 'admin';

  // 🛡 Block non-admin users completely
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Access Denied</strong><br />
            This feature is only available to administrators.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};