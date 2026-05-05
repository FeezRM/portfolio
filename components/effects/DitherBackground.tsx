'use client';

import dynamic from 'next/dynamic';

const Dither = dynamic(() => import('./Dither'), { ssr: false });

export function DitherBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <Dither
        waveColor={[0.28, 0.42, 0.36]}
        waveSpeed={0.08}
        waveFrequency={2.5}
        waveAmplitude={0.32}
        colorNum={4}
        pixelSize={3}
        disableAnimation={false}
        enableMouseInteraction={true}
        mouseRadius={0.35}
      />
    </div>
  );
}
