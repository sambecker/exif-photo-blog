import { cc } from '@/utility/css';
import {
  FujifilmSimulation,
  getLabelForFilmSimulation,
} from '@/vendors/fujifilm';
import PhotoFujifilmSimulationIcon from './PhotoFujifilmSimulationIcon';
import Badge from '@/components/Badge';

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
      className="inline-flex items-center gap-1"
    >
      <Badge uppercase>
        <span className="xs:hidden">
          {small}
        </span>
        <span className="hidden xs:inline-block">
          {medium}
        </span>
      </Badge>
      <span className={cc(
        'translate-y-[-1.25px] text-extra-dim',
        showIconFirst && 'order-first',
      )}>
        <PhotoFujifilmSimulationIcon simulation={simulation} />
      </span>
    </span>
  );
}
