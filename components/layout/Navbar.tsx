const navItems = [
  { label: "Startup", href: "#stealth" },
  { label: "Work", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" }
];

export function Navbar() {
  return (
    <header className="site-nav-shell fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-bg/90 px-4 py-3 shadow-panel md:px-5"
      >
        <a className="font-display text-sm font-semibold text-primary md:text-base" href="#home">
          Faiz Kerawala
        </a>

        <div className="hidden items-center gap-1 rounded-full border border-white/5 bg-white/[0.025] p-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              className="rounded-full px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted transition hover:bg-white/[0.055] hover:text-primary"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          className="rounded-full border border-cyan/30 px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-cyan transition hover:bg-cyan/[0.08] md:px-4"
          href="mailto:faiz.kera@gmail.com"
        >
          Email
        </a>
      </nav>
    </header>
  );
}
