export interface CategoryQuantity {
  single: number;
  double: number;
  king: number;
  superking: number;
}

export interface Company {
  id: string;
  name: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  totalProperties: number;
  activeProperties: number;
  status: 'active' | 'inactive';
}

export interface Property {
  id: string;
  companyId: string;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  lastDeliveryDate: string;
  nextCollectionDate: string;
  status: 'active' | 'pending' | 'overdue';
  daysOverdue?: number;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'super-admin' | 'employee';
  assignedCompanies: string[];
  lastLogin: string;
  status: 'active' | 'inactive';
}

export interface Collection {
  id: string;
  propertyId: string;
  propertyAddress: string;
  collectionType: 'scheduled' | 'early-request';
  deadline: string;
  status: 'pending' | 'collected' | 'delivered' | 'overdue';
  priority: 'normal' | 'high' | 'urgent';
}

export interface CollectionItem {
  id: string;
  description: string;
  quantities: CategoryQuantity;
  imagePreviews: string[];
  addedAt: string;
}

export interface ExtendedCollection extends Omit<Collection, 'status'> {
  status: 'running' | 'upcoming' | 'overdue' | 'completed';
  propertyName: string;
  manualOverride: boolean;
  deliveryDate: string;
  items: CollectionItem[];
}

export interface Request {
  id: string;
  propertyId: string;
  propertyAddress: string;
  requestDate: string;
  reason: 'used' | 'guest-change' | 'emergency';
  priority: 'normal' | 'high' | 'urgent';
  assignedAdmin: string | null;
  status: 'pending' | 'approved' | 'assigned' | 'completed';
}

// Companies
export const mockCompanies: Company[] = [
  {
    id: 'COMP-001',
    name: 'Coastal Vacation Rentals',
    contactPerson: 'Robert Martinez',
    contactEmail: 'robert@coastalvr.com',
    contactPhone: '+1 (305) 555-1100',
    address: '100 Brickell Ave, Miami, FL 33131',
    totalProperties: 12,
    activeProperties: 10,
    status: 'active',
  },
  {
    id: 'COMP-002',
    name: 'Sunshine Properties LLC',
    contactPerson: 'Jennifer Adams',
    contactEmail: 'jennifer@sunshineprops.com',
    contactPhone: '+1 (305) 555-2200',
    address: '500 Collins Ave, Miami Beach, FL 33139',
    totalProperties: 8,
    activeProperties: 7,
    status: 'active',
  },
  {
    id: 'COMP-003',
    name: 'Miami Luxury Stays',
    contactPerson: 'Michael Chen',
    contactEmail: 'michael@miamiluxury.com',
    contactPhone: '+1 (305) 555-3300',
    address: '200 S Biscayne Blvd, Miami, FL 33131',
    totalProperties: 15,
    activeProperties: 12,
    status: 'active',
  },
  {
    id: 'COMP-004',
    name: 'Beach House Management',
    contactPerson: 'Sarah Thompson',
    contactEmail: 'sarah@beachhousemgmt.com',
    contactPhone: '+1 (305) 555-4400',
    address: '750 Ocean Dr, Miami Beach, FL 33139',
    totalProperties: 6,
    activeProperties: 5,
    status: 'active',
  },
  {
    id: 'COMP-005',
    name: 'Florida Keys Rentals',
    contactPerson: 'David Wilson',
    contactEmail: 'david@floridakeysrentals.com',
    contactPhone: '+1 (305) 555-5500',
    address: '101 Overseas Hwy, Key Largo, FL 33037',
    totalProperties: 10,
    activeProperties: 8,
    status: 'active',
  },
  {
    id: 'COMP-006',
    name: 'Urban Oasis Properties',
    contactPerson: 'Lisa Garcia',
    contactEmail: 'lisa@urbanoasis.com',
    contactPhone: '+1 (305) 555-6600',
    address: '1200 Brickell Bay Dr, Miami, FL 33131',
    totalProperties: 4,
    activeProperties: 3,
    status: 'inactive',
  },
];

