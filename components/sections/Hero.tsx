import { DecryptText } from "@/components/effects/DecryptText";
import { MotionReveal } from "@/components/effects/MotionReveal";
import { RadialPulse } from "@/components/effects/RadialPulse";
import { GlowButton } from "@/components/ui/GlowButton";
import { StatusPill } from "@/components/ui/StatusPill";
import { socialLinks } from "@/lib/data";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-6 pb-20 pt-36 md:pb-24 md:pt-44">
      <RadialPulse />
      <div className="hero-neural-field" aria-hidden="true" />

      <div className="container-page relative z-10">
        <div className="max-w-3xl">
          <MotionReveal as="div" variant="scale-in" delay={120}>
            <StatusPill>something big cooking rn...</StatusPill>
          </MotionReveal>

          <MotionReveal
            as="h1"
            className="mt-8 font-display text-5xl font-semibold leading-[0.98] text-primary sm:text-6xl md:text-7xl"
            variant="clip-scan"
            delay={260}
          >
            <DecryptText
              delay={340}
              highlight="AI-powered"
              text={"Hi, I'm Faiz.\nI build AI-powered software."}
            />
          </MotionReveal>

          <MotionReveal
            as="p"
            className="mt-7 max-w-2xl text-lg leading-8 text-muted md:text-xl md:leading-9"
            delay={1180}
          >
            I&apos;m focused on building cool shit that actually does shit.
          </MotionReveal>

          <MotionReveal as="div" className="mt-9 flex flex-col gap-3 sm:flex-row" delay={1350}>
            <GlowButton href="#stealth">View Work</GlowButton>
            <GlowButton href="mailto:faiz.kera@gmail.com" variant="ghost">
              Contact Me
            </GlowButton>
          </MotionReveal>

          <div className="mt-8 flex flex-wrap gap-3">
            {socialLinks.map((link, index) => {
              const isExternal = link.href.startsWith("http");

              return (
                <MotionReveal
                  key={link.label}
                  as="span"
                  delay={1510 + index * 80}
                  variant="scale-in"
                >
                  <a
                    className="quiet-link"
                    href={link.href}
                    rel={isExternal ? "noreferrer" : undefined}
                    target={isExternal ? "_blank" : undefined}
                  >
                    {link.label}
                  </a>
                </MotionReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
