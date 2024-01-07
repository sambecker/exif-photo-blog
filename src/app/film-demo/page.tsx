import { FILM_SIMULATION_FORM_INPUT_OPTIONS } from '@/vendors/fujifilm';
import PhotoFilmSimulation from
  '@/simulation/PhotoFilmSimulation';

export default function FilmPage() {
  return (
    <div className="space-y-1 my-12">
      {FILM_SIMULATION_FORM_INPUT_OPTIONS.map(({ value }) =>
        <div key={value}>
          <PhotoFilmSimulation
            simulation={value}
            type="icon-first"
          />
        </div>)}
    </div>
  );
}
