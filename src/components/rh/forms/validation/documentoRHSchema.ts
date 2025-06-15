
import { z } from 'zod';

export const documentoRHSchema = z.object({
  funcionarioId: z.string().min(1, 'Funcionário é obrigatório'),
  tipo: z.enum(['contrato', 'termo_confidencialidade', 'acordo_horario', 'advertencia', 'elogio', 'avaliacao', 'ferias', 'atestado', 'licenca', 'rescisao', 'outros'], {
    required_error: 'Tipo é obrigatório'
  }),
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  dataDocumento: z.string().min(1, 'Data do documento é obrigatória'),
  dataVencimento: z.string().optional(),
  status: z.enum(['ativo', 'vencido', 'arquivado']).default('ativo'),
  assinado: z.boolean().default(false),
  dataAssinatura: z.string().optional(),
  observacoes: z.string().optional(),
  criadoPor: z.string().default('Sistema')
});

export type DocumentoRHFormData = z.infer<typeof documentoRHSchema>;
