
import { z } from 'zod';
import { InvoiceStatus, InvoiceType } from '@/types/financeiro';

export const invoiceItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, { message: "Descrição do item é obrigatória" }),
  quantity: z.coerce.number().min(0.01, { message: "Quantidade deve ser maior que zero" }),
  unitPrice: z.coerce.number().min(0, { message: "Preço unitário deve ser maior ou igual a zero" }),
  totalPrice: z.coerce.number().min(0, { message: "Preço total deve ser maior ou igual a zero" }),
  categoryType: z.string().optional(),
  categoryName: z.string().optional(),
});

export const invoiceSchema = z.object({
  number: z.string().min(1, { message: "Número da nota fiscal é obrigatório" }),
  supplierId: z.string().min(1, { message: "Fornecedor é obrigatório" }),
  issueDate: z.date({ required_error: "Data de emissão é obrigatória" }),
  dueDate: z.date({ required_error: "Data de vencimento é obrigatória" }),
  costCenterId: z.string().min(1, { message: "Centro de custo é obrigatório" }),
  workId: z.string().optional().or(z.literal('')),
  workName: z.string().optional().or(z.literal('')),
  amount: z.coerce.number().min(0, { message: "Valor da nota deve ser maior ou igual a zero" }),
  tax: z.coerce.number().min(0, { message: "Valor de impostos deve ser maior ou igual a zero" }).optional(),
  totalAmount: z.coerce.number().min(0, { message: "Valor total deve ser maior ou igual a zero" }),
  status: z.enum(['draft', 'pending', 'paid', 'partial', 'cancelled', 'overdue', 'released'], {
    required_error: "Status é obrigatório"
  }).default('pending'),
  type: z.enum(['product', 'service'], {
    required_error: "Tipo é obrigatório"
  }).default('service'),
  description: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  items: z.array(invoiceItemSchema).optional().default([]),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
export type InvoiceItemFormValues = z.infer<typeof invoiceItemSchema>;
