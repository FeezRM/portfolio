import { MotionReveal } from "@/components/effects/MotionReveal";
import type { Experience } from "@/lib/types";

export function TimelineItem({
  item,
  index = 0,
  isLast
}: {
  item: Experience;
  index?: number;
  isLast?: boolean;
}) {
  return (
    <MotionReveal
      as="article"
      className="timeline-item relative grid gap-6 pb-10 pl-9 md:grid-cols-[0.8fr_1.2fr] md:gap-10 md:pl-12"
      delay={index * 120}
      variant="timeline-draw"
    >
      <span className="timeline-dot absolute left-0 top-2 h-3 w-3 rounded-full border border-cyan/70 bg-bg shadow-[0_0_0_6px_rgba(34,211,238,0.08)]" />
      {!isLast ? (
        <span className="timeline-line absolute bottom-0 left-[5px] top-7 w-px bg-gradient-to-b from-cyan/30 to-white/5" />
      ) : null}

      <div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan">{item.period}</p>
        <h3 className="mt-3 font-display text-xl font-semibold text-primary">{item.company}</h3>
        <p className="mt-2 text-sm text-muted">{item.location}</p>
      </div>

      <div className="timeline-panel glass-panel rounded-2xl p-6">
        <p className="font-medium text-primary">{item.role}</p>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
          {item.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-muted">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </MotionReveal>
  );
}
