// MakerNote tag IDs and values referenced from:
// exiftool/lib/Image/ExifTool/Fujifilm.pm

import type { ExifData } from 'ts-exif-parser';

const BYTE_INDEX_FIRST_TAG = 14;
const BYTES_PER_TAG = 12;
const BYTE_OFFSET_FOR_INT_VALUE = 8;

const TAG_ID_SATURATION = 0x1003;
const TAG_ID_FILM_MODE  = 0x1401;

type FujifilmSimulationFromSaturation =
  'Monochrome' |
  'Monochrome + Ye Filter' |
  'Monochrome + R Filter' |
  'Monochrome + G Filter' |
  'Sepia' |
  'ACROS' |
  'ACROS + Ye Filter' |
  'ACROS + R Filter' |
  'ACROS + G Filter';

type FujifilmMode =
  'Provia / Standard' |
  'ASTIA / Soft' |
  'Velvia / Vivid' |
  'Pro Neg. Std' |
  'Pro Neg. Hi' |
  'Classic Chrome' |
  'ETERNA / Cinema' |
  'Classic Neg.' |
  'ETERNA Bleach Bypass' |
  'Nostalgic Neg.' |
  'REALA ACE';

export type FujifilmSimulation =
  FujifilmSimulationFromSaturation |
  FujifilmMode;

export const isExifForFujifilm = (data: ExifData) =>
  data.tags?.Make === 'FUJIFILM';

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
  case 0x301: return 'Monochrome + R Filter';
  case 0x302: return 'Monochrome + Ye Filter';
  case 0x303: return 'Monochrome + G Filter';
  case 0x310: return 'Sepia';
  case 0x500: return 'ACROS';
  case 0x501: return 'ACROS + R Filter';
  case 0x502: return 'ACROS + Ye Filter';
  case 0x503: return 'ACROS + G Filter';
  }
};

const getFujifilmMode = (
  value?: number,
): FujifilmMode | undefined => {
  switch (value) {
  case 0x000: return 'Provia / Standard';
  case 0x100:
  case 0x110:
  case 0x120:
  case 0x130:
  case 0x300: return 'ASTIA / Soft';
  case 0x200:
  case 0x400: return 'Velvia / Vivid';
  case 0x500: return 'Pro Neg. Std';
  case 0x501: return 'Pro Neg. Hi';
  case 0x600: return 'Classic Chrome';
  case 0x700: return 'ETERNA / Cinema';
  case 0x800: return 'Classic Neg.';
  case 0x900: return 'ETERNA Bleach Bypass';
  case 0xa00: return 'Nostalgic Neg.';
  case 0xb00: return 'REALA ACE';
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
