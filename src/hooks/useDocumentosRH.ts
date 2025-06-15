
import { useState, useEffect } from 'react';
import { DocumentoRH, Certificacao, DocumentoRHFilter, CertificacaoFilter } from '@/types/documentosRH';
import { documentosRHService } from '@/services/documentosRHService';
import { useDebouncedValue } from './useDebouncedValue';
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
      const [docs, certs] = await Promise.all([
        documentosRHService.getAllDocumentos(),
        documentosRHService.getAllCertificacoes()
      ]);
      setDocumentos(docs);
      setCertificacoes(certs);
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
        d.descricao.toLowerCase().includes(search)
      );
    }

    if (documentoFilter.tipo && documentoFilter.tipo !== 'all') {
      filtered = filtered.filter(d => d.tipo === documentoFilter.tipo);
    }

    if (documentoFilter.status && documentoFilter.status !== 'all') {
      filtered = filtered.filter(d => d.status === documentoFilter.status);
    }

    setFilteredDocumentos(filtered);
  };

  const applyCertificacaoFilters = () => {
    let filtered = [...certificacoes];

    if (debouncedCertificacaoSearch) {
      const search = debouncedCertificacaoSearch.toLowerCase();
      filtered = filtered.filter(c => 
        c.nome.toLowerCase().includes(search) ||
        c.entidadeCertificadora.toLowerCase().includes(search)
      );
    }

    if (certificacaoFilter.categoria && certificacaoFilter.categoria !== 'all') {
      filtered = filtered.filter(c => c.categoria === certificacaoFilter.categoria);
    }

    if (certificacaoFilter.status && certificacaoFilter.status !== 'all') {
      filtered = filtered.filter(c => c.status === certificacaoFilter.status);
    }

    setFilteredCertificacoes(filtered);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyDocumentoFilters();
  }, [documentos, debouncedDocumentoSearch, documentoFilter.tipo, documentoFilter.status]);

  useEffect(() => {
    applyCertificacaoFilters();
  }, [certificacoes, debouncedCertificacaoSearch, certificacaoFilter.categoria, certificacaoFilter.status]);

  useEffect(() => { setDocPage(1); }, [debouncedDocumentoSearch, documentoFilter.tipo, documentoFilter.status]);
  useEffect(() => { setCertPage(1); }, [debouncedCertificacaoSearch, certificacaoFilter.categoria, certificacaoFilter.status]);

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
