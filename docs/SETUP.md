# Setup and deployment

## Vercel web demo

1. Upload the repository to GitHub.
2. In Vercel, import that repository and select **Other** as the framework if asked.
3. Use Node 22, install command `npm ci`, build command `npm run build:web`, and output directory `dist` (also set in `vercel.json`).
4. Leave environment variables unset to run fictional demo mode. Deploy when ready.

This publishes the web client only. It does not deploy the Firebase backend, register real riders, or create mobile-store apps. A Vercel deployment was not performed on your behalf.

## Local Firebase emulator mode

Install Java compatible with your Firebase emulator. Then:

```bash
npm ci
npm ci --prefix functions
npm --prefix functions run build
npm run emulators
```

Keep that terminal running. In another terminal at the repository root:

```bash
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 npm run seed
```

Copy `.env.example` to `.env`, enable its Firebase settings, and set `EXPO_PUBLIC_DATA_MODE=firebase`. Restart with `npx expo start --clear --web`. Sign in with `dispatcher@bts.test`, `driver@bts.test`, `parent@bts.test`, or `student@bts.test`. Emulator-only password: `DemoOnly123!`.

The seeder refuses to run unless both emulator hosts exactly match localhost. It creates today's fictional trip. Reseeding resets today's demo records; use an empty emulator for a fresh session. The app has no user signup or public role assignment.

For a physical device, configure the emulator's host binding and the client host to an accessible development-machine address on a trusted network. The localhost defaults only work in a browser on the development machine. Native auth is session-only in this MVP.

## Your own Firebase project (optional)

1. Create a Firebase project and register a web app. Enable Email/Password Authentication and Firestore.
2. Put the web app's public configuration in `.env` using the variable names from `.env.example`; set mode to `firebase` and emulator mode to `false`.
3. Install the functions dependencies and authenticate the Firebase CLI.
4. Review and deploy with `npx firebase deploy --project YOUR_PROJECT_ID --only firestore,functions`. Cloud Functions deployment may require billing.
5. Through trusted Admin SDK tooling, create accounts and assign a custom `role` claim: `dispatcher`, `driver`, `parent`, or `student`. Never allow users to set this claim themselves.
6. Provision routes, trips, and rides using the schema in `ARCHITECTURE.md`. Add the correct account IDs to membership arrays. Include only each rider's driver, guardians, and own student account on a ride.
7. Add your web domain to Authentication's authorized domains. Set the same public environment values in Vercel and rebuild the client.

There is intentionally no production seeder with public demo passwords. Never put service-account JSON or admin credentials in Expo variables, Vercel client variables, or GitHub. Firebase web configuration is public; authorization relies on rules and server-side checks.

Before real use, add App Check, abuse controls, monitoring, tested backups/retention, and a controlled enrollment process. Membership snapshots must be updated together during reassignment or access revocation. The current UI does not manage these operations.

## Official references

- [Expo web publishing and Vercel](https://docs.expo.dev/guides/publishing-websites/)
- [Expo Firebase integration](https://docs.expo.dev/guides/using-firebase/)
- [Firebase callable functions](https://firebase.google.com/docs/functions/callable)
- [Firestore access rules](https://firebase.google.com/docs/firestore/security/rules-conditions)
