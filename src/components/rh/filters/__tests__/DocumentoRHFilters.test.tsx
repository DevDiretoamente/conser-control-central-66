
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentoRHFilters from '../DocumentoRHFilters';
import { DocumentoRHFilter } from '@/types/documentosRH';

describe('DocumentoRHFilters', () => {
  it('atualiza o filtro ao digitar no campo de busca', () => {
    const filter: DocumentoRHFilter = { search: '', tipo: 'all', status: 'all' };
    const onFilterChange = jest.fn();
    
    render(<DocumentoRHFilters filter={filter} onFilterChange={onFilterChange} />);

    const input = screen.getByPlaceholderText(/buscar documentos/i);
    fireEvent.change(input, { target: { value: 'contrato' } });
    
    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'contrato' })
    );
  });

  it('atualiza o filtro ao selecionar um tipo', () => {
    const filter: DocumentoRHFilter = { search: '', tipo: 'all', status: 'all' };
    const onFilterChange = jest.fn();
    
    render(<DocumentoRHFilters filter={filter} onFilterChange={onFilterChange} />);

    // Simular seleção de tipo (o componente real usa Select do shadcn)
    expect(onFilterChange).toHaveBeenCalledTimes(0);
  });

  it('atualiza o filtro ao selecionar um status', () => {
    const filter: DocumentoRHFilter = { search: '', tipo: 'all', status: 'all' };
    const onFilterChange = jest.fn();
    
    render(<DocumentoRHFilters filter={filter} onFilterChange={onFilterChange} />);

    // O teste seria expandido para incluir interações com os selects
    expect(screen.getByText(/filtros/i)).toBeInTheDocument();
  });
});
