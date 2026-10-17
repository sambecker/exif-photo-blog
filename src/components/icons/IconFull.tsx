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
      <rect
        x="5.625"
        y="6.625"
        width="16.75"
        height="10.75"
        rx="2.375"
        strokeWidth="1.25"
      />
    </svg>
  );
};
