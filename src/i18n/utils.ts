import { ui, languages, defaultLang } from './translations';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang;
  return defaultLang;
}

export function useTranslations(lang: string) {
  return function t(key: string) {
    const entry = (ui as Record<string, Record<string, string>>)[key];
    if (!entry) return key;
    const translation = entry[lang] ?? entry[defaultLang] ?? key;
    return translation;
  }
}