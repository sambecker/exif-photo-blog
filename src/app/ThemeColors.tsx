'use client';

import { MATTE_COLOR, MATTE_COLOR_DARK } from './config';

export default function ThemeColors() {
  return (<>
    {MATTE_COLOR && <style jsx global>{`
      :root { --matte-bg: ${MATTE_COLOR}; }
    `}</style>}
    {MATTE_COLOR_DARK && <style jsx global>{`
      :root { --matte-bg-dark: ${MATTE_COLOR_DARK}; }
    `}</style>}
  </>);
}
