/* eslint-disable max-len */

const INTRINSIC_WIDTH = 28;
const INTRINSIC_HEIGHT = 24;

export default function IconSearch({
  width = INTRINSIC_WIDTH,
  includeTitle = true,
}: {
  width?: number;
  includeTitle?: boolean;
}) {
  return (
    <svg
      width={width}
      height={(INTRINSIC_HEIGHT * width) / INTRINSIC_WIDTH}
      viewBox="0 0 28 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {includeTitle && <title>Search ⌘K</title>}
      <circle cx="13.5" cy="11.5" r="4.875" strokeWidth="1.5" />
      <path d="M17 15L21 19" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
