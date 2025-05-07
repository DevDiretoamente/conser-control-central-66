
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  };

  return (
    <div className="flex flex-col items-center">
      <img 
        src="/lovable-uploads/141d5ab2-f175-4b0d-8b75-05c5affa10bd.png" 
        alt="CONSERVIAS" 
        className={`${sizeClasses[size]}`}
      />
    </div>
  );
};

export default Logo;
