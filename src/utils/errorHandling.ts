
import { toast } from 'sonner';

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export const handleError = (error: unknown, context?: string): AppError => {
  console.error(`Error in ${context || 'application'}:`, error);
  
  let appError: AppError;
  
  if (error instanceof Error) {
    appError = {
      message: error.message,
      code: 'GENERIC_ERROR',
      details: error
    };
  } else if (typeof error === 'string') {
    appError = {
      message: error,
      code: 'STRING_ERROR'
    };
  } else if (error && typeof error === 'object' && 'message' in error) {
    appError = {
      message: (error as any).message || 'Erro desconhecido',
      code: (error as any).code,
      details: error
    };
  } else {
    appError = {
      message: 'Erro desconhecido',
      code: 'UNKNOWN_ERROR',
      details: error
    };
  }

  // Show user-friendly error messages
  const userMessage = getUserFriendlyMessage(appError);
  toast.error(userMessage);
  
  return appError;
};

const getUserFriendlyMessage = (error: AppError): string => {
  const errorMessages: Record<string, string> = {
    'invalid_credentials': 'Email ou senha incorretos',
    'user_not_found': 'Usuário não encontrado',
    'email_already_exists': 'Este email já está em uso',
    'weak_password': 'A senha deve ter pelo menos 6 caracteres',
    'network_error': 'Erro de conexão. Verifique sua internet.',
    'permission_denied': 'Você não tem permissão para esta ação',
    'validation_error': 'Dados inválidos. Verifique os campos.',
    'server_error': 'Erro interno do servidor. Tente novamente.'
  };

  return errorMessages[error.code || ''] || error.message || 'Erro inesperado';
};

export const logError = (error: AppError, userId?: string) => {
  // In production, send to logging service
  const logData = {
    timestamp: new Date().toISOString(),
    error: error,
    userId: userId,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.error('Application Error:', logData);
  
  // TODO: Send to external logging service like Sentry
  // sentryService.captureError(logData);
};
