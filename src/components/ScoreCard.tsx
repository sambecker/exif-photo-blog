import { ReactNode } from 'react';

export default function ScoreCard({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <div className="component-surface shadow-xs divide-y divide-main">
      {children}
    </div>
  );
}
