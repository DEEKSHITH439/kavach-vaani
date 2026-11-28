import { en, LocaleTranslations } from './en';
import { kn } from './kn';
import { hi } from './hi';
import { ta } from './ta';
import { bn } from './bn';
import { te } from './te';

export const locales: Record<'en' | 'kn' | 'hi' | 'ta' | 'bn' | 'te', LocaleTranslations> = {
  en,
  kn,
  hi,
  ta,
  bn,
  te
};

export function getLocale(code: string): LocaleTranslations {
  if (code in locales) {
    return locales[code as keyof typeof locales];
  }
  return en;
}

export type { LocaleTranslations };
