import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

const FONT_FAMILY_IBM_PLEX_MONO = 'IBMPlexMono';

const getFontData = async () =>
  fs.readFileSync(path.join(
    cwd(),
    '/public/fonts/IBMPlexMono-Medium.ttf',
  ));

export const getIBMPlexMonoMedium = () => getFontData()
  .then(data => ({
    fontFamily: FONT_FAMILY_IBM_PLEX_MONO,
    fonts: [{
      name: FONT_FAMILY_IBM_PLEX_MONO,
      data,
      weight: 500,
      style: 'normal',
    } as const],
  }));
