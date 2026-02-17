import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetCallerIdAsText, useIsSystemBootstrapNeeded, useBecomeFirstAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, LogIn, Copy, Check, AlertCircle, UserPlus, RefreshCw, Home } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { copyToClipboard } from '../utils/clipboard';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, error: adminError } = useIsCallerAdmin();
  const { 
    data: principalText, 
    isLoading: principalLoading, 
    error: principalError,
    refetch: refetchPrincipal,
    isFetching: principalFetching
  } = useGetCallerIdAsText();
  const { data: bootstrapNeeded, isLoading: bootstrapLoading } = useIsSystemBootstrapNeeded();
  const becomeFirstAdminMutation = useBecomeFirstAdmin();
  const [copied, setCopied] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Show "Become First Admin" only when authenticated and backend confirms bootstrap is needed
  const showBecomeFirstAdmin = isAuthenticated && !bootstrapLoading && bootstrapNeeded === true;

  // Redirect authenticated admins to admin dashboard (only when all checks are complete)
  useEffect(() => {
    if (isAuthenticated && !isAdminLoading && !bootstrapLoading && isAdmin === true) {
      navigate({ to: '/admin' });
    }
  }, [isAuthenticated, isAdminLoading, bootstrapLoading, isAdmin, navigate]);

  const handleLogin = async () => {
    setLoginError(null);
    try {
      await login();
      // Clear cached queries to ensure fresh data after login
      queryClient.invalidateQueries({ queryKey: ['callerIdAsText'] });
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['callerUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['isSystemBootstrapNeeded'] });
      toast.success('Successfully signed in with Internet Identity');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.message || 'Failed to sign in with Internet Identity';
      setLoginError(errorMessage);
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await clear();
      // Clear all cached queries on logout
      queryClient.clear();
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const handleCopyPrincipal = async () => {
    if (principalText) {
      const result = await copyToClipboard(principalText);
      if (result.success) {
        setCopied(true);
        toast.success('Principal ID copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error('Copy failed:', result.error);
        toast.error(result.error || 'Failed to copy to clipboard');
      }
    }
  };

  const handleRetryPrincipal = () => {
    refetchPrincipal();
    toast.info('Retrying to fetch Principal ID...');
  };

  const handleBecomeFirstAdmin = async () => {
    if (!identity) {
      toast.error('Not authenticated');
      return;
    }

    try {
      await becomeFirstAdminMutation.mutateAsync();
      // Success toast is handled in the mutation
      // Redirect will happen automatically via useEffect
    } catch (error: any) {
      // Error toast is handled in the mutation
      console.error('Become first admin error:', error);
    }
  };

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">Admin Access</CardTitle>
                <CardDescription className="text-base mt-2">
                  Sign in with Internet Identity to access the admin panel
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                size="lg"
                className="w-full"
              >
                {isLoggingIn ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign in with Internet Identity
                  </>
                )}
              </Button>
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate({ to: '/' })}
                  className="text-muted-foreground"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Authenticated but checking admin status
  if (isAdminLoading || bootstrapLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-xl">
            <CardHeader className="text-center space-y-4">
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Authenticated non-admin - show access denied with Principal ID
  if (isAuthenticated && isAdmin === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-xl border-destructive">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-destructive" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-destructive">Access Denied</CardTitle>
                <CardDescription className="text-base mt-2">
                  You are not authorized to access the admin panel
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your account does not have administrator privileges. If you believe this is an error, please contact the system administrator with your Principal ID below.
                </AlertDescription>
              </Alert>

              {/* Principal ID Section - Always shown for authenticated users */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-foreground">Your Principal ID:</h3>
                {principalLoading || principalFetching ? (
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                ) : principalError ? (
                  <div className="space-y-3">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Failed to retrieve Principal ID. Please try again.
                      </AlertDescription>
                    </Alert>
                    <Button
                      onClick={handleRetryPrincipal}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry
                    </Button>
                  </div>
                ) : principalText ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted p-3 rounded-md font-mono text-xs break-all">
                      {principalText}
                    </div>
                    <Button
                      onClick={handleCopyPrincipal}
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex-1"
                >
                  Sign Out
                </Button>
                <Button
                  onClick={() => navigate({ to: '/' })}
                  className="flex-1"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Authenticated but not admin and bootstrap needed - show "Become First Admin"
  if (showBecomeFirstAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="shadow-xl border-primary">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserPlus className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">System Setup Required</CardTitle>
                <CardDescription className="text-base mt-2">
                  No administrators have been configured yet
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  You are the first user to access the admin panel. Click the button below to become the first administrator and gain full access to the system.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleBecomeFirstAdmin}
                disabled={becomeFirstAdminMutation.isPending}
                size="lg"
                className="w-full"
              >
                {becomeFirstAdminMutation.isPending ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Become the First Admin
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-muted-foreground"
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Fallback - should not reach here normally
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
