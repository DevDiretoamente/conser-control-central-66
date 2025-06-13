export interface Vehicle {
  id: string;
  type: 'car' | 'truck' | 'heavy_equipment' | 'motorcycle' | 'van';
  brand: string;
  model: string;
  year: number;
  plate?: string;
  chassi?: string;
  renavam?: string;
  color: string;
  fuel: 'gasoline' | 'diesel' | 'flex' | 'electric' | 'hybrid';
  status: 'active' | 'maintenance' | 'inactive' | 'sold';
  mileage: number;
  acquisitionDate: string;
  acquisitionValue: number;
  currentValue: number;
  insuranceCompany?: string;
  insuranceExpiryDate?: string;
  ipvaExpiryDate?: string;
  licensingExpiryDate?: string;
  documents: VehicleDocument[];
  maintenances: Maintenance[];
  fuelRecords: FuelRecord[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  type: 'crlv' | 'ipva' | 'insurance' | 'licensing' | 'inspection' | 'aet' | 'special_permit' | 'certificate' | 'custom' | 'other';
  title: string;
  description: string;
  documentNumber?: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority?: string;
  value?: number;
  pdfFile?: string; // Base64 encoded PDF or file reference
  fileName?: string;
  attachments: string[];
  status: 'valid' | 'expired' | 'expiring_soon';
  reminderDays: number;
  autoRenew?: boolean;
  renewalHistory: DocumentRenewal[];
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRenewal {
  id: string;
  renewalDate: string;
  previousExpiryDate: string;
  newExpiryDate: string;
  cost?: number;
  notes?: string;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  type: 'preventive' | 'corrective' | 'emergency';
  category: 'engine' | 'transmission' | 'brakes' | 'tires' | 'electrical' | 'body' | 'other';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  mileage: number;
  cost: number;
  supplier?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  items: MaintenanceItem[];
  attachments: string[];
  notes?: string;
  nextMaintenanceDate?: string;
  nextMaintenanceMileage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  type: 'labor' | 'part' | 'service';
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  mileage: number;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  fuelType: 'gasoline' | 'diesel' | 'ethanol' | 'electric';
  gasStation: string;
  attendant?: string;
  receipt?: string;
  notes?: string;
  createdAt: string;
}

export interface FleetDashboardData {
  totalVehicles: number;
  activeVehicles: number;
  maintenanceVehicles: number;
  pendingMaintenances: number;
  expiringDocuments: number;
  totalMonthlyCost: number;
  averageFuelConsumption: number;
  maintenanceCosts: number;
  fuelCosts: number;
  vehiclesByType: Record<string, number>;
  maintenancesByMonth: Array<{ month: string; count: number; cost: number }>;
  fuelConsumptionTrend: Array<{ month: string; consumption: number; cost: number }>;
}

export interface FleetFilter {
  search?: string;
  type?: Vehicle['type'] | 'all';
  status?: Vehicle['status'] | 'all';
  fuel?: Vehicle['fuel'] | 'all';
  year?: number;
  expiringDocuments?: boolean;
  pendingMaintenance?: boolean;
}

export interface MaintenanceFilter {
  search?: string;
  vehicleId?: string;
  type?: Maintenance['type'] | 'all';
  status?: Maintenance['status'] | 'all';
  category?: Maintenance['category'] | 'all';
  dateFrom?: string;
  dateTo?: string;
  costFrom?: number;
  costTo?: number;
}

export interface DocumentFilter {
  search?: string;
  vehicleId?: string;
  type?: VehicleDocument['type'] | 'all';
  status?: VehicleDocument['status'] | 'all';
  expiryDateFrom?: string;
  expiryDateTo?: string;
  issuingAuthority?: string;
}
