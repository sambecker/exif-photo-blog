export const MAKE_FUJIFILM = 'FUJIFILM';

export const isMakeFujifilm = (make?: string) =>
  make?.toLocaleUpperCase() === MAKE_FUJIFILM;
