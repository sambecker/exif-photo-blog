/* eslint-disable max-len */
import { cc } from '@/utility/css';
import {
  FujifilmSimulation,
  getLabelForFilmSimulation,
} from '@/vendors/fujifilm';
import PhotoFujifilmSimulationIcon from './PhotoFujifilmSimulationIcon';

export default function PhotoFujifilmSimulation({
  simulation,
}: {
  simulation: FujifilmSimulation;
}) {
  const { small, medium, large } = getLabelForFilmSimulation(simulation);
  return (
    <span
      title={`Film Simulation: ${large}`}
      className={cc(
        'inline-flex items-center gap-1.5',
        'text-medium uppercase',
      )}
    >
      <span className="xs:hidden">{small}</span>
      <span className="hidden xs:inline-block">{medium}</span>
      <span className="translate-y-[-1.25px]">
        <PhotoFujifilmSimulationIcon simulation={simulation} />
      </span>
    </span>
  );
}