// Properties with company associations
export const mockProperties: Property[] = [
  // Coastal Vacation Rentals (COMP-001)
  {
    id: 'PROP-001',
    companyId: 'COMP-001',
    name: 'Beachfront Villa',
    address: '123 Ocean Drive, Miami, FL 33139',
    contactPerson: 'John Smith',
    contactPhone: '+1 (305) 555-0123',
    lastDeliveryDate: '2026-03-10',
    nextCollectionDate: '2026-03-24',
    status: 'active',
  },
  {
    id: 'PROP-002',
    companyId: 'COMP-001',
    name: 'Ocean View Condo',
    address: '125 Ocean Drive, Miami, FL 33139',
    contactPerson: 'John Smith',
    contactPhone: '+1 (305) 555-0124',
    lastDeliveryDate: '2026-03-12',
    nextCollectionDate: '2026-03-26',
    status: 'active',
  },
  {
    id: 'PROP-003',
    companyId: 'COMP-001',
    name: 'Seaside Retreat',
    address: '130 Ocean Drive, Miami, FL 33139',
    contactPerson: 'Anna Lopez',
    contactPhone: '+1 (305) 555-0125',
    lastDeliveryDate: '2026-03-05',
    nextCollectionDate: '2026-03-19',
    status: 'overdue',
    daysOverdue: 6,
  },
  // Sunshine Properties LLC (COMP-002)
  {
    id: 'PROP-004',
    companyId: 'COMP-002',
    name: 'Downtown Loft',
    address: '456 Main Street, Miami, FL 33130',
    contactPerson: 'Sarah Johnson',
    contactPhone: '+1 (305) 555-0456',
    lastDeliveryDate: '2026-03-05',
    nextCollectionDate: '2026-03-19',
    status: 'overdue',
    daysOverdue: 6,
  },
  {
    id: 'PROP-005',
    companyId: 'COMP-002',
    name: 'City Center Studio',
    address: '460 Main Street, Miami, FL 33130',
    contactPerson: 'Sarah Johnson',
    contactPhone: '+1 (305) 555-0457',
    lastDeliveryDate: '2026-03-14',
    nextCollectionDate: '2026-03-28',
    status: 'active',
  },
  // Miami Luxury Stays (COMP-003)
  {
    id: 'PROP-006',
    companyId: 'COMP-003',
    name: 'Sunset Apartment',
    address: '789 Bay Road, Miami Beach, FL 33140',
    contactPerson: 'Mike Wilson',
    contactPhone: '+1 (305) 555-0789',
    lastDeliveryDate: '2026-03-12',
    nextCollectionDate: '2026-03-26',
    status: 'active',
  },
  {
    id: 'PROP-007',
    companyId: 'COMP-003',
    name: 'Luxury Penthouse',
    address: '800 Bay Road, Miami Beach, FL 33140',
    contactPerson: 'Mike Wilson',
    contactPhone: '+1 (305) 555-0790',
    lastDeliveryDate: '2026-03-08',
    nextCollectionDate: '2026-03-22',
    status: 'overdue',
    daysOverdue: 3,
  },
  {
    id: 'PROP-008',
    companyId: 'COMP-003',
    name: 'Waterfront Suite',
    address: '810 Bay Road, Miami Beach, FL 33140',
    contactPerson: 'Emma Davis',
    contactPhone: '+1 (305) 555-0791',
    lastDeliveryDate: '2026-03-15',
    nextCollectionDate: '2026-03-29',
    status: 'pending',
  },
  // Beach House Management (COMP-004)
  {
    id: 'PROP-009',
    companyId: 'COMP-004',
    name: 'Harbor View Suite',
    address: '321 Marina Way, Key Biscayne, FL 33149',
    contactPerson: 'Emily Brown',
    contactPhone: '+1 (305) 555-0321',
    lastDeliveryDate: '2026-03-08',
    nextCollectionDate: '2026-03-22',
    status: 'overdue',
    daysOverdue: 3,
  },
  {
    id: 'PROP-010',
    companyId: 'COMP-004',
    name: 'Marina Apartment',
    address: '325 Marina Way, Key Biscayne, FL 33149',
    contactPerson: 'Emily Brown',
    contactPhone: '+1 (305) 555-0322',
    lastDeliveryDate: '2026-03-16',
    nextCollectionDate: '2026-03-30',
    status: 'active',
  },
  // Florida Keys Rentals (COMP-005)
  {
    id: 'PROP-011',
    companyId: 'COMP-005',
    name: 'Palm Heights',
    address: '555 Palm Avenue, Coral Gables, FL 33134',
    contactPerson: 'David Lee',
    contactPhone: '+1 (305) 555-0555',
    lastDeliveryDate: '2026-03-15',
    nextCollectionDate: '2026-03-29',
    status: 'pending',
  },
  {
    id: 'PROP-012',
    companyId: 'COMP-005',
    name: 'Tropical Paradise',
    address: '560 Palm Avenue, Coral Gables, FL 33134',
    contactPerson: 'David Lee',
    contactPhone: '+1 (305) 555-0556',
    lastDeliveryDate: '2026-03-11',
    nextCollectionDate: '2026-03-25',
    status: 'active',
  },
  // Urban Oasis Properties (COMP-006)
  {
    id: 'PROP-013',
    companyId: 'COMP-006',
    name: 'Urban Loft',
    address: '1205 Brickell Bay Dr, Miami, FL 33131',
    contactPerson: 'Chris Anderson',
    contactPhone: '+1 (305) 555-0660',
    lastDeliveryDate: '2026-03-09',
    nextCollectionDate: '2026-03-23',
    status: 'active',
  },
];

