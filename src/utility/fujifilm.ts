// MakerNote tag IDs and values referenced from:
// exiftool/lib/Image/ExifTool/Fujifilm.pm

import type { ExifData } from 'ts-exif-parser';

const MAKE_FUJIFILM = 'FUJIFILM';

const BYTE_INDEX_FIRST_TAG = 14;
const BYTES_PER_TAG = 12;
const BYTE_OFFSET_FOR_INT_VALUE = 8;

const TAG_ID_SATURATION = 0x1003;
const TAG_ID_FILM_MODE  = 0x1401;

type FujifilmSimulationFromSaturation =
  'Monochrome' |
  'Monochrome + Ye' |
  'Monochrome + R' |
  'Monochrome + G' |
  'Sepia' |
  'Acros' |
  'Acros + Ye' |
  'Acros + R' |
  'Acros + G';

type FujifilmMode =
  'Provia' |
  'Portrait' |
  'Portrait Saturation' |
  'Portrait Skin Tone' |
  'Portrait Sharpness' |
  'Portrait Ex' |
  'Velvia' |
  'Pro Neg. Std' |
  'Pro Neg. Hi' |
  'Classic Chrome' |
  'Eterna' |
  'Classic Neg.' |
  'Eterna Bleach Bypass' |
  'Nostalgic Neg.' |
  'Reala';

export type FujifilmSimulation =
  FujifilmSimulationFromSaturation |
  FujifilmMode;

export const isExifForFujifilm = (data: ExifData) =>
  data.tags?.Make === MAKE_FUJIFILM;

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

const getFujifilmSimulationFromSaturation = (
  value?: number,
): FujifilmSimulationFromSaturation | undefined => {
  switch (value) {
  case 0x300: return 'Monochrome';
  case 0x301: return 'Monochrome + R';
  case 0x302: return 'Monochrome + Ye';
  case 0x303: return 'Monochrome + G';
  case 0x310: return 'Sepia';
  case 0x500: return 'Acros';
  case 0x501: return 'Acros + R';
  case 0x502: return 'Acros + Ye';
  case 0x503: return 'Acros + G';
  }
};

const getFujifilmMode = (
  value?: number,
): FujifilmMode | undefined => {
  switch (value) {
  case 0x000: return 'Provia';
  case 0x100: return 'Portrait';
  case 0x110: return 'Portrait Saturation';
  case 0x120: return 'Portrait Skin Tone';
  case 0x130: return 'Portrait Sharpness';
  case 0x300: return 'Portrait Ex';
  case 0x200:
  case 0x400: return 'Velvia';
  case 0x500: return 'Pro Neg. Std';
  case 0x501: return 'Pro Neg. Hi';
  case 0x600: return 'Classic Chrome';
  case 0x700: return 'Eterna';
  case 0x800: return 'Classic Neg.';
  case 0x900: return 'Eterna Bleach Bypass';
  case 0xa00: return 'Nostalgic Neg.';
  case 0xb00: return 'Reala';
  }
};

const LABEL_FOR_FILM_SIMULATION: Record<FujifilmSimulation, string> = {
  'Monochrome':             'Monochrome',
  'Monochrome + Ye':        'Monochrome + Yellow Filter',
  'Monochrome + R':         'Monochrome + Red Filter',
  'Monochrome + G':         'Monochrome + Green Filter',
  'Sepia':                  'Sepia',
  'Acros':                  'ACROS',
  'Acros + Ye':             'ACROS + Yellow Filter',
  'Acros + R':              'ACROS + Red Filter',
  'Acros + G':              'ACROS + Green Filter',
  'Provia':                 'PROVIA / Standard',
  'Portrait':               'Studio Portrait',
  'Portrait Saturation':    'Studio Portrait + Enhanced Saturation',
  'Portrait Skin Tone':     'ASTIA / Soft',
  'Portrait Sharpness':     'Studio Portrait + Enhanced Sharpness',
  'Portrait Ex':            'Studio Portrait Ex',
  'Velvia':                 'Velvia / Vivid',
  'Pro Neg. Std':           'PRO Neg. Std',
  'Pro Neg. Hi':            'PRO Neg. Hi',
  'Classic Chrome':         'Classic Chrome',
  'Eterna':                 'ETERNA / Cinema',
  'Classic Neg.':           'Classic Neg.',
  'Eterna Bleach Bypass':   'ETERNA Bleach Bypass',
  'Nostalgic Neg.':         'Nostalgic Neg.',
  'Reala':                  'REALA ACE',
};

export const getLabelForFilmSimulation = (
  simulation: FujifilmSimulation
): string =>
  LABEL_FOR_FILM_SIMULATION[simulation];

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
