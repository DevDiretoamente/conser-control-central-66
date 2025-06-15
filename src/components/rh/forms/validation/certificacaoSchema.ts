
import { z } from 'zod';

export const certificacaoSchema = z.object({
  funcionarioId: z.string().min(1, 'Funcionário é obrigatório'),
  nome: z.string().min(1, 'Nome da certificação é obrigatório'),
  entidadeCertificadora: z.string().min(1, 'Entidade certificadora é obrigatória'),
  dataObtencao: z.string().min(1, 'Data de obtenção é obrigatória'),
  dataVencimento: z.string().optional(),
  numero: z.string().optional(),
  categoria: z.enum(['tecnica', 'seguranca', 'qualidade', 'gestao', 'idioma', 'outros'], {
    required_error: 'Categoria é obrigatória'
  }),
  status: z.enum(['valida', 'vencida', 'em_renovacao']).default('valida'),
  observacoes: z.string().optional()
});

export type CertificacaoFormData = z.infer<typeof certificacaoSchema>;
