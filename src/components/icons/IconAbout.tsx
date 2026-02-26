/* eslint-disable max-len */

const INTRINSIC_WIDTH = 28;
const INTRINSIC_HEIGHT = 24;

export default function IconAbout({
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
      <path d="M14 12.75C14.5967 12.75 15.169 12.5129 15.591 12.091C16.0129 11.669 16.25 11.0967 16.25 10.5C16.25 9.90326 16.0129 9.33097 15.591 8.90901C15.169 8.48705 14.5967 8.25 14 8.25C13.4033 8.25 12.831 8.48705 12.409 8.90901C11.9871 9.33097 11.75 9.90326 11.75 10.5C11.75 11.0967 11.9871 11.669 12.409 12.091C12.831 12.5129 13.4033 12.75 14 12.75Z" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 5.25C19.4 5.25 20.75 6.6 20.75 12C20.75 17.4 19.4 18.75 14 18.75C8.6 18.75 7.25 17.4 7.25 12C7.25 6.6 8.6 5.25 14 5.25Z" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.5 18.0375V18C9.5 17.2043 9.81607 16.4413 10.3787 15.8787C10.9413 15.3161 11.7044 15 12.5 15H15.5C16.2956 15 17.0587 15.3161 17.6213 15.8787C18.1839 16.4413 18.5 17.2043 18.5 18V18.0375" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};
