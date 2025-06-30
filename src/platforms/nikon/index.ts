export const MAKE_NIKON = 'NIKON CORPORATION';

export const isMakeNiken = (make?: string) =>
  make?.toLocaleUpperCase() === MAKE_NIKON;
