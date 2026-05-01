interface StatusPillProps {
  children: string;
}

export function StatusPill({ children }: StatusPillProps) {
  return (
    <div className="status-signal inline-flex items-center gap-3 rounded-full border border-green/20 bg-green/[0.06] px-4 py-2 font-sans text-sm font-semibold normal-case tracking-normal text-green md:text-base">
      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-45" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green" />
      </span>
      {children}
    </div>
  );
}
