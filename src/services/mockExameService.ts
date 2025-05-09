
import { ExameMedico } from '@/types/funcionario';

// Mock de exames por função (em produção, isso viria de uma API)
export const mockExamesFuncao: Record<string, Record<string, ExameMedico[]>> = {
  '1': {
    'periodico': [
      { id: '1', nome: 'Exame Clínico', tipos: ['admissional', 'periodico'], periodicidade: 12, ativo: true, precosPorClinica: [] },
      { id: '2', nome: 'Audiometria', tipos: ['admissional', 'periodico'], periodicidade: 12, ativo: true, precosPorClinica: [] },
      { id: '3', nome: 'Espirometria', tipos: ['admissional', 'periodico'], periodicidade: 24, ativo: true, precosPorClinica: [] }
    ],
    'mudancaFuncao': [
      { id: '1', nome: 'Exame Clínico', tipos: ['admissional', 'mudancaFuncao'], periodicidade: 12, ativo: true, precosPorClinica: [] },
      { id: '4', nome: 'Acuidade Visual', tipos: ['mudancaFuncao'], periodicidade: 12, ativo: true, precosPorClinica: [] }
    ]
  }
};
