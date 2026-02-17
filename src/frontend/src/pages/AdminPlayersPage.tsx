import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllPlayerRegistrations, useGetAllAnonymousRegistrations, useUpdatePlayerPaymentStatus } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Download, CheckCircle, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';
import AdminRouteGuard from '../components/admin/AdminRouteGuard';

function AdminPlayersContent() {
  const navigate = useNavigate();
  const { data: authenticatedRegs, isLoading: authRegsLoading } = useGetAllPlayerRegistrations();
  const { data: anonymousRegs, isLoading: anonRegsLoading } = useGetAllAnonymousRegistrations();
  const updatePaymentMutation = useUpdatePlayerPaymentStatus();

  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdatePayment = async (userPrincipal: Principal | null, anonymousId: string | null, currentStatus: boolean) => {
    try {
      await updatePaymentMutation.mutateAsync({
        userPrincipal,
        anonymousId,
        paymentStatus: !currentStatus,
      });
      toast.success('Payment status updated successfully');
    } catch (error) {
      toast.error('Failed to update payment status');
      console.error(error);
    }
  };

  const allRegistrations = [
    ...(authenticatedRegs || []).map(([principal, reg]) => ({
      id: principal.toString(),
      type: 'authenticated' as const,
      principal,
      ...reg,
    })),
    ...(anonymousRegs || []).map(([id, reg]) => ({
      id,
      type: 'anonymous' as const,
      ...reg,
    })),
  ];

  const filteredRegistrations = allRegistrations.filter((reg) =>
    reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.contact.includes(searchTerm)
  );

  const exportData = () => {
    const csv = [
      ['Type', 'Name', 'Age', 'Contact', 'Email', 'Aadhaar', 'Experience', 'Team', 'Category', 'Jersey Size', 'Payment Status'],
      ...allRegistrations.map((reg) => [
        reg.type,
        reg.name,
        reg.age.toString(),
        reg.contact,
        reg.email,
        reg.aadhaarNumber,
        reg.experience,
        reg.teamChoice,
        reg.category,
        reg.jerseySize,
        reg.paymentStatus ? 'Paid' : 'Pending',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `player-registrations-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const paidCount = allRegistrations.filter((r) => r.paymentStatus).length;
  const pendingCount = allRegistrations.filter((r) => !r.paymentStatus).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate({ to: '/admin' })} className="mb-4">
            ← Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-saffron" />
            <h1 className="text-4xl font-bold">Player Management</h1>
          </div>
          <p className="text-muted-foreground">Manage all player registrations and payment status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allRegistrations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{paidCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Export */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search and Export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={exportData} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Registrations</CardTitle>
            <CardDescription>View and manage player registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {authRegsLoading || anonRegsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell>
                          <Badge variant={reg.type === 'authenticated' ? 'default' : 'secondary'}>
                            {reg.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{reg.name}</TableCell>
                        <TableCell>{reg.age.toString()}</TableCell>
                        <TableCell>{reg.contact}</TableCell>
                        <TableCell>{reg.email}</TableCell>
                        <TableCell>{reg.teamChoice}</TableCell>
                        <TableCell>{reg.category}</TableCell>
                        <TableCell>
                          {reg.paymentStatus ? (
                            <Badge className="bg-green-600">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Paid
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="mr-1 h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdatePayment(
                                reg.type === 'authenticated' ? reg.principal : null,
                                reg.type === 'anonymous' ? reg.id : null,
                                reg.paymentStatus
                              )
                            }
                            disabled={updatePaymentMutation.isPending}
                          >
                            Toggle Payment
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminPlayersPage() {
  return (
    <AdminRouteGuard>
      <AdminPlayersContent />
    </AdminRouteGuard>
  );
}
