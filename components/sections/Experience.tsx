import { SectionHeading } from "@/components/ui/SectionHeading";
import { TimelineItem } from "@/components/ui/TimelineItem";
import { experience } from "@/lib/data";

export function ExperienceSection() {
  return (
    <section id="experience" className="section-spacing px-6">
      <div className="container-page">
        <SectionHeading
          label="Experience"
          title="Internship, freelance, and academic momentum."
          description="Practical product experience, client delivery, and an AI-focused CS foundation."
        />

        <div className="mx-auto max-w-5xl">
          {experience.map((item, index) => (
            <TimelineItem key={item.id} item={item} isLast={index === experience.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
