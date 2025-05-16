
/**
 * Utility functions for formatting data
 */

// Format a date string into a readable format (DD/MM/YYYY)
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format a date to include time (DD/MM/YYYY HH:MM)
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + 
           date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return dateString;
  }
};

// Format currency as BRL
export const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

// Calculate the percentage difference between two values
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

// Format decimal number
export const formatDecimal = (value: number, decimalPlaces: number = 2): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(value);
};

// Format phone number
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    // Cell phone format: (XX) 9XXXX-XXXX
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  } else if (cleaned.length === 10) {
    // Landline format: (XX) XXXX-XXXX
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  }
  
  return phone;
};

// Format document (CPF or CNPJ)
export const formatDocument = (doc: string): string => {
  if (!doc) return '';
  
  // Remove non-numeric characters
  const cleaned = doc.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    // CPF format: XXX.XXX.XXX-XX
    return `${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9)}`;
  } else if (cleaned.length === 14) {
    // CNPJ format: XX.XXX.XXX/XXXX-XX
    return `${cleaned.substring(0, 2)}.${cleaned.substring(2, 5)}.${cleaned.substring(5, 8)}/${cleaned.substring(8, 12)}-${cleaned.substring(12)}`;
  }
  
  return doc;
};
