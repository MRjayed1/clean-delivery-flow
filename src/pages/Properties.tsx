import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Search, FileEdit, ArrowLeft, Building2, CheckCircle2, Trash2 } from 'lucide-react';
import { mockProperties, mockCompanies, getCompanyById, Property, mockCollections, ExtendedCollection, CategoryQuantity } from '@/lib/mockData';
import { PropertyDetailsDialog } from '@/components/properties/PropertyDetailsDialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Properties() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const companyIdFromUrl = searchParams.get('company');

  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>(companyIdFromUrl || 'all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Add Property dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [justAdded, setJustAdded] = useState('');

  // Add Property form state
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newCompanyId, setNewCompanyId] = useState('');
  const [newStatus, setNewStatus] = useState<'active' | 'pending'>('active');

  // Update company filter when URL changes
  useEffect(() => {
    if (companyIdFromUrl) {
      setCompanyFilter(companyIdFromUrl);
    }
  }, [companyIdFromUrl]);

  const selectedCompany = companyFilter !== 'all' ? getCompanyById(companyFilter) : null;

  const filteredProperties = properties.filter((property) => {
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

  const handlePropertySubmit = (details: {
    description: string;
    quantities: CategoryQuantity;
    imagePreviews: string[];
  }) => {
    if (!selectedProperty) return;

    // 1. Check if there's an active card (running or upcoming) for this property
    const existingCollectionIndex = mockCollections.findIndex(
      (c) => c.propertyId === selectedProperty.id && (c.status === 'running' || c.status === 'upcoming')
    );

    const newItem = {
      id: `ITEM-${Math.random().toString(36).substr(2, 9)}`,
      description: details.description,
      quantities: details.quantities,
      imagePreviews: details.imagePreviews,
      addedAt: new Date().toISOString().split('T')[0],
    };

    if (existingCollectionIndex !== -1) {
      // 2. If an active card exists, append the item
      const existingCollection = mockCollections[existingCollectionIndex];
      existingCollection.items = [...(existingCollection.items || []), newItem];
      toast.success(`Added new item to existing ${existingCollection.status} collection for ${selectedProperty.name}`);
    } else {
      // 3. Otherwise, create a new card in "upcoming"
      const newCollection: ExtendedCollection = {
        id: `COL-${Math.random().toString(36).substr(2, 9)}`,
        propertyId: selectedProperty.id,
        propertyName: selectedProperty.name,
        propertyAddress: selectedProperty.address,
        collectionType: 'scheduled',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        status: 'upcoming',
        priority: 'normal',
        manualOverride: false,
        deliveryDate: new Date().toISOString().split('T')[0],
        items: [newItem],
      };
      mockCollections.push(newCollection);
      toast.success(`New upcoming collection job generated for ${selectedProperty.name}`);
    }
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim() || !newCompanyId) return;

    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const newId = `PROP-${String(properties.length + 1).padStart(3, '0')}`;

    const newProperty: Property = {
      id: newId,
      companyId: newCompanyId,
      name: newName.trim(),
      address: newAddress.trim(),
      contactPerson: newContactPerson.trim() || 'Not assigned',
      contactPhone: newContactPhone.trim() || '+880 0000-000000',
      lastDeliveryDate: today,
      nextCollectionDate: nextWeek,
      status: newStatus,
    };

    setProperties((prev) => [newProperty, ...prev]);
    // Also push into the shared mock array so other pages see it
    mockProperties.unshift(newProperty);

    setJustAdded(newId);
    setTimeout(() => setJustAdded(''), 3000);

    toast.success(`Property "${newName.trim()}" added successfully!`);

    // Reset form
    setNewName('');
    setNewAddress('');
    setNewContactPerson('');
    setNewContactPhone('');
    setNewCompanyId('');
    setNewStatus('active');
    setIsAddDialogOpen(false);
  };

  const handleDeleteProperty = (id: string) => {
    if (window.confirm('Are you sure you want to remove this property?')) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
      toast.success('Property removed successfully');
    }
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
        {/* Success toast */}
        {justAdded && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 text-emerald-700 text-sm font-semibold border border-emerald-500/20 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Property {justAdded} added successfully!</span>
          </div>
        )}

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
          <Button onClick={() => setIsAddDialogOpen(true)}>
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
                  <TableRow
                    key={property.id}
                    className={`table-row cursor-pointer ${justAdded === property.id ? 'bg-emerald-500/5 ring-1 ring-emerald-500/20' : ''}`}
                  >
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
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDetails(property)}
                        >
                          <FileEdit className="w-4 h-4 mr-2" />
                          Add Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
        onSubmit={handlePropertySubmit}
      />

      {/* Add Property Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Add New Property
            </DialogTitle>
            <DialogDescription>
              Register a new property to manage its collections and deliveries.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddProperty} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="prop-name">Property Name *</Label>
              <Input
                id="prop-name"
                placeholder="e.g. Beachfront Villa"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prop-address">Address *</Label>
              <Input
                id="prop-address"
                placeholder="e.g. 123 Ocean Drive, Miami, FL 33139"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prop-contact">Contact Person</Label>
                <Input
                  id="prop-contact"
                  placeholder="e.g. John Smith"
                  value={newContactPerson}
                  onChange={(e) => setNewContactPerson(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prop-phone">Contact Phone</Label>
                <Input
                  id="prop-phone"
                  type="tel"
                  placeholder="e.g. +880 1712-345678"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prop-company">Assign to Company *</Label>
                <Select value={newCompanyId} onValueChange={setNewCompanyId} required>
                  <SelectTrigger id="prop-company" className="bg-card">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prop-status">Status</Label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as 'active' | 'pending')}>
                  <SelectTrigger id="prop-status" className="bg-card">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!newName.trim() || !newAddress.trim() || !newCompanyId}>
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
