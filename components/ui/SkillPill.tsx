import type { Accent } from "@/lib/types";

const colorClassNames: Record<Accent, string> = {
  cyan: "border-cyan/20 bg-cyan/[0.05] text-cyan",
  sky: "border-sky/20 bg-sky/[0.05] text-sky",
  green: "border-green/20 bg-green/[0.05] text-green",
  violet: "border-violet-300/20 bg-violet-300/[0.05] text-violet-200"
};

export function SkillPill({ skill, color }: { skill: string; color: Accent }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1.5 font-mono text-[0.72rem] font-medium uppercase tracking-[0.08em] ${colorClassNames[color]}`}
    >
      {skill}
    </span>
  );
}
