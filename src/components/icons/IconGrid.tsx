/* eslint-disable max-len */

const INTRINSIC_WIDTH = 28;
const INTRINSIC_HEIGHT = 24;

export default function IconGrid({
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
      {includeTitle && <title>Grid</title>}
      <rect x="5.625" y="6.625" width="16.75" height="10.75" rx="1" strokeWidth="1.25"/>
      <line x1="11.375" y1="7" x2="11.375" y2="18" strokeWidth="1.25"/>
      <line x1="16.875" y1="7" x2="16.875" y2="18" strokeWidth="1.25"/>
      <line x1="5" y1="12.0417" x2="22.3333" y2="12.0417" strokeWidth="1.25"/>
    </svg>
  );
};
