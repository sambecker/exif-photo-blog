import { cc } from '@/utility/css';
import SiteGrid from './SiteGrid';
import Spinner from './Spinner';
import AnimateItems from './AnimateItems';

export default function PageSpinner() {
  return (
    <SiteGrid
      contentMain={<div className={cc(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'w-full',
        'min-h-[25vh]',
      )}>
        <AnimateItems
          type="bottom"
          items={[
            <Spinner key="Spinner" size={32} />,
          ]}
        />
      </div>}
    />
  );
}
