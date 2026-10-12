"use client";

import { useState } from "react";
import {
  alchemyIngredients,
  advanceAlchemyRecipe,
  contentAlchemy,
  creatorCodexText,
  isPublicInstagramHref,
  type AlchemyTab,
  type IngredientId,
} from "@/lib/game/alchemy";
import type { SecretId } from "@/lib/game/secrets";

const bottleOrder: IngredientId[] = [
  "editing",
  "ideation",
  "recording",
  "scripting",
];

export function CreatorStudio({
  tab,
  discovered,
  onDiscover,
  onTab,
}: {
  tab: AlchemyTab;
  discovered: SecretId[];
  onDiscover: (id: SecretId) => void;
  onTab: (tab: AlchemyTab) => void;
}) {
  const unlocked = discovered.includes("alchemy-seal");
  const [progress, setProgress] = useState(unlocked ? 4 : 0);
  const [note, setNote] = useState(unlocked ? "Your creator’s codex is ready. Mix another batch whenever you like." : "Start with the spark. Finish with refinement.");
  const [topic, setTopic] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const instagram = isPublicInstagramHref(contentAlchemy.instagramHref);
  const offer = contentAlchemy.offer;
  const activeTab =
    (tab === "signal" && !instagram) || (tab === "offer" && !offer)
      ? "studio"
      : tab;

  function combine(id: IngredientId) {
    if (!discovered.includes("alchemy-lab")) onDiscover("alchemy-lab");
    const result = advanceAlchemyRecipe(progress, id);
    setProgress(result.progress);
    setNote(
      result.complete
        ? "Transmutation complete. Your creator’s codex is ready."
        : result.accepted
          ? `${alchemyIngredients[result.progress - 1].name} added. What comes next?`
          : "That ingredient comes later. Follow the journey from an idea to a finished piece.",
    );
    if (result.complete && result.accepted) onDiscover("alchemy-seal");
  }

  async function copyCodex() {
    try {
      await navigator.clipboard.writeText(creatorCodexText(topic));
      setCopyStatus("Copied. Make something worth sharing.");
    } catch {
      setCopyStatus("Copy is unavailable here. Use Download codex instead.");
    }
  }

  function downloadCodex() {
    const url = URL.createObjectURL(
      new Blob([creatorCodexText(topic)], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Content-Alchemy-Creators-Codex.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setCopyStatus("Codex downloaded. Keep the system close.");
  }

  return (
    <div className="creator-studio">
      <div className="alchemy-masthead">
        <span className="alchemy-monogram" aria-hidden="true">
          △<i>✦</i>
        </span>
        <div>
          <p className="panel-eyebrow">CONTENT ALCHEMY / AFTER HOURS</p>
          <h3>
            Every idea has
            <br />a little <em>magic.</em>
          </h3>
        </div>
        <span className="alchemy-edition">
          HIDDEN ROOM
          <br />
          EST. BY FAIZ
        </span>
      </div>
      <nav className="alchemy-tabs" aria-label="Creator studio rooms">
        <button
          aria-current={activeTab === "studio" ? "page" : undefined}
          onClick={() => onTab("studio")}
        >
          01 / THE STUDIO
        </button>
        {instagram && (
          <button
            aria-current={activeTab === "signal" ? "page" : undefined}
            onClick={() => {
              onDiscover("creator-signal");
              onTab("signal");
            }}
          >
            02 / THE SIGNAL
          </button>
        )}
        {offer && (
          <button
            aria-current={activeTab === "offer" ? "page" : undefined}
            onClick={() => {
              onDiscover("alchemy-offer");
              onTab("offer");
            }}
          >
            03 / THE COMMISSION
          </button>
        )}
      </nav>
      {activeTab === "studio" ? (
        <>
          <div className="alchemy-intro">
            <p>There’s a creator behind the engineer.</p>
            <p>
              {contentAlchemy.description} Four ingredients. One repeatable
              process. Find their order to unlock a small tool for your next
              piece of content.
            </p>
          </div>
          <section
            className="alchemy-workbench"
            aria-label="Content system puzzle"
          >
            <header>
              <p className="panel-eyebrow">RECIPE 001 / THE CONTENT SYSTEM</p>
              <span>
                {progress === 4 ? "✦ COMPLETE" : `${progress} / 4 INGREDIENTS`}
              </span>
            </header>
            <div className="alchemy-bottles">
              {bottleOrder.map((id) => {
                const ingredient = alchemyIngredients.find(
                  (item) => item.id === id,
                )!;
                const used =
                  alchemyIngredients.findIndex((item) => item.id === id) <
                  progress;
                return (
                  <button
                    key={id}
                    className={`alchemy-bottle bottle-${id} ${used ? "is-added" : ""}`}
                    onClick={() => combine(id)}
                    disabled={used || progress === 4}
                    aria-label={`Add ${ingredient.name}`}
                  >
                    <span className="bottle-glass" aria-hidden="true">
                      <i>{ingredient.symbol}</i>
                    </span>
                    <small>{ingredient.element}</small>
                    <strong>{ingredient.name}</strong>
                    <span className="bottle-action">
                      {used ? "ADDED ✓" : "COMBINE +"}
                    </span>
                  </button>
                );
              })}
            </div>
            <ol className="alchemy-recipe" aria-label="Ingredients combined">
              {alchemyIngredients.map((ingredient, i) => (
                <li
                  key={ingredient.id}
                  className={i < progress ? "is-filled" : ""}
                >
                  <span>{i < progress ? ingredient.symbol : `0${i + 1}`}</span>
                  <strong>{i < progress ? ingredient.name : "Unknown"}</strong>
                </li>
              ))}
            </ol>
            <p className="alchemy-feedback" role="status">
              {note}
            </p>
            {progress === 4 && (
              <button
                className="text-button"
                onClick={() => {
                  setProgress(0);
                  setNote("The codex is yours to keep. Try the recipe again.");
                }}
              >
                Mix another batch ↻
              </button>
            )}
          </section>
          {unlocked && (
            <section className="creator-codex" aria-labelledby="codex-title">
              <div>
                <p className="panel-eyebrow">REWARD UNLOCKED / YOURS TO KEEP</p>
                <h4 id="codex-title">The creator’s codex.</h4>
                <p>
                  A pocket framework for turning a scattered idea into a
                  finished piece. Give it a topic and take it with you.
                </p>
                <label htmlFor="codex-topic">Your next content idea</label>
                <input
                  id="codex-topic"
                  maxLength={100}
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="e.g. a lesson from building my first app"
                />
                <div className="panel-actions">
                  <button className="ink-button" onClick={copyCodex}>
                    Copy framework ↗
                  </button>
                  <button className="text-button" onClick={downloadCodex}>
                    Download codex ↓
                  </button>
                </div>
                <p role="status" className="codex-status">
                  {copyStatus}
                </p>
              </div>
              <div className="codex-pages" aria-hidden="true">
                <span>
                  CONTENT
                  <br />
                  ALCHEMY
                </span>
                <i>✦</i>
                <small>
                  THE CREATOR’S CODEX
                  <br />
                  IDEA → SYSTEM → CONTENT
                </small>
              </div>
            </section>
          )}
        </>
      ) : activeTab === "signal" ? (
        <section className="alchemy-signal">
          <div className="signal-phone" aria-hidden="true">
            <span>AFTER HOURS</span>
            <i>◉</i>
            <strong>
              CREATE.
              <br />
              CONNECT.
              <br />
              REPEAT.
            </strong>
            <small>CONTENT ALCHEMY</small>
          </div>
          <div>
            <p className="panel-eyebrow">A SIGNAL FROM OUTSIDE THIS WORLD</p>
            <h4>The creator’s frequency.</h4>
            <p>
              Follow the ideas beyond the campus. Find Faiz’s content, thoughts,
              and work in progress on Instagram.
            </p>
            <a
              className="ink-button"
              href={contentAlchemy.instagramHref!}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onDiscover("creator-signal")}
            >
              {contentAlchemy.instagramHandle || "Open Instagram"} ↗
            </a>
          </div>
        </section>
      ) : (
        offer && (
          <section className="alchemy-commission">
            <span className="commission-seal" aria-hidden="true">
              ✉
            </span>
            <p className="panel-eyebrow">AN INVITATION / A REAL-WORLD QUEST</p>
            <h4>{offer.title}</h4>
            <p>{offer.description}</p>
            <ul>
              {offer.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a
              className="ink-button"
              href={offer.href}
              target={offer.href.startsWith("https:") ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={() => onDiscover("alchemy-offer")}
            >
              {offer.cta} ↗
            </a>
          </section>
        )
      )}
      <footer className="alchemy-footnote">
        <span>CURIOUS MINDS MAKE GOOD THINGS.</span>
        <a href={contentAlchemy.contactHref}>Talk content with Faiz ↗</a>
      </footer>
    </div>
  );
}
