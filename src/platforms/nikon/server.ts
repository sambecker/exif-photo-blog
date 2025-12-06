import type { ExifData } from 'ts-exif-parser';
import { isMakeNikon } from '.';

// Nikon MakerNote Header
const NIKON_MAKERNOTE_HEADER = 'Nikon\x00\x02\x00\x00\x00';
const HEADER_SIZE = 18;

export const isExifForNikon = (data: ExifData) => isMakeNikon(data.tags?.Make);

export const parseNikonMakerNote = (
  bytes: Buffer,
  sendTagValue: (tagId: number, value: any) => void,
) => {
  // Check for Nikon header
  if (bytes.length < 10 || bytes.toString('ascii', 0, 5) !== 'Nikon') {
    return;
  }

  // Assume Type 3 for Z series
  // Skip 10 bytes header
  const baseOffset = 10;
  
  const tiffStart = 10;
  if (bytes.length < tiffStart + 8) return;

  const isLE = bytes.toString('hex', tiffStart, tiffStart + 2) === '4949';
  
  const readUInt16 = (offset: number) => isLE ? bytes.readUInt16LE(offset) : bytes.readUInt16BE(offset);
  const readUInt32 = (offset: number) => isLE ? bytes.readUInt32LE(offset) : bytes.readUInt32BE(offset);

  const ifdOffset = readUInt32(tiffStart + 4);
  let currentOffset = tiffStart + ifdOffset;

  if (currentOffset >= bytes.length) return;

  const tagCount = readUInt16(currentOffset);
  currentOffset += 2;

  for (let i = 0; i < tagCount; i++) {
    if (currentOffset + 12 > bytes.length) break;

    const tagId = readUInt16(currentOffset);
    const type = readUInt16(currentOffset + 2);
    const count = readUInt32(currentOffset + 4);
    // Value offset or value itself
    const valueOffsetOrData = currentOffset + 8;

    let value: any;
    
    // We only care about ASCII strings (Type 2) and Undefined (Type 7) for now
    if (type === 2) {
      let offset = valueOffsetOrData;
      if (count > 4) {
        offset = tiffStart + readUInt32(valueOffsetOrData);
      }
      
      if (offset + count <= bytes.length) {
        value = bytes.toString('ascii', offset, offset + count - 1); // -1 to remove null terminator
      }
    } else if (type === 7) {
      let offset = valueOffsetOrData;
      if (count > 4) {
        offset = tiffStart + readUInt32(valueOffsetOrData);
      }
      if (offset + count <= bytes.length) {
        value = bytes.subarray(offset, offset + count);
      }
    }

    if (value !== undefined) {
      sendTagValue(tagId, value);
    }

    currentOffset += 12;
  }
};
