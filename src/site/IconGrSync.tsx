export default function IconGrSync({
  className,
}: {
  className?: string
}) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      className={className}
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="15"
      width="15"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        // eslint-disable-next-line max-len
        d="M5,19 L16,19 C19.866,19 23,15.866 23,12 L23,9 M8,15 L4,19 L8,23 M19,5 L8,5 C4.134,5 1,8.134 1,12 L1,15 M16,1 L20,5 L16,9"
      ></path>
    </svg>
  );
}
