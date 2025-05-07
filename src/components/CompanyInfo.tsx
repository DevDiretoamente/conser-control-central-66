
import React from 'react';
import Logo from './Logo';
import { Phone, MapPin } from 'lucide-react';

interface CompanyInfoProps {
  showLogo?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'letterhead';
  showFooter?: boolean;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ 
  showLogo = true, 
  className = '',
  variant = 'default',
  showFooter = false
}) => {
  // Letterhead style - mais compacto para documentos
  if (variant === 'letterhead') {
    return (
      <>
        <div className={`flex items-center justify-between border-b border-gray-300 pb-2 mb-4 ${className}`}>
          <div className="flex items-center gap-2">
            {showLogo && <Logo size="sm" />}
            <div className="text-xs">
              <p className="font-semibold">CONSERVIAS – TRANSPORTES E PAVIMENTAÇÃO LTDA.</p>
            </div>
          </div>
          <div className="text-xs text-right">
            <p>CNPJ: 02.205.149/0001-32</p>
          </div>
        </div>
        
        {showFooter && (
          <div className="border-t border-gray-300 pt-2 mt-8 text-xs text-center text-gray-600">
            <div className="flex justify-center items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Avenida General Aldo Bonde, 551 - Contorno, Ponta Grossa/PR</span>
              <span className="mx-1">|</span>
              <Phone className="h-3 w-3" /> 
              <span>(42) 3239 4358 / (42) 9 99161 9031</span>
            </div>
          </div>
        )}
      </>
    );
  }
  
  // Compact style
  if (variant === 'compact') {
    return (
      <div className={`flex items-center ${className}`}>
        {showLogo && (
          <div className="mr-3">
            <Logo size="sm" />
          </div>
        )}
        <div className="text-xs">
          <p className="font-semibold">CONSERVIAS – TRANSPORTES E PAVIMENTAÇÃO LTDA.</p>
          <p>CNPJ: 02.205.149/0001-32 | Av. General Aldo Bonde, 551 | (42) 3239 4358</p>
        </div>
      </div>
    );
  }
  
  // Default style - original
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {showLogo && (
        <div className="mb-2">
          <Logo size="lg" />
        </div>
      )}
      <div className="text-sm">
        <p className="font-semibold">CONSERVIAS – TRANSPORTES E PAVIMENTAÇÃO LTDA.</p>
        <p>Avenida General Aldo Bonde, nº 551 - Contorno</p>
        <p className="flex items-center justify-center gap-1">
          <span className="flex items-center">
            <Phone className="h-3 w-3 mr-1" /> (42) 3239 4358
          </span>
          <span className="mx-1">/</span>
          <span className="flex items-center">
            <Phone className="h-3 w-3 mr-1" /> (42) 9 99161 9031
          </span>
          <span className="ml-1">(ambos com whats)</span>
        </p>
        <p>CEP 84 060- 170 Ponta Grossa - Paraná</p>
        <p>CNPJ: 02.205.149/0001-32 I.E. 90150007-05</p>
      </div>
    </div>
  );
};

export default CompanyInfo;
