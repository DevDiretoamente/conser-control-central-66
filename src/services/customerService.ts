
import { Customer } from '@/types/financeiro';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'financeiro_customers';

export class CustomerService {
  static getAll(): Customer[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getById(id: string): Customer | null {
    const customers = this.getAll();
    return customers.find(customer => customer.id === id) || null;
  }

  static create(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): Customer {
    const customer: Customer = {
      ...customerData,
      id: uuidv4(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const customers = this.getAll();
    customers.push(customer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    
    return customer;
  }

  static update(id: string, customerData: Partial<Customer>): Customer | null {
    const customers = this.getAll();
    const index = customers.findIndex(customer => customer.id === id);
    
    if (index === -1) return null;
    
    customers[index] = {
      ...customers[index],
      ...customerData,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    return customers[index];
  }

  static delete(id: string): boolean {
    const customers = this.getAll();
    const filteredCustomers = customers.filter(customer => customer.id !== id);
    
    if (filteredCustomers.length === customers.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCustomers));
    return true;
  }

  static search(term: string): Customer[] {
    const customers = this.getAll();
    const searchTerm = term.toLowerCase();
    
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm) ||
      customer.document.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm)
    );
  }

  static validateDocument(document: string, excludeId?: string): boolean {
    const customers = this.getAll();
    const cleanDoc = document.replace(/\D/g, '');
    
    return !customers.some(customer => 
      customer.id !== excludeId && 
      customer.document.replace(/\D/g, '') === cleanDoc
    );
  }
}
