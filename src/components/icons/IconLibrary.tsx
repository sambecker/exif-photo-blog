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
        d="M6.75 10.125H20.875M19.7031 17.1563H7.92188C7.61107 17.1563 7.313 17.0328 7.09323 16.813C6.87347 16.5933 6.75 16.2952 6.75 15.9844V8.01564C6.75 7.70484 6.87347 7.40677 7.09323 7.187C7.313 6.96723 7.61107 6.84377 7.92188 6.84377H10.1452C10.3766 6.84377 10.6028 6.91227 10.7953 7.04064L11.6109 7.58439C11.8034 7.71276 12.0297 7.78126 12.261 7.78127H19.7031C20.0139 7.78127 20.312 7.90473 20.5318 8.1245C20.7515 8.34427 20.875 8.64234 20.875 8.95314V15.9844C20.875 16.2952 20.7515 16.5933 20.5318 16.813C20.312 17.0328 20.0139 17.1563 19.7031 17.1563Z"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
