
import React from 'react';
import Logo from './Logo';

interface CompanyInfoProps {
  showLogo?: boolean;
  className?: string;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ showLogo = true, className = '' }) => {
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
        <p>Fone: (42) 3239 4358 / (42) 9 99161 9031 (ambos com whats)</p>
        <p>CEP 84 060- 170 Ponta Grossa - Paraná</p>
        <p>CNPJ: 02.205.149/0001-32 I.E. 90150007-05</p>
      </div>
    </div>
  );
};

export default CompanyInfo;
