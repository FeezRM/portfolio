"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";

const glyphs = "AI01<>/{}[]#$%+=*";
const revealablePattern = /[A-Za-z0-9]/;

interface DecryptTextProps {
  className?: string;
  delay?: number;
  highlight?: string;
  text: string;
}

function maskText(text: string) {
  let glyphIndex = 0;

  return text
    .split("")
    .map((character) => {
      if (!revealablePattern.test(character)) {
        return character;
      }

      const glyph = glyphs[glyphIndex % glyphs.length];
      glyphIndex += 1;

      return glyph;
    })
    .join("");
}

function renderText(text: string, highlight?: string) {
  const highlightStart = highlight ? text.indexOf(highlight) : -1;
  const highlightEnd = highlightStart >= 0 && highlight ? highlightStart + highlight.length : -1;
  const lines = text.split("\n");
  const renderedLines: ReactNode[] = [];
  let globalIndex = 0;

  lines.forEach((line, lineIndex) => {
    const segments: ReactNode[] = [];
    let segment = "";
    let segmentHighlighted = false;

    const flushSegment = () => {
      if (!segment) {
        return;
      }

      segments.push(
        <span
          key={`${lineIndex}-${segments.length}`}
          className={segmentHighlighted ? "decrypt-highlight gradient-text whitespace-nowrap" : undefined}
        >
          {segment}
        </span>
      );
      segment = "";
    };

    line.split("").forEach((character) => {
      const isHighlighted = globalIndex >= highlightStart && globalIndex < highlightEnd;

      if (segment && isHighlighted !== segmentHighlighted) {
        flushSegment();
      }

      segmentHighlighted = isHighlighted;
      segment += character;
      globalIndex += 1;
    });

    flushSegment();

    renderedLines.push(
      <span className={lineIndex === 0 ? undefined : "block"} key={lineIndex}>
        {segments}
      </span>
    );

    globalIndex += 1;
  });

  return renderedLines;
}

export function DecryptText({
  className = "",
  delay = 0,
  highlight,
  text
}: DecryptTextProps) {
  const maskedText = useMemo(() => maskText(text), [text]);
  const [displayText, setDisplayText] = useState(maskedText);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let intervalId: number | undefined;
    let revealedCharacters = 0;

    const resetId = window.setTimeout(() => {
      setDisplayText(maskedText);
      setIsComplete(false);
    }, 0);

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        revealedCharacters += 1;

        setDisplayText(
          text
            .split("")
            .map((character, index) => {
              if (!revealablePattern.test(character) || index < revealedCharacters) {
                return character;
              }

              return glyphs[Math.floor(Math.random() * glyphs.length)];
            })
            .join("")
        );

        if (revealedCharacters >= text.length) {
          window.clearInterval(intervalId);
          setDisplayText(text);
          setIsComplete(true);
        }
      }, 24);
    }, delay);

    return () => {
      window.clearTimeout(resetId);
      window.clearTimeout(timeoutId);

      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [delay, maskedText, text]);

  return (
    <>
      <span
        aria-hidden="true"
        className={`decrypt-text ${isComplete ? "is-complete" : ""} ${className}`}
      >
        {renderText(displayText, highlight)}
      </span>
      <span aria-hidden="true" className={`decrypt-reduced ${className}`}>
        {renderText(text, highlight)}
      </span>
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
    </>
  );
}
