'use client';

import Badge from '@/components/Badge';
import DivDebugBaselineGrid from '@/components/DivDebugBaselineGrid';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import SiteGrid from '@/components/SiteGrid';
import EntityLink from '@/components/primitives/EntityLink';
import LabeledIcon from '@/components/primitives/LabeledIcon';
import PhotoFilmSimulationIcon from '@/simulation/PhotoFilmSimulationIcon';
import { useAppState } from '@/state/AppState';
import { clsx } from 'clsx/lite';
import { useEffect, useState } from 'react';
import { FaCamera, FaHandSparkles, FaUserAltSlash } from 'react-icons/fa';
import { IoMdCamera } from 'react-icons/io';
import { IoImageSharp } from 'react-icons/io5';

const DEBUG_LINES = new Array(30).fill(null);

export default function ComponentsPage() {
  const {
    shouldShowBaselineGrid,
    setShouldShowBaselineGrid,
  } = useAppState();

  const [debugComponents, setDebugComponents] = useState(false);

  useEffect(() => {
    setShouldShowBaselineGrid?.(true);
    return () => setShouldShowBaselineGrid?.(false);
  }, [setShouldShowBaselineGrid]);

  return (
    <SiteGrid
      contentMain={<>
        <h1 className="flex mb-6">
          <div className="grow">
            <span>Baseline Grid: </span>
            <span className="text-dim">
              <span className="md:hidden">13.5px / 19px</span>
              <span className="hidden md:inline-block">14px / 20px</span>
            </span>
          </div>
          <div className={clsx(
            'flex gap-1',
            '[&>*]:inline-flex [&>*]:gap-1 [&_input]:-translate-y-0.5',
          )}>
            <FieldSetWithStatus
              id="grid"
              label="Grid"
              type="checkbox"
              value={shouldShowBaselineGrid ? 'true' : 'false'}
              onChange={e => setShouldShowBaselineGrid?.(e === 'true')}
            />
            <FieldSetWithStatus
              id="components"
              label="Components"
              type="checkbox"
              value={debugComponents ? 'true' : 'false'}
              onChange={e => setDebugComponents(e === 'true')}
            />
          </div>
        </h1>
        <DivDebugBaselineGrid className="flex gap-8">
          <div className="[&>*]:flex">
            <div>
              <LabeledIcon
                icon={<FaCamera size={12} />}
                debug={debugComponents}
              >
                Camera<br />Line two
              </LabeledIcon>
            </div>
            <div>
              <LabeledIcon icon={<IoImageSharp />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
            <div>
              <LabeledIcon icon={<FaUserAltSlash />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
            <div>
              <LabeledIcon icon={<FaUserAltSlash />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
            <div>
              <LabeledIcon icon={<FaUserAltSlash />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
            <div>
              <LabeledIcon icon={<FaUserAltSlash />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
            <div>
              <LabeledIcon icon={<FaUserAltSlash />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
            <div>
              <LabeledIcon icon={<FaUserAltSlash />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
            <div>
              <EntityLink
                icon={<FaHandSparkles />}
                label="Image"
                debug={debugComponents}
              />
            </div>
            <div>
              <EntityLink
                icon={<FaHandSparkles />}
                label="Image"
                badged
                debug={debugComponents}
              />
            </div>
            <div>
              <LabeledIcon
                icon={<IoMdCamera size={12} />}
                debug={debugComponents}
              >
                Canon Mark III
              </LabeledIcon>
            </div>
            <div>
              <EntityLink
                icon={<PhotoFilmSimulationIcon simulation="astia" />}
                label="Astia/Soft"
                type="icon-last"
                iconWide
                badged
                debug={debugComponents}
              />
            </div>
            <div>
              <LabeledIcon icon={<FaUserAltSlash />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
            <div>
              <LabeledIcon icon={<FaUserAltSlash />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
            <div>
              <EntityLink
                icon={<PhotoFilmSimulationIcon simulation="astia" />}
                label="Astia/Soft"
                type="icon-last"
                iconWide
                badged
                debug={debugComponents}
              />
            </div>
            <div>
              <LabeledIcon icon={<FaUserAltSlash />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
            <div>
              <LabeledIcon icon={<FaUserAltSlash />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
            <div>
              <EntityLink
                icon={<></>}
                label="Astia/Soft and another long line here"
                type="icon-last"
                iconWide
                badged
                debug={debugComponents}
              />
            </div>
            <div>
              <LabeledIcon icon={<FaUserAltSlash />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
            <div>
              <EntityLink
                icon={<PhotoFilmSimulationIcon simulation="astia" />}
                label="Astia/Soft"
                type="icon-last"
                iconWide
                badged
                debug={debugComponents}
              />
            </div>
            <div>
              <LabeledIcon icon={<FaUserAltSlash />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
            <div className="flex items-center h-baseline">
              <Badge type="small" uppercase>Optional</Badge>
            </div>
            <div className="flex items-center h-baseline">
              <Badge type="small">Optional</Badge>
            </div>
            <div className="flex items-center h-baseline">
              <Badge type="small" uppercase>Optional</Badge>
            </div>
            <div className="flex items-center h-baseline">
              <Badge type="small">Optional</Badge>
            </div>
            <div className="flex items-center h-baseline">
              <Badge type="small" uppercase>Optional</Badge>
            </div>
            <div className="flex items-center h-baseline">
              <Badge type="small">Optional</Badge>
            </div>
            <div>
              <LabeledIcon icon={<FaUserAltSlash />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
            <div>
              <LabeledIcon icon={<FaUserAltSlash />} debug={debugComponents}>
                Image
              </LabeledIcon>
            </div>
          </div>
          <div className={clsx(
            debugComponents && '[&>*]:bg-gray-300 [&>*]:dark:bg-gray-700',
            '[&>*]:flex',
          )}>
            {DEBUG_LINES.map((_, i) =>
              <div key={i}>
                Line {(i + 1).toString().padStart(2, '0')}
              </div>,
            )}
          </div>
        </DivDebugBaselineGrid>
      </>}
    />
  );
}
