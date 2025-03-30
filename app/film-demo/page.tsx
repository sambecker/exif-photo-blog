import {
  FILM_SIMULATION_FORM_INPUT_OPTIONS,
} from '@/platforms/fujifilm/simulation';
import PhotoFilm from '@/film/PhotoFilm';

export default function FilmPage() {
  return (
    <div className="space-y-1 my-12">
      {FILM_SIMULATION_FORM_INPUT_OPTIONS.map(({ value }) =>
        <div key={value}>
          <PhotoFilm
            film={value}
            type="icon-first"
          />
        </div>)}
    </div>
  );
}
