import React from 'react';
import { SUPPORTED_LANGUAGES, VoiceOption } from '../lib/voiceEngine';
import { Languages } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: VoiceOption;
  onSelect: (lang: VoiceOption) => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelect,
  disabled
}) => {
  return (
    <div className="w-full" role="region" aria-label="Language selection">
      <div className="flex items-center justify-between mb-2">
        <label 
          id="language-selector-label"
          className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
        >
          <Languages className="w-4 h-4 text-orange-400" aria-hidden="true" /> Choose Voice Dialect / भाषा चुनें
        </label>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-950/60 text-orange-300 border border-orange-500/30">
          Regional Audio
        </span>
      </div>

      <div 
        className="grid grid-cols-2 sm:grid-cols-5 gap-2"
        role="radiogroup"
        aria-labelledby="language-selector-label"
      >
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = currentLanguage.code === lang.code;
          return (
            <button
              key={lang.code}
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onSelect(lang)}
              className={`p-2.5 rounded-2xl text-left transition-all border focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500 text-white shadow-md shadow-orange-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
            >
              <div className="text-sm font-bold truncate">{lang.nativeLabel}</div>
              <div className="text-[10px] text-slate-400 truncate">{lang.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
