import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

const FONT_IBM_PLEX_MONO_FAMILY = 'IBMPlexMono';
const FONT_IBM_PLEX_MONO_PATH = '/public/fonts/IBMPlexMono-Medium.ttf';

const getFontData = async () =>
  fs.readFileSync(path.join(cwd(), FONT_IBM_PLEX_MONO_PATH));

export const getIBMPlexMonoMedium = () => getFontData()
  .then(data => ({
    fontFamily: FONT_IBM_PLEX_MONO_FAMILY,
    fonts: [{
      name: FONT_IBM_PLEX_MONO_FAMILY,
      data,
      weight: 500,
      style: 'normal',
    } as const],
  }));
