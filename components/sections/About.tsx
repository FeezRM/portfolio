import { MotionReveal } from "@/components/effects/MotionReveal";

export function About() {
  return (
    <section id="about" className="px-6 py-0">
      <div className="container-page">
        <MotionReveal
          as="h2"
          className="mx-auto max-w-3xl text-center font-display text-3xl font-semibold leading-tight text-primary md:text-5xl"
          variant="clip-scan"
        >
          I&apos;m focused on building cool shit that actually does shit.
        </MotionReveal>
      </div>
    </section>
  );
}
