import US_EN from './locales/us-en';
import PT_BR from './locales/pt-br';
import PT_PT from './locales/pt-pt';

export type I18N = typeof US_EN;

export type I18NDeepPartial = {
  [key in keyof I18N]?: Partial<I18N[key]>;
}

export const LOCALE_TEXT: Record<string, I18NDeepPartial | undefined> = {
  'pt-br': PT_BR,
  'pt-pt': PT_PT,
};

export const getTextForLocale = (
  locale = '',
): I18N => {
  const text = US_EN;

  Object.entries(LOCALE_TEXT[locale.toLocaleLowerCase()] ?? {})
    .forEach(([key, value]) => {
      // Fall back to English for missing keys
      text[key as keyof I18N] = {
        ...text[key as keyof I18N],
        ...value,
      } as any;
    });

  return text;
};
