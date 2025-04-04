// MakerNote tag IDs and values referenced from:
// - github.com/exiftool/exiftool/blob/master/lib/Image/ExifTool/FujiFilm.pm
// - exiftool.org/TagNames/FujiFilm.html

import type { ExifData } from 'ts-exif-parser';
import { MAKE_FUJIFILM } from '.';

// Makernote Offsets
const BYTE_OFFSET_TAG_COUNT = 12;
const BYTE_OFFSET_FIRST_TAG = 14;

// Tag Offsets
const BYTE_OFFSET_TAG_TYPE = 2;
const BYTE_OFFSET_TAG_SIZE = 4;
const BYTE_OFFSET_TAG_VALUE = 8;

// Tag Sizes
const BYTES_PER_TAG = 12;
const BYTES_PER_TAG_VALUE = 4;

export const isExifForFujifilm = (data: ExifData) =>
  data.tags?.Make?.toLocaleUpperCase() === MAKE_FUJIFILM;

export const parseFujifilmMakerNote = (
  bytes: Buffer,
  sendTagNumbers: (tagId: number, numbers: number[]) => void,
) => {
  const tagCount = bytes.readUint16LE(BYTE_OFFSET_TAG_COUNT);

  for (let i = 0; i < tagCount; i++) {
    const index = BYTE_OFFSET_FIRST_TAG + i * BYTES_PER_TAG;

    if (index + BYTES_PER_TAG < bytes.length) {
      const tagId = bytes.readUInt16LE(index);
      const tagType = bytes.readUInt16LE(index + BYTE_OFFSET_TAG_TYPE);
      const tagValueSize = bytes.readUInt16LE(index + BYTE_OFFSET_TAG_SIZE);

      const sendNumbersForDataType = (
        parseNumberAtOffset: (offset: number) => number,
        sizeInBytes: number,
      ) => {
        let values: number[] = [];
        if (tagValueSize * sizeInBytes <= BYTES_PER_TAG_VALUE) {
          // Retrieve values if they fit in tag block
          values = Array.from({ length: tagValueSize }, (_, i) =>
            parseNumberAtOffset(
              index + BYTE_OFFSET_TAG_VALUE + i * sizeInBytes,
            ),
          );
        } else {
          // Retrieve outside values if they don't fit in tag block
          const offset = bytes.readUint16LE(index + BYTE_OFFSET_TAG_VALUE);
          for (let i = 0; i < tagValueSize; i++) {
            values.push(parseNumberAtOffset(offset + i * sizeInBytes));
          }
        }
        sendTagNumbers(tagId, values);
      };

      switch (tagType) {
      // Int8 (UInt8 read as Int8 according to spec)
      case 1:
        sendNumbersForDataType(offset => bytes.readInt8(offset), 1);
        break;
      // UInt16
      case 3:
        sendNumbersForDataType(offset => bytes.readUInt16LE(offset), 2);
        break;
      // UInt32
      case 4:
        sendNumbersForDataType(offset => bytes.readUInt32LE(offset), 4);
        break;
      // Int32
      case 9:
        sendNumbersForDataType(offset => bytes.readInt32LE(offset), 4);
        break;
      }
    }
  }
};
