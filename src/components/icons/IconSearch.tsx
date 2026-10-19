/* eslint-disable @stylistic/max-len */

const INTRINSIC_WIDTH = 28;
const INTRINSIC_HEIGHT = 24;

export default function IconSearch({
  width = INTRINSIC_WIDTH,
}: {
  width?: number;
}) {
  return (
    <svg
      width={width}
      height={(INTRINSIC_HEIGHT * width) / INTRINSIC_WIDTH}
      viewBox="0 0 28 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="13.3462"
        cy="11.3462"
        r="4.875"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M17.4419 14.5581L17 14.1161L16.1161 15L16.5581 15.4419L17 15L17.4419 14.5581ZM19.5581 18.4419C19.8021 18.686 20.1979 18.686 20.4419 18.4419C20.686 18.1979 20.686 17.8021 20.4419 17.5581L20 18L19.5581 18.4419ZM17 15L16.5581 15.4419L19.5581 18.4419L20 18L20.4419 17.5581L17.4419 14.5581L17 15Z"
        fill="currentColor"
      />
    </svg>
  );
}
