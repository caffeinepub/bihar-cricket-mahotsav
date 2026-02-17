import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import AccessDeniedScreen from './AccessDeniedScreen';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isCheckingAuth = isInitializing || isAdminLoading;

  // Redirect unauthenticated users to admin login (only when auth state is settled)
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      navigate({ to: '/admin/login' });
    }
  }, [isCheckingAuth, isAuthenticated, navigate]);

  // Show loading state while checking authentication and admin status
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12">
        <div className="container mx-auto px-4 space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Show transitional loading if not authenticated (before redirect completes)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show access denied for authenticated non-admins (stable, no redirect)
  if (isAuthenticated && isAdmin === false) {
    return <AccessDeniedScreen />;
  }

  // Render admin content for authenticated admins
  return <>{children}</>;
}
