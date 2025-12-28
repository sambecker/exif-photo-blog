
import { parseNikonMakerNote } from './server';

const TAG_ID_PICTURE_CONTROL_DATA = 0x0023;

export type NikonPictureControl = string;

export interface NikonPictureControlLabel {
  small: string
  medium: string
  large: string
}

const NIKON_PICTURE_CONTROL_LABELS: Record<string, NikonPictureControlLabel> = {
  'auto': { small: 'Auto', medium: 'Auto', large: 'Auto' },
  'standard': { small: 'Standard', medium: 'Standard', large: 'Standard' },
  'neutral': { small: 'Neutral', medium: 'Neutral', large: 'Neutral' },
  'vivid': { small: 'Vivid', medium: 'Vivid', large: 'Vivid' },
  'monochrome': { small: 'Monochrome', medium: 'Monochrome', large: 'Monochrome' },
  'portrait': { small: 'Portrait', medium: 'Portrait', large: 'Portrait' },
  'landscape': { small: 'Landscape', medium: 'Landscape', large: 'Landscape' },
  'flat': { small: 'Flat', medium: 'Flat', large: 'Flat' },
  'rich-tone-portrait': { small: 'Rich Tone Portrait', medium: 'Rich Tone Portrait', large: 'Rich Tone Portrait' },
  'deep-tone-monochrome': { small: 'Deep Tone Mono', medium: 'Deep Tone Mono', large: 'Deep Tone Monochrome' },
  'flat-monochrome': { small: 'Flat Mono', medium: 'Flat Mono', large: 'Flat Monochrome' },
  'dream': { small: 'Dream', medium: 'Dream', large: 'Dream' },
  'morning': { small: 'Morning', medium: 'Morning', large: 'Morning' },
  'pop': { small: 'Pop', medium: 'Pop', large: 'Pop' },
  'sunday': { small: 'Sunday', medium: 'Sunday', large: 'Sunday' },
  'somber': { small: 'Somber', medium: 'Somber', large: 'Somber' },
  'dramatic': { small: 'Dramatic', medium: 'Dramatic', large: 'Dramatic' },
  'silence': { small: 'Silence', medium: 'Silence', large: 'Silence' },
  'bleached': { small: 'Bleached', medium: 'Bleached', large: 'Bleached' },
  'melancholic': { small: 'Melancholic', medium: 'Melancholic', large: 'Melancholic' },
  'pure': { small: 'Pure', medium: 'Pure', large: 'Pure' },
  'denim': { small: 'Denim', medium: 'Denim', large: 'Denim' },
  'toy': { small: 'Toy', medium: 'Toy', large: 'Toy' },
  'sepia': { small: 'Sepia', medium: 'Sepia', large: 'Sepia' },
  'blue': { small: 'Blue', medium: 'Blue', large: 'Blue' },
  'red': { small: 'Red', medium: 'Red', large: 'Red' },
  'pink': { small: 'Pink', medium: 'Pink', large: 'Pink' },
  'charcoal': { small: 'Charcoal', medium: 'Charcoal', large: 'Charcoal' },
  'graphite': { small: 'Graphite', medium: 'Graphite', large: 'Graphite' },
  'binary': { small: 'Binary', medium: 'Binary', large: 'Binary' },
  'carbon': { small: 'Carbon', medium: 'Carbon', large: 'Carbon' },
};

const NIKON_STRING_TO_MODE: Record<string, string> = {
  'AUTO': 'auto',
  'STANDARD': 'standard',
  'NEUTRAL': 'neutral',
  'VIVID': 'vivid',
  'MONOCHROME': 'monochrome',
  'PORTRAIT': 'portrait',
  'LANDSCAPE': 'landscape',
  'FLAT': 'flat',
  'RICH TONE PORTRAIT': 'rich-tone-portrait',
  'DEEP TONE MONOCHROME': 'deep-tone-monochrome',
  'FLAT MONOCHROME': 'flat-monochrome',
  'DREAM': 'dream',
  'MORNING': 'morning',
  'POP': 'pop',
  'SUNDAY': 'sunday',
  'SOMBER': 'somber',
  'DRAMATIC': 'dramatic',
  'SILENCE': 'silence',
  'BLEACHED': 'bleached',
  'MELANCHOLIC': 'melancholic',
  'PURE': 'pure',
  'DENIM': 'denim',
  'TOY': 'toy',
  'SEPIA': 'sepia',
  'BLUE': 'blue',
  'RED': 'red',
  'PINK': 'pink',
  'CHARCOAL': 'charcoal',
  'GRAPHITE': 'graphite',
  'BINARY': 'binary',
  'CARBON': 'carbon',
};

export const isStringNikonPictureControl = (film?: string): film is NikonPictureControl =>
  film !== undefined &&
  Object.keys(NIKON_PICTURE_CONTROL_LABELS).includes(film);

export const labelForNikonPictureControl = (film: NikonPictureControl): NikonPictureControlLabel =>
  NIKON_PICTURE_CONTROL_LABELS[film] ?? {
    small: film,
    medium: film,
    large: film,
  };

export const getNikonPictureControlFromMakerNote = (
  bytes: Buffer,
): NikonPictureControl | undefined => {
  let pictureControl: string | undefined;

  parseNikonMakerNote(
    bytes,
    (tag, value) => {
      if (tag === TAG_ID_PICTURE_CONTROL_DATA && Buffer.isBuffer(value)) {
        // Picture Control Name is at offset 8, length 20
        if (value.length >= 28) {
          const name = value.toString('ascii', 8, 28);
          // Remove null bytes and trim
          pictureControl = name.replace(/\0/g, '').trim();
        }
      }
    },
  );

  if (pictureControl) {
    if (NIKON_STRING_TO_MODE[pictureControl]) {
      return NIKON_STRING_TO_MODE[pictureControl];
    }
    const upper = pictureControl.toUpperCase();
    if (NIKON_STRING_TO_MODE[upper]) {
      return NIKON_STRING_TO_MODE[upper];
    }
    return pictureControl;
  }

  return undefined;
};
