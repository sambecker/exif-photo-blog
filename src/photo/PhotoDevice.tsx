import { AiFillApple } from 'react-icons/ai';
import { cc } from '@/utility/css';

export default function PhotoDevice({
  make,
  model,
  hideApple,
}: {
  make?: string
  model?: string
  hideApple?: boolean
}) {
  return (
    <div className={cc(
      'inline-flex items-center self-start',
      'uppercase',
    )}>
      {!(hideApple && make === 'Apple') &&
      <>
        {make === 'Apple'
          ? <AiFillApple
            title="Apple"
            className="translate-y-[-0.5px]"
            size={14}
          />
          : make}
        &nbsp;
      </>}
      {model}
    </div>
  );
}
