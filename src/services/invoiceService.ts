import { Invoice, Payment } from '@/types/financeiro';
import { v4 as uuidv4 } from 'uuid';
import { auditService } from '@/services/auditService';
import { BudgetService } from '@/services/budgetService';

const STORAGE_KEY = 'financeiro_invoices';
const PAYMENTS_STORAGE_KEY = 'financeiro_payments';

export class InvoiceService {
  static getAll(): Invoice[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getById(id: string): Invoice | null {
    const invoices = this.getAll();
    return invoices.find(invoice => invoice.id === id) || null;
  }

  static create(invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'payments'>): Invoice {
    const invoice: Invoice = {
      ...invoiceData,
      id: uuidv4(),
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
    };

    const invoices = this.getAll();
    invoices.push(invoice);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    
    // Log audit
    auditService.log({
      action: 'create',
      entityType: 'invoice',
      entityId: invoice.id,
      entityTitle: invoice.number,
      details: invoice
    });
    
    // Update budget if applicable
    if (invoice.status === 'paid' || invoice.status === 'released') {
      BudgetService.updateSpentAmount(invoice.costCenterId, invoice.totalAmount);
    }
    
    return invoice;
  }

  static update(id: string, invoiceData: Partial<Invoice>): Invoice | null {
    const invoices = this.getAll();
    const index = invoices.findIndex(invoice => invoice.id === id);
    
    if (index === -1) return null;
    
    const oldInvoice = { ...invoices[index] };
    const updatedInvoice = {
      ...invoices[index],
      ...invoiceData,
      updatedAt: new Date().toISOString(),
    };
    
    invoices[index] = updatedInvoice;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    
    // Log audit with changes
    const changes: Record<string, { from: any; to: any }> = {};
    Object.keys(invoiceData).forEach(key => {
      const oldValue = (oldInvoice as any)[key];
      const newValue = (invoiceData as any)[key];
      if (oldValue !== newValue) {
        changes[key] = { from: oldValue, to: newValue };
      }
    });
    
    auditService.log({
      action: 'update',
      entityType: 'invoice',
      entityId: id,
      entityTitle: updatedInvoice.number,
      changes,
      details: { oldInvoice, updatedInvoice }
    });
    
    // Update budget if status changed to paid/released
    if ((invoiceData.status === 'paid' || invoiceData.status === 'released') && 
        oldInvoice.status !== 'paid' && oldInvoice.status !== 'released') {
      BudgetService.updateSpentAmount(updatedInvoice.costCenterId, updatedInvoice.totalAmount);
    }
    
    return updatedInvoice;
  }

  static delete(id: string): boolean {
    const invoices = this.getAll();
    const invoice = invoices.find(inv => inv.id === id);
    const filteredInvoices = invoices.filter(invoice => invoice.id !== id);
    
    if (filteredInvoices.length === invoices.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredInvoices));
    
    // Log audit
    if (invoice) {
      auditService.log({
        action: 'delete',
        entityType: 'invoice',
        entityId: id,
        entityTitle: invoice.number
      });
    }
    
    return true;
  }

  static addPayment(invoiceId: string, paymentData: Omit<Payment, 'id' | 'invoiceId' | 'createdAt' | 'createdBy'>): Payment | null {
    const payment: Payment = {
      ...paymentData,
      id: uuidv4(),
      invoiceId,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user',
    };

    // Add payment to payments storage
    const payments = this.getAllPayments();
    payments.push(payment);
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));

    // Update invoice with payment and status
    const invoices = this.getAll();
    const invoiceIndex = invoices.findIndex(inv => inv.id === invoiceId);
    
    if (invoiceIndex === -1) return null;

    invoices[invoiceIndex].payments.push(payment);
    
    // Update invoice status based on payments
    const totalPaid = invoices[invoiceIndex].payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    
    if (totalPaid >= invoices[invoiceIndex].totalAmount) {
      invoices[invoiceIndex].status = 'paid';
    } else if (totalPaid > 0) {
      invoices[invoiceIndex].status = 'partial';
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    return payment;
  }

  static getAllPayments(): Payment[] {
    const data = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getPaymentsByInvoice(invoiceId: string): Payment[] {
    const payments = this.getAllPayments();
    return payments.filter(payment => payment.invoiceId === invoiceId);
  }

  static getOverdueInvoices(): Invoice[] {
    const invoices = this.getAll();
    const today = new Date();
    
    return invoices.filter(invoice => 
      invoice.status !== 'paid' && 
      invoice.status !== 'cancelled' &&
      new Date(invoice.dueDate) < today
    );
  }

  static getDueSoonInvoices(days: number = 7): Invoice[] {  
    const invoices = this.getAll();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return invoices.filter(invoice =>
      invoice.status !== 'paid' &&
      invoice.status !== 'cancelled' &&
      new Date(invoice.dueDate) <= futureDate &&
      new Date(invoice.dueDate) >= new Date()
    );
  }
}
