const FONT_FAMILY_IBM_PLEX_MONO = 'IBMPlexMono';

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
