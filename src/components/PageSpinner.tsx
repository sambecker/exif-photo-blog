import { clsx } from 'clsx/lite';
import Spinner from './Spinner';
import AppGrid from './AppGrid';

export default function PageSpinner() {
  return (
    <AppGrid contentMain={
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