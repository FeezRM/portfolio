import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillPill } from "@/components/ui/SkillPill";
import { skillGroups } from "@/lib/data";
import type { Accent } from "@/lib/types";

const dotClassNames: Record<Accent, string> = {
  cyan: "bg-cyan shadow-[0_0_18px_rgba(34,211,238,0.45)]",
  sky: "bg-sky shadow-[0_0_18px_rgba(56,189,248,0.45)]",
  green: "bg-green shadow-[0_0_18px_rgba(74,222,128,0.42)]",
  violet: "bg-violet-300 shadow-[0_0_18px_rgba(196,181,253,0.42)]"
};

export function Skills() {
  return (
    <section id="skills" className="section-spacing px-6">
      <div className="container-page">
        <SectionHeading
          label="Stack"
          title="Comfortable from model pipeline to product UI."
          description="The tools I reach for when I need an AI system to be testable, maintainable, and useful to people outside the codebase."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((group) => (
            <article key={group.label} className="glass-panel rounded-3xl p-6 md:p-7">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-primary">{group.label}</h3>
                <span className={`h-2 w-2 rounded-full ${dotClassNames[group.color]}`} aria-hidden="true" />
              </div>
              <div className="flex flex-wrap gap-2.5">
                {group.skills.map((skill) => (
                  <SkillPill key={skill} skill={skill} color={group.color} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
