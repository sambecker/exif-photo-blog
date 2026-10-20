/* eslint-disable @stylistic/max-len */
import fixtures from './fixtures/om-system.json';
import {
  createOmRecipeKey,
  getOmRecipeFromImage,
  getOmRecipeFromMakerNote,
} from '@/platforms/om-system/server';
import sharp from 'sharp';
import piexif from 'piexifjs';
import {
  isOmSystemCamera,
  isOmRecipeKey,
  parseOmRecipe,
  formatOmWbShift,
  labelForOmRecipeKey,
  omRecipeKeyAliases,
} from '@/platforms/om-system/recipe';
import { formatRecipe } from '@/recipe';
import { getWheresFromOptions } from '@/db';
import { parsePhotoFromDb } from '@/photo';
import {
  convertFormDataToPhotoDbInsert,
  convertPhotoToFormData,
} from '@/photo/form';

type Entry = { tag: number, type: number, values: number[] };

// Real numeric tag values in a minimal, anonymous OM MakerNote container.
const makerNote = (
  entries: Entry[], littleEndian = true, header: 'om' | 'olympus' = 'om',
) => {
  const rootOffset = header === 'om' ? 16 : 12;
  const directory = rootOffset + 18;
  const size = directory + 2 + entries.length * 12 + 4;
  const bytes = Buffer.alloc(size + entries.reduce((n, entry) =>
    n + (entry.values.length > 2 ? entry.values.length * 2 : 0), 0));
  const u16 = (value: number, offset: number) => littleEndian
    ? bytes.writeUInt16LE(value, offset) : bytes.writeUInt16BE(value, offset);
  const s16 = (value: number, offset: number) => littleEndian
    ? bytes.writeInt16LE(value, offset) : bytes.writeInt16BE(value, offset);
  const u32 = (value: number, offset: number) => littleEndian
    ? bytes.writeUInt32LE(value, offset) : bytes.writeUInt32BE(value, offset);
  bytes.write(header === 'om' ? 'OM SYSTEM\0\0\0' : 'OLYMPUS\0', 0, 'ascii');
  bytes.write(littleEndian ? 'II' : 'MM', rootOffset - 4, 'ascii');
  u16(header === 'om' ? 4 : 3, rootOffset - 2);
  u16(1, rootOffset);
  u16(0x2020, rootOffset + 2);
  u16(13, rootOffset + 4);
  u32(1, rootOffset + 6);
  u32(directory, rootOffset + 10);
  u16(entries.length, directory);
  let tail = size;
  entries.forEach(({ tag, type, values }, i) => {
    const index = directory + 2 + i * 12;
    u16(tag, index);
    u16(type, index + 2);
    u32(values.length, index + 4);
    const offset = values.length <= 2 ? index + 8 : tail;
    if (values.length > 2) {
      u32(tail, index + 8);
      tail += values.length * 2;
    }
    values.forEach((value, j) => (type === 8 ? s16 : u16)(value, offset + j * 2));
  });
  return bytes;
};

const change = (entries: Entry[], tag: number, values: number[]) =>
  entries.map(entry => entry.tag === tag ? { ...entry, values } : entry);

const decode = (entries: Entry[]) => getOmRecipeFromMakerNote(makerNote(entries));
const requireRecipe = (entries: Entry[]) => {
  const recipe = decode(entries);
  if (!recipe) { throw new Error('Expected complete camera fixture'); }
  return recipe;
};

