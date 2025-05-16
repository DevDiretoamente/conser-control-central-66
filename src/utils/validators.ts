
/**
 * Validates if a CPF number is valid
 * @param cpf The CPF number to validate (can include formatting)
 * @returns boolean indicating if the CPF is valid
 */
export function validateCPF(cpf: string): boolean {
  // Remove non-numeric characters
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Check if it has 11 digits
  if (cleanCPF.length !== 11) return false;
  
  // Check for known invalid CPFs like all same digits
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validate first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Validate second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
}

/**
 * Validates if a CNPJ number is valid
 * @param cnpj The CNPJ number to validate (can include formatting)
 * @returns boolean indicating if the CNPJ is valid
 */
export function validateCNPJ(cnpj: string): boolean {
  // Remove non-numeric characters
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  // Check if it has 14 digits
  if (cleanCNPJ.length !== 14) return false;
  
  // Check for known invalid CNPJs like all same digits
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
  
  // Validate first verification digit
  let size = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, size);
  const digits = cleanCNPJ.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  // Validate second verification digit
  size = size + 1;
  numbers = cleanCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
}

/**
 * Formats a CPF string with proper punctuation
 * @param cpf The raw CPF number
 * @returns formatted CPF string
 */
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return cleanCPF;
  
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formats a CNPJ string with proper punctuation
 * @param cnpj The raw CNPJ number
 * @returns formatted CNPJ string
 */
export function formatCNPJ(cnpj: string): string {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  if (cleanCNPJ.length !== 14) return cleanCNPJ;
  
  return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Validates a document (CPF or CNPJ) based on its length
 * @param document The document to validate (can include formatting)
 * @returns boolean indicating if the document is valid
 */
export function validateDocument(document: string): boolean {
  const cleanDocument = document.replace(/\D/g, '');
  
  if (cleanDocument.length === 11) {
    return validateCPF(cleanDocument);
  } else if (cleanDocument.length === 14) {
    return validateCNPJ(cleanDocument);
  }
  
  return false;
}

/**
 * Formats a document (CPF or CNPJ) based on its length
 * @param document The raw document number
 * @returns formatted document string
 */
export function formatDocument(document: string): string {
  const cleanDocument = document.replace(/\D/g, '');
  
  if (cleanDocument.length === 11) {
    return formatCPF(cleanDocument);
  } else if (cleanDocument.length === 14) {
    return formatCNPJ(cleanDocument);
  }
  
  return cleanDocument;
}
