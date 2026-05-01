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
            <p className="eyebrow mb-6">Currently Building</p>

            <h2
              id="stealth-title"
              aria-label={stealthProject.title}
              className="font-display text-4xl font-semibold leading-[0.98] text-primary sm:text-5xl md:text-6xl"
            >
              <span aria-hidden="true" className="stealth-title-effect" data-text={stealthProject.title}>
                {stealthProject.title}
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 md:text-xl md:leading-9">
              {stealthProject.teaser}
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {stealthMetrics.map((metric) => (
                <div key={metric.label} className="stealth-metric">
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-2" aria-label="Stealth startup technology stack">
              {stealthProject.tags.map((tag) => (
                <span key={tag} className="stealth-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
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
              {stealthStages.map((stage) => (
                <span key={stage} className="stealth-stage-chip">
                  {stage}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
