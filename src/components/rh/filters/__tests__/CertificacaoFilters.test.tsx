
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CertificacaoFilters from '../CertificacaoFilters';
import { CertificacaoFilter } from '@/types/documentosRH';

describe('CertificacaoFilters', () => {
  it('atualiza o filtro ao digitar no campo de busca', () => {
    const filter: CertificacaoFilter = { search: '', categoria: 'all', status: 'all' };
    const onFilterChange = jest.fn();
    render(<CertificacaoFilters filter={filter} onFilterChange={onFilterChange} />);

    const input = screen.getByPlaceholderText(/buscar certificações/i);
    fireEvent.change(input, { target: { value: 'NR10' } });
    expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({ search: 'NR10' }));
  });
});
