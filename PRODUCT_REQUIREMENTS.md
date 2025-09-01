Perfect 🚀 You’re essentially building a Slack → DB → Next.js Dashboard pipeline. Let’s write a Product Requirements Document (PRD) that is structured enough to drop into Cursor and start coding.

⸻

📄 Product Requirements Document (PRD)

Product: Client Health Dashboard
Type: MVP Hackathon Project
Timeframe: 20–30 hrs

⸻

1. Overview

The Client Health Dashboard provides agency account managers with visibility into client engagement and project status. Developers submit updates via Slack (per project channel). These updates are captured, stored in a database, and surfaced in a web dashboard where account managers can view client/project health at a glance.

This MVP focuses on:
 1. Slack integration for developer updates.
 2. Storing updates in a database.
 3. Next.js dashboard displaying projects and statuses.

⸻

2. Goals & Outcomes
 • Centralize updates: Instead of scattered Slack messages, capture structured updates.
 • Improve visibility: Account managers see health indicators across crypto, app, and commerce projects.
 • Enable quick triage: Flag risky projects (low/no updates, negative tone, overdue invoices in mock data).

⸻

3. User Roles
 1. Developer
 • Posts update in Slack channel (e.g., #project-crypto-wallet).
 • Update includes text like: “Finished sprint tasks, blockers with API.”
 2. Account Manager
 • Logs into web dashboard.
 • Sees a list of all projects they manage.
 • Views latest updates, project health (Green / Yellow / Red).
 3. Admin (optional for MVP)
 • Configures Slack app installation.
 • Manages project-to-channel mapping.

⸻

4. Core Features (MVP Scope)

A. Slack → Database Integration
 • Create a Slack app with:
 • Bot user, chat:write, channels:history (read messages), commands.
 • Event subscription: listen to messages in project channels.
 • Extract:
 • Channel ID (maps to project).
 • User ID (developer).
 • Message text.
 • Timestamp.
 • Store update in database.

B. Database
 • Schema (Postgres via Prisma recommended):
 • Projects
 • id, name, slack_channel_id, vertical (crypto/app/commerce).
 • Updates
 • id, project_id, user_id, text, created_at.
 • Users (optional for MVP, can store slack user_id).

C. Dashboard (Next.js App Router + ShadCN + Tailwind)
 • Authentication (simple NextAuth or skip for MVP).
 • Projects list view:
 • Project Name
 • Vertical
 • Latest Update (snippet)
 • Health Status (G / Y / R)
 • Project detail view:
 • Timeline of updates from Slack.
 • Health status logic.

D. Health Status Logic (MVP rules, can hardcode/expand later)
 • Green: Update posted in last 2 days.
 • Yellow: Last update 3–5 days ago.
 • Red: No update in >5 days OR update contains “blocker,” “delay,” “issue.”

⸻

5. Non-Goals (Out of MVP Scope)
 • Complex NLP analysis (only simple keyword rules).
 • Real invoice integration (mock overdue invoices with static data).
 • Multi-tenant setup (assume one agency).

⸻

6. Tech Stack
 • Frontend: Next.js (App Router) + ShadCN UI + Tailwind CSS.
 • Backend: Next.js API routes (for Slack event handling).
 • Database: Postgres (Supabase or Neon free tier) + Prisma ORM.
 • Slack Integration: Custom Slack App + Events API → Next.js webhook.
 • Hosting: Vercel (Next.js), Supabase/Neon (DB).

⸻

7. Rough Flow
 1. Setup
 • Admin installs Slack app, configures channel mapping.
 2. Updates Flow
 • Developer posts in Slack channel: “Finished sprint tasks, API blocker.”
 • Slack → Event Subscription → Next.js API endpoint (/api/slack/events).
 • Save to DB with project mapping.
 3. Dashboard Flow
 • Account Manager opens dashboard.
 • Fetch projects + last update from DB.
 • Render health status badge.
 • Click project → see update history.

⸻

8. Example UI (ShadCN components)
 • Project List (Table):

Project Name Vertical Last Update Health
Crypto Wallet Crypto “API blocker yesterday” 🔴 Red
Mobile App V2 App “Finished sprint backlog” 🟢 Green

 • Project Detail:
 • Timeline of Slack updates (message + timestamp + user).

⸻

9. Milestones
 1. Day 1–2: Slack app setup + Next.js API route to capture messages.
 2. Day 2–3: DB schema + Prisma + insert/update logic.
 3. Day 3–4: Dashboard UI (list + detail views).
 4. Day 5: Health logic + polish + deploy to Vercel.

⸻

10. Stretch Ideas (if time permits)
 • Sentiment analysis of updates (positive/negative).
 • Integrate Jira/GitHub for extra signals.
 • Simple email/slack alerts for Red projects.

⸻

⚡ This PRD is enough for Cursor to scaffold:
 • Slack integration endpoint
 • Prisma schema
 • Next.js routes + ShadCN dashboard

⸻

Do you want me to write the actual Next.js + Prisma starter code structure (so you can copy into Cursor), or just keep it high-level for now?
