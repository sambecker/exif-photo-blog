/* eslint-disable max-len */

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
      <g clipPath="url(#libraryClip)">
        <path
          d="M7.4375 10.125H20.5625M19.3906 17.1563H8.60938C8.29857 17.1563 8.0005 17.0328 7.78073 16.813C7.56097 16.5933 7.4375 16.2952 7.4375 15.9844V8.01564C7.4375 7.70484 7.56097 7.40676 7.78073 7.187C8.0005 6.96723 8.29857 6.84376 8.60938 6.84376H10.8327C11.0641 6.84377 11.2903 6.91227 11.4828 7.04064L12.2984 7.58439C12.4909 7.71275 12.7172 7.78126 12.9485 7.78126H19.3906C19.7014 7.78126 19.9995 7.90473 20.2193 8.1245C20.439 8.34426 20.5625 8.64234 20.5625 8.95314V15.9844C20.5625 16.2952 20.439 16.5933 20.2193 16.813C19.9995 17.0328 19.7014 17.1563 19.3906 17.1563Z"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="libraryClip">
          <rect width="15" height="15" fill="white" transform="translate(6.5 4.5)"/>
        </clipPath>
      </defs>
    </svg>
  );
};
