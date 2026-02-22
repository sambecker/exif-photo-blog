/* eslint-disable max-len */

const INTRINSIC_WIDTH = 28;
const INTRINSIC_HEIGHT = 24;

export default function IconFull({
  width = INTRINSIC_WIDTH,
  className,
}: {
  width?: number
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
      <path d="M8 7.625H20C20.7594 7.625 21.375 8.24061 21.375 9V15C21.375 15.7594 20.7594 16.375 20 16.375H8C7.24061 16.375 6.625 15.7594 6.625 15V9C6.625 8.24061 7.24061 7.625 8 7.625Z" strokeWidth="1.25"/>
      <path d="M6 5.38H22" strokeWidth="1.25"/>
      <path d="M22 18.62L6 18.62" strokeWidth="1.25"/>
    </svg>
  );
};
