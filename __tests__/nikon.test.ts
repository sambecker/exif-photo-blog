import {
  getNikonPictureControlName,
  isExifForNikon,
} from '@/platforms/nikon/server';
import type { ExifData } from 'ts-exif-parser';

describe('Nikon', () => {
  describe('isExifForNikon', () => {
    it('identifies Nikon cameras correctly', () => {
      const nikonExif: ExifData = {
        tags: { Make: 'NIKON CORPORATION' },
      } as ExifData;

      const nonNikonExif: ExifData = {
        tags: { Make: 'Canon' },
      } as ExifData;

      expect(isExifForNikon(nikonExif)).toBe(true);
      expect(isExifForNikon(nonNikonExif)).toBe(false);
    });
  });

  describe('getNikonPictureControlName', () => {
    it('extracts PictureControlName from MakerNote data with duplicated version', 
      () => {
        // 8 bytes padding, 4 bytes version, 4 bytes version, 20 bytes name
        const name = 'T&O_BrandonW';
        const nameBytes = [
          ...Buffer.from(name, 'ascii'),
          ...new Array(20 - name.length).fill(0),
        ];
        const mockMakerNote = Buffer.from([
          // 8 bytes padding
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          // "0310"
          0x30,
          0x33,
          0x31,
          0x30,
          // "0310"
          0x30,
          0x33,
          0x31,
          0x30,
          // 20 bytes name
          ...nameBytes,
        ]);
        const result = getNikonPictureControlName(mockMakerNote);
        expect(result).toBe('T&O BrandonW');
      });

    it('extracts PictureControlName from MakerNote data with single version', 
      () => {
        // 8 bytes padding, 4 bytes version, 20 bytes name
        const name = 'Ektar 100';
        const nameBytes = [
          ...Buffer.from(name, 'ascii'),
          ...new Array(20 - name.length).fill(0),
        ];
        const mockMakerNote = Buffer.from([
          // 8 bytes padding
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          // "0310"
          0x30,
          0x33,
          0x31,
          0x30,
          // 20 bytes name
          ...nameBytes,
        ]);
        const result = getNikonPictureControlName(mockMakerNote);
        expect(result).toBe('Ektar 100');
      });

    it('formats PictureControlName with underscores to proper case', () => {
      // Test formatting of names with underscores
      const name = 'FLAT_MONOCHROME';
      const nameBytes = [
        ...Buffer.from(name, 'ascii'),
        ...new Array(20 - name.length).fill(0),
      ];
      const mockMakerNote = Buffer.from([
        // 8 bytes padding
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        // "0310"
        0x30,
        0x33,
        0x31,
        0x30,
        // "0310"
        0x30,
        0x33,
        0x31,
        0x30,
        // 20 bytes name
        ...nameBytes,
      ]);
      const result = getNikonPictureControlName(mockMakerNote);
      expect(result).toBe('Flat Monochrome');
    });

    it('returns undefined when PictureControlData is not found', () => {
      // Mock MakerNote without PictureControlData
      const mockMakerNote = Buffer.from([
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
      ]);

      const result = getNikonPictureControlName(mockMakerNote);
      expect(result).toBeUndefined();
    });

    it('handles empty or invalid MakerNote data', () => {
      const emptyBuffer = Buffer.from([]);
      const result = getNikonPictureControlName(emptyBuffer);
      expect(result).toBeUndefined();
    });

    it('ignores version strings that are not followed by valid names', () => {
      // Version followed by another version (no valid name)
      const mockMakerNote = Buffer.from([
        0x30,
        0x33,
        0x31,
        0x30, // "0310" (version)
        0x30,
        0x33,
        0x31,
        0x30, // "0310" (another version)
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00, // null bytes
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00, // more null bytes
      ]);

      const result = getNikonPictureControlName(mockMakerNote);
      expect(result).toBeUndefined();
    });

    it('formats camelCase and PascalCase names into separate words', () => {
      const names = [
        { raw: 'DeepToneMonochrome', expected: 'Deep Tone Monochrome' },
        { raw: 'KodakGold200', expected: 'Kodak Gold 200' },
        { raw: 'RichTonePortrait', expected: 'Rich Tone Portrait' },
        { raw: 'FlatMonochrome', expected: 'Flat Monochrome' },
      ];
      for (const { raw, expected } of names) {
        const nameBytes = [
          ...Buffer.from(raw, 'ascii'),
          ...new Array(20 - raw.length).fill(0),
        ];
        const mockMakerNote = Buffer.from([
          // 8 bytes padding
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          0x00,
          // "0310"
          0x30,
          0x33,
          0x31,
          0x30,
          // "0310"
          0x30,
          0x33,
          0x31,
          0x30,
          // 20 bytes name
          ...nameBytes,
        ]);
        const result = getNikonPictureControlName(mockMakerNote);
        expect(result).toBe(expected);
      }
    });
  });
});
