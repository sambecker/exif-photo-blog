import { clsx } from 'clsx/lite';
import Spinner from './Spinner';
import SiteGrid from './SiteGrid';

export default function PageSpinner() {
  return (
    <SiteGrid contentMain={
      <div className={clsx(
        'flex justify-center items-center',
        'w-full min-h-[20rem] sm:min-h-[30rem]',
      )}>
        <Spinner
          size={24}
          color="light-gray"
        />
      </div>
    } />
  );
}