
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-conserv-primary text-white font-bold p-1 rounded">
        CON
      </div>
      <span className="font-semibold text-lg text-conserv-primary">SERVIAS</span>
    </div>
  );
};

export default Logo;
