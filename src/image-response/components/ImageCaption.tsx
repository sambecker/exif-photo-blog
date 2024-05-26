import { OG_TEXT_BOTTOM_ALIGNMENT } from '@/site/config';
import { ReactNode } from 'react';

const GRADIENT_STOPS = 'rgba(0,0,0,0), rgba(0,0,0,0.3), rgba(0,0,0,0.7)';

export default function ImageCaption({
  height,
  fontFamily,
  icon,
  children,
}: {
  width: number
  height: number
  fontFamily: string
  icon?: ReactNode
  children: ReactNode
}) {
  const paddingEdge = height * .07;
  const paddingContent = height * .6;
  return (
    <div style={{
      display: 'flex',
      position: 'absolute',
      paddingLeft: height * .0875,
      paddingRight: height * .0875,
      color: 'white',
      backgroundBlendMode: 'multiply',
      fontFamily,
      fontSize: height *.08,
      gap: '1rem', // Mimic mono font space metric
      lineHeight: 1,
      left: 0,
      right: 0,
      ...OG_TEXT_BOTTOM_ALIGNMENT
        ? {
          paddingTop: paddingContent,
          paddingBottom: paddingEdge,
          background: `linear-gradient(to bottom, ${GRADIENT_STOPS})`,
          bottom: 0,
        }
        : {
          paddingTop: paddingEdge,
          paddingBottom: paddingContent,
          background: `linear-gradient(to top, ${GRADIENT_STOPS})`,
          top: 0,
        },
    }}>
      {icon}
      <div
        style={{
          display: 'flex',
          gap: height * .048,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </div>
    </div>
  );
}
