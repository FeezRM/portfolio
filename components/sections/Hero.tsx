import { RadialPulse } from "@/components/effects/RadialPulse";
import { GlowButton } from "@/components/ui/GlowButton";
import { StatusPill } from "@/components/ui/StatusPill";
import { socialLinks } from "@/lib/data";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-6 pb-20 pt-36 md:pb-24 md:pt-44">
      <RadialPulse />

      <div className="container-page relative z-10">
        <div className="max-w-3xl">
          <StatusPill>something big cooking rn...</StatusPill>

          <h1 className="mt-8 font-display text-5xl font-semibold leading-[0.98] text-primary sm:text-6xl md:text-7xl">
            Hi, I&apos;m Faiz.
            <span className="block">I build <span className="gradient-text whitespace-nowrap">AI-powered</span> software.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted md:text-xl md:leading-9">
            I build AI systems that work in the real world: computer vision pipelines,
            agentic workflows, and full-stack products with measurable impact.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <GlowButton href="#stealth">View Work</GlowButton>
            <GlowButton href="mailto:faiz.kera@gmail.com" variant="ghost">
              Contact Me
            </GlowButton>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
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

        <div className="mx-auto mt-20 grid max-w-3xl gap-3 sm:grid-cols-2">
          <div className="glass-panel rounded-2xl p-5">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-cyan">Focus</p>
            <p className="mt-3 text-sm leading-6 text-muted">AI engineering, product systems, and measurable impact.</p>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-sky">Location</p>
            <p className="mt-3 text-sm leading-6 text-muted">Toronto, Ontario. Canadian citizen.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
