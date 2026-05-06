'use client';

import { useState } from 'react';
import { MotionReveal } from "@/components/effects/MotionReveal";
import { stealthProject } from "@/lib/data";
import LetterGlitch from "@/components/effects/LetterGlitch";

const stealthTitle = "startup launching soon...";

export function StealthStartup() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      id="stealth"
      aria-labelledby="stealth-title"
      className="stealth-section px-4 py-20 sm:px-6 md:py-24"
    >
      <div className="container-page relative z-10">
        <div className="stealth-command mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
          <MotionReveal variant="clip-scan" delay={120}>
            <h2
              id="stealth-title"
              aria-label={stealthTitle}
              className="font-display text-4xl font-semibold leading-[0.98] text-primary sm:text-5xl md:text-6xl"
            >
              <span aria-hidden="true" className="stealth-title-effect" data-text={stealthTitle}>
                {stealthTitle}
              </span>
            </h2>
          </MotionReveal>

          <MotionReveal className="stealth-vault-reveal w-full" delay={220} variant="scale-in">
            <div
              className="stealth-vault"
              tabIndex={0}
              aria-label="Launching soon preview."
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onFocus={() => setIsHovered(true)}
              onBlur={() => setIsHovered(false)}
            >
              <div className="stealth-vault-mark" aria-hidden="true">
                <div className="stealth-glitch-bg" style={{ opacity: isHovered ? 0.55 : 0.18 }}>
                  <LetterGlitch
                    glitchColors={['#0a1628', '#22d3ee', '#4ade80']}
                    glitchSpeed={60}
                    centerVignette={false}
                    outerVignette={false}
                    smooth={true}
                    characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789"
                    className="relative w-full h-full"
                  />
                </div>
                <span className="stealth-question">{isHovered ? '' : '?'}</span>
                {!isHovered && (
                  <div className="stealth-vault-mosaic">
                    {stealthProject.mosaicCells.map((cell, index) => (
                      <span
                        key={`${cell}-${index}`}
                        className={cell ? "stealth-vault-letter" : "stealth-vault-block"}
                      >
                        {cell}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
