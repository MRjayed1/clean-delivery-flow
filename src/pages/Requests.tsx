import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, UserPlus } from 'lucide-react';
import { mockRequests, mockEmployees, Request } from '@/lib/mockData';

export default function Requests() {
  const getReasonLabel = (reason: Request['reason']) => {
    switch (reason) {
      case 'used':
        return 'Linens Used';
      case 'guest-change':
        return 'Guest Change';
      case 'emergency':
        return 'Emergency';
    }
  };

  const getPriorityBadge = (priority: Request['priority']) => {
    switch (priority) {
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>;
      case 'high':
        return <Badge variant="warning">High</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
    }
  };

  const getStatusBadge = (status: Request['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="pending">Pending</Badge>;
      case 'approved':
        return <Badge variant="scheduled">Approved</Badge>;
      case 'assigned':
        return <Badge variant="active">Assigned</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Early Collection Requests"
        description="Manage requests for early laundry collection"
      />

      <main className="p-6 space-y-6 animate-fade-in">
        {/* Info Banner */}
        <div className="dashboard-card bg-primary/5 border-primary/20">
          <p className="text-sm text-foreground">
            <strong>No more phone calls!</strong> All early collection requests are managed here.
            Approve and assign employees directly from this dashboard.
          </p>
        </div>

        {/* Requests Table */}
        <div className="data-table">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead className="pl-6">Property</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRequests.map((request) => (
                <TableRow key={request.id} className="table-row">
                  <TableCell className="pl-6">
                    <div>
                      <p className="font-medium">{request.propertyId}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {request.propertyAddress}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.reason === 'emergency'
                          ? 'destructive'
                          : request.reason === 'guest-change'
                          ? 'warning'
                          : 'secondary'
                      }
                    >
                      {getReasonLabel(request.reason)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                  <TableCell>
                    {request.assignedEmployee ? (
                      <span>{request.assignedEmployee}</span>
                    ) : (
                      <Select>
                        <SelectTrigger className="w-[160px] h-8 bg-card">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          {mockEmployees
                            .filter((e) => e.status === 'active')
                            .map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm">
                            <UserPlus className="w-4 h-4 mr-1" />
                            Assign
                          </Button>
                        </>
                      )}
                      {request.status === 'assigned' && (
                        <Button size="sm" variant="outline">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
