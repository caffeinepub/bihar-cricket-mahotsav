import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      try {
        await clear();
        queryClient.clear();
        toast.success('Logged out successfully');
      } catch (error: any) {
        console.error('Logout error:', error);
        toast.error('Failed to log out. Please try again.');
      }
    } else {
      try {
        await login();
        toast.success('Successfully signed in');
      } catch (error: any) {
        console.error('Login error:', error);
        const errorMessage = error?.message || 'Failed to sign in with Internet Identity';
        toast.error(errorMessage);
        
        // Handle specific error cases
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={disabled}
      variant={isAuthenticated ? 'outline' : 'default'}
      size="sm"
      className={isAuthenticated ? '' : 'bg-saffron hover:bg-saffron/90 text-white'}
    >
      {loginStatus === 'logging-in' ? (
        'Logging in...'
      ) : isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </>
      )}
    </Button>
  );
}
