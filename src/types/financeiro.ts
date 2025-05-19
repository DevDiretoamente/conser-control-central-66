// Financial system data types
import { User } from '@/types/auth';

// Cost Center Types
export type CostCenterStatus = 'active' | 'inactive' | 'archived';

export interface CostCenter {
  id: string;
  name: string;
  description: string;
  parentId?: string; // For hierarchical cost centers
  status: CostCenterStatus;
  obraId?: string; // Associated construction project
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Customer Types
export type PersonType = 'physical' | 'legal'; // Physical person or legal entity

export interface Customer {
  id: string;
  name: string;
  type: PersonType;
  document: string; // CPF or CNPJ
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  // New fields
  contactPerson?: string;
  contactPhone?: string;
  website?: string;
  landlinePhone?: string;
  mobilePhone?: string;
  alternativeEmail?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Supplier Types
export type SupplierType = 'physical' | 'legal'; // Physical person or legal entity

export interface Supplier {
  id: string;
  businessName: string; // Razão social (primary name field)
  tradeName?: string; // Nome fantasia
  type: SupplierType;
  document: string; // CPF or CNPJ
  email: string;
  phone: string;
  address?: string;
  bankInfo?: string;
  website?: string;
  contactPerson?: string;
  landlinePhone?: string;
  mobilePhone?: string;
  alternativeEmail?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Invoice Types
export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'partial' | 'cancelled' | 'overdue';
export type InvoiceType = 'product' | 'service';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'check' | 'credit_card' | 'debit_card' | 'other';

export interface Invoice {
  id: string;
  number: string;
  supplierId: string;
  supplierName: string; // Denormalized for ease of use
  issueDate: string;
  dueDate: string;
  costCenterId: string;
  costCenterName: string; // Denormalized
  amount: number;
  tax?: number;
  totalAmount: number;
  status: InvoiceStatus;
  type: InvoiceType;
  description: string;
  attachment?: string; // URL to uploaded file
  notes?: string;
  items: InvoiceItem[];
  payments: Payment[];
  assetIds?: string[]; // Associated assets
  vehicleIds?: string[]; // Associated vehicles
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

// Payment Types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  dueDate: string;
  method: PaymentMethod;
  reference?: string; // Check number, transaction ID, etc.
  status: PaymentStatus;
  installmentNumber?: number; // If part of a payment plan
  totalInstallments?: number;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

// Asset and Fleet Types
export type AssetStatus = 'active' | 'maintenance' | 'inactive' | 'sold' | 'scrapped';
export type AssetType = 'vehicle' | 'machinery' | 'equipment' | 'furniture' | 'electronics' | 'other';

export interface Asset {
  id: string;
  name: string;
  description: string;
  type: AssetType;
  status: AssetStatus;
  purchaseDate?: string;
  purchasePrice?: number;
  currentValue?: number;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  location?: string;
  responsiblePersonId?: string;
  notes?: string;
  documents?: AssetDocument[];
  maintenanceRecords?: MaintenanceRecord[];
  costCenterId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetDocument {
  id: string;
  assetId: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  expiryDate?: string;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  date: string;
  description: string;
  cost: number;
  invoiceId?: string;
  performedBy: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

// Vehicle specific types (extends Asset)
export interface Vehicle extends Asset {
  type: 'vehicle';
  licensePlate?: string;
  vin?: string; // Vehicle Identification Number
  year?: number;
  fuel?: string;
  odometer?: number;
  nextMaintenanceDate?: string;
  nextMaintenanceOdometer?: number;
  insuranceExpiryDate?: string;
  licenseExpiryDate?: string;
}

// Filter and sorting options
export interface FinanceFilterOptions {
  startDate?: string;
  endDate?: string;
  costCenterId?: string | 'none';
  status?: InvoiceStatus | PaymentStatus | 'none';
  supplierId?: string | 'none';
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}
