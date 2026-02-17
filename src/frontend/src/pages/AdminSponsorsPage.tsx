import { useNavigate } from '@tanstack/react-router';
import { useGetAllSponsorInquiries, useUpdateSponsorInquiryStatus, useDeleteSponsorInquiry } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { SponsorInquiryStatus } from '../backend';
import AdminRouteGuard from '../components/admin/AdminRouteGuard';

function AdminSponsorsContent() {
  const navigate = useNavigate();
  const { data: inquiries, isLoading: inquiriesLoading } = useGetAllSponsorInquiries();
  const updateStatusMutation = useUpdateSponsorInquiryStatus();
  const deleteInquiryMutation = useDeleteSponsorInquiry();

  const handleStatusUpdate = async (inquiryId: bigint, status: SponsorInquiryStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ inquiryId, status });
      toast.success('Inquiry status updated successfully');
    } catch (error) {
      toast.error('Failed to update inquiry status');
      console.error(error);
    }
  };

  const handleDelete = async (inquiryId: bigint) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await deleteInquiryMutation.mutateAsync(inquiryId);
      toast.success('Inquiry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete inquiry');
      console.error(error);
    }
  };

  const getStatusBadge = (status: SponsorInquiryStatus) => {
    const statusMap = {
      pending: { variant: 'secondary' as const, label: 'Pending', className: undefined },
      contacted: { variant: 'default' as const, label: 'Contacted', className: undefined },
      confirmed: { variant: 'default' as const, label: 'Confirmed', className: 'bg-green-600' },
      rejected: { variant: 'destructive' as const, label: 'Rejected', className: undefined },
    };
    const config = statusMap[status];
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const statusCounts = {
    pending: inquiries?.filter(([_, inq]) => inq.status === SponsorInquiryStatus.pending).length || 0,
    contacted: inquiries?.filter(([_, inq]) => inq.status === SponsorInquiryStatus.contacted).length || 0,
    confirmed: inquiries?.filter(([_, inq]) => inq.status === SponsorInquiryStatus.confirmed).length || 0,
    rejected: inquiries?.filter(([_, inq]) => inq.status === SponsorInquiryStatus.rejected).length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate({ to: '/admin' })} className="mb-4">
            ← Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-saffron" />
            <h1 className="text-4xl font-bold">Sponsor Management</h1>
          </div>
          <p className="text-muted-foreground">Manage sponsor inquiries and partnerships</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inquiries?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts.confirmed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Contacted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statusCounts.contacted}</div>
            </CardContent>
          </Card>
        </div>

        {/* Inquiries Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Sponsor Inquiries</CardTitle>
            <CardDescription>Manage and track sponsorship requests</CardDescription>
          </CardHeader>
          <CardContent>
            {inquiriesLoading ? (
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
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries?.map(([id, inquiry]) => (
                      <TableRow key={id.toString()}>
                        <TableCell className="font-medium">{inquiry.name}</TableCell>
                        <TableCell>{inquiry.company}</TableCell>
                        <TableCell>{inquiry.contact}</TableCell>
                        <TableCell>{inquiry.sponsorshipLevel}</TableCell>
                        <TableCell className="max-w-xs truncate">{inquiry.message}</TableCell>
                        <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={inquiry.status}
                              onValueChange={(value) => handleStatusUpdate(id, value as SponsorInquiryStatus)}
                              disabled={updateStatusMutation.isPending}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={SponsorInquiryStatus.pending}>Pending</SelectItem>
                                <SelectItem value={SponsorInquiryStatus.contacted}>Contacted</SelectItem>
                                <SelectItem value={SponsorInquiryStatus.confirmed}>Confirmed</SelectItem>
                                <SelectItem value={SponsorInquiryStatus.rejected}>Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(id)}
                              disabled={deleteInquiryMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

export default function AdminSponsorsPage() {
  return (
    <AdminRouteGuard>
      <AdminSponsorsContent />
    </AdminRouteGuard>
  );
}
