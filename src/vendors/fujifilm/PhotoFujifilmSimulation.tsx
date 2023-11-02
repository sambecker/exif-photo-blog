import { cc } from '@/utility/css';
import {
  FujifilmSimulation,
  getLabelForFilmSimulation,
} from '@/vendors/fujifilm';
import PhotoFujifilmSimulationIcon from './PhotoFujifilmSimulationIcon';

export default function PhotoFujifilmSimulation({
  simulation,
  showIconFirst,
}: {
  simulation: FujifilmSimulation
  showIconFirst?: boolean
}) {
  const { small, medium, large } = getLabelForFilmSimulation(simulation);
  return (
    <span
      title={`Film Simulation: ${large}`}
      className={cc(
        'inline-flex items-center gap-1',
        'text-medium uppercase',
      )}
    >
      <span className={cc(
        'xs:hidden',
        small.endsWith('.') && '-mr-1',
      )}>
        {small}
      </span>
      <span className={cc(
        'hidden xs:inline-block',
        'bg-gray-100 px-1 py-1 leading-none rounded-md',
        'text-gray-500 font-medium text-[0.7rem] tracking-wide',
      )}>
        {medium}
      </span>
      <span className={cc(
        'translate-y-[-1.25px] text-extra-dim',
        showIconFirst && 'order-first',
      )}>
        <PhotoFujifilmSimulationIcon simulation={simulation} />
      </span>
    </span>
  );
}
