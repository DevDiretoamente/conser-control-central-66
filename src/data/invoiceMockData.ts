
import { Invoice, CostCenter, Supplier, InvoiceItem } from '@/types/financeiro';

export const mockCostCenters: CostCenter[] = [
  {
    id: '1',
    name: 'Obra Centro',
    description: 'Centro de custo da obra no centro da cidade',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin'
  },
  {
    id: '2',
    name: 'Administração',
    description: 'Despesas administrativas',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin'
  },
  {
    id: '3',
    name: 'Frota',
    description: 'Manutenção e combustível da frota',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: 'admin'
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    businessName: 'Fornecedor ABC Ltda',
    tradeName: 'ABC Materiais',
    type: 'legal',
    document: '12.345.678/0001-90',
    email: 'contato@abc.com',
    phone: '(11) 1234-5678',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    businessName: 'Posto de Combustível XYZ',
    tradeName: 'Posto XYZ',
    type: 'legal',
    document: '98.765.432/0001-10',
    email: 'contato@postoxyz.com',
    phone: '(11) 9876-5432',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    businessName: 'Ferramentas e Equipamentos DEF',
    tradeName: 'DEF Ferramentas',
    type: 'legal',
    document: '11.222.333/0001-44',
    email: 'vendas@def.com',
    phone: '(11) 1111-2222',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockInvoiceItems: InvoiceItem[] = [
  {
    id: '1',
    invoiceId: '1',
    description: 'Cimento Portland CP II',
    quantity: 50,
    unitPrice: 32.50,
    totalPrice: 1625.00,
    categoryType: 'supplies',
    categoryName: 'Materiais'
  },
  {
    id: '2',
    invoiceId: '2',
    description: 'Diesel S-10',
    quantity: 200,
    unitPrice: 5.89,
    totalPrice: 1178.00,
    categoryType: 'fuel',
    categoryName: 'Combustível'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: '000001',
    supplierId: '1',
    supplierName: 'Fornecedor ABC Ltda',
    issueDate: '2024-06-01T00:00:00Z',
    dueDate: '2024-06-30T00:00:00Z',
    costCenterId: '1',
    costCenterName: 'Obra Centro',
    amount: 1625.00,
    tax: 162.50,
    totalAmount: 1787.50,
    status: 'pending',
    type: 'product',
    description: 'Compra de materiais de construção',
    items: [mockInvoiceItems[0]],
    payments: [],
    createdAt: '2024-06-01T00:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-01T00:00:00Z'
  },
  {
    id: '2',
    number: '000002',
    supplierId: '2',
    supplierName: 'Posto de Combustível XYZ',
    issueDate: '2024-06-05T00:00:00Z',
    dueDate: '2024-06-20T00:00:00Z',
    costCenterId: '3',
    costCenterName: 'Frota',
    amount: 1178.00,
    tax: 117.80,
    totalAmount: 1295.80,
    status: 'paid',
    type: 'service',
    description: 'Abastecimento da frota',
    items: [mockInvoiceItems[1]],
    payments: [],
    createdAt: '2024-06-05T00:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-05T00:00:00Z'
  },
  {
    id: '3',
    number: '000003',
    supplierId: '3',
    supplierName: 'Ferramentas e Equipamentos DEF',
    issueDate: '2024-06-08T00:00:00Z',
    dueDate: '2024-05-30T00:00:00Z', // Data vencida para demonstrar status overdue
    costCenterId: '1',
    costCenterName: 'Obra Centro',
    amount: 2500.00,
    tax: 250.00,
    totalAmount: 2750.00,
    status: 'overdue',
    type: 'product',
    description: 'Compra de ferramentas e equipamentos',
    items: [],
    payments: [],
    createdAt: '2024-06-08T00:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-08T00:00:00Z'
  },
  {
    id: '4',
    number: '000004',
    supplierId: '1',
    supplierName: 'Fornecedor ABC Ltda',
    issueDate: '2024-06-10T00:00:00Z',
    dueDate: '2024-07-10T00:00:00Z',
    costCenterId: '2',
    costCenterName: 'Administração',
    amount: 850.00,
    tax: 85.00,
    totalAmount: 935.00,
    status: 'draft',
    type: 'service',
    description: 'Serviços administrativos',
    items: [],
    payments: [],
    createdAt: '2024-06-10T00:00:00Z',
    createdBy: 'admin',
    updatedAt: '2024-06-10T00:00:00Z'
  }
];
