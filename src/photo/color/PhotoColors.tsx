import clsx from 'clsx/lite';
import ColorDot from './ColorDot';
import { PhotoColorData } from '.';

export default function PhotoColors({
  className,
  classNameDot,
  colorData,
  separateAverage = true,
}: {
  className?: string
  classNameDot?: string
  colorData?: PhotoColorData
  separateAverage?: boolean
}) {
  return colorData
    ? <div className={clsx(
      'inline-flex gap-x-1 flex-wrap',
      className,
    )}>
      {colorData.ai &&
        <div className={clsx(separateAverage && 'mr-2')}>
          <ColorDot
            title="AI"
            className={classNameDot}
            color={colorData.ai}
          />
        </div>}
      <div className={clsx(separateAverage && 'mr-2')}>
        <ColorDot
          title="Average"
          className={classNameDot}
          color={colorData.average}
        />
      </div>
      {colorData.colors.map((color, index) =>
        <ColorDot
          key={index}
          title={`Color ${index + 1}`}
          className={classNameDot}
          color={color}
        />,
      )}
    </div>
    : null;
}
