const FONT_FAMILY_IBM_PLEX_MONO = 'IBMPlexMono';
const FONT_FAMILY_GEIST_MONO = 'Geist Mono';

export const getIBMPlexMonoMedium = () => fetch(new URL(
  '/public/fonts/IBMPlexMono-Medium.ttf',
  import.meta.url
))
  .then(res => res.arrayBuffer())
  .then(data => ({
    fontFamily: FONT_FAMILY_IBM_PLEX_MONO,
    fonts: [{
      name: FONT_FAMILY_IBM_PLEX_MONO,
      data,
      weight: 500,
      style: 'normal',
    } as const],
  }));

export const getGeistMonoMedium = () => fetch(new URL(
  '/public/geist-mono/GeistMono-Medium.otf',
  import.meta.url
))
  .then(res => res.arrayBuffer())
  .then(data => ({
    fontFamily: FONT_FAMILY_GEIST_MONO,
    fonts: [{
      name: FONT_FAMILY_GEIST_MONO,
      data,
      weight: 500,
      style: 'normal',
    } as const],
  }));
