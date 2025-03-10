import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

const FONT_IBM_PLEX_MONO_FAMILY = 'IBMPlexMono';

const FONT_IBM_PLEX_MONO_PATH_REGULAR = '/public/fonts/IBMPlexMono-Regular.ttf';
const FONT_IBM_PLEX_MONO_PATH_MEDIUM = '/public/fonts/IBMPlexMono-Medium.ttf';

const getFontData = async (fontPath: string) =>
  fs.readFileSync(path.join(cwd(), fontPath));

export const getIBMPlexMono = async () => {
  const [regular, medium] = await Promise.all([
    getFontData(FONT_IBM_PLEX_MONO_PATH_REGULAR),
    getFontData(FONT_IBM_PLEX_MONO_PATH_MEDIUM),
  ]);
  return {
    fontFamily: FONT_IBM_PLEX_MONO_FAMILY,
    fonts: [{
      name: FONT_IBM_PLEX_MONO_FAMILY,
      data: regular,
      weight: 400,
      style: 'normal',
    } as const, {
      name: FONT_IBM_PLEX_MONO_FAMILY,
      data: medium,
      weight: 500,
      style: 'normal',
    } as const,
    ],
  };
};
