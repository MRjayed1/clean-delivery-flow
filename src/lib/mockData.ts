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

export interface Employee {
  id: string;
  name: string;
  phone: string;
  assignedProperties: number;
  todaysTasks: number;
  status: 'active' | 'offline';
}

export interface Collection {
  id: string;
  propertyId: string;
  propertyAddress: string;
  collectionType: 'scheduled' | 'early-request';
  deadline: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'normal' | 'high' | 'urgent';
}

export interface Request {
  id: string;
  propertyId: string;
  propertyAddress: string;
  requestDate: string;
  reason: 'used' | 'guest-change' | 'emergency';
  priority: 'normal' | 'high' | 'urgent';
  assignedEmployee: string | null;
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
    lastDeliveryDate: '2025-01-10',
    nextCollectionDate: '2025-01-24',
    status: 'active',
  },
  {
    id: 'PROP-002',
    companyId: 'COMP-001',
    name: 'Ocean View Condo',
    address: '125 Ocean Drive, Miami, FL 33139',
    contactPerson: 'John Smith',
    contactPhone: '+1 (305) 555-0124',
    lastDeliveryDate: '2025-01-12',
    nextCollectionDate: '2025-01-26',
    status: 'active',
  },
  {
    id: 'PROP-003',
    companyId: 'COMP-001',
    name: 'Seaside Retreat',
    address: '130 Ocean Drive, Miami, FL 33139',
    contactPerson: 'Anna Lopez',
    contactPhone: '+1 (305) 555-0125',
    lastDeliveryDate: '2025-01-05',
    nextCollectionDate: '2025-01-19',
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
    lastDeliveryDate: '2025-01-05',
    nextCollectionDate: '2025-01-19',
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
    lastDeliveryDate: '2025-01-14',
    nextCollectionDate: '2025-01-28',
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
    lastDeliveryDate: '2025-01-12',
    nextCollectionDate: '2025-01-26',
    status: 'active',
  },
  {
    id: 'PROP-007',
    companyId: 'COMP-003',
    name: 'Luxury Penthouse',
    address: '800 Bay Road, Miami Beach, FL 33140',
    contactPerson: 'Mike Wilson',
    contactPhone: '+1 (305) 555-0790',
    lastDeliveryDate: '2025-01-08',
    nextCollectionDate: '2025-01-22',
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
    lastDeliveryDate: '2025-01-15',
    nextCollectionDate: '2025-01-29',
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
    lastDeliveryDate: '2025-01-08',
    nextCollectionDate: '2025-01-22',
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
    lastDeliveryDate: '2025-01-16',
    nextCollectionDate: '2025-01-30',
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
    lastDeliveryDate: '2025-01-15',
    nextCollectionDate: '2025-01-29',
    status: 'pending',
  },
  {
    id: 'PROP-012',
    companyId: 'COMP-005',
    name: 'Tropical Paradise',
    address: '560 Palm Avenue, Coral Gables, FL 33134',
    contactPerson: 'David Lee',
    contactPhone: '+1 (305) 555-0556',
    lastDeliveryDate: '2025-01-11',
    nextCollectionDate: '2025-01-25',
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
    lastDeliveryDate: '2025-01-09',
    nextCollectionDate: '2025-01-23',
    status: 'active',
  },
];

export const mockEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Maria Garcia',
    phone: '+1 (305) 555-1001',
    assignedProperties: 8,
    todaysTasks: 3,
    status: 'active',
  },
  {
    id: 'EMP-002',
    name: 'Carlos Rodriguez',
    phone: '+1 (305) 555-1002',
    assignedProperties: 6,
    todaysTasks: 2,
    status: 'active',
  },
  {
    id: 'EMP-003',
    name: 'Ana Martinez',
    phone: '+1 (305) 555-1003',
    assignedProperties: 5,
    todaysTasks: 4,
    status: 'active',
  },
  {
    id: 'EMP-004',
    name: 'Jose Hernandez',
    phone: '+1 (305) 555-1004',
    assignedProperties: 4,
    todaysTasks: 0,
    status: 'offline',
  },
];

export const mockCollections: Collection[] = [
  {
    id: 'COL-001',
    propertyId: 'PROP-001',
    propertyAddress: '123 Ocean Drive, Miami, FL 33139',
    collectionType: 'scheduled',
    deadline: '2025-01-25',
    status: 'pending',
    priority: 'normal',
  },
  {
    id: 'COL-002',
    propertyId: 'PROP-004',
    propertyAddress: '456 Main Street, Miami, FL 33130',
    collectionType: 'scheduled',
    deadline: '2025-01-19',
    status: 'overdue',
    priority: 'urgent',
  },
  {
    id: 'COL-003',
    propertyId: 'PROP-006',
    propertyAddress: '789 Bay Road, Miami Beach, FL 33140',
    collectionType: 'early-request',
    deadline: '2025-01-25',
    status: 'pending',
    priority: 'high',
  },
];

export const mockRequests: Request[] = [
  {
    id: 'REQ-001',
    propertyId: 'PROP-006',
    propertyAddress: '789 Bay Road, Miami Beach, FL 33140',
    requestDate: '2025-01-23',
    reason: 'guest-change',
    priority: 'high',
    assignedEmployee: null,
    status: 'pending',
  },
  {
    id: 'REQ-002',
    propertyId: 'PROP-001',
    propertyAddress: '123 Ocean Drive, Miami, FL 33139',
    requestDate: '2025-01-22',
    reason: 'used',
    priority: 'normal',
    assignedEmployee: 'Maria Garcia',
    status: 'assigned',
  },
  {
    id: 'REQ-003',
    propertyId: 'PROP-011',
    propertyAddress: '555 Palm Avenue, Coral Gables, FL 33134',
    requestDate: '2025-01-24',
    reason: 'emergency',
    priority: 'urgent',
    assignedEmployee: null,
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
};

// Helper function to get company by ID
export const getCompanyById = (companyId: string): Company | undefined => {
  return mockCompanies.find(company => company.id === companyId);
};

// Helper function to get properties by company ID
export const getPropertiesByCompanyId = (companyId: string): Property[] => {
  return mockProperties.filter(property => property.companyId === companyId);
};
