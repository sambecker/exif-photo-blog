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
      title={large}
      className={cc(
        'inline-flex items-center gap-2 text-medium',
        'translate-x-[-2px]',
      )}
    >
      <span className="translate-y-[-0.5px]">
        <PhotoFujifilmSimulationIcon simulation={simulation} />
      </span>
      <span className="xs:hidden">{small}</span>
      <span className="hidden xs:inline-block">{medium}</span>
    </span>
  );
}
