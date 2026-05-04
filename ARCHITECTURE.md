# Architecture Notes

## Stack
- Next.js 14 (App Router) — unified frontend + API in one repo
- Tiptap — rich text editor with built-in bold/italic/underline/headings/lists
- Prisma + SQLite (local) / Postgres (production)
- Tailwind CSS — utility-first styling

## What I Prioritized
1. Core editing experience — Tiptap with all required formatting options
2. Auto-save — 1.5s debounce, transparent to the user
3. Clean sharing model — owner/shared distinction is visible everywhere
4. Error handling — every API route returns structured errors

## What I Cut and Why
- Real authentication: Replaced with mock user switcher. Saves ~2 hours. Sufficient for demo.
- .docx upload: Requires mammoth.js + complex HTML→Tiptap conversion. Not worth the risk for timebox.
- Real-time collaboration: Out of scope. Would require WebSockets (Socket.io or Liveblocks).
- Role-based permissions: All shared users get edit access. Viewer vs editor would be a natural next step.

## Data Model
User → owns many Documents
Document → has many Shares
Share → links one Document to one User (unique constraint prevents duplicates)

## What I'd Build Next
- NextAuth.js for real authentication
- Viewer vs Editor permission levels on shares
- Document version history
- Export to PDF
- Real-time presence indicators
