import { secrets, type SecretId } from "@/lib/game/secrets";

export function SecretJournal({
  discovered,
  onReset,
}: {
  discovered: SecretId[];
  onReset: () => void;
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
          ? "Every secret found. A golden jacket is yours to wear around the campus."
          : "A dog, a strange door, a little moonlight. This world has a few stories tucked into its corners."}
      </p>
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
