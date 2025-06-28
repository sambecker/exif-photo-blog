import { I18N } from '..';

export type AppTextState = ReturnType<typeof generateAppTextState>;

export const generateAppTextState = (i18n: I18N) => {
  return {
    ...i18n,
    category: {
      ...i18n.category,
      yearTitle: (year: string) =>
        i18n.category.yearTitle.replace('{{year}}', year),
      yearShare: (year: string) =>
        i18n.category.yearShare.replace('{{year}}', year),
      cameraTitle: (camera: string) =>
        i18n.category.cameraTitle.replace('{{camera}}', camera),
      cameraShare: (camera: string) =>
        i18n.category.cameraShare.replace('{{camera}}', camera),
      taggedPhrase: (tag: string) =>
        i18n.category.taggedPhrase.replace('{{tag}}', tag),
      recipeShare: (recipe: string) =>
        i18n.category.recipeShare.replace('{{recipe}}', recipe),
      filmShare: (film: string) =>
        i18n.category.filmShare.replace('{{film}}', film),
      focalLengthTitle: (focal: string) =>
        i18n.category.focalLengthTitle.replace('{{focal}}', focal),
      focalLengthShare: (focal: string) =>
        i18n.category.focalLengthShare.replace('{{focal}}', focal),
      recentSubhead: (distance: string) =>
        i18n.category.recentSubhead.replace('{{distance}}', distance),
    },
    admin: {
      ...i18n.admin,
      deleteConfirm: (photoTitle: string) =>
        i18n.admin.deleteConfirm.replace('{{photoTitle}}', photoTitle),
    },
    misc: {
      ...i18n.misc,
      copyPhrase: (label: string) =>
        i18n.misc.copyPhrase.replace('{{label}}', label),
    },
    utility: {
      ...i18n.utility,
      paginate: (index: number, count: number) =>
        i18n.utility.paginate
          .replace('{{index}}', index.toString())
          .replace('{{count}}', count.toString()),
      paginateAction: (index: number, count: number, action: string) =>
        i18n.utility.paginateAction
          .replace('{{index}}', index.toString())
          .replace('{{count}}', count.toString())
          .replace('{{action}}', action),
    },
  };
};