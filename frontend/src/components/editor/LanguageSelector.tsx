import React from 'react';
import { ChevronDown, Code2 } from 'lucide-react';
import { LANGUAGE_LABELS } from '../../services/codeService';

interface LanguageSelectorProps {
  value: string;
  onChange: (lang: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="relative flex items-center">
      <Code2 size={14} className="absolute left-3 text-gray-400 pointer-events-none z-10" />
      <select
        id="language-selector"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none bg-[#2d2d2d] border border-[#404040] text-gray-200
          text-sm rounded-lg pl-8 pr-8 py-1.5 cursor-pointer
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          hover:bg-[#3a3a3a] transition-colors
        "
      >
        {Object.entries(LANGUAGE_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 text-gray-400 pointer-events-none" />
    </div>
  );
};

export default LanguageSelector;
