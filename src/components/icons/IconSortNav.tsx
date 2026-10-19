/* eslint-disable @stylistic/max-len */

import clsx from 'clsx/lite';

const INTRINSIC_WIDTH = 28;
const INTRINSIC_HEIGHT = 24;

const CHROMATIC_DOT_OFFSET = 2;
const CHROMATIC_DOT_SIZE = 8;
const CHROMATIC_CLEAR_RING = 3;
const CHROMATIC_DOT_CENTER =
  CHROMATIC_DOT_OFFSET + CHROMATIC_DOT_SIZE / 2;
const CHROMATIC_MASK_RADIUS =
  CHROMATIC_DOT_SIZE / 2 + CHROMATIC_CLEAR_RING;
const CHROMATIC_ICON_MASK =
  `radial-gradient(circle ${CHROMATIC_MASK_RADIUS}px at ${CHROMATIC_DOT_CENTER}px ${CHROMATIC_DOT_CENTER}px, transparent 99%, #000 100%)`;

export default function IconSortNav({
  sort = 'desc',
  width = INTRINSIC_WIDTH,
  className,
  chromatic,
}: {
  sort?: 'desc' | 'asc'
  width?: number
  className?: string
  chromatic?: boolean
}) {
  return (
    <span className="relative inline-flex">
      <svg
        width={width}
        height={INTRINSIC_HEIGHT * width / INTRINSIC_WIDTH}
        viewBox="0 0 28 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx('shrink-0', className)}
        style={chromatic
          ? {
            maskImage: CHROMATIC_ICON_MASK,
            WebkitMaskImage: CHROMATIC_ICON_MASK,
          }
          : undefined}
      >
        <path d="M20.5 7.375C20.8452 7.375 21.125 7.65482 21.125 8C21.125 8.34518 20.8452 8.625 20.5 8.625H7C6.65482 8.625 6.375 8.34518 6.375 8C6.375 7.65482 6.65482 7.375 7 7.375H20.5Z"/>
        <path d="M16.5 10.875C16.8452 10.875 17.125 11.1548 17.125 11.5C17.125 11.8452 16.8452 12.125 16.5 12.125H7C6.65482 12.125 6.375 11.8452 6.375 11.5C6.375 11.1548 6.65482 10.875 7 10.875H16.5Z"/>
        <path d="M13.5 14.375C13.8452 14.375 14.125 14.6548 14.125 15C14.125 15.3452 13.8452 15.625 13.5 15.625H7C6.65482 15.625 6.375 15.3452 6.375 15C6.375 14.6548 6.65482 14.375 7 14.375H13.5Z"/>
        {sort === 'asc'
          ? <path d="M19.75 19L19.75 13.9277L18.3027 15.5068C18.0228 15.8121 17.5485 15.8326 17.2432 15.5527C16.9379 15.2728 16.9174 14.7985 17.1973 14.4932L19.9473 11.4932L20.0029 11.4385C20.1394 11.3177 20.316 11.25 20.5 11.25C20.7102 11.25 20.9107 11.3382 21.0527 11.4932L23.8027 14.4932C24.0826 14.7985 24.0621 15.2728 23.7568 15.5527C23.4515 15.8326 22.9772 15.8121 22.6973 15.5068L21.25 13.9277L21.25 19C21.25 19.4142 20.9142 19.75 20.5 19.75C20.0858 19.75 19.75 19.4142 19.75 19Z"/>
          : <path d="M21.25 11.5L21.25 16.5723L22.6973 14.9932C22.9772 14.6879 23.4515 14.6674 23.7568 14.9473C24.0621 15.2272 24.0826 15.7015 23.8027 16.0068L21.0527 19.0068L20.9971 19.0615C20.8606 19.1823 20.684 19.25 20.5 19.25C20.2898 19.25 20.0893 19.1618 19.9473 19.0068L17.1973 16.0068C16.9174 15.7015 16.9379 15.2272 17.2432 14.9473C17.5485 14.6674 18.0228 14.6879 18.3027 14.9932L19.75 16.5723L19.75 11.5C19.75 11.0858 20.0858 10.75 20.5 10.75C20.9142 10.75 21.25 11.0858 21.25 11.5Z"/>}
      </svg>
      {chromatic &&
        <span
          aria-hidden
          className="absolute rounded-full bg-[conic-gradient(#f43f5e,#f59e0b,#eab308,#22c55e,#3b82f6,#a855f7,#f43f5e)]"
          style={{
            top: CHROMATIC_DOT_OFFSET,
            left: CHROMATIC_DOT_OFFSET,
            width: CHROMATIC_DOT_SIZE,
            height: CHROMATIC_DOT_SIZE,
          }}
        />}
    </span>
  );
}
