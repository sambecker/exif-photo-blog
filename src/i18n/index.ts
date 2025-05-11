import US_EN from './locales/us-en';
import PT_BR from './locales/pt-br';
import PT_PT from './locales/pt-pt';
import { enUS, ptBR, pt } from 'date-fns/locale';

export type I18N = typeof US_EN;

export type I18NDeepPartial = {
  [key in keyof I18N]?: Partial<I18N[key]>;
}

const getDateFnLocale = (locale: string) => {
  switch (locale) {
  case 'pt-pt': return pt;
  case 'pt-br': return ptBR;
  default: return enUS;
  }
};

const generateI18NWithFunctions = (i18nText: I18N) => {
  return {
    ...i18nText,
    category: {
      ...i18nText.category,
      cameraTitle: (camera: string) =>
        i18nText.category.cameraTitle.replace('{{camera}}', camera),
      cameraShare: (camera: string) =>
        i18nText.category.cameraShare.replace('{{camera}}', camera),
      taggedPhrase: (tag: string) =>
        i18nText.category.taggedPhrase.replace('{{tag}}', tag),
      recipeShare: (recipe: string) =>
        i18nText.category.recipeShare.replace('{{recipe}}', recipe),
      filmShare: (film: string) =>
        i18nText.category.filmShare.replace('{{film}}', film),
      focalLengthTitle: (focal: string) =>
        i18nText.category.focalLengthTitle.replace('{{focal}}', focal),
      focalLengthShare: (focal: string) =>
        i18nText.category.focalLengthShare.replace('{{focal}}', focal),
    },
    admin: {
      ...i18nText.admin,
      deleteConfirm: (photoTitle: string) =>
        i18nText.admin.deleteConfirm.replace('{{photoTitle}}', photoTitle),
    },
    misc: {
      ...i18nText.misc,
      copyPhrase: (label: string) =>
        i18nText.misc.copyPhrase.replace('{{label}}', label),
    },
    utility: {
      ...i18nText.utility,
      paginate: (index: number, count: number) =>
        i18nText.utility.paginate
          .replace('{{index}}', index.toString())
          .replace('{{count}}', count.toString()),
      paginateAction: (index: number, count: number, action: string) =>
        i18nText.utility.paginateAction
          .replace('{{index}}', index.toString())
          .replace('{{count}}', count.toString())
          .replace('{{action}}', action),
    },
    dateLocale: getDateFnLocale(i18nText.locale),
  };
};

export const LOCALE_TEXT: Record<string, I18NDeepPartial | undefined> = {
  'pt-br': PT_BR,
  'pt-pt': PT_PT,
};

export const getTextForLocale = (
  locale = '',
) => {
  const text = US_EN;

  Object.entries(LOCALE_TEXT[locale.toLocaleLowerCase()] ?? {})
    .forEach(([key, value]) => {
      // Fall back to English for missing keys
      text[key as keyof I18N] = {
        ...text[key as keyof I18N] as any,
        ...value as any,
      };
    });

  return generateI18NWithFunctions(text);
};
