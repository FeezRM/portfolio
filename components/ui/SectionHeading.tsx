import { MotionReveal } from "@/components/effects/MotionReveal";

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
}

export function SectionHeading({ label, title, description }: SectionHeadingProps) {
  return (
    <MotionReveal className="mx-auto mb-12 max-w-3xl text-center md:mb-16" variant="clip-scan">
      <p className="eyebrow mx-auto mb-4">{label}</p>
      <h2 className="font-display text-3xl font-semibold leading-tight text-primary md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted md:text-lg">
          {description}
        </p>
      ) : null}
    </MotionReveal>
  );
}
