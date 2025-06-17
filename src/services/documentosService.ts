
// Migrado para usar Supabase em vez de localStorage
import { documentosSupabaseService } from './supabase/documentosSupabaseService';
import { auditSupabaseService } from './supabase/auditSupabaseService';
import { notificationsSupabaseService } from './supabase/notificationsSupabaseService';
import { validationService } from './validationService';
import { toast } from 'sonner';

export const documentosService = {
  // Re-export core CRUD operations
  getAll: documentosSupabaseService.getAll,
  getByFuncionario: documentosSupabaseService.getByFuncionario,
  update: documentosSupabaseService.update,
  delete: documentosSupabaseService.delete,
  getExpiringDocuments: documentosSupabaseService.getExpiringDocuments,
  getExpiredDocuments: documentosSupabaseService.getExpiredDocuments,
  updateExpiredDocumentsStatus: documentosSupabaseService.updateExpiredDocumentsStatus,

  // Enhanced create with validation and notifications
  create: async (documento: any) => {
    // Validar documento antes de criar
    const validation = validationService.validateDocument(documento);
    
    if (!validation.isValid) {
      throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
    }

    // Mostrar avisos se existirem
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => {
        toast.warning(warning);
      });
    }

    const newDocumento = await documentosSupabaseService.create(documento);

    // Log de auditoria
    await auditSupabaseService.log({
      action: 'create',
      entityType: 'documento',
      entityId: newDocumento.id,
      entityTitle: newDocumento.titulo,
      details: { documento: newDocumento }
    });

    // Criar notificação se necessário
    if (newDocumento.dataVencimento) {
      const vencimento = new Date(newDocumento.dataVencimento);
      const hoje = new Date();
      const diasParaVencimento = Math.ceil((vencimento.getTime() - hoje.getTime()) / (24 * 60 * 60 * 1000));
      
      if (diasParaVencimento <= 30 && diasParaVencimento > 0) {
        await notificationsSupabaseService.create({
          type: 'info',
          category: 'documento_pendente',
          title: 'Novo Documento com Vencimento Próximo',
          message: `Documento "${newDocumento.titulo}" criado com vencimento em ${diasParaVencimento} dias`,
          entityType: 'documento',
          entityId: newDocumento.id,
          entityName: newDocumento.titulo,
          priority: 'medium'
        });
      }
    }

    return newDocumento;
  }
};
