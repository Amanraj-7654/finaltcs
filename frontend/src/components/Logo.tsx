import React from 'react';
import { Terminal } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2 font-bold text-2xl text-primary">
      <div className="bg-primary text-white p-1.5 rounded-lg shadow-lg">
        <Terminal size={24} />
      </div>
      <span className="tracking-tight">Techcode<span className="text-secondary">Solution</span></span>
    </div>
  );
};

export default Logo;
