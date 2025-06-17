
// Migrado para usar Supabase em vez de localStorage
import { certificacoesSupabaseService } from './supabase/certificacoesSupabaseService';
import { auditSupabaseService } from './supabase/auditSupabaseService';
import { notificationsSupabaseService } from './supabase/notificationsSupabaseService';
import { validationService } from './validationService';
import { toast } from 'sonner';

export const certificacoesService = {
  // Re-export core CRUD operations
  getAll: certificacoesSupabaseService.getAll,
  getByFuncionario: certificacoesSupabaseService.getByFuncionario,
  update: certificacoesSupabaseService.update,
  delete: certificacoesSupabaseService.delete,
  addRenovacao: certificacoesSupabaseService.addRenovacao,
  getExpiringCertifications: certificacoesSupabaseService.getExpiringCertifications,
  getExpiredCertifications: certificacoesSupabaseService.getExpiredCertifications,
  updateExpiredCertificationsStatus: certificacoesSupabaseService.updateExpiredCertificationsStatus,

  // Enhanced create with validation and notifications
  create: async (certificacao: any) => {
    // Validar certificação antes de criar
    const certWithRenovacoes = { ...certificacao, renovacoes: [] };
    const validation = validationService.validateCertification(certWithRenovacoes);
    
    if (!validation.isValid) {
      throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
    }

    // Mostrar avisos se existirem
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => {
        toast.warning(warning);
      });
    }

    const newCertificacao = await certificacoesSupabaseService.create(certificacao);

    // Log de auditoria
    await auditSupabaseService.log({
      action: 'create',
      entityType: 'certificacao',
      entityId: newCertificacao.id,
      entityTitle: newCertificacao.nome,
      details: { certificacao: newCertificacao }
    });

    // Criar notificação se necessário
    if (newCertificacao.dataVencimento) {
      const vencimento = new Date(newCertificacao.dataVencimento);
      const hoje = new Date();
      const diasParaVencimento = Math.ceil((vencimento.getTime() - hoje.getTime()) / (24 * 60 * 60 * 1000));
      
      if (diasParaVencimento <= 60 && diasParaVencimento > 0) {
        await notificationsSupabaseService.create({
          type: 'info',
          category: 'certificacao_vencida',
          title: 'Nova Certificação com Vencimento Próximo',
          message: `Certificação "${newCertificacao.nome}" criada com vencimento em ${diasParaVencimento} dias`,
          entityType: 'certificacao',
          entityId: newCertificacao.id,
          entityName: newCertificacao.nome,
          priority: 'medium'
        });
      }
    }

    return newCertificacao;
  }
};
