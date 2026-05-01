import type { Project } from "@/lib/types";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <article
      className={`glass-panel group flex min-h-full flex-col rounded-3xl p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan/30 hover:shadow-glow md:p-7 ${
        featured ? "lg:col-span-6" : "lg:col-span-4"
      }`}
    >
      <div className="mb-7 flex items-center justify-between gap-4">
        <p className="rounded-full border border-cyan/20 bg-cyan/[0.04] px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-cyan">
          {project.category}
        </p>
      </div>

      <div className="flex-1">
        <h3 className="font-display text-2xl font-semibold leading-tight text-primary">
          {project.title}
        </h3>
        <p className="mt-3 text-base font-medium leading-7 text-slate-300">{project.summary}</p>
        <p className="mt-4 text-sm leading-7 text-muted">{project.description}</p>
      </div>

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

      {(project.githubUrl || project.liveUrl) ? (
        <div className="mt-7 flex flex-wrap gap-3">
          {project.githubUrl ? (
            <a className="quiet-link" href={project.githubUrl} rel="noreferrer" target="_blank">
              GitHub
            </a>
          ) : null}
          {project.liveUrl ? (
            <a className="quiet-link" href={project.liveUrl} rel="noreferrer" target="_blank">
              Live
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
