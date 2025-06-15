
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CertificacaoFilters from '../CertificacaoFilters';

describe('CertificacaoFilters', () => {
  it('atualiza o filtro ao digitar no campo de busca', () => {
    const filter = { search: '', categoria: 'all', status: 'all' };
    const setFilter = jest.fn();
    render(<CertificacaoFilters certificacaoFilter={filter} setCertificacaoFilter={setFilter} />);

    const input = screen.getByPlaceholderText(/buscar por certificação/i);
    fireEvent.change(input, { target: { value: 'NR10' } });
    expect(setFilter).toHaveBeenCalledWith(expect.objectContaining({ search: 'NR10' }));
  });
});
