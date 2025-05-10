import US_EN from './locales/us-en';
import PT_BR from './locales/pt-br';

export type I18N = typeof US_EN;

export type I18NDeepPartial = {
  [key in keyof I18N]?: Partial<I18N[key]>;
}

export const LANGUAGES: Record<string, I18NDeepPartial | undefined> = {
  'pt-br': PT_BR,
};

export const getTextForLanguage = async (
  language = '',
): Promise<I18N> => {
  const text = US_EN;

  Object.entries(await LANGUAGES[language.toLocaleLowerCase()] ?? {})
    .forEach(([key, value]) => {
      text[key as keyof I18N] = {
        ...text[key as keyof I18N],
        ...value,
      } as any;
    });

  return text;
};
