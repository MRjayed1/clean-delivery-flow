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
import { Plus, Search, Building2, Eye } from 'lucide-react';
import { mockCompanies, getPropertiesByCompanyId, Company } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

export default function Companies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  const filteredCompanies = mockCompanies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Company['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="active">Active</Badge>;
      case 'inactive':
        return <Badge variant="pending">Inactive</Badge>;
    }
  };

  const handleViewProperties = (companyId: string) => {
    navigate(`/properties?company=${companyId}`);
  };

  return (
    <div className="min-h-screen">
      <Header title="Companies" description="Manage all client companies" />

      <main className="p-6 space-y-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="dashboard-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Companies</p>
                <p className="text-2xl font-semibold">{mockCompanies.length}</p>
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-success/10">
                <Building2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Companies</p>
                <p className="text-2xl font-semibold">
                  {mockCompanies.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-warning/10">
                <Building2 className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <p className="text-2xl font-semibold">
                  {mockCompanies.reduce((acc, c) => acc + c.totalProperties, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or contact..."
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
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </Button>
        </div>

        {/* Companies Table */}
        <div className="data-table">
          <Table>
            <TableHeader>
              <TableRow className="table-header">
                <TableHead className="pl-6">Company ID</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => {
                const propertyCount = getPropertiesByCompanyId(company.id).length;
                return (
                  <TableRow key={company.id} className="table-row cursor-pointer">
                    <TableCell className="pl-6 font-medium">{company.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {company.address}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{company.contactPerson}</p>
                        <p className="text-sm text-muted-foreground">{company.contactEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{propertyCount}</span>
                        <span className="text-sm text-muted-foreground">properties</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(company.status)}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProperties(company.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Properties
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No companies found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}
