import type { ExifData } from 'ts-exif-parser';
import { MAKE_NIKON } from '.';

// Nikon MakerNote Header
const NIKON_MAKERNOTE_HEADER = 'Nikon\x00\x02\x00\x00\x00';
const HEADER_SIZE = 18; // "Nikon\x00\x02\x00\x00\x00" + 2 bytes (TIFF header) + 4 bytes (offset) ?
// Actually, usually it's "Nikon\x00\x02\x10\x00\x00" or similar.
// Let's assume standard TIFF structure after "Nikon\x00\x02\x00\x00\x00" (10 bytes)
// The TIFF structure starts at offset 10 (0-indexed) relative to the start of MakerNote?
// Or is it relative to the start of the file?
// Nikon Type 3 MakerNote:
// Header: "Nikon\x00\x02\x10\x00\x00" (10 bytes)
// Followed by TIFF structure (IFD).
// The offsets in the IFD are relative to the start of the MakerNote (or sometimes start of file + offset).
// Let's try to parse it as a TIFF IFD starting at offset 10.

export const isExifForNikon = (data: ExifData) =>
  data.tags?.Make?.toUpperCase() === MAKE_NIKON;

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
  
  // Read TIFF header at baseOffset
  // Byte order (2 bytes): 0x4949 (II) or 0x4D4D (MM)
  // 0x2A00 (42)
  // Offset to first IFD (4 bytes)
  
  // Actually, Nikon Type 3 usually starts directly with the IFD count at offset 10?
  // Let's look at how Fujifilm did it. They hardcoded offsets.
  // Nikon Type 3:
  // 0-4: "Nikon"
  // 5: 0x00
  // 6: 0x02
  // 7: 0x10 (or 0x00)
  // 8-9: 0x0000
  // 10-13: Tiff header? Or just start of IFD?
  // Often it is:
  // 10-11: 0x4949 (II)
  // 12-13: 0x2A00 (42)
  // 14-17: Offset to 0th IFD (usually 8)
  // So the TIFF structure starts at 10.
  
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
