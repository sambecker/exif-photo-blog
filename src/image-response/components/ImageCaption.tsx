import { OG_TEXT_BOTTOM_ALIGNMENT } from '@/site/config';
import { ReactNode } from 'react';

const GRADIENT_STOPS = 'rgba(0,0,0,0), rgba(0,0,0,0.3), rgba(0,0,0,0.7)';

export default function ImageCaption({
  height,
  fontFamily,
  subhead,
  children,
}: {
  width: number
  height: number
  fontFamily: string
  subhead?: ReactNode
  children: ReactNode
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      paddingLeft: height * .0875,
      paddingRight: height * .0875,
      color: 'white',
      backgroundBlendMode: 'multiply',
      fontFamily,
      fontSize: height *.089,
      lineHeight: 1,
      left: 0,
      right: 0,
      ...OG_TEXT_BOTTOM_ALIGNMENT
        ? {
          paddingTop: height * .6,
          paddingBottom: height * .075,
          background: `linear-gradient(to bottom, ${GRADIENT_STOPS})`,
          bottom: 0,
        }
        : {
          paddingTop: height * .075,
          paddingBottom: height * .6,
          background: `linear-gradient(to top, ${GRADIENT_STOPS})`,
          top: 0,
        },
    }}>
      {subhead &&
        <div
          style={{
            display: 'flex',
            gap: height * .053,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {subhead}
        </div>}
      <div
        style={{
          display: 'flex',
          gap: height * .053,
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
