import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Plus, Search, Eye, Pencil } from 'lucide-react';
import { mockProperties, Property } from '@/lib/mockData';

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch =
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Property['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="active">Active</Badge>;
      case 'pending':
        return <Badge variant="pending">Pending</Badge>;
      case 'overdue':
        return <Badge variant="overdue">Overdue</Badge>;
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Properties" description="Manage all your Airbnb properties" />

      <main className="p-6 space-y-6 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by address or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-card">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Properties Table */}
        <div className="data-table">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead className="pl-6">Property ID</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Last Delivery</TableHead>
                <TableHead>Next Collection</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id} className="table-row cursor-pointer">
                  <TableCell className="pl-6 font-medium">{property.id}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <div>
                      <p className="font-medium truncate">{property.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {property.address}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{property.lastDeliveryDate}</TableCell>
                  <TableCell>{property.nextCollectionDate}</TableCell>
                  <TableCell>{getStatusBadge(property.status)}</TableCell>
                  <TableCell>{property.assignedEmployee}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}
