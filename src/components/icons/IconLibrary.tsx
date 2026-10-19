/* eslint-disable @stylistic/max-len */

const INTRINSIC_WIDTH = 28;
const INTRINSIC_HEIGHT = 24;

export default function IconLibrary({
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
      <path
        d="M7 10.7117H21.6504M20.269 17H8.38139C8.01502 17 7.66366 16.8545 7.4046 16.5954C7.14554 16.3363 7 15.985 7 15.6186V8.22516C7 7.85879 7.14554 7.50743 7.4046 7.24837C7.66366 6.9893 8.01502 6.84377 8.38139 6.84377H11.0022C11.275 6.84377 11.5416 6.92452 11.7686 7.07584L12.73 7.7168C12.9569 7.86812 13.2236 7.94887 13.4963 7.94888H20.269C20.6353 7.94888 20.9867 8.09442 21.2458 8.35348C21.5048 8.61254 21.6504 8.9639 21.6504 9.33027V15.6186C21.6504 15.985 21.5048 16.3363 21.2458 16.5954C20.9867 16.8545 20.6353 17 20.269 17Z"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
