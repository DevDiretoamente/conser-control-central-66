
import { format, addMonths, addYears, isBefore, differenceInMonths } from 'date-fns';
import { ExameMedico } from '@/types/funcionario';

// Determine if an exam is special (e.g. spirometry with 2-year validity)
export const isSpecialExam = (exameName: string): boolean => {
  return exameName.toLowerCase().includes('espirometria');
};

// Calculate validity date based on exam type
export const calculateValidityDate = (examDate: Date, exameName: string): Date => {
  if (isSpecialExam(exameName)) {
    return addYears(examDate, 2); // 2-year validity for special exams like spirometry
  }
  return addYears(examDate, 1); // 1-year validity for standard exams
};

// Group exams by type (standard vs special)
export const groupExamsByType = (exames: ExameMedico[]) => {
  const standardExams = exames.filter(ex => !isSpecialExam(ex.nome));
  const specialExams = exames.filter(ex => isSpecialExam(ex.nome));
  
  return { standardExams, specialExams };
};
