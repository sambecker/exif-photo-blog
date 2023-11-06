// MakerNote tag IDs and values referenced from:
// github.com/exiftool/exiftool/blob/master/lib/Image/ExifTool/FujiFilm.pm

import type { ExifData } from 'ts-exif-parser';

export const MAKE_FUJIFILM = 'FUJIFILM';

const BYTE_INDEX_TAG_COUNT = 12;
const BYTE_INDEX_FIRST_TAG = 14;
const BYTES_PER_TAG = 12;
const BYTE_OFFSET_TAG_TYPE = 2;
const BYTE_OFFSET_TAG_VALUE = 8;

const TAG_ID_SATURATION = 0x1003;
const TAG_ID_FILM_MODE  = 0x1401;

type FujifilmSimulationFromSaturation =
  'monochrome' |
  'monochrome-ye' |
  'monochrome-r' |
  'monochrome-g' |
  'sepia' |
  'acros' |
  'acros-ye' |
  'acros-r' |
  'acros-g';

type FujifilmMode =
  'provia' |
  'portrait' |
  'portrait-saturation' |
  'astia' |
  'portrait-sharpness' |
  'portrait-ex' |
  'velvia' |
  'pro-neg-std' |
  'pro-neg-hi' |
  'classic-chrome' |
  'eterna' |
  'classic-neg' |
  'eterna-bleach-bypass' |
  'nostalgic-neg' |
  'reala';

export type FujifilmSimulation =
  FujifilmSimulationFromSaturation |
  FujifilmMode;

export const isExifForFujifilm = (data: ExifData) =>
  data.tags?.Make === MAKE_FUJIFILM;

const getFujifilmSimulationFromSaturation = (
  value?: number,
): FujifilmSimulationFromSaturation | undefined => {
  switch (value) {
  case 0x300: return 'monochrome';
  case 0x301: return 'monochrome-r';
  case 0x302: return 'monochrome-ye';
  case 0x303: return 'monochrome-g';
  case 0x310: return 'sepia';
  case 0x500: return 'acros';
  case 0x501: return 'acros-r';
  case 0x502: return 'acros-ye';
  case 0x503: return 'acros-g';
  }
};

const getFujifilmMode = (
  value?: number,
): FujifilmMode | undefined => {
  switch (value) {
  case 0x000: return 'provia';
  case 0x100: return 'portrait';
  case 0x110: return 'portrait-saturation';
  case 0x120: return 'astia'; // can be encoded as 'portrait-skin-tone'
  case 0x130: return 'portrait-sharpness';
  case 0x300: return 'portrait-ex';
  case 0x200:
  case 0x400: return 'velvia';
  case 0x500: return 'pro-neg-std';
  case 0x501: return 'pro-neg-hi';
  case 0x600: return 'classic-chrome';
  case 0x700: return 'eterna';
  case 0x800: return 'classic-neg';
  case 0x900: return 'eterna-bleach-bypass';
  case 0xa00: return 'nostalgic-neg';
  case 0xb00: return 'reala';
  }
};

interface FujifilmSimulationLabel {
  small: string
  medium: string
  large: string
}

const FILM_SIMULATION_LABELS: Record<
  FujifilmSimulation,
  FujifilmSimulationLabel
