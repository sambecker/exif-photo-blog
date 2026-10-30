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
        d="M21.7652 11.1034C21.7652 14.568 18.9566 17.3766 15.492 17.3766C12.0274 17.3766 9.2188 14.568 9.2188 11.1034C9.2188 7.63885 12.0274 4.83025 15.492 4.83025C18.9566 4.83025 21.7652 7.63885 21.7652 11.1034Z"
        strokeWidth="1.5"
        stroke="currentColor"
      />
      <path
        d="M20.688 15.2388L20.1577 14.7085L19.097 15.7692L19.6274 16.2995L20.1577 15.7692L20.688 15.2388ZM23.4582 20.1303C23.7511 20.4232 24.2259 20.4232 24.5188 20.1303C24.8117 19.8374 24.8117 19.3626 24.5188 19.0697L23.9885 19.6L23.4582 20.1303ZM20.1577 15.7692L19.6274 16.2995L23.4582 20.1303L23.9885 19.6L24.5188 19.0697L20.688 15.2388L20.1577 15.7692Z"
        fill="currentColor"
      />
    </svg>
  );
}
