'use client';

import { MotionReveal } from "@/components/effects/MotionReveal";

const stealthTitle = "startup launching soon...";

export function StealthStartup() {
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
            >
              <div className="stealth-vault-mark" aria-hidden="true">
                <div className="stealth-glitch-bg" />
                <span className="stealth-question">?</span>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
