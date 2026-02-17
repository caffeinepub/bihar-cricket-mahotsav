import { useNavigate } from '@tanstack/react-router';
import { useGetTeams } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import AdminRouteGuard from '../components/admin/AdminRouteGuard';

function AdminTeamsContent() {
  const navigate = useNavigate();
  const { data: teams, isLoading: teamsLoading } = useGetTeams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate({ to: '/admin' })} className="mb-4">
            ← Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-saffron" />
            <h1 className="text-4xl font-bold">Team Management</h1>
          </div>
          <p className="text-muted-foreground">Manage team information and settings</p>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamsLoading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-32 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            teams?.map((team) => (
              <Card key={team.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  {team.logo && (
                    <img src={team.logo} alt={team.name} className="h-32 w-32 mx-auto object-contain mb-4" />
                  )}
                  <CardTitle className="text-center">{team.name}</CardTitle>
                  <CardDescription className="text-center">
                    Base Purse: ₹{(Number(team.purse) / 100).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>Team Type:</strong> {team.teamType}
                    </p>
                    {team.owner && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Owner:</strong> {team.owner}
                      </p>
                    )}
                  </div>
                  <Alert className="mt-4">
                    <AlertDescription className="text-xs">
                      Team editing functionality coming soon. Contact system administrator for updates.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminTeamsPage() {
  return (
    <AdminRouteGuard>
      <AdminTeamsContent />
    </AdminRouteGuard>
  );
}
