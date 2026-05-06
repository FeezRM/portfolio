'use client';

import React from 'react';
import LogoLoop from "@/components/effects/LogoLoop";
import { MotionReveal } from "@/components/effects/MotionReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillGroups } from "@/lib/data";
import { techIconMap } from "@/lib/techIcons";
import type { Accent } from "@/lib/types";

const accentColors: Record<Accent, string> = {
  cyan:   '#22d3ee',
  sky:    '#38bdf8',
  green:  '#4ade80',
  violet: '#c4b5fd',
};

const dotClassNames: Record<Accent, string> = {
  cyan:   'bg-cyan shadow-[0_0_18px_rgba(34,211,238,0.45)]',
  sky:    'bg-sky shadow-[0_0_18px_rgba(56,189,248,0.45)]',
  green:  'bg-green shadow-[0_0_18px_rgba(74,222,128,0.42)]',
  violet: 'bg-violet-300 shadow-[0_0_18px_rgba(196,181,253,0.42)]',
};

const directions = ['left', 'right', 'left', 'right', 'left', 'right'] as const;
const speeds      = [52, 46, 58, 42, 62, 50];

export function Skills() {
  return (
    <section id="skills" className="section-spacing px-4 sm:px-6">
      <div className="container-page">
        <SectionHeading
          label="Stack"
          title="Comfortable from model pipeline to product UI."
          description="The tools I reach for when I need an AI system to be testable, maintainable, and useful to people outside the codebase."
        />

        <div className="space-y-3">
          {skillGroups.map((group, i) => {
            const color = accentColors[group.color];

            const logos = group.skills
              .filter(skill => techIconMap[skill])
              .map(skill => {
                const Icon = techIconMap[skill];
                return {
                  node: <Icon style={{ color }} />,
                  title: skill,
                };
              });

            return (
              <MotionReveal key={group.label} delay={i * 70} variant="scale-in">
                <div className="glass-panel rounded-2xl flex items-stretch overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-4 min-w-[108px] flex-shrink-0 border-r border-white/[0.06] sm:gap-3 sm:px-5 sm:min-w-[132px]">
                    <span
                      className={`h-2 w-2 rounded-full flex-shrink-0 ${dotClassNames[group.color]}`}
                      aria-hidden="true"
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400 whitespace-nowrap">
                      {group.label}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex items-center py-3">
                    <LogoLoop
                      logos={logos}
                      speed={speeds[i]}
                      direction={directions[i]}
                      logoHeight={26}
                      gap={30}
                      hoverSpeed={0}
                      fadeOut
                      fadeOutColor="#070b12"
                      ariaLabel={`${group.label} technologies`}
                    />
                  </div>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
