import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetCallerIdAsText, useGetCallerUserRole, useAssignCallerUserRole } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, LogIn, Copy, Check, AlertCircle, UserPlus, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserRole } from '../backend';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, error: adminError } = useIsCallerAdmin();
  const { 
    data: principalText, 
    isLoading: principalLoading, 
    error: principalError,
    refetch: refetchPrincipal 
  } = useGetCallerIdAsText();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();
  const assignRoleMutation = useAssignCallerUserRole();
  const [copied, setCopied] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Check if no admins exist (user role is 'guest' means no admins configured yet)
  const noAdminsExist = userRole === UserRole.guest && !isAdminLoading && !roleLoading;

  // Redirect authenticated admins to admin dashboard (only when all checks are complete)
  useEffect(() => {
    if (isAuthenticated && !isAdminLoading && !roleLoading && isAdmin === true) {
      navigate({ to: '/admin' });
    }
  }, [isAuthenticated, isAdminLoading, roleLoading, isAdmin, navigate]);

  const handleLogin = async () => {
    setLoginError(null);
    try {
      await login();
      // Clear cached queries to ensure fresh data after login
      queryClient.invalidateQueries({ queryKey: ['callerIdAsText'] });
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['callerUserRole'] });
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
      try {
        await navigator.clipboard.writeText(principalText);
        setCopied(true);
        toast.success('Principal ID copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Copy failed:', error);
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  const handleBecomeFirstAdmin = async () => {
    if (!identity) {
      toast.error('Not authenticated');
      return;
    }

    try {
      await assignRoleMutation.mutateAsync({
        user: identity.getPrincipal(),
        role: UserRole.admin,
      });
      // Success toast is handled in the mutation
      // Redirect will happen automatically via useEffect when isAdmin updates
    } catch (error: any) {
      // Error toast is handled in the mutation
      console.error('Failed to become admin:', error);
    }
  };

  const handleRetryPrincipal = () => {
    refetchPrincipal();
  };

  // Show troubleshooting view for authenticated non-admins
  if (isAuthenticated && !isAdminLoading && !roleLoading && isAdmin === false) {
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
              <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
              <CardDescription className="text-base">
                You are not authorized to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your account does not have administrator privileges. If you believe this is an error, please contact the system administrator with your Principal ID below.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Your Principal ID:</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                    {principalLoading ? (
                      <Skeleton className="h-5 w-full" />
                    ) : principalError ? (
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">Failed to retrieve Principal ID. Please try again.</span>
                      </div>
                    ) : principalText ? (
                      principalText
                    ) : (
                      <span className="text-muted-foreground">Loading...</span>
                    )}
                  </div>
                  {principalText && !principalError && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyPrincipal}
                      className="flex-shrink-0"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                  {principalError && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleRetryPrincipal}
                      className="flex-shrink-0"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
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
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <CardTitle className="text-3xl font-bold">Admin Login</CardTitle>
            <CardDescription className="text-base">
              Bihar Cricket Mahotsav<br />
              Administrative Access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Authentication Status */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Status:</span>
              <span className={`text-sm font-semibold ${isAuthenticated ? 'text-green-600' : 'text-muted-foreground'}`}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>

            {/* Login Error Alert */}
            {loginError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            {/* Admin Error Alert */}
            {adminError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to verify admin status. Please try refreshing the page.
                </AlertDescription>
              </Alert>
            )}

            {/* Sign In Button (when not authenticated) */}
            {!isAuthenticated && (
              <Button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full h-12 text-base"
                size="lg"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign in with Internet Identity
                  </>
                )}
              </Button>
            )}

            {/* Principal ID Display (when authenticated) */}
            {isAuthenticated && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Principal ID:</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                    {principalLoading ? (
                      <Skeleton className="h-5 w-full" />
                    ) : principalError ? (
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">Failed to retrieve Principal ID. Please try again.</span>
                      </div>
                    ) : principalText ? (
                      principalText
                    ) : (
                      <span className="text-muted-foreground">Loading...</span>
                    )}
                  </div>
                  {principalText && !principalError && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyPrincipal}
                      className="flex-shrink-0"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                  {principalError && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleRetryPrincipal}
                      className="flex-shrink-0"
                      disabled={principalLoading}
                    >
                      <RefreshCw className={`h-4 w-4 ${principalLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Become First Admin Button (when no admins exist) */}
            {isAuthenticated && noAdminsExist && principalText && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No administrators have been configured yet. You can become the first admin.
                </AlertDescription>
              </Alert>
            )}

            {isAuthenticated && noAdminsExist && principalText && (
              <Button
                onClick={handleBecomeFirstAdmin}
                disabled={assignRoleMutation.isPending}
                className="w-full h-12 text-base"
                size="lg"
              >
                {assignRoleMutation.isPending ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Become the First Admin
                  </>
                )}
              </Button>
            )}

            {/* Verifying Admin Status (when authenticated and checking) */}
            {isAuthenticated && (isAdminLoading || roleLoading) && (
              <div className="text-center py-4">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Verifying admin privileges...</p>
              </div>
            )}

            {/* Sign Out Button (when authenticated) */}
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full"
              >
                Sign Out
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
