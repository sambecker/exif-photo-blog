import clsx from 'clsx/lite';
import ColorDot from './ColorDot';
import { PhotoColorData } from './client';

export default function PhotoColors({
  className,
  classNameDot,
  colorData,
}: {
  className?: string
  classNameDot?: string
  colorData?: PhotoColorData
}) {
  return colorData
    ? <div className={clsx(
      'flex gap-2.5 flex-wrap justify-start items-center',
      className,
    )}>
      {colorData.ai &&
        <ColorDot
          title="AI"
          className={classNameDot}
          color={colorData.ai}
        />}
      <div className="flex gap-1">
        <ColorDot
          title="Average"
          className={classNameDot}
          color={colorData.average}
        />
        {colorData.colors.map((color, index) =>
          <ColorDot
            key={index}
            title={`Color ${index + 1}`}
            className={classNameDot}
            color={color}
          />,
        )}
      </div>
    </div>
    : null;
}
