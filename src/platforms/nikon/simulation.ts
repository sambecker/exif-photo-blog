
import { deparameterize } from '@/utility/string';
import { parseNikonMakerNote } from './server';

const TAG_ID_PICTURE_CONTROL_DATA = 0x0023;

export interface NikonPictureControlLabel {
  small: string
  medium: string
  large: string
}

const NIKON_PICTURE_CONTROLS = [
  'auto',
  'standard',
  'neutral',
  'vivid',
  'monochrome',
  'portrait',
  'landscape',
  'flat',
  'rich-tone-portrait',
  'deep-tone-monochrome',
  'flat-monochrome',
  'dream',
  'morning',
  'pop',
  'sunday',
  'somber',
  'dramatic',
  'silence',
  'bleached',
  'melancholic',
  'pure',
  'denim',
  'toy',
  'sepia',
  'blue',
  'red',
  'pink',
  'charcoal',
  'graphite',
  'binary',
  'carbon',
] as const;

export type NikonPictureControl = typeof NIKON_PICTURE_CONTROLS[number];

const NIKON_PICTURE_CONTROL_LABELS =
  NIKON_PICTURE_CONTROLS.reduce((labels, control) => {
    labels[control] = {
      small: deparameterize(control),
      medium: deparameterize(control),
      large: deparameterize(control),
    };
    return labels;
  }, {} as Record<string, NikonPictureControlLabel>);

export const isStringNikonPictureControl = (
  film?: string,
): boolean =>
  film !== undefined &&
  NIKON_PICTURE_CONTROLS.includes(film as any);

export const labelForNikonPictureControl = (
  film: NikonPictureControl | string,
): NikonPictureControlLabel =>
  NIKON_PICTURE_CONTROL_LABELS[film] ?? {
    small: film,
    medium: film,
    large: film,
  };

export const getNikonPictureControlFromMakerNote = (bytes: Buffer)=> {
  let pictureControl: NikonPictureControl | undefined;

  parseNikonMakerNote(
    bytes,
    (tag, value) => {
      if (tag === TAG_ID_PICTURE_CONTROL_DATA && Buffer.isBuffer(value)) {
        // Picture Control Name is at offset 8, length 20
        if (value.length >= 28) {
          const name = value.toString('ascii', 8, 28);
          // Remove null bytes and trim
          pictureControl = name
            .replace(/\0/g, '')
            .trim() as NikonPictureControl;
        }
      }
    },
  );

  return pictureControl;
};
