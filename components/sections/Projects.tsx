import { MotionReveal } from "@/components/effects/MotionReveal";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/lib/data";

const projectDelays = [90, 10, 180, 70];

export function Projects() {
  return (
    <section id="projects" className="section-spacing px-6">
      <div className="container-page">
        <SectionHeading
          label="Selected Work"
          title="Strong signals, fewer cards."
          description="A focused set of AI and software projects with clear engineering depth, measurable outcomes, and production-minded tradeoffs."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <MotionReveal
              key={project.id}
              className="h-full"
              delay={projectDelays[index % projectDelays.length]}
              variant={index % 2 === 0 ? "cluster-left" : "cluster-right"}
            >
              <ProjectCard project={project} />
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
