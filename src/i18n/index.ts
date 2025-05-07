import US_EN from './languages/us-en';

export type I18N = typeof US_EN;

export const LANGUAGES: Record<
  string,
  (() => Promise<Partial<I18N>>) | undefined
> = {
  'pt-br': () => import('./languages/pt-br').then(module => module.default),
};

export const getContentForLanguage = async (
  language = '',
): Promise<I18N> => ({
  ...US_EN,
  ...await LANGUAGES[language.toLocaleLowerCase()]?.(),
});
