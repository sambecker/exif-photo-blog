'use client';

import SiteGrid from '@/components/SiteGrid';
import { clsx } from 'clsx/lite';
import { FILM_SIMULATION_FORM_INPUT_OPTIONS } from '@/vendors/fujifilm';
import PhotoFilmSimulation from
  '@/simulation/PhotoFilmSimulation';
import { useEffect, useState } from 'react';

export default function FilmPage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % FILM_SIMULATION_FORM_INPUT_OPTIONS.length);
    }, 200);
    return () => clearInterval(interval);
  });

  return (
    <SiteGrid
      contentMain={<div className={clsx(
        'flex items-center justify-center min-h-[30rem]',
      )}>
        <div className="w-[250px] scale-[2.5]">
          <div className="dark:text-gray-500/50 uppercase">
            Film Simulation:
          </div>
          <PhotoFilmSimulation
            simulation={FILM_SIMULATION_FORM_INPUT_OPTIONS[index].value}
            type="icon-first"
          />
          <div className="mt-4 text-dim relative">
            <div>
              <div>35mm 53mm</div>
              <div>ƒ/1.4</div>
              <div>1/3200s</div>
              <div>ISO 125</div>
            </div>
            <div className={clsx(
              'absolute top-0 left-[-2px] right-0 bottom-0',
              'bg-gradient-to-t',
              'from-white to-[rgba(255,255,255,0.5)]',
              'dark:from-black dark:to-[rgba(0,0,0,0.5)]',
            )} />
          </div>
        </div>
      </div>}
    />
  );
}
