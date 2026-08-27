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
    about: {
      ...i18n.about,
      updated: (distance: string) =>
        i18n.about.updated.replace('{{distance}}', distance),
    },
    admin: {
      ...i18n.admin,
      deleteConfirm: (photoTitle: string) =>
        i18n.admin.deleteConfirm.replace('{{photoTitle}}', photoTitle),
      setVisibilityPlaceholder: (quantity: string) =>
        i18n.admin.setVisibilityPlaceholder.replace('{{quantity}}', quantity),
      setVisibilityConfirm: (visibility: string, quantity: string) =>
        i18n.admin.setVisibilityConfirm
          .replace('{{visibility}}', visibility)
          .replace('{{quantity}}', quantity),
      setVisibilitySuccess: (quantity: string) =>
        i18n.admin.setVisibilitySuccess.replace('{{quantity}}', quantity),
      photosSelected: (quantity: string) =>
        i18n.admin.photosSelected.replace('{{quantity}}', quantity),
      tagPlaceholder: (quantity: string) =>
        i18n.admin.tagPlaceholder.replace('{{quantity}}', quantity),
      tagConfirm: (quantity: string) =>
        i18n.admin.tagConfirm.replace('{{quantity}}', quantity),
      tagSuccess: (quantity: string, tags: string) =>
        i18n.admin.tagSuccess
          .replace('{{quantity}}', quantity)
          .replace('{{tags}}', tags),
      albumPlaceholder: (quantity: string) =>
        i18n.admin.albumPlaceholder.replace('{{quantity}}', quantity),
      albumConfirm: (quantity: string) =>
        i18n.admin.albumConfirm.replace('{{quantity}}', quantity),
      albumSuccess: (quantity: string, albums: string) =>
        i18n.admin.albumSuccess
          .replace('{{quantity}}', quantity)
          .replace('{{albums}}', albums),
      favoriteConfirm: (quantity: string) =>
        i18n.admin.favoriteConfirm.replace('{{quantity}}', quantity),
      favoriteSuccess: (quantity: string) =>
        i18n.admin.favoriteSuccess.replace('{{quantity}}', quantity),
      batchActionFailure: (quantity: string) =>
        i18n.admin.batchActionFailure.replace('{{quantity}}', quantity),
      deletePhotosConfirm: (quantity: string) =>
        i18n.admin.deletePhotosConfirm.replace('{{quantity}}', quantity),
      deletePhotosSuccess: (quantity: string) =>
        i18n.admin.deletePhotosSuccess.replace('{{quantity}}', quantity),
      deletePhotosFailure: (quantity: string) =>
        i18n.admin.deletePhotosFailure.replace('{{quantity}}', quantity),
    },
    utility: {
      ...i18n.utility,
      copyPhrase: (label: string) =>
        i18n.utility.copyPhrase.replace('{{label}}', label),
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