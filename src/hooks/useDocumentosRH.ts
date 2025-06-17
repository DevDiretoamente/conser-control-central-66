
import { useState, useEffect } from 'react';
import { DocumentoRH, Certificacao, DocumentoRHFilter, CertificacaoFilter } from '@/types/documentosRH';
import { documentosRHService } from '@/services/documentosRHService';
import { useDebouncedValue } from './useDebouncedValue';
import { notificationService } from '@/services/notificationService';
import { documentosService } from '@/services/documentosService';
import { certificacoesService } from '@/services/certificacoesService';
import { toast } from 'sonner';

const PAGE_SIZE = 20;

export function useDocumentosRH() {
  const [documentos, setDocumentos] = useState<DocumentoRH[]>([]);
  const [certificacoes, setCertificacoes] = useState<Certificacao[]>([]);
  const [filteredDocumentos, setFilteredDocumentos] = useState<DocumentoRH[]>([]);
  const [filteredCertificacoes, setFilteredCertificacoes] = useState<Certificacao[]>([]);
  const [documentoFilter, setDocumentoFilter] = useState<DocumentoRHFilter>({});
  const [certificacaoFilter, setCertificacaoFilter] = useState<CertificacaoFilter>({});
  const [loading, setLoading] = useState(true);
  const [docPage, setDocPage] = useState(1);
  const [certPage, setCertPage] = useState(1);

  const debouncedDocumentoSearch = useDebouncedValue(documentoFilter?.search || '', 300);
  const debouncedCertificacaoSearch = useDebouncedValue(certificacaoFilter?.search || '', 300);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados usando os serviços atualizados
      const [docs, certs] = await Promise.all([
        documentosService.getAll(),
        certificacoesService.getAll()
      ]);
      
      setDocumentos(docs);
      setCertificacoes(certs);

      // Atualizar status de documentos vencidos automaticamente
      await documentosService.updateExpiredDocumentsStatus();
      
      // Gerar notificações automáticas
      // Mock funcionários para exemplo
      const mockFuncionarios = [
        { id: '1', dadosPessoais: { nome: 'João Silva' } },
        { id: '2', dadosPessoais: { nome: 'Maria Santos' } }
      ] as any[];

      notificationService.generateAutomaticNotifications(docs, certs, mockFuncionarios);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const applyDocumentoFilters = () => {
    let filtered = [...documentos];

    if (debouncedDocumentoSearch) {
      const search = debouncedDocumentoSearch.toLowerCase();
      filtered = filtered.filter(d => 
        d.titulo.toLowerCase().includes(search) ||
        d.descricao.toLowerCase().includes(search) ||
        d.tipo.toLowerCase().includes(search)
      );
    }

    if (documentoFilter.tipo && documentoFilter.tipo !== 'all') {
      filtered = filtered.filter(d => d.tipo === documentoFilter.tipo);
    }

    if (documentoFilter.status && documentoFilter.status !== 'all') {
      filtered = filtered.filter(d => d.status === documentoFilter.status);
    }

    if (documentoFilter.funcionarioId && documentoFilter.funcionarioId !== 'all') {
      filtered = filtered.filter(d => d.funcionarioId === documentoFilter.funcionarioId);
    }

    // Filtros de data
    if (documentoFilter.dataFrom) {
      filtered = filtered.filter(d => new Date(d.dataDocumento) >= new Date(documentoFilter.dataFrom!));
    }

    if (documentoFilter.dataTo) {
      filtered = filtered.filter(d => new Date(d.dataDocumento) <= new Date(documentoFilter.dataTo!));
    }

    // Filtro por assinatura
    if (documentoFilter.assinado !== undefined) {
      filtered = filtered.filter(d => d.assinado === documentoFilter.assinado);
    }

    setFilteredDocumentos(filtered);
  };

  const applyCertificacaoFilters = () => {
    let filtered = [...certificacoes];

    if (debouncedCertificacaoSearch) {
      const search = debouncedCertificacaoSearch.toLowerCase();
      filtered = filtered.filter(c => 
        c.nome.toLowerCase().includes(search) ||
        c.entidadeCertificadora.toLowerCase().includes(search) ||
        c.categoria.toLowerCase().includes(search)
      );
    }

    if (certificacaoFilter.categoria && certificacaoFilter.categoria !== 'all') {
      filtered = filtered.filter(c => c.categoria === certificacaoFilter.categoria);
    }

    if (certificacaoFilter.status && certificacaoFilter.status !== 'all') {
      filtered = filtered.filter(c => c.status === certificacaoFilter.status);
    }

    if (certificacaoFilter.funcionarioId && certificacaoFilter.funcionarioId !== 'all') {
      filtered = filtered.filter(c => c.funcionarioId === certificacaoFilter.funcionarioId);
    }

    if (certificacaoFilter.entidade) {
      filtered = filtered.filter(c => 
        c.entidadeCertificadora.toLowerCase().includes(certificacaoFilter.entidade!.toLowerCase())
      );
    }

    // Filtro por vencimento próximo
    if (certificacaoFilter.vencimentoProximo) {
      const em30Dias = new Date();
      em30Dias.setDate(em30Dias.getDate() + 30);
      
      filtered = filtered.filter(c => 
        c.dataVencimento && 
        new Date(c.dataVencimento) <= em30Dias &&
        new Date(c.dataVencimento) >= new Date()
      );
    }

    setFilteredCertificacoes(filtered);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyDocumentoFilters();
  }, [documentos, debouncedDocumentoSearch, documentoFilter]);

  useEffect(() => {
    applyCertificacaoFilters();
  }, [certificacoes, debouncedCertificacaoSearch, certificacaoFilter]);

  // Reset page when filters change
  useEffect(() => { 
    setDocPage(1); 
  }, [debouncedDocumentoSearch, documentoFilter]);
  
  useEffect(() => { 
    setCertPage(1); 
  }, [debouncedCertificacaoSearch, certificacaoFilter]);

  const paginatedDocumentos = filteredDocumentos.slice((docPage - 1) * PAGE_SIZE, docPage * PAGE_SIZE);
  const totalDocPages = Math.ceil(filteredDocumentos.length / PAGE_SIZE);
  const paginatedCertificacoes = filteredCertificacoes.slice((certPage - 1) * PAGE_SIZE, certPage * PAGE_SIZE);
  const totalCertPages = Math.ceil(filteredCertificacoes.length / PAGE_SIZE);

  return {
    documentos,
    certificacoes,
    filteredDocumentos,
    filteredCertificacoes,
    documentoFilter,
    setDocumentoFilter,
    certificacaoFilter,
    setCertificacaoFilter,
    loading,
    docPage,
    setDocPage,
    certPage,
    setCertPage,
    paginatedDocumentos,
    totalDocPages,
    paginatedCertificacoes,
    totalCertPages,
    loadData
  };
}
