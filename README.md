# BTS Connect

**A React Native / Expo prototype for clearer school-bus journeys.** Drivers follow an ordered stop list, families see recorded pickup/drop-off confirmations, and dispatchers publish service updates directly to assigned users.

Inspired by a former regional-program student's experience with paper directions and parent-only email updates. This is an independent, AI-assisted portfolio implementation, not an official Bus to School product or a deployed operator system. All included riders and routes are fictional. No 50,000-rider scale or performance claim has been validated.

## Features

- Dispatcher, driver, parent, and student workspaces.
- Ordered route stops with external Google Maps directions links.
- Start/complete trip workflows and pickup, drop-off, and absence recording.
- Invalid transitions and duplicate attendance actions rejected.
- Route-specific in-app delay, cancellation, and general notices with date ranges.
- Recorded journey-duration summary and attendance CSV export.
- Local demo persistence, role switching, and reset.
- Optional Firebase Authentication, Firestore subscriptions, and Node.js callable backend with role and assignment checks.

## Run the demo

Use Node.js 22.13+ (Node 22 recommended), npm, and a modern browser.

```bash
npm ci
npm run web
```

No Firebase account, API key, or database is needed for demo mode. Expo opens the web app. For mobile, run `npm start` and use a compatible Expo Go version or a development build. iOS and Android device behavior still needs testing.

### Try the complete workflow

1. Choose **Driver**, then **Open route** and **Start trip**.
2. Pick up Alex, then switch to **Parent** to see the timestamped confirmation.
3. Switch back to Driver and drop Alex off. Mark the remaining fictional riders absent to complete the trip.
4. Choose **Dispatcher → Updates**. Publish a delay notice for today's dates.
5. Switch to Parent or Student; the notice appears in the same device's demo feed.
6. In Dispatcher → Reports, export the attendance CSV.
7. Use **Reset fictional demo** to begin again.

Demo changes stay on the current device; different devices do not synchronize. Firebase mode supplies shared backend data. Directions open a map service; this version does not track live location or optimize routes.

## Stack

**Client:** TypeScript, React Native, Expo, React Native Web, AsyncStorage.  
**Backend:** Node.js, Firebase Auth, Firestore, Firebase callable Cloud Functions.  
**Verification:** TypeScript, Node test runner, Firestore rules tests, Playwright.  
**Hosting:** Vercel configuration for the exported web app; Firebase hosts the backend separately.

## Firebase and Vercel

See [SETUP.md](docs/SETUP.md) for emulator accounts, Firebase provisioning, and Vercel instructions. See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for the data model and tradeoffs.

## Checks

```bash
npm run check
npm ci --prefix functions
npm --prefix functions run build
npm run build:web
# Requires Java and a downloadable Firestore emulator:
npm run test:rules
# Requires Playwright Chromium:
npx playwright install chromium
npm run test:e2e
```

See [VALIDATION.md](docs/VALIDATION.md) for what was actually verified in the build environment.

## Scope and next steps

This MVP uses provisioned routes and accounts. Route editing, substitute-driver assignment UI, PM route generation, account enrollment, push/SMS delivery, GPS tracking, offline event synchronization, and automatic dispatch cancellation are future work. A cancellation notice is a communication record, not a change to the trip state.

Firebase reads are capped at 200 documents per collection per session, filtered by membership for non-dispatchers. Reports describe loaded records only. This keeps the prototype bounded but is not production pagination or a scalability benchmark. Before a real pilot, implement trip/date queries, retention policies, correction workflows, stronger deployment hardening, and operator-approved routes. Do not upload real children's data to the public demo.

## GitHub upload

Create `bts-connect`, leave “Add a README” unchecked, and upload the **contents** of this extracted folder. Keep `README.md`, `package.json`, and the configuration files at the repository root. Do not upload the ZIP itself or `node_modules`.

Suggested description: **React Native and Firebase school transportation prototype with driver routes, timestamped attendance, family updates, and operations reporting.**

The repository includes configuration files that GitHub Desktop will include automatically. `docs/SETUP.md` explains environment setup; no private credentials are included.
