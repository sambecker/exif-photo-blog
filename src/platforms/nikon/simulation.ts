import { parseNikonMakerNote } from './server';

const TAG_ID_PICTURE_CONTROL_DATA = 0x0023;

export type NikonPictureControl = string;

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
