import { cc } from '@/utility/css';
import {
  FujifilmSimulation,
  getLabelForFilmSimulation,
} from '@/vendors/fujifilm';
import PhotoFujifilmSimulationIcon from './PhotoFujifilmSimulationIcon';
import Badge from '@/components/Badge';

export default function PhotoFujifilmSimulation({
  simulation,
  type = 'icon-last',
  badged = true,
}: {
  simulation: FujifilmSimulation
  type?: 'icon-last' | 'icon-first' | 'icon-only' | 'text-only'
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
      {type !== 'icon-only' && <>
        {badged
          ? <Badge type="secondary" uppercase>{renderContent()}</Badge>
          : <span className="uppercase text-medium">{renderContent()}</span>}
      </>}
      {type !== 'text-only' && <span className={cc(
        'translate-y-[-1.25px] text-extra-dim',
        type === 'icon-first' && 'order-first',
      )}>
        <PhotoFujifilmSimulationIcon {...{ simulation }} />
      </span>}
    </span>
  );
}
