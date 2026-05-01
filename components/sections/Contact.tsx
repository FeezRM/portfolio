import { GlowButton } from "@/components/ui/GlowButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { socialLinks } from "@/lib/data";

export function Contact() {
  return (
    <section id="contact" className="px-6 py-24 md:py-32">
      <div className="container-page">
        <div className="glass-panel relative overflow-hidden rounded-[2rem] p-8 text-center md:p-14">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" aria-hidden="true" />
          <SectionHeading
            label="Contact"
            title="Have an idea, role, or project?"
            description="Let's build something useful. Recruiters, collaborators, and customers can reach me directly by email."
          />

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <GlowButton href="mailto:faiz.kera@gmail.com">Email Me</GlowButton>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {socialLinks.map((link) => {
              const isExternal = link.href.startsWith("http");

              return (
                <a
                  key={link.label}
                  className="quiet-link"
                  href={link.href}
                  rel={isExternal ? "noreferrer" : undefined}
                  target={isExternal ? "_blank" : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
