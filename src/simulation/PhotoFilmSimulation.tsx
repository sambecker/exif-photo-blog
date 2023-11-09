import { cc } from '@/utility/css';
import { labelForFilmSimulation } from '@/vendors/fujifilm';
import PhotoFilmSimulationIcon from './PhotoFilmSimulationIcon';
import Badge from '@/components/Badge';
import Link from 'next/link';
import { pathForFilmSimulation } from '@/site/paths';
import { FilmSimulation } from '.';

export default function PhotoFilmSimulation({
  simulation,
  type = 'icon-last',
  badged = true,
  countOnHover,
}: {
  simulation: FilmSimulation
  type?: 'icon-last' | 'icon-first' | 'icon-only' | 'text-only'
  badged?: boolean
  countOnHover?: number
}) {
  const { small, medium, large } = labelForFilmSimulation(simulation);

  const renderContent = () => <>
    <span className="xs:hidden">
      {small}
    </span>
    <span className="hidden xs:inline-block">
      {medium}
    </span>
  </>;

  return (
    <span className="group h-6 inline-flex items-center gap-2">
      <Link
        href={pathForFilmSimulation(simulation)}
        title={`Film Simulation: ${large}`}
        className="inline-flex items-center gap-1"
      >
        {type !== 'icon-only' && <>
          {badged
            ? <Badge type="secondary" uppercase interactive>
              {renderContent()}
            </Badge>
            : <span className="uppercase text-medium">{renderContent()}</span>}
        </>}
        {type !== 'text-only' && <span className={cc(
          'translate-y-[-1px] text-dim',
          type === 'icon-first' && 'order-first',
        )}>
          <PhotoFilmSimulationIcon {...{ simulation }} />
        </span>}
      </Link>
      {countOnHover !== undefined &&
        <span className="hidden group-hover:inline">
          {countOnHover}
        </span>}
    </span>
  );
}
