
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DocumentosRHPage from '../../../pages/rh/DocumentosRHPage';
import { documentosRHService } from '@/services/documentosRHService';

// Mock do serviço
jest.mock('@/services/documentosRHService', () => ({
  documentosRHService: {
    getAllDocumentos: jest.fn(),
    getAllCertificacoes: jest.fn(),
  },
}));

// Mock do hook de debounce
jest.mock('@/hooks/useDebouncedValue', () => ({
  useDebouncedValue: (value: any) => value,
}));

const mockDocumentosRHService = documentosRHService as jest.Mocked<typeof documentosRHService>;

describe('DocumentosRHPage Integration', () => {
  beforeEach(() => {
    mockDocumentosRHService.getAllDocumentos.mockResolvedValue([]);
    mockDocumentosRHService.getAllCertificacoes.mockResolvedValue([]);
  });

  it('carrega dados ao montar o componente', async () => {
    render(<DocumentosRHPage />);

    await waitFor(() => {
      expect(mockDocumentosRHService.getAllDocumentos).toHaveBeenCalled();
      expect(mockDocumentosRHService.getAllCertificacoes).toHaveBeenCalled();
    });

    expect(screen.getByText('Documentos RH & Certificações')).toBeInTheDocument();
  });

  it('navega entre as abas corretamente', async () => {
    render(<DocumentosRHPage />);

    // Aguarda o carregamento inicial
    await waitFor(() => {
      expect(screen.getByText('Documentos RH & Certificações')).toBeInTheDocument();
    });

    // Clica na aba de certificações
    const certificacoesTab = screen.getByRole('tab', { name: /certificações/i });
    fireEvent.click(certificacoesTab);

    // Verifica se a aba está ativa
    expect(certificacoesTab).toHaveAttribute('aria-selected', 'true');

    // Clica na aba de relatórios
    const relatoriosTab = screen.getByRole('tab', { name: /relatórios/i });
    fireEvent.click(relatoriosTab);

    expect(relatoriosTab).toHaveAttribute('aria-selected', 'true');
  });
});
