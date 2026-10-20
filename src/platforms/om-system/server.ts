import { createHash } from 'node:crypto';
import { isOmSystemCamera, OmRecipe, parseOmRecipe } from './recipe';
import { ExifParserFactory } from 'ts-exif-parser';

// Verified against PEN originals and ExifTool's Olympus.pm/MakerNotes.pm.
// Both modern header formats use offsets relative to the MakerNote itself.
const readOmCameraSettings = (
  bytes: Buffer,
): Map<number, number[]> | undefined => {
  const rootOffset = bytes.toString('ascii', 0, 10) === 'OM SYSTEM\0' ? 16
    : bytes.toString('ascii', 0, 8) === 'OLYMPUS\0' ? 12 : undefined;
  if (rootOffset === undefined || bytes.length < rootOffset + 2) {
    return undefined;
  }
  const order = bytes.toString('ascii', rootOffset - 4, rootOffset - 2);
  if (order !== 'II' && order !== 'MM') { return undefined; }
  const u16 = (offset: number) => order === 'II'
    ? bytes.readUInt16LE(offset) : bytes.readUInt16BE(offset);
  const s16 = (offset: number) => order === 'II'
    ? bytes.readInt16LE(offset) : bytes.readInt16BE(offset);
  const u32 = (offset: number) => order === 'II'
    ? bytes.readUInt32LE(offset) : bytes.readUInt32BE(offset);
  if (u16(rootOffset - 2) !== (rootOffset === 16 ? 4 : 3)) {
    return undefined;
  }
  const entries = (offset: number) => {
    if (offset < rootOffset || offset + 2 > bytes.length) { return undefined; }
    const count = u16(offset);
    if (offset + 2 + count * 12 > bytes.length) { return undefined; }
    return Array.from({ length: count }, (_, i) => offset + 2 + i * 12);
  };
  const root = entries(rootOffset);
  const pointer = root?.find(index => u16(index) === 0x2020);
  if (pointer === undefined ||
    ![4, 13].includes(u16(pointer + 2)) || u32(pointer + 4) !== 1) {
    return undefined;
  }
  const directory = entries(u32(pointer + 8));
  if (!directory) { return undefined; }
  const settings = new Map<number, number[]>();
  const relevant = new Set([
    0x0500, 0x0501, 0x0502, 0x0520, 0x0523, 0x0524, 0x0529,
    0x052e, 0x0537, 0x0538, 0x0539, 0x053a, 0x053b,
  ]);
  for (const index of directory) {
    const tag = u16(index);
    if (!relevant.has(tag)) { continue; }
    const type = u16(index + 2);
    if (type !== 3 && type !== 8) { continue; }
    const count = u32(index + 4);
    const offset = count <= 2 ? index + 8 : u32(index + 8);
    if (count === 0 || count > 64 || offset < 0 ||
      offset + count * 2 > bytes.length) {
      return undefined;
    }
    // Duplicate fields are ambiguous, so do not invent a recipe from them.
    if (settings.has(tag)) { return undefined; }
    settings.set(tag, Array.from({ length: count }, (_, i) =>
      type === 8 ? s16(offset + i * 2) : u16(offset + i * 2)));
  }
  return settings;
};

export const getOmRecipeFromMakerNote = (
  bytes: Buffer,
): OmRecipe | undefined => {
  const settings = readOmCameraSettings(bytes);
  if (!settings) { return undefined; }
  const mode = settings.get(0x0520)?.[0];
  // COLOR4 uses 17 on verified originals; older decoders call it Art Mode.
  // Require an explicit disabled ArtFilter plus complete profile settings.
  const kind = [9, 10, 11, 17].includes(mode ?? -1) ? 'color'
    : [12, 13, 14, 18].includes(mode ?? -1) ? 'mono' : undefined;
  if (!kind) { return undefined; }
  if (mode === 17 && !settings.has(0x0529)) { return undefined; }
  // Retained profile settings do not make an active Art Filter a recipe.
  if ((settings.get(0x0529)?.[0] ?? 0) !== 0) { return undefined; }

  const toneValues = settings.get(0x052e);
  const tone = new Map<number, number>();
  if (toneValues) {
    for (let i = 0; i + 3 < toneValues.length; i += 4) {
      if ([-31999, -31998, -31997].includes(toneValues[i]) &&
        tone.has(toneValues[i])) { return undefined; }
      tone.set(toneValues[i], toneValues[i + 1]);
    }
  }
  const wbMode = settings.get(0x0500)?.[0];
  const wbShift = settings.get(0x0502);
  const filter = settings.get(0x0537);
  const grain = settings.get(0x0538)?.[0];
  const hue = settings.get(0x053b)?.[0];

  return parseOmRecipe({
    version: 1,
    kind,
    whiteBalance: {
      mode: wbMode,
      amber: wbShift?.[0],
      green: wbShift?.[1],
      ...(wbMode !== undefined && wbMode >= 512 && {
        kelvin: settings.get(0x0501)?.[0],
      }),
    },
    tone: {
      shadow: tone.get(-31998),
      mid: tone.get(-31997),
      highlight: tone.get(-31999),
    },
    shading: settings.get(0x053a)?.[0],
    sharpness: settings.get(0x0524)?.[0],
    contrast: settings.get(0x0523)?.[0],
    ...(kind === 'color'
      ? { colors: settings.get(0x0539)?.slice(2) }
      : {
        filter: { color: filter?.[0], strength: filter?.[3] },
        grain: grain !== undefined
          ? ['off', 'low', 'medium', 'high'][grain] : undefined,
        hue: hue !== undefined
          ? [undefined, 'normal', 'sepia', 'blue', 'purple', 'green'][hue]
          : undefined,
      }),
  });
};

export const createOmRecipeKey = (value: OmRecipe): string => {
  const recipe = parseOmRecipe(value);
  if (!recipe) {
    throw new Error('Cannot identify an incomplete OM recipe');
  }
  const hash = createHash('sha256')
    .update(JSON.stringify(recipe)).digest('hex');
  return `om-v1-${recipe.kind}-${hash}`;
};

export const getOmRecipeFromImage = (bytes: Buffer) => {
  const parser = ExifParserFactory.create(bytes);
  parser.enableBinaryFields(true);
  const data = parser.parse();
  const isOmCamera = isOmSystemCamera(data.tags?.Make);
  return {
    isOmCamera,
    recipe: isOmCamera && Buffer.isBuffer(data.tags?.MakerNote)
      ? getOmRecipeFromMakerNote(data.tags.MakerNote) : undefined,
  };
};
