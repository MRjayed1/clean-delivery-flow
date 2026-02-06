import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { Plus, Search, FileEdit, ArrowLeft } from 'lucide-react';
import { mockProperties, mockCompanies, getCompanyById, Property } from '@/lib/mockData';
import { PropertyDetailsDialog } from '@/components/properties/PropertyDetailsDialog';
import { useNavigate } from 'react-router-dom';

export default function Properties() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const companyIdFromUrl = searchParams.get('company');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>(companyIdFromUrl || 'all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Update company filter when URL changes
  useEffect(() => {
    if (companyIdFromUrl) {
      setCompanyFilter(companyIdFromUrl);
    }
  }, [companyIdFromUrl]);

  const selectedCompany = companyFilter !== 'all' ? getCompanyById(companyFilter) : null;

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch =
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesCompany = companyFilter === 'all' || property.companyId === companyFilter;
    return matchesSearch && matchesStatus && matchesCompany;
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

  const handleOpenDetails = (property: Property) => {
    setSelectedProperty(property);
    setDialogOpen(true);
  };

  const handleBackToCompanies = () => {
    navigate('/companies');
  };

  const handleClearCompanyFilter = () => {
    setCompanyFilter('all');
    navigate('/properties');
  };

  return (
    <div className="min-h-screen">
      <Header 
        title={selectedCompany ? `${selectedCompany.name} - Properties` : "Properties"} 
        description={selectedCompany ? `Managing properties for ${selectedCompany.name}` : "Manage all your Airbnb properties"} 
      />

      <main className="p-6 space-y-6 animate-fade-in">
        {/* Back button when viewing company properties */}
        {selectedCompany && (
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleBackToCompanies}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Button>
            <Button variant="ghost" onClick={handleClearCompanyFilter}>
              View All Properties
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by address, name, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            {!selectedCompany && (
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-card">
                  <SelectValue placeholder="Filter by company" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="all">All Companies</SelectItem>
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
                {!selectedCompany && <TableHead>Company</TableHead>}
                <TableHead>Address</TableHead>
                <TableHead>Last Delivery</TableHead>
                <TableHead>Next Collection</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => {
                const company = getCompanyById(property.companyId);
                return (
                  <TableRow key={property.id} className="table-row cursor-pointer">
                    <TableCell className="pl-6 font-medium">{property.id}</TableCell>
                    {!selectedCompany && (
                      <TableCell>
                        <span className="text-sm font-medium">{company?.name || 'Unknown'}</span>
                      </TableCell>
                    )}
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
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDetails(property)}
                      >
                        <FileEdit className="w-4 h-4 mr-2" />
                        Add Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found matching your criteria.</p>
          </div>
        )}
      </main>

      <PropertyDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        property={selectedProperty}
      />
    </div>
  );
}
