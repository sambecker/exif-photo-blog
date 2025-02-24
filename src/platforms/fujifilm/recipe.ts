import { parseFujifilmMakerNote } from '.';

const TAG_ID_DYNAMIC_RANGE = 0x1400;
const TAG_ID_DYNAMIC_RANGE_SETTING = 0x1402;
const TAG_ID_DEVELOPMENT_DYNAMIC_RANGE = 0x1403;
const TAG_ID_WHITE_BALANCE = 0x1002;
const TAG_ID_WHITE_BALANCE_FINE_TUNE = 0x100a;
const TAG_ID_NOISE_REDUCTION = 0x100e;
const TAG_ID_NOISE_REDUCTION_BASIC = 0x100b;
const TAG_ID_HIGHLIGHT = 0x1041;
const TAG_ID_SHADOW = 0x1040;
const TAG_ID_SATURATION = 0x1003;
const TAG_ID_SHARPNESS = 0x1001;
const TAG_ID_CLARITY = 0x100f;
const TAG_ID_COLOR_CHROME_EFFECT = 0x1048;
const TAG_ID_COLOR_CHROME_FX_BLUE = 0x104e;
const TAG_ID_GRAIN_EFFECT_ROUGHNESS = 0x1047;
const TAG_ID_GRAIN_EFFECT_SIZE = 0x104c;
const TAG_ID_BW_ADJUSTMENT = 0x1049;
const TAG_ID_BW_MAGENTA_GREEN = 0x104b;

type WeakStrong = 'off' | 'weak' | 'strong';

export type FujifilmRecipe = {
  dynamicRange: {
    range: 'standard' | 'wide'
    // eslint-disable-next-line max-len
    setting: 'auto' | 'manual' | 'standard' | 'wide-1' | 'wide-2' | 'film-simulation'
    development: number
  }
  whiteBalance: {
    type: string
    red: number
    blue: number
  }
  highISONoiseReduction?: number
  noiseReductionBasic?: string
  highlight?: number
  shadow?: number
  color?: number
  sharpness?: number
  clarity?: number
  colorChromeEffect?: WeakStrong
  colorChromeFXBlue?: WeakStrong
  grainEffect: {
    roughness: WeakStrong
    size: 'off' | 'small' | 'large'
  }
  bwAdjustment?: number
  bwMagentaGreen?: number
};

const DEFAULT_DYNAMIC_RANGE = {
  range: 'standard',
  setting: 'auto',
  development: 100,
} as const;

const DEFAULT_WHITE_BALANCE = {
  type: 'auto',
  red: 0,
  blue: 0,
} as const;

const DEFAULT_GRAIN_EFFECT = {
  roughness: 'off',
  size: 'off',
} as const;

export const processDynamicRangeSettings = (
  value: number,
): FujifilmRecipe['dynamicRange']['setting'] => {
  switch (value) {
  case 0x001:   return 'manual';
  case 0x100:   return 'standard';
  case 0x200:   return 'wide-1';
  case 0x201:   return 'wide-1';
  case 0x8000:  return 'film-simulation';
  default:      return 'auto';
  }
};

export const processTone = (value: number) =>
  value === 0 ? 0 : -(value / 16);

export const processSaturation = (value: number) => {
  switch (value) {
  case 0x4e0: return -4;
  case 0x4c0: return -3;
  case 0x400: return -2;
  case 0x180: return -1;
  case 0x80:  return 1;
  case 0x100: return 2;
  case 0xc0:  return 3;
  case 0xe0:  return 4;
  default:    return 0;
  }
};

export const processNoiseReductionLegacy = (value: number) => {
  switch (value) {
  case 0x40: return 'low';
  case 0x80: return 'normal';
  default:   return 'n/a';
  }
};

export const processNoiseReduction = (value: number) => {
  switch (value) {
  case 0x2e0: return -4;
  case 0x2c0: return -3;
  case 0x200: return -2;
  case 0x280: return -1;
  case 0x180: return 1;
  case 0x100: return 2;
  case 0x1c0: return 3;
  case 0x1e0: return 4;
  default: return 0;
  }
};

export const processSharpness = (value: number) => {
  switch (value) {
  case 0x0:  return -4;
  case 0x1:  return -3;
  case 0x2:  return -2;
  case 0x82: return -1;
  case 0x84: return 1;
  case 0x4:  return 2;
  case 0x5:  return 3;
  case 0x6:  return 4;
  default: return 0;
  }
};

export const processClarity = (value: number) => value / 1000;

