
import * as z from 'zod';

// Schema for invoice form validation
export const invoiceSchema = z.object({
  number: z.string().min(1, { message: "Número da nota fiscal é obrigatório" }),
  supplierId: z.string().min(1, { message: "Fornecedor é obrigatório" }),
  issueDate: z.date({ required_error: "Data de emissão é obrigatória" }),
  dueDate: z.date({ required_error: "Data de vencimento é obrigatória" }),
  costCenterId: z.string().min(1, { message: "Centro de custo é obrigatório" }),
  amount: z.coerce.number().min(0.01, { message: "Valor deve ser maior que zero" }),
  tax: z.coerce.number().optional().default(0),
  totalAmount: z.coerce.number(), // This will be calculated automatically
  status: z.enum(['draft', 'pending', 'paid', 'partial', 'cancelled', 'overdue']),
  type: z.enum(['product', 'service']),
  description: z.string().optional(),
  notes: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

// Function to check for duplicate invoice numbers by supplier
export const checkDuplicateInvoice = (
  invoiceNumber: string, 
  supplierId: string, 
  invoiceId?: string, 
  existingInvoices: { id: string, number: string, supplierId: string }[] = []
) => {
  const duplicate = existingInvoices.find(
    inv => inv.number === invoiceNumber && 
          inv.supplierId === supplierId && 
          (invoiceId ? inv.id !== invoiceId : true)
  );
  
  return {
    isDuplicate: !!duplicate,
    message: duplicate ? 
      "Já existe uma nota fiscal com este número para este fornecedor. Verifique se não está tentando cadastrar uma nota duplicada." 
      : null
  };
};
