import US_EN from './locales/us-en';

export type I18N = typeof US_EN;

export type I18NDeepPartial = {
  [key in keyof I18N]?: Partial<I18N[key]>;
}

export const LOCALE_TEXT: Record<
  string,
  () => Promise<I18NDeepPartial | undefined>
> = {
  'pt-br': () => import('./locales/pt-br').then((m) => m.default),
  'pt-pt': () => import('./locales/pt-pt').then((m) => m.default),
};

export const getTextForLocale = async (
  locale = '',
): Promise<I18N> => {
  const text = US_EN;

  Object.entries(await LOCALE_TEXT[locale.toLocaleLowerCase()]?.() ?? {})
    .forEach(([key, value]) => {
      // Fall back to English for missing keys
      text[key as keyof I18N] = {
        ...text[key as keyof I18N] as any,
        ...value as any,
      };
    });

  return text;
};
