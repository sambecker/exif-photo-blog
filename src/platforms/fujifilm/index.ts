// MakerNote tag IDs and values referenced from:
// - github.com/exiftool/exiftool/blob/master/lib/Image/ExifTool/FujiFilm.pm
// - exiftool.org/TagNames/FujiFilm.html

import type { ExifData } from 'ts-exif-parser';

export const MAKE_FUJIFILM = 'FUJIFILM';

const BYTE_INDEX_TAG_COUNT = 12;
const BYTE_INDEX_FIRST_TAG = 14;
const BYTES_PER_TAG = 12;
const BYTE_OFFSET_TAG_TYPE = 2;
const BYTE_OFFSET_TAG_SIZE = 4;
const BYTE_OFFSET_TAG_VALUE = 8;

export const isExifForFujifilm = (data: ExifData) =>
  data.tags?.Make === MAKE_FUJIFILM;

export const parseFujifilmMakerNote = (
  bytes: Buffer,
  valueForTagNumbers: (tagId: number, numbers: number[]) => void,
) => {
  const tagCount = bytes.readUint16LE(BYTE_INDEX_TAG_COUNT);
  for (let i = 0; i < tagCount; i++) {
    const index = BYTE_INDEX_FIRST_TAG + i * BYTES_PER_TAG;
    if (index + BYTES_PER_TAG < bytes.length) {
      const tagId = bytes.readUInt16LE(index);
      const tagType = bytes.readUInt16LE(index + BYTE_OFFSET_TAG_TYPE);
      const tagValueSize = bytes.readUInt16LE(index + BYTE_OFFSET_TAG_SIZE);
      switch (tagType) {
      // Int8 (UInt8 read as Int8)
      case 1:
        valueForTagNumbers(
          tagId,
          [bytes.readInt8(index + BYTE_OFFSET_TAG_VALUE)],
        );
        break;
      // UInt16
      case 3:
        valueForTagNumbers(
          tagId,
          [bytes.readUInt16LE(index + BYTE_OFFSET_TAG_VALUE)],
        );
        break;
      // UInt32
      case 4:
        valueForTagNumbers(
          tagId,
          [bytes.readUInt32LE(index + BYTE_OFFSET_TAG_VALUE)],
        );
        break;
      // Int32
      case 9:
        if (tagValueSize === 1) {
          valueForTagNumbers(
            tagId,
            [bytes.readInt32LE(index + BYTE_OFFSET_TAG_VALUE)],
          );
        } else {
          const offset = bytes.readInt32LE(index + BYTE_OFFSET_TAG_VALUE);
          const values: number[] = [];
          for (let i = 0; i < tagValueSize; i++) {
            values.push(bytes.readInt32LE(offset + i * 4));
          }
          valueForTagNumbers(tagId, values);
        }
        break;
      }
    }
  }
};
