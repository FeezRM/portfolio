import type { AnchorHTMLAttributes, ReactNode } from "react";

interface GlowButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
}

const variantClassNames = {
  primary:
    "border-cyan/70 bg-cyan text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.22)] hover:bg-sky",
  ghost:
    "border-white/10 bg-white/[0.03] text-primary hover:border-cyan/40 hover:bg-cyan/[0.08]"
};

export function GlowButton({
  children,
  variant = "primary",
  className = "",
  href = "#",
  ...props
}: GlowButtonProps) {
  const isExternal = href.startsWith("http");

  return (
    <a
      className={`glow-button inline-flex min-h-12 items-center justify-center rounded-full border px-5 py-3 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition duration-200 ${variantClassNames[variant]} ${className}`}
      href={href}
      rel={isExternal ? "noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}
