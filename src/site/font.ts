export const FONT_FAMILY_IBM_PLEX_MONO = 'IBMPlexMono';

export const getIBMPlexMonoMedium = () => fetch(new URL(
  '/public/fonts/IBMPlexMono-Medium.ttf',
  import.meta.url
))
  .then(res => res.arrayBuffer());
