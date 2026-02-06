import { Property, getCompanyById } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, UserPlus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface OverdueTableProps {
  properties: Property[];
}

export function OverdueTable({ properties }: OverdueTableProps) {
  const overdueProperties = properties.filter((p) => p.status === 'overdue');

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Overdue Properties</h3>
          <p className="text-sm text-muted-foreground">
            Properties requiring immediate attention
          </p>
        </div>
        <Badge variant="overdue">{overdueProperties.length} overdue</Badge>
      </div>

      <div className="overflow-x-auto -mx-6">
        <Table>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead className="pl-6">Property ID</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Days Overdue</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overdueProperties.map((property) => {
              const company = getCompanyById(property.companyId);
              return (
                <TableRow key={property.id} className="table-row">
                  <TableCell className="pl-6 font-medium">{property.id}</TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{company?.name || 'Unknown'}</span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{property.address}</TableCell>
                  <TableCell>
                    <Badge variant="overdue">{property.daysOverdue} days</Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <UserPlus className="w-4 h-4 mr-1" />
                        Assign
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
