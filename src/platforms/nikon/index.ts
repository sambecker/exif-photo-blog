export const MAKE_NIKON = 'NIKON CORPORATION';

export const isMakeNikon = (make?: string) =>
  make?.toUpperCase() === MAKE_NIKON;
