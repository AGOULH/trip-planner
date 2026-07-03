# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — production build (also the quickest way to catch JSX/syntax errors)
- `npm run preview` — serve the production build locally
- `npm run lint` — run oxlint (config: `.oxlintrc.json`)

There is no test suite configured.

## Architecture

This is a client-only Vite + React app (no backend) that generates family trip plans by calling the
Google Gemini API (`generateContent`) directly from the browser. It originally used the Anthropic API;
it was switched to Gemini because Gemini has a genuinely free tier and Anthropic does not.

**Data flow:** `TripForm` collects trip details → `App.jsx` calls `generateTripPlan()` in
`src/services/gemini.js` → the parsed plan object is passed to `ResultView`, which renders it across
six tabs (each tab is a dumb component in `src/components/tabs/` that just reads its slice of the plan).

**Structured output via forced function calling:** `src/services/gemini.js` does not ask Gemini for JSON
in prose and parse it. It defines a single function (`submit_trip_plan`) with a full `parameters` schema
covering flights, visas, accommodation, itinerary, budget, and tips, and sets
`toolConfig.functionCallingConfig.mode: 'ANY'` (restricted to `allowedFunctionNames:
['submit_trip_plan']`) to force the model to call it. The response is read from
`candidates[0].content.parts[].functionCall.args`. If you need to change what the plan contains, edit
`TRIP_PLAN_FUNCTION.parameters` in that file — the UI components in `components/tabs/` expect their props
to match that schema shape exactly, so schema changes and tab components must be updated together.

Note the Gemini REST API's JSON field names are camelCase (`functionDeclarations`, `toolConfig`,
`functionCallingConfig`, `allowedFunctionNames`) — unlike Anthropic's snake_case convention. Google's API
silently ignores unrecognized fields instead of erroring, so a casing mistake here doesn't fail the
request — it just makes Gemini fall back to replying in plain text with no `functionCall` part, which is a
confusing failure mode to debug (this happened once; see git history).

**API key handling:** there is no backend, so the user's own Gemini API key (from
aistudio.google.com/apikey) is entered in `ApiKeySetup`, persisted to `localStorage`
(`trip_planner_gemini_api_key`), and sent directly from the browser as a `key` query param on the
`generateContent` request. This is an intentional client-only design for personal/single-user use, not an
oversight — do not "fix" it by silently routing key handling elsewhere without flagging the tradeoff to
the user.

**Static data:** `src/data/destinations.js` holds 20 popular destinations (city, country, IATA airport
code/name) used only as `<datalist>` autocomplete suggestions in `TripForm` — the destination field itself
is free text (`trip.destination`), not restricted to this list, so the model receives whatever the user
typed. `src/data/nationalities.js` holds the nationality list used for adults (with an "أخرى" / other
option that reveals a free-text input in `TripForm`). Children only take an age, no nationality — visas
are generated per unique adult nationality only.

**Budget tab interactivity:** `components/tabs/BudgetTab.jsx` adds a checkbox per budget line so the user
can toggle items on/off and see a live-recalculated "إجمالي البنود المفعّلة" total, separate from the
AI-provided `budget.total`. Amounts from the model are free-text strings (e.g. `"400-600"`), so
`parseAmount()` extracts number(s) and averages ranges; unparsable amounts are excluded from the live total
and flagged with a note. Checkbox state resets whenever a new `budget` object is passed in (new plan
generated).

**Model:** `DEFAULT_MODEL` in `src/services/gemini.js` is `gemini-2.5-flash` (the original `gemini-2.0-flash`
was deprecated and shut down by Google on 2026-06-01, which surfaced as a `limit: 0` quota error unrelated
to actual usage — if a similar error recurs, check whether the configured model has been retired before
assuming it's a billing/quota problem).

**RTL/Arabic:** the whole UI is Arabic-first RTL (`index.html` sets `lang="ar" dir="rtl"`). All user-facing
strings, including data files and prompt text sent to the model, should stay in Arabic to match.

## Deployment

Deployed to GitHub Pages via `.github/workflows/deploy.yml`, which builds with `npm run build` and
publishes `dist/` on every push to `main`. `vite.config.js` sets `base: '/trip-planner/'` to match the
project-pages URL path — if the repo is ever renamed, that `base` must be updated to match.
