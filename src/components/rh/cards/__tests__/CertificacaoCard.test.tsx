
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CertificacaoCard from '../CertificacaoCard';
import { Certificacao } from '@/types/documentosRH';

const mockCertificacao: Certificacao = {
  id: '1',
  funcionarioId: 'func-1',
  nome: 'NR-10 Básico',
  entidadeCertificadora: 'SENAI',
  dataObtencao: '2024-01-15',
  dataVencimento: '2026-01-15',
  numero: 'NR10-2024-001',
  categoria: 'seguranca',
  status: 'valida',
  renovacoes: [],
  criadoEm: '2024-01-15T10:00:00Z',
  atualizadoEm: '2024-01-15T10:00:00Z'
};

describe('CertificacaoCard', () => {
  it('renderiza as informações da certificação corretamente', () => {
    const onEdit = jest.fn();
    const onView = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <CertificacaoCard 
        certificacao={mockCertificacao} 
        onEdit={onEdit}
        onView={onView}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('NR-10 Básico')).toBeInTheDocument();
    expect(screen.getByText('SENAI')).toBeInTheDocument();
    expect(screen.getByText('Válida')).toBeInTheDocument();
    expect(screen.getByText('Segurança')).toBeInTheDocument();
  });

  it('chama onEdit quando o botão de editar é clicado', () => {
    const onEdit = jest.fn();
    const onView = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <CertificacaoCard 
        certificacao={mockCertificacao} 
        onEdit={onEdit}
        onView={onView}
        onDelete={onDelete}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(mockCertificacao);
  });

  it('mostra alerta de vencimento para certificações vencidas', () => {
    const certificacaoVencida = {
      ...mockCertificacao,
      dataVencimento: '2023-01-15', // Data no passado
      status: 'vencida' as const
    };
    
    const onEdit = jest.fn();
    const onView = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <CertificacaoCard 
        certificacao={certificacaoVencida} 
        onEdit={onEdit}
        onView={onView}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('Certificação vencida')).toBeInTheDocument();
    expect(screen.getByText('Vencida')).toBeInTheDocument();
  });
});
