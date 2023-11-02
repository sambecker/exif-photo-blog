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
  badged = true,
}: {
  simulation: FujifilmSimulation
  showIconFirst?: boolean
  badged?: boolean
}) {
  const { small, medium, large } = getLabelForFilmSimulation(simulation);

  const renderContent = () => <>
    <span className="xs:hidden">
      {small}
    </span>
    <span className="hidden xs:inline-block">
      {medium}
    </span>
  </>;

  return (
    <span
      title={`Film Simulation: ${large}`}
      className="inline-flex items-center gap-1"
    >
      {badged
        ? <Badge uppercase>{renderContent()}</Badge>
        : <span className="uppercase text-medium">{renderContent()}</span>}
      <span className={cc(
        'translate-y-[-1.25px] text-extra-dim',
        showIconFirst && 'order-first',
      )}>
        <PhotoFujifilmSimulationIcon simulation={simulation} />
      </span>
    </span>
  );
}
