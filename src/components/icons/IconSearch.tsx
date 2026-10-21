/* eslint-disable @stylistic/max-len */

const INTRINSIC_WIDTH = 32;
const INTRINSIC_HEIGHT = 24;

export default function IconSearch({
  width = INTRINSIC_WIDTH,
}: {
  width?: number
}) {
  return (
    <svg
      width={width}
      height={INTRINSIC_HEIGHT * width / INTRINSIC_WIDTH}
      viewBox="0 0 32 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.8539 11.6154C20.8539 14.8463 18.2348 17.4654 15.0039 17.4654C11.7731 17.4654 9.15393 14.8463 9.15393 11.6154C9.15393 8.38452 11.7731 5.76539 15.0039 5.76539C18.2348 5.76539 20.8539 8.38452 20.8539 11.6154Z"
        strokeWidth="1.5"
        stroke="currentColor"
      />
      <path
        d="M19.9189 15.4697L19.3885 14.9393L18.3279 16L18.8582 16.5303L19.3885 16L19.9189 15.4697ZM22.4582 20.1303C22.7511 20.4232 23.226 20.4232 23.5189 20.1303C23.8118 19.8374 23.8118 19.3626 23.5189 19.0697L22.9885 19.6L22.4582 20.1303ZM19.3885 16L18.8582 16.5303L22.4582 20.1303L22.9885 19.6L23.5189 19.0697L19.9189 15.4697L19.3885 16Z"
        fill="currentColor"
      />
    </svg>
  );
}
