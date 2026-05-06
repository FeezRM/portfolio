'use client';

import { useState } from 'react';

const navItems = [
  { label: "Startup", href: "#stealth" },
  { label: "Work", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" }
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = () => setMobileOpen(false);

  return (
    <header className="site-nav-shell fixed inset-x-0 top-0 z-50 px-4 pt-[calc(1rem+env(safe-area-inset-top))] md:px-6">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-bg/90 px-4 py-3 shadow-panel backdrop-blur-md md:px-5"
      >
        <a className="font-display text-sm font-semibold text-primary md:text-base" href="#home" onClick={close}>
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

        <div className="flex items-center gap-2">
          <a
            className="rounded-full border border-cyan/30 px-3 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-cyan transition hover:bg-cyan/[0.08] md:px-4"
            href="mailto:faiz.kera@gmail.com"
          >
            Email
          </a>

          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-muted transition hover:border-white/20 hover:text-primary md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="1" y1="1" x2="12" y2="12" />
                <line x1="12" y1="1" x2="1" y2="12" />
              </svg>
            ) : (
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="1" y1="1" x2="13" y2="1" />
                <line x1="1" y1="5.5" x2="13" y2="5.5" />
                <line x1="1" y1="10" x2="13" y2="10" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-6xl md:hidden">
          <div className="rounded-2xl border border-white/10 bg-bg/95 px-3 py-2 shadow-panel backdrop-blur-md">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={close}
                className="block rounded-xl px-4 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition hover:bg-white/[0.055] hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
