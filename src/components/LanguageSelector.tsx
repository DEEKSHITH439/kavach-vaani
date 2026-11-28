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

const LANGUAGE_BADGES: Record<string, { letter: string; bg: string; text: string }> = {
  en: { letter: 'A', bg: 'bg-blue-100', text: 'text-blue-700' },
  hi: { letter: 'अ', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  kn: { letter: 'ಅ', bg: 'bg-orange-100', text: 'text-orange-700' },
  te: { letter: 'అ', bg: 'bg-purple-100', text: 'text-purple-700' },
  ta: { letter: 'அ', bg: 'bg-amber-100', text: 'text-amber-700' },
  bn: { letter: 'অ', bg: 'bg-teal-100', text: 'text-teal-700' }
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelect,
  disabled
}) => {
  return (
    <div className="w-full flex flex-col items-center" role="region" aria-label="Language selection">
      {/* Pill Badge Header: Choose Voice Dialect / Select Language */}
      <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#046A38] text-white text-xs font-bold tracking-wide shadow-sm mb-4">
        <Languages className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{t.languageSelectLabel || 'Choose Voice Dialect / Select Language'}</span>
      </div>

      {/* Language Cards Row */}
      <div 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full"
        role="radiogroup"
        aria-label="Language selection options"
      >
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = currentLanguage.code === lang.code;
          const badge = LANGUAGE_BADGES[lang.code] || { letter: 'A', bg: 'bg-slate-100', text: 'text-slate-700' };

          return (
            <button
              key={lang.code}
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onSelect(lang)}
              className={`relative flex items-center justify-between p-3 rounded-2xl bg-white transition-all duration-200 border text-left ${
                isSelected
                  ? 'border-2 border-[#046A38] shadow-sm ring-1 ring-[#046A38]/30'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Round Letter Avatar */}
                <div className={`w-8 h-8 rounded-full ${badge.bg} ${badge.text} flex items-center justify-center text-xs font-black shrink-0`}>
                  {badge.letter}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {lang.nativeLabel}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    ({lang.label})
                  </div>
                </div>
              </div>

              {isSelected && (
                <span className="w-4 h-4 rounded-full bg-[#046A38] text-white flex items-center justify-center shrink-0 ml-1">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
