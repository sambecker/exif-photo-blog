import US_EN from './languages/us-en';

export type I18N = typeof US_EN;

export type I18NDeepPartial = {
  [key in keyof I18N]?: Partial<I18N[key]>;
}

export const LANGUAGES: Record<
  string,
  (() => Promise<I18NDeepPartial>) | undefined
> = {
  'pt-br': () => import('./languages/pt-br').then(module => module.default),
};

export const getTextForLanguage = async (
  language = '',
): Promise<I18N> => {
  const text = US_EN;

  Object.entries(await LANGUAGES[language.toLocaleLowerCase()]?.() ?? {})
    .forEach(([key, value]) => {
      text[key as keyof I18N] = {
        ...text[key as keyof I18N],
        ...value,
      } as any;
    });

  return text;
};
