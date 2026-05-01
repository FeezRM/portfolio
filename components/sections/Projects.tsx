import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/lib/data";

export function Projects() {
  return (
    <section id="projects" className="section-spacing px-6">
      <div className="container-page">
        <SectionHeading
          label="Selected Work"
          title="Strong signals, fewer cards."
          description="A focused set of AI and software projects with clear engineering depth, measurable outcomes, and production-minded tradeoffs."
        />

        <div className="grid gap-4 lg:grid-cols-12">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} featured={index < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
