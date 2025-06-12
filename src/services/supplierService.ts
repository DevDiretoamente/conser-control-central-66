
import { Supplier } from '@/types/financeiro';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'financeiro_suppliers';

export class SupplierService {
  static getAll(): Supplier[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getById(id: string): Supplier | null {
    const suppliers = this.getAll();
    return suppliers.find(supplier => supplier.id === id) || null;
  }

  static create(supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): Supplier {
    const supplier: Supplier = {
      ...supplierData,
      id: uuidv4(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const suppliers = this.getAll();
    suppliers.push(supplier);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
    
    return supplier;
  }

  static update(id: string, supplierData: Partial<Supplier>): Supplier | null {
    const suppliers = this.getAll();
    const index = suppliers.findIndex(supplier => supplier.id === id);
    
    if (index === -1) return null;
    
    suppliers[index] = {
      ...suppliers[index],
      ...supplierData,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
    return suppliers[index];
  }

  static delete(id: string): boolean {
    const suppliers = this.getAll();
    const filteredSuppliers = suppliers.filter(supplier => supplier.id !== id);
    
    if (filteredSuppliers.length === suppliers.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSuppliers));
    return true;
  }

  static search(term: string): Supplier[] {
    const suppliers = this.getAll();
    const searchTerm = term.toLowerCase();
    
    return suppliers.filter(supplier =>
      supplier.businessName.toLowerCase().includes(searchTerm) ||
      supplier.tradeName?.toLowerCase().includes(searchTerm) ||
      supplier.document.includes(searchTerm) ||
      supplier.email?.toLowerCase().includes(searchTerm)
    );
  }
}
