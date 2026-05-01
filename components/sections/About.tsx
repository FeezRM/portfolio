import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatCard } from "@/components/ui/StatCard";
import { stats } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="section-spacing px-6">
      <div className="container-page">
        <SectionHeading
          label="Profile"
          title="AI engineer who can also ship the product."
          description="Recruiter-friendly signal first: strong academics, shipped systems, and practical AI work that has been measured against real outcomes."
        />

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
          <div className="glass-panel rounded-3xl p-7 md:p-10">
            <div className="space-y-5 text-base leading-8 text-muted">
              <p>
                CS Honours Co-op student at Ontario Tech focused on AI engineering,
                building practical systems that move real metrics: 50% less distraction,
                sub-2.3s latency, and 80% less manual cleanup.
              </p>
              <p>
                I work across ML and product engineering, from agentic pipelines and
                real-time computer vision to full-stack client products. Exploring AI
                engineering and software roles starting July 2026.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
