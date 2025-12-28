import {
  getNikonPictureControlFromMakerNote,
} from '@/platforms/nikon/simulation';

describe('Nikon', () => {
  describe('parsing', () => {
    it('extracts Picture Control Name from PictureControlData (0x0023)', () => {
      // Construct a mock Nikon MakerNote
      // Header: "Nikon\x00\x02\x00\x00\x00" (10 bytes)
      const header = Buffer.from('Nikon\x00\x02\x00\x00\x00', 'ascii');
      
      // TIFF Header at offset 10
      // II (Little Endian)
      const tiffHeader = Buffer.from(
        [0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00],
      );
      
      // IFD at offset 10 + 8 = 18
      // Count: 1 tag
      const ifdCount = Buffer.from([0x01, 0x00]);
      
      // Tag: PictureControlData (0x0023)
      // Type: Undefined (7)
      // Count: 108
      // Value/Offset: Offset to data
      const tagId = Buffer.from([0x23, 0x00]);
      const tagType = Buffer.from([0x07, 0x00]);
      const tagCount = Buffer.from([0x6C, 0x00, 0x00, 0x00]); // 108
      const tagOffset = Buffer.from([0x16, 0x00, 0x00, 0x00]); // 22
      
      const tag = Buffer.concat([tagId, tagType, tagCount, tagOffset]);
      
      // Data: 108 bytes
      // 0-3: Version
      // 4-7: Version
      // 8-27: Name (20 bytes)
      const data = Buffer.alloc(108);
      data.write('0310', 0);
      data.write('0310', 4);
      data.write('standard\0\0\0', 8); // Name at offset 8
      
      const makerNote = Buffer.concat([
        header,
        tiffHeader,
        ifdCount,
        tag,
        data,
      ]);
      
      const pictureControl = getNikonPictureControlFromMakerNote(makerNote);
      expect(pictureControl).toBe('standard');
    });

    it('returns undefined for invalid header', () => {
      const makerNote = Buffer.from('Canon\x00\x02\x00\x00\x00', 'ascii');
      const pictureControl = getNikonPictureControlFromMakerNote(makerNote);
      expect(pictureControl).toBeUndefined();
    });
  });
});
