/* eslint-disable max-len */

import clsx from 'clsx/lite';

export default function IconNext({
  className,
}: {
  className?: string
}) {
  return (
    <span className={clsx(
      'text-main dark:text-black',
      'border border-transparent dark:border-white/40 rounded-full',
      className,
    )}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="1em" height="1em">
        <mask height="180" id=":r8:mask0_408_134" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
          <circle cx="90" cy="90" fill="black" r="90"></circle>
        </mask>
        <g mask="url(#:r8:mask0_408_134)">
          <circle cx="90" cy="90" data-circle="true" fill="currentColor" r="90"></circle>
          <path
            d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
            fill="url(#:r8:paint0_linear_408_134)">
          </path>
          <rect fill="url(#:r8:paint1_linear_408_134)" height="72" width="12" x="115" y="54"></rect>
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id=":r8:paint0_linear_408_134" x1="109"
            x2="144.5" y1="116.5" y2="160.5">
            <stop stopColor="white"></stop>
            <stop offset="1" stopColor="white" stopOpacity="0"></stop>
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id=":r8:paint1_linear_408_134" x1="121"
            x2="120.799" y1="54" y2="106.875">
            <stop stopColor="white"></stop>
            <stop offset="1" stopColor="white" stopOpacity="0"></stop>
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}
