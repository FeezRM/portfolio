import type { StealthProject } from "@/lib/types";

export function StealthCard({ project }: { project: StealthProject }) {
  return (
    <article className="stealth-card glass-panel group relative overflow-hidden rounded-3xl p-6 transition duration-200 hover:-translate-y-1 hover:border-green/30 hover:shadow-[0_0_38px_rgba(74,222,128,0.1)] md:p-7 lg:col-span-4">
      <div className="scan-line" aria-hidden="true" />

      <div className="mb-7 flex items-center justify-between gap-4">
        <p className="rounded-full border border-green/20 bg-green/[0.045] px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-green">
          Currently Building
        </p>
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">Stealth</span>
      </div>

      <div className="stealth-mark" aria-hidden="true">
        ?
        <div className="mosaic-name">
          {project.mosaicCells.map((cell, index) => (
            <span key={`${cell}-${index}`} className={cell ? "mosaic-letter" : "mosaic-block"}>
              {cell}
            </span>
          ))}
        </div>
      </div>

      <p className="sr-only">The private startup name is intentionally hidden.</p>
      <h3 className="mt-7 font-display text-2xl font-semibold leading-tight text-primary">
        {project.title}
      </h3>
      <p className="mt-3 text-base font-medium leading-7 text-slate-300">{project.summary}</p>
      <p className="mt-4 text-sm leading-7 text-muted">{project.description}</p>

      <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-slate-300">
        {project.impact}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
