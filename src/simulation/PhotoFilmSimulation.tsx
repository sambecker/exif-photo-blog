import { labelForFilmSimulation } from '@/vendors/fujifilm';
import PhotoFilmSimulationIcon from './PhotoFilmSimulationIcon';
import { pathForFilmSimulation } from '@/site/paths';
import { FilmSimulation } from '.';
import EntityLink, { EntityType } from '@/components/EntityLink';

export default function PhotoFilmSimulation({
  simulation,
  type = 'icon-last',
  badged = true,
  countOnHover,
}: {
  simulation: FilmSimulation
  type?: EntityType
  badged?: boolean
  countOnHover?: number
}) {
  const { small, medium, large } = labelForFilmSimulation(simulation);

  return (
    <EntityLink
      label={medium}
      labelSmall={small}
      href={pathForFilmSimulation(simulation)}
      icon={<PhotoFilmSimulationIcon {...{ simulation }} />}
      title={`Film Simulation: ${large}`}
      type={type}
      badged={badged}
      hoverEntity={countOnHover}
    />
  );
}