export const mockAdmins: Admin[] = [
  {
    id: 'ADM-001',
    name: 'Jayed&Kamran',
    email: 'superadmin1@laundry.com',
    phone: '+1 (305) 555-1001',
    role: 'super-admin',
    assignedCompanies: ['COMP-001', 'COMP-002', 'COMP-003', 'COMP-004', 'COMP-005', 'COMP-006'],
    lastLogin: '2026-03-16 09:30 AM',
    status: 'active',
  },
  {
    id: 'ADM-002',
    name: 'Employee 1',
    email: 'maria@laundryops.com',
    phone: '+1 (305) 555-1002',
    role: 'employee',
    assignedCompanies: ['COMP-001', 'COMP-002'],
    lastLogin: '2026-03-16 08:45 AM',
    status: 'active',
  },
  {
    id: 'ADM-003',
    name: 'Employee 2',
    email: 'carlos@laundryops.com',
    phone: '+1 (305) 555-1003',
    role: 'employee',
    assignedCompanies: ['COMP-003', 'COMP-004'],
    lastLogin: '2026-03-15 04:20 PM',
    status: 'active',
  },
  {
    id: 'ADM-004',
    name: 'Employee 3',
    email: 'ana@laundryops.com',
    phone: '+1 (305) 555-1004',
    role: 'employee',
    assignedCompanies: ['COMP-005', 'COMP-006'],
    lastLogin: '2026-03-16 10:15 AM',
    status: 'active',
  },
  {
    id: 'ADM-005',
    name: 'Employee 4',
    email: 'david@laundryops.com',
    phone: '+1 (305) 555-1005',
    role: 'employee',
    assignedCompanies: ['COMP-001', 'COMP-003'],
    lastLogin: '2026-03-14 02:30 PM',
    status: 'active',
  },
  {
    id: 'ADM-006',
    name: 'Employee 5',
    email: 'sofia@laundryops.com',
    phone: '+1 (305) 555-1006',
    role: 'employee',
    assignedCompanies: ['COMP-002', 'COMP-004'],
    lastLogin: '2026-03-16 07:00 AM',
    status: 'active',
  },
  {
    id: 'ADM-007',
    name: 'Employee 6',
    email: 'michael@laundryops.com',
    phone: '+1 (305) 555-1007',
    role: 'employee',
    assignedCompanies: ['COMP-005'],
    lastLogin: '2026-03-15 11:45 AM',
    status: 'active',
  },
  {
    id: 'ADM-008',
    name: 'Employee 7',
    email: 'emily@laundryops.com',
    phone: '+1 (305) 555-1008',
    role: 'employee',
    assignedCompanies: ['COMP-006', 'COMP-001'],
    lastLogin: '2026-03-13 03:00 PM',
    status: 'inactive',
  },
  {
    id: 'ADM-009',
    name: 'Employee 8',
    email: 'robert@laundryops.com',
    phone: '+1 (305) 555-1009',
    role: 'employee',
    assignedCompanies: ['COMP-002', 'COMP-003'],
    lastLogin: '2026-03-16 09:00 AM',
    status: 'active',
  },
  {
    id: 'ADM-010',
    name: 'Employee 9',
    email: 'jessica@laundryops.com',
    phone: '+1 (305) 555-1010',
    role: 'employee',
    assignedCompanies: ['COMP-004', 'COMP-005'],
    lastLogin: '2026-03-15 05:30 PM',
    status: 'active',
  },
  {
    id: 'ADM-011',
    name: 'Employee 10',
    email: 'daniel@laundryops.com',
    phone: '+1 (305) 555-1011',
    role: 'employee',
    assignedCompanies: ['COMP-001'],
    lastLogin: '2026-03-14 10:00 AM',
    status: 'active',
  },
  {
    id: 'ADM-012',
    name: 'Employee 11',
    email: 'laura@laundryops.com',
    phone: '+1 (305) 555-1012',
    role: 'employee',
    assignedCompanies: ['COMP-003', 'COMP-006'],
    lastLogin: '2026-03-16 08:30 AM',
    status: 'active',
  },
];

