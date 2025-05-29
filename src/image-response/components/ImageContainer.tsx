import { ReactNode } from 'react';

export default function ImageContainer({
  solidBackground,
  children,
}: {
  solidBackground?: boolean
  children: ReactNode
}) {
  return (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: solidBackground ? 'black' : 'transparent',
    }}>
      {children}
    </div>
  );
}
