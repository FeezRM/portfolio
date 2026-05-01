import { MotionReveal } from "@/components/effects/MotionReveal";
import { socialLinks } from "@/lib/data";

export function Footer() {
  return (
    <MotionReveal as="footer" className="border-t border-white/10 px-6 py-10" variant="fade-up">
      <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-primary">Faiz Kerawala</p>
          <p className="mt-2 text-sm text-muted">AI Engineer and Software Engineer</p>
        </div>

        <div className="flex flex-wrap gap-3">
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
    </MotionReveal>
  );
}
