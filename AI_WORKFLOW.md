# AI Workflow Note

## Tools Used
- **Antigravity (Google DeepMind)** — Main IDE and orchestration agent.
- **Gemini 2.0 Flash & Gemini 1.5 Pro** — Core models used for architecture, logic, and UI refinement.
- **Supabase AI Advisor** — Identified critical security vulnerabilities in the database functions.

## Where AI Materially Sped Up Work
- **UI Transformation**: Rapidly converted a generic "AI-styled" dashboard into a high-performance, minimalist, Notion-inspired interface.
- **Prisma Schema & Migrations**: Generated the full collaborative document model and handled the transition from SQLite to PostgreSQL.
- **Bug Squashing**: Automatically identified and fixed syntax errors (like unescaped apostrophes) across multiple documentation pages.
- **Feature Boilerplate**: Quickly generated the Supabase SSR utility functions and middleware.

## Human-in-the-Loop Decisions
- **Design Philosophy**: Shifted away from heavy glassmorphism and pulsing gradients (AI defaults) towards a "Linear-inspired" clean aesthetic for better professional appeal.
- **Mock vs. Real Auth**: Chose to stick with a robust mock-header auth for the demo to ensure zero friction for reviewers, while setting up the Supabase SDK for future production auth.
- **Error Handling**: Custom-wrapped Tiptap JSON parsing to prevent crashes when loading corrupted or legacy document data.

## Verification Process
- Used automated Vitest integration tests for API routes.
- Manual end-to-end testing of the "Share" and "Switch User" flows to ensure data isolation.
- Verified mobile responsiveness and dark mode contrast ratios.