export const mockCollections: ExtendedCollection[] = [
  {
    id: 'COL-001',
    propertyId: 'PROP-001',
    propertyName: 'Beachfront Villa',
    propertyAddress: '123 Ocean Drive, Miami, FL 33139',
    collectionType: 'scheduled',
    deadline: '2026-07-30',
    status: 'running',
    priority: 'normal',
    manualOverride: false,
    deliveryDate: '2026-07-16',
    items: [
      {
        id: 'ITEM-001',
        description: 'Initial bed linen collection',
        quantities: { single: 2, double: 1, king: 1, superking: 0 },
        imagePreviews: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='],
        addedAt: '2026-07-16',
      }
    ],
  },
  {
    id: 'COL-002',
    propertyId: 'PROP-004',
    propertyName: 'Downtown Loft',
    propertyAddress: '456 Main Street, Miami, FL 33130',
    collectionType: 'scheduled',
    deadline: '2026-06-15',
    status: 'overdue',
    priority: 'urgent',
    manualOverride: false,
    deliveryDate: '2026-06-01',
    items: [
      {
        id: 'ITEM-002',
        description: 'Full property turnover',
        quantities: { single: 0, double: 2, king: 0, superking: 0 },
        imagePreviews: [],
        addedAt: '2026-06-01',
      }
    ],
  },
  {
    id: 'COL-003',
    propertyId: 'PROP-006',
    propertyName: 'Sunset Apartment',
    propertyAddress: '789 Bay Road, Miami Beach, FL 33140',
    collectionType: 'scheduled',
    deadline: '2026-08-05',
    status: 'upcoming',
    priority: 'normal',
    manualOverride: true,
    deliveryDate: '2026-07-22',
    items: [
      {
        id: 'ITEM-003',
        description: 'Guest change request',
        quantities: { single: 1, double: 0, king: 1, superking: 0 },
        imagePreviews: [],
        addedAt: '2026-07-22',
      }
    ],
  },
  {
    id: 'COL-004',
    propertyId: 'PROP-007',
    propertyName: 'Luxury Penthouse',
    propertyAddress: '800 Bay Road, Miami Beach, FL 33140',
    collectionType: 'scheduled',
    deadline: '2026-07-28',
    status: 'running',
    priority: 'high',
    manualOverride: false,
    deliveryDate: '2026-07-14',
    items: [
      {
        id: 'ITEM-004',
        description: 'Premium service collection',
        quantities: { single: 0, double: 0, king: 2, superking: 1 },
        imagePreviews: [],
        addedAt: '2026-07-14',
      }
    ],
  },
  {
    id: 'COL-005',
    propertyId: 'PROP-009',
    propertyName: 'Harbor View Suite',
    propertyAddress: '321 Marina Way, Key Biscayne, FL 33149',
    collectionType: 'scheduled',
    deadline: '2026-08-12',
    status: 'upcoming',
    priority: 'normal',
    manualOverride: true,
    deliveryDate: '2026-07-29',
    items: [
      {
        id: 'ITEM-005',
        description: 'Weekly scheduled collection',
        quantities: { single: 2, double: 2, king: 0, superking: 0 },
        imagePreviews: [],
        addedAt: '2026-07-29',
      }
    ],
  },
  {
    id: 'COL-006',
    propertyId: 'PROP-010',
    propertyName: 'Marina Apartment',
    propertyAddress: '325 Marina Way, Key Biscayne, FL 33149',
    collectionType: 'scheduled',
    deadline: '2026-07-29',
    status: 'running',
    priority: 'normal',
    manualOverride: false,
    deliveryDate: '2026-07-15',
    items: [
      {
        id: 'ITEM-006',
        description: 'Standard collection',
        quantities: { single: 1, double: 1, king: 1, superking: 0 },
        imagePreviews: [],
        addedAt: '2026-07-15',
      }
    ],
  },
  {
    id: 'COL-007',
    propertyId: 'PROP-003',
    propertyName: 'Seaside Retreat',
    propertyAddress: '130 Ocean Drive, Miami, FL 33139',
    collectionType: 'scheduled',
    deadline: '2026-06-25',
    status: 'overdue',
    priority: 'high',
    manualOverride: false,
    deliveryDate: '2026-06-11',
    items: [
      {
        id: 'ITEM-007',
        description: 'Deep clean collection',
        quantities: { single: 2, double: 2, king: 0, superking: 0 },
        imagePreviews: [],
        addedAt: '2026-06-11',
      }
    ],
  },
  {
    id: 'COL-008',
    propertyId: 'PROP-011',
    propertyName: 'Palm Heights',
    propertyAddress: '555 Palm Avenue, Coral Gables, FL 33134',
    collectionType: 'scheduled',
    deadline: '2026-07-10',
    status: 'overdue',
    priority: 'normal',
    manualOverride: false,
    deliveryDate: '2026-06-26',
    items: [
      {
        id: 'ITEM-008',
        description: 'Regular rotation',
        quantities: { single: 0, double: 1, king: 1, superking: 0 },
        imagePreviews: [],
        addedAt: '2026-06-26',
      }
    ],
  },
  {
    id: 'COL-009',
    propertyId: 'PROP-013',
    propertyName: 'Urban Loft',
    propertyAddress: '1205 Brickell Bay Dr, Miami, FL 33131',
    collectionType: 'scheduled',
    deadline: '2026-07-20',
    status: 'overdue',
    priority: 'normal',
    manualOverride: true,
    deliveryDate: '2026-07-06',
    items: [
      {
        id: 'ITEM-009',
        description: 'Emergency extra towels',
        quantities: { single: 0, double: 0, king: 0, superking: 0 },
        imagePreviews: [],
        addedAt: '2026-07-06',
      }
    ],
  },
];

