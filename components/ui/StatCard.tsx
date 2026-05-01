import type { Stat } from "@/lib/types";

const accentClassNames: Record<Stat["accent"], string> = {
  cyan: "text-cyan border-cyan/20 bg-cyan/[0.045]",
  green: "text-green border-green/20 bg-green/[0.045]",
  sky: "text-sky border-sky/20 bg-sky/[0.045]"
};

export function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className={`glass-panel rounded-2xl p-6 ${accentClassNames[stat.accent]}`}>
      <p className="font-display text-3xl font-semibold leading-none md:text-4xl">
        {stat.value}
      </p>
      <p className="mt-3 text-sm leading-6 text-muted">{stat.label}</p>
    </div>
  );
}
