
import { useState } from 'react';
import { DocumentoRH, Certificacao } from '@/types/documentosRH';

export function useDocumentosRHDetailsDialogs() {
  const [isDocumentoDetailsOpen, setIsDocumentoDetailsOpen] = useState(false);
  const [isCertificacaoDetailsOpen, setIsCertificacaoDetailsOpen] = useState(false);
  const [viewingDocumento, setViewingDocumento] = useState<DocumentoRH | null>(null);
  const [viewingCertificacao, setViewingCertificacao] = useState<Certificacao | null>(null);

  const handleViewDocument = (documento: DocumentoRH) => {
    setViewingDocumento(documento);
    setIsDocumentoDetailsOpen(true);
  };

  const handleViewCertification = (certificacao: Certificacao) => {
    setViewingCertificacao(certificacao);
    setIsCertificacaoDetailsOpen(true);
  };

  const handleCloseDocumentoDetails = () => {
    setIsDocumentoDetailsOpen(false);
    setViewingDocumento(null);
  };

  const handleCloseCertificacaoDetails = () => {
    setIsCertificacaoDetailsOpen(false);
    setViewingCertificacao(null);
  };

  return {
    // States
    isDocumentoDetailsOpen,
    isCertificacaoDetailsOpen,
    viewingDocumento,
    viewingCertificacao,
    
    // Handlers
    handleViewDocument,
    handleViewCertification,
    handleCloseDocumentoDetails,
    handleCloseCertificacaoDetails
  };
}