export const processWeakStrong = (value: number): WeakStrong => {
  switch (value) {
  case 32: return 'weak';
  case 64: return 'strong';
  default: return 'off';
  }
};

export const processGrainEffectSize = (
  value: number,
): Required<FujifilmRecipe>['grainEffect']['size'] => {
  switch (value) {
  case 16: return 'small';
  case 32: return 'large';
  default: return 'off';
  }
};

export const processWhiteBalanceType = (value: number) => {
  switch (value) {
  case 0x1:   return 'auto-white-priority';
  case 0x2:   return 'auto-ambiance-priority';
  case 0x100: return 'daylight';
  case 0x200: return 'cloudy';
  case 0x300: return 'daylight-fluorescent';
  case 0x301: return 'day-white-fluorescent';
  case 0x302: return 'white-fluorescent';
  case 0x303: return 'warm-white-fluorescent';
  case 0x304: return 'living-room-warm-white-fluorescent';
  case 0x400: return 'incandescent';
  case 0x500: return 'flash';
  case 0x600: return 'underwater';
  case 0xf00: return 'custom';
  case 0xf01: return 'custom-2';
  case 0xf02: return 'custom-3';
  case 0xf03: return 'custom-4';
  case 0xf04: return 'custom-5';
  case 0xff0: return 'kelvin';
  default:    return 'auto';
  }
};

export const processWhiteBalanceComponent = (value: number) => value / 20;

export const getFujifilmRecipeFromMakerNote = (
  bytes: Buffer,
): FujifilmRecipe => {
  const recipe: FujifilmRecipe = {
    dynamicRange: DEFAULT_DYNAMIC_RANGE,
    whiteBalance: DEFAULT_WHITE_BALANCE,
    grainEffect: DEFAULT_GRAIN_EFFECT,
  };

  parseFujifilmMakerNote(
    bytes,
    (tag, numbers) => {
      switch (tag) {
      case TAG_ID_DYNAMIC_RANGE:
        recipe.dynamicRange.range = numbers[0] === 3
          ? 'wide'
          : 'standard';
        break;
      case TAG_ID_DYNAMIC_RANGE_SETTING:
        recipe.dynamicRange.setting = processDynamicRangeSettings(numbers[0]);
        break;
      case TAG_ID_DEVELOPMENT_DYNAMIC_RANGE:
        recipe.dynamicRange.development = numbers[0];
        break;
      case TAG_ID_WHITE_BALANCE:
        recipe.whiteBalance.type = processWhiteBalanceType(numbers[0]);
        break;
      case TAG_ID_WHITE_BALANCE_FINE_TUNE:
        recipe.whiteBalance.red = processWhiteBalanceComponent(numbers[0]);
        recipe.whiteBalance.blue = processWhiteBalanceComponent(numbers[1]);
        break;
      case TAG_ID_NOISE_REDUCTION:
        recipe.highISONoiseReduction = processNoiseReduction(numbers[0]);
        break;
      case TAG_ID_NOISE_REDUCTION_BASIC:
        recipe.noiseReductionBasic = processNoiseReductionLegacy(numbers[0]);
        break;
      case TAG_ID_HIGHLIGHT:
        recipe.highlight = processTone(numbers[0]);
        break;
      case TAG_ID_SHADOW:
        recipe.shadow = processTone(numbers[0]);
        break;
      case TAG_ID_SATURATION:
        recipe.color = processSaturation(numbers[0]);
        break;
      case TAG_ID_SHARPNESS:
        recipe.sharpness = processSharpness(numbers[0]);
        break;
      case TAG_ID_CLARITY:
        recipe.clarity = processClarity(numbers[0]);
        break;
      case TAG_ID_COLOR_CHROME_EFFECT:
        recipe.colorChromeEffect = processWeakStrong(numbers[0]);
        break;
      case TAG_ID_COLOR_CHROME_FX_BLUE:
        recipe.colorChromeFXBlue = processWeakStrong(numbers[0]);
        break;
      case TAG_ID_GRAIN_EFFECT_ROUGHNESS:
        recipe.grainEffect.roughness = processWeakStrong(numbers[0]);
        break;
      case TAG_ID_GRAIN_EFFECT_SIZE:
        recipe.grainEffect.size = processGrainEffectSize(numbers[0]);
        break;
      case TAG_ID_BW_ADJUSTMENT:
        recipe.bwAdjustment = numbers[0];
        break;
      case TAG_ID_BW_MAGENTA_GREEN:
        recipe.bwMagentaGreen = numbers[0];
        break;
      }
    },
  );

  return recipe;
};
