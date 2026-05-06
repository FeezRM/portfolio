import type { Experience, Project, SkillGroup, SocialLink, Stat, StealthProject } from "@/lib/types";

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/FeezRM", kind: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/faizkerawala", kind: "linkedin" },
  { label: "Email", href: "mailto:faiz.kera@gmail.com", kind: "email" }
];

export const stats: Stat[] = [
  { value: "3.78", label: "GPA", accent: "cyan" },
  { value: "Dean's List", label: "Academic Excellence", accent: "green" },
  { value: "5+", label: "AI Projects Shipped", accent: "sky" }
];

export const projects: Project[] = [
  {
    id: "focusflow",
    title: "FocusFlow",
    category: "Computer Vision + AI",
    summary: "Real-time attention monitoring with measurable behavioral impact.",
    description:
      "Built a personalized computer vision pipeline with MediaPipe and Electron that calibrates to each user's baseline and triggers interventions only after sustained drift — proven to cut distractions by 50% across a 50-participant study.",
    impact: "50% distraction reduction | 50+ participant study",
    tags: ["Python", "FastAPI", "React", "Electron", "OpenCV", "MediaPipe"],
    githubUrl: "https://github.com/FeezRM/FocusFlow"
  },
  {
    id: "shortform-editor",
    title: "AI Short-Form Video Editor",
    category: "Agentic AI + Creator Tools",
    summary: "An agentic editing pipeline from transcript to rendered short.",
    description:
      "Built a fully agentic pipeline — raw footage to captioned short — covering transcription, scene detection, and ffmpeg rendering, with a confidence gate that filters weak AI cuts before output with zero manual intervention.",
    impact: "0.85 confidence gate | fully agentic edit pipeline",
    tags: ["Python", "faster-whisper", "OpenCV", "librosa", "ffmpeg", "LLM agents"],
    githubUrl: "https://github.com/FeezRM/AI-ShortForm-Editor"
  },
  {
    id: "soulsync",
    title: "SoulSync",
    category: "Voice AI + Full-Stack",
    summary: "Low-latency conversational AI with multimodal service orchestration.",
    description:
      "Engineered async service orchestration across Flask, AWS Polly, and S3 that brought real-time LLM voice responses under 2.3s — well within natural conversation thresholds — while sustaining 10+ concurrent sessions.",
    impact: "<2.3s response latency | 10+ concurrent sessions",
    tags: ["Python", "Flask", "React", "AWS Polly", "S3", "LLM APIs"],
    githubUrl: "https://github.com/FeezRM/SoulSync"
  },
  {
    id: "research-agent",
    title: "IG Research Agent",
    category: "AI Agents + Automation",
    summary: "Structured research automation with deterministic guardrails.",
    description:
      "Replaced hours of manual social research with a structured automation pipeline — JSON schemas, skip criteria, and classification logic — eliminating 80% of cleanup and producing auditable records across 100+ profiles.",
    impact: "80% manual cleanup reduction | 100+ profiles",
    tags: ["Python", "Claude API", "Notion API", "Automation", "JSON schemas"],
    githubUrl: "https://github.com/FeezRM/ig-competitor-research"
  }
];

export const stealthProject: StealthProject = {
  id: "stealth-startup",
  title: "AI Startup",
  category: "Creator Intelligence",
  summary: "Private beta product for creator workflows.",
  impact: "Private beta | 6+ creator workflows",
  teaser: "AI content intelligence for creators and online business owners.",
  tags: ["Next.js", "FastAPI", "Python", "Supabase", "LLM pipelines"],
  mosaicCells: ["C", "", "", "t", "", "", "t", "", "S", "", ""]
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    color: "cyan",
    skills: ["Python", "TypeScript", "JavaScript", "Java", "SQL", "C++", "HTML/CSS"]
  },
  {
    label: "ML / CV",
    color: "green",
    skills: ["scikit-learn", "OpenCV", "MediaPipe", "faster-whisper", "librosa", "ffmpeg", "model evaluation", "computer vision"]
  },
  {
    label: "AI",
    color: "violet",
    skills: ["OpenRouter", "RAG", "LangChain", "embeddings", "vector search", "vector database", "prompt engineering", "JSON schemas"]
  },
  {
    label: "Agents",
    color: "green",
    skills: ["Codex", "Claude Code", "LLM agents", "multi-agent workflows", "routing"]
  },
  {
    label: "Frameworks",
    color: "sky",
    skills: ["Next.js", "React", "FastAPI", "Node.js", "Flask", "Spring Boot", "Electron", "Django", "Vue 3"]
  },
  {
    label: "Tools & Infra",
    color: "cyan",
    skills: ["PostgreSQL", "Supabase", "AWS S3/Polly", "Docker", "Git", "Notion", "Postman", "Linux"]
  }
];

export const experience: Experience[] = [
  {
    id: "mektek",
    company: "MekTek Software Solutions & Engineering",
    role: "Frontend Developer Intern",
    period: "Sept - Dec 2025",
    location: "Ontario, Canada",
    bullets: [
      "Audited an AI-driven platform for security and workflow vulnerabilities, documenting 10+ critical issues and partnering with engineers through remediation.",
      "Architected a headless CMS with Next.js and WordPress REST APIs, cutting publishing time by 65% and packaging logic into reusable components."
    ],
    tags: ["Next.js", "TypeScript", "WordPress REST"]
  },
  {
    id: "meraki",
    company: "Meraki Hair & Medi-Spa",
    role: "Freelance Full Stack Developer",
    period: "Apr - Sept 2025",
    location: "Ontario, Canada",
    bullets: [
      "Shipped a React and Next.js platform with SSR for a real client, doubling appointment bookings and increasing session duration 2.3x within 60 days."
    ],
    tags: ["Next.js", "React", "SSR"]
  },
  {
    id: "ontario-tech",
    company: "Ontario Tech University",
    role: "B.Sc. Computer Science, Honours Co-op",
    period: "2023 - 2027",
    location: "Oshawa, ON",
    bullets: [
      "Dean's List student with a 3.78 GPA, focused on AI engineering, systems design, databases, and data structures and algorithms."
    ],
    tags: ["GPA 3.78", "Dean's List", "Honours Co-op"]
  }
];
