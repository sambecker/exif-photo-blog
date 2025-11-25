import { parseNikonMakerNote } from './server';

const TAG_ID_PICTURE_CONTROL_DATA = 0x0023;
 // This is a guess based on some sources, might need adjustment.
// Actually, let's look for a string tag.
// Some sources say PictureControlName is inside the PictureControl binary block (0x71).
// But ExifTool lists PictureControlName as a separate tag in some models.
// Let's try to find a string that looks like a Picture Control name.

export type NikonPictureControl = string;

export const NIKON_PICTURE_CONTROL_LABELS: Record<string, string> = {
  'Standard': 'Standard',
  'Neutral': 'Neutral',
  'Vivid': 'Vivid',
  'Monochrome': 'Monochrome',
  'Portrait': 'Portrait',
  'Landscape': 'Landscape',
  'Flat': 'Flat',
  'Auto': 'Auto',
  'Dream': 'Dream',
  'Morning': 'Morning',
  'Pop': 'Pop',
  'Sunday': 'Sunday',
  'Somber': 'Somber',
  'Dramatic': 'Dramatic',
  'Silence': 'Silence',
  'Bleached': 'Bleached',
  'Melancholic': 'Melancholic',
  'Pure': 'Pure',
  'Denim': 'Denim',
  'Toy': 'Toy',
  'Sepia': 'Sepia',
  'Blue': 'Blue',
  'Red': 'Red',
  'Pink': 'Pink',
  'Charcoal': 'Charcoal',
  'Graphite': 'Graphite',
  'Binary': 'Binary',
  'Carbon': 'Carbon',
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

  return pictureControl;
};