> = {
  'monochrome': {
    small: 'Monochrome',
    medium: 'Monochrome',
    large: 'Monochrome',
  },
  'monochrome-ye': {
    small: 'Monochrome+Ye',
    medium: 'Monochrome+Ye',
    large: 'Monochrome + Yellow Filter',
  },
  'monochrome-r': {
    small: 'Monochrome+R',
    medium: 'Monochrome+R',
    large: 'Monochrome + Red Filter',
  },
  'monochrome-g': {
    small: 'Monochrome+G',
    medium: 'Monochrome+G',
    large: 'Monochrome + Green Filter',
  },
  'sepia': {
    small: 'Sepia',
    medium: 'Sepia',
    large: 'Sepia',
  },
  'acros': {
    small: 'ACROS',
    medium: 'ACROS',
    large: 'ACROS',
  },
  'acros-ye': {
    small: 'ACROS+Ye',
    medium: 'ACROS+Ye',
    large: 'ACROS + Yellow Filter',
  },
  'acros-r': {
    small: 'ACROS+R',
    medium: 'ACROS+R',
    large: 'ACROS + Red Filter',
  },
  'acros-g': {
    small: 'ACROS+G',
    medium: 'ACROS+G',
    large: 'ACROS + Green Filter',
  },
  'provia': {
    small: 'PROVIA',
    medium: 'PROVIA/Std',
    large: 'PROVIA / Standard',
  },
  'portrait': {
    small: 'Portrait',
    medium: 'Portrait',
    large: 'Studio Portrait',
  },
  'portrait-saturation': {
    small: 'Portrait+Sat.',
    medium: 'Portrait+Sat.',
    large: 'Studio Portrait + Enhanced Saturation',
  },
  'astia': {
    small: 'ASTIA',
    medium: 'ASTIA/Soft',
    large: 'ASTIA / Soft',
  },
  'portrait-sharpness': {
    small: 'Portrait+Sharp.',
    medium: 'Portrait+Sharp.',
    large: 'Studio Portrait + Enhanced Sharpness',
  },
  'portrait-ex': {
    small: 'Portrait+Ex',
    medium: 'Portrait+Ex',
    large: 'Studio Portrait + Ex',
  },
  'velvia': {
    small: 'Velvia',
    medium: 'Velvia/Vivid',
    large: 'Velvia / Vivid',
  },
  'pro-neg-std': {
    small: 'PRO Neg. Std',
    medium: 'PRO Neg. Std',
    large: 'PRO Neg. Std',
  },
  'pro-neg-hi': {
    small: 'PRO Neg. Hi',
    medium: 'PRO Neg. Hi',
    large: 'PRO Neg. Hi',
  },
  'classic-chrome': {
    small: 'Classic Chrome',
    medium: 'Classic Chrome',
    large: 'Classic Chrome',
  },
  'eterna': {
    small: 'ETERNA',
    medium: 'ETERNA/Cinema',
    large: 'ETERNA / Cinema',
  },
  'classic-neg': {
    small: 'Classic Neg.',
    medium: 'Classic Neg.',
    large: 'Classic Neg.',
  },
  'eterna-bleach-bypass': {
    small: 'ETERNA Bypass',
    medium: 'ETERNA Bypass',
    large: 'ETERNA Bleach Bypass',
  },
  'nostalgic-neg': {
    small: 'Nostalgic Neg.',
    medium: 'Nostalgic Neg.',
    large: 'Nostalgic Neg.',
  },
  'reala': {
    small: 'REALA',
    medium: 'REALA ACE',
    large: 'REALA ACE',
  },
};

export const FILM_SIMULATION_FORM_INPUT_OPTIONS = Object
  .entries(FILM_SIMULATION_LABELS)
  .map(([value, label]) => (
    { value, label: label.large } as
    { value: FujifilmSimulation, label: string }
  ))
  .sort((a, b) => a.label.localeCompare(b.label));

export const labelForFilmSimulation = (simulation: FujifilmSimulation) =>
  FILM_SIMULATION_LABELS[simulation];

const parseFujifilmMakerNote = (
  bytes: Buffer,
  valueForTagUInt: (tagId: number, value: number) => void
) => {
  const tagCount = bytes.readUint16LE(BYTE_INDEX_TAG_COUNT);
  for (let i = 0; i < tagCount; i++) {
    const index = BYTE_INDEX_FIRST_TAG + i * BYTES_PER_TAG;
    if (index + BYTES_PER_TAG < bytes.length) {
      const tagId = bytes.readUInt16LE(index);
      const tagType = bytes.readUInt16LE(index + BYTE_OFFSET_TAG_TYPE);
      switch (tagType) {
      // UInt16
      case 3:
        valueForTagUInt(
          tagId,
          bytes.readUInt16LE(index + BYTE_OFFSET_TAG_VALUE),
        );
        break;
      // UInt32
      case 4:
        valueForTagUInt(
          tagId,
          bytes.readUInt32LE(index + BYTE_OFFSET_TAG_VALUE),
        );
        break;
      }
    }
  }
};

export const getFujifilmSimulationFromMakerNote = (
  bytes: Buffer,
): FujifilmSimulation | undefined => {
  let filmModeFromSaturation: FujifilmSimulationFromSaturation | undefined;
  let filmMode: FujifilmMode | undefined;

  parseFujifilmMakerNote(
    bytes,
    (tag, value) => {
      switch (tag) {
      case TAG_ID_SATURATION:
        filmModeFromSaturation = getFujifilmSimulationFromSaturation(value);
        break;
      case TAG_ID_FILM_MODE:
        filmMode = getFujifilmMode(value);
        break;
      }
    },
  );

  return filmModeFromSaturation ?? filmMode;
};
