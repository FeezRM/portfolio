# Faiz Kerawala

faiz.kera@gmail.com · (647) 772-3818 · [LinkedIn](https://linkedin.com/in/faizkerawala) · [GitHub](https://github.com/FeezRM) · Ajax, ON · Canadian Citizen

---

## Summary

CS Honours Co-op student (3.78 GPA, Dean's List) building and empirically evaluating AI systems — real-time computer vision pipelines, LLM evaluation frameworks, and multi-agent workflows in Python. Motivated by ensuring AI systems behave safely and predictably; excited to transition from engineering into empirical AI research. Available full-time July–November 2026 (Canadian citizen, no visa sponsorship needed).

---

## Education

**Ontario Tech University** — B.Sc. Computer Science, Honours Co-op · Oshawa, ON · Expected May 2027
GPA: 3.78 · Dean's List
_Coursework:_ Data Structures & Algorithms · Database Systems · Computer Architecture · Software Systems Design · Computational Science

---

## Technical Skills

**Languages:** Python, TypeScript, JavaScript, Java, SQL, C++, HTML/CSS
**ML & AI:** scikit-learn · OpenCV · MediaPipe · faster-whisper · LLM APIs (Claude, OpenRouter) · librosa · ffmpeg
**Frameworks:** FastAPI · Flask · React · Next.js · Spring Boot · Node.js · Electron · Django
**Tools & Cloud:** AWS (S3, Polly) · Docker · PostgreSQL · Supabase · Git

---

## Projects

**FocusFlow** — AI Attention Monitor · Python · FastAPI · React · Electron · OpenCV · MediaPipe · Socket.IO · [GitHub](https://github.com/FeezRM/FocusFlow) · Oct 2025 – Jan 2026

- Designed and empirically evaluated a real-time computer vision pipeline (10 FPS, <100ms inference) using MediaPipe's 478-point facial landmark model; calibrated detection sensitivity with a per-user 5-second baseline phase to reduce false positives.
- Built and systematically tested a 6-state cognitive FSM with configurable intervention thresholds (15–25s drift window); user study across 50+ participants measured ~50% reduction in distracted time and ~40% faster average refocus, validating threshold selection and intervention design choices.

**AI Interview Prep App** — LLM Evaluation & Calibration · Vue 3 · Node.js/Express · OpenRouter (GPT-4o-mini) · Vuex

- Designed structured LLM evaluation prompts with calibrated 0-10 scoring rubrics across behavioral (STAR) and technical dimensions; iteratively refined prompt formulations to reduce ungrounded praise and enforce scoring reliability — an applied study in controlling LLM output quality at inference time.
- Built `previousQuestions` deduplication and session history state in Vuex; 10+ users with tracked scoring analytics confirmed improved consistency and reduced variance across repeated evaluation sessions.

**AI Short-Form Video Editor** — Agentic Pipeline · Python · faster-whisper · OpenCV · librosa · LLM Agents · [GitHub](https://github.com/FeezRM/AI-ShortForm-Editor) · Jan 2026 – Present

- Engineered an end-to-end agentic AI pipeline: word-level transcription → audio-based scene/silence detection → LLM-driven edit decision list (EDL) generation → ffmpeg rendering with captions and b-roll injection.
- Empirically calibrated a confidence-gate rendering system (threshold: 0.85 via holdout evaluation) that filters low-quality AI-generated cuts before final output — automated quality control for agentic AI decisions without per-clip human review.

**LLM-Powered Research Agent** · Python · Claude API · Notion API · Web Automation · March – April 2026

- Engineered an LLM research agent with deterministic guardrails, JSON output schemas, skip criteria, and classification logic to convert unstructured social data into normalized database records across 100+ profiles and 7 niches — with consistent, auditable outputs across repeated runs.
- Designed a multi-source discovery workflow (seed-account mining → targeted search → profile-level validation) that reduced manual cleanup by 80%+ through systematic deduplication and structured reporting.

**ContentSpy** — AI Content Intelligence Platform · Next.js · FastAPI · Python · Supabase · Jan 2026 – Present

- Built end-to-end LLM pipeline for competitor intelligence: transcript ingestion → AI video analysis → content gap detection → script generation, serving 6+ creator workflows in a 10-user private beta.
- Architected FastAPI microservices and a typed Next.js frontend with Supabase Auth, PostgreSQL-backed niche management, and structured AI-generated insight feeds.

**SoulSync** — Conversational AI · Python · Flask · React · AWS Polly · S3 · Apr – Sept 2025

- Architected a real-time multi-modal LLM platform integrating TTS (AWS Polly) and async Flask APIs; reduced end-to-end response latency to <2.3s through request pipelining and optimized API orchestration.
- Scaled to 10+ concurrent sessions under load testing via token auth, request queuing, and fault-tolerant service integration with zero dropped sessions.

---

## Work Experience

**MekTek Software Solutions & Engineering** · Frontend Developer Intern · Sept – Dec 2025

- Systematically audited an AI-driven platform for security and workflow vulnerabilities, identifying and documenting 10+ critical issues; partnered with engineers to remediate all before production launch.
- Architected a headless CMS using Next.js and WordPress REST APIs, cutting content publishing time by 65% and encapsulating logic into 10+ reusable components adopted across product teams.

**Meraki Hair & Medi-Spa** · Freelance Full Stack Developer · Apr – Sept 2025

- Shipped a React/Next.js platform with SSR; doubled appointment bookings and increased session duration 2.3× within 60 days of launch.
