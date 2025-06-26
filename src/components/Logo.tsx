
import React, { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8', 
    lg: 'h-12',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  console.log('Logo: Rendered', { size, imageError });

  // Se houve erro na imagem ou como fallback principal, usar logo em texto
  if (imageError) {
    return (
      <div className="flex flex-col items-center">
        <div className={`font-bold text-primary ${textSizeClasses[size]}`}>
          CONSERVIAS
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <img 
        src="/lovable-uploads/141d5ab2-f175-4b0d-8b75-05c5affa10bd.png" 
        alt="CONSERVIAS" 
        className={sizeClasses[size]}
        onError={() => {
          console.log('Logo: Image failed to load, using text fallback');
          setImageError(true);
        }}
        onLoad={() => {
          console.log('Logo: Image loaded successfully');
        }}
      />
    </div>
  );
};

export default Logo;
