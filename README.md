# Orbit Calendar AI — Teamie case prototype

An AI-native business calendar prototype built with Next.js. It connects to a real Google Calendar after OAuth consent and demonstrates calendar-aware assistance.

## Product thesis

Business users do not need another calendar that only displays events. They need a calendar that actively helps them manage attention:

1. **Understand the day** — view the week and upcoming events in one glance.
2. **Protect focus** — ask the assistant to identify time for deep work and meeting buffers.
3. **Reduce scheduling friction** — create calendar events without leaving the workspace.
4. **Keep users in control** — AI suggests; users review and confirm calendar changes.

## Features in this prototype

- Google sign-in with OAuth consent.
- Google Calendar event list for a selected time range.
- Create an event in the user's primary calendar.
- Week and agenda views, mini calendar, event search.
- Calendar-aware assistant endpoint. Add `OPENAI_API_KEY` for natural-language responses; without it, the app uses a small local demo planner.
- Server-side Google API access. OAuth credentials are not exposed through the client session.

## Stack

- Next.js 14 App Router / React / TypeScript
- NextAuth v4 Google provider
- `googleapis` Calendar API
- OpenAI SDK (optional)
- Tailwind CSS + custom responsive CSS

## Run locally

### 1. Install

```bash
npm install
cp .env.example .env.local
```

Generate a secure secret:

```bash
openssl rand -base64 32
```

Set the result as `NEXTAUTH_SECRET` in `.env.local`.

### 2. Configure Google OAuth

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create/select a project and enable **Google Calendar API**.
3. Configure OAuth consent screen. For a testing app, add your Google account as a test user.
4. Create an OAuth Client ID of type **Web application**.
5. Add authorized redirect URI:

   `http://localhost:3000/api/auth/callback/google`

6. Copy the client ID and secret into `.env.local`.

For deployment, set `NEXTAUTH_URL` to your production origin and add the matching production callback URL to Google Cloud Console.

### 3. Optional AI

Set `OPENAI_API_KEY` and `OPENAI_MODEL` in `.env.local` to enable the OpenAI-powered assistant. If no key is present, the app remains usable with its local assistant demo.

### 4. Start

```bash
npm run dev
```

Open `http://localhost:3000` and sign in with Google.

## API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/events?start=...&end=...` | List primary calendar events |
| POST | `/api/events` | Create an event |
| PATCH | `/api/events/:eventId` | Patch an event (backend route available) |
| DELETE | `/api/events/:eventId` | Delete an event (backend route available) |
| POST | `/api/freebusy` | Query free/busy information |
| POST | `/api/assistant` | Calendar-aware AI/local assistant |

## Important limitations / production hardening

- Google OAuth consent and publishing may require verification for broad external use. Calendar scopes are sensitive/restricted; follow Google's current OAuth verification requirements.
- This prototype uses the primary calendar and does not yet support selecting multiple calendars.
- The UI is a compact weekly/agenda prototype, not a full drag-and-drop calendar grid.
- Event creation is implemented; event edit/delete APIs exist but are not wired to UI controls yet.
- Free/busy API is provided but AI slot ranking is a prototype, not a full scheduling optimizer.
- Token refresh behavior relies on the Google OAuth client and the stored refresh token. Production systems should implement robust refresh-token rotation, revoked-token handling, and secure server-side token storage.
- Add rate limiting, request validation (e.g. Zod), audit logging, CSRF/security review, error monitoring, and tests before production use.
- Avoid sending sensitive event descriptions to an AI provider without clear user consent. The assistant sends a bounded list of event summaries/times as context when the user asks a question.

See [`CASE-STUDY.md`](./CASE-STUDY.md) for the product thought process, prioritization, demo narrative, and success metrics.

## Demo flow for the case round

1. Sign in with Google and show a real calendar week.
2. Explain the pain: calendars store time but do not actively optimize it.
3. Ask the assistant: **“How busy am I today?”**
4. Ask: **“Help me protect focus time.”**
5. Create a short event and show it syncs to Google Calendar.
6. Close with the product principle: **AI recommends, the user approves.**

## Architecture

```text
Browser (Next.js UI)
   ├── NextAuth Google OAuth
   ├── /api/events ──────────────┐
   ├── /api/freebusy ────────────┼── Next.js server
   └── /api/assistant ────────────┘      ├── OAuth token from encrypted JWT cookie
                                        ├── Google Calendar API
                                        └── Optional OpenAI API
```
