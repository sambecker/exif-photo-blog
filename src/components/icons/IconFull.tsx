/* eslint-disable max-len */

const INTRINSIC_WIDTH = 28;
const INTRINSIC_HEIGHT = 24;

export default function IconFull({
  width = INTRINSIC_WIDTH,
  includeTitle = true,
  className,
}: {
  width?: number
  includeTitle?: boolean
  className?: string
}) {
  return (
    <svg
      width={width}
      height={INTRINSIC_HEIGHT * width / INTRINSIC_WIDTH}
      viewBox="0 0 28 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {includeTitle && <title>Full Frame</title>}
      <path d="M6.83301 7.125H21.167C21.5579 7.12518 21.8748 7.44206 21.875 7.83301V16.167C21.8748 16.5579 21.5579 16.8748 21.167 16.875H6.83301C6.44206 16.8748 6.12518 16.5579 6.125 16.167V7.83301C6.12518 7.44206 6.44206 7.12518 6.83301 7.125Z" strokeWidth="1.25"/>
      <path d="M5.5 4.875H22.5" strokeWidth="1.25"/>
      <path d="M22.5 19.125L5.5 19.125" strokeWidth="1.25"/>
    </svg>
  );
};
