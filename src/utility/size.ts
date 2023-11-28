const DEFAULT_ASPECT_RATIO = 3.0 / 2.0;

export const getDimensionsFromSize = (
  size: number,
  aspectRatioRaw?: string | number,
): {
  width: number
  height: number
  aspectRatio: number
} => {
  const aspectRatio = typeof aspectRatioRaw === 'string'
    ? parseFloat(aspectRatioRaw)
    : aspectRatioRaw || DEFAULT_ASPECT_RATIO;

  let width = size;
  let height = size;

  if (aspectRatio > 1) {
    height = size / aspectRatio;
  } else if (aspectRatio < 1) {
    width = size * aspectRatio;
  }
  
  return {
    width: Math.round(width),
    height: Math.round(height),
    aspectRatio,
  };
};
