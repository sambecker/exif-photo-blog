import { parseFujifilmMakerNote } from '.';

// const TAG_ID_DYNAMIC_RANGE = 0x1400;
// const TAG_ID_DYNAMIC_RANGE_SETTING = 0x1402;
const TAG_ID_DEVELOPMENT_DYNAMIC_RANGE = 0x1403;
// const TAG_ID_AUTO_DYNAMIC_RANGE = 0x140b;
// const TAG_ID_HIGHLIGHT = 0x1041;
// const TAG_ID_SHADOW = 0x1040;
// const TAG_ID_COLOR = 0x1003;
// const TAG_ID_NOISE_REDUCTION = 0x100b;
// const TAG_ID_SHARPNESS = 0x1001;
// const TAG_ID_CLARITY = 0x100f;
// const TAG_ID_GRAIN_EFFECT_ROUGHNESS = 0x1047;
// const TAG_ID_GRAIN_EFFECT_SIZE = 0x104c;
// const TAG_ID_COLOR_CHROME_EFFECT = 0x1048;
// const TAG_ID_COLOR_CHROME_FX_BLUE = 0x104e;
// const TAG_ID_WHITE_BALANCE = 0x1002;
// const TAG_ID_WHITE_BALANCE_FINE_TUNE = 0x1003;
// TBD
// const TAG_ID_TONE = 0x1004;
// const TAG_ID_CONTRAST = 0x1006;

export interface FujifilmRecipe {
  dynamicRange: number
  highlight: number
  shadow: number
  color: number
  noiseReduction: number
  sharpness: number
  clarity: number
  grainEffect: {
    roughness: 'strong' | 'medium' | 'weak'
    size: 'small' | 'large'
  }
  colorChromeEffect: 'strong' | 'medium' | 'weak'
  colorChromeFXBlue: 'off' | 'weak' | 'strong'
  whiteBalance: {
    type: string
    red: number
    blue: number
  }
}

export const getFujifilmRecipeFromMakerNote = (
  bytes: Buffer,
): Partial<FujifilmRecipe> => {
  const recipe: Partial<FujifilmRecipe> = {};

  parseFujifilmMakerNote(
    bytes,
    (tag, value) => {
      switch (tag) {
      case TAG_ID_DEVELOPMENT_DYNAMIC_RANGE:
        recipe.dynamicRange = value;
        break;
      }
    },
  );

  return recipe;
};
