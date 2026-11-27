import React from 'react';
import { SUPPORTED_LANGUAGES, VoiceOption } from '../lib/voiceEngine';
import { Languages, Check } from 'lucide-react';
import { LocaleTranslations } from '../locales';

interface LanguageSelectorProps {
  currentLanguage: VoiceOption;
  onSelect: (lang: VoiceOption) => void;
  disabled?: boolean;
  t: LocaleTranslations;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelect,
  disabled,
  t
}) => {
  return (
    <div className="w-full" role="region" aria-label="Language selection">
      <div className="flex items-center justify-between mb-2.5">
        <label 
          id="language-selector-label"
          className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
        >
          <span className="p-1 rounded-md bg-orange-500/20 text-orange-400">
            <Languages className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          {t.languageSelectLabel}
        </label>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-950/70 to-amber-950/70 text-orange-300 border border-orange-500/30">
          {t.regionalAudioBadge}
        </span>
      </div>

      <div 
        className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5"
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
              className={`relative p-3 rounded-2xl text-left transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-900 to-slate-900/90 border-orange-500 text-white shadow-soft-md shadow-orange-500/10 ring-1 ring-orange-400/50'
                  : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold text-white truncate tracking-tight">{lang.nativeLabel}</div>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="text-[10px] font-medium text-slate-400 mt-0.5 truncate">{lang.label}</div>

              {/* Subtle top indicator pip */}
              {isSelected && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
