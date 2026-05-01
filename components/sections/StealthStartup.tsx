import { MotionReveal } from "@/components/effects/MotionReveal";
import { stealthProject } from "@/lib/data";

const stealthMetrics = [
  { label: "State", value: "Private beta" },
  { label: "Reach", value: "6+ creator workflows" },
  { label: "Mode", value: "Creator intelligence" }
];

const stealthStages = ["Signal intake", "Competitor map", "Idea engine", "Draftable workflows"];

export function StealthStartup() {
  return (
    <section
      id="stealth"
      aria-labelledby="stealth-title"
      className="stealth-section px-6 py-20 md:py-24"
    >
      <div className="container-page relative z-10">
        <div className="stealth-command grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <MotionReveal as="p" className="eyebrow mb-6" delay={80} variant="scale-in">
              Currently Building
            </MotionReveal>

            <MotionReveal variant="clip-scan" delay={180}>
              <h2
                id="stealth-title"
                aria-label={stealthProject.title}
                className="font-display text-4xl font-semibold leading-[0.98] text-primary sm:text-5xl md:text-6xl"
              >
                <span aria-hidden="true" className="stealth-title-effect" data-text={stealthProject.title}>
                  {stealthProject.title}
                </span>
              </h2>
            </MotionReveal>

            <MotionReveal
              as="p"
              className="mt-7 max-w-xl text-lg leading-8 text-slate-300 md:text-xl md:leading-9"
              delay={300}
            >
              {stealthProject.teaser}
            </MotionReveal>

            <div className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {stealthMetrics.map((metric, index) => (
                <MotionReveal
                  key={metric.label}
                  as="div"
                  className="stealth-metric"
                  delay={420 + index * 90}
                  variant="cluster-left"
                >
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </MotionReveal>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-2" aria-label="Stealth startup technology stack">
              {stealthProject.tags.map((tag, index) => (
                <MotionReveal
                  key={tag}
                  as="span"
                  className="stealth-tag"
                  delay={620 + index * 55}
                  variant="scale-in"
                >
                  {tag}
                </MotionReveal>
              ))}
            </div>
          </div>

          <MotionReveal className="stealth-vault-reveal lg:col-span-7" delay={260} variant="scale-in">
            <div
              className="stealth-vault"
              tabIndex={0}
              aria-label="Stealth startup preview. Details private."
            >
              <div className="stealth-vault-mark" aria-hidden="true">
                <span className="stealth-question">?</span>
                <div className="stealth-vault-mosaic">
                  {stealthProject.mosaicCells.map((cell, index) => (
                    <span
                      key={`${cell}-${index}`}
                      className={cell ? "stealth-vault-letter" : "stealth-vault-block"}
                    >
                      {cell}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="stealth-stage-list" aria-label="Private beta workflow stages">
              {stealthStages.map((stage, index) => (
                <MotionReveal
                  key={stage}
                  as="span"
                  className="stealth-stage-chip"
                  delay={650 + index * 85}
                  variant="scale-in"
                >
                  {stage}
                </MotionReveal>
              ))}
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
