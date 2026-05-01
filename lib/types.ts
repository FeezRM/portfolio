export type Accent = "cyan" | "sky" | "green" | "violet";

export interface Project {
  id: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  impact: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface StealthProject extends Omit<Project, "description"> {
  description?: string;
  teaser: string;
  mosaicCells: string[];
}

export interface SkillGroup {
  label: string;
  color: Accent;
  skills: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  tags: string[];
}

export interface Stat {
  value: string;
  label: string;
  accent: "cyan" | "green" | "sky";
}

export interface SocialLink {
  label: string;
  href: string;
  kind: "github" | "linkedin" | "email" | "resume";
}
