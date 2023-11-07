/* eslint-disable max-len */

const INTRINSIC_WIDTH = 28;
const INTRINSIC_HEIGHT = 24;

export default function IconSets({
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
      {includeTitle && <title>Photo Sets</title>}
      <path d="M18.5 16.375L9.75 16.375" strokeWidth="1.25"/>
      <path d="M22.25 12.125L9.75 12.125" strokeWidth="1.25"/>
      <path d="M20.5 7.875L9.75 7.875" strokeWidth="1.25"/>
      <path d="M7.25 16.375L6.25 16.375" strokeWidth="1.25" strokeLinecap="round"/>
      <path d="M7.25 12.125L6.25 12.125" strokeWidth="1.25" strokeLinecap="round"/>
      <path d="M7.25 7.875L6.25 7.875" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  );
};
