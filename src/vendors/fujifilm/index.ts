// MakerNote tag IDs and values referenced from:
// github.com/exiftool/exiftool/blob/master/lib/Image/ExifTool/FujiFilm.pm

import type { ExifData } from 'ts-exif-parser';

const MAKE_FUJIFILM = 'FUJIFILM';

const BYTE_INDEX_FIRST_TAG = 14;
const BYTES_PER_TAG = 12;
const BYTE_OFFSET_FOR_INT_VALUE = 8;

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
  'portrait-skin-tone' |
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
  case 0x120: return 'portrait-skin-tone';
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

const FILM_SIMULATION_LABELS: Record<FujifilmSimulation, string> = {
  'monochrome':             'Monochrome',
  'monochrome-ye':          'Monochrome + Yellow Filter',
  'monochrome-r':           'Monochrome + Red Filter',
  'monochrome-g':           'Monochrome + Green Filter',
  'sepia':                  'Sepia',
  'acros':                  'ACROS',
  'acros-ye':               'ACROS + Yellow Filter',
  'acros-r':                'ACROS + Red Filter',
  'acros-g':                'ACROS + Green Filter',
  'provia':                 'PROVIA / Standard',
  'portrait':               'Studio Portrait',
  'portrait-saturation':    'Studio Portrait + Enhanced Saturation',
  'portrait-skin-tone':     'ASTIA / Soft',
  'portrait-sharpness':     'Studio Portrait + Enhanced Sharpness',
  'portrait-ex':            'Studio Portrait Ex',
  'velvia':                 'Velvia / Vivid',
  'pro-neg-std':            'PRO Neg. Std',
  'pro-neg-hi':             'PRO Neg. Hi',
  'classic-chrome':         'Classic Chrome',
  'eterna':                 'ETERNA / Cinema',
  'classic-neg':            'Classic Neg.',
  'eterna-bleach-bypass':   'ETERNA Bleach Bypass',
  'nostalgic-neg':          'Nostalgic Neg.',
  'reala':                  'REALA ACE',
};

export const FILM_SIMULATION_FORM_INPUT_OPTIONS = Object
  .entries(FILM_SIMULATION_LABELS)
  .map(([value, label]) => (
    { value, label } as { value: FujifilmSimulation, label: string }
  ))
  .sort((a, b) => a.label.localeCompare(b.label));

export const getLabelForFilmSimulation = (
  simulation: FujifilmSimulation
): string =>
  FILM_SIMULATION_LABELS[simulation];

const parseFujifilmMakerNote = (
  bytes: Buffer,
  valueForTag: (tag: number, value: number) => void
) => {
  for (
    let i = BYTE_INDEX_FIRST_TAG;
    i + BYTES_PER_TAG < bytes.length;
    i += BYTES_PER_TAG
  ) {
    const tag = bytes.readUInt16LE(i);
    const value = bytes.readUInt16LE(i + BYTE_OFFSET_FOR_INT_VALUE);
    valueForTag(tag, value);
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
