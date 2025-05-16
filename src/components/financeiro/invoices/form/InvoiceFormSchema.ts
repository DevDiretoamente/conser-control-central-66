
import * as z from 'zod';

// Schema for invoice form validation
export const invoiceSchema = z.object({
  number: z.string().min(1, { message: "Número da nota fiscal é obrigatório" }),
  supplierId: z.string().min(1, { message: "Fornecedor é obrigatório" }),
  issueDate: z.date({ required_error: "Data de emissão é obrigatória" }),
  dueDate: z.date({ required_error: "Data de vencimento é obrigatória" }),
  costCenterId: z.string().min(1, { message: "Centro de custo é obrigatório" }),
  amount: z.coerce.number().min(0.01, { message: "Valor deve ser maior que zero" }),
  tax: z.coerce.number().optional(),
  totalAmount: z.coerce.number().min(0.01, { message: "Valor total deve ser maior que zero" }),
  status: z.enum(['draft', 'pending', 'paid', 'partial', 'cancelled', 'overdue']),
  type: z.enum(['product', 'service']),
  description: z.string().optional(),
  notes: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
