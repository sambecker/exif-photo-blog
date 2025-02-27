import Container from '@/components/Container';
import LoaderButton from '@/components/primitives/LoaderButton';
import SiteGrid from '@/components/SiteGrid';
import Spinner from '@/components/Spinner';
import clsx from 'clsx';
import { IoCloseSharp } from 'react-icons/io5';

export default function AdminUploadPanel() {
  return (
    <SiteGrid contentMain={
      <Container
        color="gray"
        padding="tight"
        className="p-2! pl-4! text-main!"
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
          <LoaderButton 
            icon={<IoCloseSharp
              size={18}
              className="translate-y-[0.5px]"
            />}
          />
        </div>
      </Container>}
    />
  );
}
