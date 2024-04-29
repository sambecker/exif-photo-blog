import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

const FONT_FAMILY_IBM_PLEX_MONO = 'IBMPlexMono';

const getFontData = async () => {
  let data: ArrayBuffer;
  if (typeof fs !== 'undefined') {
    data = fs.readFileSync(path.join(
      cwd(),
      '/public/fonts/IBMPlexMono-Medium.ttf',
    ));
  } else {
    data = await fetch(new URL(
      '/public/fonts/IBMPlexMono-Medium.ttf',
      import.meta.url
    )).then(res => res.arrayBuffer());
  }
  return data;
};

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
