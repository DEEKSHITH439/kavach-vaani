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

const LANGUAGE_ICONS: Record<string, { iconText: string; colorClass: string }> = {
  en: { iconText: 'A', colorClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  hi: { iconText: 'अ', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  kn: { iconText: 'ಅ', colorClass: 'bg-orange-50 text-orange-700 border-orange-200' },
  te: { iconText: 'అ', colorClass: 'bg-purple-50 text-purple-700 border-purple-200' },
  ta: { iconText: 'அ', colorClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  bn: { iconText: 'অ', colorClass: 'bg-teal-50 text-teal-700 border-teal-200' }
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelect,
  disabled,
  t
}) => {
  return (
    <div className="w-full" role="region" aria-label="Language selection">
      {/* Centered Pill Badge for "Choose Your Language" */}
      <div className="flex items-center justify-center mb-3">
        <span className="px-4 py-1 rounded-full bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 tracking-wide">
          <Languages className="w-3.5 h-3.5" />
          {t.languageSelectLabel}
        </span>
      </div>

      <div 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5"
        role="radiogroup"
        aria-labelledby="language-selector-label"
      >
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = currentLanguage.code === lang.code;
          const badge = LANGUAGE_ICONS[lang.code] || { iconText: 'आ', colorClass: 'bg-slate-100 text-slate-700 border-slate-300' };

          return (
            <button
              key={lang.code}
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onSelect(lang)}
              className={`relative p-3 rounded-2xl text-left transition-all duration-200 border flex items-center gap-2.5 shadow-sm ${
                isSelected
                  ? 'bg-white border-2 border-emerald-600 text-slate-900 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white/90 hover:bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
            >
              {/* Circular Native Script Avatar (e.g. A, अ, ಅ, அ, অ) - NO FLAGS */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border shrink-0 ${badge.colorClass}`}>
                {badge.iconText}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-slate-900 truncate tracking-tight">{lang.nativeLabel.split(' ')[0]}</div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-medium text-slate-500 truncate">({lang.label})</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
