import Container from '@/components/Container';
import SiteGrid from '@/components/SiteGrid';
import Spinner from '@/components/Spinner';
import clsx from 'clsx';
import { IoCloseSharp } from 'react-icons/io5';

export default function AdminUploadPanel() {
  return (
    <SiteGrid contentMain={
      <Container
        padding="tight"
        className="px-4 py-4"
      >
        <div className="flex w-full">
          <div className={clsx(
            'flex items-center gap-4',
            'grow',
          )}>
            <Spinner
              className="text-dim translate-y-[1px]"
              color="text"
              size={14}
            />
            1 of 4: Uploading DSC-4353.jpg
          </div>
          <IoCloseSharp
            size={19}
            className="translate-y-[0.5px]"
          />
        </div>
      </Container>}
    />
  );
}
