/* eslint-disable max-len */

const INTRINSIC_WIDTH = 28;
const INTRINSIC_HEIGHT = 24;

export default function IconFullFrame({
  width = INTRINSIC_WIDTH,
  includeTitle = true,
}: {
  width?: number
  includeTitle?: boolean
}) {
  return (
    <svg
      width={width}
      height={INTRINSIC_HEIGHT * width / INTRINSIC_WIDTH}
      viewBox="0 0 28 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {includeTitle && <title>Full Frame</title>}
      <rect x="5.625" y="6.625" width="16.75" height="10.75" rx="1" strokeWidth="1.25"/>
      <line x1="5" y1="3.875" x2="23" y2="3.875" strokeWidth="1.25"/>
      <line x1="23" y1="20.125" x2="5" y2="20.125" strokeWidth="1.25"/>
    </svg>
  );
};
