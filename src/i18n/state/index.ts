import { I18N } from '..';

export type I18NState = ReturnType<typeof generateI18NState>;

export const generateI18NState = (i18nText: I18N) => {
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
  };
};