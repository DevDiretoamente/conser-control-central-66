
import { Work } from '@/types/financeiro';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'financeiro_works';

export class WorkService {
  static getAll(): Work[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getById(id: string): Work | null {
    const works = this.getAll();
    return works.find(work => work.id === id) || null;
  }

  static create(workData: Omit<Work, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Work {
    const work: Work = {
      ...workData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user', // This would come from auth context
    };

    const works = this.getAll();
    works.push(work);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
    
    return work;
  }

  static update(id: string, workData: Partial<Work>): Work | null {
    const works = this.getAll();
    const index = works.findIndex(work => work.id === id);
    
    if (index === -1) return null;
    
    works[index] = {
      ...works[index],
      ...workData,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
    return works[index];
  }

  static delete(id: string): boolean {
    const works = this.getAll();
    const filteredWorks = works.filter(work => work.id !== id);
    
    if (filteredWorks.length === works.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredWorks));
    return true;
  }

  static search(term: string): Work[] {
    const works = this.getAll();
    const searchTerm = term.toLowerCase();
    
    return works.filter(work =>
      work.name.toLowerCase().includes(searchTerm) ||
      work.description.toLowerCase().includes(searchTerm) ||
      work.clientName?.toLowerCase().includes(searchTerm)
    );
  }

  static getByStatus(status: Work['status']): Work[] {
    const works = this.getAll();
    return works.filter(work => work.status === status);
  }
}
