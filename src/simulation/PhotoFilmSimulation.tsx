import { labelForFilmSimulation } from '@/vendors/fujifilm';
import PhotoFilmSimulationIcon from './PhotoFilmSimulationIcon';
import { pathForFilmSimulation } from '@/site/paths';
import { FilmSimulation } from '.';
import EntityLink, { EntityLinkExternalProps } from '@/components/EntityLink';

export default function PhotoFilmSimulation({
  simulation,
  type = 'icon-last',
  badged = true,
  dim,
  countOnHover,
}: {
  simulation: FilmSimulation
  countOnHover?: number
} & EntityLinkExternalProps) {
  const { small, medium, large } = labelForFilmSimulation(simulation);

  return (
    <EntityLink
      label={medium}
      labelSmall={small}
      href={pathForFilmSimulation(simulation)}
      icon={<PhotoFilmSimulationIcon
        simulation={simulation}
        className="translate-y-[-1px]"
      />}
      title={`Film Simulation: ${large}`}
      type={type}
      badged={badged}
      dim={dim}
      hoverEntity={countOnHover}
    />
  );
}
