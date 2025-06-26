
import React from 'react';

interface RobustLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const RobustLogo: React.FC<RobustLogoProps> = ({ size = 'md' }) => {
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  console.log('RobustLogo - Rendered with size:', size);

  return (
    <div className="flex flex-col items-center">
      <div className={`font-bold text-blue-600 ${textSizeClasses[size]} select-none`}>
        CONSERVIAS
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Sistema de Gestão
      </div>
    </div>
  );
};

export default RobustLogo;
