import { v4 as uuidv4 } from 'uuid';
import { Vehicle, VehicleDocument, Maintenance, FuelRecord, FleetDashboardData, FleetFilter, MaintenanceFilter, DocumentFilter, DocumentRenewal } from '@/types/frota';

const VEHICLES_STORAGE_KEY = 'frota_vehicles';
const DOCUMENTS_STORAGE_KEY = 'frota_documents';
const MAINTENANCES_STORAGE_KEY = 'frota_maintenances';
const FUEL_RECORDS_STORAGE_KEY = 'frota_fuel_records';

export class FrotaService {
  // Vehicles CRUD
  static getVehicles(): Vehicle[] {
    const data = localStorage.getItem(VEHICLES_STORAGE_KEY);
    return data ? JSON.parse(data) : this.getMockVehicles();
  }

  static getVehicleById(id: string): Vehicle | null {
    const vehicles = this.getVehicles();
    return vehicles.find(v => v.id === id) || null;
  }

  static createVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'documents' | 'maintenances' | 'fuelRecords'>): Vehicle {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: uuidv4(),
      documents: [],
      maintenances: [],
      fuelRecords: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const vehicles = this.getVehicles();
    vehicles.push(newVehicle);
    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
    return newVehicle;
  }

  static updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const vehicles = this.getVehicles();
    const index = vehicles.findIndex(v => v.id === id);
    
    if (index === -1) return null;

    vehicles[index] = {
      ...vehicles[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
    return vehicles[index];
  }

  static deleteVehicle(id: string): boolean {
    const vehicles = this.getVehicles();
    const filteredVehicles = vehicles.filter(v => v.id !== id);
    
    if (filteredVehicles.length === vehicles.length) return false;

    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(filteredVehicles));
    
    // Clean up related records
    this.deleteVehicleDocuments(id);
    this.deleteVehicleMaintenances(id);
    this.deleteVehicleFuelRecords(id);
    
    return true;
  }

  static filterVehicles(filter: FleetFilter): Vehicle[] {
    let vehicles = this.getVehicles();

    if (filter.search) {
      const search = filter.search.toLowerCase();
      vehicles = vehicles.filter(v => 
        v.brand.toLowerCase().includes(search) ||
        v.model.toLowerCase().includes(search) ||
        v.plate?.toLowerCase().includes(search) ||
        v.chassi?.toLowerCase().includes(search)
      );
    }

    if (filter.type && filter.type !== 'all') {
      vehicles = vehicles.filter(v => v.type === filter.type);
    }

    if (filter.status && filter.status !== 'all') {
      vehicles = vehicles.filter(v => v.status === filter.status);
    }

    if (filter.fuel && filter.fuel !== 'all') {
      vehicles = vehicles.filter(v => v.fuel === filter.fuel);
    }

    if (filter.year) {
      vehicles = vehicles.filter(v => v.year === filter.year);
    }

    if (filter.expiringDocuments) {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      vehicles = vehicles.filter(v => {
        const vehicleDocuments = this.getVehicleDocuments(v.id);
        return vehicleDocuments.some(doc => new Date(doc.expiryDate) <= thirtyDaysFromNow);
      });
    }

    if (filter.pendingMaintenance) {
      vehicles = vehicles.filter(v => v.status === 'maintenance' || 
        v.maintenances.some(m => m.status === 'scheduled' && new Date(m.scheduledDate) <= new Date()));
    }

    return vehicles;
  }

  // Enhanced Documents CRUD with new features
  static getVehicleDocuments(vehicleId: string): VehicleDocument[] {
    const data = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    const documents: VehicleDocument[] = data ? JSON.parse(data) : [];
    const vehicleDocuments = documents.filter(d => d.vehicleId === vehicleId);
    
    // Update document status based on expiry dates
    return vehicleDocuments.map(doc => ({
      ...doc,
      status: this.calculateDocumentStatus(doc.expiryDate, doc.reminderDays)
    }));
  }

  static createDocument(document: Omit<VehicleDocument, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'renewalHistory'>): VehicleDocument {
    const now = new Date();
    
    const newDocument: VehicleDocument = {
      ...document,
      id: uuidv4(),
      status: this.calculateDocumentStatus(document.expiryDate, document.reminderDays),
      renewalHistory: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    const documents = this.getAllDocuments();
    documents.push(newDocument);
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
    return newDocument;
  }

  static updateDocument(id: string, updates: Partial<VehicleDocument>): VehicleDocument | null {
    const documents = this.getAllDocuments();
    const index = documents.findIndex(d => d.id === id);
    
    if (index === -1) return null;

    const oldDocument = documents[index];
    const updatedDocument = {
      ...oldDocument,
      ...updates,
      status: this.calculateDocumentStatus(
        updates.expiryDate || oldDocument.expiryDate,
        updates.reminderDays || oldDocument.reminderDays
      ),
      updatedAt: new Date().toISOString()
    };

    // If expiry date changed, add to renewal history
    if (updates.expiryDate && updates.expiryDate !== oldDocument.expiryDate) {
      const renewal: DocumentRenewal = {
        id: uuidv4(),
        renewalDate: new Date().toISOString(),
        previousExpiryDate: oldDocument.expiryDate,
        newExpiryDate: updates.expiryDate,
        cost: updates.value,
        notes: updates.description || 'Documento renovado'
      };
      
      updatedDocument.renewalHistory = [
        ...(oldDocument.renewalHistory || []),
        renewal
      ];
    }

    documents[index] = updatedDocument;
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
    return updatedDocument;
  }

  static deleteDocument(id: string): boolean {
    const documents = this.getAllDocuments();
    const filteredDocuments = documents.filter(d => d.id !== id);
    
    if (filteredDocuments.length === documents.length) return false;

    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(filteredDocuments));
    return true;
  }

  static getExpiringDocuments(days: number = 30): VehicleDocument[] {
    const allDocuments = this.getAllDocuments();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return allDocuments.filter(doc => {
      const expiryDate = new Date(doc.expiryDate);
      return expiryDate <= cutoffDate && expiryDate > new Date();
    });
  }

  static getExpiredDocuments(): VehicleDocument[] {
    const allDocuments = this.getAllDocuments();
    const today = new Date();

    return allDocuments.filter(doc => {
      const expiryDate = new Date(doc.expiryDate);
      return expiryDate < today;
    });
  }

  private static calculateDocumentStatus(expiryDate: string, reminderDays: number): VehicleDocument['status'] {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= reminderDays) return 'expiring_soon';
    return 'valid';
  }

  private static getAllDocuments(): VehicleDocument[] {
    const data = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private static deleteVehicleDocuments(vehicleId: string): void {
    const documents = this.getAllDocuments();
    const filteredDocuments = documents.filter(d => d.vehicleId !== vehicleId);
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(filteredDocuments));
  }

  // Maintenances CRUD
  static getMaintenances(filter?: MaintenanceFilter): Maintenance[] {
    const data = localStorage.getItem(MAINTENANCES_STORAGE_KEY);
    let maintenances: Maintenance[] = data ? JSON.parse(data) : [];

    if (!filter) return maintenances;

    if (filter.search) {
      const search = filter.search.toLowerCase();
      maintenances = maintenances.filter(m => 
        m.description.toLowerCase().includes(search) ||
        m.supplier?.toLowerCase().includes(search)
      );
    }

    if (filter.vehicleId) {
      maintenances = maintenances.filter(m => m.vehicleId === filter.vehicleId);
    }

    if (filter.type && filter.type !== 'all') {
      maintenances = maintenances.filter(m => m.type === filter.type);
    }

    if (filter.status && filter.status !== 'all') {
      maintenances = maintenances.filter(m => m.status === filter.status);
    }

    if (filter.category && filter.category !== 'all') {
      maintenances = maintenances.filter(m => m.category === filter.category);
    }

    if (filter.dateFrom) {
      maintenances = maintenances.filter(m => new Date(m.scheduledDate) >= new Date(filter.dateFrom!));
    }

    if (filter.dateTo) {
      maintenances = maintenances.filter(m => new Date(m.scheduledDate) <= new Date(filter.dateTo!));
    }

    if (filter.costFrom) {
      maintenances = maintenances.filter(m => m.cost >= filter.costFrom!);
    }

    if (filter.costTo) {
      maintenances = maintenances.filter(m => m.cost <= filter.costTo!);
    }

    return maintenances;
  }

  static getVehicleMaintenances(vehicleId: string): Maintenance[] {
    return this.getMaintenances({ vehicleId });
  }

  static createMaintenance(maintenance: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>): Maintenance {
    const newMaintenance: Maintenance = {
      ...maintenance,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const maintenances = this.getMaintenances();
    maintenances.push(newMaintenance);
    localStorage.setItem(MAINTENANCES_STORAGE_KEY, JSON.stringify(maintenances));
    return newMaintenance;
  }

  static updateMaintenance(id: string, updates: Partial<Maintenance>): Maintenance | null {
    const maintenances = this.getMaintenances();
    const index = maintenances.findIndex(m => m.id === id);
    
    if (index === -1) return null;

    maintenances[index] = {
      ...maintenances[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(MAINTENANCES_STORAGE_KEY, JSON.stringify(maintenances));
    return maintenances[index];
  }

  static deleteMaintenance(id: string): boolean {
    const maintenances = this.getMaintenances();
    const filteredMaintenances = maintenances.filter(m => m.id !== id);
    
    if (filteredMaintenances.length === maintenances.length) return false;

    localStorage.setItem(MAINTENANCES_STORAGE_KEY, JSON.stringify(filteredMaintenances));
    return true;
  }

  private static deleteVehicleMaintenances(vehicleId: string): void {
    const maintenances = this.getMaintenances();
    const filteredMaintenances = maintenances.filter(m => m.vehicleId !== vehicleId);
    localStorage.setItem(MAINTENANCES_STORAGE_KEY, JSON.stringify(filteredMaintenances));
  }

  // Fuel Records CRUD
  static getFuelRecords(vehicleId?: string): FuelRecord[] {
    const data = localStorage.getItem(FUEL_RECORDS_STORAGE_KEY);
    const records: FuelRecord[] = data ? JSON.parse(data) : [];
    return vehicleId ? records.filter(r => r.vehicleId === vehicleId) : records;
  }

  static createFuelRecord(record: Omit<FuelRecord, 'id' | 'createdAt'>): FuelRecord {
    const newRecord: FuelRecord = {
      ...record,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };

    const records = this.getFuelRecords();
    records.push(newRecord);
    localStorage.setItem(FUEL_RECORDS_STORAGE_KEY, JSON.stringify(records));
    return newRecord;
  }

  static updateFuelRecord(id: string, updates: Partial<FuelRecord>): FuelRecord | null {
    const records = this.getFuelRecords();
    const index = records.findIndex(r => r.id === id);
    
    if (index === -1) return null;

    records[index] = { ...records[index], ...updates };
    localStorage.setItem(FUEL_RECORDS_STORAGE_KEY, JSON.stringify(records));
    return records[index];
  }

  static deleteFuelRecord(id: string): boolean {
    const records = this.getFuelRecords();
    const filteredRecords = records.filter(r => r.id !== id);
    
    if (filteredRecords.length === records.length) return false;

    localStorage.setItem(FUEL_RECORDS_STORAGE_KEY, JSON.stringify(filteredRecords));
    return true;
  }

  private static deleteVehicleFuelRecords(vehicleId: string): void {
    const records = this.getFuelRecords();
    const filteredRecords = records.filter(r => r.vehicleId !== vehicleId);
    localStorage.setItem(FUEL_RECORDS_STORAGE_KEY, JSON.stringify(filteredRecords));
  }

  // Dashboard Data
  static getDashboardData(): FleetDashboardData {
    const vehicles = this.getVehicles();
    const maintenances = this.getMaintenances();
    const fuelRecords = this.getFuelRecords();
    const allDocuments = this.getAllDocuments();

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const expiringDocuments = allDocuments.filter(d => 
      new Date(d.expiryDate) <= thirtyDaysFromNow && new Date(d.expiryDate) > now
    ).length;

    const pendingMaintenances = maintenances.filter(m => 
      m.status === 'scheduled' && new Date(m.scheduledDate) <= now
    ).length;

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyMaintenances = maintenances.filter(m => {
      const date = new Date(m.scheduledDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const monthlyFuelRecords = fuelRecords.filter(r => {
      const date = new Date(r.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalMonthlyCost = monthlyMaintenances.reduce((sum, m) => sum + m.cost, 0) +
                           monthlyFuelRecords.reduce((sum, r) => sum + r.totalCost, 0);

    const maintenanceCosts = monthlyMaintenances.reduce((sum, m) => sum + m.cost, 0);
    const fuelCosts = monthlyFuelRecords.reduce((sum, r) => sum + r.totalCost, 0);

    // Calculate average fuel consumption
    const totalLiters = monthlyFuelRecords.reduce((sum, r) => sum + r.liters, 0);
    const activeVehiclesCount = vehicles.filter(v => v.status === 'active').length;
    const averageFuelConsumption = activeVehiclesCount > 0 ? totalLiters / activeVehiclesCount : 0;

    const vehiclesByType = vehicles.reduce((acc, v) => {
      acc[v.type] = (acc[v.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.status === 'active').length,
      maintenanceVehicles: vehicles.filter(v => v.status === 'maintenance').length,
      pendingMaintenances,
      expiringDocuments,
      totalMonthlyCost,
      averageFuelConsumption,
      maintenanceCosts,
      fuelCosts,
      vehiclesByType,
      maintenancesByMonth: this.getMaintenancesByMonth(),
      fuelConsumptionTrend: this.getFuelConsumptionTrend()
    };
  }

  private static getMaintenancesByMonth(): Array<{ month: string; count: number; cost: number }> {
    const maintenances = this.getMaintenances();
    const now = new Date();
    const months: Array<{ month: string; count: number; cost: number }> = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthMaintenances = maintenances.filter(m => {
        const mDate = new Date(m.scheduledDate);
        return mDate.getMonth() === date.getMonth() && mDate.getFullYear() === date.getFullYear();
      });

      months.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        count: monthMaintenances.length,
        cost: monthMaintenances.reduce((sum, m) => sum + m.cost, 0)
      });
    }

    return months;
  }

  private static getFuelConsumptionTrend(): Array<{ month: string; consumption: number; cost: number }> {
    const fuelRecords = this.getFuelRecords();
    const now = new Date();
    const months: Array<{ month: string; consumption: number; cost: number }> = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthRecords = fuelRecords.filter(r => {
        const rDate = new Date(r.date);
        return rDate.getMonth() === date.getMonth() && rDate.getFullYear() === date.getFullYear();
      });

      months.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        consumption: monthRecords.reduce((sum, r) => sum + r.liters, 0),
        cost: monthRecords.reduce((sum, r) => sum + r.totalCost, 0)
      });
    }

    return months;
  }

  // Mock data for initial setup
  private static getMockVehicles(): Vehicle[] {
    const mockVehicles: Vehicle[] = [
      {
        id: '1',
        type: 'truck',
        brand: 'Mercedes-Benz',
        model: '2729',
        year: 2020,
        plate: 'XYZ-1234',
        chassi: '9BM979017LT123456',
        renavam: '12345678901',
        color: 'Branco',
        fuel: 'diesel',
        status: 'active',
        mileage: 45000,
        acquisitionDate: '2020-03-15',
        acquisitionValue: 250000,
        currentValue: 200000,
        insuranceCompany: 'Porto Seguro',
        insuranceExpiryDate: '2024-08-15',
        ipvaExpiryDate: '2024-02-28',
        licensingExpiryDate: '2024-06-30',
        documents: [],
        maintenances: [],
        fuelRecords: [],
        notes: 'Caminhão basculante para obras',
        createdAt: '2020-03-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        type: 'heavy_equipment',
        brand: 'Caterpillar',
        model: '416F',
        year: 2019,
        plate: undefined,
        chassi: 'CAT416F123456789',
        renavam: undefined,
        color: 'Amarelo',
        fuel: 'diesel',
        status: 'active',
        mileage: 2500,
        acquisitionDate: '2019-05-20',
        acquisitionValue: 450000,
        currentValue: 380000,
        insuranceCompany: 'Bradesco Seguros',
        insuranceExpiryDate: '2024-09-20',
        ipvaExpiryDate: '2024-01-31',
        licensingExpiryDate: undefined,
        documents: [],
        maintenances: [],
        fuelRecords: [],
        notes: 'Retroescavadeira para construção',
        createdAt: '2019-05-20T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z'
      },
      {
        id: '3',
        type: 'car',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2021,
        plate: 'ABC-5678',
        chassi: '9BR53ZEC4L8123456',
        renavam: '98765432109',
        color: 'Prata',
        fuel: 'flex',
        status: 'maintenance',
        mileage: 28000,
        acquisitionDate: '2021-01-10',
        acquisitionValue: 85000,
        currentValue: 75000,
        insuranceCompany: 'Allianz',
        insuranceExpiryDate: '2024-07-10',
        ipvaExpiryDate: '2024-03-31',
        licensingExpiryDate: '2024-05-15',
        documents: [],
        maintenances: [],
        fuelRecords: [],
        notes: 'Veículo administrativo',
        createdAt: '2021-01-10T10:00:00Z',
        updatedAt: '2024-01-05T10:00:00Z'
      }
    ];

    localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(mockVehicles));
    return mockVehicles;
  }

  // Export data for reports
  static exportVehiclesData(): Vehicle[] {
    return this.getVehicles();
  }

  static exportMaintenancesData(): Maintenance[] {
    return this.getMaintenances();
  }

  static exportFuelData(): FuelRecord[] {
    return this.getFuelRecords();
  }

  static exportDocumentsData(): VehicleDocument[] {
    return this.getAllDocuments();
  }

  // Clear all data
  static clearAllData(): void {
    localStorage.removeItem(VEHICLES_STORAGE_KEY);
    localStorage.removeItem(DOCUMENTS_STORAGE_KEY);
    localStorage.removeItem(MAINTENANCES_STORAGE_KEY);
    localStorage.removeItem(FUEL_RECORDS_STORAGE_KEY);
  }
}
