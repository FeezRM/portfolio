# Portfolio Implementation Plan — Faiz Kerawala

## Context

Faiz Kerawala is a CS Honours Co-op student (Ontario Tech, GPA 3.78, Dean's List) positioned as an AI Engineer and Software Engineer. This is a one-page premium portfolio targeting recruiters, with secondary audiences of collaborators and customers.

**Design direction:** AI lab aesthetic — very dark navy-black, blue/teal/cyan accent gradients, glassmorphism cards, dot grid background, minimal premium animations. Confident and cinematic, not flashy or generic.

**Differentiator:** The one visual people will remember — animated dot grid background with a slow radial glow pulse in the hero, plus a mysterious stealth startup card that reveals a glitched/mosaiced company name on hover.

---

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS v3
- Framer Motion (scroll reveals, hero stagger, hover states, stealth card scan)
- `next/font` for zero-FOUT font loading
- No image assets — all CSS/gradient visuals (keeps bundle tiny)

---

## Design System

### Typography
- **Display/Headings:** `Syne` — geometric, futuristic, not overused
- **Body:** `Geist Sans` — Vercel's font, clean but distinctive (not Inter)
- **Monospace/Accents:** `JetBrains Mono` — tech stack pills, section labels, code elements

### Color Palette
```css
--bg:             #070b12   /* very dark navy-black */
--surface:        #0d1420   /* card backgrounds */
--border:         rgba(255,255,255,0.07)
--accent-cyan:    #22d3ee   /* primary accent */
--accent-sky:     #38bdf8   /* secondary accent */
--accent-green:   #4ade80   /* tertiary accent */
--text-primary:   #f1f5f9
--text-muted:     #94a3b8
```

### Key Visual Utilities
```css
/* Dot grid — applied to body via globals.css */
background-image: radial-gradient(rgba(255,255,255,0.065) 1px, transparent 1px);
background-size: 28px 28px;

/* Glass card base — no backdrop-filter (too GPU-heavy against dot grid) */
.glass-card { background: rgba(13,20,32,0.92); border: 1px solid rgba(255,255,255,0.07); }

/* Gradient text */
.gradient-text { background: linear-gradient(135deg, #22d3ee, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

/* Glow border on hover */
.glow-border:hover { border-color: rgba(34,211,238,0.3); box-shadow: 0 0 20px rgba(34,211,238,0.08); }
```

---

## File & Folder Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout: fonts, metadata, MouseGlow (client boundary)
│   ├── page.tsx            # Single page: assembles all sections with section IDs
│   └── globals.css         # Tailwind base, dot grid on body, custom utilities
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Sticky, scroll-aware blur + anchor links
│   │   └── Footer.tsx      # Minimal: name, year, social icons
│   │
│   ├── sections/
│   │   ├── Hero.tsx        # Status pill, headline, subtitle, CTAs, socials
│   │   ├── About.tsx       # 2-col: copy left, stat cards right
│   │   ├── Projects.tsx    # Grid of ProjectCard + StealthCard
│   │   ├── Skills.tsx      # Grouped skill pills (4 categories)
│   │   ├── Experience.tsx  # Vertical timeline
│   │   └── Contact.tsx     # CTA heading + icon links
│   │
│   ├── ui/
│   │   ├── ProjectCard.tsx     # Glassmorphism card: title, desc, pills, links
│   │   ├── StealthCard.tsx     # ContentSpy mystery card with scan line + mosaic text
│   │   ├── SkillPill.tsx       # JetBrains Mono badge, category-colored
│   │   ├── TimelineItem.tsx    # Single experience entry with dot + line
│   │   ├── StatCard.tsx        # GPA, Dean's List, project count cards
│   │   ├── StatusPill.tsx      # Pulsing green dot + "Open to..." text
│   │   ├── SectionHeading.tsx  # Mono label + h2 title (reused by all sections)
│   │   └── GlowButton.tsx      # Primary (cyan fill) and ghost (border) variants
│   │
│   └── effects/
│       ├── MouseGlow.tsx       # Client: cursor-follow radial gradient (rAF, no re-renders)
│       └── RadialPulse.tsx     # Hero background slow gradient pulse animation
│
├── lib/
│   ├── types.ts            # All TypeScript interfaces
│   ├── data.ts             # All content: projects, skills, experience, social links
│   └── variants.ts         # All Framer Motion variant objects (centralized)
│
├── public/
│   └── resume.pdf          # CV placeholder
│
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## TypeScript Types (`/lib/types.ts`)

```typescript
export type SkillCategory = 'language' | 'ml-ai' | 'framework' | 'tool';

export interface Skill {
  name: string;
  category: SkillCategory;
}

export interface SkillGroup {
  label: string;
  category: SkillCategory;
  color: 'cyan' | 'sky' | 'green' | 'violet';
  skills: Skill[];
}

export interface Project {
  id: string;
  title: string;
  summary: string;           // one-liner for card header
  description: string;       // 2-3 sentence description
  tags: string[];            // tech stack pills
  highlight?: string;        // bold stat/impact line
  category: string;          // "Computer Vision + AI", "Agentic AI", etc.
  githubUrl?: string;
  liveUrl?: string;
  variant: 'normal' | 'stealth';
}

export interface StealthProject extends Project {
  variant: 'stealth';
  mosaicTitle: string;       // "C▉nt▉ntS▉y"
  teaser: string;            // "AI content intelligence platform for creators"
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  type: 'internship' | 'freelance' | 'education';
  bullets: string[];
  tags: string[];
}

export interface StatCard {
  value: string;
  label: string;
  accent: 'cyan' | 'green' | 'sky';
}

export interface SocialLink {
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'email' | 'resume';
}
```

---

## Content Data (`/lib/data.ts`)

### Projects (ordered for grid layout)

| # | Title | Category | Highlight | GitHub |
|---|-------|----------|-----------|--------|
| 1 | FocusFlow | Computer Vision + AI | 50% distraction reduction · 50+ participant study | github.com/FeezRM/FocusFlow |
| 2 | AI Short-Form Video Editor | Agentic AI + Creator Tools | Fully agentic edit pipeline · 0.85 confidence gate | github.com/FeezRM/AI-ShortForm-Editor |
| 3 | SoulSync | Voice AI + Full-Stack | <2.3s latency · 10+ concurrent sessions | (no public repo) |
| 4 | AI Interview Prep App | LLM Evaluation | Calibrated scoring rubric · 10+ tracked users | (no public repo) |
| 5 | LLM Research Agent | AI Agents + Automation | 80% manual cleanup reduction · 100+ profiles | (no public repo) |
| 6 | ContentSpy (STEALTH) | Stealth Startup | — | hidden |

**Stealth card fields:**
- `mosaicTitle`: `"C▉nt▉ntS▉y"`
- `teaser`: `"An AI content intelligence platform for creators and online business owners."`
- Card label: `"Stealth AI Startup"` with small text `"Currently Building"`

### Skills (4 groups)

| Group | Color | Skills |
|-------|-------|--------|
| Languages | cyan | Python, TypeScript, JavaScript, Java, SQL, C++, HTML/CSS |
| ML / AI | green | scikit-learn, OpenCV, MediaPipe, faster-whisper, Claude API, OpenRouter, ffmpeg, librosa |
| Frameworks | sky | Next.js, React, FastAPI, Node.js, Flask, Spring Boot, Electron, Django, Vue 3 |
| Tools & Infra | violet | PostgreSQL, Supabase, AWS (S3, Polly), Docker, Git |

### Experience (timeline order: newest first)

1. **MekTek Software Solutions** — Frontend Developer Intern · Sept–Dec 2025
   - Tags: Next.js, TypeScript, WordPress
2. **Meraki Hair & Medi-Spa** — Freelance Full Stack Developer · Apr–Sept 2025
   - Tags: Next.js, React, SSR
3. **Ontario Tech University** — B.Sc. Computer Science, Honours Co-op · 2023–2027
   - GPA: 3.78 · Dean's List

### Social Links

| Label | URL |
|-------|-----|
| GitHub | https://github.com/FeezRM |
| LinkedIn | https://linkedin.com/in/faizkerawala |
| Email | mailto:faiz.kera@gmail.com |
| Resume | /resume.pdf |

### Stat Cards (About section right column)
- `{ value: "3.78", label: "GPA", accent: "cyan" }`
- `{ value: "Dean's List", label: "Academic Excellence", accent: "green" }`
- `{ value: "5+", label: "AI Projects Shipped", accent: "sky" }`

---

## Copy

### Status Pill
```
● Open to AI/SWE Internships · Available July 2026
```

### Hero Headline
```
Hi, I'm Faiz.
I build AI-powered software.
```
("AI-powered" rendered with gradient text treatment)

### Hero Subtitle
```
I build AI systems that actually work in the real world —
computer vision pipelines, agentic workflows, and full-stack
products with measurable impact.
```

### About Paragraphs (human, confident, recruiter-friendly)

**P1:** "I'm a Computer Science Honours Co-op student at Ontario Tech University, specializing in AI engineering. I care about building systems that move the needle — not demos, but tools that reduce distraction by 50%, cut response latency below 2 seconds, and eliminate 80% of manual work in a pipeline."

**P2:** "My work sits at the intersection of machine learning and product engineering. I've shipped agentic pipelines, real-time computer vision applications, and full-stack web products for real clients — across internships, freelance work, and my own projects. I'm equally comfortable in a Python research environment and a Next.js codebase."

**P3:** "Currently exploring AI engineering and software development opportunities starting July 2026. I'm drawn to teams building products where the AI layer is the core of the value, not an afterthought."

### Contact CTA Headline
```
Have an idea, role, or project?
Let's build something useful.
```

---

## Animation Plan (`/lib/variants.ts`)

All scroll-triggered animations use `viewport={{ once: true, amount: 0.15 }}`.

```typescript
// Hero: staggered on mount
const heroStagger = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}
// Elements: status pill (i=0), h1 line 1 (i=1), h1 line 2 (i=2),
//           subtitle (i=3.5), buttons (i=5), socials (i=6)

// Default section entrance
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' }
  })
}

// Project cards (slight scale)
const cardReveal = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
}

// Timeline (slides from left)
const timelineSlide = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.12, duration: 0.45 }
  })
}

// Skill pills (cascade, delay capped at 250ms — no spring to avoid 29 simultaneous physics calculations)
const pillBounce = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1, scale: 1,
    transition: { delay: Math.min(i * 0.03, 0.25), duration: 0.3, ease: 'easeOut' }
  })
}
```

### Special Effects

**RadialPulse (hero bg):**
```typescript
// One pulse only — opacity animation only (no scale, scale forces repaint every frame)
animate={{ opacity: [0.3, 0.6, 0.3] }}
transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
// Position: absolute center, w-[600px] h-[600px], radial-gradient cyan-500/12 → transparent
```

**MouseGlow (cursor follower):**
- Direct DOM mutation on `mousemove` — `el.style.background = radial-gradient(500px at ${x}px ${y}px, rgba(34,211,238,0.05), transparent 70%)`
- No `requestAnimationFrame` loop — DOM updated only when mouse actually moves (not at 60fps constantly)
- Only activates on `window.matchMedia('(pointer: fine)')` — desktop-only

**StealthCard scan line:**
- Scan line: `motion.div` `animate={{ top: ['0%', '100%'] }}` with `transition: { duration: 1.5, repeat: Infinity, ease: 'linear' }` — only when `isHovered === true`
- Mosaic reveal: two overlapping `<span>` elements, default title hidden, `"C▉nt▉ntS▉y"` shown on hover via CSS opacity transition
- Card: `whileHover={{ borderColor: 'rgba(139,92,246,0.4)' }}` (violet glow instead of cyan to differentiate)

**ProjectCard hover:**
```typescript
whileHover={{ y: -4, borderColor: 'rgba(34,211,238,0.25)' }}
transition={{ duration: 0.2 }}
// Plus Tailwind: hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]
```

---

## Component Props Summary

| Component | Key Props |
|-----------|-----------|
| `SectionHeading` | `label: string`, `title: string`, `subtitle?: string` |
| `GlowButton` | `href: string`, `label: string`, `variant: 'primary'\|'ghost'`, `external?: boolean` |
| `StatusPill` | `text: string` |
| `ProjectCard` | `project: Project`, `index: number` |
| `StealthCard` | `project: StealthProject`, `index: number` |
| `SkillPill` | `skill: Skill` |
| `SkillGroup` | `group: SkillGroup` |
| `TimelineItem` | `experience: Experience`, `index: number`, `isLast: boolean` |
| `StatCard` | `stat: StatCard` |

---

## Build Checklist (Phased)

### Phase 1 — Foundation
- [ ] `npx create-next-app@latest` with TypeScript, Tailwind, App Router, src/ dir: No
- [ ] Install: `framer-motion`, `geist`
- [ ] `tailwind.config.ts` — colors, font families (syne/geist/mono vars), backgroundImage/Size, scan keyframe
- [ ] `globals.css` — dot grid on body, `.glass-card`, `.gradient-text`, `.glow-border`, `scroll-behavior: smooth`, `scroll-padding-top: 80px`
- [ ] `lib/types.ts` — all interfaces
- [ ] `lib/data.ts` — all content
- [ ] `lib/variants.ts` — all Framer Motion variants

### Phase 2 — UI Primitives
- [ ] `SectionHeading.tsx`
- [ ] `StatusPill.tsx`
- [ ] `GlowButton.tsx` (primary + ghost)
- [ ] `SkillPill.tsx`
- [ ] `StatCard.tsx`
- [ ] `MouseGlow.tsx` (client component, rAF + pointer-fine check)

### Phase 3 — Effects
- [ ] `RadialPulse.tsx` — looping motion.div gradient for hero
- [ ] Verify DotGrid is working via body CSS (no extra component needed)

### Phase 4 — Sections (in this order)
- [ ] `Hero.tsx` — first impression, status pill + headline + subtitle + CTAs + socials
- [ ] `Navbar.tsx` — scroll-aware blur, anchor links
- [ ] `About.tsx` — 2-col layout with copy + StatCards
- [ ] `ProjectCard.tsx` — glassmorphism card (normal variant)
- [ ] `StealthCard.tsx` — mystery card with scan line + mosaic text
- [ ] `Projects.tsx` — assembles 5 ProjectCards + 1 StealthCard in grid
- [ ] `TimelineItem.tsx` + `Experience.tsx`
- [ ] `Skills.tsx` + skill group layout
- [ ] `Contact.tsx`
- [ ] `Footer.tsx`

### Phase 5 — Assembly & Polish
- [ ] `app/page.tsx` — all sections with IDs: `#about`, `#projects`, `#skills`, `#experience`, `#contact`
- [ ] Wire Navbar anchor links
- [ ] Add `MouseGlow` to `app/layout.tsx` (wraps in client boundary)
- [ ] Add `metadata` export — title, description, OG tags
- [ ] Mobile review: 375px hero text sizing (`text-5xl md:text-7xl lg:text-8xl`)
- [ ] Test all scroll reveal animations

### Phase 6 — A11y & Performance
- [ ] `aria-label` on all icon-only buttons/links
- [ ] `<ol>/<li>` for timeline, `<ul aria-label="...">` for skill groups
- [ ] `StealthCard` aria-label: `"Stealth AI startup project — details private"`
- [ ] `focus-visible:ring-2 focus-visible:ring-cyan-400` on all interactive elements
- [ ] Skip-to-content link in Navbar: `<a href="#main" className="sr-only focus:not-sr-only">`
- [ ] `prefers-reduced-motion`: use Framer's `useReducedMotion()` hook to disable animations
- [ ] `rel="noopener noreferrer"` on all external links
- [ ] `lang="en"` on `<html>` in layout.tsx
- [ ] Lighthouse audit — target 95+ Performance, 100 Accessibility

---

## Key Implementation Notes

1. **Font setup:** Apply CSS variables to `<html>` in `layout.tsx`: `className={`${syne.variable} ${geist.variable} ${jbMono.variable}`}`. Reference in Tailwind as `font-syne`, `font-geist`, `font-mono`.

2. **Server vs Client components:** Default to RSC. Mark `use client` only on: `MouseGlow`, `StealthCard` (hover state), `Navbar` (scroll state). Everything else is server-rendered.

3. **Stealth card mosaic:** Two overlapping `<span>` elements in the same position — normal title at `opacity-0 group-hover:opacity-100` and mosaic text at `opacity-100 group-hover:opacity-0`. No JS string manipulation needed.

4. **Projects grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. StealthCard occupies slot 6 (last). Give it a slightly different border color (`border-violet-500/20`) to visually distinguish it from the regular project cards.

5. **No form in Contact:** Direct links only (GitHub, LinkedIn, email). Friction-free for recruiters.

6. **Hero mobile safety:** "Faiz Kerawala" at `text-8xl` is ~96px — will overflow on 375px. Use `text-5xl sm:text-6xl md:text-7xl lg:text-8xl` or `clamp(2.5rem, 8vw, 6rem)` via CSS.

7. **Performance constraints (do not regress):** Glassmorphism + dot-grid background is expensive. Never add `backdrop-filter`/`backdrop-blur-*` to any element — use solid `rgba()` backgrounds instead. Keep `repeat: Infinity` animations to a minimum (one `RadialPulse` is fine). Do not add new `requestAnimationFrame` loops. Cap staggered animation delays so they don't exceed ~250ms total cascade.

---

## Verification Plan

After full assembly:
1. Open `http://localhost:3000` — verify hero renders correctly with dot grid + radial pulse
2. Scroll through all sections — verify scroll reveal animations trigger once
3. Hover project cards — verify glow border + lift
4. Hover StealthCard — verify scan line appears + mosaic text swaps in
5. Move cursor on desktop — verify radial mouse glow follows
6. Resize to 375px — verify all sections readable, no overflow
7. Resize to 768px (tablet) — verify Projects grid is 2-col
8. Tab through page — verify all interactive elements are keyboard-accessible
9. Run `npm run build` — verify no TypeScript errors, no build warnings
10. Run Lighthouse in Chrome — target 95+ Performance, 100 Accessibility
