
import { CostCenter } from '@/types/financeiro';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'financeiro_cost_centers';

export class CostCenterService {
  static getAll(): CostCenter[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getById(id: string): CostCenter | null {
    const costCenters = this.getAll();
    return costCenters.find(center => center.id === id) || null;
  }

  static create(centerData: Omit<CostCenter, 'id' | 'createdAt' | 'updatedAt'>): CostCenter {
    const costCenter: CostCenter = {
      ...centerData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const costCenters = this.getAll();
    costCenters.push(costCenter);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(costCenters));
    
    return costCenter;
  }

  static update(id: string, centerData: Partial<CostCenter>): CostCenter | null {
    const costCenters = this.getAll();
    const index = costCenters.findIndex(center => center.id === id);
    
    if (index === -1) return null;
    
    costCenters[index] = {
      ...costCenters[index],
      ...centerData,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(costCenters));
    return costCenters[index];
  }

  static delete(id: string): boolean {
    const costCenters = this.getAll();
    const filteredCenters = costCenters.filter(center => center.id !== id);
    
    if (filteredCenters.length === costCenters.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCenters));
    return true;
  }

  static getByStatus(status: CostCenter['status']): CostCenter[] {
    const costCenters = this.getAll();
    return costCenters.filter(center => center.status === status);
  }

  static search(term: string): CostCenter[] {
    const costCenters = this.getAll();
    const searchTerm = term.toLowerCase();
    
    return costCenters.filter(center =>
      center.name.toLowerCase().includes(searchTerm) ||
      center.description.toLowerCase().includes(searchTerm)
    );
  }
}
