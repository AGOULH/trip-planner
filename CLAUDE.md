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
`tool_config.function_calling_config.mode: 'ANY'` (restricted to `allowed_function_names:
['submit_trip_plan']`) to force the model to call it. The response is read from
`candidates[0].content.parts[].functionCall.args`. If you need to change what the plan contains, edit
`TRIP_PLAN_FUNCTION.parameters` in that file — the UI components in `components/tabs/` expect their props
to match that schema shape exactly, so schema changes and tab components must be updated together.

**API key handling:** there is no backend, so the user's own Gemini API key (from
aistudio.google.com/apikey) is entered in `ApiKeySetup`, persisted to `localStorage`
(`trip_planner_gemini_api_key`), and sent directly from the browser as a `key` query param on the
`generateContent` request. This is an intentional client-only design for personal/single-user use, not an
oversight — do not "fix" it by silently routing key handling elsewhere without flagging the tradeoff to
the user.

**Static data:** `src/data/destinations.js` holds the 20 selectable destinations (city, country, IATA
airport code/name — used both for the form dropdown and inside the prompt sent to the model).
`src/data/nationalities.js` holds the nationality list used for adults (with an "أخرى" / other option that
reveals a free-text input in `TripForm`). Children only take an age, no nationality — visas are generated
per unique adult nationality only.

**Model:** `DEFAULT_MODEL` in `src/services/gemini.js` is `gemini-2.0-flash`. If Google renames/retires the
free-tier model, update that one constant.

**RTL/Arabic:** the whole UI is Arabic-first RTL (`index.html` sets `lang="ar" dir="rtl"`). All user-facing
strings, including data files and prompt text sent to the model, should stay in Arabic to match.

## Deployment

Deployed to GitHub Pages via `.github/workflows/deploy.yml`, which builds with `npm run build` and
publishes `dist/` on every push to `main`. `vite.config.js` sets `base: '/trip-planner/'` to match the
project-pages URL path — if the repo is ever renamed, that `base` must be updated to match.
