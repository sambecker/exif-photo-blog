'use client';

import SiteGrid from '@/components/SiteGrid';
import { cc } from '@/utility/css';
import { FILM_SIMULATION_FORM_INPUT_OPTIONS } from '@/vendors/fujifilm';
import PhotoFujifilmSimulation from
  '@/vendors/fujifilm/PhotoFujifilmSimulation';
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
      contentMain={<div className={cc(
        'flex items-center justify-center min-h-[30rem]',
      )}>
        <div className="w-[250px] scale-150">
          <div className="dark:text-gray-500/50 uppercase">
            Film Simulation:
          </div>
          <PhotoFujifilmSimulation
            simulation={FILM_SIMULATION_FORM_INPUT_OPTIONS[index].value}
            showIconFirst
          />
          <div className="mt-4 text-dim relative">
            <div>
              <div>35mm 53mm</div>
              <div>ƒ/1.4</div>
              <div>1/3200s</div>
              <div>ISO 125</div>
            </div>
            <div className={cc(
              'absolute top-0 left-[-2px] right-0 bottom-0',
              'bg-gradient-to-t from-black to-[rgba(0,0,0,0.5)]',
            )} />
          </div>
        </div>
      </div>}
    />
  );
}
