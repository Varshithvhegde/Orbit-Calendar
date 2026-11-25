# Teamie Case Round — Product Thought Process

## Reframe the problem

A calendar is usually a passive database of time. Business users need help making decisions about time: what deserves attention, when collaboration is possible, and how to protect uninterrupted work.

**Product opportunity:** Move from *calendar management* to *time management*.

## Target user

A knowledge worker with a meeting-heavy day: engineering lead, product manager, customer-facing teammate, or individual contributor coordinating across teams.

## Core user pain points

1. Meetings fragment focus time.
2. Finding a suitable slot requires checking several calendars and messaging people.
3. Users have to manually interpret whether a day is overloaded.
4. Context switching between calendar, chat, and task tools creates friction.

## Product hypothesis

If the calendar understands the user's schedule and offers context-aware, explainable actions, users will spend less time managing meetings and more time doing meaningful work.

## MVP prioritization

| Priority | Capability | Why it matters |
|---|---|---|
| P0 | Google sign-in + real calendar read | Prototype must be credible, not a static mock |
| P0 | Event creation | Demonstrates a complete user action |
| P0 | Week + agenda views | Familiar baseline and schedule awareness |
| P1 | Calendar-aware assistant | Shows AI-native value |
| P1 | Focus-time and meeting-slot suggestions | Directly addresses business-user pain |
| P2 | Multi-calendar support, drag/drop, team scheduling | Valuable but not necessary to validate the first hypothesis |

## UX principles

- **AI should be contextual:** use calendar events, not a generic chat prompt.
- **AI should be actionable:** recommendations should lead to an event or a next step.
- **Human-in-the-loop:** the assistant proposes; the user confirms before calendar changes.
- **Progressive disclosure:** show the calendar first, assistant second; keep the main task visible.
- **Trust by design:** explain that event data is sent to an AI provider only when using the AI endpoint; avoid silent changes.

## Demo narrative (3–4 minutes)

1. **Set the scene:** “Calendars tell us where our time went, but rarely help us decide where it should go.”
2. Sign in and show real Google Calendar events.
3. Ask “How busy am I today?” and show the schedule summary.
4. Ask “Help me protect focus time.” Explain the assistant's recommendation.
5. Create an event and show it syncs to Google Calendar.
6. Close: “Orbit turns calendar from a passive schedule into a proactive time-management copilot. AI recommends, the user approves.”

## Success metrics

- **North-star:** weekly users who accept at least one calendar improvement suggestion.
- Activation: connect Google Calendar and complete one meaningful action in first session.
- Efficiency: time to create a meeting; time to find a meeting slot.
- Quality: percentage of suggested slots accepted; conflict rate after scheduling.
- User outcome: protected focus hours per week; self-reported schedule control.
- Guardrails: accidental event changes, OAuth disconnect rate, AI suggestion rejection, privacy complaints.

## Tradeoffs and limitations

- This MVP uses the user's primary calendar and a compact week/agenda layout.
- The assistant is a lightweight planning demo, not an autonomous scheduling agent.
- A production version should add multi-calendar free/busy, attendee availability, timezone-aware ranking, working hours, meeting preferences, focus-block insertion, undo, and audit history.
- Calendar content is sensitive. Production AI should minimize context, obtain clear consent, and avoid using event descriptions unless needed.

## Next iteration

1. Use Google FreeBusy to identify candidate gaps.
2. Rank slots by working hours, meeting buffers, focus windows, and user preferences.
3. Present 2–3 explainable options (“best fit”, “earliest”, “least context switching”).
4. Let the user approve one option; create the event and provide undo.
5. Learn from accept/reject signals without silently changing the calendar.
