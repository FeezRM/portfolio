import { secrets, hasGoldenJacket, type SecretId } from "@/lib/game/secrets";
import type { AlchemyTab } from "@/lib/game/alchemy";

export function SecretJournal({
  discovered,
  onReset,
  onOpenAlchemy,
}: {
  discovered: SecretId[];
  onReset: () => void;
  onOpenAlchemy: (tab: AlchemyTab) => void;
}) {
  const complete = discovered.length === secrets.length;
  return (
    <div className="secret-journal">
      <p className="panel-eyebrow">FIELD JOURNAL / OFF THE BEATEN PATH</p>
      <h3>
        {complete ? "Master of curiosity." : "Some things are worth finding."}
      </h3>
      <p className="project-lead">
        {complete
          ? "Every secret found. You know the campus and the creator behind it."
          : "A dog, a strange door, a little moonlight. This world has a few stories tucked into its corners."}
      </p>
      {hasGoldenJacket(discovered) && (
        <p className="journal-reward">
          ✦ Original five stories found. Your golden jacket is unlocked.
        </p>
      )}
      <div className="discovery-progress">
        <span>
          {discovered.length} / {secrets.length} DISCOVERED
        </span>
        <div>
          {secrets.map((secret) => (
            <i
              key={secret.id}
              className={discovered.includes(secret.id) ? "found" : ""}
            />
          ))}
        </div>
      </div>
      <div className="journal-records">
        {secrets.map((secret, i) => {
          const found = discovered.includes(secret.id);
          return (
            <article key={secret.id} className={found ? "is-found" : ""}>
              <span className="journal-symbol" aria-hidden="true">
                {found ? secret.symbol : "?"}
              </span>
              <div>
                <p className="panel-eyebrow">
                  SECRET 0{i + 1} / {found ? "DISCOVERED" : "UNDISCOVERED"}
                </p>
                <h4>{found ? secret.title : "An untold story"}</h4>
                {found ? (
                  <p>{secret.message}</p>
                ) : (
                  <details>
                    <summary>A small hint ↗</summary>
                    <p>{secret.hint}</p>
                  </details>
                )}
                {found &&
                  [
                    "alchemy-lab",
                    "alchemy-seal",
                    "creator-signal",
                    "alchemy-offer",
                  ].includes(secret.id) && (
                    <button
                      className="text-button"
                      onClick={() =>
                        onOpenAlchemy(
                          secret.id === "creator-signal"
                            ? "signal"
                            : secret.id === "alchemy-offer"
                              ? "offer"
                              : "studio",
                        )
                      }
                    >
                      Revisit the hidden studio ↗
                    </button>
                  )}
                {!found && secret.id === "alchemy-lab" && (
                  <details>
                    <summary>Explore without the 3D world ↗</summary>
                    <button
                      className="text-button"
                      onClick={() => onOpenAlchemy("studio")}
                    >
                      Investigate the alchemy desk ↗
                    </button>
                  </details>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {discovered.length > 0 && (
        <button className="text-button" onClick={onReset}>
          Reset discoveries and explore again
        </button>
      )}
    </div>
  );
}
