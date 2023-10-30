import { FILM_SIMULATION_FORM_INPUT_OPTIONS } from '@/vendors/fujifilm';
import PhotoFujifilmSimulation from
  '@/vendors/fujifilm/PhotoFujifilmSimulation';

export default function FilmPage() {
  return (
    <div className="space-y-1 my-12">
      {FILM_SIMULATION_FORM_INPUT_OPTIONS.map(({ value }) =>
        <div key={value}>
          <PhotoFujifilmSimulation
            simulation={value}
            showIconFirst
          />
        </div>)}
    </div>
  );
}
