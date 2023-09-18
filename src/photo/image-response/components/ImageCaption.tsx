export default function ImageCaption({
  height,
  children,
  fontFamily,
}: {
  width: number
  height: number
  fontFamily: string
  children: React.ReactNode
}) {
  return (
    <div style={{
      display: 'flex',
      gap: height * .053,
      position: 'absolute',
      paddingTop: height * .6,
      paddingBottom: height * .075,
      paddingLeft: height * .0875,
      paddingRight: height * .0875,
      color: 'white',
      background:
        'linear-gradient(to bottom, ' +
        'rgba(0,0,0,0), rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
      backgroundBlendMode: 'multiply',
      fontFamily,
      fontSize: height *.089,
      lineHeight: 1,
      bottom: 0,
      left: 0,
      right: 0,
    }}>
      {children}
    </div>
  );
}