describe('OM SYSTEM and Olympus profiles', () => {
  it.each([
    'OM Digital Solutions   ', 'OM SYSTEM', 'OLYMPUS',
    'OLYMPUS IMAGING CORP.', 'OLYMPUS CORPORATION', 'OLYMPUS OPTICAL CO.,LTD',
  ])('recognizes the %s camera make without a model restriction', make => {
    expect(isOmSystemCamera(make)).toBe(true);
  });

  it('rejects other makes, missing tags, and make lookalikes', () => {
    for (const make of ['FUJIFILM', 'NIKON', 'OM SYSTEM FAKE', '', undefined]) {
      expect(isOmSystemCamera(make)).toBe(false);
    }
  });

  it.each([
    ['OM Digital Solutions', 'PEN', 'om'],
    ['OM Digital Solutions', 'OM-3', 'olympus'],
    ['OM SYSTEM', 'Future model', 'om'],
    ['OLYMPUS IMAGING CORP.', 'PEN-F', 'olympus'],
    ['OLYMPUS CORPORATION', 'E-P7', 'olympus'],
  ] as const)('extracts complete profiles from JPEGs tagged %s / %s',
    async (make, model, header) => {
      const jpeg = await sharp({ create: {
        width: 8, height: 6, channels: 3, background: '#444444',
      } }).jpeg().toBuffer();
      const exif = piexif.dump({
        '0th': { [piexif.ImageIFD.Make]: make, [piexif.ImageIFD.Model]: model },
        Exif: { [piexif.ExifIFD.MakerNote]:
          makerNote(fixtures.color1, true, header).toString('binary') },
      });
      const image = Buffer.from(piexif.insert(exif, jpeg.toString('binary')), 'binary');
      const extracted = getOmRecipeFromImage(image);
      expect(extracted).toEqual({
        isOmCamera: true, recipe: requireRecipe(fixtures.color1),
      });
      expect(createOmRecipeKey(extracted.recipe!))
        .toBe(createOmRecipeKey(requireRecipe(fixtures.color1)));
    },
  );

  it.each(['om', 'olympus'] as const)('reads both byte orders in the %s header', header => {
    for (const littleEndian of [true, false]) {
      expect(getOmRecipeFromMakerNote(makerNote(fixtures.mono1, littleEndian, header)))
        .toEqual(decode(fixtures.mono1));
    }
  });

  it('decodes the original color controls and signed tone values', () => {
    expect(decode(fixtures.color1)).toMatchObject({
      kind: 'color',
      tone: { highlight: 3, shadow: -3, mid: 0 },
      colors: [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
      whiteBalance: { mode: 1, amber: 2, green: 1 },
    });
  });

  it('decodes mono-specific grain, hue, and sharpness', () => {
    expect(decode(fixtures.mono1)).toMatchObject({
      kind: 'mono', filter: { color: 0 }, grain: 'medium',
      hue: 'normal', sharpness: -1,
    });
  });

  it('recognizes COLOR4 instead of using the older Art Mode label', () => {
    expect(decode(fixtures.color4)?.kind).toBe('color');
    expect(decode(fixtures.mono4)?.kind).toBe('mono');
  });

  it('decodes A2/M3 and color shading +3 from the controlled sequence', () => {
    const wb = requireRecipe(fixtures['color4-wb']).whiteBalance;
    expect(wb).toEqual({ mode: 1, amber: 2, green: -3 });
    expect(formatOmWbShift(wb)).toBe('A2 · M3');
    expect(decode(fixtures['color4-shading'])?.shading).toBe(3);
  });

  it.each([0x0500, 0x0502, 0x0523, 0x0524, 0x052e, 0x0539, 0x053a])(
    'does not substitute neutral values for missing defining tag %i', tag => {
      expect(decode(fixtures.color4.filter(entry => entry.tag !== tag)))
        .toBeUndefined();
    },
  );

  it('rejects unsupported modes, active Art Filters, and unknown values', () => {
    for (const mode of [1, 2, 7, 256, 512]) {
      expect(decode(change(fixtures.color4, 0x0520, [mode, 2]))).toBeUndefined();
    }
    expect(decode(fixtures.color4.filter(entry => entry.tag !== 0x0529)))
      .toBeUndefined();
    expect(decode(change(fixtures.color4, 0x0529, [2, 0, 0, 0]))).toBeUndefined();
    expect(decode(change(fixtures.mono4, 0x0538, [99]))).toBeUndefined();
    expect(decode(change(fixtures.color4, 0x0500, [999]))).toBeUndefined();
  });

  it('requires selected Kelvin and an active mono filter strength', () => {
    expect(decode(change(fixtures.color4, 0x0500, [512]))).toBeUndefined();
    const kelvin = change(change(fixtures.color4, 0x0500, [512]), 0x0501, [5600]);
    expect(decode(kelvin)?.whiteBalance.kelvin).toBe(5600);
    expect(decode(change(fixtures.mono4, 0x0537, [1]))).toBeUndefined();
    expect(decode(change(fixtures.mono4, 0x0537, [1, 0, 8, 3, 0, 3])))
      .toMatchObject({ filter: { color: 1, strength: 3 } });
  });

  it.each(['om', 'olympus'] as const)('rejects truncated or corrupt %s headers and offsets', header => {
    const rootOffset = header === 'om' ? 16 : 12;
    const bytes = makerNote(fixtures.color4, true, header);
    for (const length of [0, 10, rootOffset + 1, rootOffset + 8, bytes.length - 1]) {
      expect(getOmRecipeFromMakerNote(bytes.subarray(0, length))).toBeUndefined();
    }
    const corrupt = Buffer.from(bytes);
    corrupt.writeUInt32LE(0xffffffff, rootOffset + 10);
    expect(getOmRecipeFromMakerNote(corrupt)).toBeUndefined();
    const unknownVersion = Buffer.from(bytes);
    unknownVersion.writeUInt16LE(99, rootOffset - 2);
    expect(getOmRecipeFromMakerNote(unknownVersion)).toBeUndefined();
    const unknownByteOrder = Buffer.from(bytes);
    unknownByteOrder.write('XX', rootOffset - 4, 'ascii');
    expect(getOmRecipeFromMakerNote(unknownByteOrder)).toBeUndefined();
    expect(getOmRecipeFromMakerNote(Buffer.alloc(500))).toBeUndefined();
  });

  it('groups equal settings across slots, inactive settings, and capability ranges', () => {
    const base = requireRecipe(fixtures.color4);
    let other = change(fixtures.color4, 0x0520, [9, 2]);
    other = change(other, 0x0537, [3, 0, 8, 3, 0, 3]);
    other = change(other, 0x0538, [3]);
    other = change(other, 0x0539, [-9, 9, ...Array(12).fill(0)]);
    expect(createOmRecipeKey(requireRecipe(other))).toBe(createOmRecipeKey(base));
    expect(createOmRecipeKey({ ...base, ...{
      exposureCompensation: 2, noiseFilter: 'high', gradation: 'auto',
      measuredWb: [500, 400],
    } })).toBe(createOmRecipeKey(base));
  });

  it('normalizes property order, non-selected Kelvin, and inactive filter strength', () => {
    const mono = requireRecipe(fixtures.mono4);
    const reordered = Object.fromEntries(Object.entries(mono).reverse());
    expect(parseOmRecipe(reordered)).toEqual(mono);
    expect(createOmRecipeKey(parseOmRecipe(reordered)!)).toBe(createOmRecipeKey(mono));
    expect(createOmRecipeKey(requireRecipe(change(fixtures.mono4,
      0x0537, [0, 0, 8, 3, 0, 3])))).toBe(createOmRecipeKey(mono));
    expect(createOmRecipeKey(requireRecipe(change(fixtures.mono4,
      0x0537, [0, 0, 8, 99, 0, 3])))).toBe(createOmRecipeKey(mono));
    expect(createOmRecipeKey(requireRecipe(change(fixtures.mono4,
      0x0501, [5600])))).toBe(createOmRecipeKey(mono));
  });

  it('separates changes to active settings and recipe kind', () => {
    const key = createOmRecipeKey(requireRecipe(fixtures.color4));
    expect(createOmRecipeKey(requireRecipe(fixtures['color4-wb']))).not.toBe(key);
    expect(createOmRecipeKey(requireRecipe(fixtures['color4-shading']))).not.toBe(key);
    expect(createOmRecipeKey(requireRecipe(fixtures.mono4))).not.toBe(key);
    expect(isOmRecipeKey(key)).toBe(true);
    expect(formatRecipe(key)).toBe('Color recipe');
    expect(formatRecipe('classic-chrome')).toBe('Classic Chrome');
  });

  it('filters OM galleries by key and keeps Fuji title queries unchanged', () => {
    const key = createOmRecipeKey(requireRecipe(fixtures.color4));
    expect(key).toMatch(/^om-v1-color-/);
    const legacy = key.replace(/^om-/, 'om-pen-');
    expect(isOmRecipeKey(legacy)).toBe(true);
    expect(labelForOmRecipeKey(legacy)).toBe('Color recipe');
    expect(omRecipeKeyAliases(legacy)).toEqual([key, legacy]);
    for (const recipe of [key, legacy]) {
      expect(getWheresFromOptions({ recipe })).toMatchObject({
        wheres: expect.stringContaining('om_recipe_key IN ($1, $2)'),
        wheresValues: [key, legacy],
      });
    }
    expect(getWheresFromOptions({ recipe: 'kodachrome' })).toMatchObject({
      wheres: expect.stringContaining('recipe_title=$1'),
    });
  });

  it('preserves extracted settings and identity through an ordinary photo edit', () => {
    const recipe = requireRecipe(fixtures.mono4);
    const key = createOmRecipeKey(recipe);
    const photo = parsePhotoFromDb({
      id: 'penphoto', url: 'https://example.test/pen.jpg', extension: 'jpg',
      make: 'OM Digital Solutions', model: 'PEN', aspectRatio: 4 / 3,
      takenAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
      takenAtNaive: '2026-10-20 12:00:00', tags: [],
      omRecipeData: JSON.stringify(recipe), omRecipeKey: key,
      omRecipeCheckedVersion: 1,
    });
    const form = convertPhotoToFormData(photo);
    form.title = 'Updated title';
    const insert = convertFormDataToPhotoDbInsert(form);
    expect(insert.title).toBe('Updated title');
    expect(parseOmRecipe(insert.omRecipeData)).toEqual(recipe);
    expect(insert.omRecipeKey).toBe(key);
    expect(insert.omRecipeCheckedVersion).toBe(1);
  });
});