export const mockRequests: Request[] = [
  {
    id: 'REQ-001',
    propertyId: 'PROP-006',
    propertyAddress: '789 Bay Road, Miami Beach, FL 33140',
    requestDate: '2026-03-14',
    reason: 'guest-change',
    priority: 'high',
    assignedAdmin: null,
    status: 'pending',
  },
  {
    id: 'REQ-002',
    propertyId: 'PROP-001',
    propertyAddress: '123 Ocean Drive, Miami, FL 33139',
    requestDate: '2026-03-12',
    reason: 'used',
    priority: 'normal',
    assignedAdmin: 'Maria Garcia',
    status: 'assigned',
  },
  {
    id: 'REQ-003',
    propertyId: 'PROP-011',
    propertyAddress: '555 Palm Avenue, Coral Gables, FL 33134',
    requestDate: '2026-03-15',
    reason: 'emergency',
    priority: 'urgent',
    assignedAdmin: null,
    status: 'pending',
  },
];

export const dashboardStats = {
  totalCompanies: 6,
  totalProperties: 13,
  activeProperties: 10,
  pendingCollections: 7,
  overdueCollections: 4,
  todaysPickups: 5,
  totalAdmins: 12,
  activeAdmins: 11,
};

// Helper function to get company by ID
export const getCompanyById = (companyId: string): Company | undefined => {
  return mockCompanies.find(company => company.id === companyId);
};

// Helper function to get properties by company ID
export const getPropertiesByCompanyId = (companyId: string): Property[] => {
  return mockProperties.filter(property => property.companyId === companyId);
};

// Helper function to get admin by ID
export const getAdminById = (adminId: string): Admin | undefined => {
  return mockAdmins.find(admin => admin.id === adminId);
};

// Demo admin accounts (shown on login page, clickable to auto-fill)
export const demoAdminAccounts = [
  { email: 'admin.rafiq@gmail.com', password: 'rafiq2026', name: 'Employee Rafiqul', role: 'employee' as const },
  { email: 'admin.nusrat@gmail.com', password: 'nusrat2026', name: 'Employee Nusrat', role: 'employee' as const },
  { email: 'employee.john@gmail.com', password: 'john2026', name: 'Employee John', role: 'employee' as const },
  { email: 'employee.sarah@gmail.com', password: 'sarah2026', name: 'Employee Sarah', role: 'employee' as const },
];

// Helper function to authenticate admin
// Super admin (hidden) + demo admins (visible on login page)
export const authenticateAdmin = (email: string, password: string): Admin | null => {
  // Super admin — credential NOT shown on login page
  if (email === 'superadmin1@laundry.com' && password === 'admin123') {
    return {
      id: 'ADM-001',
      name: 'Jayed&Kamran',
      email: 'superadmin1@laundry.com',
      phone: '+880 1700-000001',
      role: 'super-admin',
      assignedCompanies: ['COMP-001', 'COMP-002', 'COMP-003', 'COMP-004', 'COMP-005', 'COMP-006'],
      lastLogin: new Date().toLocaleString(),
      status: 'active',
    };
  }

  // Demo admin accounts
  const demo = demoAdminAccounts.find(a => a.email === email && a.password === password);
  if (demo) {
    return {
      id: 'ADM-' + String(demoAdminAccounts.indexOf(demo) + 10).padStart(3, '0'),
      name: demo.name,
      email: demo.email,
      phone: '+880 1700-000000',
      role: demo.role,
      assignedCompanies: ['COMP-001', 'COMP-002', 'COMP-003'],
      lastLogin: new Date().toLocaleString(),
      status: 'active',
    };
  }

  return null;
};
