"use client";

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useState
} from "react";

type MotionRevealVariant =
  | "fade-up"
  | "clip-scan"
  | "scale-in"
  | "timeline-draw"
  | "cluster-left"
  | "cluster-right";

type MotionRevealTag =
  | "article"
  | "div"
  | "footer"
  | "h1"
  | "h2"
  | "h3"
  | "li"
  | "nav"
  | "p"
  | "section"
  | "span"
  | "ul";

interface MotionRevealProps {
  as?: MotionRevealTag;
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: MotionRevealVariant;
}

export function MotionReveal({
  as = "div",
  children,
  className = "",
  delay = 0,
  variant = "fade-up"
}: MotionRevealProps) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const Tag = as;

  const handleRef = useCallback((element: HTMLElement | null) => {
    setNode(element);
  }, []);

  useEffect(() => {
    if (!node) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.16
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [node]);

  return (
    <Tag
      ref={handleRef}
      className={`motion-reveal motion-reveal-${variant} ${isVisible ? "is-visible" : ""} ${className}`}
      data-motion-tag={as}
      style={{ "--motion-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
