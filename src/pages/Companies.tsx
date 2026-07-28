import { useState } from 'react';
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
import { Plus, Search, Building2, Eye, CheckCircle2, Trash2 } from 'lucide-react';
import { mockCompanies as initialCompanies, getPropertiesByCompanyId, Company } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [justAdded, setJustAdded] = useState('');
  const navigate = useNavigate();

  // Add Company form state
  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const filteredCompanies = companies.filter((company) => {
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

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newContact.trim()) return;

    const newId = `COMP-${String(companies.length + 1).padStart(3, '0')}`;
    const newCompany: Company = {
      id: newId,
      name: newName.trim(),
      contactPerson: newContact.trim(),
      contactEmail: newEmail.trim() || `${newName.trim().toLowerCase().replace(/\s+/g, '')}@company.com`,
      contactPhone: newPhone.trim() || '+880 0000-000000',
      address: newAddress.trim() || 'Dhaka, Bangladesh',
      totalProperties: 0,
      activeProperties: 0,
      status: 'active',
    };

    setCompanies((prev) => [newCompany, ...prev]);
    setJustAdded(newId);
    setTimeout(() => setJustAdded(''), 3000);

    // Reset form
    setNewName('');
    setNewContact('');
    setNewEmail('');
    setNewPhone('');
    setNewAddress('');
    setIsAddDialogOpen(false);
  };

  const handleDeleteCompany = (id: string) => {
    if (window.confirm('Are you sure you want to remove this company?')) {
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      toast.success('Company removed successfully');
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Companies" description="Manage all client companies" />

      <main className="p-6 space-y-6 animate-fade-in">
        {/* Success toast */}
        {justAdded && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 text-emerald-700 text-sm font-semibold border border-emerald-500/20 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Company {justAdded} added successfully!</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="dashboard-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Companies</p>
                <p className="text-2xl font-semibold">{companies.length}</p>
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
                  {companies.filter(c => c.status === 'active').length}
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
                  {companies.reduce((acc, c) => acc + c.totalProperties, 0)}
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
          <Button onClick={() => setIsAddDialogOpen(true)}>
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
                const propertyCount = getPropertiesByCompanyId(company.id).length || company.totalProperties;
                return (
                  <TableRow
                    key={company.id}
                    className={`table-row cursor-pointer ${justAdded === company.id ? 'bg-emerald-500/5 ring-1 ring-emerald-500/20' : ''}`}
                  >
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
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProperties(company.id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Properties
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteCompany(company.id)}
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

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No companies found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Add Company Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Add New Company
            </DialogTitle>
            <DialogDescription>
              Register a new client company to manage their properties and collections.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCompany} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name *</Label>
              <Input
                id="company-name"
                placeholder="e.g. Sunshine Properties LLC"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-person">Contact Person *</Label>
                <Input
                  id="contact-person"
                  placeholder="e.g. John Smith"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="e.g. john@company.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="e.g. +880 1712-345678"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address">Address</Label>
                <Input
                  id="company-address"
                  placeholder="e.g. Gulshan 2, Dhaka"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!newName.trim() || !newContact.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
