
import { documentosService } from './documentosService';
import { certificacoesService } from './certificacoesService';

// Legacy service that combines both services for backward compatibility
export const documentosRHService = {
  // Documentos RH
  getAllDocumentos: documentosService.getAll,
  getDocumentosByFuncionario: documentosService.getByFuncionario,
  createDocumento: documentosService.create,
  updateDocumento: documentosService.update,
  deleteDocumento: documentosService.delete,

  // Certificações
  getAllCertificacoes: certificacoesService.getAll,
  getCertificacoesByFuncionario: certificacoesService.getByFuncionario,
  createCertificacao: certificacoesService.create,
  updateCertificacao: certificacoesService.update,
  deleteCertificacao: certificacoesService.delete,
  addRenovacao: certificacoesService.addRenovacao
};
