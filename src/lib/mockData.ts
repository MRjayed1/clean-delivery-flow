export interface Property {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  lastDeliveryDate: string;
  nextCollectionDate: string;
  status: 'active' | 'pending' | 'overdue';
  assignedEmployee: string;
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

export const mockProperties: Property[] = [
  {
    id: 'PROP-001',
    name: 'Beachfront Villa',
    address: '123 Ocean Drive, Miami, FL 33139',
    contactPerson: 'John Smith',
    contactPhone: '+1 (305) 555-0123',
    lastDeliveryDate: '2025-01-10',
    nextCollectionDate: '2025-01-24',
    status: 'active',
    assignedEmployee: 'Maria Garcia',
  },
  {
    id: 'PROP-002',
    name: 'Downtown Loft',
    address: '456 Main Street, Miami, FL 33130',
    contactPerson: 'Sarah Johnson',
    contactPhone: '+1 (305) 555-0456',
    lastDeliveryDate: '2025-01-05',
    nextCollectionDate: '2025-01-19',
    status: 'overdue',
    assignedEmployee: 'Carlos Rodriguez',
    daysOverdue: 6,
  },
  {
    id: 'PROP-003',
    name: 'Sunset Apartment',
    address: '789 Bay Road, Miami Beach, FL 33140',
    contactPerson: 'Mike Wilson',
    contactPhone: '+1 (305) 555-0789',
    lastDeliveryDate: '2025-01-12',
    nextCollectionDate: '2025-01-26',
    status: 'active',
    assignedEmployee: 'Maria Garcia',
  },
  {
    id: 'PROP-004',
    name: 'Harbor View Suite',
    address: '321 Marina Way, Key Biscayne, FL 33149',
    contactPerson: 'Emily Brown',
    contactPhone: '+1 (305) 555-0321',
    lastDeliveryDate: '2025-01-08',
    nextCollectionDate: '2025-01-22',
    status: 'overdue',
    assignedEmployee: 'Unassigned',
    daysOverdue: 3,
  },
  {
    id: 'PROP-005',
    name: 'Palm Heights',
    address: '555 Palm Avenue, Coral Gables, FL 33134',
    contactPerson: 'David Lee',
    contactPhone: '+1 (305) 555-0555',
    lastDeliveryDate: '2025-01-15',
    nextCollectionDate: '2025-01-29',
    status: 'pending',
    assignedEmployee: 'Ana Martinez',
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
    propertyId: 'PROP-002',
    propertyAddress: '456 Main Street, Miami, FL 33130',
    collectionType: 'scheduled',
    deadline: '2025-01-19',
    status: 'overdue',
    priority: 'urgent',
  },
  {
    id: 'COL-003',
    propertyId: 'PROP-003',
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
    propertyId: 'PROP-003',
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
    propertyId: 'PROP-005',
    propertyAddress: '555 Palm Avenue, Coral Gables, FL 33134',
    requestDate: '2025-01-24',
    reason: 'emergency',
    priority: 'urgent',
    assignedEmployee: null,
    status: 'pending',
  },
];

export const dashboardStats = {
  totalProperties: 24,
  activeProperties: 18,
  pendingCollections: 7,
  overdueCollections: 3,
  todaysPickups: 5,
};
