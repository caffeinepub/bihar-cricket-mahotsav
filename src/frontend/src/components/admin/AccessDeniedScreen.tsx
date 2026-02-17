import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Home } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

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
                You do not have permission to access this area
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This area is restricted to authorized administrators only.
              </AlertDescription>
            </Alert>
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                You can return to the homepage or sign in with an authorized account.
              </p>
              <Button
                onClick={() => navigate({ to: '/' })}
                size="lg"
                className="w-full max-w-sm"
              >
                <Home className="mr-2 h-5 w-5" />
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
