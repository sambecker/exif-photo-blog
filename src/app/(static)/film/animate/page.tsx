'use client';

import InfoBlock from '@/components/InfoBlock';
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
    <InfoBlock className="w-[250px] h-[125px] m-36 scale-150">
      <div className={cc(
        'w-[250px] h-[125px]',
        'flex justify-start items-center pl-12',
      )}>
        <PhotoFujifilmSimulation
          simulation={FILM_SIMULATION_FORM_INPUT_OPTIONS[index].value}
          showIconFirst
        />
      </div>
    </InfoBlock>
  );
}
